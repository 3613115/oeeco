import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, Tag, UserRound } from "lucide-react";
import { blogAuthor, getAllBlogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read oeeco essays and guides about AI-made web works, Codex workflows, interactive tools, browser games, and creator publishing.",
  alternates: {
    canonical: "/blog",
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
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="blog-page">
      <div className="blog-hero surface">
        <span className="section-kicker">oeeco Blog</span>
        <h1 className="page-title">Notes on AI-made web works</h1>
        <p>
          Guides, essays, and practical publishing notes for creators building browser games, interactive tools,
          visual experiments, and small software artifacts with AI-assisted workflows.
        </p>
      </div>

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
