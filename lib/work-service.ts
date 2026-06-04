import {
  categoryLabels,
  creators,
  getWork,
  isCategoryId,
  type Creator,
  type Work,
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

export type AdminWork = Work & {
  status: string;
};

export async function getHomeWorks() {
  const published = await getPublishedWorks();
  return [...published, ...seedWorks];
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

export async function getAdminWorks(status = "pending") {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];

  const hydrated = await hydrateWorks(data as WorkRow[], true);
  return hydrated.map((work, index) => ({
    ...work,
    status: (data[index] as WorkRow).status,
  }));
}

export async function updateAdminWorkStatus(id: string, status: "published" | "rejected" | "hidden") {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, message: "Supabase 管理密钥未配置。" };
  }

  const { error } = await supabase.from("works").update({ status }).eq("id", id);

  return {
    ok: !error,
    message: error?.message || "状态已更新。",
  };
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
    const creator: Creator = {
      id: row.creator_id,
      name: profile?.display_name || profile?.username || "oeeco creator",
      handle: profile?.username ? `@${profile.username}` : "@creator",
      avatar: profile?.avatar_url || creators.neo.avatar,
      bio: profile?.bio || "oeeco 创作者",
      followers: "新创作者",
    };

    return {
      id: row.id,
      title: row.title,
      type: categoryLabels[category],
      category,
      creatorId: row.creator_id,
      creator,
      cover: row.cover_url || "/assets/cover-upload.png",
      tags: tagsByWorkId.get(row.id) || ["oeeco"],
      views: row.views_count || 0,
      likes: row.likes_count || 0,
      collections: row.collections_count || 0,
      tool: row.tool_stack || "Codex",
      createdAt: row.created_at.slice(0, 10),
      summary: row.summary,
      detail: row.description || row.summary,
      demoUrl: row.demo_url,
      comments: [],
      frame: "upload",
    };
  });
}
