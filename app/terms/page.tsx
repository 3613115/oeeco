import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "Read the oeeco terms overview for using and submitting AI-made web works.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Terms</span>
      <h1 className="page-title">Terms overview</h1>
      <p>
        By using oeeco or submitting a work, you agree to use the platform responsibly and to follow the submission
        guidelines. This page describes the operating rules for the current version of oeeco.
      </p>

      <section className="info-section">
        <h2>Your submissions</h2>
        <ul className="info-list">
          <li>You are responsible for the works, links, descriptions, and assets you submit.</li>
          <li>You should have the rights or permission needed to share the submitted content.</li>
          <li>You give oeeco permission to display submitted metadata, covers, and links as part of the platform.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Platform moderation</h2>
        <p>
          oeeco may review, edit metadata, reject, hide, or remove works to protect users, comply with policy, respond
          to reports, or maintain platform quality.
        </p>
      </section>

      <section className="info-section">
        <h2>External links</h2>
        <p>
          Works may link to sites or demos hosted outside oeeco. Creators are responsible for those destinations, and
          viewers should use normal caution when opening external pages.
        </p>
      </section>

      <section className="info-section">
        <h2>Availability</h2>
        <p>
          oeeco is an early-stage platform. Features may change, pages may move, and submissions may be unavailable while
          the product evolves.
        </p>
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/guidelines">
          Submission Guidelines
        </Link>
        <Link className="ghost-button" href="/privacy">
          Privacy
        </Link>
      </div>
    </article>
  );
}
