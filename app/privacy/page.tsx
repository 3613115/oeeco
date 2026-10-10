import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Learn how OEECO LLC handles account, submission, usage, and advertising information on oeeco.com.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Privacy</span>
      <h1 className="page-title">Privacy Policy</h1>
      <p>
        OEECO LLC operates oeeco.com. This page explains how information is handled when you browse works, sign in,
        or submit a work for review.
      </p>

      <section className="info-section">
        <h2>Information we handle</h2>
        <ul className="info-list">
          <li>Email address and account or profile details when you sign in with an email link or Google and use creator features.</li>
          <li>Work submissions, including titles, descriptions, categories, tags, creator notes, cover images, and demo links.</li>
          <li>Work-level activity counts, including views, TRY visits, and clicks on tracked external links.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>How it is used</h2>
        <ul className="info-list">
          <li>To provide sign-in and creator account features.</li>
          <li>To review submissions and display approved works with creator attribution.</li>
          <li>To maintain work listings and understand how visitors interact with them.</li>
          <li>To review content reports and platform requests.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Public content</h2>
        <p>
          Published work pages, creator profiles, descriptions, tags, cover images, and demo links are public. Do not
          submit private or sensitive information that should not appear on the open web.
        </p>
      </section>

      <section className="info-section">
        <h2>Browser storage</h2>
        <p>
          Sign-in sessions and unfinished submission drafts can be stored in your browser. Some games may also save
          local progress, such as a best score, on your device.
        </p>
      </section>

      <section className="info-section">
        <h2>Service providers and advertising</h2>
        <p>
          oeeco.com uses Vercel for hosting, Supabase for accounts and work data, and Google for optional sign-in and
          AdSense advertising. These providers may process technical information under their own policies. Google and
          other advertising partners may use cookies or similar identifiers to serve and measure ads based on visits to
          this or other sites. You can manage personalized ads in{" "}
          <a href="https://adssettings.google.com/" rel="noopener noreferrer" target="_blank">
            Google Ads Settings
          </a>
          .
        </p>
      </section>

      <section className="info-section">
        <h2>Questions and removal requests</h2>
        <p>
          To request a review, correction, or removal of public content, email{" "}
          <a href="mailto:contact@oeeco.com">contact@oeeco.com</a> with the relevant URL and details.
        </p>
      </section>
    </article>
  );
}
