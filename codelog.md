# Code Change Log

> **Manual entries** — Developers add entries here when making changes.
> **Regenerate from git** — Run `npm run codelog:generate` to rebuild from commit history.

---

## [Unreleased]

### Added
- 

### Changed
- 

### Removed
- 

### Fixed
- 

---## [2026-08-22]

### Refactored
- **Refactor code comments for clarity and consistency across various components and scripts; enhance CORS, payload size limits, and validation in reservations API; improve UI elements and styles in layout, menu, and gallery pages; implement progressive enhancement for menu and gallery data fetching; update cursor and animation features for better user experience.** (5f98402)

---

## [2026-06-28]

### Added
- **escapeHtml** (server/admin/assets/js/admin.js): added function (7a52ce3)
- **formatDate** (server/admin/assets/js/admin.js): added function (7a52ce3)
- **formatDateTime** (server/admin/assets/js/admin.js): added function (7a52ce3)
- **formatCurrency** (server/admin/assets/js/admin.js): added function (7a52ce3)
- **statusLabel** (server/admin/assets/js/admin.js): added function (7a52ce3)
- **appendText** (src/components/ui/AnnouncementBanner.astro): added function (0e2f896)
- **renderAnnouncements** (src/components/ui/AnnouncementBanner.astro): added function (0e2f896)
- **loadAnnouncements** (src/components/ui/AnnouncementBanner.astro): added function (0e2f896)
- **t** (src/components/ui/AnnouncementBanner.astro): added function (0e2f896)
- **s** (src/components/ui/AnnouncementBanner.astro): added function (0e2f896)
- **s** (src/components/ui/AnnouncementBanner.astro): added function (0e2f896)

### Removed
- **toggleActive** (server/admin/assets/js/admin.js): removed function (7a52ce3)

### Refactored
- **feat: refactor admin dashboard and enhance UI with Vue.js - Replaced the existing JavaScript with a Vue.js application for better state management and reactivity. - Updated the dashboard to display key metrics such as visitors today, this week, and pending reservations using Vue components. - Improved the analytics page with a new Vue.js structure, allowing for dynamic data loading and chart rendering. - Enhanced the gallery management interface with drag-and-drop image upload functionality and improved image visibility toggling. - Updated CSS styles for a more modern and cohesive look across the admin interface.** (7a52ce3)

---

## [2026-06-23]

---

## [2026-06-22]

### Fixed
- **fix: force lftp overwrite + log docroot for reliable deploy** (4c9bf2a)
- **fix: improve webhook trigger logic for Hostinger deployment** (a2e13a3)
- **fix: enhance login form security by adding autocomplete attributes** (9782399)

### Refactored
- **refactor: enhance deployment workflow with improved package assembly and Git push logic** (5394158)

---

## [2026-06-21]

### Fixed
- **fix: update API endpoints in admin panel to remove '/admin' prefix** (b138496)
- **Fix CI/CD: two-step FTP deploy, force sync PHP admin files** (68b3d82)
- **Fix reservation form lock - bulletproof 3-layer protection** (eabd0d0)
- **Fix CI/CD: single FTP step, no clean-slate, prevent deleting server files** (7e2b4e1)
- **Fix: replace real form inputs with fake divs - 100% bulletproof lock** (2a483bd)

---

## [2026-06-20]

### Fixed
- **fix: update workflow to Node 22 and fix FTP server-dir path** (7337595)
- **ci: fix Node version to 22 string format and add .nvmrc** (2d0a7a1)

---

