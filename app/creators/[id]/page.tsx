import { CalendarDays, Folder, Heart, Layers, Play, Sparkles, Trophy, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreatorShareButton } from "@/components/CreatorShareButton";
import { WorkCard } from "@/components/WorkCard";
import { categories, formatNumber, type CategoryId } from "@/lib/data";
import { tagToSlug } from "@/lib/discovery";
import { absoluteUrl, defaultOgImage, siteName } from "@/lib/site";
import { getPublicCreator, getPublicWorksByCreator } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const creator = await getPublicCreator(id);

  if (!creator) {
    return {
      title: "Creator not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${creator.name} (${creator.handle})`;

  return {
    title,
    description: creator.bio,
    alternates: {
      canonical: `/creators/${creator.id}`,
    },
    openGraph: {
      title,
      description: creator.bio,
      url: `/creators/${creator.id}`,
      siteName,
      images: [creator.avatar || defaultOgImage],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description: creator.bio,
      images: [creator.avatar || defaultOgImage],
    },
  };
}

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [creator, creatorWorks] = await Promise.all([getPublicCreator(id), getPublicWorksByCreator(id)]);

  if (!creator) {
    notFound();
  }

  const likes = creatorWorks.reduce((sum, work) => sum + work.likes, 0);
  const views = creatorWorks.reduce((sum, work) => sum + work.views, 0);
  const saves = creatorWorks.reduce((sum, work) => sum + work.collections, 0);
  const opens = creatorWorks.reduce((sum, work) => sum + work.tryClicks + work.demoOpens, 0);
  const shares = creatorWorks.reduce((sum, work) => sum + work.shares, 0);
  const topTags = getTopTags(creatorWorks);
  const categoryStats = getCategoryStats(creatorWorks);
  const latestWork = getLatestWork(creatorWorks);
  const standoutWork = getStandoutWork(creatorWorks);
  const firstPublishedAt = getFirstPublishedAt(creatorWorks);
  const portfolioSummary = getPortfolioSummary(creatorWorks, topTags);
  const followerCount = parseCompactCount(creator.followers);
  const creatorJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${creator.name} on oeeco`,
    url: absoluteUrl(`/creators/${creator.id}`),
    mainEntity: {
      "@type": "Person",
      name: creator.name,
      alternateName: creator.handle,
      description: creator.bio,
      image: absoluteUrl(creator.avatar),
      url: absoluteUrl(`/creators/${creator.id}`),
      interactionStatistic:
        followerCount === null
          ? undefined
          : [
              {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/FollowAction",
                userInteractionCount: followerCount,
              },
            ],
    },
    hasPart: creatorWorks.map((work) => ({
      "@type": "CreativeWork",
      name: work.title,
      url: absoluteUrl(`/works/${work.id}`),
      genre: work.type,
      keywords: work.tags.join(", "),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creatorJsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="creator-header surface">
        <div className="creator-card">
          <Image src={creator.avatar} width={128} height={128} alt={creator.name} />
        </div>
        <div className="creator-copy">
          <span className="section-kicker">
            <UserRound size={14} aria-hidden="true" />
            {creator.handle}
          </span>
          <h1>{creator.name}</h1>
          <p>{creator.bio}</p>
          <div className="metric-strip">
            <div className="metric-box">
              <strong>{creator.followers}</strong>
              <span>followers</span>
            </div>
            <div className="metric-box">
              <strong>{creatorWorks.length}</strong>
              <span>works</span>
            </div>
            <div className="metric-box">
              <strong>{formatNumber(views)}</strong>
              <span>views</span>
            </div>
            <div className="metric-box">
              <strong>{formatNumber(likes)}</strong>
              <span>likes</span>
            </div>
            <div className="metric-box">
              <strong>{formatNumber(saves)}</strong>
              <span>saves</span>
            </div>
            <div className="metric-box">
              <strong>{formatNumber(opens)}</strong>
              <span>opens</span>
            </div>
          </div>
        </div>
        <div className="creator-header-actions">
          <CreatorShareButton creatorName={creator.name} summary={portfolioSummary} url={`/creators/${creator.id}`} />
          <Link className="solid-button" href={creatorWorks.length ? "#creator-works" : "/upload"}>
            <Sparkles size={17} aria-hidden="true" />
            {creatorWorks.length ? "View Works" : "Submit Work"}
          </Link>
        </div>
      </section>

      <section className="creator-showcase">
        <div className="creator-showcase-main surface">
          <span className="section-kicker">
            <Sparkles size={14} aria-hidden="true" />
            Portfolio Snapshot
          </span>
          <h2>{portfolioSummary}</h2>
          <div className="creator-showcase-stats">
            <span>
              <strong>{formatNumber(views)}</strong>
              public views
            </span>
            <span>
              <strong>{formatNumber(likes)}</strong>
              likes
            </span>
            <span>
              <strong>{formatNumber(shares)}</strong>
              shares
            </span>
          </div>
        </div>

        <div className="creator-showcase-side surface">
          <span className="section-kicker">
            <CalendarDays size={14} aria-hidden="true" />
            Publishing
          </span>
          <strong>{firstPublishedAt ? `Active since ${formatCreatorDate(firstPublishedAt)}` : "New public profile"}</strong>
          <p>
            {latestWork
              ? `Latest work: ${latestWork.title}, published ${formatCreatorDate(latestWork.createdAt)}.`
              : "Approved works will appear here after review."}
          </p>
        </div>
      </section>

      <section className="creator-insights">
        <div className="creator-insight-panel surface">
          <span className="section-kicker">
            <Folder size={14} aria-hidden="true" />
            Categories
          </span>
          {categoryStats.length ? (
            <div className="creator-chip-list">
              {categoryStats.map((item) => (
                <Link className="small-pill" href={`/categories/${item.id}`} key={item.id}>
                  {item.label} · {item.count}
                </Link>
              ))}
            </div>
          ) : (
            <p>No public category data yet.</p>
          )}
        </div>

        <div className="creator-insight-panel surface">
          <span className="section-kicker">
            <Layers size={14} aria-hidden="true" />
            Top Tags
          </span>
          {topTags.length ? (
            <div className="creator-chip-list">
              {topTags.map(([tag, count]) => (
                <Link className="small-pill" href={`/tags/${tagToSlug(tag)}`} key={tag}>
                  {tag} · {count}
                </Link>
              ))}
            </div>
          ) : (
            <p>No public tag data yet.</p>
          )}
        </div>

        <div className="creator-insight-panel surface">
          <span className="section-kicker">
            <Heart size={14} aria-hidden="true" />
            Momentum
          </span>
          <div className="creator-momentum">
            <strong>{creatorWorks.length ? formatNumber(Math.round(likes / Math.max(creatorWorks.length, 1))) : "0"}</strong>
            <span>average likes per work</span>
          </div>
        </div>
      </section>

      {standoutWork ? (
        <section className="creator-featured-work surface">
          <div className="creator-featured-copy">
            <span className="section-kicker">
              <Trophy size={14} aria-hidden="true" />
              Standout Work
            </span>
            <h2>{standoutWork.title}</h2>
            <p>{standoutWork.summary}</p>
            <div className="creator-featured-metrics">
              <span>{formatNumber(standoutWork.views)} views</span>
              <span>{formatNumber(standoutWork.likes)} likes</span>
              <span>{formatNumber(standoutWork.tryClicks + standoutWork.demoOpens)} opens</span>
            </div>
            <div className="creator-featured-actions">
              <Link className="solid-button" href={`/play/${standoutWork.id}`}>
                <Play size={17} aria-hidden="true" />
                TRY
              </Link>
              <Link className="ghost-button" href={`/works/${standoutWork.id}`}>
                View Details
              </Link>
            </div>
          </div>
          <Link className="creator-featured-cover" href={`/works/${standoutWork.id}`}>
            <Image src={standoutWork.cover} width={640} height={400} alt={standoutWork.title} />
          </Link>
        </section>
      ) : null}

      {creatorWorks.length ? (
        <section className="discovery-page" id="creator-works">
          <div className="filter-row">
            <span className="result-count">{creatorWorks.length} published works</span>
            <Link className="ghost-button" href="/latest">
              Browse Latest
            </Link>
          </div>
          <section className="grid">
            {creatorWorks.map((work) => (
              <WorkCard work={work} key={work.id} />
            ))}
          </section>
        </section>
      ) : (
        <section className="empty-state surface">
          <h1 className="page-title">This creator has no public works yet</h1>
          <p>Published works from this creator will appear here after review. The profile is ready to become a public portfolio.</p>
          <Link className="solid-button" href="/upload">
            Submit Work
          </Link>
        </section>
      )}
    </>
  );
}

function getTopTags(works: Awaited<ReturnType<typeof getPublicWorksByCreator>>) {
  const counts = new Map<string, number>();
  for (const work of works) {
    for (const tag of work.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);
}

function getCategoryStats(works: Awaited<ReturnType<typeof getPublicWorksByCreator>>) {
  const labels = new Map(
    categories.filter((category): category is [Exclude<CategoryId, "all">, string] => category[0] !== "all"),
  );
  const counts = new Map<Exclude<CategoryId, "all">, number>();
  for (const work of works) {
    counts.set(work.category, (counts.get(work.category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      label: labels.get(id) || "Work",
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function getLatestWork(works: Awaited<ReturnType<typeof getPublicWorksByCreator>>) {
  return [...works].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
}

function getStandoutWork(works: Awaited<ReturnType<typeof getPublicWorksByCreator>>) {
  return (
    [...works].sort((a, b) => {
      const aScore = a.likes * 3 + a.views + (a.tryClicks + a.demoOpens) * 2 + a.shares * 4;
      const bScore = b.likes * 3 + b.views + (b.tryClicks + b.demoOpens) * 2 + b.shares * 4;
      if (aScore !== bScore) return bScore - aScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0] || null
  );
}

function getFirstPublishedAt(works: Awaited<ReturnType<typeof getPublicWorksByCreator>>) {
  const sorted = [...works].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return sorted[0]?.createdAt || null;
}

function getPortfolioSummary(
  works: Awaited<ReturnType<typeof getPublicWorksByCreator>>,
  topTags: Array<[string, number]>,
) {
  if (!works.length) return "A new oeeco creator profile ready for published works.";

  const tags = topTags.slice(0, 3).map(([tag]) => tag);
  const focus = tags.length ? ` with ${tags.join(", ")}` : "";
  const noun = works.length === 1 ? "published work" : "published works";
  return `${works.length} ${noun}${focus}.`;
}

function formatCreatorDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function parseCompactCount(value: string) {
  const normalized = value.trim().toLowerCase();
  const match = normalized.match(/^(\d+(?:\.\d+)?)([km]?)$/);
  if (!match) return null;

  const number = Number(match[1]);
  const multiplier = match[2] === "m" ? 1_000_000 : match[2] === "k" ? 1_000 : 1;
  return Math.round(number * multiplier);
}
