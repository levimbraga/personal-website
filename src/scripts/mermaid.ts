/**
 * Client-side Mermaid rendering.
 *
 * Mermaid is ~500 KB, so it is behind a dynamic `import()` that only fires on
 * pages that actually contain a diagram. Pages without one — every blog post,
 * by default — pay nothing for this.
 *
 * Diagrams are re-rendered on theme change and after view transitions, since
 * Mermaid bakes colours into the generated SVG and cannot restyle itself with
 * CSS after the fact.
 */

type MermaidModule = typeof import("mermaid").default;

let mermaid: MermaidModule | null = null;

function currentTheme(): "dark" | "default" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "default";
}

async function renderDiagrams() {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("pre.mermaid")
  );
  if (nodes.length === 0) return;

  if (!mermaid) {
    mermaid = (await import("mermaid")).default;
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: currentTheme(),
    securityLevel: "strict",
    fontFamily: "var(--font-google-sans-code), monospace",
  });

  for (const [i, node] of nodes.entries()) {
    const source = node.dataset.mermaidSource;
    if (!source) continue;

    try {
      const { svg } = await mermaid.render(
        `mermaid-${Date.now()}-${i}`,
        decodeURIComponent(source)
      );
      node.innerHTML = svg;
      node.setAttribute("data-mermaid-rendered", "true");
    } catch (error) {
      // Leave the original source text visible — a readable diagram
      // definition beats an empty box. Reported rather than swallowed, so a
      // syntax error in a diagram is findable instead of just invisible.
      // eslint-disable-next-line no-console -- surfacing a render failure
      console.error("Mermaid failed to render a diagram:", error);
    }
  }
}

function init() {
  void renderDiagrams();

  // The theme button rewrites data-theme on <html>.
  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => m.attributeName === "data-theme")) {
      void renderDiagrams();
    }
  });
  observer.observe(document.documentElement, { attributes: true });
}

init();
document.addEventListener("astro:after-swap", () => void renderDiagrams());
