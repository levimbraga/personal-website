import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

/**
 * Projects are kept flat in `src/content/projects/`, so the slug is just the
 * filename. Unlike posts, there is no folder-to-URL-segment mapping: a project
 * list is small enough that grouping in the filesystem would buy nothing and
 * would put a category into every URL.
 */
function idToSlug(id: string): string {
  const segments = id.split("/");
  return String(segments[segments.length - 1]);
}

/** Route param for `getStaticPaths`, e.g. `/serpvive`. */
export function getProjectSlug(id: string): string {
  return `/${idToSlug(id)}`;
}

/** Navigable URL, e.g. `/projects/serpvive/`. */
export function getProjectUrl(
  id: string,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `projects/${idToSlug(id)}`);
}
