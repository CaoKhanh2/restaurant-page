# 🍽️ Menu Page — Layout & how it works

**File:** `src/pages/menu/index.astro` + `src/styles/pages/menu.css`

> Redesign goal: previously 12 groups / ~60 dishes laid out in **2 confusing columns with no navigation** → hard to read/browse.
> Now: **sticky tabs + one section per category + a card per dish**.

> **Hybrid data:** cards are rendered **statically at build time** from `menu.js` (SEO + fallback), then upgraded from **`/api/menu.php`** if the DB is live (replacing each `.carte-grid` innerHTML; on error → keeps static). See [menu-data.md](../architecture/menu-data.md).

---

## Page structure

```
#full-menu-page
├── .menu-header        (subtitle + h1 + legend 🌶️/🌱)
├── .menu-tabs          ← STICKY: Formules + 12 categories (buttons with data-target)
├── #cat-menus          (Formules — 4 set-menu-cards)
└── #cat-{key} ×12      (per category: header + .carte-grid dish cards)
```

---

## Sticky tab bar (`.menu-tabs`)

- `position: sticky; top: 84px` (below the header). **Requires** `body { overflow-x: clip }` in `base.css` — if set to `hidden`, sticky **does not** work.
- Buttons use **`<button data-target="cat-xxx">`** (NOT `href="#"`) to avoid clashing with the global anchor handler in `main.js`.
- Page script (inline in `menu.astro`):
  - Tab click → `window.__lenis.scrollTo(el, { offset: -118 })` (minus header + tab bar), fallback to `window.scrollTo`.
  - **Active state** follows scroll via an `IntersectionObserver` (`rootMargin: '-130px 0px -65% 0px'`) + auto-centers the active tab.
- If the header height differs → adjust `.menu-tabs { top }` and the `offset`.

---

## Dish card (`.carte-card`)

Grid of `repeat(auto-fill, minmax(220px, 1fr))`. Each card is an `<a>` link to dish-detail (via `url()` — see [routing.md](../architecture/routing.md)).

| Component | Description |
|---|---|
| Real photo | When `image` is not a placeholder |
| **Fallback tile** | Dish missing a photo → warm gradient + `fa-bowl-food` icon + "Les 4 Saisons" → consistent, never "broken" |
| **"Signature" badge** | Dishes with `featured: true` |
| 🌶️ / 🌱 tags | 🌶️ extracted from the name (`isSpicy`); 🌱 if the category is `vegetariens` |
| Price | Gold, bottom of card |

Helper logic (frontmatter of `menu.astro`): `splitTitle` (splits "FR / EN"), `isPlaceholder`, `isSpicy`, `cleanName` (strips 🌶️ from the display name), `catIcons` (medallion icons for potages/entrees/dimsum/poulet/boeuf).

---

## i18n
Static labels already have `data-i18n="menu.*"` — the keys need to be added to `i18n.js`, see [i18n.md](./i18n.md). Dish names come from `menu.js`.

## Set menus (Formules)
4 fixed cards (`setMenus` in the frontmatter), section `#cat-menus`, with its own "Formules" tab.
