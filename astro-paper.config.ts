import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://levimbraga.dev/",
    title: "Levi Maia Braga",
    author: "Levi Maia Braga",
    description:
      "CS student and backend developer. I write about what I build, what I measure, and the conclusions I had to retract.",
    profile: "https://www.linkedin.com/in/levimbraga/",
    lang: "en",
    timezone: "America/Sao_Paulo",
    dir: "ltr",
    ogImage: "default-og.jpg",
    // Paste the token from Search Console > Settings > Ownership verification
    // > HTML tag. Only the content value, not the whole <meta> element.
    googleVerification: "",
  },
  posts: {
    perPage: 4,
    perIndex: 3,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    // Off on purpose: the theme's edit link points at the AstroPaper
    // repository, not at this one.
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/levimbraga" },
    { name: "linkedin", url: "https://www.linkedin.com/in/levimbraga/" },
    { name: "x", url: "https://x.com/levimbraga" },
    { name: "mail", url: "mailto:levimaiabraga@gmail.com" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
