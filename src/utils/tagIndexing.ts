import { slugifyStr } from "./slugify";
import { scanPublished, POSTS_DIR, PROJECTS_DIR } from "./contentScan";

/**
 * How many entries a tag needs before its page is worth indexing.
 *
 * A tag page listing one thing is one link and a heading. There is nothing
 * there to rank for, and on a young domain a crawl that finds eleven of them
 * alongside nine real pages is a poor first impression. Below this threshold
 * the page still exists and still works for a reader — it is only marked
 * `noindex, follow` and left out of the sitemap.
 *
 * `follow` matters: the links still carry through to the entries themselves.
 *
 * Self-healing. The moment a tag reaches the threshold it starts being
 * indexed, with no file to remember to edit.
 */
export const TAG_INDEX_THRESHOLD = 2;

/**
 * Tag slug -> number of published entries carrying it.
 *
 * Read off disk rather than from the content collections because the sitemap
 * filter in `astro.config.ts` has no collections available — see
 * `contentScan.ts` for why both callers must share one source.
 */
export function getTagCounts({
  scheduledPostMargin = 15 * 60 * 1000,
  cwd = process.cwd(),
} = {}): Map<string, number> {
  const counts = new Map<string, number>();

  for (const fm of scanPublished({
    dirs: [POSTS_DIR, PROJECTS_DIR],
    scheduledPostMargin,
    cwd,
  })) {
    for (const tag of fm.tags ?? []) {
      const slug = slugifyStr(tag);
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return counts;
}

/** True when this tag's page should be kept out of search results. */
export function isTagPageThin(tagSlug: string, counts = getTagCounts()) {
  return (counts.get(tagSlug) ?? 0) < TAG_INDEX_THRESHOLD;
}
