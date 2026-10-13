import { Info, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayRunner } from "@/components/PlayRunner";
import { WorkReportButton } from "@/components/WorkReportButton";
import { getPlayPreviewHtml } from "@/lib/play-preview";
import { getRunnerPolicy } from "@/lib/play-runner";
import { works } from "@/lib/data";
import { getPublicWork, recordWorkEngagement } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const work = await getPublicWork(id);

  if (!work) {
    return {
      title: "Work not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Try ${work.title}`,
    description: work.summary,
    alternates: {
      canonical: `/works/${work.id}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getPublicWork(id);

  if (!work) {
    notFound();
  }

  await recordWorkEngagement(work.id, "try");

  const runnerPolicy = getRunnerPolicy(work.demoUrl);
  const instructions = work.detail?.trim();
  const hasInstructions = instructions && instructions !== work.summary?.trim();

  return (
    <section className="play-page">
      <div className="play-top">
        <div>
          <span className="section-kicker">{work.type}</span>
          <h1 className="page-title">{work.title}</h1>
        </div>
        <div className="action-row">
          <Link className="ghost-button" href={`/works/${work.id}`}>
            <Info size={17} aria-hidden="true" />
            Details
          </Link>
        </div>
      </div>
      {hasInstructions && runnerPolicy.status !== "held" ? (
        <div className="play-instructions">
          <h2>How to use</h2>
          <p>{instructions}</p>
        </div>
      ) : null}
      {runnerPolicy.status === "held" ? (
        <div className="play-window">
          <div className="play-fallback">
            <Shield size={28} aria-hidden="true" />
            <h2>Preview held for safety</h2>
            <p>{runnerPolicy.adminHelper}</p>
            <Link className="ghost-button" href={`/works/${work.id}`}>
              Review Details
            </Link>
            <WorkReportButton context="play" label="Report Issue" work={work} />
          </div>
        </div>
      ) : (
        <PlayRunner
          key={`${work.id}:${runnerPolicy.playableUrl}`}
          originLabel={runnerPolicy.originLabel}
          playableDemoUrl={runnerPolicy.playableUrl}
          previewHtml={getPlayPreviewHtml(work)}
          title={work.title}
          workId={work.id}
        />
      )}
    </section>
  );
}
