import type { MetadataRoute } from "next";
import { creators, works } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { getPublishedWorks } from "@/lib/work-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedWorks = await getPublishedWorks();
  const allWorksById = new Map([...publishedWorks, ...works].map((work) => [work.id, work]));
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/rank"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/upload"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/guidelines"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const creatorRoutes: MetadataRoute.Sitemap = Object.keys(creators).map((id) => ({
    url: absoluteUrl(`/creators/${id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const workRoutes: MetadataRoute.Sitemap = Array.from(allWorksById.values()).map((work) => ({
    url: absoluteUrl(`/works/${work.id}`),
    lastModified: new Date(work.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...creatorRoutes, ...workRoutes];
}
