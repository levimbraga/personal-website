import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
  /** How many entries carry this tag, across both collections. */
  count: number;
};

/**
 * Builds a de-duplicated tag list from posts *and* projects.
 *
 * Projects were not originally taggable — the theme built this from posts
 * alone — but a tag is a subject, and a subject does not care which collection
 * an entry lives in. A reader filtering by `postgres` wants the project page
 * about Postgres as much as the posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`; draft projects
 *   are excluded directly.
 * - `tag` is the slug used in URLs; `tagName` is the original label.
 * - Ordered by count descending, then alphabetically. Alphabetical order tells
 *   you nothing about which subjects this site actually covers; frequency does.
 */
export function getUniqueTags(
  posts: CollectionEntry<"posts">[],
  projects: CollectionEntry<"projects">[] = []
) {
  const labels = [
    ...posts.filter(postFilter).flatMap(post => post.data.tags),
    ...projects
      .filter(({ data }) => !data.draft)
      .flatMap(project => project.data.tags),
  ];

  const bySlug = new Map<string, Tag>();
  for (const label of labels) {
    const slug = slugifyStr(label);
    const existing = bySlug.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      bySlug.set(slug, { tag: slug, tagName: label, count: 1 });
    }
  }

  return [...bySlug.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag)
  );
}
