import type { CollectionEntry } from "astro:content";
import { getSortedPosts } from "./getSortedPosts";
import { getSortedProjects } from "./getSortedProjects";

export type Entry = CollectionEntry<"posts"> | CollectionEntry<"projects">;

const lastTouched = (entry: Entry) =>
  new Date(entry.data.modDatetime ?? entry.data.pubDatetime).getTime();

/**
 * Posts and projects in one list, newest-touched first.
 *
 * Interleaved rather than grouped, because on the pages that use this — a tag
 * page and the home page's Recent section — the subject is what the reader
 * came for and the collection an entry lives in is an implementation detail of
 * where the file sits on disk.
 *
 * Each collection keeps its own eligibility rules on the way in: posts go
 * through `getSortedPosts` (drafts and scheduling) and projects through
 * `getSortedProjects` (drafts). Both already sort by the same "last touched"
 * rule, so the merge needs no special case.
 */
export function getSortedEntries(
  posts: CollectionEntry<"posts">[],
  projects: CollectionEntry<"projects">[]
): Entry[] {
  return [...getSortedProjects(projects), ...getSortedPosts(posts)].sort(
    (a, b) => lastTouched(b) - lastTouched(a)
  );
}
