import { UserPlus } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WorkCard } from "@/components/WorkCard";
import { creators, formatNumber, works } from "@/lib/data";

export function generateStaticParams() {
  return Object.keys(creators).map((id) => ({ id }));
}

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = creators[id];

  if (!creator) {
    notFound();
  }

  const creatorWorks = works.filter((work) => work.creatorId === creator.id);
  const likes = creatorWorks.reduce((sum, work) => sum + work.likes, 0);

  return (
    <>
      <section className="creator-header surface">
        <div className="creator-card">
          <Image src={creator.avatar} width={128} height={128} alt={creator.name} />
        </div>
        <div className="creator-copy">
          <span className="section-kicker">{creator.handle}</span>
          <h1>{creator.name}</h1>
          <p>{creator.bio}</p>
          <div className="metric-strip">
            <div className="metric-box">
              <strong>{creator.followers}</strong>
              <span>关注者</span>
            </div>
            <div className="metric-box">
              <strong>{creatorWorks.length}</strong>
              <span>作品</span>
            </div>
            <div className="metric-box">
              <strong>{formatNumber(likes)}</strong>
              <span>喜欢</span>
            </div>
          </div>
        </div>
        <button className="solid-button" type="button">
          <UserPlus size={17} aria-hidden="true" />
          关注
        </button>
      </section>
      {creatorWorks.length ? (
        <section className="grid">
          {creatorWorks.map((work) => (
            <WorkCard work={work} key={work.id} />
          ))}
        </section>
      ) : (
        <section className="empty-state surface">
          <h1 className="page-title">这个创作者还没有公开作品</h1>
        </section>
      )}
    </>
  );
}
