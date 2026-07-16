import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Tag, UserRound } from "lucide-react";
import { blogAuthor, getAllBlogPosts, getBlogPost } from "@/lib/blog-posts";
import { getAllBlogTopics, getBlogTopic } from "@/lib/blog-topics";
import { absoluteUrl, siteName } from "@/lib/site";

type BlogTopicPageProps = {
  params: Promise<{ topic: string }>;
};

export function generateStaticParams() {
  return getAllBlogTopics().map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: BlogTopicPageProps): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getBlogTopic(topicSlug);

  if (!topic) {
    return {
      title: "Blog Topic Not Found",
    };
  }

  return {
    title: `${topic.title} Articles`,
    description: topic.summary,
    alternates: {
      canonical: `/blog/topics/${topic.slug}`,
    },
    openGraph: {
      title: `${topic.title} Articles | ${siteName}`,
      description: topic.summary,
      url: `/blog/topics/${topic.slug}`,
      type: "website",
    },
  };
}

export default async function BlogTopicPage({ params }: BlogTopicPageProps) {
  const { topic: topicSlug } = await params;
  const topic = getBlogTopic(topicSlug);

  if (!topic) {
    notFound();
  }

  const posts = topic.postSlugs.map((slug) => getBlogPost(slug)).filter((post) => post != null);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${topic.title} articles`,
    description: topic.summary,
    url: absoluteUrl(`/blog/topics/${topic.slug}`),
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };

  return (
    <section className="blog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="blog-hero surface">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
        </nav>
        <span className="section-kicker">Blog Topic</span>
        <h1 className="page-title">{topic.title}</h1>
        <p>{topic.summary}</p>
        <div className="blog-hero-actions">
          {topic.links.map(([label, href]) => (
            <Link className="ghost-button" href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="blog-grid">
        {posts.map((post) => (
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
