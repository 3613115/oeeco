import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what oeeco is building for AI-made web works and the creators behind them.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">About oeeco</span>
      <h1 className="page-title">A gallery for AI-made web works</h1>
      <p>
        oeeco is a place to discover small, playable, and useful things made with AI-assisted workflows: browser games,
        web tools, interactive stories, visual experiments, and early product ideas.
      </p>
      <p>
        The goal is simple: help creators share finished work in a format people can open immediately, then make it
        easier for good experiments to be found, discussed, and improved.
      </p>

      <section className="info-section">
        <h2>Who it is for</h2>
        <div className="info-grid">
          <div>
            <h3>Creators</h3>
            <p>Submit projects, explain how they were made, and build a public body of work.</p>
          </div>
          <div>
            <h3>Viewers</h3>
            <p>Explore AI-made games, tools, and interactive pages without digging through scattered links.</p>
          </div>
          <div>
            <h3>Builders</h3>
            <p>Study patterns, prototypes, and workflows that can inspire the next useful web thing.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>How oeeco works</h2>
        <ol className="info-list">
          <li>Creators submit a work with a title, short summary, category, tags, and playable URL.</li>
          <li>Submissions enter review so unsafe, misleading, or low-quality links can be filtered before publication.</li>
          <li>Published works appear in Explore, detail pages, playable preview pages, and the sitemap.</li>
        </ol>
      </section>

      <section className="info-section">
        <h2>What makes a work useful</h2>
        <p>
          oeeco favors works that can be understood quickly, opened safely, and tried without installing anything. A
          strong listing explains what the project does, who should try it, what tools were used, and why the result is
          more than a placeholder link.
        </p>
        <div className="info-grid">
          <div>
            <h3>Playable first</h3>
            <p>Games and tools should give visitors an immediate interactive result in the browser.</p>
          </div>
          <div>
            <h3>Clearly described</h3>
            <p>Each published work needs a title, summary, category, tags, and visible creator attribution.</p>
          </div>
          <div>
            <h3>Reviewed before reach</h3>
            <p>New submissions are checked before they become part of the public discovery experience.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Why the platform exists</h2>
        <p>
          Many AI-assisted projects are shared as isolated links that disappear in chat threads, social feeds, or private
          folders. oeeco organizes those experiments into a public shelf so viewers can compare ideas and creators can
          build a reliable portfolio of shipped work.
        </p>
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/upload">
          Submit Work
        </Link>
        <Link className="ghost-button" href="/guidelines">
          Read Guidelines
        </Link>
        <Link className="ghost-button" href="/contact">
          Contact
        </Link>
      </div>
    </article>
  );
}
