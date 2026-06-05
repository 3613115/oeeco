import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { WorkCard } from "@/components/WorkCard";
import { searchWorks } from "@/lib/discovery";
import { getAllPublicWorks } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search oeeco works by title, creator, category, tag, or tool.",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const allWorks = await getAllPublicWorks();
  const results = searchWorks(allWorks, query);

  return (
    <section className="discovery-page">
      <div className="discovery-heading surface">
        <span className="section-kicker">Search</span>
        <h1 className="page-title">{query ? `Results for "${query}"` : "Search oeeco"}</h1>
        <p>Find games, tools, interactive pages, creators, tags, and AI experiments across oeeco.</p>
        <form className="search-page-form" action="/search">
          <label className="field search-page-field">
            <span>Search query</span>
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Try Codex, React, games, productivity..."
            />
          </label>
          <button className="solid-button" type="submit">
            <Search size={17} aria-hidden="true" />
            Search
          </button>
        </form>
      </div>

      {results.length ? (
        <>
          <div className="filter-row">
            <span className="result-count">
              {query ? `${results.length} matching works` : `${results.length} public works`}
            </span>
            <Link className="ghost-button" href="/latest">
              Browse Latest
            </Link>
          </div>
          <section className="grid">
            {results.map((work) => (
              <WorkCard work={work} key={work.id} />
            ))}
          </section>
        </>
      ) : (
        <section className="empty-state surface">
          <h2>No matching works</h2>
          <p>Try a broader word, browse the latest works, or submit a project that belongs here.</p>
          <div className="action-row">
            <Link className="solid-button" href="/latest">
              Browse Latest
            </Link>
            <Link className="ghost-button" href="/upload">
              Submit Work
            </Link>
          </div>
        </section>
      )}
    </section>
  );
}
