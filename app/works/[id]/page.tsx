import { Heart, Play, Share2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatNumber, getWorkCreator, works } from "@/lib/data";
import { tagToSlug } from "@/lib/discovery";
import { absoluteUrl, defaultOgImage, siteName } from "@/lib/site";
import { getPublicWork } from "@/lib/work-service";

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
  const description = work.summary || work.detail;
  const image = work.cover || defaultOgImage;
  const url = `/works/${work.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [image],
      type: "article",
      publishedTime: work.createdAt,
      authors: [creator.name],
      tags: work.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getPublicWork(id);

  if (!work) {
    notFound();
  }

  const creator = getWorkCreator(work);
  const workJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    description: work.summary,
    url: absoluteUrl(`/works/${work.id}`),
    image: absoluteUrl(work.cover),
    datePublished: work.createdAt,
    creator: {
      "@type": "Person",
      name: creator.name,
      url: absoluteUrl(`/creators/${creator.id}`),
    },
    genre: work.type,
    keywords: work.tags.join(", "),
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
            <button className="ghost-button" type="button">
              <Heart size={17} aria-hidden="true" />
              Like {formatNumber(work.likes)}
            </button>
            <button className="ghost-button" type="button">
              <Share2 size={17} aria-hidden="true" />
              Share
            </button>
          </div>
        </div>
      </article>

      <aside className="surface side-panel">
        <div>
          <span className="section-kicker">Work Stats</span>
          <div className="stat-list">
            <div className="stat-item">
              <span>Views</span>
              <strong>{formatNumber(work.views)}</strong>
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
