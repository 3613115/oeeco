"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WorkShareButton } from "@/components/WorkShareButton";
import { getWorkCreator, type Work } from "@/lib/data";
import { tagToSlug } from "@/lib/discovery";

export function WorkCard({ work }: { work: Work }) {
  const creator = getWorkCreator(work);

  return (
    <article className="work-card">
      <Link className="cover-link" href={`/works/${work.id}`}>
        <Image className="work-cover" src={work.cover} width={640} height={400} alt={work.title} />
        <span className="work-type">{work.type}</span>
      </Link>
      <div className="work-card-body">
        <div className="work-title-row">
          <Link className="work-title" href={`/works/${work.id}`}>
            {work.title}
          </Link>
          <div className="work-card-actions">
            <WorkShareButton
              className="icon-button share-button"
              iconOnly
              summary={work.summary}
              title={work.title}
              url={`/works/${work.id}`}
              workId={work.id}
            />
          </div>
        </div>
        <Link className="creator-line" href={`/creators/${creator.id}`}>
          <Image src={creator.avatar} width={24} height={24} alt="" />
          <span>{creator.name}</span>
        </Link>
        <div className="tag-row">
          {work.tags.map((tag) => (
            <Link className="small-pill" href={`/tags/${tagToSlug(tag)}`} key={tag}>
              {tag}
            </Link>
          ))}
        </div>
        <div className="metric-row">
          <Link className="play-link" href={`/play/${work.id}`}>
            <Play size={14} aria-hidden="true" />
            Try
          </Link>
        </div>
      </div>
    </article>
  );
}
