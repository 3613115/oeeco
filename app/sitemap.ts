import type { MetadataRoute } from "next";
import { categories, creators, works, type CategoryId } from "@/lib/data";
import { getTagSlugs } from "@/lib/discovery";
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
      url: absoluteUrl("/latest"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
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

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((category): category is [Exclude<CategoryId, "all">, string] => category[0] !== "all")
    .map(([id]) => ({
      url: absoluteUrl(`/categories/${id}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  const tagRoutes: MetadataRoute.Sitemap = getTagSlugs(Array.from(allWorksById.values())).map((tag) => ({
    url: absoluteUrl(`/tags/${tag}`),
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

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...creatorRoutes, ...workRoutes];
}
