# 🗄️ Backend PHP (`server/`) & Deploy Hybrid

> Site là **hybrid**: frontend Astro (static) + backend **PHP + MySQL** trong `server/`.
> Frontend gọi dữ liệu động qua `fetch('/api/*.php')` (gallery, menu, reservations…).

---

## Cấu trúc `server/`

| Đường dẫn | Vai trò | Deploy |
|---|---|---|
| `server/api/` | API công khai (gallery, menu, banners, reservations, analytics) | **Tự động** (CI → `/api`) |
| `server/admin/` | Trang quản trị (dashboard, pages/, api/, includes/) | **Tự động** (CI → `/admin`) |
| `server/config/db.php` | **SECRETS** — DB credentials | **Thủ công 1 lần** (gitignore) |
| `server/schema.sql` | Schema MySQL (7 bảng) | Import 1 lần qua phpMyAdmin |
| `server/seed.php` | Seed dữ liệu | Chạy 1 lần rồi **XOÁ** |
| `uploads/` (trên server) | Ảnh admin upload (runtime) | **Thủ công**, phải persist |

---

## Deploy: tách CODE (tự động) vs SECRETS/RUNTIME (thủ công)

### Phần CODE — tự động qua CI
`.github/workflows/deploy.yml` sau khi build Astro sẽ **copy `server/api`→`dist/api`, `server/admin`→`dist/admin`** rồi đẩy lên branch `deploy`. Hostinger pull `deploy` → có cả static + PHP.

### Phần SECRETS/RUNTIME — thủ công 1 lần (KHÔNG qua git)
- `config/db.php` (mật khẩu DB) và `uploads/` (ảnh) **gitignore**, đặt trực tiếp trên `public_html/` 1 lần.
- CI **không** đụng 2 thứ này.

### ⚠️ CẢNH BÁO QUAN TRỌNG — persistence
Hostinger GIT auto-deploy phải dùng **`git pull`/merge** (giữ file untracked) để `config/` và `uploads/` **không bị xoá** mỗi lần deploy.
- Nếu Hostinger làm **clean checkout/reset** → nó sẽ **XOÁ** `config/db.php` + toàn bộ ảnh `uploads/` → site sập + mất ảnh.
- **Cách an toàn:** kiểm tra chế độ deploy của Hostinger; nếu là reset, đặt `uploads/` và `config/` **ngoài** thư mục git quản lý (vd dùng path tuyệt đối trong `db.php`, hoặc symlink), hoặc deploy backend hoàn toàn thủ công.

---

## Thiết lập lần đầu (one-time)

1. **Tạo MySQL** (hPanel → Databases) — ghi DB name/user/pass (prefix `u444601569_`).
2. **Import** `server/schema.sql` qua phpMyAdmin → 7 bảng + 12 categories.
3. Tạo **`public_html/config/db.php`** điền credentials (KHÔNG commit).
4. Tạo **`public_html/uploads/`** (quyền ghi 755/775) cho ảnh admin.
5. **Subdomain** `admin.les-4saisonsgeneve.ch` → trỏ `public_html/admin/`.
6. **Seed:** đổi `SEED_TOKEN` random → chạy `…/seed.php?token=…` → **XOÁ `seed.php`** ngay.
7. **Đổi mật khẩu admin** mặc định (`admin`/`change_me_123`) qua phpMyAdmin.

> Chi tiết từng bước + checklist: xem `DEPLOY.md` (root).

---

## Bảo mật — bắt buộc
- `server/config/db.php` **phải gitignore** (đừng đẩy mật khẩu lên repo). Khi deploy, CI **sinh `db.php` từ secret `DB_PASS`** (`deploy.yml`) — không commit mật khẩu.
- `seed.php` **không** để sót trên server sau khi seed.
- Đổi mật khẩu admin mặc định ngay.
- API admin (`server/admin/api/`) phải kiểm tra `auth.php` (session/token) trước mọi thao tác ghi.

---

## 🔌 API endpoints
| Endpoint | Mô tả |
|---|---|
| `GET /api/menu.php` | `{ categories:[{key,title_fr,title_en,dishes:[{name_fr,name_en,price,description_fr,image_path,is_featured}]}] }` |
| `GET /api/menu.php?category=KEY` | `{ dishes:[...] }` |
| `GET /api/gallery.php` | `{ images:[{image_path,alt_text,display_order}] }` |
| `POST /api/reservations.php` | Tạo booking → `{success,id}` |
| `POST /api/analytics.php` | Ghi lượt xem (204) |

Frontend dùng theo mô hình **hybrid** (tĩnh + nâng cấp DB) — xem [menu-data.md](./menu-data.md).

---

## ✅ Kiểm tra DB đã kết nối chưa
Không test được từ máy dev (DB ở remote). Cách verify trên Hostinger:
1. **Nhanh nhất:** mở `https://les-4saisonsgeneve.ch/api/menu.php`:
   - Ra JSON `{"categories":[…]}` có dữ liệu → ✅ DB OK + đã seed.
   - Lỗi 500 / `SQLSTATE…` → ❌ sai credential / DB name / chưa có bảng → kiểm `config/db.php` + schema.
   - 404 → backend **chưa deploy** (chưa có file `/api/menu.php`).
2. **phpMyAdmin** (hPanel): mở DB `u444601569_restaurant` → đủ 5+ bảng (categories, dishes, gallery, reservations, analytics) + có dữ liệu seed?
3. Tạm tạo `server/dbtest.php` gọi `getDB()` báo OK/lỗi → mở URL → **xoá ngay**.

---

## 🛡️ Chống spam / quá tải

### ✅ `reservations.php` — ĐÃ thêm (2026-06-20)
- **Honeypot** field ẩn `website` → bot điền thì **giả thành công, không lưu**.
- **Time-trap**: submit < 2s sau khi mở form → bỏ (qua `form_time` frontend gửi).
- **Rate-limit per IP**: ≤ **5 lần/giờ** (file-based + `flock` ở `sys_get_temp_dir()`) → trả **`429`**.
- **Giới hạn độ dài** mọi field (nom/prenom 80, email 120, objet 150, message 2000) + payload thô **≤ 8KB**.
- **CORS siết** về `les-4saisonsgeneve.ch` (bỏ `*`).
- Frontend `about.astro`: thêm honeypot + `form_time`, hiển thị thông báo riêng khi `429`.

### ⚠️ CÒN THIẾU
| Endpoint | Cần thêm |
|---|---|
| `analytics.php` (POST) | **throttle** theo `ip_hash+page` (vd 1 lần/30 phút) hoặc sampling — hiện ghi DB **mỗi view** |
| `menu.php` · `gallery.php` (GET) | CORS đang `*` (rủi ro thấp: read-only + cache 60s); cân nhắc server-cache nếu traffic lớn |
| Chung | *(tuỳ chọn)* Cloudflare Turnstile/reCAPTCHA cho form; firewall/rate-limit ở Hostinger/Cloudflare |
