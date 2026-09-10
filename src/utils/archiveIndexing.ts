import { scanPublished, POSTS_DIR } from "./contentScan";

/**
 * How many published posts exist, counted off disk.
 *
 * /archives/ is a chronological index of every post, so it holds something
 * exactly when the blog does. That can be nothing — one `draft: true` on a
 * one-post site is enough — and an empty index is worse than an absent one, so
 * the route rewrites to 404 and the nav entry disappears in that state.
 *
 * The sitemap filter has to make the same call and cannot see the content
 * collections, so it counts through `contentScan.ts` instead. The archives
 * page asserts the two counts agree, which is what stops the route from
 * rewriting to 404 while the sitemap still advertises it.
 */
export function getPublishedPostCount({
  scheduledPostMargin = 15 * 60 * 1000,
  cwd = process.cwd(),
} = {}): number {
  return scanPublished({ dirs: [POSTS_DIR], scheduledPostMargin, cwd }).length;
}
