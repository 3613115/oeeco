import type { Metadata } from "next";
import Link from "next/link";
import { WorkCard } from "@/components/WorkCard";
import { getAllPublicWorks } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest Works",
  description: "Browse the newest AI-made games, tools, interactive pages, and experiments on oeeco.",
  alternates: {
    canonical: "/latest",
  },
};

const latestNotes = [
  {
    title: "How this page is sorted",
    body: "Latest works are shown by publication date so visitors can quickly see what has recently passed review or been added to the public gallery.",
  },
  {
    title: "What belongs here",
    body: "oeeco focuses on browser-first AI-made works: playable games, useful tools, interactive pages, visual experiments, and compact workflows that can be opened safely.",
  },
  {
    title: "Why freshness matters",
    body: "A steady latest page helps creators understand the current quality bar and gives returning visitors a practical reason to check back.",
  },
];

export default async function LatestPage() {
  const works = await getAllPublicWorks();

  return (
    <section className="discovery-page">
      <div className="discovery-heading surface">
        <span className="section-kicker">Latest</span>
        <h1 className="page-title">Newest works on oeeco</h1>
        <p>
          Fresh AI-made games, tools, interactive pages, and experiments sorted by publication date. Use this page to
          find newly reviewed browser works, study how creators present their projects, and spot useful patterns for
          your own submissions.
        </p>
      </div>

      <section className="discovery-notes surface" aria-labelledby="latest-quality-heading">
        <div>
          <span className="section-kicker">Discovery notes</span>
          <h2 id="latest-quality-heading">What the latest shelf is for</h2>
          <p>
            The latest feed is intentionally simple: it gives every newly published work a clear place to appear while
            keeping the browsing experience focused on safe, openable web artifacts rather than social-style noise.
          </p>
        </div>
        <div className="discovery-note-grid">
          {latestNotes.map((note) => (
            <article key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
        <div className="discovery-link-row">
          <Link href="/guidelines">Submission guidelines</Link>
          <Link href="/blog/how-to-submit-ai-made-web-work-to-oeeco">Submission guide</Link>
          <Link href="/blog/trust-signals-for-ai-made-content-sites">Trust signals</Link>
        </div>
      </section>

      {works.length ? (
        <section className="grid">
          {works.map((work) => (
            <WorkCard work={work} key={work.id} />
          ))}
        </section>
      ) : (
        <section className="empty-state surface">
          <h2>No public works yet</h2>
          <p>Be the first creator to submit something worth opening.</p>
          <Link className="solid-button" href="/upload">
            Submit Work
          </Link>
        </section>
      )}
    </section>
  );
}
