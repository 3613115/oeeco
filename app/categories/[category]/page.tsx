import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkCard } from "@/components/WorkCard";
import { categories, categoryLabels, isCategoryId, type CategoryId } from "@/lib/data";
import { getPublicWorksByCategory } from "@/lib/work-service";

export const dynamic = "force-dynamic";

const categoryDescriptions: Record<Exclude<CategoryId, "all">, string> = {
  game: "Playable AI-made games, casual browser experiments, and interactive game loops.",
  tool: "Useful web tools, productivity surfaces, creator utilities, and compact SaaS experiments.",
  story: "Interactive stories, narrative rooms, audio experiments, and playful web experiences.",
  visual: "Visual pages, data gardens, generative art, and interface experiments built for exploration.",
  ai: "Prompt systems, AI workflows, creative assistants, and experiments that reveal process.",
};

const categoryIds = categories
  .filter((category): category is [Exclude<CategoryId, "all">, string] => category[0] !== "all")
  .map(([id]) => id);

export function generateStaticParams() {
  return categoryIds.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  if (!isCategoryId(category)) {
    return {
      title: "Category not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const label = categoryLabels[category];

  return {
    title: `${label} Works`,
    description: categoryDescriptions[category],
    alternates: {
      canonical: `/categories/${category}`,
    },
    openGraph: {
      title: `${label} Works on oeeco`,
      description: categoryDescriptions[category],
      url: `/categories/${category}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  if (!isCategoryId(category)) {
    notFound();
  }

  const works = await getPublicWorksByCategory(category);
  const label = categoryLabels[category];

  return (
    <section className="discovery-page">
      <div className="discovery-heading surface">
        <span className="section-kicker">Category</span>
        <h1 className="page-title">{label} Works</h1>
        <p>{categoryDescriptions[category]}</p>
      </div>

      {works.length ? (
        <section className="grid">
          {works.map((work) => (
            <WorkCard work={work} key={work.id} />
          ))}
        </section>
      ) : (
        <section className="empty-state surface">
          <h2>No {label.toLowerCase()} works yet</h2>
          <p>Submit a strong project in this category and help shape what oeeco features next.</p>
          <Link className="solid-button" href="/upload">
            Submit Work
          </Link>
        </section>
      )}
    </section>
  );
}
