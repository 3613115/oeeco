import { Folder, Heart, Layers, UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  const topTags = getTopTags(creatorWorks);
  const categoryStats = getCategoryStats(creatorWorks);
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
          <span className="section-kicker">{creator.handle}</span>
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
          </div>
        </div>
        <button className="solid-button" type="button">
          <UserPlus size={17} aria-hidden="true" />
          Follow
        </button>
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

      {creatorWorks.length ? (
        <section className="discovery-page">
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
          <p>Published works from this creator will appear here after review.</p>
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

function parseCompactCount(value: string) {
  const normalized = value.trim().toLowerCase();
  const match = normalized.match(/^(\d+(?:\.\d+)?)([km]?)$/);
  if (!match) return null;

  const number = Number(match[1]);
  const multiplier = match[2] === "m" ? 1_000_000 : match[2] === "k" ? 1_000 : 1;
  return Math.round(number * multiplier);
}
