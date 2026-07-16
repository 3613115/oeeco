import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "Read oeeco's editorial policy for original blog content, AI-made work curation, safety review, corrections, and creator-focused publishing standards.",
  alternates: {
    canonical: "/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Editorial Policy</span>
      <h1 className="page-title">How oeeco publishes and reviews content</h1>
      <p>
        oeeco publishes original essays, guides, and curated project pages about AI-made web works. The goal is to help
        creators and visitors understand browser games, interactive tools, visual experiments, and AI-assisted workflows
        without turning the site into a thin link directory.
      </p>

      <section className="info-section">
        <h2>Editorial purpose</h2>
        <p>
          oeeco focuses on useful, inspectable web work: projects that people can open, try, and learn from. Blog
          articles are written to explain the category, improve creator submissions, document review standards, and
          connect visitors with practical examples in the gallery.
        </p>
        <div className="info-grid">
          <div>
            <h3>Creator education</h3>
            <p>Guides help builders prepare safer, clearer, and more useful submissions.</p>
          </div>
          <div>
            <h3>Public context</h3>
            <p>Articles explain why a work matters and how AI-assisted workflows change publishing.</p>
          </div>
          <div>
            <h3>Curated discovery</h3>
            <p>Internal links point readers toward relevant demos, categories, guidelines, and submission paths.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Originality and AI assistance</h2>
        <p>
          oeeco may use AI-assisted workflows to draft, structure, edit, or review content, but published pages are
          selected and shaped for the site's specific audience. Articles should provide clear guidance, original framing,
          and practical context rather than generic keyword text.
        </p>
        <ul className="info-list">
          <li>Articles should be relevant to AI-made web works, browser tools, interactive projects, or creator workflows.</li>
          <li>Pages should avoid keyword stuffing, misleading claims, copied material, and unsupported promises.</li>
          <li>When a page links to a demo or category, the link should help the reader continue a real task.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Work review standards</h2>
        <p>
          Public works may be reviewed for availability, safety, metadata clarity, and basic substance before they are
          featured. A project can be small and still be valuable, but it should not mislead visitors or hide risky
          behavior behind a polished interface.
        </p>
        <ol className="info-list">
          <li>The submitted URL should open the described work without surprise downloads or deceptive redirects.</li>
          <li>The title, summary, tags, and creator notes should match the actual experience.</li>
          <li>The page should offer a real interaction, useful output, playable loop, or thoughtful visual result.</li>
          <li>Unsafe, spammy, copied, or misleading submissions may be rejected or hidden.</li>
        </ol>
      </section>

      <section className="info-section">
        <h2>Corrections and updates</h2>
        <p>
          oeeco may update articles, metadata, internal links, and project descriptions as the platform changes. If a
          page contains an error, a broken link, unsafe project behavior, or unclear attribution, visitors and creators
          can contact the site owner for review.
        </p>
      </section>

      <section className="info-section">
        <h2>Advertising and reader trust</h2>
        <p>
          Advertising should not interfere with core interactions, imitate navigation, or pressure visitors into
          accidental clicks. Blog and policy pages should remain readable and useful even when ads are present.
        </p>
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/blog">
          Read Blog
        </Link>
        <Link className="ghost-button" href="/guidelines">
          Submission Guidelines
        </Link>
        <Link className="ghost-button" href="/contact">
          Contact
        </Link>
      </div>
    </article>
  );
}
