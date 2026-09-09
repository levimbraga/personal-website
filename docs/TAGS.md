# Tags — the controlled vocabulary

**This list is closed.** A tag that is not on this page does not go in
frontmatter. To use a new one, add it here first with a line saying what it
means, then use it.

The reason is drift. A vocabulary typed freehand becomes `python`, `Python` and
`python3` — three pages, one subject, and a system nobody trusts within six
months. The cost of the rule is ten seconds when a genuinely new subject
appears. The cost of not having it is silent and permanent.

## Rules

| Rule | Detail |
|---|---|
| **Lowercase, hyphenated** | `distributed-systems`, never `Distributed Systems`. |
| **One canonical form** | The spelling on this page is the spelling. `databases`, not `database`. |
| **No count limit** | Seven subjects, seven tags. |
| **Every tag must be central** | The test: *would someone filtering by this tag be pleased to find this entry?* A passing mention of Docker is not a `docker` tag. |
| **New tags come through this file** | Add it here with a definition, then use it. |

Tags work on **posts and projects alike** — a tag is a subject, and the
collection an entry lives in is an implementation detail. `/tags/postgres/`
lists both.

---

## The four axes

An entry can carry tags from all four.

### Language and platform

| Tag | Meaning |
|---|---|
| `python` | Python is the language of the thing being discussed. |
| `typescript` | TypeScript is the language of the thing being discussed. |
| `sql` | SQL as a language — queries, migrations, policies written by hand. |
| `bash` | Shell scripting, command-line plumbing. |
| `cpp` | C++. |

### Tool and framework

| Tag | Meaning |
|---|---|
| `django` | The Django framework. |
| `celery` | Celery task queue. |
| `postgres` | PostgreSQL specifically, not databases in general. |
| `fastapi` | FastAPI. |
| `sqlalchemy` | SQLAlchemy, ORM or Core. |
| `astro` | The Astro framework — this site included. |
| `sentry` | Sentry, or error tracking modelled on it. |
| `supabase` | Supabase as a platform: auth, RLS, hosted Postgres. |
| `cloudflare` | Cloudflare — Pages, Workers, DNS, caching. |
| `linux` | Linux as an operating environment. |
| `docker` | Containers and images. |
| `git` | Git itself — history, hooks, workflow. |

### Subject

| Tag | Meaning |
|---|---|
| `observability` | Knowing what a running system is doing. |
| `performance` | Speed and resource cost, usually with numbers. |
| `databases` | Database concerns in general — modelling, indexing, querying. |
| `testing` | Tests, test design, what is worth testing. |
| `concurrency` | Threads, async, context, ordering. |
| `distributed-systems` | Components on different machines coordinating — consensus, sharding, replication, ordering across nodes. |
| `reliability` | Staying up when a dependency does not: failover, timeouts, retry policy, graceful degradation, kill switches, budget ceilings. |
| `api-design` | Designing an interface others call, including internal abstractions. |
| `security` | Attack surface and defence — authorisation, injection, sanitisation. |
| `data-structures` | Data structures as a subject. |
| `algorithms` | Algorithms as a subject. |
| `web` | Browser-facing concerns — HTML, CSS, HTTP, SEO. |

### Nature of the content

The most useful axis and the easiest to forget. "A Python post" exists by the
thousand; "a post where someone measured and turned out to be wrong" is rare.
This axis is what makes someone come back.

| Tag | Meaning |
|---|---|
| `measurement` | Contains a number I measured myself. Not a number I read. |
| `debugging` | The hunt for one specific problem, start to finish. |
| `architecture` | A decision and the reasoning behind it. |
| `mistake` | Something I concluded wrongly and had to correct. |
| `build-log` | I built a thing and this is the account of building it. |
| `tooling` | About the tool, not about the product it produced. |

---

## Applied: SerpVive

`typescript` `sql` `postgres` `supabase` `databases` `reliability`
`api-design` `security` `architecture` `measurement` `build-log`

Each one checked against the repository, not against memory:

| Tag | Evidence |
|---|---|
| `typescript` | `tsconfig.json` with `"strict": true`; the codebase bans `any`. |
| `sql`, `postgres`, `supabase` | 30 hand-written SQL migrations, Supabase auth and RLS. |
| `databases` | 13 tables, indices, a data-retention policy, a dormancy rule bounding growth. |
| `security` | `src/lib/ai/sanitize.ts` (101 lines of prompt-injection and XSS sanitisation), RLS statements across 5 migrations. |
| `architecture` | Full schema and architecture specified before the first line of code, held over 300+ commits. |
| `measurement` | `cost_usd`, `tokens_input`, `processing_time_ms` logged per call; the page quotes real figures from them. |
| `api-design` | The `AIProvider` interface in `src/lib/ai/providers.ts` — a real abstraction the four providers implement. |
| `build-log` | The page is an account of building the thing. |
| `reliability` | The four-provider failover chain, the 120s per-attempt timeout, permanent-error classification, the four-step JSON repair ladder, `AI_DISABLED`, and a spend cap that fails open. Both failover levels have fired in production. |

**`distributed-systems` was dropped.** It was applied first, then removed once
`reliability` existed. Two reasons: it overclaimed — someone filtering for
distributed systems wants consensus, sharding or replication, and this project
has none — and once `reliability` names the failover work precisely, the
broader tag added nothing but imprecision. It stays in the vocabulary because
"The worker dies, the trace vanishes" earns it honestly: a worker process on
another machine dying mid-trace is the real thing.

The definition of `distributed-systems` was tightened at the same time, so the
next entry has a sharper test to pass.

**Not applied:** `performance` (latency is reported, but the project is not
about speed), `testing` (it has no tests — that is a stated gap, not a
subject), `web`, `python`, `cloudflare`, `docker`.

---

## Pre-assigned: the roadmap

Provisional tags for the twelve planned posts. **Not binding** — adjust when
each is written. They exist so the decision is made once, not twelve times.

| Post | Tags |
|---|---|
| `sys._getframe` vs `inspect.stack` | `python` `performance` `measurement` `tooling` |
| The unit of work without HTTP | `python` `celery` `django` `observability` `architecture` |
| Testing a library that measures | `python` `testing` `tooling` `architecture` |
| The real cost of instrumenting | `python` `performance` `measurement` `mistake` |
| `EXPLAIN` on the tool's own database | `postgres` `databases` `performance` `measurement` |
| `copy_context()` does not solve it | `python` `concurrency` `django` `debugging` `mistake` |
| The worker dies, the trace vanishes | `python` `celery` `observability` `distributed-systems` `architecture` |
| Adjacent to the critical path | `python` `architecture` `tooling` |
| The second adapter is the test | `python` `architecture` `sqlalchemy` `tooling` |
| `pip install ormaos` | `python` `tooling` `build-log` |
| Everything I measured wrong | `measurement` `mistake` `testing` |
| The engine I did not build | `postgres` `databases` `architecture` `measurement` |

Worth noticing: **`mistake` appears three times and `measurement` five.** That
is the spine of the roadmap, and it is the part that will distinguish it.

---

## Ordering on `/tags/`

`/tags/` lists tags **by count, descending**, then alphabetically. It was
alphabetical-only; frequency is more useful, because it tells a reader what the
site actually covers rather than what happens to start with `a`.

The page does not print the counts — that would be a visual change nobody asked
for. Say the word and it is a one-line addition.

---

## Thin tag pages

A tag page carrying fewer than **2** entries is marked `noindex, follow` and
left out of the sitemap. Above the threshold it is indexed normally. Nothing
needs to be edited when a tag crosses the line — it is computed at build time.

`follow` is deliberate: the page is not worth listing in search results, but
the links on it still lead to entries that are.

**Why at all.** With one project and no posts, every tag page lists exactly one
thing — a heading and a link, with nothing to rank for. On an established site
that would be a rounding error worth ignoring. On a domain with no history it
is the first impression: eleven near-identical one-link pages next to nine real
ones, at the moment first impressions are cheapest to control.

**How it stays consistent.** The meta tag is decided from the content
collections; the sitemap filter runs inside `astro.config.ts`, which cannot see
collections and counts frontmatter off disk instead
(`src/utils/tagIndexing.ts`). Two counts computed two ways is exactly how a
page ends up `noindex` *and* listed in the sitemap — contradictory signals,
worse than either choice alone. So the tag route asserts the two agree and
**fails the build** if they diverge, with a message naming the tag and both
counts. If that ever fires, the frontmatter rules in `tagIndexing.ts` have
drifted from `postFilter()`.

`/tags/` itself is always indexed. It is a real hub listing every tag, not a
thin page.
