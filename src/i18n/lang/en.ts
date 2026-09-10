import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    posts: "Posts",
    tags: "Tags",
    // Labelled "Blog" in the nav, but the route stays /posts/ — the URLs were
    // fixed before launch and are not worth breaking for a word.
    blog: "Blog",
    projects: "Projects",
    resume: "Resume",
    // Labelled "Contact"; the route is /contact/.
    contact: "Contact",
    archives: "Archives",
    search: "Search",
  },
  card: {
    post: "Post",
    project: "Project",
  },
  post: {
    publishedAt: "Published at",
    updatedAt: "Updated",
    sharePostIntro: "Share this post:",
    sharePostOn: "Share this post on {{platform}}",
    sharePostViaEmail: "Share this post via email",
    tagLabel: "Tags",
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
  },
  home: {
    socialLinks: "Social Links",
    featured: "Featured",
    // The section mixes posts and projects, so the heading cannot name either.
    // A bare "Recent" also avoids a category noun that would be vague
    // ("work", "updates") or an enumeration ("Writing & projects").
    recent: "Recent",
    allPosts: "All Posts",
    allProjects: "All Projects",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
    theme: "Theme",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All the articles with the tag",

    tagsTitle: "Tags",
    tagsDesc: "All the tags used in posts.",

    postsTitle: "Posts",
    postsDesc: "All the articles I've posted.",

    projectsTitle: "Projects",
    projectsDesc: "Things I've built, and what I learned building them.",

    archivesTitle: "Archives",
    archivesDesc:
      "Posts I've chosen to keep. Not everything I've written ends up here.",

    searchTitle: "Search",
    searchDesc: "Search any article ...",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
} satisfies UIStrings;
