import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Tag, UserRound } from "lucide-react";
import { blogAuthor, blogAuthorPath, getAllBlogPosts, getBlogPost } from "@/lib/blog-posts";
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

  const relatedPosts = getAllBlogPosts()
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score:
        item.tags.filter((tag) => post.tags.includes(tag)).length * 3 +
        (item.category === post.category ? 2 : 0) +
        post.relatedLinks.filter((link) => link.href === `/blog/${item.slug}`).length * 4,
    }))
    .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
    .slice(0, 2)
    .map(({ item }) => item);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: blogAuthor,
      url: absoluteUrl(blogAuthorPath),
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(`/blog/${post.slug}`),
      },
    ],
  };

  return (
    <article className="blog-article surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <nav className="blog-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blog">Blog</Link>
      </nav>

      <header className="blog-article-header">
        <span className="blog-category">{post.category}</span>
        <h1 className="page-title">{post.title}</h1>
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

        {(post.testedWith || post.verdict || post.keyTakeaways) && (
          <aside className="blog-article-dossier" aria-label="Article evidence and conclusion">
            {post.testedWith && (
              <div>
                <span>Evidence checked</span>
                <ul>
                  {post.testedWith.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {post.verdict && (
              <div className="blog-article-verdict">
                <span>Editorial verdict</span>
                <p>{post.verdict}</p>
              </div>
            )}
            {post.keyTakeaways && (
              <div>
                <span>What to carry forward</span>
                <ul>
                  {post.keyTakeaways.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}

        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && (
              <ul className="blog-prose-list">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.table && (
              <div className="blog-table-wrap">
                <table>
                  <thead>
                    <tr>
                      {section.table.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, rowIndex) => (
                      <tr key={`${section.heading}-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${cell}-${cellIndex}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.note && (
              <aside className="blog-editor-note">
                <strong>{section.note.label}</strong>
                <p>{section.note.text}</p>
              </aside>
            )}
          </section>
        ))}
      </div>

      <section className="blog-context-links">
        <div>
          <span className="section-kicker">Continue exploring</span>
          <h2>Related oeeco pages</h2>
        </div>
        <div className="blog-context-grid">
          {post.relatedLinks.map((item) => (
            <Link className="blog-context-card" href={item.href} key={item.href}>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="blog-article-footer">
        <div className="blog-cta-panel">
          <div>
            <span className="section-kicker">Build with us</span>
            <h2>Have an AI-made web work ready to share?</h2>
            <p>Submit browser games, tools, visual experiments, and interactive pages that visitors can open safely.</p>
          </div>
          <div className="blog-cta-actions">
            <Link className="solid-button" href="/upload">
              Submit Work
            </Link>
            <Link className="ghost-button" href="/guidelines">
              Read Guidelines
            </Link>
          </div>
        </div>
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
