import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submission Guidelines",
  description: "Read the oeeco submission rules for AI-made games, tools, interactive pages, and experiments.",
  alternates: {
    canonical: "/guidelines",
  },
};

export default function GuidelinesPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Submission Guidelines</span>
      <h1 className="page-title">Share work people can safely open</h1>
      <p>
        oeeco is designed for real, inspectable web works. A good submission gives viewers a clear reason to open it,
        credits the creator, and avoids misleading or harmful links.
      </p>

      <section className="info-section">
        <h2>What fits</h2>
        <ul className="info-list">
          <li>AI-assisted games, browser tools, interactive stories, visual pages, prototypes, and creative experiments.</li>
          <li>Playable or viewable URLs that work in a modern browser without requiring a risky download.</li>
          <li>Original work, properly licensed assets, or clearly credited references.</li>
          <li>Clear summaries, relevant tags, and honest descriptions of what the work does.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>What does not fit</h2>
        <ul className="info-list">
          <li>Malware, phishing, deceptive login flows, forced downloads, or links that hide their destination.</li>
          <li>Copyright, trademark, likeness, or privacy violations.</li>
          <li>Sexual, hateful, violent, scam, or harassment-oriented content.</li>
          <li>Spam submissions, duplicate listings, keyword stuffing, or pages made only to manipulate search results.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Review process</h2>
        <p>
          New submissions may be held for review before publication. oeeco may edit metadata for clarity, reject a work,
          hide a published work, or remove links that become unsafe or unavailable.
        </p>
        <ol className="info-list">
          <li>Metadata is checked for a clear title, honest summary, category, tags, and visible creator context.</li>
          <li>Playable links are checked for basic availability, browser safety, and whether the result matches the listing.</li>
          <li>Works that need fixes may be rejected with a note so the creator can update and resubmit.</li>
          <li>Published works can still be hidden later if the link changes, breaks, or becomes unsafe.</li>
        </ol>
      </section>

      <section className="info-section">
        <h2>Quality expectations</h2>
        <div className="info-grid">
          <div>
            <h3>Enough substance</h3>
            <p>Submissions should have a real interaction, useful output, playable loop, or thoughtful visual result.</p>
          </div>
          <div>
            <h3>Honest presentation</h3>
            <p>Titles and summaries should describe the actual work, not promise unrelated features or outcomes.</p>
          </div>
          <div>
            <h3>Safe browsing</h3>
            <p>Links should not trigger downloads, hide destinations, imitate login pages, or pressure users to share data.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Reporting a problem</h2>
        <p>
          If a public work appears broken, unsafe, misleading, copied without permission, or privacy-invasive, report it
          with the work URL and a short explanation so the site owner can review it.
        </p>
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/upload">
          Submit Work
        </Link>
        <Link className="ghost-button" href="/contact">
          Contact
        </Link>
        <Link className="ghost-button" href="/terms">
          Terms
        </Link>
      </div>
    </article>
  );
}
