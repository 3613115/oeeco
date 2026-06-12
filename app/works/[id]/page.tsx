import { ExternalLink, Heart, Play, Shield } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { WorkReportButton } from "@/components/WorkReportButton";
import { WorkShareButton } from "@/components/WorkShareButton";
import { formatNumber, getWorkCreator, works } from "@/lib/data";
import { tagToSlug } from "@/lib/discovery";
import { getRunnerPolicy } from "@/lib/play-runner";
import { absoluteUrl, defaultOgImage, siteName, toAbsoluteUrl } from "@/lib/site";
import { getPublicWork, recordWorkEngagement } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const work = await getPublicWork(id);

  if (!work) {
    return {
      title: "Work not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const creator = getWorkCreator(work);
  const title = `${work.title} by ${creator.name}`;
  const description = getMetaDescription(work.summary || work.detail);
  const image = work.cover || defaultOgImage;
  const path = `/works/${work.id}`;
  const url = absoluteUrl(path);
  const imageUrl = toAbsoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: `${work.title} cover`,
        },
      ],
      type: "article",
      publishedTime: work.createdAt,
      authors: [creator.name],
      tags: work.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getPublicWork(id);

  if (!work) {
    notFound();
  }

  await recordWorkEngagement(work.id, "view");

  const creator = getWorkCreator(work);
  const runnerPolicy = getRunnerPolicy(work.demoUrl);
  const shareUrl = absoluteUrl(`/works/${work.id}`);
  const workJsonLd = {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", "WebApplication"],
    name: work.title,
    description: work.summary,
    url: absoluteUrl(`/works/${work.id}`),
    image: toAbsoluteUrl(work.cover),
    datePublished: work.createdAt,
    applicationCategory: work.type,
    operatingSystem: "Web browser",
    isAccessibleForFree: true,
    creativeWorkStatus: "Published",
    sameAs: runnerPolicy.playableUrl ? [runnerPolicy.playableUrl] : undefined,
    creator: {
      "@type": "Person",
      name: creator.name,
      url: absoluteUrl(`/creators/${creator.id}`),
    },
    genre: work.type,
    keywords: work.tags.join(", "),
    potentialAction: {
      "@type": "PlayAction",
      target: absoluteUrl(`/play/${work.id}`),
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: work.views,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: work.likes,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/PlayAction",
        userInteractionCount: work.tryClicks,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ShareAction",
        userInteractionCount: work.shares,
      },
    ],
  };

  return (
    <section className="detail-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd).replace(/</g, "\\u003c") }}
      />
      <article className="surface detail-hero">
        <Image src={work.cover} width={1200} height={675} alt={work.title} priority />
        <div className="detail-body">
          <span className="section-kicker">{work.type}</span>
          <h1>{work.title}</h1>
          <Link className="author-strip" href={`/creators/${creator.id}`}>
            <Image src={creator.avatar} width={46} height={46} alt="" />
            <span>
              <strong>{creator.name}</strong>
              <span>
                {creator.handle} / {creator.followers} followers
              </span>
            </span>
          </Link>
          <p>{work.detail}</p>
          <div className="detail-runner-card">
            <span>
              <Shield size={17} aria-hidden="true" />
              {runnerPolicy.label}
            </span>
            <p>{runnerPolicy.helper}</p>
          </div>
          <div className="tag-row">
            {work.tags.map((tag) => (
              <Link className="small-pill" href={`/tags/${tagToSlug(tag)}`} key={tag}>
                {tag}
              </Link>
            ))}
          </div>
          <div className="detail-actions">
            <Link className="solid-button" href={`/play/${work.id}`}>
              <Play size={17} aria-hidden="true" />
              Try It
            </Link>
            {runnerPolicy.playableUrl ? (
              <TrackedExternalLink className="ghost-button" href={runnerPolicy.playableUrl} metric="demo_open" workId={work.id}>
                <ExternalLink size={17} aria-hidden="true" />
                Open Demo
              </TrackedExternalLink>
            ) : null}
            <button className="ghost-button" type="button">
              <Heart size={17} aria-hidden="true" />
              Like {formatNumber(work.likes)}
            </button>
            <WorkShareButton summary={work.summary} title={work.title} url={shareUrl} workId={work.id} />
            <WorkReportButton context="work" work={work} />
          </div>
        </div>
      </article>

      <aside className="surface side-panel">
        <div>
          <span className="section-kicker">TRY Experience</span>
          <div className="runner-entry-summary">
            <strong>{runnerPolicy.title}</strong>
            <p>{runnerPolicy.helper}</p>
            <Link className="solid-button" href={`/play/${work.id}`}>
              <Play size={17} aria-hidden="true" />
              Try It
            </Link>
          </div>
          <div className="publish-quality-list">
            <div className="publish-quality-item is-ready">
              <Shield size={16} aria-hidden="true" />
              <span>
                <strong>Runner</strong>
                <span>{runnerPolicy.label}</span>
              </span>
            </div>
            <div className="publish-quality-item is-ready">
              <Play size={16} aria-hidden="true" />
              <span>
                <strong>TRY route</strong>
                <span>/play/{work.id}</span>
              </span>
            </div>
            <div className={runnerPolicy.status === "held" ? "publish-quality-item" : "publish-quality-item is-ready"}>
              <ExternalLink size={16} aria-hidden="true" />
              <span>
                <strong>Demo source</strong>
                <span>{runnerPolicy.originLabel}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="report-panel">
          <span className="section-kicker">Report A Problem</span>
          <strong>Something wrong with this work?</strong>
          <p>Report broken demos, unsafe links, misleading metadata, or playback problems.</p>
          <WorkReportButton context="work" label="Report Issue" work={work} />
        </div>
        <div>
          <span className="section-kicker">Work Stats</span>
          <div className="stat-list">
            <div className="stat-item">
              <span>Views</span>
              <strong>{formatNumber(work.views)}</strong>
            </div>
            <div className="stat-item">
              <span>TRY</span>
              <strong>{formatNumber(work.tryClicks)}</strong>
            </div>
            <div className="stat-item">
              <span>Demo opens</span>
              <strong>{formatNumber(work.demoOpens)}</strong>
            </div>
            <div className="stat-item">
              <span>Shares</span>
              <strong>{formatNumber(work.shares)}</strong>
            </div>
            <div className="stat-item">
              <span>Likes</span>
              <strong>{formatNumber(work.likes)}</strong>
            </div>
            <div className="stat-item">
              <span>Saves</span>
              <strong>{formatNumber(work.collections)}</strong>
            </div>
            <div className="stat-item">
              <span>Tools</span>
              <strong>{work.tool}</strong>
            </div>
            <div className="stat-item">
              <span>Category</span>
              <strong>{work.type}</strong>
            </div>
            <div className="stat-item">
              <span>Published</span>
              <strong>{work.createdAt}</strong>
            </div>
          </div>
        </div>
        <div>
          <span className="section-kicker">Comments</span>
          {work.comments.length ? (
            <div className="comment-list">
              {work.comments.map(([name, avatar, text]) => (
                <div className="comment" key={`${name}-${text}`}>
                  <Image src={avatar} width={36} height={36} alt="" />
                  <div>
                    <strong>{name}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Comments will be added in a later version.</p>
          )}
        </div>
      </aside>
    </section>
  );
}

function getMetaDescription(value: string) {
  const clean = value.trim().replace(/\s+/g, " ");
  if (clean.length <= 155) return clean;
  return `${clean.slice(0, 152).trim()}...`;
}
