import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { getAllBlogTopics } from "@/lib/blog-topics";
import { categories, works, type CategoryId } from "@/lib/data";
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
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
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
      url: absoluteUrl("/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/authors/oeeco-editorial"),
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
      url: absoluteUrl("/editorial-policy"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/contact"),
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

  const creatorIds = Array.from(new Set(Array.from(allWorksById.values()).map((work) => work.creatorId)));
  const creatorRoutes: MetadataRoute.Sitemap = creatorIds.map((id) => ({
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

  const workRoutes: MetadataRoute.Sitemap = Array.from(allWorksById.values()).map((work) => ({
    url: absoluteUrl(`/works/${work.id}`),
    lastModified: new Date(work.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogTopicRoutes: MetadataRoute.Sitemap = getAllBlogTopics().map((topic) => ({
    url: absoluteUrl(`/blog/topics/${topic.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...creatorRoutes, ...workRoutes, ...blogRoutes, ...blogTopicRoutes];
}
