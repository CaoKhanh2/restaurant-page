# Deployment Guide — Hostinger (Astro static site)

The website is now built with **Astro** in **static** mode → it produces a `dist/` folder containing only plain HTML/CSS/JS.
Hostinger (shared hosting) **only serves static files, no Node runtime** → **no conflict**. Process: build locally → upload `dist/`.

> ⚠️ Absolutely do **not** change `astro.config.mjs` to `output: 'server'` or add an SSR adapter — that requires a Node runtime and will not run on shared hosting.

---

## 1. Build locally

```bash
npm install        # first time only (.npmrc already handles internal TLS proxy errors)
npm run build      # produces dist/
```

Check the static build before uploading:

```bash
npm run preview    # open http://localhost:4321
```

## 2. Upload to Hostinger

Open **hPanel → File Manager** (or use FTP/SFTP):

1. Go to the `public_html/` folder of the domain `les-4saisonsgeneve.ch`.
2. **Delete the old contents** of `public_html/` (back up first if needed).
3. Upload **everything INSIDE `dist/`** into `public_html/`
   (i.e. `index.html`, `menu.html`, `about.html`, `gallery.html`, the `sub-page/` folder, `images/`, `icon/`, `_astro/`, `.htaccess`, `404.html`…).
   → Note: upload the **contents** of `dist/`, do NOT upload the `dist` folder itself and end up with files inside `public_html/dist/`.

Done. Visit `https://les-4saisonsgeneve.ch` to verify.

### Quick upload tip
Zip `dist/` into a `.zip`, upload the single zip file to `public_html/`, then use the File Manager's **Extract** feature to unzip it in place (make sure the files end up directly in `public_html/`).

---

## 3. (Optional) Automate with GitHub Actions → FTP

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

Declare `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` under **GitHub → Settings → Secrets**
(get FTP credentials from hPanel → Files → FTP Accounts). CI uses `npm ci` on a clean runner so there's **no TLS error** like on local machines → no need for `.npmrc`.

---

## Admin Dashboard — Dedicated deployment guide

### Step 1: Create MySQL Database
1. hPanel → **Databases** → Create new MySQL database
2. Note down: DB name, username, password (prefix `u444601569_`)

### Step 2: Import schema
1. hPanel → **phpMyAdmin** → select the newly created database
2. **Import** tab → select `server/schema.sql` → Execute
3. Verify: 7 tables created + 12 categories seeded

### Step 3: Configure the database
- Copy `server/config/db.example.php` to `public_html/config/db.php`
- Fill in the DB name, username, password matching Step 1
- **Do NOT commit this file to git!**

### Step 4: Create the admin subdomain
1. hPanel → **Domains** → Subdomains
2. Create `admin.les-4saisonsgeneve.ch` → point it to `public_html/admin/`

### Step 5: Upload PHP files
Upload the entire contents of `server/` into `public_html/` (merge, don't delete Astro files):
```
public_html/
├── api/          ← from server/api/
├── config/       ← from server/config/
├── uploads/      ← from server/uploads/
└── admin/        ← from server/admin/
```

### Step 6: Seed menu data
1. Open `server/seed.php` → change `SEED_TOKEN` to a random string
2. Upload the file → visit: `https://les-4saisonsgeneve.ch/seed.php?token=RANDOM_STRING`
3. Check for "73 dishes inserted" → **DELETE seed.php immediately!**

### Step 7: Deploy the Astro site
```bash
npm run build
```
Upload `dist/` into `public_html/` (keep api/, config/, uploads/, admin/ — do not delete them)

### Step 8: Change the admin password
Visit `https://admin.les-4saisonsgeneve.ch`  
Login: `admin` / `change_me_123`  
→ **Change it right away in the database via phpMyAdmin** (run an UPDATE query with a new password_hash)

---

## Post-deployment checklist

- [ ] Home page loads: preloader runs briefly → hero Ken Burns + text appears layer by layer.
- [ ] `/menu` loads dishes from the API (no more hardcoded data).
- [ ] `/gallery` loads images from the API.
- [ ] Booking form on `/about` submits → receives "Votre demande a été envoyée".
- [ ] `admin.les-4saisonsgeneve.ch` → login succeeds.
- [ ] Dashboard shows stats + visitors chart.
- [ ] Add a new dish in admin → it appears on `/menu`.
- [ ] "La carte des mets" slider → click a category → dish list loads from the API.
- [ ] Dark/light toggle works and persists the choice.
- [ ] Test on mobile: hamburger menu works, layout doesn't break.
