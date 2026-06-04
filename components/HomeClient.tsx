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
        <p>No public works yet. Be the first to submit one.</p>
        <Link className="solid-button" href="/upload">
          Submit Work
        </Link>
      </section>
    );
  }

  return (
    <section className="feed-layout">
      <aside className="sidebar surface">
        <div className="sidebar-title">Categories</div>
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
              <span className="section-kicker">Today&apos;s Pick</span>
              <h1 className="headline">oeeco</h1>
              <p className="lede">
                A global gallery for AI-made games, web tools, interactive pages, and playful experiments. Submit
                your work, let people open it instantly, and help the next weird little web thing get discovered.
              </p>
            </div>
            <div>
              <div className="action-row">
                <Link className="solid-button" href="/upload">
                  <Upload size={17} aria-hidden="true" />
                  Submit Work
                </Link>
                <Link className="ghost-button" href={`/play/${featured.id}`}>
                  <Play size={17} aria-hidden="true" />
                  Try Featured
                </Link>
              </div>
              <div className="metric-strip">
                <div className="metric-box">
                  <strong>12.6k</strong>
                  <span>plays this week</span>
                </div>
                <div className="metric-box">
                  <strong>438</strong>
                  <span>creators</span>
                </div>
                <div className="metric-box">
                  <strong>{initialWorks.length}</strong>
                  <span>works</span>
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
          <div className="segmented" aria-label="Sort works">
            {[
              ["featured", "Featured"],
              ["hot", "Hot"],
              ["new", "New"],
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
          <div className="result-count">{filteredWorks.length} works</div>
        </div>

        {filteredWorks.length ? (
          <section className="grid">
            {filteredWorks.map((work) => (
              <WorkCard work={work} key={work.id} />
            ))}
          </section>
        ) : (
          <section className="empty-state surface">
            <h1 className="page-title">No matching works yet</h1>
            <p>Try another keyword, category, or sort option.</p>
          </section>
        )}
      </div>
    </section>
  );
}
