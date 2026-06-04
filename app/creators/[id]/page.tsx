import { UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WorkCard } from "@/components/WorkCard";
import { creators, formatNumber, works } from "@/lib/data";
import { absoluteUrl, defaultOgImage, siteName } from "@/lib/site";

export function generateStaticParams() {
  return Object.keys(creators).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const creator = creators[id];

  if (!creator) {
    return {
      title: "Creator not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${creator.name} (${creator.handle})`;

  return {
    title,
    description: creator.bio,
    alternates: {
      canonical: `/creators/${creator.id}`,
    },
    openGraph: {
      title,
      description: creator.bio,
      url: `/creators/${creator.id}`,
      siteName,
      images: [creator.avatar || defaultOgImage],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description: creator.bio,
      images: [creator.avatar || defaultOgImage],
    },
  };
}

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = creators[id];

  if (!creator) {
    notFound();
  }

  const creatorWorks = works.filter((work) => work.creatorId === creator.id);
  const likes = creatorWorks.reduce((sum, work) => sum + work.likes, 0);
  const creatorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: creator.name,
    alternateName: creator.handle,
    description: creator.bio,
    image: absoluteUrl(creator.avatar),
    url: absoluteUrl(`/creators/${creator.id}`),
    mainEntityOfPage: absoluteUrl(`/creators/${creator.id}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creatorJsonLd).replace(/</g, "\\u003c") }}
      />
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
              <span>followers</span>
            </div>
            <div className="metric-box">
              <strong>{creatorWorks.length}</strong>
              <span>works</span>
            </div>
            <div className="metric-box">
              <strong>{formatNumber(likes)}</strong>
              <span>likes</span>
            </div>
          </div>
        </div>
        <button className="solid-button" type="button">
          <UserPlus size={17} aria-hidden="true" />
          Follow
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
          <h1 className="page-title">This creator has no public works yet</h1>
        </section>
      )}
    </>
  );
}
