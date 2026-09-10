export interface UIStrings {
  nav: {
    home: string;
    posts: string;
    tags: string;
    blog: string;
    projects: string;
    resume: string;
    contact: string;
    archives: string;
    search: string;
  };
  /** Singular labels shown on a list card, so a mixed list says which is which. */
  card: {
    post: string;
    project: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    sharePostIntro: string;
    sharePostOn: string;
    sharePostViaEmail: string;
    tagLabel: string;
    backToTop: string;
    goBack: string;
    editPage: string;
    previousPost: string;
    nextPost: string;
  };
  pagination: {
    prev: string;
    next: string;
    page: string;
  };
  home: {
    socialLinks: string;
    featured: string;
    recent: string;
    allPosts: string;
    allProjects: string;
  };
  footer: {
    copyright: string;
    allRightsReserved: string;
    theme: string;
  };
  pages: {
    tagTitle: string;
    tagDesc: string;

    tagsTitle: string;
    tagsDesc: string;

    postsTitle: string;
    postsDesc: string;

    projectsTitle: string;
    projectsDesc: string;

    archivesTitle: string;
    archivesDesc: string;

    searchTitle: string;
    searchDesc: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    searchPlaceholder: string;
    noResults: string;
    goToPreviousPage: string;
    goToNextPage: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
}
