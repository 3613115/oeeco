import { Info, Shield, Upload } from "lucide-react";
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
          <Link className="solid-button" href="/upload">
            <Upload size={17} aria-hidden="true" />
            Submit Work
          </Link>
        </div>
      </div>
      <div className="play-runner-bar">
        <span>
          <Shield size={16} aria-hidden="true" />
          {runnerPolicy.label}
        </span>
      </div>

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
          detailsHref={`/works/${work.id}`}
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
