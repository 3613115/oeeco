import { ArrowRight, Play, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WorkShareButton } from "@/components/WorkShareButton";
import { getWorkCreator, type Work } from "@/lib/data";
import { getAllPublicWorks } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Browse oeeco works ordered by recorded platform activity.",
  alternates: {
    canonical: "/rank",
  },
};

export default async function RankPage() {
  const works = await getAllPublicWorks();
  const topWorks = [...works].sort((a, b) => getRankScore(b) - getRankScore(a)).slice(0, 12);

  return (
    <section className="leaderboard surface">
      <div className="leaderboard-heading">
        <div>
          <span className="section-kicker">
            <Trophy size={15} aria-hidden="true" />
            Leaderboard
          </span>
          <h1 className="page-title">Explore the leaderboard</h1>
          <p>
            Ordered by recorded platform activity. Counts may include repeat visits and do not represent unique
            visitors or verified engagement.
          </p>
        </div>
        <Link className="solid-button" href="/latest">
          Browse Latest
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      {topWorks.length ? (
        <div className="leader-list">
          {topWorks.map((work, index) => (
            <RankRow index={index} work={work} key={work.id} />
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <h2>No ranked works yet</h2>
          <p>Published works will appear here.</p>
          <Link className="solid-button" href="/upload">
            Submit Work
          </Link>
        </section>
      )}
    </section>
  );
}

function RankRow({ index, work }: { index: number; work: Work }) {
  const creator = getWorkCreator(work);

  return (
    <article className="leader-row">
      <span className="rank-number">{String(index + 1).padStart(2, "0")}</span>
      <Link className="rank-cover" href={`/works/${work.id}`}>
        <Image src={work.cover} width={96} height={60} alt="" />
      </Link>
      <div className="rank-main">
        <Link href={`/works/${work.id}`}>
          <strong>{work.title}</strong>
        </Link>
        <span>
          {creator.name} / {work.type}
        </span>
      </div>
      <div className="rank-actions">
        <WorkShareButton
          className="icon-button share-button"
          iconOnly
          summary={work.summary}
          title={work.title}
          url={`/works/${work.id}`}
          workId={work.id}
        />
        <Link className="play-link" href={`/play/${work.id}`}>
          <Play size={14} aria-hidden="true" />
          Try
        </Link>
      </div>
    </article>
  );
}

function getRankScore(work: Work) {
  return (
    work.tryClicks * 12 +
    work.demoOpens * 8 +
    work.shares * 10 +
    work.views * 2 +
    work.likes * 4 +
    work.collections * 3
  );
}
