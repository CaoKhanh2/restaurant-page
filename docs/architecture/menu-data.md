# 🍽️ Menu & Gallery Data Flow (HYBRID: static + DB)

> A **progressive enhancement** model: render **statically from code** at build time (SEO + works without a backend),
> then **auto-upgrade from the DB** via the PHP API if the backend is live. If the API fails/is unavailable → keep the static version.

---

## 2 data sources

| Source | What it is | Role |
|---|---|---|
| **Code (build-time)** | `src/data/menu.js` (`menuData`, `menuOrder`, `sliderCategories`) + images in `/images` | **Fallback + SEO** — always rendered, even without a backend |
| **DB (runtime)** | MySQL via PHP API `/api/menu.php`, `/api/gallery.php` | **Live content** — reflects edits made in the admin panel |

> The DB is initially **seeded from `menu.js`** (see `server/seed.php`). `menu.js` remains as the fallback — **do not delete it**.

---

## Hybrid diagram

```
src/data/menu.js ──(build-time)──► static HTML (menu/gallery displayed immediately)
                                          │
                             (client) fetch /api/*.php
                                          │
                     ┌─────────────────────┴─────────────────────┐
               API OK + data present                   API error / empty
                     │                                            │
        replace content with DB data                  KEEP the static version
```

---

## Page-by-page details

### `menu/index.astro` → `/menu.html`
- **Build-time:** renders all tabs + à-la-carte (64 dishes) from `menu.js`.
- **Client:** `fetch('/api/menu.php')` → if `categories[].dishes[]` exists, **replaces each `.carte-grid` innerHTML** by `#cat-{key}`. Tab/section structure stays unchanged (fixed categories).
- On error/empty DB → keep the static version.

### `gallery.astro` → `/gallery.html`
- **Build-time:** 15 images from `/images/food/*` + lightbox.
- **Client:** `fetch('/api/gallery.php')` → if `images[]` exists, replace the grid + rebind the lightbox.

### `menu/category.astro` → `/menu/category.html`
- Rendered **client-side from bundled `menuData`** (static, no API). Reads `?category=`.
- *(Optional future work: switch to `/api/menu.php?category=` to sync with the DB.)*

### `menu/dish-detail.astro` → `/menu/dish-detail.html`
- Reads query params `?name=&image=&description=&price=` (passed from the card). No API call.

### `SliderMenu.astro` (homepage + subpages)
- Build-time from `sliderCategories` in `menu.js`. Links go through `url()`.

---

## API contract (PHP → JSON)

| Endpoint | Method | Returns |
|---|---|---|
| `/api/menu.php` | GET | `{ categories: [{ key, title_fr, title_en, dishes: [{ name_fr, name_en, price, description_fr, image_path, is_featured }] }] }` |
| `/api/menu.php?category=KEY` | GET | `{ dishes: [...] }` |
| `/api/gallery.php` | GET | `{ images: [{ image_path, alt_text, display_order }] }` |

> ⚠️ **DB fields differ from code fields:** the DB uses `name_fr/name_en/image_path/is_featured`, while `menu.js` uses `name/translation/image/featured`. The client script maps to the DB field names when upgrading. Backend details: [backend.md](./backend.md).

---

## Image path notes
- Images in `menu.js` (fallback) use absolute paths `/images/...` (deployed via `public/`).
- Images from the DB (`image_path`) may be `/images/...` (seeded) or `/uploads/...` (admin uploads) — the `uploads/` directory must exist on the server.
