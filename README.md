# Restaurant Les 4 Saisons

Website for **Les 4 Saisons** — Chinese/Hong Kong cuisine restaurant in Geneva.  
Domain: [les-4saisonsgeneve.ch](https://les-4saisonsgeneve.ch)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Astro 6 (static output) |
| **Styling** | Plain CSS with CSS custom properties (tokens) |
| **Animation** | GSAP + ScrollTrigger, Lenis (smooth scroll), SplitType |
| **Theme** | Dark/light (warm) via CSS variables + localStorage |
| **Fonts** | Playfair Display + Roboto (Google Fonts) |
| **Icons** | Font Awesome (CDN) |
| **Admin** | PHP 8 + MySQL (separate deployment) |
| **Hosting** | Hostinger shared hosting (static files only) |

---

## Key Features

- **Cinematic hero** — Ken Burns background + SplitType text reveal
- **Scroll animations** — `data-reveal` / `data-reveal-stagger` (GSAP ScrollTrigger)
- **Custom cursor** — Dot + ring, scales on interactive elements (desktop only)
- **Preloader** — Logo intro animation, respects `prefers-reduced-motion`
- **Menu system** — Single data source (`src/data/menu.js`), builds à-la-carte at build time, category/dish detail on client
- **Bilingual ready** — i18n structure in place (FR/EN)
- **Admin dashboard** — Vue.js app for reservations, gallery, menu management

---

## Project Structure

```
restaurant-page/
├── src/
│   ├── pages/           # Routes (index, menu, about, gallery, 404, sub-pages)
│   ├── layouts/         # Layout.astro (shared head, theme, header/footer)
│   ├── components/      # UI components (Hero, SliderMenu, Gallery, etc.)
│   ├── data/            # menu.js (SINGLE SOURCE), site.js
│   ├── styles/          # base.css (tokens) + page-specific CSS
│   └── scripts/         # main.js, animations.js, cursor.js
├── public/              # Static assets (images, icons, .htaccess)
├── server/              # PHP admin (API, config, uploads, admin Vue app)
├── dist/                # Build output (gitignored) — upload this to Hostinger
├── doc/                 # Documentation summaries
│   ├── codebase-summary.md
│   └── deploy-summary.md
├── codelog.md           # Manual changelog + git history regeneration
└── scripts/
    └── codelog-generate.js
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev        # http://localhost:4321

# Build for production
npm run build      # outputs to dist/

# Preview production build
npm run preview

# Regenerate codelog from git history
npm run codelog:generate
```

---

## Deployment

### Static Site (Astro)
1. `npm run build`
2. Upload **contents of `dist/`** to `public_html/` on Hostinger

### Admin Dashboard (PHP)
See [doc/deploy-summary.md](doc/deploy-summary.md) for full setup:
- MySQL database + schema import
- Subdomain `admin.les-4saisonsgeneve.ch` → `public_html/admin/`
- Upload `server/` contents to `public_html/`
- Seed menu data → delete `seed.php`
- Change default admin password

### Automated (GitHub Actions)
Configure FTP secrets and push to `main` — see [doc/deploy-summary.md](doc/deploy-summary.md#automated-deploy-github-actions--ftp)

---

## Documentation

| File | Description |
|------|-------------|
| [doc/codebase-summary.md](doc/codebase-summary.md) | Architecture, theme, animations, data flow, dev rules |
| [doc/deploy-summary.md](doc/deploy-summary.md) | Manual/auto deploy, admin setup, checklist |
| [CODEBASE.md](CODEBASE.md) | Full codebase documentation |
| [DEPLOY.md](DEPLOY.md) | Full deployment guide |
| [codelog.md](codelog.md) | Change log (manual + git-regenerated) |

---

## Critical Rules

- ❌ **Never** switch Astro to `output: 'server'` or add SSR adapter — Hostinger cannot run Node
- ✅ Edit menu only in `src/data/menu.js`
- ✅ Use CSS tokens from `base.css`, never hardcode colors
- ✅ Add scroll animations via `data-reveal` attributes, no JS needed
- ✅ Run `npm run codelog:generate` after significant changes

---

## License

Private project for Restaurant Les 4 Saisons, Geneva.