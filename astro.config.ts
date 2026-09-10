import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { remarkMermaid } from "./src/utils/remark/mermaid";
import { rehypeExternalLinks } from "./src/utils/rehype/externalLinks";
import { getTagCounts, TAG_INDEX_THRESHOLD } from "./src/utils/tagIndexing";
import { getPublishedPostCount } from "./src/utils/archiveIndexing";
import config from "./astro-paper.config";

const tagCounts = getTagCounts({
  scheduledPostMargin: config.posts?.scheduledPostMargin,
});

// /archives/ indexes every published post. With none published the page
// rewrites to 404 and drops out of the nav, so it must drop out of the sitemap
// too — the same source of truth the page asserts against.
const hasArchive =
  getPublishedPostCount({
    scheduledPostMargin: config.posts?.scheduledPostMargin,
  }) > 0;

/** `/tags/<slug>/` (and its paginated pages) for a tag with too few entries. */
function isThinTagPage(page: string): boolean {
  const match = /\/tags\/([^/]+)\//.exec(page);
  if (!match) return false;
  return (tagCounts.get(match[1]) ?? 0) < TAG_INDEX_THRESHOLD;
}

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        // /straw-hat/ is unlisted on purpose: no nav entry, no sitemap entry,
        // no search index. It is not disallowed in robots.txt though — finding
        // it is the point, and blocking it would only advertise it.
        !page.endsWith("/straw-hat/") &&
        // A tag page below the threshold is marked noindex, so listing it in
        // the sitemap would ask Google to crawl something we just told it to
        // ignore. Same source of truth as the meta tag.
        !isThinTagPage(page) &&
        ((config.features?.showArchives !== false && hasArchive) ||
          !page.endsWith("/archives/")),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        // Must run before Shiki so ```mermaid blocks are not turned into
        // syntax-highlighted code.
        remarkMermaid,
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeExternalLinks],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
