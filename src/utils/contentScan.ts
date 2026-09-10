import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

/**
 * Reads content frontmatter straight off disk.
 *
 * Why the filesystem rather than the content collections: some decisions have
 * to be made in two places that cannot share a runtime — a page, which has
 * collections available, and the sitemap filter in `astro.config.ts`, which
 * does not. Computing the same thing twice from two different sources is how a
 * page ends up `noindex` *and* in the sitemap, which is a worse signal than
 * either choice on its own.
 *
 * So this module is the one reader, and the policy modules that sit on top of
 * it (`tagIndexing.ts`, `archiveIndexing.ts`) share it rather than each
 * growing their own copy. The draft and scheduling rules here mirror
 * `postFilter()`; keep them in step.
 */
export type Frontmatter = {
  tags?: string[];
  draft?: boolean;
  archived?: boolean;
  pubDatetime?: string | Date;
};

export const POSTS_DIR = "src/content/posts";
export const PROJECTS_DIR = "src/content/projects";

export function readFrontmatter(file: string): Frontmatter | null {
  const raw = fs.readFileSync(file, "utf-8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return null;
  try {
    return parseYaml(match[1]) as Frontmatter;
  } catch {
    return null;
  }
}

export function isPublished(
  fm: Frontmatter,
  scheduledPostMargin: number
): boolean {
  if (fm.draft) return false;
  if (!fm.pubDatetime) return true;
  const due = new Date(fm.pubDatetime).getTime() - scheduledPostMargin;
  return Date.now() > due;
}

type ScanOptions = {
  dirs: string[];
  scheduledPostMargin?: number;
  cwd?: string;
};

/** Every published entry's frontmatter, across the given content directories. */
export function scanPublished({
  dirs,
  scheduledPostMargin = 15 * 60 * 1000,
  cwd = process.cwd(),
}: ScanOptions): Frontmatter[] {
  const found: Frontmatter[] = [];

  for (const dir of dirs) {
    const abs = path.join(cwd, dir);
    if (!fs.existsSync(abs)) continue;

    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      // `_`-prefixed files are excluded from the collection loader too.
      if (!entry.isFile() || entry.name.startsWith("_")) continue;
      if (!/\.mdx?$/.test(entry.name)) continue;

      const fm = readFrontmatter(path.join(abs, entry.name));
      if (!fm || !isPublished(fm, scheduledPostMargin)) continue;

      found.push(fm);
    }
  }

  return found;
}
