# 🔗 Routing & `url()` Helper

---

## The problem (important gotcha)

`astro.config.mjs` uses `build.format: 'file'` → at **build** time it generates `/menu.html`, `/gallery.html`…
But Astro's **dev server** (`npm run dev`) only serves **clean paths** (`/menu`, `/gallery`), and does **not** accept `.html`.

→ If you hardcode links as `href="/menu.html"`, they will **404 in dev** (still work in prod).

---

## The solution — `src/scripts/utils/url.js`

```js
export function url(path, query = '') {
  const suffix = import.meta.env.PROD ? '.html' : '';
  return `${path}${suffix}${query}`;
}
```

| Environment | `url('/menu')` | Note |
|---|---|---|
| **Dev** (`npm run dev`) | `/menu` | Astro dev doesn't accept `.html` |
| **Prod** (`npm run build`) | `/menu.html` | `build.format:'file'` |

For queries, pass a second argument:
```js
url('/menu/dish-detail', '?name=...&price=...')
// dev  → /menu/dish-detail?name=...
// prod → /menu/dish-detail.html?name=...
```

---

## Usage rules

✅ **EVERY internal link ending in `.html`** must go through `url()`:

```astro
---
import { url } from '../scripts/utils/url.js';   // adjust ../ depth to match your file's location
---
<a href={url('/menu')}>La carte</a>
<a href={url('/about')}>À propos</a>
```

It also works inside client-side `<script>` blocks (Vite replaces `import.meta.env.PROD` at build time):
```js
import { url } from '../../scripts/utils/url.js';
const href = url('/menu/dish-detail', '?' + new URLSearchParams(d).toString());
```

❌ Do **NOT** use `url()` for: external links, `tel:`, assets (images/fonts), `#...` anchors, or `href="/"` (homepage — identical in dev/prod).

---

## Where it has been applied

`Header.astro` · `SliderMenu.astro` · `Hero.astro` · `AboutTeaser.astro` · `menu/index.astro` (dishHref) ·
`menu/dish-detail.astro` (Retour button) · `menu/category.astro` (client-side `dishHref`).

> When adding new links → remember to wrap them in `url()`, otherwise they will 404 in dev.
