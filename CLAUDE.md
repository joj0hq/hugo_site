# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (Japanese default / English) Hugo personal site + portfolio for `joj0hq.com`, deployed to Firebase Hosting (project `jojo-hack`). Requires Node 22.4.0 (`.node-version`) and Hugo ≥ 0.83.0.

## Commands

```sh
make run      # hugo server -D (local dev, includes drafts); clears public/ first
make deploy   # clears public/, runs `hugo`, then `firebase deploy`
make clean    # wipe public/ (keeps .gitkeep)
hugo new --kind post <name>   # new draft post from archetypes/post.md (draft: true)
```

There is no test suite, linter, or build step beyond `hugo`. `public/` is a build artifact but is committed; `make deploy`/`make run` regenerate it.

## Architecture: custom design over PaperMod

**PaperMod (`themes/PaperMod`) is the configured theme, but presentation is almost entirely overridden by project-level files in `layouts/`.** Treat the custom layouts as the source of truth; PaperMod is only used for taxonomy/term pages, `search.html`, and RSS/JSON outputs.

- Custom layouts: `layouts/_default/{baseof,index,products,about,contact,single,list}.html`, `layouts/posts/list.html`, `layouts/partials/{head,nav,footer,svg}.html`. Styling/behavior: `assets/css/main.css` + `assets/js/main.js`.
- **The nav is the custom `layouts/partials/nav.html` and ignores the `menu:` config in `config.yaml`.** Editing menu config has no visual effect — edit the partial.
- **Light theme only**: `defaultTheme: light`, `disableThemeToggle: true`. No dark/auto toggle.
- `legacy/` holds the previous PaperMod-based design + the imported `Portfolio.dc.html` source. It is **not built by Hugo** (Hugo only processes `content/`, `layouts/`, `assets/`, `static/`, `data/`, `i18n/`, `archetypes/`, `themes/`). See `legacy/README.md` to restore the old look.

## Content & i18n model

- JP content lives in `content/`, EN in `content/en/` (`defaultContentLanguage: ja`, no `/ja/` subdir; EN served under `/en/`). Each page should exist in both trees for the language toggle to link a real translation.
- Sections/paths: Home `/`, Work `/products/`, Writing `/posts/`, About `/about/`, Contact `/contact/`.
- **Per-page prose lives in front-matter params** (e.g. `profile`, `bio`, `career`, `heroLead`, `pululu`, `values`, `projects`, contact copy) consumed by the matching `layout:` — not in the Markdown body. UI chrome strings (labels, buttons) live in `i18n/{ja,en}.toml`.
- The Writing timeline renders all posts on one page, so `/posts/page/N/` pagination URLs do not exist. Individual post/section/taxonomy URLs are preserved.

## Gotchas

- A page selects its design via `layout:` in front matter (e.g. `layout: about`) mapping to `layouts/_default/<layout>.html`.
- When adding a section/page, update both `content/` and `content/en/`, add any new strings to both `i18n/*.toml`, and wire the route into `nav.html` if it should appear in navigation.
- `markup.goldmark.renderer.unsafe: true` is on — raw HTML in Markdown is rendered.
