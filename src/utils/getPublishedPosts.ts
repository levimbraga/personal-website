import { getCollection } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * Every post eligible to be shown: drafts and not-yet-due scheduled posts out.
 *
 * Shared by /archives/, which lists them, and the header, which decides
 * whether to link to /archives/ at all. Those two decisions have to be made
 * from the same set — a nav entry pointing at a page that rewrote itself to
 * 404 is the failure this prevents.
 */
export async function getPublishedPosts() {
  return (await getCollection("posts")).filter(postFilter);
}
