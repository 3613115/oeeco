import {
  AlertTriangle,
  Activity,
  ArrowDownUp,
  Check,
  ExternalLink,
  Eye,
  Link as LinkIcon,
  Monitor,
  RotateCcw,
  Save,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  Trophy,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminCopyButton } from "@/components/AdminCopyButton";
import { categories, categoryLabels, getWorkCuration, isCategoryId, type CategoryId } from "@/lib/data";
import { externalRunnerSandbox, getRunnerPolicy } from "@/lib/play-runner";
import { absoluteUrl } from "@/lib/site";
import {
  updateAdminWorkCuration,
  getAdminWorkCounts,
  getAdminWorks,
  type AdminWork,
  updateAdminWorkDetails,
  updateAdminWorkStatus,
  type AdminWorkStatus,
} from "@/lib/work-service";

export const dynamic = "force-dynamic";

const statusOptions: Array<{ id: AdminWorkStatus; label: string; helper: string }> = [
  { id: "pending", label: "Pending", helper: "New submissions waiting for review" },
  { id: "published", label: "Published", helper: "Visible on Explore" },
  { id: "rejected", label: "Rejected", helper: "Not visible to viewers" },
  { id: "hidden", label: "Hidden", helper: "Temporarily removed from Explore" },
];

const categoryOptions = categories.filter(
  (category): category is [Exclude<CategoryId, "all">, string] => category[0] !== "all",
);

type AdminSort = "newest" | "oldest" | "views" | "likes" | "ready" | "health";
type AdminHealthFilter = "all" | "attention" | "curated" | "featured";
type AdminQueueFilter = "all" | "ready" | "fixes" | "attention" | "home";

type AdminOverviewMetric = {
  label: string;
  value: string;
  helper: string;
  href: string;
  tone?: "good" | "warning";
};

type AdminGrowthStep = {
  label: string;
  ok: boolean;
  value: string;
  helper: string;
  href: string;
};

type AdminSeedCategory = {
  id: Exclude<CategoryId, "all">;
  label: string;
  liveCount: number;
  candidateCount: number;
  target: number;
  helper: string;
};

type AdminSeedWork = {
  id: string;
  title: string;
  status: AdminWorkStatus;
  category: string;
  score: number;
  label: string;
  helper: string;
  href: string;
};

type AdminContentSeedPlan = {
  liveCount: number;
  candidateCount: number;
  targetMin: number;
  targetMax: number;
  progress: number;
  categoryCoverage: AdminSeedCategory[];
  uploadSuggestions: string[];
  works: AdminSeedWork[];
};

type AdminFilters = {
  q: string;
  category: "all" | Exclude<CategoryId, "all">;
  sort: AdminSort;
  health: AdminHealthFilter;
  queue: AdminQueueFilter;
};

const sortOptions: Array<{ id: AdminSort; label: string }> = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "views", label: "Most views" },
  { id: "likes", label: "Most likes" },
  { id: "ready", label: "Review readiness" },
  { id: "health", label: "Health risk" },
];

const healthOptions: Array<{ id: AdminHealthFilter; label: string }> = [
  { id: "all", label: "All health states" },
  { id: "attention", label: "Needs attention" },
  { id: "curated", label: "Curated" },
  { id: "featured", label: "Featured" },
];

const queueOptions: Array<{ id: AdminQueueFilter; label: string }> = [
  { id: "all", label: "All queues" },
  { id: "ready", label: "Ready to publish" },
  { id: "fixes", label: "Needs fixes" },
  { id: "attention", label: "Live attention" },
  { id: "home", label: "Home lineup" },
];

function parseStatus(value: FormDataEntryValue | string | undefined | null): AdminWorkStatus {
  const next = String(value || "");
  return statusOptions.some((status) => status.id === next) ? (next as AdminWorkStatus) : "pending";
}

function parseSort(value: FormDataEntryValue | string | undefined | null): AdminSort {
  const next = String(value || "");
  return sortOptions.some((sort) => sort.id === next) ? (next as AdminSort) : "newest";
}

function parseHealthFilter(value: FormDataEntryValue | string | undefined | null): AdminHealthFilter {
  const next = String(value || "all");
  return healthOptions.some((health) => health.id === next) ? (next as AdminHealthFilter) : "all";
}

function parseQueueFilter(value: FormDataEntryValue | string | undefined | null): AdminQueueFilter {
  const next = String(value || "all");
  return queueOptions.some((queue) => queue.id === next) ? (next as AdminQueueFilter) : "all";
}

function parseFilterCategory(value: FormDataEntryValue | string | undefined | null): AdminFilters["category"] {
  const next = String(value || "all");
  if (next === "all") return "all";
  return isCategoryId(next) ? next : "all";
}

function getAdminFilters(input: { q?: string; category?: string; sort?: string; health?: string; queue?: string }): AdminFilters {
  return {
    q: (input.q || "").trim().slice(0, 120),
    category: parseFilterCategory(input.category),
    sort: parseSort(input.sort),
    health: parseHealthFilter(input.health),
    queue: parseQueueFilter(input.queue),
  };
}

function getAdminFilterParams(filters: AdminFilters) {
  const params: Record<string, string> = {
    sort: filters.sort,
  };

  if (filters.q) params.q = filters.q;
  if (filters.category !== "all") params.category = filters.category;
  if (filters.health !== "all") params.health = filters.health;
  if (filters.queue !== "all") params.queue = filters.queue;

  return params;
}

function getAdminFormContext(formData: FormData): AdminFilters {
  return {
    q: cleanText(formData.get("q"), 120),
    category: parseFilterCategory(formData.get("category")),
    sort: parseSort(formData.get("sort")),
    health: parseHealthFilter(formData.get("health")),
    queue: parseQueueFilter(formData.get("queue")),
  };
}

function parseCategory(value: FormDataEntryValue | null): Exclude<CategoryId, "all"> {
  const category = String(value || "game");
  return isCategoryId(category) ? category : "game";
}

function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function optionalText(value: FormDataEntryValue | null, maxLength: number) {
  const next = cleanText(value, maxLength);
  return next || null;
}

function optionalUrl(value: FormDataEntryValue | null, maxLength: number, allowLocalPath = false) {
  const next = optionalText(value, maxLength);
  if (!next) return null;

  if (allowLocalPath && next.startsWith("/")) return next;
  return isHttpUrl(next) ? next : null;
}

function parseTags(value: FormDataEntryValue | null) {
  const seen = new Set<string>();
  return String(value || "")
    .split(/[,\n]/)
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .map((tag) => tag.slice(0, 32))
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

function parseCurationRank(value: FormDataEntryValue | null) {
  const rank = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(rank) || rank <= 0) return null;
  return Math.min(rank, 999);
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getSafeCoverUrl(value: string | null | undefined) {
  const cover = value?.trim();
  if (!cover) return "/assets/cover-upload.png";
  if (cover.startsWith("/") || cover.startsWith("https://")) return cover;
  return "/assets/cover-upload.png";
}

function getReviewChecks(work: AdminWork) {
  return [
    {
      label: "Demo URL",
      ok: Boolean(work.demoUrl && isHttpUrl(work.demoUrl)),
      helper: "Public http or https link.",
    },
    {
      label: "Summary",
      ok: work.summary.trim().length >= 20,
      helper: "At least 20 characters.",
    },
    {
      label: "Creator notes",
      ok: work.detail.trim().length >= 30,
      helper: "Enough context for review.",
    },
    {
      label: "Tags",
      ok: work.tags.length > 0,
      helper: "At least one searchable tag.",
    },
    {
      label: "Tools",
      ok: work.tool.trim().length > 0,
      helper: "Tool stack is visible.",
    },
    {
      label: "Cover",
      ok: Boolean(work.cover),
      helper: "Cover preview available.",
    },
  ];
}

function getContentHealthChecks(work: AdminWork) {
  const curation = getWorkCuration(work);
  const hasInvalidDemo = Boolean(work.demoUrl && !isHttpUrl(work.demoUrl));
  const runnerPolicy = getRunnerPolicy(work.demoUrl);

  return [
    {
      label: "Public page",
      ok: work.status !== "published" || Boolean(work.id),
      helper: work.status === "published" ? `/works/${work.id}` : "Public route appears after publishing.",
    },
    {
      label: "TRY route",
      ok: work.status !== "published" || Boolean(work.id),
      helper: work.status === "published" ? `/play/${work.id}` : "TRY route appears after publishing.",
    },
    {
      label: "Demo source",
      ok: !hasInvalidDemo,
      helper: hasInvalidDemo ? "Demo URL must be http or https." : work.demoUrl ? "External demo URL is syntactically valid." : "Uses oeeco preview.",
    },
    {
      label: "Runner source",
      ok: runnerPolicy.status !== "held",
      helper: runnerPolicy.adminHelper,
    },
    {
      label: "Cover asset",
      ok: Boolean(work.cover && (work.cover.startsWith("/") || work.cover.startsWith("https://"))),
      helper: "Local asset path or https cover.",
    },
    {
      label: "Search summary",
      ok: work.summary.trim().length >= 50,
      helper: "At least 50 characters for cards and metadata.",
    },
    {
      label: "Detail copy",
      ok: work.detail.trim().length >= 80,
      helper: "At least 80 characters for the detail page.",
    },
    {
      label: "Discovery tags",
      ok: work.tags.length >= 2,
      helper: "At least two public tags.",
    },
    {
      label: "Tools",
      ok: work.tool.trim().length > 0,
      helper: "Tool stack is visible.",
    },
    {
      label: "Curation",
      ok: !curation.featured || Boolean(curation.rank && curation.label),
      helper: curation.featured ? "Featured works should have rank and label." : "Not featured.",
    },
  ];
}

function adminUrl(key: string, status: AdminWorkStatus, params: Record<string, string> = {}) {
  const query = new URLSearchParams({ key, status, ...params });
  return `/admin?${query.toString()}`;
}

function filterAndSortAdminWorks(works: AdminWork[], filters: AdminFilters) {
  const query = filters.q.toLowerCase();
  const filtered = works.filter((work) => {
    if (filters.category !== "all" && work.category !== filters.category) return false;
    if (!matchesHealthFilter(work, filters.health)) return false;
    if (!matchesQueueFilter(work, filters.queue)) return false;
    if (!query) return true;

    const creator = work.creator;
    const searchable = [
      work.id,
      work.title,
      work.summary,
      work.detail,
      work.tool,
      work.type,
      categoryLabels[work.category],
      work.demoUrl || "",
      creator?.id || "",
      creator?.name || "",
      creator?.handle || "",
      ...work.tags,
    ];

    return searchable.some((value) => value.toLowerCase().includes(query));
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (filters.sort === "views") return b.views - a.views;
    if (filters.sort === "likes") return b.likes - a.likes;
    if (filters.sort === "ready") {
      return getReviewReadyScore(b) - getReviewReadyScore(a) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sort === "health") {
      const aReport = getContentHealthReport(a);
      const bReport = getContentHealthReport(b);
      return bReport.issues - aReport.issues || aReport.score - bReport.score || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function getReviewReadyScore(work: AdminWork) {
  return getReviewChecks(work).filter((check) => check.ok).length;
}

function matchesHealthFilter(work: AdminWork, filter: AdminHealthFilter) {
  const curation = getWorkCuration(work);
  if (filter === "attention") return getContentHealthReport(work).needsAttention;
  if (filter === "curated") return curation.featured || Boolean(curation.rank || curation.label);
  if (filter === "featured") return curation.featured;
  return true;
}

function matchesQueueFilter(work: AdminWork, filter: AdminQueueFilter) {
  if (filter === "ready") return work.status === "pending" && isReviewReady(work);
  if (filter === "fixes") return work.status === "pending" && !isReviewReady(work);
  if (filter === "attention") return work.status === "published" && getContentHealthReport(work).needsAttention;
  if (filter === "home") {
    const curation = getWorkCuration(work);
    return work.status === "published" && (curation.featured || Boolean(curation.rank || curation.label));
  }
  return true;
}

function isReviewReady(work: AdminWork) {
  return getReviewChecks(work).every((check) => check.ok);
}

function getContentHealthReport(work: AdminWork) {
  const checks = getContentHealthChecks(work);
  const passed = checks.filter((check) => check.ok).length;
  const issues = checks.length - passed;

  return {
    checks,
    passed,
    issues,
    total: checks.length,
    score: Math.round((passed / checks.length) * 100),
    needsAttention: work.status === "published" && issues > 0,
  };
}

function getAdminQueueSummary(pendingWorks: AdminWork[], publishedWorks: AdminWork[]) {
  return {
    ready: pendingWorks.filter(isReviewReady).length,
    fixes: pendingWorks.filter((work) => !isReviewReady(work)).length,
    attention: publishedWorks.filter((work) => getContentHealthReport(work).needsAttention).length,
    home: publishedWorks.filter((work) => {
      const curation = getWorkCuration(work);
      return curation.featured || Boolean(curation.rank || curation.label);
    }).length,
  };
}

function getQueueHref(key: string, queue: AdminQueueFilter) {
  if (queue === "ready") return adminUrl(key, "pending", { sort: "ready", queue });
  if (queue === "fixes") return adminUrl(key, "pending", { sort: "ready", queue });
  if (queue === "attention") return adminUrl(key, "published", { sort: "health", health: "attention", queue });
  if (queue === "home") return adminUrl(key, "published", { sort: "health", health: "curated", queue });
  return adminUrl(key, "pending");
}

function getNextAction(work: AdminWork) {
  const curation = getWorkCuration(work);
  const health = getContentHealthReport(work);

  if (work.status === "pending" && isReviewReady(work)) {
    return {
      label: "Ready to publish",
      helper: "Open the demo once, confirm the metadata, then publish.",
      tone: "good" as const,
    };
  }

  if (work.status === "pending") {
    return {
      label: "Fix review blockers",
      helper: "Resolve the failed review checks before publishing.",
      tone: "warning" as const,
    };
  }

  if (work.status === "published" && health.needsAttention) {
    return {
      label: "Repair live quality",
      helper: "Fix content health issues, or hide temporarily if the live experience is not acceptable.",
      tone: "warning" as const,
    };
  }

  if (work.status === "published" && curation.featured) {
    return {
      label: "Maintain featured slot",
      helper: "Keep rank, label, cover, and demo quality aligned while it stays featured.",
      tone: "good" as const,
    };
  }

  if (work.status === "published" && (curation.rank || curation.label)) {
    return {
      label: "Review home lineup",
      helper: "This work is curated for the homepage. Check whether it should become featured or stay lower priority.",
      tone: "neutral" as const,
    };
  }

  if (work.status === "published") {
    return {
      label: "Candidate for curation",
      helper: "If the work is strong, add a home rank or feature label.",
      tone: "neutral" as const,
    };
  }

  return {
    label: "Archived decision",
    helper: "Keep this state, or move it back to pending if you want to review again.",
    tone: "neutral" as const,
  };
}

function getAdminHealthSummary(works: AdminWork[]) {
  const reports = works.map(getContentHealthReport);
  const attentionCount = reports.filter((report) => report.needsAttention).length;
  const featuredCount = works.filter((work) => getWorkCuration(work).featured).length;
  const curatedCount = works.filter((work) => {
    const curation = getWorkCuration(work);
    return curation.featured || Boolean(curation.rank || curation.label);
  }).length;
  const averageScore = reports.length
    ? Math.round(reports.reduce((sum, report) => sum + report.score, 0) / reports.length)
    : 100;

  return {
    attentionCount,
    curatedCount,
    featuredCount,
    averageScore,
  };
}

function getAdminOverviewMetrics({
  key,
  counts,
  pendingWorks,
  publishedWorks,
  allWorks,
}: {
  key: string;
  counts: Record<AdminWorkStatus, number>;
  pendingWorks: AdminWork[];
  publishedWorks: AdminWork[];
  allWorks: AdminWork[];
}): AdminOverviewMetric[] {
  const totalWorks = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const totalViews = publishedWorks.reduce((sum, work) => sum + work.views, 0);
  const totalTryClicks = publishedWorks.reduce((sum, work) => sum + work.tryClicks, 0);
  const totalDemoOpens = publishedWorks.reduce((sum, work) => sum + work.demoOpens, 0);
  const totalShares = publishedWorks.reduce((sum, work) => sum + work.shares, 0);
  const liveIssues = publishedWorks.filter((work) => getContentHealthReport(work).needsAttention).length;
  const newestWork = getRecentAdminWorks(allWorks, 1)[0];

  return [
    {
      label: "Total works",
      value: String(totalWorks),
      helper: `${counts.published} live, ${counts.pending} waiting`,
      href: adminUrl(key, "published"),
    },
    {
      label: "Pending review",
      value: String(counts.pending),
      helper: `${pendingWorks.filter(isReviewReady).length} ready to publish`,
      href: getQueueHref(key, "ready"),
      tone: counts.pending ? "warning" : "good",
    },
    {
      label: "Published views",
      value: formatAdminNumber(totalViews),
      helper: "Total views across live works",
      href: adminUrl(key, "published", { sort: "views" }),
    },
    {
      label: "TRY clicks",
      value: formatAdminNumber(totalTryClicks),
      helper: "Play page opens from published works",
      href: adminUrl(key, "published", { sort: "views" }),
    },
    {
      label: "Demo opens",
      value: formatAdminNumber(totalDemoOpens),
      helper: "External demo launches",
      href: adminUrl(key, "published", { sort: "views" }),
    },
    {
      label: "Shares",
      value: formatAdminNumber(totalShares),
      helper: "Share button uses and copy fallbacks",
      href: adminUrl(key, "published", { sort: "views" }),
    },
    {
      label: "Live issues",
      value: String(liveIssues),
      helper: liveIssues ? "Published works need repair" : "No live health issues",
      href: getQueueHref(key, "attention"),
      tone: liveIssues ? "warning" : "good",
    },
    {
      label: "Latest submit",
      value: newestWork ? newestWork.createdAt : "None",
      helper: newestWork ? newestWork.title : "No submissions yet",
      href: newestWork ? adminUrl(key, newestWork.status, { q: newestWork.id }) : adminUrl(key, "pending"),
    },
  ];
}

function getAdminGrowthLoopReport({
  key,
  pendingWorks,
  publishedWorks,
}: {
  key: string;
  pendingWorks: AdminWork[];
  publishedWorks: AdminWork[];
}) {
  const playableWorks = publishedWorks.filter((work) => getRunnerPolicy(work.demoUrl).status !== "held");
  const engagedWorks = publishedWorks.filter((work) => work.views > 0 || work.tryClicks > 0 || work.demoOpens > 0);
  const sharedWorks = publishedWorks.filter((work) => work.shares > 0);
  const curatedWorks = publishedWorks.filter((work) => {
    const curation = getWorkCuration(work);
    return curation.featured || Boolean(curation.rank || curation.label);
  });
  const readyPending = pendingWorks.filter(isReviewReady);
  const totalTryClicks = publishedWorks.reduce((sum, work) => sum + work.tryClicks, 0);
  const totalShares = publishedWorks.reduce((sum, work) => sum + work.shares, 0);

  const steps: AdminGrowthStep[] = [
    {
      label: "Discover",
      ok: publishedWorks.length > 0,
      value: `${publishedWorks.length} live`,
      helper: publishedWorks.length ? "Works are visible on Explore and Latest." : "Publish at least one reviewed work.",
      href: adminUrl(key, "published"),
    },
    {
      label: "TRY",
      ok: playableWorks.length > 0,
      value: `${playableWorks.length} playable`,
      helper: playableWorks.length ? "At least one live work has an open runner path." : "Fix demo links or runner policy blocks.",
      href: adminUrl(key, "published", { sort: "health" }),
    },
    {
      label: "Engage",
      ok: engagedWorks.length > 0,
      value: `${formatAdminNumber(totalTryClicks)} TRY`,
      helper: engagedWorks.length ? "Users are opening work or play pages." : "Open and test the public work path after publishing.",
      href: adminUrl(key, "published", { sort: "views" }),
    },
    {
      label: "Share",
      ok: sharedWorks.length > 0,
      value: `${formatAdminNumber(totalShares)} shares`,
      helper: sharedWorks.length ? "Share actions are being recorded." : "Share the first 2-3 works from cards or detail pages.",
      href: absoluteUrl("/rank"),
    },
    {
      label: "Rank",
      ok: engagedWorks.length > 0,
      value: engagedWorks.length ? "live" : "waiting",
      helper: engagedWorks.length ? "Leaderboard has real activity signals." : "Rankings will wake up after views, TRY opens, or shares.",
      href: absoluteUrl("/rank"),
    },
    {
      label: "Curate",
      ok: curatedWorks.length > 0,
      value: `${curatedWorks.length} curated`,
      helper: curatedWorks.length ? "Home lineup has curated works." : "Add rank, label, or featured status to strong published works.",
      href: getQueueHref(key, "home"),
    },
    {
      label: "Review",
      ok: pendingWorks.length === 0 || readyPending.length > 0,
      value: pendingWorks.length ? `${readyPending.length}/${pendingWorks.length} ready` : "clear",
      helper: pendingWorks.length ? "Keep pending works moving toward publish or fix." : "No pending review backlog.",
      href: pendingWorks.length ? getQueueHref(key, readyPending.length ? "ready" : "fixes") : adminUrl(key, "pending"),
    },
  ];

  const completeCount = steps.filter((step) => step.ok).length;

  return {
    completeCount,
    score: Math.round((completeCount / steps.length) * 100),
    steps,
  };
}

function getAdminContentSeedPlan({
  key,
  pendingWorks,
  publishedWorks,
}: {
  key: string;
  pendingWorks: AdminWork[];
  publishedWorks: AdminWork[];
}): AdminContentSeedPlan {
  const targetMin = 10;
  const targetMax = 20;
  const candidates = [...publishedWorks, ...pendingWorks];
  const liveCount = publishedWorks.length;
  const candidateCount = candidates.length;
  const targetPerCategory = 2;
  const categoryCoverage = categoryOptions.map(([id, label]) => {
    const liveCategoryCount = publishedWorks.filter((work) => work.category === id).length;
    const candidateCategoryCount = candidates.filter((work) => work.category === id).length;

    return {
      id,
      label,
      liveCount: liveCategoryCount,
      candidateCount: candidateCategoryCount,
      target: targetPerCategory,
      helper: getSeedCategoryHelper(label, liveCategoryCount, candidateCategoryCount, targetPerCategory),
    };
  });

  const uploadSuggestions = getSeedUploadSuggestions(categoryCoverage, liveCount, targetMin, targetMax);
  const works = candidates
    .map((work) => getSeedWorkSummary(key, work))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 10);

  return {
    liveCount,
    candidateCount,
    targetMin,
    targetMax,
    progress: Math.min(100, Math.round((liveCount / targetMax) * 100)),
    categoryCoverage,
    uploadSuggestions,
    works,
  };
}

function getSeedCategoryHelper(label: string, liveCount: number, candidateCount: number, target: number) {
  if (liveCount >= target) return `${label} has enough live seed works for the first shelf.`;
  if (candidateCount >= target) return `${label} has candidates; review and publish the strongest ones.`;
  if (candidateCount > 0) return `${label} has a start. Add ${formatSeedCandidateGap(target - candidateCount)}.`;
  return `Add the first ${label.toLowerCase()} seed work.`;
}

function getSeedUploadSuggestions(
  categoryCoverage: AdminSeedCategory[],
  liveCount: number,
  targetMin: number,
  targetMax: number,
) {
  const suggestions = categoryCoverage
    .filter((category) => category.candidateCount < category.target)
    .map((category) =>
      category.candidateCount
        ? `Add ${formatSeedCandidateGap(category.target - category.candidateCount)} for ${category.label.toLowerCase()}.`
        : `Upload the first ${category.label.toLowerCase()} candidate.`,
    );

  if (liveCount < targetMin) {
    suggestions.unshift(`Reach ${targetMin} published works before the first external push.`);
  }

  if (liveCount < targetMax) {
    suggestions.push(`Keep building toward ${targetMax} live works for a fuller first impression.`);
  }

  if (!suggestions.length) {
    suggestions.push("The first shelf is full. Replace weak works with stronger pieces or deepen the featured lineup.");
  }

  return suggestions.slice(0, 6);
}

function formatSeedCandidateGap(count: number) {
  return `${count} more candidate${count === 1 ? "" : "s"}`;
}

function getSeedWorkSummary(key: string, work: AdminWork): AdminSeedWork {
  const checks = getSeedWorkChecks(work);
  const passed = checks.filter((check) => check.ok).length;
  const score = Math.round((passed / checks.length) * 100);
  const missing = checks.find((check) => !check.ok);
  const statusLabel = getAdminStatusLabel(work.status);

  return {
    id: work.id,
    title: work.title,
    status: work.status,
    category: categoryLabels[work.category],
    score,
    label: `${score}% seed ready`,
    helper: missing ? missing.helper : `${statusLabel} work is ready for seed promotion.`,
    href: adminUrl(key, work.status, { q: work.id }),
  };
}

function getSeedWorkChecks(work: AdminWork) {
  const curation = getWorkCuration(work);
  const runnerPolicy = getRunnerPolicy(work.demoUrl);

  return [
    {
      ok: work.status === "published",
      helper: "Publish this work before using it as a public seed item.",
    },
    {
      ok: runnerPolicy.status !== "held",
      helper: "Resolve runner policy before promoting this work.",
    },
    {
      ok: work.summary.trim().length >= 50,
      helper: "Strengthen the summary for cards, search, and sharing.",
    },
    {
      ok: work.detail.trim().length >= 80,
      helper: "Add more detail copy for the public work page.",
    },
    {
      ok: work.tags.length >= 2,
      helper: "Add at least two public tags for discovery.",
    },
    {
      ok: Boolean(work.cover && (work.cover.startsWith("/") || work.cover.startsWith("https://"))),
      helper: "Use a clean cover image before sharing externally.",
    },
    {
      ok: curation.featured || Boolean(curation.rank || curation.label),
      helper: "Consider adding home rank or a curation label if this is a strong seed work.",
    },
  ];
}

function getRecentAdminWorks(works: AdminWork[], limit = 6) {
  return [...works].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

function getAdminStatusLabel(status: AdminWorkStatus) {
  return statusOptions.find((option) => option.id === status)?.label || status;
}

function formatAdminNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

function getAdminErrorMessage(error: string | undefined) {
  if (error === "bad-key") return "Wrong passcode.";
  if (error === "bad-request") return "Action failed. Check the required fields and try again.";
  if (error === "feedback-required") return "Add feedback before rejecting a work.";
  if (error === "bad-url") return "Use valid http or https URLs. Cover URLs can also use a local path starting with /.";
  if (error === "save-failed") return "Save failed. Check Supabase and try again.";
  if (error === "curation-failed") return "Curation update failed. Check Supabase and try again.";
  if (error === "update-failed") return "Status update failed. Check Supabase and try again.";
  return "Action failed. Check the form and try again.";
}

async function updateStatus(formData: FormData) {
  "use server";

  const key = String(formData.get("key") || "");
  const id = String(formData.get("id") || "");
  const currentStatus = parseStatus(formData.get("currentStatus"));
  const nextStatus = parseStatus(formData.get("status"));
  const reviewNote = cleanText(formData.get("reviewNote"), 600);
  const filters = getAdminFormContext(formData);

  if (!process.env.ADMIN_PASSCODE || key !== process.env.ADMIN_PASSCODE) {
    redirect("/admin?error=bad-key");
  }

  if (!id) {
    redirect(adminUrl(key, currentStatus, { ...getAdminFilterParams(filters), error: "bad-request" }));
  }

  if (nextStatus === "rejected" && reviewNote.length < 12) {
    redirect(adminUrl(key, currentStatus, { ...getAdminFilterParams(filters), error: "feedback-required" }));
  }

  const result = await updateAdminWorkStatus(id, nextStatus, reviewNote);
  revalidatePath("/");
  revalidatePath("/admin");

  redirect(
    adminUrl(
      key,
      nextStatus,
      result.ok ? { ...getAdminFilterParams(filters), updated: "1" } : { ...getAdminFilterParams(filters), error: "update-failed" },
    ),
  );
}

async function saveDetails(formData: FormData) {
  "use server";

  const key = String(formData.get("key") || "");
  const id = String(formData.get("id") || "");
  const currentStatus = parseStatus(formData.get("currentStatus"));
  const title = cleanText(formData.get("title"), 80);
  const summary = cleanText(formData.get("summary"), 160);
  const filters = getAdminFormContext(formData);

  if (!process.env.ADMIN_PASSCODE || key !== process.env.ADMIN_PASSCODE) {
    redirect("/admin?error=bad-key");
  }

  if (!id || title.length < 2 || summary.length < 2) {
    redirect(adminUrl(key, currentStatus, { ...getAdminFilterParams(filters), error: "bad-request" }));
  }

  const demoUrl = optionalUrl(formData.get("demoUrl"), 500);
  const coverUrl = optionalUrl(formData.get("coverUrl"), 500, true);
  const rawDemoUrl = optionalText(formData.get("demoUrl"), 500);
  const rawCoverUrl = optionalText(formData.get("coverUrl"), 500);

  if ((rawDemoUrl && !demoUrl) || (rawCoverUrl && !coverUrl)) {
    redirect(adminUrl(key, currentStatus, { ...getAdminFilterParams(filters), error: "bad-url" }));
  }

  const result = await updateAdminWorkDetails(id, {
    title,
    summary,
    description: cleanText(formData.get("description"), 1200),
    category: parseCategory(formData.get("category")),
    coverUrl,
    demoUrl,
    toolStack: cleanText(formData.get("toolStack"), 120),
    tags: parseTags(formData.get("tags")),
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/works/${id}`);
  revalidatePath(`/play/${id}`);

  redirect(
    adminUrl(
      key,
      currentStatus,
      result.ok ? { ...getAdminFilterParams(filters), saved: "1" } : { ...getAdminFilterParams(filters), error: "save-failed" },
    ),
  );
}

async function saveCuration(formData: FormData) {
  "use server";

  const key = String(formData.get("key") || "");
  const id = String(formData.get("id") || "");
  const currentStatus = parseStatus(formData.get("currentStatus"));
  const filters = getAdminFormContext(formData);

  if (!process.env.ADMIN_PASSCODE || key !== process.env.ADMIN_PASSCODE) {
    redirect("/admin?error=bad-key");
  }

  if (!id) {
    redirect(adminUrl(key, currentStatus, { ...getAdminFilterParams(filters), error: "bad-request" }));
  }

  const result = await updateAdminWorkCuration(id, {
    featured: formData.get("featured") === "on",
    rank: parseCurationRank(formData.get("rank")),
    label: cleanText(formData.get("label"), 19) || null,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/works/${id}`);
  revalidatePath(`/play/${id}`);

  redirect(
    adminUrl(
      key,
      currentStatus,
      result.ok ? { ...getAdminFilterParams(filters), curated: "1" } : { ...getAdminFilterParams(filters), error: "curation-failed" },
    ),
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    key?: string;
    status?: string;
    q?: string;
    category?: string;
    sort?: string;
    health?: string;
    queue?: string;
    error?: string;
    updated?: string;
    saved?: string;
    curated?: string;
  }>;
}) {
  const params = await searchParams;
  const key = params.key || "";
  const activeStatus = parseStatus(params.status);
  const filters = getAdminFilters(params);
  const filterParams = getAdminFilterParams(filters);
  const adminReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.ADMIN_PASSCODE);
  const authorized = adminReady && key === process.env.ADMIN_PASSCODE;

  if (!adminReady) {
    return (
      <section className="surface detail-body">
        <span className="section-kicker">Admin</span>
        <h1 className="page-title">Admin environment variables required</h1>
        <p>Add these variables in Vercel Environment Variables:</p>
        <div className="stat-list">
          <div className="stat-item">
            <span>SUPABASE_SERVICE_ROLE_KEY</span>
            <strong>Supabase secret key</strong>
          </div>
          <div className="stat-item">
            <span>ADMIN_PASSCODE</span>
            <strong>Your private admin password</strong>
          </div>
        </div>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="surface detail-body admin-login">
        <span className="section-kicker">Admin</span>
        <h1 className="page-title">Enter admin passcode</h1>
        <p>Review, edit, publish, reject, and hide submitted works.</p>
        <form className="form-grid" action="/admin">
          <div className="field">
            <label htmlFor="key">Passcode</label>
            <input id="key" name="key" type="password" required />
          </div>
          <button className="solid-button" type="submit">
            <Shield size={17} aria-hidden="true" />
            Enter Admin
          </button>
        </form>
        {params.error ? <p>{getAdminErrorMessage(params.error)}</p> : null}
      </section>
    );
  }

  const [counts, pendingWorks, publishedWorks, rejectedWorks, hiddenWorks] = await Promise.all([
    getAdminWorkCounts(),
    getAdminWorks("pending"),
    getAdminWorks("published"),
    getAdminWorks("rejected"),
    getAdminWorks("hidden"),
  ]);
  const worksByStatus: Record<AdminWorkStatus, AdminWork[]> = {
    pending: pendingWorks,
    published: publishedWorks,
    rejected: rejectedWorks,
    hidden: hiddenWorks,
  };
  const works = worksByStatus[activeStatus];
  const allWorks = [...pendingWorks, ...publishedWorks, ...rejectedWorks, ...hiddenWorks];
  const visibleWorks = filterAndSortAdminWorks(works, filters);
  const activeOption = statusOptions.find((status) => status.id === activeStatus) || statusOptions[0];
  const healthSummary = getAdminHealthSummary(publishedWorks);
  const queueSummary = getAdminQueueSummary(pendingWorks, publishedWorks);
  const overviewMetrics = getAdminOverviewMetrics({ key, counts, pendingWorks, publishedWorks, allWorks });
  const growthLoop = getAdminGrowthLoopReport({ key, pendingWorks, publishedWorks });
  const contentSeedPlan = getAdminContentSeedPlan({ key, pendingWorks, publishedWorks });
  const recentWorks = getRecentAdminWorks(allWorks);
  const queueCards: Array<{ id: AdminQueueFilter; label: string; helper: string; count: number }> = [
    { id: "ready", label: "Ready to publish", helper: "Pending works that pass review checks", count: queueSummary.ready },
    { id: "fixes", label: "Needs fixes", helper: "Pending works with review blockers", count: queueSummary.fixes },
    { id: "attention", label: "Live attention", helper: "Published works with health issues", count: queueSummary.attention },
    { id: "home", label: "Home lineup", helper: "Published works used for curation", count: queueSummary.home },
  ];

  return (
    <section className="surface detail-body admin-page">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">Admin</span>
          <h1 className="page-title">Review Dashboard</h1>
          <p>Inspect submissions, open demos, edit metadata, then publish, reject, or hide works.</p>
        </div>
        <Link className="ghost-button" href="/" target="_blank">
          <ExternalLink size={17} aria-hidden="true" />
          Open Explore
        </Link>
      </div>

      <div className="admin-overview-grid" aria-label="Admin overview">
        {overviewMetrics.map((metric) => (
          <Link
            className={`admin-overview-card${metric.tone ? ` is-${metric.tone}` : ""}`}
            href={metric.href}
            key={metric.label}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.helper}</small>
          </Link>
        ))}
      </div>

      <div className="admin-ops-panels">
        <section className="admin-recent-panel" aria-label="Recent works">
          <div className="admin-panel-heading">
            <span className="section-kicker">Recent Works</span>
            <small>{allWorks.length} tracked</small>
          </div>
          {recentWorks.length ? (
            <div className="admin-recent-list">
              {recentWorks.map((work) => {
                const workUrl = absoluteUrl(`/works/${work.id}`);
                const playUrl = absoluteUrl(`/play/${work.id}`);

                return (
                  <div className="admin-recent-item" key={work.id}>
                    <div>
                      <strong>{work.title}</strong>
                      <span>
                        {getAdminStatusLabel(work.status)} / {work.createdAt} / {categoryLabels[work.category]}
                      </span>
                    </div>
                    <div>
                      {work.status === "published" ? <AdminCopyButton value={workUrl} label="Work" /> : null}
                      {work.status === "published" ? <AdminCopyButton value={playUrl} label="TRY" /> : null}
                      <Link className="ghost-button" href={adminUrl(key, work.status, { q: work.id })}>
                        Open
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No submitted works yet.</p>
          )}
        </section>

        <section className="admin-quick-panel" aria-label="Quick actions">
          <div className="admin-panel-heading">
            <span className="section-kicker">Quick Actions</span>
            <Activity size={16} aria-hidden="true" />
          </div>
          <div className="admin-quick-actions">
            <Link className="ghost-button" href={getQueueHref(key, "ready")}>
              Ready queue
            </Link>
            <Link className="ghost-button" href={getQueueHref(key, "fixes")}>
              Fix queue
            </Link>
            <Link className="ghost-button" href={adminUrl(key, "published", { sort: "views" })}>
              Top views
            </Link>
            <Link className="ghost-button" href={adminUrl(key, "published", { sort: "health", health: "curated" })}>
              Home lineup
            </Link>
            <AdminCopyButton value={absoluteUrl("/upload")} label="Upload URL" />
            <AdminCopyButton value={absoluteUrl("/latest")} label="Latest URL" />
          </div>
        </section>
      </div>

      <section className="admin-growth-panel" aria-label="Growth loop checklist">
        <div className="admin-growth-heading">
          <div>
            <span className="section-kicker">
              <Trophy size={15} aria-hidden="true" />
              Growth Loop
            </span>
            <h2>Publish, test, share, rank, curate</h2>
            <p>Use this checklist after each new batch to confirm the public path is working end to end.</p>
          </div>
          <div className="admin-growth-score">
            <strong>{growthLoop.score}%</strong>
            <span>
              {growthLoop.completeCount}/{growthLoop.steps.length} ready
            </span>
          </div>
        </div>

        <div className="admin-growth-meter" aria-hidden="true">
          <span style={{ width: `${growthLoop.score}%` }} />
        </div>

        <div className="admin-growth-steps">
          {growthLoop.steps.map((step) => (
            <Link
              className={step.ok ? "admin-growth-step is-ready" : "admin-growth-step"}
              href={step.href}
              key={step.label}
            >
              {step.ok ? <Check size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
              <span>
                <strong>{step.label}</strong>
                <small>{step.value}</small>
              </span>
              <p>{step.helper}</p>
            </Link>
          ))}
        </div>

        <div className="admin-growth-actions">
          <AdminCopyButton value={absoluteUrl("/latest")} label="Latest" />
          <AdminCopyButton value={absoluteUrl("/rank")} label="Rank" />
          <AdminCopyButton value={absoluteUrl("/upload")} label="Upload" />
          <Link className="ghost-button" href="/rank" target="_blank">
            <ExternalLink size={17} aria-hidden="true" />
            Open Rank
          </Link>
        </div>
      </section>

      <section className="admin-seed-panel" aria-label="Content seed plan">
        <div className="admin-seed-heading">
          <div>
            <span className="section-kicker">
              <Star size={15} aria-hidden="true" />
              Content Seed Plan
            </span>
            <h2>First 10-20 work shelf</h2>
            <p>
              Track whether oeeco has enough playable, varied, shareable works before the first serious external push.
            </p>
          </div>
          <div className="admin-seed-progress">
            <strong>
              {contentSeedPlan.liveCount}/{contentSeedPlan.targetMax}
            </strong>
            <span>{contentSeedPlan.candidateCount} live or pending candidates</span>
          </div>
        </div>

        <div className="admin-seed-meter" aria-label={`${contentSeedPlan.progress}% of first shelf target`}>
          <span style={{ width: `${contentSeedPlan.progress}%` }} />
        </div>

        <div className="admin-seed-layout">
          <div className="admin-seed-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Category Coverage</span>
              <small>Target {contentSeedPlan.categoryCoverage[0]?.target || 2} per category</small>
            </div>
            <div className="admin-seed-category-grid">
              {contentSeedPlan.categoryCoverage.map((category) => (
                <Link
                  className={
                    category.liveCount >= category.target ? "admin-seed-category is-ready" : "admin-seed-category"
                  }
                  href={adminUrl(key, "published", { category: category.id })}
                  key={category.id}
                >
                  <span>{category.label}</span>
                  <strong>
                    {category.liveCount}/{category.target}
                  </strong>
                  <small>{category.helper}</small>
                </Link>
              ))}
            </div>
          </div>

          <div className="admin-seed-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Next Uploads</span>
              <small>Current target {contentSeedPlan.targetMin}-{contentSeedPlan.targetMax}</small>
            </div>
            <div className="admin-seed-suggestions">
              {contentSeedPlan.uploadSuggestions.map((suggestion) => (
                <div key={suggestion}>
                  <ArrowDownUp size={15} aria-hidden="true" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
            <div className="admin-seed-actions">
              <AdminCopyButton value={absoluteUrl("/upload")} label="Upload" />
              <AdminCopyButton value={absoluteUrl("/latest")} label="Latest" />
              <Link className="ghost-button" href="/upload" target="_blank">
                <ExternalLink size={17} aria-hidden="true" />
                Open Upload
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-seed-block">
          <div className="admin-panel-heading">
            <span className="section-kicker">Seed Candidates</span>
            <small>{contentSeedPlan.works.length} shown</small>
          </div>
          {contentSeedPlan.works.length ? (
            <div className="admin-seed-work-list">
              {contentSeedPlan.works.map((work) => (
                <Link
                  className={work.score >= 80 ? "admin-seed-work is-ready" : "admin-seed-work"}
                  href={work.href}
                  key={work.id}
                >
                  <div>
                    <strong>{work.title}</strong>
                    <span>
                      {getAdminStatusLabel(work.status)} / {work.category}
                    </span>
                  </div>
                  <div>
                    <strong>{work.label}</strong>
                    <span>{work.helper}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No seed candidates yet. Upload and review the first works to start this plan.</p>
          )}
        </div>
      </section>

      <nav className="admin-tabs" aria-label="Review status">
        {statusOptions.map((status) => (
          <Link
            className={status.id === activeStatus ? "admin-tab is-active" : "admin-tab"}
            href={adminUrl(key, status.id, filterParams)}
            key={status.id}
          >
            <span>{status.label}</span>
            <strong>{counts[status.id]}</strong>
          </Link>
        ))}
      </nav>

      {params.updated ? <div className="admin-notice">Status updated.</div> : null}
      {params.saved ? <div className="admin-notice">Work details saved.</div> : null}
      {params.curated ? <div className="admin-notice">Home curation saved.</div> : null}
      {params.error ? <div className="admin-notice is-error">{getAdminErrorMessage(params.error)}</div> : null}

      <form className="admin-ops-bar" action="/admin">
        <input type="hidden" name="key" value={key} />
        <input type="hidden" name="status" value={activeStatus} />
        <label>
          <span>
            <Search size={14} aria-hidden="true" />
            Search
          </span>
          <input name="q" defaultValue={filters.q} placeholder="Title, creator, tag, URL..." />
        </label>
        <label>
          <span>
            <SlidersHorizontal size={14} aria-hidden="true" />
            Category
          </span>
          <select name="category" defaultValue={filters.category}>
            <option value="all">All categories</option>
            {categoryOptions.map(([id, label]) => (
              <option value={id} key={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            <ArrowDownUp size={14} aria-hidden="true" />
            Sort
          </span>
          <select name="sort" defaultValue={filters.sort}>
            {sortOptions.map((sort) => (
              <option value={sort.id} key={sort.id}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            <Activity size={14} aria-hidden="true" />
            Health
          </span>
          <select name="health" defaultValue={filters.health}>
            {healthOptions.map((health) => (
              <option value={health.id} key={health.id}>
                {health.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            <SlidersHorizontal size={14} aria-hidden="true" />
            Queue
          </span>
          <select name="queue" defaultValue={filters.queue}>
            {queueOptions.map((queue) => (
              <option value={queue.id} key={queue.id}>
                {queue.label}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-ops-actions">
          <button className="solid-button" type="submit">
            Apply
          </button>
          <Link className="ghost-button" href={adminUrl(key, activeStatus)}>
            Reset
          </Link>
        </div>
      </form>

      <div className="admin-queue-grid" aria-label="Operational queues">
        {queueCards.map((queue) => (
          <Link
            className={filters.queue === queue.id ? "admin-queue-card is-active" : "admin-queue-card"}
            href={getQueueHref(key, queue.id)}
            key={queue.id}
          >
            <span>{queue.label}</span>
            <strong>{queue.count}</strong>
            <small>{queue.helper}</small>
          </Link>
        ))}
      </div>

      <div className="admin-health-summary" aria-label="Content health summary">
        <div className={healthSummary.attentionCount ? "admin-health-card is-warning" : "admin-health-card is-good"}>
          <span>Needs attention</span>
          <strong>{healthSummary.attentionCount}</strong>
        </div>
        <div className="admin-health-card">
          <span>Average health</span>
          <strong>{healthSummary.averageScore}%</strong>
        </div>
        <div className="admin-health-card">
          <span>Curated</span>
          <strong>{healthSummary.curatedCount}</strong>
        </div>
        <div className="admin-health-card">
          <span>Featured</span>
          <strong>{healthSummary.featuredCount}</strong>
        </div>
      </div>

      <div className="admin-section-title">
        <div>
          <h2>{activeOption.label}</h2>
          <p>{activeOption.helper}</p>
        </div>
        <span>{visibleWorks.length === works.length ? `${works.length} works` : `${visibleWorks.length} of ${works.length} works`}</span>
      </div>

      {visibleWorks.length ? (
        <div className="admin-list">
          {visibleWorks.map((work) => (
            <AdminWorkReviewRow
              activeStatus={activeStatus}
              filters={filters}
              key={work.id}
              keyValue={key}
              updateStatus={updateStatus}
              saveCuration={saveCuration}
              saveDetails={saveDetails}
              work={work}
            />
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <h2>No works match this view</h2>
          <p>Adjust the search, category, or status filters.</p>
        </section>
      )}
    </section>
  );
}

function AdminWorkReviewRow({
  activeStatus,
  filters,
  keyValue,
  saveCuration,
  saveDetails,
  updateStatus,
  work,
}: {
  activeStatus: AdminWorkStatus;
  filters: AdminFilters;
  keyValue: string;
  saveCuration: (formData: FormData) => Promise<void>;
  saveDetails: (formData: FormData) => Promise<void>;
  updateStatus: (formData: FormData) => Promise<void>;
  work: AdminWork;
}) {
  const checks = getReviewChecks(work);
  const passedChecks = checks.filter((check) => check.ok).length;
  const isReady = checks.every((check) => check.ok);
  const coverUrl = getSafeCoverUrl(work.cover);
  const workUrl = absoluteUrl(`/works/${work.id}`);
  const playUrl = absoluteUrl(`/play/${work.id}`);
  const curation = getWorkCuration(work);
  const health = getContentHealthReport(work);
  const nextAction = getNextAction(work);
  const runnerPolicy = getRunnerPolicy(work.demoUrl);

  return (
    <article className="admin-row">
      <div className="admin-card-header">
        <div>
          <div className="admin-title-line">
            <strong>{work.title}</strong>
            <span className={isReady ? "review-score is-ready" : "review-score"}>
              {passedChecks}/{checks.length} ready
            </span>
            <span className={health.needsAttention ? "review-score is-warning" : "review-score is-ready"}>
              {health.score}% health
            </span>
          </div>
          <p>{work.summary}</p>
          <div className="admin-meta">
            <span>{work.creator?.handle || "@creator"}</span>
            <span>{work.creator?.id || work.creatorId}</span>
            <span>{work.createdAt}</span>
            <span>{categoryLabels[work.category]}</span>
            <span>{work.tool}</span>
            <span>{formatAdminNumber(work.views)} views</span>
            <span>{formatAdminNumber(work.tryClicks)} TRY</span>
            <span>{formatAdminNumber(work.demoOpens)} demo opens</span>
            <span>{formatAdminNumber(work.shares)} shares</span>
            {curation.featured ? <span>Featured</span> : null}
            {curation.rank ? <span>Home #{curation.rank}</span> : null}
          </div>
        </div>
        <div className="admin-actions">
          {work.demoUrl ? (
            <Link className="ghost-button" href={work.demoUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={17} aria-hidden="true" />
              Open Demo
            </Link>
          ) : null}
          {work.status === "published" ? (
            <Link className="ghost-button" href={`/works/${work.id}`} target="_blank">
              <Eye size={17} aria-hidden="true" />
              Public Page
            </Link>
          ) : null}
        </div>
      </div>

      <div className="admin-review-grid">
        <div className="admin-cover-preview">
          <Image src={coverUrl} width={360} height={225} alt="" />
        </div>

        <div className="admin-review-panel">
          <div className="admin-panel-heading">
            <span className="section-kicker">Review Checks</span>
            {isReady ? (
              <span className="status-badge is-published">Ready</span>
            ) : (
              <span className="status-badge is-pending">Needs review</span>
            )}
          </div>
          <div className="review-check-list">
            {checks.map((check) => (
              <div className={check.ok ? "review-check is-ok" : "review-check"} key={check.label}>
                {check.ok ? <Check size={15} aria-hidden="true" /> : <AlertTriangle size={15} aria-hidden="true" />}
                <span>
                  <strong>{check.label}</strong>
                  <span>{check.helper}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-review-panel">
          <div className="admin-panel-heading">
            <span className="section-kicker">Review Links</span>
            <LinkIcon size={16} aria-hidden="true" />
          </div>
          <div className="admin-copy-field">
            <span>Work URL</span>
            <div className="admin-copy-control">
              <input readOnly value={workUrl} />
              <AdminCopyButton value={workUrl} />
            </div>
          </div>
          <div className="admin-copy-field">
            <span>TRY URL</span>
            <div className="admin-copy-control">
              <input readOnly value={playUrl} />
              <AdminCopyButton value={playUrl} />
            </div>
          </div>
          <div className="admin-copy-field">
            <span>Demo URL</span>
            <div className="admin-copy-control">
              <input readOnly value={work.demoUrl || "No demo URL submitted"} />
              <AdminCopyButton value={work.demoUrl || ""} />
            </div>
          </div>
          <div className="admin-copy-field">
            <span>Cover URL</span>
            <div className="admin-copy-control">
              <input readOnly value={work.cover || "Default cover"} />
              <AdminCopyButton value={work.cover || ""} />
            </div>
          </div>
          <div className="admin-copy-field">
            <span>Creator ID</span>
            <div className="admin-copy-control">
              <input readOnly value={work.creator?.id || work.creatorId} />
              <AdminCopyButton value={work.creator?.id || work.creatorId} />
            </div>
          </div>
        </div>
      </div>

      <div className={`admin-runner-policy is-${runnerPolicy.status}`}>
        <span>
          <Shield size={16} aria-hidden="true" />
          Runner policy
        </span>
        <strong>{runnerPolicy.title}</strong>
        <p>{runnerPolicy.adminHelper}</p>
        <div>
          <span>{runnerPolicy.label}</span>
          <span>{runnerPolicy.originLabel}</span>
        </div>
      </div>

      {runnerPolicy.playableUrl ? (
        <details className="admin-demo-preview">
          <summary>
            <Monitor size={17} aria-hidden="true" />
            Sandbox preview
          </summary>
          <iframe
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox={externalRunnerSandbox}
            src={runnerPolicy.playableUrl}
            title={`${work.title} admin preview`}
          />
        </details>
      ) : work.demoUrl ? (
        <div className="admin-demo-hold">
          <Shield size={17} aria-hidden="true" />
          <span>
            <strong>Sandbox preview blocked</strong>
            <span>Open the submitted link manually only if you trust the destination.</span>
          </span>
        </div>
      ) : null}

      <div className={`admin-next-action is-${nextAction.tone}`}>
        <span>
          <Activity size={16} aria-hidden="true" />
          Next action
        </span>
        <strong>{nextAction.label}</strong>
        <p>{nextAction.helper}</p>
      </div>

      {work.reviewNote ? (
        <div className="admin-feedback-note">
          <span className="section-kicker">Creator Feedback</span>
          <p>{work.reviewNote}</p>
        </div>
      ) : null}

      <div className="admin-health-panel">
        <div>
          <span className="section-kicker">Content Health</span>
          <h3>{health.needsAttention ? "Needs attention" : "Healthy enough"}</h3>
          <p>
            {health.passed}/{health.total} checks passed. This is a structural post-publish audit, not a live external
            uptime monitor.
          </p>
        </div>
        <div className="admin-health-checks">
          {health.checks.map((check) => (
            <div className={check.ok ? "review-check is-ok" : "review-check"} key={check.label}>
              {check.ok ? <Check size={15} aria-hidden="true" /> : <AlertTriangle size={15} aria-hidden="true" />}
              <span>
                <strong>{check.label}</strong>
                <span>{check.helper}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <form className="admin-curation-panel" action={saveCuration}>
        <input type="hidden" name="key" value={keyValue} />
        <input type="hidden" name="id" value={work.id} />
        <input type="hidden" name="currentStatus" value={activeStatus} />
        <AdminContextFields filters={filters} />
        <div>
          <span className="section-kicker">Home Curation</span>
          <h3>Control homepage placement</h3>
          <p>Featured works and lower ranks appear first on the oeeco homepage.</p>
        </div>
        <label className="admin-toggle-field">
          <input name="featured" type="checkbox" defaultChecked={curation.featured} />
          <span>
            <Star size={16} aria-hidden="true" />
            Featured
          </span>
        </label>
        <label>
          <span>
            <Trophy size={15} aria-hidden="true" />
            Home rank
          </span>
          <input name="rank" type="number" min={1} max={999} defaultValue={curation.rank || ""} placeholder="1" />
        </label>
        <label>
          <span>Editorial label</span>
          <input name="label" defaultValue={curation.label || ""} maxLength={19} placeholder="Editor's Pick" />
        </label>
        <button className="ghost-button" type="submit">
          <Save size={17} aria-hidden="true" />
          Save Curation
        </button>
      </form>

      <form className="admin-edit-form" action={saveDetails}>
        <input type="hidden" name="key" value={keyValue} />
        <input type="hidden" name="id" value={work.id} />
        <input type="hidden" name="currentStatus" value={activeStatus} />
        <AdminContextFields filters={filters} />
        <div className="admin-fields">
          <label>
            <span>Title</span>
            <input name="title" defaultValue={work.title} maxLength={80} required />
          </label>
          <label>
            <span>Short summary</span>
            <input name="summary" defaultValue={work.summary} maxLength={160} required />
          </label>
          <label>
            <span>Category</span>
            <select name="category" defaultValue={work.category}>
              {categoryOptions.map(([id, label]) => (
                <option value={id} key={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Tags</span>
            <input name="tags" defaultValue={work.tags.join(", ")} placeholder="Codex, Game, Casual" />
          </label>
          <label>
            <span>Demo URL</span>
            <input name="demoUrl" defaultValue={work.demoUrl || ""} placeholder="https://..." />
          </label>
          <label>
            <span>Cover URL</span>
            <input name="coverUrl" defaultValue={work.cover || ""} placeholder="/assets/cover-upload.png" />
          </label>
          <label>
            <span>Tools</span>
            <input name="toolStack" defaultValue={work.tool} placeholder="Codex, Canvas, React" />
          </label>
          <label className="span-2">
            <span>Creator notes</span>
            <textarea name="description" defaultValue={work.detail} rows={4} />
          </label>
        </div>
        <button className="ghost-button" type="submit">
          <Save size={17} aria-hidden="true" />
          Save Changes
        </button>
      </form>

      <div className="admin-action-bar">
        {work.status !== "published" ? (
          <form action={updateStatus}>
            <input type="hidden" name="key" value={keyValue} />
            <input type="hidden" name="id" value={work.id} />
            <input type="hidden" name="currentStatus" value={activeStatus} />
            <AdminContextFields filters={filters} />
            <button className="solid-button" name="status" value="published" type="submit">
              <Check size={17} aria-hidden="true" />
              Publish
            </button>
          </form>
        ) : null}
        {work.status !== "rejected" ? (
          <form className="admin-feedback-form" action={updateStatus}>
            <input type="hidden" name="key" value={keyValue} />
            <input type="hidden" name="id" value={work.id} />
            <input type="hidden" name="currentStatus" value={activeStatus} />
            <AdminContextFields filters={filters} />
            <label>
              <span>Revision feedback</span>
              <textarea
                name="reviewNote"
                maxLength={600}
                minLength={12}
                placeholder="Tell the creator exactly what to fix before resubmitting."
                required
                rows={3}
              />
            </label>
            <button className="ghost-button" name="status" value="rejected" type="submit">
              <X size={17} aria-hidden="true" />
              Reject
            </button>
          </form>
        ) : null}
        {work.status !== "hidden" && work.status === "published" ? (
          <form className="admin-feedback-form" action={updateStatus}>
            <input type="hidden" name="key" value={keyValue} />
            <input type="hidden" name="id" value={work.id} />
            <input type="hidden" name="currentStatus" value={activeStatus} />
            <AdminContextFields filters={filters} />
            <label>
              <span>Hide reason</span>
              <textarea
                name="reviewNote"
                maxLength={600}
                placeholder="Optional note for why this published work was hidden."
                rows={3}
              />
            </label>
            <button className="ghost-button" name="status" value="hidden" type="submit">
              <X size={17} aria-hidden="true" />
              Hide
            </button>
          </form>
        ) : null}
        {work.status !== "pending" ? (
          <form action={updateStatus}>
            <input type="hidden" name="key" value={keyValue} />
            <input type="hidden" name="id" value={work.id} />
            <input type="hidden" name="currentStatus" value={activeStatus} />
            <AdminContextFields filters={filters} />
            <button className="ghost-button" name="status" value="pending" type="submit">
              <RotateCcw size={17} aria-hidden="true" />
              Move to Pending
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}

function AdminContextFields({ filters }: { filters: AdminFilters }) {
  return (
    <>
      <input type="hidden" name="q" value={filters.q} />
      <input type="hidden" name="category" value={filters.category} />
      <input type="hidden" name="sort" value={filters.sort} />
      <input type="hidden" name="health" value={filters.health} />
      <input type="hidden" name="queue" value={filters.queue} />
    </>
  );
}
