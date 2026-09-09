import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { slugifyStr } from "./slugify";

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
 * Counts tags by reading content frontmatter straight off disk.
 *
 * Why the filesystem rather than the content collections: this has to run in
 * two places that cannot share a runtime — the tag page, which has collections
 * available, and the sitemap filter in `astro.config.ts`, which does not.
 * Computing it twice from two different sources is how a page ends up
 * `noindex` *and* in the sitemap, which is a worse signal than either choice
 * on its own. So both callers use this one function.
 *
 * The draft and scheduling rules mirror `postFilter()`; keep them in step.
 */
type Frontmatter = {
  tags?: string[];
  draft?: boolean;
  pubDatetime?: string | Date;
};

const CONTENT_DIRS = ["src/content/posts", "src/content/projects"];

function readFrontmatter(file: string): Frontmatter | null {
  const raw = fs.readFileSync(file, "utf-8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return null;
  try {
    return parseYaml(match[1]) as Frontmatter;
  } catch {
    return null;
  }
}

function isPublished(fm: Frontmatter, scheduledPostMargin: number): boolean {
  if (fm.draft) return false;
  if (!fm.pubDatetime) return true;
  const due = new Date(fm.pubDatetime).getTime() - scheduledPostMargin;
  return Date.now() > due;
}

/** Tag slug -> number of published entries carrying it. */
export function getTagCounts({
  scheduledPostMargin = 15 * 60 * 1000,
  cwd = process.cwd(),
} = {}): Map<string, number> {
  const counts = new Map<string, number>();

  for (const dir of CONTENT_DIRS) {
    const abs = path.join(cwd, dir);
    if (!fs.existsSync(abs)) continue;

    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      // `_`-prefixed files are excluded from the collection loader too.
      if (!entry.isFile() || entry.name.startsWith("_")) continue;
      if (!/\.mdx?$/.test(entry.name)) continue;

      const fm = readFrontmatter(path.join(abs, entry.name));
      if (!fm || !isPublished(fm, scheduledPostMargin)) continue;

      for (const tag of fm.tags ?? []) {
        const slug = slugifyStr(tag);
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
  }

  return counts;
}

/** True when this tag's page should be kept out of search results. */
export function isTagPageThin(tagSlug: string, counts = getTagCounts()) {
  return (counts.get(tagSlug) ?? 0) < TAG_INDEX_THRESHOLD;
}
