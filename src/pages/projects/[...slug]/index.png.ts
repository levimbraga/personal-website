import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { renderOgImage } from "@/utils/renderOgImage";
import { getProjectSlug } from "@/utils/getProjectPaths";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const projects = await getCollection("projects").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return projects.map(project => ({
    params: { slug: getProjectSlug(project.id) },
    props: project,
  }));
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const pngBuffer = await renderOgImage({
    title: props.data.title,
    author: props.data.author,
    url,
  });

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
