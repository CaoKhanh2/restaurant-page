# 🛠️ Notes for Continued Development

---

## General rules

| Task | How to do it right |
|---|---|
| **Add a new page** | Create `src/pages/<name>.astro`, wrap it in `<Layout>`, import its CSS if needed. Route = filename + `.html` |
| **Add an internal link** | **Wrap it via `url()`** (`src/scripts/utils/url.js`) — e.g. `href={url('/menu')}`. Hardcoding `.html` will **404 in dev**. See [routing.md](../architecture/routing.md) |
| **Add a translatable string** | Add `data-i18n="key"` + add the key to `src/scripts/i18n.js` (FR & EN). See [i18n.md](../ui-system/i18n.md) |
| **Add a new color** | Use tokens from `base.css`, **never hardcode hex values** |
| **Animate on scroll** | Add `data-reveal` / `data-reveal-stagger` to elements — no JS needed |
| **Edit the menu** | Only edit `src/data/menu.js` |
| **Deploy** | `npm run build` → upload the **contents of `dist/`** to `public_html/` (see [hostinger.md](../deployment/hostinger.md)) |

---

## Cleaning up legacy folders

The old vanilla files/folders still at the root have been **fully replaced** by `src/`:

```
*.html (root)
_includes/
js/
style/
data/menu-data.js
```

> ✅ They can be **safely deleted** once the Astro version has been confirmed stable in production.

---

## Template for adding a new page

```astro
---
// src/pages/page-name.astro
import Layout from '../layouts/Layout.astro';
import '../styles/page-name.css';
---

<Layout title="Page title" description="SEO description">
  <main>
    <!-- Page content -->
  </main>
</Layout>
```

---

## Gotchas & important notes

1. **Image paths** in `menu.js` are absolute (`/images/...`) → use them directly, no `../` prefix
2. **`.npmrc`** contains `strict-ssl=false` for the internal proxy — **do not commit** it to git
3. **`dist/`** is build output — **gitignored**, never commit it
4. Don't serve the site with Live Server directly on the root `.html` files — use `npm run dev`
5. Don't enable SSR / adapters — Hostinger shared hosting only serves static files
6. **Internal links** must go through `url()` — hardcoding `.html` → 404 in dev ([routing.md](../architecture/routing.md))
7. **`position: sticky`** requires `body { overflow-x: clip }` (NOT `hidden`) — already set in `base.css`
8. The **custom cursor** `z-index: 10050` must be > lightbox (10002) — don't lower it
9. Menu tabs/scroll-spy use **`data-target`** (not `href="#"`) to avoid clashing with the global anchor handler
