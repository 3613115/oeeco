import { Heart, Play, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatNumber, getWorkCreator, works } from "@/lib/data";
import { getPublicWork } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id }));
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getPublicWork(id);

  if (!work) {
    notFound();
  }

  const creator = getWorkCreator(work);

  return (
    <section className="detail-grid">
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
                {creator.handle} · {creator.followers} followers
              </span>
            </span>
          </Link>
          <p>{work.detail}</p>
          <div className="tag-row">
            {work.tags.map((tag) => (
              <span className="small-pill" key={tag}>
                {tag}
              </span>
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
