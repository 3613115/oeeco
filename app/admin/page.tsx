import {
  AlertTriangle,
  Activity,
  ArrowDownUp,
  CalendarDays,
  Check,
  ExternalLink,
  Eye,
  Link as LinkIcon,
  Monitor,
  RotateCcw,
  Rocket,
  Save,
  Search,
  Share2,
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

type AdminSeedReadiness = {
  label: string;
  value: string;
  helper: string;
  href: string;
  tone: "good" | "warning" | "neutral";
};

type AdminContentSeedPlan = {
  liveCount: number;
  candidateCount: number;
  targetMin: number;
  targetMax: number;
  progress: number;
  categoryReadyCount: number;
  curatedCount: number;
  shareReadyCount: number;
  launchReady: boolean;
  primaryAction: string;
  readiness: AdminSeedReadiness[];
  categoryCoverage: AdminSeedCategory[];
  uploadSuggestions: string[];
  works: AdminSeedWork[];
};

type AdminHomePick = {
  id: string;
  title: string;
  category: string;
  score: number;
  label: string;
  helper: string;
  href: string;
  publicHref: string;
  tryHref: string;
  isFeatured: boolean;
  rank: number | null;
};

type AdminHomeCurationPlan = {
  liveCount: number;
  curatedCount: number;
  featuredCount: number;
  recommendedFeatured: AdminHomePick | null;
  lineup: AdminHomePick[];
  categoryGaps: string[];
  nextActions: string[];
};

type AdminJourneyStep = {
  label: string;
  ok: boolean;
  value: string;
  helper: string;
  href: string;
};

type AdminJourneyPlan = {
  score: number;
  readyCount: number;
  steps: AdminJourneyStep[];
  testWork: AdminHomePick | null;
  testLinks: Array<{ label: string; href: string }>;
  blockers: string[];
};

type AdminShareAsset = {
  id: string;
  title: string;
  category: string;
  score: number;
  helper: string;
  workUrl: string;
  tryUrl: string;
  headline: string;
  shortPitch: string;
  xPost: string;
  redditPost: string;
  productHuntTagline: string;
};

type AdminSharePlan = {
  assets: AdminShareAsset[];
  readyCount: number;
  targetCount: number;
  categoryGaps: string[];
  nextActions: string[];
};

type AdminLaunchStep = {
  label: string;
  ok: boolean;
  value: string;
  helper: string;
  href: string;
};

type AdminLaunchChannel = {
  label: string;
  status: string;
  helper: string;
};

type AdminLaunchPlan = {
  score: number;
  readyCount: number;
  decision: string;
  helper: string;
  primaryCopy: string;
  steps: AdminLaunchStep[];
  channels: AdminLaunchChannel[];
};

type AdminLaunchCadenceTask = {
  day: string;
  label: string;
  channel: string;
  action: string;
  href: string;
  copy: string;
  tone: "ready" | "hold" | "neutral";
};

type AdminLaunchCadenceMetric = {
  label: string;
  value: string;
  helper: string;
};

type AdminLaunchCadencePlan = {
  summary: string;
  primaryAction: string;
  tasks: AdminLaunchCadenceTask[];
  metrics: AdminLaunchCadenceMetric[];
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

  if (work.status === "pending" && work.reviewCycle > 0) {
    return {
      label: "Review resubmission",
      helper: `This is review round ${work.reviewCycle + 1}. Compare the update with prior feedback before publishing.`,
      tone: "warning" as const,
    };
  }

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
  const categoryReadyCount = categoryCoverage.filter((category) => category.liveCount >= category.target).length;
  const curatedCount = publishedWorks.filter((work) => {
    const curation = getWorkCuration(work);
    return curation.featured || Boolean(curation.rank || curation.label);
  }).length;
  const shareReadyCount = publishedWorks.filter(isSeedShareReady).length;
  const launchReady = liveCount >= targetMin && categoryReadyCount >= 3 && curatedCount >= 3 && shareReadyCount >= 3;
  const works = candidates
    .map((work) => getSeedWorkSummary(key, work))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 10);
  const readiness = getSeedReadinessCards({
    key,
    liveCount,
    targetMin,
    targetMax,
    categoryReadyCount,
    curatedCount,
    shareReadyCount,
    pendingCount: pendingWorks.length,
  });

  return {
    liveCount,
    candidateCount,
    targetMin,
    targetMax,
    progress: Math.min(100, Math.round((liveCount / targetMax) * 100)),
    categoryReadyCount,
    curatedCount,
    shareReadyCount,
    launchReady,
    primaryAction: getSeedPrimaryAction({ liveCount, targetMin, categoryReadyCount, curatedCount, shareReadyCount }),
    readiness,
    categoryCoverage,
    uploadSuggestions,
    works,
  };
}

function getSeedReadinessCards({
  key,
  liveCount,
  targetMin,
  targetMax,
  categoryReadyCount,
  curatedCount,
  shareReadyCount,
  pendingCount,
}: {
  key: string;
  liveCount: number;
  targetMin: number;
  targetMax: number;
  categoryReadyCount: number;
  curatedCount: number;
  shareReadyCount: number;
  pendingCount: number;
}): AdminSeedReadiness[] {
  return [
    {
      label: "Published shelf",
      value: `${liveCount}/${targetMax}`,
      helper:
        liveCount >= targetMin
          ? "Enough live works for a first external push."
          : `Publish ${targetMin - liveCount} more to reach the minimum shelf.`,
      href: adminUrl(key, liveCount >= targetMin ? "published" : "pending"),
      tone: liveCount >= targetMin ? "good" : "warning",
    },
    {
      label: "Category mix",
      value: `${categoryReadyCount}/5`,
      helper:
        categoryReadyCount >= 3
          ? "The first shelf has useful variety."
          : "Add or publish works in more categories before larger promotion.",
      href: adminUrl(key, "published", { sort: "health" }),
      tone: categoryReadyCount >= 3 ? "good" : "warning",
    },
    {
      label: "Homepage slots",
      value: String(curatedCount),
      helper: curatedCount >= 3 ? "Homepage has enough curated anchors." : "Give strong works rank, label, or featured status.",
      href: getQueueHref(key, "home"),
      tone: curatedCount >= 3 ? "good" : "warning",
    },
    {
      label: "Share candidates",
      value: String(shareReadyCount),
      helper: shareReadyCount >= 3 ? "There are enough works to share in rotation." : "Strengthen summaries, covers, tags, and TRY quality.",
      href: adminUrl(key, "published", { sort: "views" }),
      tone: shareReadyCount >= 3 ? "good" : "warning",
    },
    {
      label: "Review backlog",
      value: String(pendingCount),
      helper: pendingCount ? "Move pending works into publish or feedback before promotion." : "No pending queue blocking the shelf.",
      href: adminUrl(key, "pending"),
      tone: pendingCount ? "neutral" : "good",
    },
  ];
}

function getSeedPrimaryAction({
  liveCount,
  targetMin,
  categoryReadyCount,
  curatedCount,
  shareReadyCount,
}: {
  liveCount: number;
  targetMin: number;
  categoryReadyCount: number;
  curatedCount: number;
  shareReadyCount: number;
}) {
  if (liveCount < targetMin) return "Publish more approved works before promotion.";
  if (categoryReadyCount < 3) return "Balance the first shelf across more categories.";
  if (curatedCount < 3) return "Set homepage rank or labels for the strongest works.";
  if (shareReadyCount < 3) return "Prepare at least three works for external sharing.";
  return "First shelf is ready for controlled external promotion.";
}

function isSeedShareReady(work: AdminWork) {
  return (
    work.status === "published" &&
    getRunnerPolicy(work.demoUrl).status !== "held" &&
    work.summary.trim().length >= 50 &&
    work.tags.length >= 2 &&
    Boolean(work.cover && (work.cover.startsWith("/") || work.cover.startsWith("https://")))
  );
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

function getAdminHomeCurationPlan({
  key,
  publishedWorks,
}: {
  key: string;
  publishedWorks: AdminWork[];
}): AdminHomeCurationPlan {
  const categoryGaps = categoryOptions
    .filter(([id]) => !publishedWorks.some((work) => work.category === id))
    .map(([, label]) => label);
  const curatedWorks = publishedWorks.filter((work) => {
    const curation = getWorkCuration(work);
    return curation.featured || Boolean(curation.rank || curation.label);
  });
  const featuredWorks = publishedWorks.filter((work) => getWorkCuration(work).featured);
  const lineup = publishedWorks
    .map((work) => getAdminHomePick(key, work))
    .sort((a, b) => b.score - a.score || (a.rank || 999) - (b.rank || 999))
    .slice(0, 6);
  const recommendedFeatured = lineup[0] || null;
  const nextActions = getHomeCurationActions({
    liveCount: publishedWorks.length,
    curatedCount: curatedWorks.length,
    featuredCount: featuredWorks.length,
    categoryGaps,
    recommendedFeatured,
  });

  return {
    liveCount: publishedWorks.length,
    curatedCount: curatedWorks.length,
    featuredCount: featuredWorks.length,
    recommendedFeatured,
    lineup,
    categoryGaps,
    nextActions,
  };
}

function getAdminHomePick(key: string, work: AdminWork): AdminHomePick {
  const curation = getWorkCuration(work);
  const score = getHomeCurationScore(work);
  const runnerPolicy = getRunnerPolicy(work.demoUrl);
  const helper = getHomeCurationHelper(work, score);

  return {
    id: work.id,
    title: work.title,
    category: categoryLabels[work.category],
    score,
    label: runnerPolicy.status === "held" ? "Fix before featuring" : `${score}% home fit`,
    helper,
    href: adminUrl(key, "published", { q: work.id }),
    publicHref: absoluteUrl(`/works/${work.id}`),
    tryHref: absoluteUrl(`/play/${work.id}`),
    isFeatured: curation.featured,
    rank: curation.rank,
  };
}

function getHomeCurationScore(work: AdminWork) {
  const curation = getWorkCuration(work);
  const runnerPolicy = getRunnerPolicy(work.demoUrl);
  let score = 0;

  if (runnerPolicy.status !== "held") score += 24;
  if (work.cover && (work.cover.startsWith("/") || work.cover.startsWith("https://"))) score += 12;
  if (work.summary.trim().length >= 50) score += 12;
  if (work.detail.trim().length >= 80) score += 10;
  if (work.tags.length >= 2) score += 10;
  if (curation.featured) score += 12;
  if (curation.rank) score += 8;
  if (curation.label) score += 6;

  score += Math.min(8, work.tryClicks * 2);
  score += Math.min(6, Math.floor(work.views / 2));
  score += Math.min(6, work.shares * 3);

  return Math.min(100, score);
}

function getHomeCurationHelper(work: AdminWork, score: number) {
  const curation = getWorkCuration(work);
  const runnerPolicy = getRunnerPolicy(work.demoUrl);

  if (runnerPolicy.status === "held") return "Runner is held. Fix the play path before homepage promotion.";
  if (!curation.featured && score >= 72) return "Strong candidate for Featured or a top home rank.";
  if (!curation.rank && !curation.label) return "Add rank or curation label if this should appear high on Explore.";
  if (work.tryClicks === 0 && work.views === 0) return "Open and test the public path before external promotion.";
  if (curation.featured) return "Featured now. Keep the cover, TRY path, and summary sharp.";
  return "Good homepage candidate. Compare with other categories before featuring.";
}

function getHomeCurationActions({
  liveCount,
  curatedCount,
  featuredCount,
  categoryGaps,
  recommendedFeatured,
}: {
  liveCount: number;
  curatedCount: number;
  featuredCount: number;
  categoryGaps: string[];
  recommendedFeatured: AdminHomePick | null;
}) {
  const actions: string[] = [];

  if (!liveCount) {
    actions.push("Publish at least one reviewed work before tuning the homepage.");
    return actions;
  }

  if (!featuredCount && recommendedFeatured) {
    actions.push(`Feature "${recommendedFeatured.title}" or assign it home rank #1.`);
  }

  if (curatedCount < Math.min(3, liveCount)) {
    actions.push("Curate at least three homepage slots as soon as enough works are live.");
  }

  if (liveCount < 5) {
    actions.push("Keep the homepage copy in first-shelf mode until at least five live works exist.");
  }

  if (categoryGaps.length) {
    actions.push(`Next uploads should cover: ${categoryGaps.slice(0, 3).join(", ")}.`);
  }

  if (!actions.length) {
    actions.push("Homepage strategy is healthy. Rotate Featured based on TRY and share signals.");
  }

  return actions.slice(0, 5);
}

function getAdminJourneyPlan({
  key,
  pendingWorks,
  publishedWorks,
}: {
  key: string;
  pendingWorks: AdminWork[];
  publishedWorks: AdminWork[];
}): AdminJourneyPlan {
  const picks = publishedWorks.map((work) => getAdminHomePick(key, work)).sort((a, b) => b.score - a.score);
  const testWork = picks[0] || null;
  const playableWorks = publishedWorks.filter((work) => getRunnerPolicy(work.demoUrl).status !== "held");
  const worksWithShareSignal = publishedWorks.filter((work) => work.shares > 0);
  const worksWithTrySignal = publishedWorks.filter((work) => work.tryClicks > 0 || work.demoOpens > 0);
  const readyPending = pendingWorks.filter(isReviewReady);
  const totalTrySignals = publishedWorks.reduce((sum, work) => sum + work.tryClicks + work.demoOpens, 0);
  const totalShares = publishedWorks.reduce((sum, work) => sum + work.shares, 0);

  const steps: AdminJourneyStep[] = [
    {
      label: "Landing",
      ok: publishedWorks.length > 0,
      value: `${publishedWorks.length} live`,
      helper: publishedWorks.length ? "Explore has public work cards to click." : "Publish a work before testing the public path.",
      href: absoluteUrl("/"),
    },
    {
      label: "Work Detail",
      ok: Boolean(testWork),
      value: testWork ? testWork.title : "waiting",
      helper: testWork ? "Open the best current candidate from a card." : "No public work page is ready to test.",
      href: testWork?.publicHref || absoluteUrl("/latest"),
    },
    {
      label: "TRY Runner",
      ok: playableWorks.length > 0,
      value: `${playableWorks.length} playable`,
      helper: playableWorks.length ? "At least one work should load through the TRY route." : "Fix runner-held or missing demo paths.",
      href: testWork?.tryHref || absoluteUrl("/rank"),
    },
    {
      label: "Engagement",
      ok: totalTrySignals > 0,
      value: `${formatAdminNumber(totalTrySignals)} opens`,
      helper: totalTrySignals ? "TRY or demo-open tracking has fired." : "Open a work through TRY once after publishing.",
      href: adminUrl(key, "published", { sort: "views" }),
    },
    {
      label: "Share",
      ok: worksWithShareSignal.length > 0,
      value: `${formatAdminNumber(totalShares)} shares`,
      helper: worksWithShareSignal.length ? "Share tracking has been verified." : "Use a card or detail share button during QA.",
      href: testWork?.publicHref || absoluteUrl("/latest"),
    },
    {
      label: "Account",
      ok: true,
      value: "enabled",
      helper: "Open account and confirm Google sign-in is available.",
      href: absoluteUrl("/account"),
    },
    {
      label: "Submit",
      ok: true,
      value: pendingWorks.length ? `${pendingWorks.length} pending` : "open",
      helper: readyPending.length ? "There are ready submissions waiting for publish." : "Upload flow is the creator conversion path.",
      href: absoluteUrl("/upload"),
    },
  ];

  const blockers = getJourneyBlockers({ publishedWorks, playableWorks, totalTrySignals, totalShares, testWork });
  const readyCount = steps.filter((step) => step.ok).length;
  const testLinks = [
    { label: "Explore", href: absoluteUrl("/") },
    { label: "Latest", href: absoluteUrl("/latest") },
    { label: "Rank", href: absoluteUrl("/rank") },
    { label: "Account", href: absoluteUrl("/account") },
    { label: "Upload", href: absoluteUrl("/upload") },
  ];

  if (testWork) {
    testLinks.splice(2, 0, { label: "Work", href: testWork.publicHref }, { label: "TRY", href: testWork.tryHref });
  }

  return {
    score: Math.round((readyCount / steps.length) * 100),
    readyCount,
    steps,
    testWork,
    testLinks,
    blockers,
  };
}

function getJourneyBlockers({
  publishedWorks,
  playableWorks,
  totalTrySignals,
  totalShares,
  testWork,
}: {
  publishedWorks: AdminWork[];
  playableWorks: AdminWork[];
  totalTrySignals: number;
  totalShares: number;
  testWork: AdminHomePick | null;
}) {
  const blockers: string[] = [];

  if (!publishedWorks.length) blockers.push("No published works for a first-time visitor to open.");
  if (!playableWorks.length) blockers.push("No playable TRY route is ready for public testing.");
  if (!testWork) blockers.push("No selected work for end-to-end QA.");
  if (publishedWorks.length && totalTrySignals === 0) blockers.push("TRY/demo tracking has not been exercised yet.");
  if (publishedWorks.length && totalShares === 0) blockers.push("Share tracking has not been exercised yet.");

  if (!blockers.length) {
    blockers.push("No critical journey blockers detected. Run a manual mobile and desktop pass before posting externally.");
  }

  return blockers.slice(0, 5);
}

function getAdminSharePlan({
  key,
  publishedWorks,
}: {
  key: string;
  publishedWorks: AdminWork[];
}): AdminSharePlan {
  const assets = publishedWorks
    .map(getAdminShareAsset)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 8);
  const targetCount = Math.min(6, Math.max(3, publishedWorks.length));
  const readyCount = assets.filter((asset) => asset.score >= 75).length;
  const categoryGaps = categoryOptions
    .filter(([id]) => !publishedWorks.some((work) => work.category === id))
    .map(([, label]) => label);

  return {
    assets,
    readyCount,
    targetCount,
    categoryGaps,
    nextActions: getSharePlanActions({ assets, readyCount, targetCount, categoryGaps, liveCount: publishedWorks.length }),
  };
}

function getAdminShareAsset(work: AdminWork): AdminShareAsset {
  const workUrl = absoluteUrl(`/works/${work.id}`);
  const tryUrl = absoluteUrl(`/play/${work.id}`);
  const category = categoryLabels[work.category];
  const title = cleanShareText(work.title, 72);
  const summary = cleanShareText(work.summary || work.detail || `${title} is live on oeeco.`, 150);
  const score = getShareAssetScore(work);
  const helper = getShareAssetHelper(work, score);
  const tags = work.tags.slice(0, 3).map((tag) => `#${tag.replace(/[^\w]/g, "")}`).filter((tag) => tag.length > 1);
  const headline = `${title} - ${category} on oeeco`;
  const shortPitch = `${summary} Try it instantly on oeeco: ${tryUrl}`;
  const xPost = [`${title} is live on oeeco.`, summary, `Try it: ${tryUrl}`, tags.join(" ")].filter(Boolean).join("\n");
  const redditPost = [
    `I published "${title}" on oeeco.`,
    "",
    summary,
    "",
    `You can try it here: ${tryUrl}`,
    `Project page: ${workUrl}`,
    "",
    "Feedback on the idea, controls, or first impression is welcome.",
  ].join("\n");

  return {
    id: work.id,
    title,
    category,
    score,
    helper,
    workUrl,
    tryUrl,
    headline,
    shortPitch,
    xPost,
    redditPost,
    productHuntTagline: cleanShareText(`${title}: ${summary}`, 86),
  };
}

function getShareAssetScore(work: AdminWork) {
  const runnerPolicy = getRunnerPolicy(work.demoUrl);
  const curation = getWorkCuration(work);
  let score = 0;

  if (work.status === "published") score += 18;
  if (runnerPolicy.status !== "held") score += 18;
  if (work.cover && (work.cover.startsWith("/") || work.cover.startsWith("https://"))) score += 12;
  if (work.summary.trim().length >= 50) score += 14;
  if (work.detail.trim().length >= 80) score += 10;
  if (work.tags.length >= 2) score += 10;
  if (curation.featured || curation.rank || curation.label) score += 8;

  score += Math.min(6, work.tryClicks + work.demoOpens);
  score += Math.min(4, work.shares * 2);

  return Math.min(100, score);
}

function getShareAssetHelper(work: AdminWork, score: number) {
  const runnerPolicy = getRunnerPolicy(work.demoUrl);

  if (runnerPolicy.status === "held") return "Fix the TRY runner before sharing this work externally.";
  if (!work.cover) return "Add a clean cover before using this in public posts.";
  if (work.summary.trim().length < 50) return "Strengthen the summary so the post has a clear hook.";
  if (work.tags.length < 2) return "Add at least two tags so the post has better context.";
  if (score >= 80) return "Ready for external sharing. Start with one channel and watch clicks.";
  return "Usable for light sharing; polish detail copy before bigger promotion.";
}

function getSharePlanActions({
  assets,
  readyCount,
  targetCount,
  categoryGaps,
  liveCount,
}: {
  assets: AdminShareAsset[];
  readyCount: number;
  targetCount: number;
  categoryGaps: string[];
  liveCount: number;
}) {
  const actions: string[] = [];
  const topAsset = assets[0];

  if (!liveCount) {
    actions.push("Publish the first work before preparing external share posts.");
    return actions;
  }

  if (topAsset) actions.push(`Use "${topAsset.title}" as the first share test because it has the strongest current score.`);
  if (readyCount < targetCount) actions.push(`Prepare ${targetCount - readyCount} more share-ready works before a larger public push.`);
  if (categoryGaps.length) actions.push(`Avoid one-note promotion by adding: ${categoryGaps.slice(0, 3).join(", ")}.`);
  if (!assets.some((asset) => asset.xPost.length <= 280)) actions.push("Shorten at least one X post before using it as a launch note.");

  if (!actions.length) {
    actions.push("Share pack is ready. Rotate one work per channel and compare TRY clicks against views.");
  }

  return actions.slice(0, 5);
}

function getAdminLaunchPlan({
  key,
  pendingWorks,
  publishedWorks,
  contentSeedPlan,
  homeCurationPlan,
  journeyPlan,
  sharePlan,
}: {
  key: string;
  pendingWorks: AdminWork[];
  publishedWorks: AdminWork[];
  contentSeedPlan: AdminContentSeedPlan;
  homeCurationPlan: AdminHomeCurationPlan;
  journeyPlan: AdminJourneyPlan;
  sharePlan: AdminSharePlan;
}): AdminLaunchPlan {
  const totalViews = publishedWorks.reduce((sum, work) => sum + work.views, 0);
  const totalTrySignals = publishedWorks.reduce((sum, work) => sum + work.tryClicks + work.demoOpens, 0);
  const totalShares = publishedWorks.reduce((sum, work) => sum + work.shares, 0);
  const topShareAsset = sharePlan.assets[0] || null;
  const hasHomeLead = Boolean(homeCurationPlan.recommendedFeatured || homeCurationPlan.featuredCount > 0);
  const hasEngagementSignal = totalViews + totalTrySignals + totalShares > 0;

  const steps: AdminLaunchStep[] = [
    {
      label: "Shelf",
      ok: contentSeedPlan.launchReady,
      value: `${contentSeedPlan.liveCount}/${contentSeedPlan.targetMax}`,
      helper: contentSeedPlan.launchReady ? "First shelf has enough quantity, variety, curation, and share candidates." : contentSeedPlan.primaryAction,
      href: adminUrl(key, "published"),
    },
    {
      label: "Homepage",
      ok: homeCurationPlan.curatedCount >= Math.min(3, Math.max(1, homeCurationPlan.liveCount)) && hasHomeLead,
      value: `${homeCurationPlan.curatedCount} curated`,
      helper: hasHomeLead ? "Homepage has a clear lead work and curated follow-up slots." : "Pick a lead work for the first screen before posting externally.",
      href: getQueueHref(key, "home"),
    },
    {
      label: "Journey",
      ok: journeyPlan.score >= 85,
      value: `${journeyPlan.score}%`,
      helper: journeyPlan.score >= 85 ? "Visitor path is ready enough for a controlled push." : "Run the first visitor QA path before sending new traffic.",
      href: journeyPlan.testWork?.publicHref || absoluteUrl("/latest"),
    },
    {
      label: "Share Pack",
      ok: sharePlan.readyCount >= sharePlan.targetCount,
      value: `${sharePlan.readyCount}/${sharePlan.targetCount}`,
      helper: sharePlan.readyCount >= sharePlan.targetCount ? "Enough works have reusable public copy." : "Prepare more share-ready works before larger outreach.",
      href: topShareAsset ? adminUrl(key, "published", { q: topShareAsset.id }) : adminUrl(key, "published"),
    },
    {
      label: "Signals",
      ok: hasEngagementSignal,
      value: `${formatAdminNumber(totalTrySignals)} opens`,
      helper: hasEngagementSignal ? "At least one public interaction signal has been recorded." : "Open, TRY, like, or share a live work once during QA.",
      href: adminUrl(key, "published", { sort: "views" }),
    },
    {
      label: "Backlog",
      ok: pendingWorks.length === 0 || pendingWorks.length <= Math.max(2, Math.round(publishedWorks.length / 3)),
      value: `${pendingWorks.length} pending`,
      helper:
        pendingWorks.length === 0
          ? "No review backlog is blocking the push."
          : "Keep the pending queue small so new creator activity does not stall.",
      href: adminUrl(key, "pending", { sort: "ready" }),
    },
  ];
  const readyCount = steps.filter((step) => step.ok).length;
  const score = Math.round((readyCount / steps.length) * 100);
  const firstGap = steps.find((step) => !step.ok);
  const decision =
    score >= 90
      ? "Green light for a controlled public push"
      : score >= 67
        ? "Soft launch only"
        : "Hold external promotion";
  const helper =
    score >= 90
      ? "Post one work at a time, watch TRY clicks, and rotate the next asset based on response."
      : firstGap
        ? `${firstGap.label}: ${firstGap.helper}`
        : "Review the launch checklist before sharing externally.";
  const primaryCopy = [
    `oeeco launch readiness: ${score}%`,
    `${contentSeedPlan.liveCount} published works, ${sharePlan.readyCount} share-ready, ${journeyPlan.score}% journey QA.`,
    `Next: ${helper}`,
    absoluteUrl("/latest"),
  ].join("\n");

  return {
    score,
    readyCount,
    decision,
    helper,
    primaryCopy,
    steps,
    channels: getLaunchChannels({ score, topShareAsset, contentSeedPlan, sharePlan }),
  };
}

function getLaunchChannels({
  score,
  topShareAsset,
  contentSeedPlan,
  sharePlan,
}: {
  score: number;
  topShareAsset: AdminShareAsset | null;
  contentSeedPlan: AdminContentSeedPlan;
  sharePlan: AdminSharePlan;
}): AdminLaunchChannel[] {
  const firstWork = topShareAsset?.title || "the strongest work";

  return [
    {
      label: "Personal network",
      status: score >= 50 ? "Open" : "Wait",
      helper: score >= 50 ? `Share ${firstWork} with a small trusted circle first.` : "Finish the first shelf basics before asking for outside feedback.",
    },
    {
      label: "Niche communities",
      status: score >= 67 ? "Careful" : "Wait",
      helper:
        score >= 67
          ? "Use one relevant community post and ask for feedback on the playable result."
          : "Do not post to communities until TRY, share, and homepage checks are stable.",
    },
    {
      label: "Product Hunt style launch",
      status: score >= 90 && contentSeedPlan.liveCount >= 10 && sharePlan.readyCount >= sharePlan.targetCount ? "Prepare" : "Later",
      helper:
        score >= 90 && contentSeedPlan.liveCount >= 10
          ? "Collect feedback and screenshots before scheduling a broader launch."
          : "Wait until the first shelf has at least 10 live works and the share pack is full.",
    },
  ];
}

function getAdminLaunchCadencePlan({
  key,
  pendingWorks,
  publishedWorks,
  launchPlan,
  sharePlan,
  journeyPlan,
}: {
  key: string;
  pendingWorks: AdminWork[];
  publishedWorks: AdminWork[];
  launchPlan: AdminLaunchPlan;
  sharePlan: AdminSharePlan;
  journeyPlan: AdminJourneyPlan;
}): AdminLaunchCadencePlan {
  const topAsset = sharePlan.assets[0] || null;
  const secondAsset = sharePlan.assets[1] || topAsset;
  const thirdAsset = sharePlan.assets[2] || secondAsset;
  const totalViews = publishedWorks.reduce((sum, work) => sum + work.views, 0);
  const totalTrySignals = publishedWorks.reduce((sum, work) => sum + work.tryClicks + work.demoOpens, 0);
  const totalShares = publishedWorks.reduce((sum, work) => sum + work.shares, 0);
  const readyToShare = launchPlan.score >= 67 && Boolean(topAsset);
  const primaryAction = readyToShare
    ? `Start with "${topAsset?.title}" and keep the first push narrow.`
    : "Hold broad posting; finish the missing launch checks first.";
  const summary =
    launchPlan.score >= 90
      ? "Use this as a controlled 7-day launch rhythm: post lightly, watch behavior, then widen only if TRY clicks respond."
      : "Use this as a pre-launch operating rhythm: test, polish, and collect the first small signals before broader posting.";

  const latestUrl = absoluteUrl("/latest");
  const rankUrl = absoluteUrl("/rank");
  const uploadUrl = absoluteUrl("/upload");
  const fallbackCopy = [
    "oeeco is collecting its first playable AI-made works.",
    "Try the latest works here:",
    latestUrl,
  ].join("\n");

  const tasks: AdminLaunchCadenceTask[] = [
    {
      day: "Day 0",
      label: "Final QA pass",
      channel: "Internal",
      action: "Open Explore, one work page, TRY, Account, Upload, and one share action before inviting traffic.",
      href: journeyPlan.testWork?.tryHref || latestUrl,
      copy: `QA path: ${[absoluteUrl("/"), journeyPlan.testWork?.publicHref, journeyPlan.testWork?.tryHref, absoluteUrl("/account"), uploadUrl].filter(Boolean).join(" / ")}`,
      tone: journeyPlan.score >= 85 ? "ready" : "hold",
    },
    {
      day: "Day 1",
      label: "Trusted circle",
      channel: "Direct",
      action: topAsset ? `Send "${topAsset.title}" to a few trusted people and ask whether TRY loads clearly.` : "Wait for a share-ready work, then send it to a few trusted people.",
      href: topAsset?.tryUrl || latestUrl,
      copy: topAsset?.shortPitch || fallbackCopy,
      tone: readyToShare ? "ready" : "hold",
    },
    {
      day: "Day 2",
      label: "Public profile check",
      channel: "oeeco",
      action: "Check Latest and Rank after the first shares. The best work should be easy to find without explanation.",
      href: rankUrl,
      copy: `Latest: ${latestUrl}\nRank: ${rankUrl}`,
      tone: publishedWorks.length >= 3 ? "ready" : "neutral",
    },
    {
      day: "Day 3",
      label: "Signal review",
      channel: "Admin",
      action: "Compare views, TRY opens, shares, and pending submissions. Promote only if TRY clicks move.",
      href: adminUrl(key, "published", { sort: "views" }),
      copy: `Current signals: ${formatAdminNumber(totalViews)} views, ${formatAdminNumber(totalTrySignals)} opens, ${formatAdminNumber(totalShares)} shares, ${pendingWorks.length} pending.`,
      tone: totalViews + totalTrySignals + totalShares > 0 ? "ready" : "neutral",
    },
    {
      day: "Day 4",
      label: "Second work rotation",
      channel: "Direct",
      action: secondAsset ? `Share a different angle with "${secondAsset.title}" so feedback is not based on one work.` : "Prepare a second share-ready work before rotating messages.",
      href: secondAsset?.tryUrl || adminUrl(key, "published"),
      copy: secondAsset?.shortPitch || fallbackCopy,
      tone: sharePlan.readyCount >= 2 ? "ready" : "hold",
    },
    {
      day: "Day 5",
      label: "Niche community test",
      channel: "Community",
      action: thirdAsset ? `Use one careful feedback post around "${thirdAsset.title}". Do not cross-post everywhere.` : "Wait until the share pack has enough variety for a community test.",
      href: thirdAsset?.workUrl || latestUrl,
      copy: thirdAsset?.redditPost || fallbackCopy,
      tone: launchPlan.score >= 67 && sharePlan.readyCount >= 2 ? "ready" : "hold",
    },
    {
      day: "Day 7",
      label: "Decision review",
      channel: "Admin",
      action: "Decide whether to keep polishing, upload more works, or prepare a broader launch page/post.",
      href: adminUrl(key, "published", { sort: "views" }),
      copy: launchPlan.primaryCopy,
      tone: launchPlan.score >= 90 ? "ready" : "neutral",
    },
  ];

  return {
    summary,
    primaryAction,
    tasks,
    metrics: [
      {
        label: "Views",
        value: formatAdminNumber(totalViews),
        helper: "Watch whether external links create public page traffic.",
      },
      {
        label: "TRY opens",
        value: formatAdminNumber(totalTrySignals),
        helper: "Best early signal that people actually try the works.",
      },
      {
        label: "Shares",
        value: formatAdminNumber(totalShares),
        helper: "Shows whether the share flow is being used.",
      },
      {
        label: "Pending",
        value: String(pendingWorks.length),
        helper: "Keep this low so creator interest does not stall.",
      },
    ],
  };
}

function cleanShareText(value: string, maxLength: number) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
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

function formatAdminDate(value: string) {
  return value.slice(0, 10);
}

function getAdminReviewLoopLabel(work: AdminWork) {
  return work.reviewCycle > 0 ? `Resubmitted x${work.reviewCycle}` : "First submission";
}

function getAdminReviewLoopHelper(work: AdminWork) {
  if (work.status === "pending" && work.reviewCycle > 0) {
    return "Creator updated this work after feedback or withdrawal. Review the latest metadata and demo before publishing.";
  }

  if (work.status === "pending") {
    return "This appears to be a first review pass. Use feedback if it is not ready.";
  }

  if (work.lastReviewedAt) {
    return `Last reviewed on ${formatAdminDate(work.lastReviewedAt)}.`;
  }

  return "No review timestamp has been recorded yet.";
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
  const homeCurationPlan = getAdminHomeCurationPlan({ key, publishedWorks });
  const journeyPlan = getAdminJourneyPlan({ key, pendingWorks, publishedWorks });
  const sharePlan = getAdminSharePlan({ key, publishedWorks });
  const launchPlan = getAdminLaunchPlan({
    key,
    pendingWorks,
    publishedWorks,
    contentSeedPlan,
    homeCurationPlan,
    journeyPlan,
    sharePlan,
  });
  const launchCadencePlan = getAdminLaunchCadencePlan({
    key,
    pendingWorks,
    publishedWorks,
    launchPlan,
    sharePlan,
    journeyPlan,
  });
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

      <section className="admin-launch-panel" aria-label="Launch readiness">
        <div className="admin-launch-heading">
          <div>
            <span className="section-kicker">
              <Rocket size={15} aria-hidden="true" />
              Launch Readiness
            </span>
            <h2>{launchPlan.decision}</h2>
            <p>{launchPlan.helper}</p>
          </div>
          <div className="admin-launch-score">
            <strong>{launchPlan.score}%</strong>
            <span>
              {launchPlan.readyCount}/{launchPlan.steps.length} checks ready
            </span>
          </div>
        </div>

        <div className="admin-launch-meter" aria-hidden="true">
          <span style={{ width: `${launchPlan.score}%` }} />
        </div>

        <div className="admin-launch-layout">
          <div className="admin-launch-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Go / No-Go Checks</span>
              <small>Use before each outside push</small>
            </div>
            <div className="admin-launch-checks">
              {launchPlan.steps.map((step) => (
                <Link
                  className={step.ok ? "admin-launch-check is-ready" : "admin-launch-check"}
                  href={step.href}
                  key={step.label}
                  target={step.href.startsWith("http") ? "_blank" : undefined}
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
          </div>

          <div className="admin-launch-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Channel Gate</span>
              <small>Start narrow, then widen</small>
            </div>
            <div className="admin-launch-channels">
              {launchPlan.channels.map((channel) => (
                <div className="admin-launch-channel" key={channel.label}>
                  <span>{channel.label}</span>
                  <strong>{channel.status}</strong>
                  <small>{channel.helper}</small>
                </div>
              ))}
            </div>
            <div className="admin-launch-actions">
              <AdminCopyButton value={launchPlan.primaryCopy} label="Launch note" />
              <AdminCopyButton value={absoluteUrl("/latest")} label="Latest" />
              <AdminCopyButton value={absoluteUrl("/rank")} label="Rank" />
            </div>
          </div>
        </div>
      </section>

      <section className="admin-cadence-panel" aria-label="Launch cadence">
        <div className="admin-cadence-heading">
          <div>
            <span className="section-kicker">
              <CalendarDays size={15} aria-hidden="true" />
              Launch Cadence
            </span>
            <h2>7-day controlled push plan</h2>
            <p>{launchCadencePlan.summary}</p>
          </div>
          <div className="admin-cadence-note">
            <strong>{launchCadencePlan.tasks.filter((task) => task.tone === "ready").length}</strong>
            <span>{launchCadencePlan.primaryAction}</span>
          </div>
        </div>

        <div className="admin-cadence-layout">
          <div className="admin-cadence-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Daily Moves</span>
              <small>{launchCadencePlan.tasks.length} steps</small>
            </div>
            <div className="admin-cadence-timeline">
              {launchCadencePlan.tasks.map((task) => (
                <article className={`admin-cadence-task is-${task.tone}`} key={`${task.day}-${task.label}`}>
                  <div className="admin-cadence-day">
                    <span>{task.day}</span>
                    <strong>{task.channel}</strong>
                  </div>
                  <div>
                    <h3>{task.label}</h3>
                    <p>{task.action}</p>
                    <div className="admin-cadence-actions">
                      <AdminCopyButton value={task.copy} label="Copy" />
                      <Link className="ghost-button" href={task.href} target={task.href.startsWith("http") ? "_blank" : undefined}>
                        Open
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="admin-cadence-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Watchlist</span>
              <small>Review after each post</small>
            </div>
            <div className="admin-cadence-metrics">
              {launchCadencePlan.metrics.map((metric) => (
                <div className="admin-cadence-metric" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.helper}</small>
                </div>
              ))}
            </div>
            <div className="admin-cadence-actions">
              <AdminCopyButton value={launchCadencePlan.primaryAction} label="Next action" />
              <Link className="ghost-button" href={adminUrl(key, "published", { sort: "views" })}>
                Signal queue
              </Link>
            </div>
          </div>
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

        <div className={contentSeedPlan.launchReady ? "admin-seed-command is-ready" : "admin-seed-command"}>
          <div>
            <span className="section-kicker">Batch Operating Status</span>
            <h3>{contentSeedPlan.launchReady ? "Ready for a controlled push" : "Build the first shelf before promotion"}</h3>
            <p>{contentSeedPlan.primaryAction}</p>
          </div>
          <div className="admin-seed-command-actions">
            <AdminCopyButton value={absoluteUrl("/latest")} label="Latest" />
            <AdminCopyButton value={absoluteUrl("/rank")} label="Rank" />
            <Link className="ghost-button" href={getQueueHref(key, "home")}>
              Home lineup
            </Link>
          </div>
        </div>

        <div className="admin-seed-readiness" aria-label="First shelf readiness">
          {contentSeedPlan.readiness.map((item) => (
            <Link className={`admin-seed-readiness-card is-${item.tone}`} href={item.href} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.helper}</small>
            </Link>
          ))}
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

      <section className="admin-home-panel" aria-label="Homepage curation strategy">
        <div className="admin-home-heading">
          <div>
            <span className="section-kicker">
              <Monitor size={15} aria-hidden="true" />
              Home Strategy
            </span>
            <h2>Featured and first-screen lineup</h2>
            <p>
              Decide which work should lead Explore, which pieces need rank labels, and which categories should be
              uploaded next.
            </p>
          </div>
          <div className="admin-home-score">
            <strong>{homeCurationPlan.curatedCount}</strong>
            <span>
              curated / {homeCurationPlan.liveCount} live, {homeCurationPlan.featuredCount} featured
            </span>
          </div>
        </div>

        {homeCurationPlan.recommendedFeatured ? (
          <div className="admin-home-featured">
            <div>
              <span className="section-kicker">Recommended Lead</span>
              <h3>{homeCurationPlan.recommendedFeatured.title}</h3>
              <p>{homeCurationPlan.recommendedFeatured.helper}</p>
              <div className="admin-home-meta">
                <span>{homeCurationPlan.recommendedFeatured.category}</span>
                <span>{homeCurationPlan.recommendedFeatured.label}</span>
                {homeCurationPlan.recommendedFeatured.isFeatured ? <span>Featured now</span> : null}
                {homeCurationPlan.recommendedFeatured.rank ? (
                  <span>Home #{homeCurationPlan.recommendedFeatured.rank}</span>
                ) : null}
              </div>
            </div>
            <div className="admin-home-actions">
              <Link className="ghost-button" href={homeCurationPlan.recommendedFeatured.href}>
                Edit curation
              </Link>
              <AdminCopyButton value={homeCurationPlan.recommendedFeatured.publicHref} label="Work" />
              <AdminCopyButton value={homeCurationPlan.recommendedFeatured.tryHref} label="TRY" />
            </div>
          </div>
        ) : (
          <div className="admin-home-featured">
            <div>
              <span className="section-kicker">Recommended Lead</span>
              <h3>No published work yet</h3>
              <p>Publish the first reviewed work before setting a homepage lead.</p>
            </div>
            <Link className="ghost-button" href={getQueueHref(key, "ready")}>
              Ready queue
            </Link>
          </div>
        )}

        <div className="admin-home-layout">
          <div className="admin-home-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Lineup Candidates</span>
              <small>{homeCurationPlan.lineup.length} shown</small>
            </div>
            {homeCurationPlan.lineup.length ? (
              <div className="admin-home-lineup">
                {homeCurationPlan.lineup.map((pick) => (
                  <Link
                    className={pick.isFeatured || pick.score >= 72 ? "admin-home-pick is-ready" : "admin-home-pick"}
                    href={pick.href}
                    key={pick.id}
                  >
                    <div>
                      <strong>{pick.title}</strong>
                      <span>
                        {pick.category} / {pick.label}
                      </span>
                    </div>
                    <div>
                      <strong>{pick.score}%</strong>
                      <span>{pick.rank ? `Home #${pick.rank}` : pick.isFeatured ? "Featured" : "Needs rank"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No homepage candidates yet.</p>
            )}
          </div>

          <div className="admin-home-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Next Moves</span>
              <small>{homeCurationPlan.categoryGaps.length} category gaps</small>
            </div>
            <div className="admin-home-actions-list">
              {homeCurationPlan.nextActions.map((action) => (
                <div key={action}>
                  <Star size={15} aria-hidden="true" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
            <div className="admin-home-actions">
              <AdminCopyButton value={absoluteUrl("/")} label="Explore" />
              <AdminCopyButton value={absoluteUrl("/rank")} label="Rank" />
              <Link className="ghost-button" href={getQueueHref(key, "home")}>
                Home lineup
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-journey-panel" aria-label="User journey QA">
        <div className="admin-journey-heading">
          <div>
            <span className="section-kicker">
              <Eye size={15} aria-hidden="true" />
              User Journey QA
            </span>
            <h2>First visitor path test</h2>
            <p>
              Run this checklist before each external push: Explore, work detail, TRY, share, account, and submit.
            </p>
          </div>
          <div className="admin-journey-score">
            <strong>{journeyPlan.score}%</strong>
            <span>
              {journeyPlan.readyCount}/{journeyPlan.steps.length} ready
            </span>
          </div>
        </div>

        <div className="admin-journey-meter" aria-hidden="true">
          <span style={{ width: `${journeyPlan.score}%` }} />
        </div>

        <div className="admin-journey-layout">
          <div className="admin-journey-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Journey Steps</span>
              <small>{journeyPlan.testWork ? journeyPlan.testWork.title : "No test work yet"}</small>
            </div>
            <div className="admin-journey-steps">
              {journeyPlan.steps.map((step) => (
                <Link
                  className={step.ok ? "admin-journey-step is-ready" : "admin-journey-step"}
                  href={step.href}
                  key={step.label}
                  target={step.href.startsWith("http") ? "_blank" : undefined}
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
          </div>

          <div className="admin-journey-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">QA Pack</span>
              <small>{journeyPlan.blockers.length} notes</small>
            </div>
            <div className="admin-journey-notes">
              {journeyPlan.blockers.map((blocker) => (
                <div key={blocker}>
                  <Shield size={15} aria-hidden="true" />
                  <span>{blocker}</span>
                </div>
              ))}
            </div>
            <div className="admin-journey-links">
              {journeyPlan.testLinks.map((link) => (
                <AdminCopyButton value={link.href} label={link.label} key={`${link.label}-${link.href}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="admin-share-panel" aria-label="Share materials system">
        <div className="admin-share-heading">
          <div>
            <span className="section-kicker">
              <Share2 size={15} aria-hidden="true" />
              Share Materials
            </span>
            <h2>External post pack</h2>
            <p>
              Generate reusable copy for each published work: work page, TRY link, short pitch, X post, Reddit note,
              and Product Hunt tagline.
            </p>
          </div>
          <div className="admin-share-score">
            <strong>
              {sharePlan.readyCount}/{sharePlan.targetCount}
            </strong>
            <span>share-ready works</span>
          </div>
        </div>

        <div className="admin-share-layout">
          <div className="admin-share-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Promotion Queue</span>
              <small>{sharePlan.assets.length} assets shown</small>
            </div>
            {sharePlan.assets.length ? (
              <div className="admin-share-grid">
                {sharePlan.assets.map((asset) => (
                  <article className={asset.score >= 75 ? "admin-share-card is-ready" : "admin-share-card"} key={asset.id}>
                    <div className="admin-share-card-heading">
                      <div>
                        <strong>{asset.title}</strong>
                        <span>
                          {asset.category} / {asset.score}% ready
                        </span>
                      </div>
                      <Link className="ghost-button" href={adminUrl(key, "published", { q: asset.id })}>
                        Edit
                      </Link>
                    </div>
                    <p>{asset.helper}</p>
                    <div className="admin-share-copy-grid">
                      <AdminCopyButton value={asset.workUrl} label="Work" />
                      <AdminCopyButton value={asset.tryUrl} label="TRY" />
                      <AdminCopyButton value={asset.shortPitch} label="Pitch" />
                      <AdminCopyButton value={asset.xPost} label="X Post" />
                      <AdminCopyButton value={asset.redditPost} label="Reddit" />
                      <AdminCopyButton value={asset.productHuntTagline} label="PH Tagline" />
                    </div>
                    <div className="admin-share-preview">
                      <span>{asset.headline}</span>
                      <small>{asset.shortPitch}</small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>No published works yet. Publish a reviewed work to generate the first share pack.</p>
            )}
          </div>

          <div className="admin-share-block">
            <div className="admin-panel-heading">
              <span className="section-kicker">Launch Notes</span>
              <small>{sharePlan.categoryGaps.length} category gaps</small>
            </div>
            <div className="admin-share-actions-list">
              {sharePlan.nextActions.map((action) => (
                <div key={action}>
                  <Share2 size={15} aria-hidden="true" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
            <div className="admin-share-actions">
              <AdminCopyButton value={absoluteUrl("/latest")} label="Latest" />
              <AdminCopyButton value={absoluteUrl("/rank")} label="Rank" />
              <Link className="ghost-button" href="/latest" target="_blank">
                <ExternalLink size={17} aria-hidden="true" />
                Open Latest
              </Link>
            </div>
          </div>
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
            <span>{getAdminReviewLoopLabel(work)}</span>
            {work.resubmittedAt ? <span>Resubmitted {formatAdminDate(work.resubmittedAt)}</span> : null}
            {work.lastReviewedAt ? <span>Reviewed {formatAdminDate(work.lastReviewedAt)}</span> : null}
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

      <div className="admin-review-loop">
        <span className="section-kicker">Review Loop</span>
        <strong>{getAdminReviewLoopLabel(work)}</strong>
        <p>{getAdminReviewLoopHelper(work)}</p>
      </div>

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
