# 📚 Project documentation — Les 4 Saisons

> Restaurant website for **Les 4 Saisons** — Genève | Domain: `les-4saisonsgeneve.ch`
> Stack: **Astro 6 (static)** · Deploy: **Hostinger shared hosting**

> 📝 **[CHANGELOG.md](./CHANGELOG.md)** — log of changes made to the project.

---

## Documentation structure

```
docs/
├── getting-started/     # Quick start with the project
├── architecture/        # System architecture & data flow
├── ui-system/           # UI, theme, effects
├── deployment/          # Deployment guide
└── contributing/        # Rules & notes for further development
```

---

## 🚀 Getting Started

| File | Contents |
|---|---|
| [overview.md](./getting-started/overview.md) | Introduction, tech stack, common commands |

---

## 🏗️ Architecture

| File | Contents |
|---|---|
| [structure.md](./architecture/structure.md) | Detailed directory diagram, list of legacy directories that were cleaned up |
| [menu-data.md](./architecture/menu-data.md) | Menu data sources, flow diagram, page-by-page details |
| [routing.md](./architecture/routing.md) | `url()` helper — dev/prod `.html` gotcha, avoiding 404s |
| [backend.md](./architecture/backend.md) | PHP backend (`server/`), API, hybrid deploy, secrets security |

---

## 🎨 UI System

| File | Contents |
|---|---|
| [theme.md](./ui-system/theme.md) | Dark/Light system, FOUC prevention, CSS tokens table |
| [animations.md](./ui-system/animations.md) | Preloader, cinematic hero, scroll reveal, custom cursor |
| [i18n.md](./ui-system/i18n.md) | FR/EN multilingual support (`data-i18n`), menu keys to add |
| [menu-page.md](./ui-system/menu-page.md) | Menu page: sticky tabs, dish cards, fallback, signature items |
| [gallery.md](./ui-system/gallery.md) | Gallery lightbox (keyboard/swipe/counter) |

---

## 🚢 Deployment

| File | Contents |
|---|---|
| [hostinger.md](./deployment/hostinger.md) | Build, manual upload, GitHub Actions CI/CD, checklist |

---

## 🤝 Contributing

| File | Contents |
|---|---|
| [dev-notes.md](./contributing/dev-notes.md) | Development rules, new-page template, gotchas |
