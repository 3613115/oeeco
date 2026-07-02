"use client";

import { ArrowRight, Gauge, Play, Share2, Sparkles, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { WorkCard } from "@/components/WorkCard";
import { categories, formatNumber, getWorkCreator, getWorkCuration, type CategoryId, type Work } from "@/lib/data";

function HomeTrustSection() {
  return (
    <section className="home-trust-section surface" aria-label="How oeeco reviews and presents works">
      <div className="home-trust-intro">
        <span className="section-kicker">What oeeco is curating</span>
        <h2>Small AI-made works with enough substance to open, try, and learn from</h2>
        <p>
          oeeco is not a link dump. Each public listing is meant to give visitors a clear reason to open the work: a
          playable loop, a useful output, a visual experiment, or a concrete product idea that can run in the browser.
        </p>
      </div>
      <div className="home-trust-grid">
        <article>
          <strong>Reviewed submissions</strong>
          <p>New works can be held for review, edited for clearer metadata, rejected, or hidden if links become unsafe.</p>
        </article>
        <article>
          <strong>Playable first</strong>
          <p>TRY pages prioritize browser-safe demos so visitors can inspect the experience before leaving oeeco.</p>
        </article>
        <article>
          <strong>Creator context</strong>
          <p>Works include categories, tags, tool stack, creator attribution, and public detail pages for discovery.</p>
        </article>
        <article>
          <strong>Useful collection</strong>
          <p>The first shelf focuses on games, tools, AI workflows, and interactive pages that show real build patterns.</p>
        </article>
      </div>
      <div className="home-trust-actions">
        <Link className="ghost-button" href="/about">
          About oeeco
        </Link>
        <Link className="ghost-button" href="/guidelines">
          Review Guidelines
        </Link>
        <Link className="ghost-button" href="/contact">
          Contact
        </Link>
      </div>
    </section>
  );
}

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
  const featuredCuration = featured ? getWorkCuration(featured) : null;
  const query = initialQuery.trim().toLowerCase();

  const latestWorks = useMemo(
    () => [...initialWorks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4),
    [initialWorks],
  );

  const liveCategories = useMemo(() => {
    const counts = new Map<CategoryId, number>();
    for (const work of initialWorks) {
      counts.set(work.category, (counts.get(work.category) || 0) + 1);
    }

    return categories
      .filter(([id]) => id !== "all")
      .map(([id, label]) => ({
        id,
        label,
        count: counts.get(id) || 0,
      }));
  }, [initialWorks]);

  const totals = useMemo(
    () =>
      initialWorks.reduce(
        (acc, work) => ({
          views: acc.views + work.views,
          tryClicks: acc.tryClicks + work.tryClicks,
          demoOpens: acc.demoOpens + work.demoOpens,
          shares: acc.shares + work.shares,
        }),
        { views: 0, tryClicks: 0, demoOpens: 0, shares: 0 },
      ),
    [initialWorks],
  );

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
      <div>
        <section className="empty-state surface">
          <h1 className="page-title">oeeco</h1>
          <p>No public works yet. Be the first to submit one.</p>
          <Link className="solid-button" href="/upload">
            Submit Work
          </Link>
        </section>
        <HomeTrustSection />
      </div>
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
        <section className="home-intro">
          <div>
            <span className="section-kicker">Live Collection</span>
            <h1 className="headline">oeeco</h1>
            <p className="lede">
              A growing gallery of AI-made browser works. The first batch is being curated now, with each piece reviewed
              for a playable TRY experience and a clear creator page.
            </p>
          </div>
          <div className="home-intro-actions">
            <Link className="solid-button" href="/upload">
              <Upload size={17} aria-hidden="true" />
              Submit Work
            </Link>
            <Link className="ghost-button" href="/latest">
              Latest Works
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="home-status-grid" aria-label="oeeco live status">
          <div className="home-status-card">
            <span>Live works</span>
            <strong>{initialWorks.length}</strong>
            <small>Targeting the first 10-20 piece collection</small>
          </div>
          <div className="home-status-card">
            <span>Total views</span>
            <strong>{formatNumber(totals.views)}</strong>
            <small>Measured from public work pages</small>
          </div>
          <div className="home-status-card">
            <span>TRY opens</span>
            <strong>{formatNumber(totals.tryClicks)}</strong>
            <small>Playable sessions started</small>
          </div>
          <div className="home-status-card">
            <span>Shares</span>
            <strong>{formatNumber(totals.shares)}</strong>
            <small>Share button uses and copy fallback</small>
          </div>
        </section>

        <section className="spotlight surface">
          <div className="spotlight-copy">
            <div>
              <span className="section-kicker">{featuredCuration?.label || "Featured Work"}</span>
              <h2>{featured.title}</h2>
              <p className="lede">{featured.summary}</p>
            </div>
            <div>
              <div className="action-row">
                <Link className="solid-button" href={`/play/${featured.id}`}>
                  <Play size={17} aria-hidden="true" />
                  Try Featured
                </Link>
                <Link className="ghost-button" href={`/works/${featured.id}`}>
                  Details
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
              <div className="metric-strip">
                <div className="metric-box">
                  <strong>{formatNumber(featured.views)}</strong>
                  <span>views</span>
                </div>
                <div className="metric-box">
                  <strong>{formatNumber(featured.tryClicks)}</strong>
                  <span>TRY opens</span>
                </div>
                <div className="metric-box">
                  <strong>{formatNumber(featured.demoOpens)}</strong>
                  <span>demo opens</span>
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
                  {featuredCreator.handle} / {featured.summary}
                </span>
              </div>
              <span className="type-pill">{featured.type}</span>
            </div>
          </Link>
        </section>

        <section className="home-curation-grid">
          <div className="home-panel surface">
            <div className="home-panel-heading">
              <span className="section-kicker">
                <Sparkles size={14} aria-hidden="true" />
                Latest Drops
              </span>
              <Link href="/latest">
                View all
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="home-drop-list">
              {latestWorks.map((work) => (
                <Link className="home-drop-item" href={`/works/${work.id}`} key={work.id}>
                  <Image src={work.cover} width={72} height={48} alt="" />
                  <span>
                    <strong>{work.title}</strong>
                    <small>
                      {work.type} / {work.createdAt}
                    </small>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="home-panel surface">
            <div className="home-panel-heading">
              <span className="section-kicker">
                <Gauge size={14} aria-hidden="true" />
                Category Coverage
              </span>
            </div>
            <div className="home-category-grid">
              {liveCategories.map((item) => (
                <button
                  className={category === item.id ? "is-active" : ""}
                  disabled={!item.count}
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  type="button"
                >
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="home-panel surface">
            <div className="home-panel-heading">
              <span className="section-kicker">
                <Share2 size={14} aria-hidden="true" />
                Next Batch
              </span>
            </div>
            <p>
              oeeco is assembling the first public shelf. Add strong playable works, then use admin curation to promote
              the best pieces into the featured slot.
            </p>
            <Link className="ghost-button" href="/upload">
              Submit another work
            </Link>
          </div>
        </section>

        <HomeTrustSection />

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
