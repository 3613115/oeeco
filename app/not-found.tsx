import Link from "next/link";

export default function NotFound() {
  return (
    <section className="empty-state surface">
      <h1 className="page-title">Page not found</h1>
      <p>Head back to Explore and find something else to try.</p>
      <Link className="solid-button" href="/">
        Back to Explore
      </Link>
    </section>
  );
}
