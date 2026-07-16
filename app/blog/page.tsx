import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, Tag, UserRound } from "lucide-react";
import { blogAuthor, blogAuthorPath, getAllBlogPosts } from "@/lib/blog-posts";
import { getAllBlogTopics } from "@/lib/blog-topics";
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

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const topicGroups = getAllBlogTopics();
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
        url: absoluteUrl(blogAuthorPath),
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
              <h3>
                <Link href={`/blog/topics/${group.slug}`}>{group.title}</Link>
              </h3>
              <p>{group.description}</p>
              <div>
                <Link href={`/blog/topics/${group.slug}`}>View topic</Link>
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
              <Link href={blogAuthorPath}>
                <UserRound size={15} aria-hidden="true" />
                {blogAuthor}
              </Link>
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
              <Link href={blogAuthorPath}>
                <UserRound size={15} aria-hidden="true" />
                {blogAuthor}
              </Link>
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
