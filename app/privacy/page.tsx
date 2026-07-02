import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Read the oeeco privacy overview for accounts, submissions, analytics, and contact information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Privacy</span>
      <h1 className="page-title">Privacy overview</h1>
      <p>
        This page explains the basic information oeeco may collect as an early-stage creative platform. It is intended
        as a clear product policy, not as a substitute for legal advice.
      </p>

      <section className="info-section">
        <h2>Information we use</h2>
        <ul className="info-list">
          <li>Account information, such as email address and profile details, when you sign in or submit work.</li>
          <li>Submission information, such as titles, summaries, tags, creator notes, cover URLs, and demo URLs.</li>
          <li>Basic usage information needed to operate, protect, and improve the site.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>How it is used</h2>
        <ul className="info-list">
          <li>To publish and display approved works.</li>
          <li>To review submissions, prevent abuse, and keep unsafe links off the platform.</li>
          <li>To understand whether pages are working and which parts of the site need improvement.</li>
          <li>To support basic account features such as creator identity, submission history, and work management.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Public content</h2>
        <p>
          Published work pages, creator profiles, tags, summaries, and playable links are public. Do not submit private,
          confidential, or sensitive information that should not appear on the open web.
        </p>
      </section>

      <section className="info-section">
        <h2>Contact and removal</h2>
        <p>
          If a published work includes private information, unsafe links, or content you believe should be removed, use the
          contact page to request review. Include the relevant work URL and a clear explanation of the issue.
        </p>
      </section>

      <section className="info-section">
        <h2>Advertising and third-party services</h2>
        <p>
          oeeco may use third-party services for hosting, authentication, analytics, security, and advertising. These
          services may process technical information such as browser, device, page, and interaction data according to
          their own policies.
        </p>
      </section>

      <section className="info-section">
        <h2>Data choices</h2>
        <p>
          Creators should avoid submitting confidential information. If you need a public listing updated, hidden, or
          reviewed, contact the site owner with the affected work URL.
        </p>
      </section>
    </article>
  );
}
