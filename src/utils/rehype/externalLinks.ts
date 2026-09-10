import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";
import config from "../../../astro-paper.config";

/**
 * Opens external links in a new tab, with `rel="noopener noreferrer"`.
 *
 * Written locally rather than pulled in as `rehype-external-links` for two
 * reasons: it adds no dependency, and "external" here needs a definition that
 * the generic plugin does not have — a link to our own absolute URL is not
 * external, and a `mailto:` is not a tab.
 *
 * Only hast `element` nodes are visited, which is exactly the set produced by
 * Markdown `[text](url)` syntax. Raw `<a>` written into a post is left alone:
 * an author writing HTML by hand can write their own attributes.
 */

/** Hosts that are us. `site.url` is the canonical one. */
const selfHosts = new Set([new URL(config.site.url).hostname.toLowerCase()]);

function isExternal(href: string): boolean {
  // Relative, root-relative, and in-page links are always internal.
  if (/^[#/.]/.test(href)) return false;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    // Not parseable as absolute — a bare relative path like `posts/x`.
    return false;
  }

  // A new tab is only meaningful for a page. `mailto:`, `tel:` and the rest
  // hand off to another application, and `target="_blank"` on them leaves a
  // blank tab behind in several browsers.
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  return !selfHosts.has(url.hostname.toLowerCase());
}

/** Merge into an existing `rel` rather than overwriting an author's value. */
function withRel(existing: unknown): string[] {
  const tokens = new Set(
    (typeof existing === "string"
      ? existing.split(/\s+/)
      : Array.isArray(existing)
        ? existing.map(String)
        : []
    ).filter(Boolean)
  );
  tokens.add("noopener");
  tokens.add("noreferrer");
  return [...tokens];
}

export function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;

      const href = node.properties?.href;
      if (typeof href !== "string" || !isExternal(href)) return;

      node.properties.target = "_blank";
      node.properties.rel = withRel(node.properties.rel);
    });
  };
}
