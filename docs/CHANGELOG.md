# 📝 Changelog

> Records the changes made to the project. Newest entries at the top.

---

## 2026-06-20 (update) — Restructure + Backend + Hybrid data

### 🗂️ Reorganized `src/` + added `server/` backend
- Layered structure: `components/{layout,sections,ui}`, `scripts/{core,features,utils}`, `styles/{global,pages}`, `pages/menu/`.
- **Cleaned up** the old vanilla code at root (`*.html`, `_includes/`, `js/`, `style/`, `data/menu-data.js`, duplicate `images/`+`icon/`).
- Added a **PHP + MySQL** backend in `server/` (API + admin). See [architecture/backend.md](./architecture/backend.md).

### 🔀 Renamed route `sub-page/` → `menu/`
- `sub-page/category.html` → **`/menu/category.html`**; `sub-page/dish-detail.html` → **`/menu/dish-detail.html`**.
- Updated all links (`sliderCategories` in `menu.js`, `dishHref`) via `url()`.

### 🧬 HYBRID data (menu + gallery): static fallback + DB upgrade
- `menu/index.astro` & `gallery.astro`: render **statically at build-time** from `menu.js`/existing images (SEO + works without a backend), then **auto-`fetch('/api/menu.php')` · `fetch('/api/gallery.php')`** to replace content if the DB is live. On API error/unavailability → **keep the static version**.
- `menu/category.astro`: currently renders from bundled `menuData` (static).
- → Content comes **from CODE** when there's no DB, **from the DB** when the API is live. See [architecture/menu-data.md](./architecture/menu-data.md).

### 🔐 CI deploys the backend too
- `deploy.yml`: generates `config/db.php` from the `DB_PASS` secret, merges `server/api`→`/api`, `server/admin`→`/admin`, creates `config/` (blocked via `.htaccess`) + `uploads/`. Bumped CI Node to **22** (Astro 6 requires ≥22.12).

### 🔒 API security
- **`reservations.php` anti-spam ADDED:** honeypot (`website`) + time-trap (`form_time` < 2s) + **per-IP rate limit ≤5/hour → `429`** + field length limits + payload ≤8KB + **tightened CORS** (removed `*`). Frontend `about.astro` sends honeypot + `form_time` along and shows a dedicated message on `429`.
- **Still missing:** throttle for `analytics.php` (writes to DB on every view). See [architecture/backend.md](./architecture/backend.md).

---

## 2026-06-20 — Astro migration + UI refactor + features

### 🏗️ Migrated to Astro (static)
- Converted from plain HTML/CSS/JS (includes fetched via `fetch()`) → **Astro 6 `output:'static'`**.
- `astro.config.mjs`: `site`, `base:'/'`, `build.format:'file'` (keeps `.html` URLs).
- Componentized: `Layout.astro` + `Header/Footer/Preloader/SliderMenu/Hero/HoursStrip/Takeaway/AboutTeaser/Gallery`.
- Dish data `data/menu-data.js` → `src/data/menu.js` (ESM). Assets → `public/`.
- See [architecture/structure.md](./architecture/structure.md), [architecture/menu-data.md](./architecture/menu-data.md).

### 🎨 "Warm & rustic HK" UI refactor
- Warm tokens (dark charcoal + light cream) in `base.css`; removed AOS, consolidated animations into GSAP.
- **Cinematic hero** (Ken Burns + SplitType), **logo preloader**, **scroll-reveal** (`data-reveal`), **custom cursor**.
- Dark/Light theme via CSS variables + `localStorage`. See [ui-system/theme.md](./ui-system/theme.md), [ui-system/animations.md](./ui-system/animations.md).

### 🌐 FR / EN multilingual support
- Added `src/scripts/i18n.js` (data-i18n, `localStorage('lang')`, applyLang skips missing keys).
- Inline lang init in `Layout.astro` (prevents flash). See [ui-system/i18n.md](./ui-system/i18n.md).

### 🔗 Navigation fix (dev/prod `.html` gotcha)
- Added helper `src/utils/url.js` → returns clean path in dev (`/menu`), `.html` in prod.
- Applied to **every internal link** (Header, SliderMenu, Hero, AboutTeaser, menu, dish-detail, category client).
- **Root cause:** Astro's dev server doesn't serve `.html`; previously hardcoded `.html` links caused **404s in dev**.
- See [architecture/routing.md](./architecture/routing.md).

### 🍽️ Menu page redesign (`/menu`)
- **Sticky category tab bar** (smooth scrolling via Lenis + scroll-based active state), **one section per category**.
- **Card per dish** + **fallback tile** (dishes without images), **Signature badge**, **🌶️/🌱 tags**, legend.
- `base.css`: `body { overflow-x: clip }` (instead of `hidden`) so tab `position:sticky` works.
- See [ui-system/menu-page.md](./ui-system/menu-page.md).

### 🖼️ Gallery lightbox
- Click an image → fullscreen view; ←/→/Esc keyboard navigation, mobile swipe, counter, backdrop blur.
- Magnify icon on hover. See [ui-system/gallery.md](./ui-system/gallery.md).

### 🖱️ Fixed custom cursor hidden behind lightbox
- `.cursor-dot/.cursor-ring` z-index raised 10001 → **10050** (above lightbox's 10002) so they stay visible while viewing images.

### 🚢 Deploy
- `public/.htaccess` (404 + caching), `DEPLOY.md`. See [deployment/hostinger.md](./deployment/hostinger.md).

---

## ⏳ Pending (not done yet)
- **🔒 API security:** add **throttle for `analytics.php`** (reservations.php is done); *(optional)* CAPTCHA/Turnstile for forms.
- **"Nos Spécialités" section** (zig-zag editorial) — showcase 6 signature dishes with large images + parallax/reveal on the homepage. *Layout finalized, not implemented yet.*
- (Optional) Make `menu/category` read from `/api/menu.php` (like menu/gallery) so admin edits are also reflected on category pages.
