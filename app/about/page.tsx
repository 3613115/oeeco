import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Discover oeeco, a platform for browser games, digital tools, and interactive works operated by OEECO LLC.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <article className="info-page surface">
      <span className="section-kicker">Discover. Try. Share.</span>
      <h1 className="page-title">About oeeco</h1>
      <p>
        oeeco is a platform for discovering and trying browser games, practical digital tools, and interactive works.
        It brings together people looking for something useful or engaging and creators building with AI-assisted tools.
      </p>

      <section className="info-section">
        <h2>What We Do</h2>
        <p>
          Browse works, read their descriptions, try them directly in your browser, and share the ones you enjoy.
          Creators can sign in and submit their projects for review before they are published on the platform.
        </p>
      </section>

      <section className="info-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make creative work built with AI assistance easier for real users to discover, experience,
          and share. We want to connect ideas with people who can put them to use.
        </p>
      </section>

      <section className="info-section">
        <h2>About OEECO LLC</h2>
        <p>
          oeeco.com is operated by OEECO LLC, a limited liability company formed in New Mexico, USA, in 2026.
          The company focuses on developing and operating digital products, including oeeco.com.
        </p>
      </section>

      <div className="info-actions">
        <Link className="solid-button" href="/">
          Explore Works
        </Link>
      </div>
    </article>
  );
}
