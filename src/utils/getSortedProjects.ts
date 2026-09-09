import type { CollectionEntry } from "astro:content";

/**
 * Projects eligible to be shown, ordered for the index.
 *
 * Featured projects come first; everything else falls back to "last touched"
 * descending, the same rule the post list uses. Drafts are dropped outright,
 * so an unfinished project page has no URL, no sitemap entry and no card.
 */
export function getSortedProjects(projects: CollectionEntry<"projects">[]) {
  const lastTouched = (p: CollectionEntry<"projects">) =>
    new Date(p.data.modDatetime ?? p.data.pubDatetime).getTime();

  return projects
    .filter(({ data }) => !data.draft)
    .sort((a, b) => {
      if (!!a.data.featured !== !!b.data.featured) {
        return a.data.featured ? -1 : 1;
      }
      return lastTouched(b) - lastTouched(a);
    });
}
