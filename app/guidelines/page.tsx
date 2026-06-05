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
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/upload">
          Submit Work
        </Link>
        <Link className="ghost-button" href="/terms">
          Terms
        </Link>
      </div>
    </article>
  );
}
