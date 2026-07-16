import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Tag, UserRound } from "lucide-react";
import { blogAuthor, getAllBlogPosts, getBlogPost } from "@/lib/blog-posts";
import { absoluteUrl, siteName } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      siteName,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getAllBlogPosts().filter((item) => item.slug !== post.slug).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: blogAuthor,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };

  return (
    <article className="blog-article surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Link className="blog-back-link" href="/blog">
        Back to Blog
      </Link>

      <header className="blog-article-header">
        <span className="blog-category">{post.category}</span>
        <h1 className="page-title">{post.title}</h1>
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
          {post.tags.map((tag) => (
            <span key={tag}>
              <Tag size={13} aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="blog-prose">
        {post.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>

      <footer className="blog-article-footer">
        <div>
          <span className="section-kicker">Keep exploring</span>
          <h2>Related oeeco reading</h2>
        </div>
        <div className="blog-related-grid">
          {relatedPosts.map((related) => (
            <Link className="blog-related-card" href={`/blog/${related.slug}`} key={related.slug}>
              <span>{related.category}</span>
              <strong>{related.title}</strong>
              <small>{related.readingTime}</small>
            </Link>
          ))}
        </div>
      </footer>
    </article>
  );
}
