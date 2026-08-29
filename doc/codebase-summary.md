# Codebase Summary — Restaurant Les 4 Saisons

> Source: `CODEBASE.md` | Astro 6 static site for les-4saisonsgeneve.ch

---

## Stack & Architecture

| Aspect | Details |
|--------|---------|
| **Framework** | Astro 6, `output: 'static'` |
| **Build output** | `dist/` (plain HTML/CSS/JS) |
| **URL format** | `build.format: 'file'` → `.html` extensions preserved for SEO |
| **Styling** | Plain CSS with CSS variables (tokens in `base.css`) |
| **Animation** | GSAP + ScrollTrigger, Lenis (smooth scroll), SplitType |
| **Theme** | Dark/light (warm) via CSS vars + localStorage |
| **Fonts** | Playfair Display + Roboto (Google Fonts) |
| **Icons** | Font Awesome (CDN) |

---

## Key Directories

```
src/
├── pages/           # Routes (each .astro = 1 route)
│   ├── index.astro         → /
│   ├── menu.astro          → /menu.html (build-time from data)
│   ├── about.astro         → /about.html
│   ├── gallery.astro       → /gallery.html
│   ├── 404.astro           → /404.html
│   └── sub-page/
│       ├── category.astro     → /sub-page/category.html (client-side ?category=)
│       └── dish-detail.astro  → /sub-page/dish-detail.html (client-side query params)
├── layouts/
│   └── Layout.astro    # Shared <head>, theme init, JSON-LD, Header/Footer/Preloader
├── components/
│   ├── Header/Footer/Preloader/SliderMenu/Hero/HoursStrip/Takeaway/AboutTeaser/Gallery
├── data/
│   ├── menu.js         # SINGLE SOURCE: menuData, menuOrder, sliderCategories
│   └── site.js         # openingHours, phone
├── styles/
│   ├── base.css        # CORE tokens, warm theme, all components
│   └── *.css           # Page-specific (home, menu, about, gallery, category, dish-detail)
└── scripts/
    ├── main.js         # Entry: scroll, header, nav, theme, preloader, animations, cursor
    ├── animations.js   # Lenis, GSAP reveal, hero timeline, Ken Burns, parallax
    └── cursor.js       # Custom cursor (dot + ring, pointer:fine only)
```

---

## Theme System (3 layers)

1. **Layout.astro** — Inline script runs before paint: reads `localStorage.theme`, sets `data-theme` on `<html>`, adds `has-js` class
2. **base.css** — Tokens in `:root` (warm dark default) + `[data-theme="light"]` (cream)
3. **main.js → initThemeToggle()** — Moon/sun button, toggles + persists, smooth transition via `.theme-transitioning`

**Non-theme areas:** Footer (warm brown), `#menu-slider-section` (wine red), hero/takeaway overlays, slider categories (white text)

---

## "Wow" Effects

| Effect | Implementation |
|--------|----------------|
| Preloader | `Preloader.astro` + base.css + `main.js` — logo fade/scale, hides on `window.load` (~700ms) |
| Cinematic Hero | `Hero.astro` + home.css + `animations.js` — Ken Burns on `.hero-bg`, SplitType + GSAP timeline |
| Scroll Reveal | `data-reveal` / `data-reveal-stagger` → GSAP ScrollTrigger (hidden via `html.has-js [data-reveal]{opacity:0}`) |
| Custom Cursor | `cursor.js` — dot + ring, scales on hover links/cards, only `pointer:fine`, disabled on touch/reduced-motion |
| Reduced Motion | `@media (prefers-reduced-motion)` disables all animations, forces content visible |

---

## Menu Data Flow

**Single source:** `src/data/menu.js` (`menuData`, `menuOrder`, `sliderCategories`)

| Page | Rendering |
|------|-----------|
| `menu.astro` | Build-time (server-rendered) from data. Dishes = `<a>` links with query params to `dish-detail.html` |
| `category.astro` | Client-side: imports `menuData`, reads `?category=`, renders cards |
| `dish-detail.astro` | Client-side: reads `?name=&image=&description=&price=`, fills content |

> Image paths in data are **absolute** (`/images/...`) — use directly, no `../` prefix.

---

## Dev Commands

```bash
npm install      # deps (.npmrc handles internal TLS proxy — gitignored)
npm run dev      # http://localhost:4321
npm run build    # builds to dist/
npm run preview  # preview static build
npm run codelog:generate  # rebuild codelog.md from git history
```

---

## Critical Rules for Developers

1. **New page** → `src/pages/<name>.astro`, wrap in `<Layout>`, import page CSS if needed
2. **Colors** → Use `base.css` tokens, never hardcode hex
3. **Scroll animations** → Add `data-reveal` / `data-reveal-stagger`, no JS needed
4. **Menu edits** → Only modify `src/data/menu.js`
5. **Deploy** → `npm run build`, upload `dist/` contents to `public_html/` (see `DEPLOY.md`)
6. **Don't switch to SSR** — Hostinger shared hosting cannot run Node

---

## Legacy (delete once confirmed)

Old vanilla files at root: `*.html`, `_includes/`, `js/`, `style/`, `data/menu-data.js` — fully replaced by `src/`