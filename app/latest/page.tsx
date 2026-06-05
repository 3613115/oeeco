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

export default async function LatestPage() {
  const works = await getAllPublicWorks();

  return (
    <section className="discovery-page">
      <div className="discovery-heading surface">
        <span className="section-kicker">Latest</span>
        <h1 className="page-title">Newest works on oeeco</h1>
        <p>Fresh AI-made games, tools, interactive pages, and experiments sorted by publication date.</p>
      </div>

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
