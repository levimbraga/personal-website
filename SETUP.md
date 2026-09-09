# Setup and operations

Everything needed to run this site, publish to it, and keep it indexed.

- [Running locally](#running-locally)
- [Adding a post](#adding-a-post)
- [Editing the standalone pages](#editing-the-standalone-pages)
- [Publishing](#publishing)
- [Deploying to Cloudflare Pages](#deploying-to-cloudflare-pages)
- [Google Search Console](#google-search-console)
- [Submitting the sitemap](#submitting-the-sitemap)
- [Licence](#licence)

---

## Running locally

Requires **Node ≥ 22.12.0** and **pnpm**.

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Type-check, build to `dist/`, then build the Pagefind search index |
| `pnpm preview` | Serve the built `dist/` locally — use this to check the real output |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier, writing changes |

Search is powered by [Pagefind](https://pagefind.app/), which indexes the
**built** site. Search results will be empty or stale in `pnpm dev` — that is
expected. Use `pnpm build && pnpm preview` to test search for real.

---

## Adding a post

Posts live in **`src/content/posts/`**. One Markdown file per post.

```bash
cp src/content/posts/_template.md src/content/posts/my-new-post.md
```

`_template.md` is the frontmatter reference and carries a full field table.
Files whose names start with `_` are ignored by the content loader, so the
template itself is never published.

### Required frontmatter

Only three fields are mandatory:

```yaml
---
title: The post title
description: "One or two sentences — this is the meta description Google shows."
pubDatetime: 2026-09-09T09:00:00Z
---
```

Everything else has a sensible default. `author` falls back to the site author,
`tags` falls back to `["others"]`, and the slug falls back to the filename.

### Marking a post as a draft

```yaml
draft: true
```

A draft is excluded from the build entirely — not from the listing only. It will
not appear in the sitemap, the RSS feed, the search index or at its own URL.
Flip it to `false` (or delete the line) to publish.

To schedule instead, set `pubDatetime` in the future. The post goes live on the
first build after that time, so a future-dated post still needs a deploy to
appear.

### URLs

**Keep post files flat in `src/content/posts/`.** The URL is
`/posts/<slug>/`, and any subdirectory becomes a URL segment —
`src/content/posts/notes/thing.md` would publish at `/posts/notes/thing/`.
The flat scheme is deliberate: it keeps URLs short and means moving a post
between categories later never breaks a link.

Set `slug:` explicitly if you want a URL different from the filename. **Once a
post is published, do not change its slug** — that breaks every inbound link
and throws away whatever ranking the URL has earned. If you must, keep the old
URL redirecting to the new one.

### Images in posts

Put them in `src/assets/images/` and reference them relative to the project:

```markdown
![Descriptive alt text](@/assets/images/my-image.png)
```

Astro will optimise and convert them at build time. Images placed in `public/`
are served as-is with no optimisation — use that only when you need a stable,
predictable URL (like the résumé PDF).

### Diagrams

Fenced ` ```mermaid ` blocks render as diagrams. This is not stock AstroPaper —
it is a local plugin (`src/utils/remark/mermaid.ts` plus
`src/scripts/mermaid.ts`). Mermaid is loaded only on pages that actually contain
a diagram, so posts without one pay nothing for it. The diagram source stays in
the HTML as text, so a crawler with no JavaScript still reads the labels.

---

## Editing the standalone pages

About, Projects, Resume, Links and Now are **content**, not code. Edit the
Markdown in `src/content/pages/`; the matching `.astro` file in `src/pages/` is
just the route and rarely needs touching.

| Page | File |
|---|---|
| `/about/` | `src/content/pages/about.md` |
| `/projects/` | `src/content/pages/projects.md` |
| `/resume/` | `src/content/pages/resume.md` |
| `/links/` | `src/content/pages/links.md` |
| `/now/` | `src/content/pages/now.md` |

Two of these carry a visible date — `/resume/` and `/now/`. **Update the date
in the file whenever you change the content.** A `/now` page with a stale date
is worse than none, because it actively misinforms.

To replace the résumé, overwrite `public/levi-braga-resume.pdf` (keep the
filename so existing links survive) and update the date line in `resume.md`.

---

## Publishing

```bash
git status                 # always look before pushing
git add .
git commit -m "Add post on <topic>"
git push
```

Cloudflare Pages builds and deploys on every push to `main`. There is no manual
deploy step.

---

## Deploying to Cloudflare Pages

### First-time setup

1. **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.**
2. Authorise GitHub and pick the `levimbraga/personal-website` repository.
3. Set the build configuration:

   | Setting | Value |
   |---|---|
   | Framework preset | `Astro` |
   | Build command | `pnpm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave blank)* |
   | Production branch | `main` |

4. Add an environment variable under **Settings → Environment variables**,
   for **both** Production and Preview:

   | Variable | Value |
   |---|---|
   | `NODE_VERSION` | `22.22.1` |

   This is not optional. Cloudflare's default Node is older than the `>=22.12.0`
   this project requires, and the build fails without it.

   `PUBLIC_GOOGLE_SITE_VERIFICATION` can also be set here instead of committing
   the token — see [Google Search Console](#google-search-console).

5. **Save and Deploy.** The first build takes a few minutes; later ones are
   faster.

Cloudflare detects pnpm automatically from the committed `pnpm-lock.yaml`, so
the lockfile must stay in version control.

### Pointing levimbraga.dev at it

1. The domain must be on Cloudflare — **Add a site** in the dashboard and move
   the nameservers at your registrar if it is not already.
2. In the Pages project: **Custom domains → Set up a custom domain**.
3. Add **`levimbraga.dev`**, then add **`www.levimbraga.dev`** as well and let
   Cloudflare redirect it to the apex. Serving both without a redirect splits
   your ranking signals between two hostnames.
4. Cloudflare creates the DNS records itself when the domain is in the same
   account. Propagation is usually minutes.

Keep `site.url` in `astro-paper.config.ts` exactly as
`https://levimbraga.dev/` — it is what generates every canonical URL, the
sitemap and the absolute OG image URLs. A mismatch here quietly poisons all
three.

### HTTPS

`.dev` is on the **HSTS preload list**, which is enforced by the browser, not by
the server: Chrome, Firefox, Safari and Edge refuse to load `levimbraga.dev`
over plain HTTP at all. There is no insecure fallback to worry about, but it
also means a broken certificate is a hard outage rather than a warning.

Confirm after the domain is live:

1. In the Pages project, **Custom domains** shows the domain as *Active* with a
   valid certificate.
2. **SSL/TLS → Overview** is set to **Full (strict)**.
3. **SSL/TLS → Edge Certificates → Always Use HTTPS** is **on**.

Then verify from a terminal:

```bash
curl -sI https://levimbraga.dev | head -1                    # expect HTTP/2 200
curl -sI https://levimbraga.dev | grep -i strict-transport   # expect a max-age
```

---

## Google Search Console

Without Search Console there is no way to know what ranks, what Google has
actually indexed, or which pages it tried to crawl and rejected. Set it up
before writing seriously.

The verification value can be supplied two ways. Both are read by the theme;
pick one.

**Option A — environment variable (preferred).** Keeps the token out of the
repository, and it is the route the AstroPaper maintainer documents.
In Cloudflare Pages → Settings → Environment variables, add:

| Variable | Value |
|---|---|
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | the `content` value from Google's meta tag |

**Option B — commit it.** Set `site.googleVerification` in
`astro-paper.config.ts`. The field is already there and empty. This is harmless
— the token is public in the page source either way — it is just noisier in git.

### Steps

1. Go to [Google Search Console](https://search.google.com/search-console) and
   click **Add property**.
2. Choose **URL prefix** and enter `https://levimbraga.dev/`.
   Use URL prefix rather than Domain unless you want to verify by DNS — Domain
   covers every subdomain and protocol, which is tidier but needs a DNS record
   instead of the meta tag.
3. Pick the **HTML tag** method. Google shows something like:

   ```html
   <meta name="google-site-verification" content="AbCdEf123..." />
   ```

4. Copy **only the `content` value** — `AbCdEf123...`, not the whole element.
   That is the single most common mistake here.
5. Set it via Option A or B above, then **deploy**. The tag has to be live on
   the production site before Google will check it.
6. Confirm it is actually there:

   ```bash
   curl -s https://levimbraga.dev | grep google-site-verification
   ```

7. Back in Search Console, click **Verify**.

Keep the tag in place permanently. Removing it later un-verifies the property.

---

## Submitting the sitemap

Once verified, go to **Search Console → Sitemaps** and submit exactly:

```
sitemap-index.xml
```

Notes worth having, drawn from the theme's own issue history
([discussion #185](https://github.com/satnaing/astro-paper/discussions/185),
[discussion #334](https://github.com/satnaing/astro-paper/discussions/334)):

- **Submit the sitemap, not `robots.txt`.** Putting `robots.txt` in the sitemap
  field is a recurring mistake in that thread and it simply fails.
- **If the index file is not processed**, submit `sitemap-0.xml` directly as
  well. The index is only a pointer to it.
- Someone in that thread hit a sitemap fetch failure specifically on
  **Cloudflare Pages**. If Search Console reports "Couldn't fetch", confirm the
  file is actually reachable before assuming Google is at fault:

  ```bash
  curl -sI https://levimbraga.dev/sitemap-index.xml   # expect 200, XML
  curl -s  https://levimbraga.dev/robots.txt          # should list the sitemap
  ```

"Couldn't fetch" often just means Google has not retried yet. If the two
commands above return correctly, give it a few days before changing anything.

### After submitting

- **URL Inspection** → paste a post URL → **Request indexing** to nudge a new
  post. Use it sparingly; it is a hint, not a command.
- Expect **"Discovered – currently not indexed"** on a new site with few posts.
  It is normal, not a misconfiguration, and it resolves as the site accumulates
  content and links.
- The **Page indexing** report is the one to watch. It says what Google
  actually did with each URL.

---

## Licence

Two different things live in this repository under two different terms.

- **The theme** is [AstroPaper](https://github.com/satnaing/astro-paper) by
  Sat Naing, MIT licensed. The `LICENSE` file at the repository root is his and
  must stay intact — preserving that notice is the licence's only real
  obligation. The footer also credits the theme, which is courtesy rather than
  a requirement.
- **The written content** — everything in `src/content/`, including all blog
  posts and pages — is mine, © Levi Braga, and is not covered by that MIT
  licence.
