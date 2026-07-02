import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact oeeco for creator support, content review, removal requests, and platform questions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Contact oeeco</span>
      <h1 className="page-title">Questions, reviews, and removal requests</h1>
      <p>
        oeeco is an early-stage gallery for AI-made web works. This contact page explains how creators, viewers, and
        rights holders can ask for help while the platform is still being built.
      </p>

      <section className="info-section">
        <h2>What to contact us about</h2>
        <div className="info-grid">
          <div>
            <h3>Creator support</h3>
            <p>Questions about submitting a work, updating metadata, replacing a demo URL, or hiding a published work.</p>
          </div>
          <div>
            <h3>Content review</h3>
            <p>Reports about unsafe links, misleading pages, broken playable previews, spam, or policy concerns.</p>
          </div>
          <div>
            <h3>Rights and privacy</h3>
            <p>Removal requests involving copyrighted assets, trademarks, personal information, or unauthorized use.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>What to include</h2>
        <ul className="info-list">
          <li>The oeeco work URL or demo URL related to your request.</li>
          <li>A short explanation of the problem or requested change.</li>
          <li>For rights or privacy requests, include enough detail for the site owner to identify the affected content.</li>
          <li>For creator requests, use the same account identity that submitted the work whenever possible.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Response priority</h2>
        <p>
          Safety, privacy, copyright, and broken-link reports are reviewed first. General product feedback and feature
          requests are collected as part of the ongoing roadmap.
        </p>
      </section>

      <section className="info-section">
        <h2>Useful links</h2>
        <div className="info-actions">
          <Link className="solid-button" href="/guidelines">
            Submission Guidelines
          </Link>
          <Link className="ghost-button" href="/privacy">
            Privacy
          </Link>
          <Link className="ghost-button" href="/terms">
            Terms
          </Link>
        </div>
      </section>
    </article>
  );
}
