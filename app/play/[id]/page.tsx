import { Info, Upload } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayPreviewHtml } from "@/lib/play-preview";
import { works } from "@/lib/data";
import { getPublicWork } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id }));
}

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getPublicWork(id);

  if (!work) {
    notFound();
  }

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
            详情
          </Link>
          <Link className="solid-button" href="/upload">
            <Upload size={17} aria-hidden="true" />
            上传作品
          </Link>
        </div>
      </div>
      <div className="play-window">
        {work.demoUrl ? (
          <iframe
            className="play-frame"
            title={`${work.title} 试玩`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            src={work.demoUrl}
          />
        ) : (
          <iframe
            className="play-frame"
            title={`${work.title} 试玩`}
            sandbox="allow-scripts"
            srcDoc={getPlayPreviewHtml(work)}
          />
        )}
      </div>
    </section>
  );
}
