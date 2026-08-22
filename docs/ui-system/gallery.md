# 🖼️ Gallery Page — Lightbox

**File:** `src/pages/gallery.astro` + `src/styles/gallery.css`

---

## Overview
- Masonry grid (CSS grid, `grid-auto-flow: dense`, some cells span 2 rows/columns via `:nth-child(5n/7n)`).
- **Vanilla lightbox** (no extra library): click an image → view it full screen.
- **Hybrid data:** images are rendered **statically at build time**, then upgraded from **`/api/gallery.php`** if the DB is live (on error → keeps static). The lightbox re-attaches itself after images are replaced. See [menu-data.md](../architecture/menu-data.md).

---

## Lightbox — features

| Interaction | Behavior |
|---|---|
| Click image / Enter / Space | Open the lightbox on that image |
| ‹ › buttons | Previous / next image (wraps around) |
| ← / → keys | Previous / next |
| Esc key / click backdrop | Close |
| Swipe left/right (mobile) | Previous / next |
| Counter | `3 / 15` |

- Blurred backdrop, smooth scale-in of the image, **preloads** the adjacent image.
- When open: locks background scroll (`html.lb-open { overflow: hidden }`) + **pauses Lenis** (`window.__lenis.stop()`), resumes on close.
- **Affordance:** hovering an image shows a **gold zoom icon** (`.grid-zoom`) in the center.
- **A11y:** `.grid-item` has `role="button" tabindex="0"`, gold focus ring, buttons have `aria-label`. Respects `prefers-reduced-motion`.

---

## ⚠️ Gotcha: custom cursor vs lightbox
The lightbox sits at `z-index: 10002`. The custom cursor (`.cursor-dot/.cursor-ring` in `base.css`) must have a **higher** `z-index` (currently **10050**) — otherwise, when the lightbox opens, `body.has-cursor { cursor: none }` hides the real cursor while the custom one stays **below** the lightbox → **no visible cursor** to click with.
