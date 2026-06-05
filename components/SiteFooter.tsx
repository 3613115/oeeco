import Link from "next/link";

const platformLinks = [
  ["Explore", "/"],
  ["Leaderboard", "/rank"],
  ["Submit Work", "/upload"],
  ["Account", "/account"],
];

const policyLinks = [
  ["About", "/about"],
  ["Submission Guidelines", "/guidelines"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="brand" href="/" aria-label="oeeco home">
          <span className="brand-mark">oe</span>
          <span className="brand-name">oeeco</span>
        </Link>
        <p>AI-made games, tools, interactive pages, and creative experiments worth opening.</p>
      </div>

      <nav className="footer-links" aria-label="Platform links">
        <span>Platform</span>
        {platformLinks.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>

      <nav className="footer-links" aria-label="Policy links">
        <span>Policies</span>
        {policyLinks.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
