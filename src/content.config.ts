import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      /**
       * Puts the post on /archives/. Curation, not chronology: the page lists
       * what is marked, not everything that exists, so leaving this off is the
       * normal case. With nothing marked the page and its nav entry disappear
       * rather than rendering empty.
       */
      archived: z.boolean().optional(),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const PROJECTS_PATH = "src/content/projects";

/**
 * Projects work the same way posts do: one Markdown file per project, a
 * generated index at /projects/, and a detail page at /projects/<slug>/.
 *
 * `summary` is what the index shows and `description` is what search engines
 * and social cards show. They are separate because the good version of each is
 * rarely the good version of the other — the index wants a line that reads
 * next to five siblings, the meta description wants to stand alone.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${PROJECTS_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      /** One or two lines for the index. Falls back to `description`. */
      summary: z.string().optional(),
      author: z.string().default(config.site.author),
      /** Sorts the index, newest first. */
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      /** Pins to the top of the index, above the date ordering. */
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      /** Short state of play, e.g. "Paused since April 2026". */
      status: z.string().optional(),
      /** Public source repository, if there is one. */
      repo: z.url().optional(),
      /** Live deployment, if there is one. */
      url: z.url().optional(),
      /** Shown as a compact line under the title on the index. */
      tech: z.array(z.string()).default([]),
      /**
       * Controlled-vocabulary tags, shared with posts — see docs/TAGS.md.
       *
       * Deliberately separate from `tech`. `tech` is the display stack on the
       * card ("PostgreSQL/Supabase"); `tags` is the filing system, lowercase
       * and slugged, and carries axes a stack line has no business showing
       * (`architecture`, `build-log`). Merging them would force one of the two
       * to be wrong.
       */
      tags: z.array(z.string()).default([]),
      ogImage: image().or(z.string()).optional(),
      canonicalURL: z.string().optional(),
    }),
});

export const collections = { posts, pages, projects };
