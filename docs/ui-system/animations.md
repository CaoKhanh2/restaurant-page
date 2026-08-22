# ✨ Effects & Animations

---

## Preloader

**File:** `Preloader.astro` + `base.css` + `main.js → hidePreloader()`

- Logo **fade + scale** on page load
- Auto-hides after `window.load` (minimum ~700ms to avoid flicker)
- **Disabled automatically** when the user has `prefers-reduced-motion` enabled

---

## Hero Cinematic

**File:** `Hero.astro` + `home.css` + `animations.js`

- The `.hero-bg` layer runs a **Ken Burns** effect (slow zoom + pan)
- Text reveals layer by layer using a **SplitType + GSAP timeline**

---

## Scroll Reveal

Mechanism based on `data-*` attributes — no extra JS needed:

| Attribute | Purpose |
|---|---|
| `data-reveal` | Animate **one element** when scrolled into view |
| `data-reveal-stagger` | Animate **child elements** one after another (stagger) |

**How it works:**
1. When `html.has-js` → CSS hides all `[data-reveal]` initially (`opacity: 0`)
2. GSAP ScrollTrigger watches scroll → triggers the animation when elements enter the viewport

---

## Custom Cursor

**File:** `cursor.js`

- Made of **2 layers**: a small dot (center) + a larger ring (lagging behind)
- Scales up when hovering links / cards
- **Only shown** on `pointer: fine` devices (real mouse)
- **Disabled automatically** on touch devices or with `prefers-reduced-motion`
- ⚠️ **`z-index: 10050`** (in `base.css`) — must be higher than the lightbox (10002), otherwise it gets hidden when viewing images. See [gallery.md](./gallery.md).

> Gallery has its own **lightbox** (keyboard/swipe/counter) — see [gallery.md](./gallery.md).

---

## Reduced Motion

All animations are disabled when the user enables **Reduce Motion** at the OS level:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations + force content to show immediately */
}
```

Handled in `base.css` — applies site-wide.

---

## Libraries used

| Library | Purpose |
|---|---|
| **GSAP** + ScrollTrigger | Main animations, scroll reveal |
| **Lenis** | Smooth scroll |
| **SplitType** | Text splitting for per-character / per-line animation |
