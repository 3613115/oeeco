import { ExternalLink, Heart, Play, Shield } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";
import { WorkReportButton } from "@/components/WorkReportButton";
import { WorkShareButton } from "@/components/WorkShareButton";
import { formatNumber, getWorkCreator, works, type Work } from "@/lib/data";
import { tagToSlug } from "@/lib/discovery";
import { getRunnerPolicy, type RunnerPolicy } from "@/lib/play-runner";
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
  const description = getMetaDescription(
    work.summary || work.detail,
    `Explore ${work.title}, an AI-made ${work.type.toLowerCase()} by ${creator.name} on oeeco, with browser-first details, tags, and a safe TRY route.`,
  );
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
  const editorialNotes = getWorkEditorialNotes(work, runnerPolicy);
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
          <section className="detail-editorial" aria-labelledby="work-editorial-review">
            <div>
              <span className="section-kicker">Editorial Review</span>
              <h2 id="work-editorial-review">Why this work is listed</h2>
              <p>{editorialNotes.summary}</p>
            </div>
            <div className="detail-editorial-grid">
              {editorialNotes.cards.map((card) => (
                <article key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
            <div className="detail-editorial-steps">
              <h3>How to try it</h3>
              <ol>
                {editorialNotes.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
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

function getMetaDescription(value: string, fallback: string) {
  const clean = value.trim().replace(/\s+/g, " ");
  const source = clean.length >= 50 ? clean : `${clean ? `${clean}. ` : ""}${fallback}`;
  if (source.length <= 155) return source;
  return `${source.slice(0, 152).trim()}...`;
}

function getWorkEditorialNotes(work: Work, runnerPolicy: RunnerPolicy) {
  const formatNote = getFormatNote(work);
  const safetyNote =
    runnerPolicy.status === "playable"
      ? `oeeco opens this work through a sandboxed TRY route and keeps the external demo origin visible as ${runnerPolicy.originLabel}.`
      : runnerPolicy.status === "held"
        ? "The original demo link is held by the runner policy, so visitors see a safer oeeco-controlled experience first."
        : "The work currently uses an oeeco preview route, which keeps the page useful while avoiding an unsafe or missing external embed.";
  const tags = work.tags.slice(0, 4).join(", ");

  return {
    summary: `${work.title} is listed as an AI-made ${work.type.toLowerCase()} because it gives visitors a browser-first artifact to inspect or try, not just a screenshot or announcement. The page records the creator, category, tags, and runner status so visitors can understand the work before opening it.`,
    cards: [
      {
        title: "What this work does",
        body: work.summary || work.detail,
      },
      {
        title: "Editorial fit",
        body: formatNote,
      },
      {
        title: "Safety and access",
        body: safetyNote,
      },
      {
        title: "Discovery context",
        body: tags
          ? `The current tags are ${tags}. They help visitors compare this work with nearby projects by format, workflow, or interaction style.`
          : "The work is grouped by category and creator while oeeco gathers more precise discovery signals.",
      },
    ],
    steps: [
      "Read the summary and tags to understand the promised interaction before opening the runner.",
      "Use the TRY button to open the browser experience inside oeeco's controlled route.",
      "Check whether the first minute matches the listing: clear purpose, visible controls, and a meaningful result.",
      "Use the report option if the demo is broken, misleading, unsafe, or no longer matches the description.",
    ],
  };
}

function getFormatNote(work: Work) {
  if (work.category === "game") {
    return "Game listings are strongest when the first minute teaches the goal, controls, feedback, and restart loop. oeeco highlights these works for playability and study value.";
  }

  if (work.category === "tool") {
    return "Tool listings are strongest when they solve one focused job with realistic inputs and a useful output. oeeco favors tools that visitors can test on their own material.";
  }

  if (work.category === "visual") {
    return "Visual listings are strongest when the visitor can inspect, generate, or manipulate a clear result. oeeco favors visual work with legible controls and an intentional frame.";
  }

  if (work.category === "story") {
    return "Interactive listings are strongest when visitor choices change what happens on the page. oeeco favors experiences with clear context and meaningful interaction.";
  }

  return "AI experiment listings are strongest when they make the workflow visible and keep claims grounded. oeeco favors browser artifacts that turn prompts or agent workflows into something testable.";
}
