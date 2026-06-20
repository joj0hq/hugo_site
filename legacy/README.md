# Legacy

Archived snapshot of the **previous PaperMod-based design**, kept for reference after the
2026-06-20 redesign to the Claude Design portfolio (`Portfolio.dc.html`).

This directory is **not built by Hugo** (Hugo only processes `content/`, `layouts/`,
`assets/`, `static/`, `data/`, `i18n/`, `archetypes/`, `themes/`).

## Contents

- `layouts/_default/index.html` — previous home page layout.
- `layouts/partials/head.html` — previous `<head>` (SEO + PaperMod CSS pipeline + search + theme toggle).
- `layouts/partials/header.html` — previous nav/header (logo styling).
- `layouts/partials/home_info.html` — previous Pululu showcase block.
- `layouts/partials/svg.html` — social icon SVG library.
- `Portfolio.dc.html` — the imported Claude Design source the new site is based on
  (project `4f1c99a5-5226-4355-8fac-98fdf7587d9f`).

To restore the old look, copy the files under `legacy/layouts/` back into `layouts/`,
revert `config.yaml` (theme params/menus), and remove the new custom layouts.
