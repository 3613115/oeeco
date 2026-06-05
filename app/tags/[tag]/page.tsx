import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkCard } from "@/components/WorkCard";
import { getTagDisplayName, getTagSlugs, getWorksByTagSlug, tagToSlug } from "@/lib/discovery";
import { works } from "@/lib/data";
import { getAllPublicWorks } from "@/lib/work-service";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getTagSlugs(works).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const slug = tagToSlug(tag);
  const publicWorks = await getAllPublicWorks();
  const matchingWorks = getWorksByTagSlug(publicWorks, slug);

  if (!matchingWorks.length) {
    return {
      title: "Tag not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const label = getTagDisplayName(slug, publicWorks);
  const title = `${label} Works`;
  const description = `Browse AI-made games, tools, interactive pages, and experiments tagged ${label} on oeeco.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/tags/${slug}`,
    },
    openGraph: {
      title: `${title} on oeeco`,
      description,
      url: `/tags/${slug}`,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const slug = tagToSlug(tag);
  const publicWorks = await getAllPublicWorks();
  const matchingWorks = getWorksByTagSlug(publicWorks, slug);

  if (!matchingWorks.length) {
    notFound();
  }

  const label = getTagDisplayName(slug, publicWorks);

  return (
    <section className="discovery-page">
      <div className="discovery-heading surface">
        <span className="section-kicker">Tag</span>
        <h1 className="page-title">{label} Works</h1>
        <p>Browse oeeco works connected by the {label} tag.</p>
      </div>

      <div className="filter-row">
        <span className="result-count">{matchingWorks.length} tagged works</span>
        <Link className="ghost-button" href="/latest">
          Browse Latest
        </Link>
      </div>

      <section className="grid">
        {matchingWorks.map((work) => (
          <WorkCard work={work} key={work.id} />
        ))}
      </section>
    </section>
  );
}
