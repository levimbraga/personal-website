import { scanPublished, POSTS_DIR } from "./contentScan";

/**
 * How many published posts are marked `archived: true`.
 *
 * /archives/ is curated: a post appears there because its frontmatter says so,
 * not because it exists. That means the page can legitimately be empty, and an
 * empty page is worse than no page — so the route rewrites to 404 and the nav
 * entry disappears, the same way the home page's Recent section vanishes with
 * no entries.
 *
 * The sitemap filter has to make that same call and cannot see the content
 * collections, so it counts off disk through `contentScan.ts`. The archives
 * page asserts the two counts agree, which is what stops the route from
 * rewriting to 404 while the sitemap still advertises it.
 */
export function getArchivedPostCount({
  scheduledPostMargin = 15 * 60 * 1000,
  cwd = process.cwd(),
} = {}): number {
  return scanPublished({
    dirs: [POSTS_DIR],
    scheduledPostMargin,
    cwd,
  }).filter(fm => fm.archived === true).length;
}
