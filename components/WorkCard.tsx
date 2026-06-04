"use client";

import { Heart, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatNumber, getWorkCreator, type Work } from "@/lib/data";

export function WorkCard({ work }: { work: Work }) {
  const [liked, setLiked] = useState(false);
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
          <button
            className="icon-button like-button"
            type="button"
            aria-label="喜欢"
            onClick={() => setLiked((value) => !value)}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
        <Link className="creator-line" href={`/creators/${creator.id}`}>
          <Image src={creator.avatar} width={24} height={24} alt="" />
          <span>{creator.handle}</span>
        </Link>
        <div className="tag-row">
          {work.tags.map((tag) => (
            <span className="small-pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="metric-row">
          <span>{formatNumber(work.views)} 浏览</span>
          <span>{formatNumber(work.likes)} 喜欢</span>
          <Link className="play-link" href={`/play/${work.id}`}>
            <Play size={14} aria-hidden="true" />
            试玩
          </Link>
        </div>
      </div>
    </article>
  );
}
