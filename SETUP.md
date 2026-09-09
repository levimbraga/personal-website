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

Projects, Resume and Contact are **content**, not code. Edit the Markdown in
`src/content/pages/`; the matching `.astro` file in `src/pages/` is just the
route and rarely needs touching.

| Page | File |
|---|---|
| `/projects/` | `src/content/pages/projects.md` |
| `/resume/` | `src/content/pages/resume.md` |
| `/contact/` | `src/content/pages/contact.md` |

The home page is the exception: its intro copy lives directly in
`src/pages/index.astro`, not in a Markdown file, because it is the one page
whose layout is not a generic content shell.

`/resume/` carries a visible date. **Update it whenever you change the PDF** —
a date that no longer matches the file it describes is worse than no date.

Adding a page means creating both halves: a `.md` in `src/content/pages/` and a
route in `src/pages/` (copy an existing one, change the `getEntry` key), then a
nav entry in `src/components/Header.astro` with its label in
`src/i18n/lang/en.ts`. Removing one means deleting both halves and the nav
entry — a leftover route with no content entry fails the build, which is the
intended behaviour.

To replace the résumé, overwrite `public/levi-braga-resume.pdf` (keep the
filename so existing links survive) and update the date line in `resume.md`.

> **Known drift — fix on the next résumé edit.**
> The PDF says SerpVive has **29** SQL migrations. The repository actually
> contains **30** (`supabase/migrations/*.sql`); the count went stale when
> `20260820_link_external_analyses_to_pages.sql` was added after the figure was
> written. The Projects page says 30, which is the correct number and the one
> people actually read. Deliberately not regenerating the PDF just for this —
> but correct it whenever the résumé is next touched, and consider updating the
> same figure in the [SerpVive README](https://github.com/levimbraga/serpvive),
> which also still says 29.

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

### Pages or Workers?

The dashboard now pushes you toward **Workers** — the create flow defaults to it
and Pages is a second choice on the same screen. Both can host this site. **Use
Pages.**

This site is 100% static: `pnpm build` produces a directory of HTML, CSS, images
and a Pagefind index, and nothing runs on a server at request time. Pages is
built for exactly that shape — connect the repository, set a build command, and
every push to `main` deploys. Workers with static assets would serve the same
files, but it wants a `wrangler` config committed to the repository to describe
something Pages infers on its own, and buys nothing a static blog can use.

Pages is in maintenance rather than active development — Cloudflare's new work
happens on Workers — but it is supported, and static hosting is a finished
problem. The moment this site needs anything dynamic (real redirect logic, an
API route, server-side rendering) is the moment to move to Workers, and there is
no benefit in paying that complexity in advance. The
[Workers alternative](#if-you-would-rather-use-workers) is written up below if
you want it anyway.

### Finding the right screen

The menu moved: **Workers & Pages** now lives under **Compute & AI** in the left
sidebar. Cloudflare reorganises this fairly often, so navigate by the landmarks
rather than by exact pixels — the destination is a page listing your Workers and
Pages projects side by side.

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and select
   your account.
2. Left sidebar → **Compute & AI** → **Workers & Pages**.
3. Click **Create**.
4. **This is the step where the default is wrong.** The create flow opens on
   Workers. Switch to the **Pages** tab, then choose
   **Connect to Git** (not "Upload assets" — that is a one-off drag-and-drop
   with no rebuild on push).

If you cannot find a Pages tab at all, go to
[dash.cloudflare.com](https://dash.cloudflare.com) → your account →
**Workers & Pages** → **Create** → **Pages** directly, or use the
`pages/new/provider/github` path on the dashboard URL.

### Connecting the repository

5. **Connect GitHub** and authorise Cloudflare. Grant it access to
   `levimbraga/personal-website` — you can limit it to that one repository
   rather than the whole account.
6. Select the repository, then **Begin setup**.

### Build configuration

7. Fill in:

   | Field | Value |
   |---|---|
   | Project name | `levimbraga-dev` (becomes `levimbraga-dev.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | `Astro` |
   | Build command | `pnpm run build` |
   | Build output directory | `dist` |
   | Root directory (advanced) | *leave blank* |

   Selecting the Astro preset may auto-fill the build command as `npm run build`.
   **Change it to `pnpm run build`.** The project is pnpm-only; the committed
   `pnpm-lock.yaml` is what pins every dependency, and npm would ignore it and
   resolve its own tree.

8. Expand **Environment variables (advanced)** and add:

   | Variable | Value |
   |---|---|
   | `NODE_VERSION` | `22.12.0` |

   **This is not optional, and skipping it is the single most likely way for
   the first build to fail.** Cloudflare's default Node is older than the
   `>=22.12.0` in `package.json`, and the failure does not say so — you get a
   syntax error from deep inside a dependency, or an opaque `ERR_MODULE`, with
   nothing pointing at the Node version. If the first build breaks, check this
   before reading the stack trace.

   Add `PUBLIC_GOOGLE_SITE_VERIFICATION` here too if you are using the
   environment-variable route — see
   [Google Search Console](#google-search-console).

9. **Save and Deploy.** The first build takes a few minutes; later ones are
   faster. When it finishes the site is live at `levimbraga-dev.pages.dev` —
   check it there before attaching the real domain.

Cloudflare detects pnpm from the committed `pnpm-lock.yaml`, and
`packageManager` in `package.json` pins the exact version, so the lockfile must
stay in version control.

### If you would rather use Workers

Workers with static assets serves the same build output. It needs a
`wrangler.jsonc` at the repository root that Pages does not require:

```jsonc
{
  "name": "levimbraga-dev",
  "compatibility_date": "2026-09-09",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

`not_found_handling: "404-page"` makes an unknown path serve `dist/404.html`
with a real 404 status. Do not use `single-page-application` here — it answers
every unknown URL with 200 and your own 404 page, which tells Google that every
typo and dead link is a valid page.

Then create the project through **Compute & AI → Workers & Pages → Create →
Workers → Import a repository**, with the same build command, output directory
and `NODE_VERSION` as above.

### Pointing levimbraga.dev at it

Do this only once the `*.pages.dev` build is confirmed working.

1. **The domain has to be on Cloudflare first.** If it is not already: dashboard
   → **Add a site** (or **Domain registration** if you want to transfer it in),
   then change the nameservers at your registrar to the two Cloudflare gives
   you. Wait for the zone to show **Active** — the steps below need it.
2. Open the Pages project → **Custom domains** tab → **Set up a custom domain**.
3. Enter **`levimbraga.dev`** and confirm. Because the zone is in the same
   Cloudflare account, the DNS record is created for you — no manual CNAME.
   The domain sits in *Initializing* while the certificate is issued; a few
   minutes is normal, and it can take longer on a brand-new zone.
4. Repeat for **`www.levimbraga.dev`**.

#### Redirect www to the apex

Adding both as custom domains makes Pages serve the **same content on both
hostnames**, which is duplicate content — Cloudflare does not redirect one to
the other for you. The canonical tags on every page already point at the apex,
which limits the damage, but a real 301 is the correct fix:

**Zone → Rules → Redirect Rules → Create rule.**

| Field | Value |
|---|---|
| Rule name | `www to apex` |
| If — custom filter expression | Hostname equals `www.levimbraga.dev` |
| Then — type | Dynamic |
| Expression | `concat("https://levimbraga.dev", http.request.uri.path)` |
| Status code | `301` |
| Preserve query string | on |

Use **301**, not 302. A 302 tells Google the move is temporary and it keeps
indexing the `www` version.

Verify:

```bash
curl -sI https://www.levimbraga.dev | head -3   # expect 301 → https://levimbraga.dev
```

Keep `site.url` in `astro-paper.config.ts` exactly as
`https://levimbraga.dev/` — it generates every canonical URL, the sitemap, and
the absolute OG image URLs. A mismatch here quietly poisons all three, and
nothing in the build will warn you.

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
