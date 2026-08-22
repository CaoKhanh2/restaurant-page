# 📁 Directory structure

> The project is **hybrid**: **Astro frontend (static)** in `src/` + **PHP backend (API + admin + MySQL)** in `server/`.

---

## Overall diagram

```
restaurant-page/
├── astro.config.mjs          # static, base:'/', build.format:'file'
├── package.json  tsconfig.json
├── .npmrc                    # strict-ssl=false (internal proxy) — gitignored
│
├── src/                      # ===== FRONTEND (Astro → built into dist/) =====
│   ├── pages/                # each file = 1 route (.html)
│   │   ├── index.astro            → /
│   │   ├── about.astro            → /about.html
│   │   ├── gallery.astro          → /gallery.html   (fetch /api/gallery.php)
│   │   ├── 404.astro              → /404.html
│   │   └── menu/
│   │       ├── index.astro        → /menu.html          (à-la-carte)
│   │       ├── category.astro     → /menu/category.html (client ?category=)
│   │       └── dish-detail.astro  → /menu/dish-detail.html (client query-param)
│   │
│   ├── layouts/Layout.astro  # shared <head>, inline theme-init, JSON-LD, mounts Header/Footer/Preloader
│   │
│   ├── components/
│   │   ├── layout/           # Header, Footer
│   │   ├── sections/         # Hero, HoursStrip, Takeaway, AboutTeaser  (homepage blocks)
│   │   └── ui/               # SliderMenu, Gallery, Preloader  (reusable UI)
│   │
│   ├── data/                 # menu.js (menuData/menuOrder/sliderCategories), site.js
│   │
│   ├── scripts/              # client JS (bundled by Astro)
│   │   ├── core/main.js      # entry: scroll/header/nav/theme/preloader/anchor + feature init
│   │   ├── features/         # animations.js (Lenis+GSAP), cursor.js, i18n.js
│   │   └── utils/url.js      # dev/prod .html link helper (see routing.md)
│   │
│   └── styles/
│       ├── global/base.css   # *** CORE *** warm tokens, header, footer, preloader, cursor, slider, reveal
│       └── pages/            # home, menu, about, gallery, category, dish-detail
│
├── server/                   # ===== BACKEND (PHP, deployed separately — see backend.md) =====
│   ├── api/                  # Public API: gallery, menu, banners, reservations, analytics
│   ├── admin/                # Admin panel (dashboard, pages/, api/, includes/)
│   ├── config/db.php         # ⚠️ SECRETS (DB credentials) — do NOT commit, place manually on the server
│   ├── schema.sql            # MySQL schema (import once via phpMyAdmin)
│   └── seed.php              # Data seeder — run once then DELETE
│
├── public/                   # static assets → copied as-is into dist/ (keeps /images, /icon paths)
│   ├── images/  icon/  .htaccess
│
├── docs/                     # documentation (you are here)
├── .github/workflows/        # CI: build + deploy to the `deploy` branch
└── dist/                     # build OUTPUT (gitignored)
```

---

## Layering conventions (for maintainability)

| Directory | Contains | When to add something here |
|---|---|---|
| `components/layout/` | Page frame used everywhere | Header, Footer, (nav…) |
| `components/sections/` | Large blocks of a single page | Hero, homepage sections |
| `components/ui/` | Reusable UI pieces | Slider, card, modal, preloader… |
| `scripts/core/` | Entry + orchestration | `main.js` |
| `scripts/features/` | Independent features | animations, cursor, i18n, (lightbox…) |
| `scripts/utils/` | Pure reusable functions | `url.js`, formatting, helpers… |
| `styles/global/` | Site-wide tokens + styles | `base.css` |
| `styles/pages/` | Page-specific styles | `home.css`, `menu.css`… |

> **Routing:** routes follow the `pages/` tree → `/menu/category.html`… Internal links must be wrapped in `url()` ([routing.md](./routing.md)).
> **Frontend ↔ Backend:** pages call the API via `fetch('/api/*.php')` (gallery, menu…). For backend deployment see [backend.md](./backend.md).

---

## ✅ Cleaned up (no longer at root)
The old vanilla site (`index.html`, `about/gallery/menu.html`, `sub-page/`, `_includes/`, `js/`, `style/`, `data/menu-data.js`) and duplicate `images/`, `icon/` copies at root **have been deleted** (replaced by `src/` + `public/`). Still available in git history if needed.
