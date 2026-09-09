import { visit } from "unist-util-visit";
import type { Root, Code, Parent } from "mdast";

/**
 * Turns ```mermaid fenced blocks into `<pre class="mermaid">` elements.
 *
 * This runs as a *remark* plugin, before Shiki gets to the tree, because Shiki
 * would otherwise syntax-highlight the block into `<pre class="astro-code">`
 * and bury the diagram source in markup that Mermaid can't read.
 *
 * The diagram source is left in the element as plain text on purpose:
 *
 *  - It is real content in the HTML, so a crawler with no JavaScript still
 *    sees the labels in the diagram rather than an empty box.
 *  - `src/scripts/mermaid.ts` reads that text back at runtime and replaces it
 *    with the rendered SVG.
 *
 * If the client script never runs, the page degrades to readable diagram
 * source instead of a blank space.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function remarkMermaid() {
  return (tree: Root) => {
    visit(
      tree,
      "code",
      (node: Code, index: number | undefined, parent: Parent | undefined) => {
        if (node.lang !== "mermaid" || !parent || index === undefined) return;

        parent.children[index] = {
          type: "html",
          value: `<pre class="mermaid not-prose" data-mermaid-source="${encodeURIComponent(
            node.value
          )}">${escapeHtml(node.value)}</pre>`,
        } as never;
      }
    );
  };
}
