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

const categoryGuidance: Record<
  Exclude<CategoryId, "all">,
  {
    overview: string;
    notes: { title: string; body: string }[];
    links: [string, string][];
  }
> = {
  game: {
    overview:
      "Game works are reviewed for readable loops, clear controls, fair failure, mobile awareness, and replay value. A small game can be worth featuring when the first minute teaches the goal and invites another run.",
    notes: [
      {
        title: "Playable first",
        body: "The best game submissions open directly in the browser and let visitors understand the main action without installing anything.",
      },
      {
        title: "Readable feedback",
        body: "Score changes, failure states, restart buttons, and visible controls matter more than adding a large number of unfinished mechanics.",
      },
      {
        title: "Useful study shelf",
        body: "Creators can use this category to study onboarding, control feel, polish, and how AI-assisted prototypes become finished web works.",
      },
    ],
    links: [
      ["Game quality checklist", "/blog/what-makes-a-good-ai-made-browser-game"],
      ["First-minute design", "/blog/design-the-first-minute-of-an-ai-browser-game"],
      ["Submit a game", "/upload"],
    ],
  },
  tool: {
    overview:
      "Tool works are reviewed for a clear job, realistic inputs, useful outputs, and honest limits. A strong tool helps visitors complete one focused workflow instead of only showing a static demo.",
    notes: [
      {
        title: "Narrow promise",
        body: "Useful tools usually handle one moment well: scoring notes, drafting prompts, checking launch readiness, or diagnosing copy.",
      },
      {
        title: "Practical inputs",
        body: "Good tools ask for material visitors already have, such as rough notes, draft headlines, constraints, or product ideas.",
      },
      {
        title: "Repeat value",
        body: "A tool is stronger when visitors can return with new material and get another actionable result.",
      },
    ],
    links: [
      ["Input design guide", "/blog/how-to-design-inputs-for-ai-made-web-tools"],
      ["Useful tool examples", "/blog/examples-of-useful-ai-made-tools"],
      ["Submit a tool", "/upload"],
    ],
  },
  story: {
    overview:
      "Interactive works include narrative pages, playful rooms, audio-led experiments, and small experiences where visitor choices shape what happens next. The category rewards clarity, mood, and meaningful interaction.",
    notes: [
      {
        title: "Interaction should matter",
        body: "A strong interactive page gives visitors something to choose, adjust, reveal, explore, or affect rather than only reading a static scene.",
      },
      {
        title: "Context helps trust",
        body: "Short creator notes, honest descriptions, and visible controls help visitors understand what they are opening.",
      },
      {
        title: "Small can be complete",
        body: "A compact interaction with a clear beginning and result can feel more finished than a large unfinished narrative system.",
      },
    ],
    links: [
      ["Publishing checklist", "/blog/ai-web-app-publishing-checklist"],
      ["Safe project checklist", "/blog/checklist-for-publishing-safe-interactive-web-projects"],
      ["Submit an interactive work", "/upload"],
    ],
  },
  visual: {
    overview:
      "Visual works include generative pages, data gardens, poster makers, simulations, and interface experiments. They should show a distinct visual result and give visitors enough control or context to understand the piece.",
    notes: [
      {
        title: "Show the actual result",
        body: "Visual submissions should reveal the thing visitors can inspect, generate, or manipulate, not only describe it.",
      },
      {
        title: "Keep controls legible",
        body: "Sliders, buttons, presets, and export actions should be easy to find and should not overlap the visual output.",
      },
      {
        title: "Explain the frame",
        body: "A short explanation of the idea, inputs, or creative constraint helps a visual experiment feel intentional.",
      },
    ],
    links: [
      ["What are web works", "/blog/what-are-ai-made-web-works"],
      ["Publishing checklist", "/blog/ai-web-app-publishing-checklist"],
      ["Submit a visual work", "/upload"],
    ],
  },
  ai: {
    overview:
      "AI experiment works show prompt systems, agent workflows, creative assistants, model-powered utilities, and process-driven interfaces. The strongest examples make the workflow visible and keep claims grounded.",
    notes: [
      {
        title: "Make the process visible",
        body: "Visitors should be able to understand what the AI-assisted workflow does, what inputs it uses, and what output they receive.",
      },
      {
        title: "Avoid exaggerated claims",
        body: "Trustworthy AI experiments describe their limits and frame generated output as a draft, signal, score, or helper when appropriate.",
      },
      {
        title: "Turn prompts into artifacts",
        body: "A reusable browser surface is usually more valuable than a screenshot of a prompt because visitors can test it with their own material.",
      },
    ],
    links: [
      ["Prompt to web tool", "/blog/turn-a-prompt-into-a-playable-web-tool"],
      ["Trust signals", "/blog/trust-signals-for-ai-made-content-sites"],
      ["Submit an AI experiment", "/upload"],
    ],
  },
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
  const guidance = categoryGuidance[category];

  return (
    <section className="discovery-page">
      <div className="discovery-heading surface">
        <span className="section-kicker">Category</span>
        <h1 className="page-title">{label} Works</h1>
        <p>
          {categoryDescriptions[category]} {guidance.overview}
        </p>
      </div>

      <section className="discovery-notes surface" aria-labelledby={`${category}-quality-heading`}>
        <div>
          <span className="section-kicker">Quality notes</span>
          <h2 id={`${category}-quality-heading`}>How oeeco reads this category</h2>
          <p>{guidance.overview}</p>
        </div>
        <div className="discovery-note-grid">
          {guidance.notes.map((note) => (
            <article key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
        <div className="discovery-link-row">
          {guidance.links.map(([text, href]) => (
            <Link href={href} key={href}>
              {text}
            </Link>
          ))}
        </div>
      </section>

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
