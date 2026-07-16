import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, Tag, UserRound } from "lucide-react";
import { blogAuthor, getAllBlogPosts } from "@/lib/blog-posts";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read oeeco essays and guides about AI-made web works, Codex workflows, interactive tools, browser games, and creator publishing.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  openGraph: {
    title: "oeeco Blog",
    description:
      "Guides and essays about AI-made web works, Codex workflows, interactive tools, browser games, and creator publishing.",
    url: "/blog",
    type: "website",
  },
};

const topicGroups = [
  {
    title: "Creator submissions",
    description: "Prepare safer, clearer AI-made web works for review and publication.",
    links: [
      ["Submission guide", "/blog/how-to-submit-ai-made-web-work-to-oeeco"],
      ["Submission guidelines", "/guidelines"],
      ["Submit a work", "/upload"],
    ],
  },
  {
    title: "Browser games",
    description: "Learn what makes small AI-assisted games playable, readable, and worth replaying.",
    links: [
      ["Game quality checklist", "/blog/what-makes-a-good-ai-made-browser-game"],
      ["Game category", "/categories/game"],
      ["Orbital Salvage", "/demos/orbital-salvage"],
    ],
  },
  {
    title: "Interactive tools",
    description: "Turn prompts and workflows into useful browser tools people can test on their own material.",
    links: [
      ["Prompt to web tool", "/blog/turn-a-prompt-into-a-playable-web-tool"],
      ["Tool category", "/categories/tool"],
      ["Customer Interview Signal Lab", "/demos/customer-interview-signal-lab"],
    ],
  },
  {
    title: "Review and trust",
    description: "Understand oeeco's publishing standards, safety expectations, and editorial approach.",
    links: [
      ["Review process", "/blog/how-oeeco-reviews-ai-made-works"],
      ["Editorial policy", "/editorial-policy"],
      ["Safety checklist", "/blog/checklist-for-publishing-safe-interactive-web-projects"],
    ],
  },
];

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteName} Blog`,
    url: absoluteUrl("/blog"),
    description:
      "Guides and essays about AI-made web works, Codex workflows, interactive tools, browser games, and creator publishing.",
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
      author: {
        "@type": "Organization",
        name: blogAuthor,
      },
    })),
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "oeeco blog articles",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blog/${post.slug}`),
      name: post.title,
    })),
  };

  return (
    <section className="blog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="blog-hero surface">
        <span className="section-kicker">oeeco Blog</span>
        <h1 className="page-title">Notes on AI-made web works</h1>
        <p>
          Guides, essays, and practical publishing notes for creators building browser games, interactive tools,
          visual experiments, and small software artifacts with AI-assisted workflows.
        </p>
        <div className="blog-hero-actions">
          <Link className="solid-button" href="/upload">
            Submit a work
          </Link>
          <Link className="ghost-button" href="/guidelines">
            Submission guidelines
          </Link>
          <Link className="ghost-button" href="/blog/rss.xml">
            RSS feed
          </Link>
        </div>
      </div>

      <section className="blog-topic-hub surface" aria-labelledby="blog-topics-heading">
        <div>
          <span className="section-kicker">Start here</span>
          <h2 id="blog-topics-heading">Explore by topic</h2>
          <p>Follow the main oeeco themes: submissions, playable games, useful tools, and trustworthy review.</p>
        </div>
        <div className="blog-topic-grid">
          {topicGroups.map((group) => (
            <article className="blog-topic-card" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <div>
                {group.links.map(([label, href]) => (
                  <Link href={href} key={href}>
                    {label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {featured && (
        <article className="blog-featured surface">
          <div>
            <span className="blog-category">{featured.category}</span>
            <h2>
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p>{featured.description}</p>
            <div className="blog-meta">
              <span>
                <UserRound size={15} aria-hidden="true" />
                {blogAuthor}
              </span>
              <span>
                <CalendarDays size={15} aria-hidden="true" />
                {featured.date}
              </span>
              <span>
                <Clock size={15} aria-hidden="true" />
                {featured.readingTime}
              </span>
            </div>
          </div>
          <Link className="solid-button" href={`/blog/${featured.slug}`}>
            Read article
          </Link>
        </article>
      )}

      <div className="blog-grid">
        {rest.map((post) => (
          <article className="blog-card surface" key={post.slug}>
            <span className="blog-category">{post.category}</span>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.description}</p>
            <div className="blog-meta">
              <span>
                <UserRound size={15} aria-hidden="true" />
                {blogAuthor}
              </span>
              <span>
                <CalendarDays size={15} aria-hidden="true" />
                {post.date}
              </span>
              <span>
                <Clock size={15} aria-hidden="true" />
                {post.readingTime}
              </span>
            </div>
            <div className="blog-tags" aria-label="Article tags">
              {post.tags.slice(0, 4).map((tag) => (
                <span key={tag}>
                  <Tag size={13} aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
