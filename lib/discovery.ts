import { categoryLabels, getWorkCreator, type Work } from "@/lib/data";

const slugFallback = "tag";

export function tagToSlug(tag: string) {
  const slug = tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || slugFallback;
}

export function getTagSlugs(works: Work[]) {
  return Array.from(new Set(works.flatMap((work) => work.tags.map(tagToSlug)))).sort();
}

export function getTagDisplayName(slug: string, works: Work[]) {
  const normalizedSlug = tagToSlug(slug);
  const matchingTag = works.flatMap((work) => work.tags).find((tag) => tagToSlug(tag) === normalizedSlug);

  if (matchingTag) return matchingTag;

  return normalizedSlug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getWorksByTagSlug(works: Work[], slug: string) {
  const normalizedSlug = tagToSlug(slug);
  return works.filter((work) => work.tags.some((tag) => tagToSlug(tag) === normalizedSlug));
}

export function searchWorks(works: Work[], rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return works;

  return works
    .map((work) => {
      const creator = getWorkCreator(work);
      const category = categoryLabels[work.category];
      const searchable = [
        work.title,
        work.type,
        work.summary,
        work.detail,
        work.tool,
        category,
        creator.name,
        creator.handle,
        ...work.tags,
      ];

      const score = searchable.reduce((total, field) => {
        const value = field.toLowerCase();
        if (value === query) return total + 6;
        if (value.startsWith(query)) return total + 4;
        if (value.includes(query)) return total + 2;
        return total;
      }, 0);

      return { work, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.work.createdAt).getTime() - new Date(a.work.createdAt).getTime())
    .map(({ work }) => work);
}
