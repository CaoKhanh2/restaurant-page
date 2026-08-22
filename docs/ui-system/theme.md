# 🎨 Theme System (Dark / Light)

---

## How it works

### 1. FOUC prevention — `Layout.astro`
An `<script is:inline>` runs **before paint**:
- Reads `localStorage.theme`
- Sets `data-theme` on the `<html>` tag
- Adds the `has-js` class (enables hidden-initial state for reveal animations)

### 2. CSS Tokens — `src/styles/base.css`
Tokens are declared in:
- `:root` → **warm dark** (default)
- `[data-theme="light"]` → **warm cream (light)**

### 3. Toggle — `src/scripts/main.js → initThemeToggle()`
- Moon/sun button
- Toggles + persists to `localStorage`
- Smooth transition via the `.theme-transitioning` class

---

## Main CSS token table (`base.css`)

### Background & surface colors
| Token | Description |
|---|---|
| `--bg-page` | Page background color |
| `--bg-surface` | Card/panel surface color |
| `--bg-surface-alt` | Alternative surface |
| `--bg-hover` | Hover background |
| `--bg-input` | Input background |

### Text colors
| Token | Description |
|---|---|
| `--text-main` | Primary text |
| `--text-sub` | Secondary text |
| `--text-muted` | Muted text |
| `--text-faint` | Very faint text |

### Accent & Brand
| Token | Description |
|---|---|
| `--gold` | Primary gold color |
| `--gold-bright` | Bright gold (hover) |
| `--red` | Accent red |
| `--wine-1` / `--wine-2` / `--wine-3` | Wine-red gradient (slider) |

### Misc
| Token | Description |
|---|---|
| `--border-soft` / `--border-medium` | Border colors |
| `--header-*` | Dedicated header colors |
| `--radius*` | Corner radii |
| `--shadow-soft` / `--shadow-lift` | Shadows |
| `--ease` | Default cubic-bezier |

---

## Areas that intentionally do NOT change with the theme

| Component | Reason for staying fixed |
|---|---|
| **Footer** | Warm brown — brand identity |
| **`#menu-slider-section`** | Wine red — Hong Kong style |
| **Hero / Takeaway overlay** | Dark because it overlays photos |
| **`.category` in slider** | White text on bold backgrounds |
