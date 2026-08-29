# Deployment Summary — Hostinger (Astro Static + PHP Admin)

> Source: `DEPLOY.md` | Target: les-4saisonsgeneve.ch on Hostinger shared hosting

---

## Core Principle

**Astro = static only** (`output: 'static'`). Build locally → upload `dist/`. Hostinger serves static files only — **no Node runtime**.

> ⚠️ Never change to `output: 'server'` or add SSR adapter.

---

## Quick Deploy (Manual)

```bash
# 1. Build locally
npm install
npm run build          # produces dist/

# 2. Verify
npm run preview        # http://localhost:4321

# 3. Upload via hPanel File Manager or FTP/SFTP
#    - Go to public_html/ for les-4saisonsgeneve.ch
#    - Delete old contents (backup first)
#    - Upload CONTENTS of dist/ (not the dist folder itself)
#      → index.html, menu.html, about.html, gallery.html, sub-page/, images/, icon/, _astro/, .htaccess, 404.html
```

**Pro tip:** Zip `dist/`, upload single `.zip` to `public_html/`, extract in place.

---

## Automated Deploy (GitHub Actions → FTP)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
      - name: Upload via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: ./public_html/
```

**Secrets needed** (GitHub → Settings → Secrets):
- `FTP_HOST` — from hPanel → FTP Accounts
- `FTP_USER`
- `FTP_PASSWORD`

> CI uses clean runner → no TLS errors → no `.npmrc` needed.

---

## Admin Dashboard (PHP + MySQL) — Full Setup

### Prerequisites
- Hostinger MySQL database
- Subdomain for admin panel

### Step-by-step

| Step | Action |
|------|--------|
| **1. Create DB** | hPanel → Databases → Create MySQL. Note: DB name, user, password (prefix `u444601569_`) |
| **2. Import schema** | phpMyAdmin → select DB → Import `server/schema.sql` → 7 tables + 12 categories |
| **3. Configure DB** | Copy `server/config/db.example.php` → `public_html/config/db.php`. Fill credentials. **Never commit!** |
| **4. Create subdomain** | hPanel → Domains → Subdomains → `admin.les-4saisonsgeneve.ch` → point to `public_html/admin/` |
| **5. Upload PHP** | Upload `server/` contents into `public_html/` (merge, don't delete Astro files):<br/>`public_html/api/`, `config/`, `uploads/`, `admin/` |
| **6. Seed menu** | Edit `server/seed.php` → set `SEED_TOKEN`. Upload → visit `https://les-4saisonsgeneve.ch/seed.php?token=YOUR_TOKEN` → "73 dishes inserted" → **DELETE seed.php immediately!** |
| **7. Deploy Astro** | `npm run build` → upload `dist/` to `public_html/` (keep `api/`, `config/`, `uploads/`, `admin/`) |
| **8. Change admin password** | Visit `https://admin.les-4saisonsgeneve.ch`<br/>Login: `admin` / `change_me_123`<br/>**Change immediately via phpMyAdmin** (UPDATE with new password_hash) |

---

## Post-Deploy Checklist

- [ ] Home: preloader → hero Ken Burns + text layers
- [ ] `/menu` loads dishes from API (not hardcoded)
- [ ] `/gallery` loads images from API
- [ ] About page booking form submits → "Votre demande a été envoyée"
- [ ] Admin subdomain login works
- [ ] Dashboard shows stats + visitors chart
- [ ] Add dish in admin → appears on `/menu`
- [ ] "La carte des mets" slider: click category → dishes load from API
- [ ] Dark/light toggle works & persists
- [ ] Mobile: hamburger menu works, layout intact

---

## File Structure After Deploy

```
public_html/
├── index.html, menu.html, about.html, gallery.html, 404.html
├── sub-page/
│   ├── category.html
│   └── dish-detail.html
├── images/          # from public/images/
├── icon/            # from public/icon/
├── _astro/          # Astro build assets
├── .htaccess
├── api/             # from server/api/
├── config/
│   └── db.php       # NOT in git!
├── uploads/         # from server/uploads/
└── admin/           # from server/admin/ (Vue.js dashboard)
```

---

## Critical Reminders

| Do | Don't |
|----|-------|
| Build locally, upload `dist/` contents | Upload `dist/` folder itself |
| Use `npm ci` in CI | Commit `config/db.php` or `seed.php` |
| Delete `seed.php` after use | Switch Astro to SSR mode |
| Change default admin password | Forget to merge PHP files (keep `api/`, `config/`, `uploads/`, `admin/`) |