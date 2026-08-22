# 🚀 Deployment Guide — Hostinger

> The site is built with **Astro static** → produces a `dist/` folder of pure HTML/CSS/JS.
> Hostinger shared hosting **only serves static files, no Node** → no conflict.

> ⚠️ **Never** switch `astro.config.mjs` to `output: 'server'` or add an SSR adapter
> — that requires a Node runtime and will **not run** on shared hosting.

---

## Step 1 — Build locally

```bash
npm install        # first time only (.npmrc already handles internal TLS proxy errors)
npm run build      # generates dist/
```

Check the static build before uploading:

```bash
npm run preview    # opens http://localhost:4321
```

---

## Step 2 — Upload to Hostinger

Open **hPanel → File Manager** (or use FTP/SFTP):

1. Go to the `public_html/` folder of the domain `les-4saisonsgeneve.ch`
2. **Delete the old contents** of `public_html/` (back up first if needed)
3. Upload **everything INSIDE `dist/`** into `public_html/`:
   - Files: `index.html`, `menu.html`, `about.html`, `gallery.html`
   - Folders: `menu/`, `images/`, `icon/`, `_astro/` (+ `api/`, `admin/`, `config/`, `uploads/` if deploying with the backend)
   - Files: `.htaccess`, `404.html`

> ⚠️ Upload the **contents** of `dist/` — do **NOT** upload the whole `dist` folder and end up with files inside `public_html/dist/`.

### Quick upload tip (zip)
1. Zip the `dist/` folder into a `.zip` file
2. Upload the zip file to `public_html/`
3. Use the File Manager's **Extract** feature to unzip in place

---

## Step 3 — Enable SSL & force HTTPS (recommended, for stability + security)

1. hPanel → **Security → SSL** → install the free SSL (Let's Encrypt) for `les-4saisonsgeneve.ch`. Wait for the status to become **Active** (a few minutes).
2. **Force HTTPS:** enable the **"Force HTTPS"** toggle in hPanel (or uncomment the `RewriteCond %{HTTPS} off` block in `.htaccess`).
3. Open `https://les-4saisonsgeneve.ch` → seeing the green padlock means it's OK.

> Assets all use root-relative absolute paths (`/images`, `/_astro`) so they work correctly on the main domain; you can test first on Hostinger's temporary URL (`*.hostingersite.com`) before pointing the domain.

---

## Step 4 — Automation: push `main` → CI builds → `deploy` branch (CURRENT SETUP)

> ⚠️ **IMPORTANT:** Hostinger serves the **`deploy`** branch and does **NOT build for you**. Astro only becomes a real site after building (`dist/`).
> ⇒ The `deploy` branch must contain the **built output**, NOT source. **Manually merging `main → deploy` will NOT work** (it would just push unbuilt source).

File **`.github/workflows/deploy.yml`** (already created): push `main` → `npm run build` → pushes `dist/` to the `deploy` branch (peaceiris/actions-gh-pages, keeping linear history so Hostinger's `git pull` fast-forwards).

**Activation (once):**
```bash
git add .github/workflows/deploy.yml package-lock.json
git commit -m "ci: auto build + deploy dist to deploy branch"
git push origin main
```
> ⚠️ The first push will **overwrite the `deploy` branch** (old vanilla site → new Astro site — this is intentional). To back up first:
> `git push origin origin/deploy:refs/heads/deploy-backup`

**Hostinger configuration:**
- hPanel → Advanced → **GIT**: point to the repo, branch **`deploy`**, path `/` (`public_html`).
- Enable **Auto-Deployment** so Hostinger pulls automatically when `deploy` changes. If you want CI to trigger it → add the secret **`HOSTINGER_DEPLOY_HOOK`** (GitHub → Settings → Secrets → Actions = hPanel GIT webhook URL). Otherwise, after each CI run, click **Deploy** in hPanel GIT manually.

**From now on:** just **push to `main`** → CI builds automatically → deploys. **No more manual merges** main→deploy.

> CI runs on a clean runner (no proxy) → `.npmrc` is NOT needed there. `npm ci` requires a committed `package-lock.json`; if missing, the workflow falls back to `npm install`.

---

## Post-deployment checklist

- [ ] Homepage loads: preloader runs briefly → hero Ken Burns + text appears layer by layer
- [ ] `/menu.html`, `/gallery.html`, `/about.html` display with the correct warm tones
- [ ] Clicking a dish in the menu → opens `/menu/dish-detail.html?...` with the right content
- [ ] "La carte des mets" slider → clicking a category opens `/menu/category.html?category=...` with the dish list
- [ ] Dark/light toggle works and persists the choice
- [ ] Open on mobile: hamburger menu works, layout doesn't break
- [ ] Entering a wrong URL → shows the nice 404 page (thanks to `.htaccess`)
