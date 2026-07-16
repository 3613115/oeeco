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

const tagNotes = [
  {
    title: "What this tag connects",
    body: "Tag pages group works by shared format, workflow, material, or interaction pattern so visitors can compare related AI-made projects without needing to know a creator name first.",
  },
  {
    title: "How to use this shelf",
    body: "Open a few works under the same tag to compare how creators present controls, explain purpose, handle safety, and turn AI-assisted ideas into browser-first artifacts.",
  },
  {
    title: "Submission signal",
    body: "Relevant tags help oeeco review and organize submissions. Use tags that describe the actual work rather than broad keywords that do not match the page.",
  },
];

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
        <p>
          Browse oeeco works connected by the {label} tag. This page helps visitors find related AI-made games, tools,
          interactive pages, and creative experiments by theme instead of only by category.
        </p>
      </div>

      <section className="discovery-notes surface" aria-labelledby={`${slug}-tag-heading`}>
        <div>
          <span className="section-kicker">Tag guide</span>
          <h2 id={`${slug}-tag-heading`}>How to read the {label} tag</h2>
          <p>
            Tags are discovery shortcuts. They connect projects that share a technique, audience, interaction style,
            creative constraint, or AI-assisted workflow, making it easier to study patterns across the gallery.
          </p>
        </div>
        <div className="discovery-note-grid">
          {tagNotes.map((note) => (
            <article key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
        <div className="discovery-link-row">
          <Link href="/blog/what-are-ai-made-web-works">What are web works</Link>
          <Link href="/blog/how-to-submit-ai-made-web-work-to-oeeco">Submission guide</Link>
          <Link href="/guidelines">Guidelines</Link>
        </div>
      </section>

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
