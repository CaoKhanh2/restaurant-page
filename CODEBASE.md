# Restaurant Les 4 Saisons — Codebase Documentation

> The project has been **migrated to Astro** (static) + UI refactored toward a **warm & rustic Hong Kong** style.
> Documentation for the next developer. See also `DEPLOY.md` for deploying to Hostinger.

---

## Overview

Website of the **Les 4 Saisons** restaurant (Geneva, Chinese/Hong Kong cuisine), domain `les-4saisonsgeneve.ch`.

- **Framework:** Astro 6 — `output: 'static'` (see `astro.config.mjs`). Builds plain HTML into `dist/`.
- **Build URL format:** `build.format: 'file'` → keeps the old `.html` URLs (`/menu.html`, `/about.html`…) so SEO doesn't break.
- **Animation/UX:** GSAP + ScrollTrigger, Lenis (smooth scroll), SplitType (hero text splitting) — installed via npm, bundled by Astro.
- **Fonts:** Playfair Display + Roboto (Google Fonts). **Icons:** Font Awesome (CDN).
- **Theme:** dark/light (warm) via CSS variables + `localStorage`.

> ⚠️ Do NOT switch to `output: 'server'`/an SSR adapter — Hostinger shared hosting cannot run Node.

---

## Commands

```bash
npm install      # install deps (.npmrc already handles internal TLS proxy errors — do not commit)
npm run dev      # dev server http://localhost:4321
npm run build    # build to dist/
npm run preview  # preview the built static site
```

> ⚠️ Run the site via **`npm run dev`**, NOT Live Server on the old `.html` files at the root.

---

## Directory structure

```
restaurant-page/
├── astro.config.mjs        # static, site, base:'/', build.format:'file'
├── package.json
├── .npmrc                  # strict-ssl=false (internal proxy) — gitignored
├── src/
│   ├── pages/              # each file = 1 route
│   │   ├── index.astro         → /            (home page)
│   │   ├── menu.astro          → /menu.html   (à-la-carte rendered BUILD-TIME from data)
│   │   ├── about.astro         → /about.html
│   │   ├── gallery.astro       → /gallery.html
│   │   ├── 404.astro           → /404.html
│   │   └── sub-page/
│   │       ├── category.astro     → /sub-page/category.html  (rendered CLIENT-side per ?category=)
│   │       └── dish-detail.astro  → /sub-page/dish-detail.html (reads CLIENT-side query params)
│   ├── layouts/
│   │   └── Layout.astro    # shared <head>, inline theme-init, JSON-LD, mounts Header/Footer/Preloader, loads main.js
│   ├── components/
│   │   ├── Header.astro    # nav + active state (Astro.url.pathname) + theme toggle + mobile toggle
│   │   ├── Footer.astro
│   │   ├── Preloader.astro # logo intro screen
│   │   ├── SliderMenu.astro# "La carte des mets" (data: sliderCategories)
│   │   ├── Hero.astro      # cinematic hero
│   │   ├── HoursStrip.astro# opening hours (below hero)
│   │   ├── Takeaway.astro
│   │   ├── AboutTeaser.astro
│   │   └── Gallery.astro   # home page image strip
│   ├── data/
│   │   ├── menu.js         # menuData + menuOrder + sliderCategories (SINGLE SOURCE OF DISH DATA)
│   │   └── site.js         # openingHours, phone
│   ├── styles/             # plain CSS (global, imported in Layout/pages)
│   │   ├── base.css        # *** CORE *** warm tokens, header, footer, preloader, cursor, slider, dish grid, reveal
│   │   ├── home.css  menu.css  about.css  gallery.css  category.css  dish-detail.css
│   └── scripts/            # client JS (bundled by Astro)
│       ├── main.js         # entry: scroll/header/nav/theme/preloader/anchor + calls animations & cursor
│       ├── animations.js   # Lenis + GSAP reveal [data-reveal], hero timeline (SplitType), Ken Burns, parallax
│       └── cursor.js       # custom cursor, 2 layers (pointer:fine)
├── public/                 # static assets, copied as-is into dist/ (keeps /images, /icon paths)
│   ├── images/  icon/  .htaccess
└── dist/                   # BUILD OUTPUT (gitignored) — this is what gets uploaded to Hostinger

# OLD (vanilla) folder kept but NO LONGER USED — can be deleted once confirmed:
#   *.html (root), _includes/, js/, style/, data/menu-data.js
```

---

## Theme system (dark/light, warm)

1. **`Layout.astro` — inline `<script is:inline>`** runs before paint: reads `localStorage.theme`, sets `data-theme` on `<html>` + adds the `has-js` class (prevents FOUC, and enables initially-hidden reveal elements).
2. **`src/styles/base.css`**: tokens in `:root` (warm dark default) and `[data-theme="light"]` (cream).
3. **`src/scripts/main.js` → `initThemeToggle()`**: moon/sun button, toggles + persists to localStorage, smooth transition via the `.theme-transitioning` class.

### Main token groups (base.css)
`--bg-page/-surface/-surface-alt/-hover/-input`, `--text-main/-sub/-muted/-faint`,
`--border-soft/-medium`, `--header-*`, `--gold`, `--gold-bright`, `--red`, `--wine-1/2/3`,
`--radius*`, `--shadow-soft/-lift`, `--ease`.

### Deliberately NOT theme-dependent
Footer (warm brown), `#menu-slider-section` (wine red), hero/takeaway overlays (dark because over images), `.category` in the slider (white text).

---

## "Wow" effects

- **Preloader** (`Preloader.astro` + base.css + `main.js → hidePreloader`): logo fade/scale, hides on `window.load` (min ~700ms). Disabled under reduced-motion.
- **Cinematic hero** (`Hero.astro` + home.css + `animations.js`): Ken Burns on the `.hero-bg` layer; text revealed layer by layer with a **SplitType + GSAP timeline**.
- **Scroll-reveal**: add `data-reveal` (single element) or `data-reveal-stagger` (animates children) → GSAP ScrollTrigger handles it. Initially hidden via `html.has-js [data-reveal]{opacity:0}`.
- **Custom cursor** (`cursor.js`): dot + ring, scales up when hovering links/cards. Only on `pointer:fine`, disabled on touch/reduced-motion.
- **Reduced-motion**: `@media (prefers-reduced-motion)` in base.css disables all animations + forces content visible.

---

## Menu data flow

`src/data/menu.js` is the **single source of truth** (`menuData`, `menuOrder`, `sliderCategories`).

- **`menu.astro`**: renders the à-la-carte **at build time** (server-rendered) from `menuData`/`menuOrder`. Each dish is an `<a>` link with query params pre-filled to `dish-detail.html` (no JS needed for navigation).
- **`category.astro`**: client script `import { menuData }` (bundled into JS), reads `?category=`, renders dish cards. Keeps URL format `category.html?category=...`.
- **`dish-detail.astro`**: client script reads `?name=&image=&description=&price=` → fills in content. Placeholder image → `image-bientot-disponible.svg`.

> Image paths in the data are **absolute** (`/images/...`) → use them directly, do NOT prefix with `../` like the old version.

---

## Notes for continued development

1. Adding a new page → create `src/pages/<name>.astro`, wrap it in `<Layout>`, import its own CSS if needed. URL = filename + `.html`.
2. New colors → use tokens from `base.css`, don't hardcode hex values.
3. Need scroll animation → add `data-reveal` / `data-reveal-stagger`, no JS required.
4. Editing the menu → only modify `src/data/menu.js`.
5. Deploying → `npm run build` then upload the **contents of `dist/`** into `public_html/` (see `DEPLOY.md`).
6. Cleanup: the old vanilla files at the root (`*.html`, `_includes/`, `js/`, `style/`, `data/menu-data.js`) have been fully replaced by `src/` — they can be deleted once finalized.
