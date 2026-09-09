---
title: Post title goes here
author: Levi Braga
pubDatetime: 2026-01-01T09:00:00Z
modDatetime:
slug: post-title-goes-here
featured: false
draft: true
tags:
  - tag-one
  - tag-two
description: "One or two sentences. This is the meta description Google shows in search results and what fills og:description — write it for a reader, not for a crawler."
---

Files starting with `_` are ignored by the content loader, so this template is
never built and never published. Copy it, drop the underscore, and edit.

## Frontmatter reference

| Field          | Required | Notes                                                                  |
| -------------- | -------- | ---------------------------------------------------------------------- |
| `title`        | yes      | Used as `<h1>`, `<title>`, `og:title` and the JSON-LD `headline`.      |
| `description`  | yes      | Meta description + `og:description`. Keep it under ~160 characters.    |
| `pubDatetime`  | yes      | ISO 8601 date. Drives sort order, the sitemap and `datePublished`.     |
| `author`       | no       | Defaults to `site.author` in `astro-paper.config.ts`.                  |
| `modDatetime`  | no       | Set when you meaningfully edit a published post; fills `dateModified`. |
| `slug`         | no       | Defaults to the filename. This is the URL: `/posts/<slug>/`.           |
| `featured`     | no       | `true` pins the post to the Featured section on the home page.         |
| `draft`        | no       | `true` keeps the post out of the build entirely.                       |
| `tags`         | no       | Defaults to `["others"]`. Each tag gets its own indexable page.        |
| `ogImage`      | no       | Per-post social image. Omit it and one is generated automatically.     |
| `canonicalURL` | no       | Only for content first published somewhere else.                       |
| `timezone`     | no       | Overrides `site.timezone` for this post's dates.                       |

## Writing

Body copy is standard Markdown. Fenced code blocks get syntax highlighting.

> Blockquotes, tables, footnotes and LaTeX all work out of the box.
