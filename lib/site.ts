export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://oeeco.com");

export const siteName = "oeeco";

export const siteTitle = "oeeco - Explore AI-Made Web Works";

export const siteDescription =
  "oeeco is a global gallery for AI-made games, web tools, interactive pages, and creative experiments.";

export const defaultOgImage = "/assets/cover-fishing.png";

export const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || undefined;

export function absoluteUrl(path = "/") {
  const nextPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${nextPath}`;
}

export function toAbsoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return absoluteUrl(url);
}

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, "");
}
