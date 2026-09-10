import { getCollection } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * The posts that belong on /archives/.
 *
 * Curation, not chronology: a post is here because its frontmatter says
 * `archived: true`, not because it exists. The theme listed every post
 * automatically, which made the page a second, worse copy of /posts/.
 *
 * `postFilter` still applies on top, so a draft or a not-yet-due scheduled
 * post cannot reach the page by being marked early.
 */
export async function getArchivedPosts() {
  const posts = await getCollection("posts");
  return posts.filter(post => postFilter(post) && post.data.archived === true);
}
