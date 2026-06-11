import { ArrowRight, Play, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WorkShareButton } from "@/components/WorkShareButton";
import { formatNumber, getWorkCreator, type Work } from "@/lib/data";
import { getAllPublicWorks } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Explore the most-opened and most-shared AI-made games, tools, interactive pages, and experiments on oeeco.",
  alternates: {
    canonical: "/rank",
  },
};

export default async function RankPage() {
  const works = await getAllPublicWorks();
  const topWorks = [...works].sort((a, b) => getRankScore(b) - getRankScore(a)).slice(0, 12);
  const totals = works.reduce(
    (acc, work) => ({
      views: acc.views + work.views,
      tries: acc.tries + work.tryClicks,
      shares: acc.shares + work.shares,
    }),
    { views: 0, tries: 0, shares: 0 },
  );

  return (
    <section className="leaderboard surface">
      <div className="leaderboard-heading">
        <div>
          <span className="section-kicker">
            <Trophy size={15} aria-hidden="true" />
            Live Leaderboard
          </span>
          <h1 className="page-title">Works people are opening now</h1>
          <p>
            Ranked with real oeeco activity: TRY starts, work views, shares, likes, and saves. New works can climb as
            people open and pass them around.
          </p>
        </div>
        <Link className="solid-button" href="/latest">
          Browse Latest
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="rank-summary-grid" aria-label="Leaderboard summary">
        <div>
          <span>Ranked works</span>
          <strong>{works.length}</strong>
        </div>
        <div>
          <span>Total TRY opens</span>
          <strong>{formatNumber(totals.tries)}</strong>
        </div>
        <div>
          <span>Total views</span>
          <strong>{formatNumber(totals.views)}</strong>
        </div>
        <div>
          <span>Total shares</span>
          <strong>{formatNumber(totals.shares)}</strong>
        </div>
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
          <p>Publish the first playable work and this page will start ranking real activity.</p>
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
  const score = getRankScore(work);

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
          {creator.handle} / {work.type} / score {formatNumber(score)}
        </span>
        <div className="rank-metrics">
          <span>{formatNumber(work.tryClicks)} TRY</span>
          <span>{formatNumber(work.views)} views</span>
          <span>{formatNumber(work.shares)} shares</span>
        </div>
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
