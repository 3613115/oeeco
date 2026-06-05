import {
  categoryLabels,
  creators,
  getWork,
  getWorkCuration,
  isCategoryId,
  type CategoryId,
  type Creator,
  type Work,
  type WorkCuration,
  works as seedWorks,
} from "@/lib/data";
import { getSupabaseAdminClient, getSupabasePublicServerClient } from "@/lib/supabase-server";

type WorkRow = {
  id: string;
  creator_id: string;
  title: string;
  summary: string;
  description: string | null;
  category: string;
  cover_url: string | null;
  demo_url: string | null;
  tool_stack: string | null;
  status: string;
  views_count: number | null;
  likes_count: number | null;
  collections_count: number | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

type TagRow = {
  work_id: string;
  tag: string;
};

export type AdminWorkStatus = "pending" | "published" | "rejected" | "hidden";

export type AdminWork = Work & {
  status: AdminWorkStatus;
};

export type AdminWorkUpdate = {
  title: string;
  summary: string;
  description: string;
  category: Exclude<CategoryId, "all">;
  coverUrl: string | null;
  demoUrl: string | null;
  toolStack: string;
  tags: string[];
};

export type AdminWorkCurationUpdate = {
  featured: boolean;
  rank: number | null;
  label: string | null;
};

const CURATION_FEATURED_TAG = "oeeco:featured";
const CURATION_RANK_PREFIX = "oeeco:rank:";
const CURATION_LABEL_PREFIX = "oeeco:label:";

export async function getHomeWorks() {
  const published = await getPublishedWorks();
  return sortHomeWorks([...published, ...seedWorks]);
}

export async function getAllPublicWorks() {
  const worksById = new Map((await getHomeWorks()).map((work) => [work.id, work]));
  return Array.from(worksById.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getPublicWorksByCategory(category: Exclude<CategoryId, "all">) {
  const publicWorks = await getAllPublicWorks();
  return publicWorks.filter((work) => work.category === category);
}

export async function getPublicWorksByCreator(creatorId: string) {
  const publicWorks = await getAllPublicWorks();
  return publicWorks.filter((work) => work.creatorId === creatorId);
}

export async function getPublicCreator(creatorId: string) {
  if (creators[creatorId]) return creators[creatorId];

  const publicWorks = await getAllPublicWorks();
  return publicWorks.find((work) => work.creatorId === creatorId)?.creator || null;
}

export async function getPublishedWorks() {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(48);

  if (error || !data?.length) return [];

  return hydrateWorks(data as WorkRow[]);
}

export async function getPublicWork(id: string) {
  const seed = getWork(id);
  if (seed) return seed;

  const supabase = getSupabasePublicServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  const [work] = await hydrateWorks([data as WorkRow]);
  return work || null;
}

export async function getAdminWorks(status: AdminWorkStatus = "pending") {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];

  const rows = data as WorkRow[];
  const hydrated = await hydrateWorks(rows, true);
  return hydrated.map((work, index) => ({
    ...work,
    status: rows[index].status as AdminWorkStatus,
  }));
}

export async function getAdminWorkCounts() {
  const supabase = getSupabaseAdminClient();
  const empty: Record<AdminWorkStatus, number> = {
    pending: 0,
    published: 0,
    rejected: 0,
    hidden: 0,
  };

  if (!supabase) return empty;

  const rows = await Promise.all(
    (Object.keys(empty) as AdminWorkStatus[]).map(async (status) => {
      const { count } = await supabase
        .from("works")
        .select("id", { count: "exact", head: true })
        .eq("status", status);

      return [status, count || 0] as const;
    }),
  );

  return Object.fromEntries(rows) as Record<AdminWorkStatus, number>;
}

export async function updateAdminWorkStatus(id: string, status: AdminWorkStatus) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, message: "Supabase admin key is not configured." };
  }

  const { error } = await supabase.from("works").update({ status }).eq("id", id);

  return {
    ok: !error,
    message: error?.message || "Status updated.",
  };
}

export async function updateAdminWorkDetails(id: string, input: AdminWorkUpdate) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, message: "Supabase admin key is not configured." };
  }

  const { error } = await supabase
    .from("works")
    .update({
      title: input.title,
      summary: input.summary,
      description: input.description,
      category: input.category,
      cover_url: input.coverUrl,
      demo_url: input.demoUrl,
      tool_stack: input.toolStack,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  const { data: existingTags } = await supabase.from("work_tags").select("tag").eq("work_id", id);
  const curationTags = ((existingTags as Array<{ tag: string }> | null) || [])
    .map((row) => row.tag)
    .filter(isCurationTag);

  const { error: deleteError } = await supabase.from("work_tags").delete().eq("work_id", id);
  if (deleteError) {
    return { ok: false, message: deleteError.message };
  }

  const nextTags = dedupeTags([...input.tags, ...curationTags]);
  if (nextTags.length) {
    const { error: tagError } = await supabase.from("work_tags").insert(
      nextTags.map((tag) => ({
        work_id: id,
        tag,
      })),
    );

    if (tagError) {
      return { ok: false, message: tagError.message };
    }
  }

  return { ok: true, message: "Work details saved." };
}

export async function updateAdminWorkCuration(id: string, input: AdminWorkCurationUpdate) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, message: "Supabase admin key is not configured." };
  }

  const { data: existingTags, error: readError } = await supabase.from("work_tags").select("tag").eq("work_id", id);
  if (readError) {
    return { ok: false, message: readError.message };
  }

  const displayTags = ((existingTags as Array<{ tag: string }> | null) || [])
    .map((row) => row.tag)
    .filter((tag) => !isCurationTag(tag));
  const nextTags = dedupeTags([...displayTags, ...buildCurationTags(input)]);

  const { error: deleteError } = await supabase.from("work_tags").delete().eq("work_id", id);
  if (deleteError) {
    return { ok: false, message: deleteError.message };
  }

  if (nextTags.length) {
    const { error: insertError } = await supabase.from("work_tags").insert(
      nextTags.map((tag) => ({
        work_id: id,
        tag,
      })),
    );

    if (insertError) {
      return { ok: false, message: insertError.message };
    }
  }

  return { ok: true, message: "Curation saved." };
}

async function hydrateWorks(rows: WorkRow[], useAdmin = false): Promise<Work[]> {
  if (!rows.length) return [];

  const supabase = useAdmin ? getSupabaseAdminClient() : getSupabasePublicServerClient();
  if (!supabase) return [];

  const workIds = rows.map((row) => row.id);
  const creatorIds = Array.from(new Set(rows.map((row) => row.creator_id)));

  const [{ data: profiles }, { data: tags }] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name, avatar_url, bio").in("id", creatorIds),
    supabase.from("work_tags").select("work_id, tag").in("work_id", workIds),
  ]);

  const profilesById = new Map((profiles as ProfileRow[] | null)?.map((profile) => [profile.id, profile]));
  const tagsByWorkId = new Map<string, string[]>();

  for (const tag of (tags as TagRow[] | null) || []) {
    const current = tagsByWorkId.get(tag.work_id) || [];
    current.push(tag.tag);
    tagsByWorkId.set(tag.work_id, current);
  }

  return rows.map((row) => {
    const category = isCategoryId(row.category) ? row.category : "ai";
    const profile = profilesById.get(row.creator_id);
    const rawTags = tagsByWorkId.get(row.id) || ["oeeco"];
    const curation = parseCurationTags(rawTags);
    const displayTags = rawTags.filter((tag) => !isCurationTag(tag));
    const creator: Creator = {
      id: row.creator_id,
      name: profile?.display_name || profile?.username || "oeeco creator",
      handle: profile?.username ? `@${profile.username}` : "@creator",
      avatar: profile?.avatar_url || creators.neo.avatar,
      bio: profile?.bio || "oeeco creator",
      followers: "new creator",
    };

    return {
      id: row.id,
      title: row.title,
      type: categoryLabels[category],
      category,
      creatorId: row.creator_id,
      creator,
      cover: row.cover_url || "/assets/cover-upload.png",
      tags: displayTags.length ? displayTags : ["oeeco"],
      views: row.views_count || 0,
      likes: row.likes_count || 0,
      collections: row.collections_count || 0,
      tool: row.tool_stack || "Codex",
      createdAt: row.created_at.slice(0, 10),
      summary: row.summary,
      detail: row.description || row.summary,
      demoUrl: row.demo_url,
      curation,
      comments: [],
      frame: "upload",
    };
  });
}

function sortHomeWorks(works: Work[]) {
  return [...works].sort((a, b) => {
    const aCuration = getWorkCuration(a);
    const bCuration = getWorkCuration(b);

    if (aCuration.featured !== bCuration.featured) {
      return bCuration.featured ? 1 : -1;
    }

    const aRank = aCuration.rank ?? Number.POSITIVE_INFINITY;
    const bRank = bCuration.rank ?? Number.POSITIVE_INFINITY;
    if (aRank !== bRank) return aRank - bRank;

    const aScore = a.likes + a.views * 0.08;
    const bScore = b.likes + b.views * 0.08;
    if (aScore !== bScore) return bScore - aScore;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function parseCurationTags(tags: string[]): WorkCuration {
  const rankTag = tags.find((tag) => tag.startsWith(CURATION_RANK_PREFIX));
  const labelTag = tags.find((tag) => tag.startsWith(CURATION_LABEL_PREFIX));
  const rank = rankTag ? Number.parseInt(rankTag.slice(CURATION_RANK_PREFIX.length), 10) : Number.NaN;

  return {
    featured: tags.includes(CURATION_FEATURED_TAG),
    rank: Number.isFinite(rank) && rank > 0 ? rank : null,
    label: labelTag ? labelTag.slice(CURATION_LABEL_PREFIX.length).trim() || null : null,
  };
}

function buildCurationTags(input: AdminWorkCurationUpdate) {
  const tags: string[] = [];
  if (input.featured) tags.push(CURATION_FEATURED_TAG);
  if (input.rank) tags.push(`${CURATION_RANK_PREFIX}${String(input.rank).padStart(3, "0")}`);
  if (input.label) tags.push(`${CURATION_LABEL_PREFIX}${cleanCurationLabel(input.label)}`);
  return tags;
}

function cleanCurationLabel(label: string) {
  return label.trim().replace(/\s+/g, " ").slice(0, 19);
}

function isCurationTag(tag: string) {
  return (
    tag === CURATION_FEATURED_TAG ||
    tag.startsWith(CURATION_RANK_PREFIX) ||
    tag.startsWith(CURATION_LABEL_PREFIX)
  );
}

function dedupeTags(tags: string[]) {
  const seen = new Set<string>();
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.slice(0, 32))
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
