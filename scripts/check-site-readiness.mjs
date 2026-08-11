const DEFAULT_SITE = "https://oeeco.com";

const site = normalizeSite(process.argv[2] || process.env.SITE_URL || DEFAULT_SITE);

const checks = [
  { path: "/", needle: "oeeco" },
  { path: "/blog", needle: "Explore by topic" },
  { path: "/blog/common-mistakes-in-ai-made-web-work-submissions", needle: "Common Mistakes in AI-Made Web Work Submissions" },
  { path: "/blog/design-the-first-minute-of-an-ai-browser-game", needle: "Design the First Minute of an AI Browser Game" },
  { path: "/blog/how-to-design-inputs-for-ai-made-web-tools", needle: "How to Design Inputs for AI-Made Web Tools" },
  { path: "/blog/trust-signals-for-ai-made-content-sites", needle: "Trust Signals for AI-Made Content Sites" },
  { path: "/blog/orbital-salvage-case-study-ai-browser-game", needle: "Orbital Salvage Case Study" },
  { path: "/blog/customer-interview-signal-lab-editorial-review", needle: "Customer Interview Signal Lab" },
  { path: "/blog/landing-page-copy-doctor-ai-tool-review", needle: "Landing Page Copy Doctor Review" },
  { path: "/blog/one-button-dodge-first-minute-review", needle: "One Button Dodge" },
  { path: "/blog/micro-saas-validation-lab-case-study", needle: "Micro SaaS Validation Lab Case Study" },
  { path: "/blog/rss.xml", needle: "<rss version=\"2.0\">" },
  { label: "sitemap blog posts", path: "/sitemap.xml", needle: "/blog/what-are-ai-made-web-works" },
  { label: "sitemap blog topics", path: "/sitemap.xml", needle: "/blog/topics/browser-games" },
  { label: "sitemap author page", path: "/sitemap.xml", needle: "/authors/oeeco-editorial" },
  { path: "/robots.txt", needle: "sitemap.xml" },
  { path: "/ads.txt", needle: "google.com, pub-5608004759418063, DIRECT" },
  { path: "/about", needle: "A gallery for AI-made web works" },
  { path: "/faq", needle: "Frequently asked questions" },
  { path: "/authors/oeeco-editorial", needle: "oeeco Editorial" },
  { path: "/contact", needle: "Contact" },
  { path: "/editorial-policy", needle: "How oeeco publishes and reviews content" },
  { path: "/guidelines", needle: "Share work people can safely open" },
  { path: "/privacy", needle: "Privacy" },
  { path: "/terms", needle: "Terms" },
  { path: "/upload", needle: "Submit to oeeco" },
  { path: "/latest", needle: "Newest works on oeeco" },
  { path: "/blog/topics/creator-submissions", needle: "Creator submissions" },
  { path: "/blog/topics/browser-games", needle: "Browser games" },
  { path: "/blog/topics/interactive-tools", needle: "Interactive tools" },
  { path: "/blog/topics/review-and-trust", needle: "Review and trust" },
  { path: "/blog/topics/case-studies", needle: "Case studies" },
  { path: "/demos/customer-interview-signal-lab", needle: "Turn messy user interviews into product evidence" },
  { path: "/site-readiness", needle: "AdSense and content readiness checklist" },
];

let failures = 0;

console.log(`Checking ${site}`);

for (const check of checks) {
  const url = `${site}${check.path}`;
  try {
    const response = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    const text = await response.text();
    const ok = response.ok && text.includes(check.needle);

    if (ok) {
      console.log(`OK   ${response.status} ${check.label || check.path}`);
    } else {
      failures += 1;
      console.error(`FAIL ${response.status} ${check.label || check.path} missing: ${check.needle}`);
    }
  } catch (error) {
    failures += 1;
    console.error(`ERR  ${check.label || check.path} ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} readiness check(s) failed.`);
  process.exit(1);
}

console.log("\nAll readiness checks passed.");

function normalizeSite(value) {
  return value.replace(/\/+$/, "");
}
