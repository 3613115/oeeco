"use client";

import { Play, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { WorkCard } from "@/components/WorkCard";
import { categories, getWorkCreator, type CategoryId, type Work } from "@/lib/data";

export function HomeClient({
  initialQuery = "",
  initialWorks,
}: {
  initialQuery?: string;
  initialWorks: Work[];
}) {
  const [category, setCategory] = useState<CategoryId>("all");
  const [sort, setSort] = useState<"featured" | "hot" | "new">("featured");
  const featured = initialWorks[0];
  const featuredCreator = featured ? getWorkCreator(featured) : null;
  const query = initialQuery.trim().toLowerCase();

  const filteredWorks = useMemo(() => {
    const next = initialWorks.filter((work) => {
      const creator = getWorkCreator(work);
      const matchesCategory = category === "all" || work.category === category;
      const text = [work.title, work.type, work.summary, creator.name, creator.handle, ...work.tags]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || text.includes(query));
    });

    if (sort === "hot") {
      return [...next].sort((a, b) => b.likes + b.views * 0.08 - (a.likes + a.views * 0.08));
    }

    if (sort === "new") {
      return [...next].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return next;
  }, [category, initialWorks, query, sort]);

  if (!featured || !featuredCreator) {
    return (
      <section className="empty-state surface">
        <h1 className="page-title">oeeco</h1>
        <p>还没有公开作品，先上传一个吧。</p>
        <Link className="solid-button" href="/upload">
          上传作品
        </Link>
      </section>
    );
  }

  return (
    <section className="feed-layout">
      <aside className="sidebar surface">
        <div className="sidebar-title">分类</div>
        <div className="category-list">
          {categories.map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={category === id ? "is-active" : ""}
              onClick={() => setCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </aside>

      <div>
        <section className="spotlight surface">
          <div className="spotlight-copy">
            <div>
              <span className="section-kicker">今日精选</span>
              <h1 className="headline">oeeco</h1>
              <p className="lede">
                AI 创作者的作品广场。上传小游戏、网页工具、互动实验，让观众直接打开、试玩、收藏和关注。
              </p>
            </div>
            <div>
              <div className="action-row">
                <Link className="solid-button" href="/upload">
                  <Upload size={17} aria-hidden="true" />
                  上传作品
                </Link>
                <Link className="ghost-button" href={`/play/${featured.id}`}>
                  <Play size={17} aria-hidden="true" />
                  试玩精选
                </Link>
              </div>
              <div className="metric-strip">
                <div className="metric-box">
                  <strong>12.6k</strong>
                  <span>本周试玩</span>
                </div>
                <div className="metric-box">
                  <strong>438</strong>
                  <span>创作者</span>
                </div>
                <div className="metric-box">
                  <strong>{initialWorks.length}</strong>
                  <span>作品</span>
                </div>
              </div>
            </div>
          </div>
          <Link className="spotlight-visual" href={`/works/${featured.id}`}>
            <Image src={featured.cover} width={900} height={560} alt={featured.title} priority />
            <div className="spotlight-caption">
              <div>
                <strong>{featured.title}</strong>
                <span>
                  {featuredCreator.handle} · {featured.summary}
                </span>
              </div>
              <span className="type-pill">{featured.type}</span>
            </div>
          </Link>
        </section>

        <div className="filter-row">
          <div className="segmented" aria-label="排序">
            {[
              ["featured", "推荐"],
              ["hot", "热门"],
              ["new", "最新"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={sort === id ? "is-active" : ""}
                onClick={() => setSort(id as "featured" | "hot" | "new")}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="result-count">{filteredWorks.length} 个作品</div>
        </div>

        {filteredWorks.length ? (
          <section className="grid">
            {filteredWorks.map((work) => (
              <WorkCard work={work} key={work.id} />
            ))}
          </section>
        ) : (
          <section className="empty-state surface">
            <h1 className="page-title">暂时没有匹配的作品</h1>
            <p>换个关键词或分类试试。</p>
          </section>
        )}
      </div>
    </section>
  );
}
