import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { getAllBlogTopics } from "@/lib/blog-topics";
import { googleAdSenseClient } from "@/lib/site";

export const metadata: Metadata = {
  title: "Site Readiness",
  description:
    "Operational readiness checklist for oeeco content quality, AdSense basics, sitemap, RSS, policy pages, and core public routes.",
  alternates: {
    canonical: "/site-readiness",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const policyChecks = [
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Editorial Team", "/authors/oeeco-editorial"],
  ["Editorial Policy", "/editorial-policy"],
  ["Submission Guidelines", "/guidelines"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
];

const discoveryChecks = [
  ["Homepage", "/"],
  ["Blog", "/blog"],
  ["RSS Feed", "/blog/rss.xml"],
  ["Sitemap", "/sitemap.xml"],
  ["Robots", "/robots.txt"],
  ["ads.txt", "/ads.txt"],
];

const productChecks = [
  ["Latest Works", "/latest"],
  ["Leaderboard", "/rank"],
  ["Search", "/search"],
  ["Submit Work", "/upload"],
  ["Account", "/account"],
  ["Customer Interview Signal Lab", "/demos/customer-interview-signal-lab"],
];

export default function SiteReadinessPage() {
  const blogPosts = getAllBlogPosts();
  const blogTopics = getAllBlogTopics();
  const latestPost = blogPosts[0];
  const readinessScore = [
    blogPosts.length >= 42,
    blogTopics.length >= 8,
    Boolean(googleAdSenseClient),
    policyChecks.length >= 7,
    discoveryChecks.length >= 6,
    productChecks.length >= 6,
  ].filter(Boolean).length;

  return (
    <article className="info-page surface">
      <span className="section-kicker">Site Readiness</span>
      <h1 className="page-title">AdSense and content readiness checklist</h1>
      <p>
        This public-safe operational page summarizes the core checks oeeco should pass before AdSense review or major
        promotion. It intentionally avoids secrets, private analytics, database credentials, and user data.
      </p>

      <section className="info-section">
        <h2>Current snapshot</h2>
        <div className="info-grid">
          <div>
            <h3>{blogPosts.length} blog posts</h3>
            <p>Target baseline: 42 original articles spanning field tests, case studies, methods, and editorial notes.</p>
          </div>
          <div>
            <h3>{googleAdSenseClient.replace("ca-", "")}</h3>
            <p>Google AdSense publisher id configured in the site shell.</p>
          </div>
          <div>
            <h3>{blogTopics.length} topic hubs</h3>
            <p>Topic pages organize articles into creator, game, tool, visual, craft, operations, trust, and case-study clusters.</p>
          </div>
          <div>
            <h3>{readinessScore}/6 checks</h3>
            <p>High-level readiness signals for policies, content, topics, discovery, ads, and product routes.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>AdSense basics</h2>
        <ul className="info-list">
          <li>
            `ads.txt` should return the Google seller line for publisher id `pub-5608004759418063`.
          </li>
          <li>Blog pages should provide original explanatory content, visible author context, and internal links.</li>
          <li>Policy and trust pages should be reachable from the footer without requiring login.</li>
          <li>Ads should not be placed close to game controls, deceptive navigation, or primary interaction buttons.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Policy and trust pages</h2>
        <div className="info-grid">
          {policyChecks.map(([label, href]) => (
            <div key={href}>
              <h3>{label}</h3>
              <p>
                <Link href={href}>{href}</Link>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2>Discovery endpoints</h2>
        <div className="info-grid">
          {discoveryChecks.map(([label, href]) => (
            <div key={href}>
              <h3>{label}</h3>
              <p>
                <Link href={href}>{href}</Link>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2>Blog topic hubs</h2>
        <div className="info-grid">
          {blogTopics.map((topic) => (
            <div key={topic.slug}>
              <h3>{topic.title}</h3>
              <p>
                <Link href={`/blog/topics/${topic.slug}`}>{`/blog/topics/${topic.slug}`}</Link>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2>Public product routes</h2>
        <div className="info-grid">
          {productChecks.map(([label, href]) => (
            <div key={href}>
              <h3>{label}</h3>
              <p>
                <Link href={href}>{href}</Link>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2>Latest blog article</h2>
        {latestPost ? (
          <p>
            Latest article:{" "}
            <Link href={`/blog/${latestPost.slug}`}>
              {latestPost.title}
            </Link>
            . Keep publishing focused articles as the platform adds new demos, review rules, and creator workflows.
          </p>
        ) : (
          <p>No blog articles are configured yet.</p>
        )}
      </section>

      <section className="info-section">
        <h2>Command-line check</h2>
        <p>
          Run `npm run check:site` to verify the live public routes, `ads.txt`, RSS, sitemap, and key page content
          signals. Run `npm run check:quality` to crawl sitemap URLs for title, description, canonical, noindex,
          thin-content, and login-wall issues before requesting or retrying AdSense review.
        </p>
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/blog">
          Blog
        </Link>
        <Link className="ghost-button" href="/editorial-policy">
          Editorial Policy
        </Link>
        <Link className="ghost-button" href="/ads.txt">
          ads.txt
        </Link>
      </div>
    </article>
  );
}
