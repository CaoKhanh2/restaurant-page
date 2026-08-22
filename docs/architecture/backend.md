# 🗄️ Backend PHP (`server/`) & Hybrid Deploy

> The site is **hybrid**: Astro frontend (static) + **PHP + MySQL** backend in `server/`.
> The frontend fetches dynamic data via `fetch('/api/*.php')` (gallery, menu, reservations…).

---

## `server/` structure

| Path | Role | Deploy |
|---|---|---|
| `server/api/` | Public API (gallery, menu, banners, reservations, analytics) | **Automatic** (CI → `/api`) |
| `server/admin/` | Admin panel (dashboard, pages/, api/, includes/) | **Automatic** (CI → `/admin`) |
| `server/config/db.php` | **SECRETS** — DB credentials | **Manual, once** (gitignored) |
| `server/schema.sql` | MySQL schema (7 tables) | Import once via phpMyAdmin |
| `server/seed.php` | Data seeder | Run once then **DELETE** |
| `uploads/` (on server) | Admin-uploaded images (runtime) | **Manual**, must persist |

---

## Deploy: CODE separated (automatic) vs SECRETS/RUNTIME (manual)

### CODE part — automatic via CI
`.github/workflows/deploy.yml`, after building Astro, **copies `server/api`→`dist/api` and `server/admin`→`dist/admin`**, then pushes to the `deploy` branch. Hostinger pulls `deploy` → gets both static + PHP.

### SECRETS/RUNTIME part — manual, one-time (NOT via git)
- `config/db.php` (DB password) and `uploads/` (images) are **gitignored**, placed directly on `public_html/` once.
- CI does **not** touch these two.

### ⚠️ IMPORTANT WARNING — persistence
Hostinger GIT auto-deploy must use **`git pull`/merge** (keeping untracked files) so that `config/` and `uploads/` are **not deleted** on every deploy.
- If Hostinger does a **clean checkout/reset** → it will **DELETE** `config/db.php` + all `uploads/` images → site down + images lost.
- **Safe approach:** check Hostinger's deploy mode; if it resets, place `uploads/` and `config/` **outside** the git-managed directory (e.g., use an absolute path in `db.php`, or a symlink), or deploy the backend entirely manually.

---

## Initial setup (one-time)

1. **Create MySQL** (hPanel → Databases) — note down DB name/user/pass (prefix `u444601569_`).
2. **Import** `server/schema.sql` via phpMyAdmin → 7 tables + 12 categories.
3. Create **`public_html/config/db.php`** and fill in credentials (do NOT commit).
4. Create **`public_html/uploads/`** (writable 755/775) for admin images.
5. **Subdomain** `admin.les-4saisonsgeneve.ch` → point to `public_html/admin/`.
6. **Seed:** change `SEED_TOKEN` to something random → run `…/seed.php?token=…` → **DELETE `seed.php`** immediately after.
7. **Change the default admin password** (`admin`/`change_me_123`) via phpMyAdmin.

> Step-by-step details + checklist: see `DEPLOY.md` (root).

---

## Security — mandatory
- `server/config/db.php` **must be gitignored** (never push passwords to the repo). CI does not deploy this file; create `public_html/config/db.php` manually from `server/config/db.example.php`.
- Do not leave `seed.php` on the server after seeding.
- Change the default admin password right away.
- Admin APIs (`server/admin/api/`) must check `auth.php` (session/token) before any write operation.

---

## 🔌 API endpoints
| Endpoint | Description |
|---|---|
| `GET /api/menu.php` | `{ categories:[{key,title_fr,title_en,dishes:[{name_fr,name_en,price,description_fr,image_path,is_featured}]}] }` |
| `GET /api/menu.php?category=KEY` | `{ dishes:[...] }` |
| `GET /api/gallery.php` | `{ images:[{image_path,alt_text,display_order}] }` |
| `POST /api/reservations.php` | Creates a booking → `{success,id}` |
| `POST /api/analytics.php` | Records a page view (204) |

The frontend follows the **hybrid** model (static + DB upgrade) — see [menu-data.md](./menu-data.md).

---

## ✅ Verifying the DB connection
Cannot be tested from a dev machine (DB is remote). How to verify on Hostinger:
1. **Fastest:** open `https://les-4saisonsgeneve.ch/api/menu.php`:
   - JSON `{"categories":[…]}` returned with data → ✅ DB OK + seeded.
   - 500 error / `SQLSTATE…` → ❌ wrong credentials / DB name / missing tables → check `config/db.php` + schema.
   - 404 → backend **not deployed yet** (`/api/menu.php` doesn't exist).
2. **phpMyAdmin** (hPanel): open DB `u444601569_restaurant` → all 5+ tables present (categories, dishes, gallery, reservations, analytics) + seed data?
3. Temporarily create `server/dbtest.php` calling `getDB()` that reports OK/error → open its URL → **delete immediately**.

---

## 🛡️ Anti-spam / anti-overload

### ✅ `reservations.php` — DONE (2026-06-20)
- **Honeypot** hidden field `website` → if bots fill it, **pretend success without saving**.
- **Time-trap**: submission < 2s after opening the form → discarded (via `form_time` sent by frontend).
- **Per-IP rate limit**: ≤ **5 requests/hour** (file-based + `flock` in `sys_get_temp_dir()`) → returns **`429`**.
- **Length limits** on every field (nom/prenom 80, email 120, objet 150, message 2000) + raw payload **≤ 8KB**.
- **CORS tightened** to `les-4saisonsgeneve.ch` (removed `*`).
- Frontend `about.astro`: added honeypot + `form_time`, shows a dedicated message on `429`.

### ⚠️ STILL MISSING
| Endpoint | To add |
|---|---|
| `analytics.php` (POST) | Visitor stats using `COUNT(DISTINCT ip_hash)`; throttle/sampling can still be added if needed to reduce page-event rows in the DB |
| `menu.php` · `gallery.php` (GET) | CORS is currently `*` (low risk: read-only + 60s cache); consider server-side caching under heavy traffic |
| General | *(optional)* Cloudflare Turnstile/reCAPTCHA for forms; firewall/rate-limit at Hostinger/Cloudflare |
