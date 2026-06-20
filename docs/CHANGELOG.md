# 📝 Nhật ký thay đổi

> Ghi lại các mục đã sửa đổi trong dự án. Mục mới nhất ở trên cùng.

---

## 2026-06-20 (cập nhật) — Cấu trúc lại + Backend + Dữ liệu hybrid

### 🗂️ Tái cấu trúc `src/` + thêm backend `server/`
- Phân tầng: `components/{layout,sections,ui}`, `scripts/{core,features,utils}`, `styles/{global,pages}`, `pages/menu/`.
- **Dọn sạch** vanilla cũ ở root (`*.html`, `_includes/`, `js/`, `style/`, `data/menu-data.js`, `images/`+`icon/` trùng).
- Thêm backend **PHP + MySQL** ở `server/` (API + admin). Xem [architecture/backend.md](./architecture/backend.md).

### 🔀 Đổi route `sub-page/` → `menu/`
- `sub-page/category.html` → **`/menu/category.html`**; `sub-page/dish-detail.html` → **`/menu/dish-detail.html`**.
- Cập nhật mọi link (`sliderCategories` trong `menu.js`, `dishHref`) qua `url()`.

### 🧬 Dữ liệu HYBRID (menu + gallery): tĩnh fallback + nâng cấp từ DB
- `menu/index.astro` & `gallery.astro`: render **tĩnh build-time** từ `menu.js`/ảnh sẵn (SEO + chạy không cần backend), rồi **tự `fetch('/api/menu.php')` · `fetch('/api/gallery.php')`** thay nội dung nếu DB sống. Lỗi/không có API → **giữ bản tĩnh**.
- `menu/category.astro`: hiện render từ `menuData` bundled (tĩnh).
- → Hiển thị lấy **từ CODE** khi chưa có DB, **từ DB** khi API sống. Xem [architecture/menu-data.md](./architecture/menu-data.md).

### 🔐 CI deploy kèm backend
- `deploy.yml`: sinh `config/db.php` từ secret `DB_PASS`, gộp `server/api`→`/api`, `server/admin`→`/admin`, tạo `config/` (chặn bằng `.htaccess`) + `uploads/`. Nâng Node CI lên **22** (Astro 6 yêu cầu ≥22.12).

### 🔒 Bảo mật API
- **`reservations.php` ĐÃ thêm chống spam:** honeypot (`website`) + time-trap (`form_time` < 2s) + **rate-limit per-IP ≤5/giờ → `429`** + giới hạn độ dài field + payload ≤8KB + **siết CORS** (bỏ `*`). Frontend `about.astro` gửi kèm honeypot + `form_time`, báo riêng khi `429`.
- **Còn thiếu:** throttle cho `analytics.php` (ghi DB mỗi view). Xem [architecture/backend.md](./architecture/backend.md).

---

## 2026-06-20 — Migrate Astro + refactor UI + các tính năng

### 🏗️ Migrate sang Astro (static)
- Chuyển từ HTML/CSS/JS thuần (include bằng `fetch()`) → **Astro 6 `output:'static'`**.
- `astro.config.mjs`: `site`, `base:'/'`, `build.format:'file'` (giữ URL `.html`).
- Component hoá: `Layout.astro` + `Header/Footer/Preloader/SliderMenu/Hero/HoursStrip/Takeaway/AboutTeaser/Gallery`.
- Dữ liệu món `data/menu-data.js` → `src/data/menu.js` (ESM). Asset → `public/`.
- Xem [architecture/structure.md](./architecture/structure.md), [architecture/menu-data.md](./architecture/menu-data.md).

### 🎨 Refactor UI "ấm áp & mộc mạc HK"
- Tokens warm (dark charcoal + light cream) trong `base.css`; bỏ AOS, gom animation về GSAP.
- **Hero cinematic** (Ken Burns + SplitType), **preloader logo**, **scroll-reveal** (`data-reveal`), **custom cursor**.
- Dark/Light theme qua CSS variables + `localStorage`. Xem [ui-system/theme.md](./ui-system/theme.md), [ui-system/animations.md](./ui-system/animations.md).

### 🌐 Đa ngôn ngữ FR / EN
- Thêm `src/scripts/i18n.js` (data-i18n, `localStorage('lang')`, applyLang bỏ qua key chưa có).
- Inline lang init trong `Layout.astro` (chống flash). Xem [ui-system/i18n.md](./ui-system/i18n.md).

### 🔗 Fix điều hướng (gotcha dev/prod `.html`)
- Thêm helper `src/utils/url.js` → dev trả path sạch (`/menu`), prod trả `.html`.
- Áp dụng cho **mọi internal link** (Header, SliderMenu, Hero, AboutTeaser, menu, dish-detail, category client).
- **Nguyên nhân:** dev server Astro không phục vụ `.html`; trước đó link cứng `.html` gây **404 ở dev**.
- Xem [architecture/routing.md](./architecture/routing.md).

### 🍽️ Redesign trang Menu (`/menu`)
- **Thanh tab danh mục dính** (nhảy mượt qua Lenis + active theo scroll), **mỗi danh mục 1 section**.
- **Card mỗi món** + **fallback tile** (món thiếu ảnh), **badge Signature**, **tag 🌶️/🌱**, legend.
- `base.css`: `body { overflow-x: clip }` (thay `hidden`) để `position:sticky` của tab hoạt động.
- Xem [ui-system/menu-page.md](./ui-system/menu-page.md).

### 🖼️ Gallery lightbox
- Bấm ảnh → xem full màn hình; điều hướng phím ←/→/Esc, vuốt mobile, đếm số, backdrop blur.
- Icon phóng to khi hover. Xem [ui-system/gallery.md](./ui-system/gallery.md).

### 🖱️ Fix con trỏ tuỳ biến bị che bởi lightbox
- `.cursor-dot/.cursor-ring` nâng `z-index` 10001 → **10050** (trên lightbox 10002) để luôn nhìn thấy khi xem ảnh.

### 🚢 Deploy
- `public/.htaccess` (404 + cache), `DEPLOY.md`. Xem [deployment/hostinger.md](./deployment/hostinger.md).

---

## ⏳ Đang chờ (chưa làm)
- **🔒 Bảo mật API:** thêm **throttle cho `analytics.php`** (reservations.php đã xong); *(tuỳ chọn)* CAPTCHA/Turnstile cho form.
- **Khu "Nos Spécialités"** (zig-zag editorial) — khoe 6 món signature ảnh lớn + parallax/reveal trên trang chủ. *Layout đã chốt, chưa implement.*
- (Tuỳ chọn) Cho `menu/category` đọc từ `/api/menu.php` (như menu/gallery) để admin sửa cũng phản ánh ở trang danh mục.
