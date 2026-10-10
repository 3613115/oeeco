import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for exploring and submitting browser-based works on oeeco.com, operated by OEECO LLC.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Terms</span>
      <h1 className="page-title">Terms of Use</h1>
      <p>
        OEECO LLC operates oeeco.com. By using the site or submitting a work, you agree to these terms and the
        submission guidelines.
      </p>

      <section className="info-section">
        <h2>About the platform</h2>
        <p>
          oeeco lets visitors discover and try browser-based games, digital tools, and interactive works. Creators can
          submit works for review; submission does not guarantee publication.
        </p>
      </section>

      <section className="info-section">
        <h2>Your submissions</h2>
        <ul className="info-list">
          <li>You are responsible for the works, links, descriptions, and assets you submit.</li>
          <li>You should have the rights or permission needed to share the submitted content.</li>
          <li>You give OEECO LLC permission to review your submission and display its metadata, cover, and links on oeeco if published.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Platform moderation</h2>
        <p>
          OEECO LLC may review, edit metadata, reject, hide, or remove works to respond to reports, enforce these
          terms, or maintain the platform.
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
        <h2>Acceptable use</h2>
        <ul className="info-list">
          <li>Do not submit malware, phishing pages, deceptive redirects, forced downloads, or scam content.</li>
          <li>Do not submit content that infringes another person&apos;s rights or exposes private information.</li>
          <li>Do not use oeeco to harass people, impersonate others, manipulate metrics, or spam search results.</li>
          <li>Do not intentionally bypass review, security, or sandboxing protections.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Advertising</h2>
        <p>
          Advertising may appear on oeeco. Third-party advertising services may use cookies or similar technologies
          as described in our <Link href="/privacy">Privacy Policy</Link>.
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
        <Link className="ghost-button" href="/contact">
          Contact
        </Link>
        <Link className="ghost-button" href="/privacy">
          Privacy
        </Link>
      </div>
    </article>
  );
}
