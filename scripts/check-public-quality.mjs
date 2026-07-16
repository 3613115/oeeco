const DEFAULT_SITE = "https://oeeco.com";
const MIN_TEXT_LENGTH = 700;
const MIN_DESCRIPTION_LENGTH = 50;
const MIN_SITEMAP_URLS = 35;

const site = normalizeSite(process.argv[2] || process.env.SITE_URL || DEFAULT_SITE);
const origin = new URL(site).origin;
const failures = [];

console.log(`Checking public quality for ${site}`);

const sitemapText = await fetchText("/sitemap.xml");
const sitemapUrls = extractSitemapUrls(sitemapText).filter((url) => {
  const parsed = new URL(url);
  return parsed.origin === origin || parsed.origin === new URL(DEFAULT_SITE).origin;
});

if (sitemapUrls.length < MIN_SITEMAP_URLS) {
  failures.push(`sitemap has only ${sitemapUrls.length} URLs; expected at least ${MIN_SITEMAP_URLS}`);
}

for (const url of sitemapUrls) {
  const path = new URL(url).pathname;
  const result = await fetchPage(path);

  if (!result.ok) {
    failures.push(`${path} returned HTTP ${result.status}`);
    continue;
  }

  const page = analyzeHtml(result.text);
  const normalizedCanonicalPath = page.canonical ? normalizePath(new URL(page.canonical, site).pathname) : "";
  const normalizedPagePath = normalizePath(path);

  if (!page.title) failures.push(`${path} is missing a <title>`);
  if (/not found|not-found|404/i.test(page.title)) failures.push(`${path} title looks like a not-found page`);
  if (page.description.length < MIN_DESCRIPTION_LENGTH) {
    failures.push(`${path} has a short or missing meta description (${page.description.length} chars)`);
  }
  if (!page.canonical) failures.push(`${path} is missing a canonical link`);
  if (page.canonical && normalizedCanonicalPath !== normalizedPagePath) {
    failures.push(`${path} canonical points to ${page.canonical}`);
  }
  if (page.robots.includes("noindex")) failures.push(`${path} is in sitemap but has noindex`);
  if (page.textLength < MIN_TEXT_LENGTH) {
    failures.push(`${path} appears thin (${page.textLength} visible text chars)`);
  }
  if (looksLikeLoginWall(page.visibleText)) failures.push(`${path} looks like a login wall`);

  console.log(`OK   ${path} title=${page.title.length} desc=${page.description.length} text=${page.textLength}`);
}

await checkOperationalRoutes();

if (failures.length > 0) {
  console.error("\nPublic quality checks failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nAll public quality checks passed.");

async function checkOperationalRoutes() {
  const home = await fetchPage("/");
  if (!home.text.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) {
    failures.push("homepage is missing the Google AdSense loader script");
  }

  const adSlots = (home.text.match(/class=["'][^"']*adsbygoogle[^"']*["']/g) || []).length;
  if (adSlots > 0) {
    failures.push(`homepage already contains ${adSlots} rendered AdSense slot(s); review placement manually`);
  }

  const adsTxt = await fetchText("/ads.txt");
  if (!adsTxt.includes("google.com, pub-5608004759418063, DIRECT")) {
    failures.push("ads.txt is missing the expected Google seller line");
  }

  const robots = await fetchText("/robots.txt");
  if (!robots.includes("sitemap.xml")) failures.push("robots.txt does not reference sitemap.xml");

  const readiness = await fetchPage("/site-readiness");
  const readinessRobots = getRobots(readiness.text);
  if (!readinessRobots.includes("noindex")) {
    failures.push("/site-readiness should stay noindex because it is an operational checklist");
  }
}

async function fetchPage(path) {
  const response = await fetch(`${site}${path}`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  return {
    ok: response.ok,
    status: response.status,
    text: await response.text(),
  };
}

async function fetchText(path) {
  const response = await fetch(`${site}${path}`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  const text = await response.text();
  if (!response.ok) failures.push(`${path} returned HTTP ${response.status}`);
  return text;
}

function analyzeHtml(html) {
  const title = decodeHtml(matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i)).trim();
  const description = decodeHtml(getMetaContent(html, "description")).trim();
  const canonical = getLinkHref(html, "canonical").trim();
  const robots = getRobots(html);
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    title,
    description,
    canonical,
    robots,
    visibleText,
    textLength: visibleText.length,
  };
}

function extractSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => decodeHtml(match[1].trim()));
}

function getMetaContent(html, name) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const target = name.toLowerCase();
  for (const tag of metaTags) {
    const tagName = getAttribute(tag, "name") || getAttribute(tag, "property");
    if (tagName.toLowerCase() === target) return getAttribute(tag, "content");
  }
  return "";
}

function getLinkHref(html, rel) {
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  const target = rel.toLowerCase();
  for (const tag of linkTags) {
    if (getAttribute(tag, "rel").toLowerCase() === target) return getAttribute(tag, "href");
  }
  return "";
}

function getRobots(html) {
  return getMetaContent(html, "robots").toLowerCase();
}

function getAttribute(tag, name) {
  const pattern = new RegExp(`${name}=(["'])(.*?)\\1`, "i");
  return decodeHtml(matchFirst(tag, pattern)).trim();
}

function matchFirst(value, pattern) {
  return value.match(pattern)?.[2] ?? value.match(pattern)?.[1] ?? "";
}

function looksLikeLoginWall(text) {
  return /sign in to continue|log in to continue|authentication required|you must be signed in/i.test(text);
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function normalizeSite(value) {
  return value.replace(/\/+$/, "");
}

function normalizePath(path) {
  if (path === "") return "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}
