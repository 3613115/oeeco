import type { Metadata } from "next";
import Link from "next/link";
import { blogAuthor, blogAuthorDescription, getAllBlogPosts } from "@/lib/blog-posts";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: blogAuthor,
  description: blogAuthorDescription,
  alternates: {
    canonical: "/authors/oeeco-editorial",
  },
  openGraph: {
    title: `${blogAuthor} | ${siteName}`,
    description: blogAuthorDescription,
    url: "/authors/oeeco-editorial",
    type: "profile",
  },
};

export default function OeecoEditorialAuthorPage() {
  const latestPosts = getAllBlogPosts().slice(0, 6);
  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: blogAuthor,
    description: blogAuthorDescription,
    url: absoluteUrl("/authors/oeeco-editorial"),
    mainEntity: {
      "@type": "Organization",
      name: blogAuthor,
      url: absoluteUrl("/authors/oeeco-editorial"),
      parentOrganization: {
        "@type": "Organization",
        name: siteName,
        url: absoluteUrl("/"),
      },
      sameAs: [absoluteUrl("/editorial-policy"), absoluteUrl("/contact")],
    },
  };

  return (
    <article className="info-page surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, "\\u003c") }}
      />

      <span className="section-kicker">Author</span>
      <h1 className="page-title">{blogAuthor}</h1>
      <p>{blogAuthorDescription}</p>

      <section className="info-section">
        <h2>What this author covers</h2>
        <div className="info-grid">
          <div>
            <h3>AI-made web works</h3>
            <p>Definitions, examples, publishing habits, and practical ways to make browser-first projects useful.</p>
          </div>
          <div>
            <h3>Creator submissions</h3>
            <p>Guidance for preparing safe, clear, honest project pages that visitors can open and understand.</p>
          </div>
          <div>
            <h3>Review and trust</h3>
            <p>Editorial standards for curation, link safety, original content, corrections, and platform quality.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Editorial standards</h2>
        <p>
          oeeco articles are written to help real creators and visitors understand AI-assisted games, tools, and
          interactive pages. The editorial team avoids exaggerated claims, keeps recommendations grounded in visible
          product behavior, and updates trust pages as the platform grows.
        </p>
      </section>

      <section className="info-section">
        <h2>Latest articles</h2>
        <div className="info-grid">
          {latestPosts.map((post) => (
            <div key={post.slug}>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2>Contact and corrections</h2>
        <p>
          For editorial questions, corrections, creator concerns, or safety reports, use the public contact page. For a
          fuller description of how oeeco reviews and publishes content, read the editorial policy.
        </p>
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/blog">
          Blog
        </Link>
        <Link className="ghost-button" href="/editorial-policy">
          Editorial Policy
        </Link>
        <Link className="ghost-button" href="/contact">
          Contact
        </Link>
      </div>
    </article>
  );
}
