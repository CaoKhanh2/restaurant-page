# 📋 Project Overview — Les 4 Saisons

> Website of the restaurant **Les 4 Saisons** (Genève, Chinese / Hong Kong cuisine)
> Domain: `les-4saisonsgeneve.ch`

---

## Introduction

The project has been **migrated to Astro** (static site) + UI refactored in a **warm & rustic Hong Kong** style.
This documentation is intended for the next developer.

---

## Tech Stack

| Component | Details |
|---|---|
| **Framework** | Astro 6 — `output: 'static'` |
| **Build format** | `build.format: 'file'` → keeps `.html` URLs (`/menu.html`, `/about.html`…) so SEO isn't broken |
| **Animation** | GSAP + ScrollTrigger, Lenis (smooth scroll), SplitType (hero text splitting) |
| **Font** | Playfair Display + Roboto (Google Fonts) |
| **Icon** | Font Awesome (CDN) |
| **Theme** | Dark / Light (warm) — CSS variables + `localStorage` |

> ⚠️ Do **NOT** switch to `output: 'server'` / an SSR adapter — Hostinger shared hosting doesn't run Node.

---

## Common commands

```bash
npm install      # install dependencies (.npmrc already handles internal TLS proxy errors — do not commit)
npm run dev      # dev server → http://localhost:4321
npm run build    # build to dist/
npm run preview  # preview the built static site
```

> ⚠️ Run the site via **`npm run dev`**, NOT Live Server on the old `.html` files at the root.
