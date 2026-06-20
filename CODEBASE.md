# Restaurant Les 4 Saisons — Tài liệu Codebase

> Dự án đã **migrate sang Astro** (static) + refactor UI hướng **ấm áp & mộc mạc Hong Kong**.
> Tài liệu cho developer kế tiếp. Xem thêm `DEPLOY.md` để deploy lên Hostinger.

---

## Tổng quan

Website nhà hàng **Les 4 Saisons** (Genève, ẩm thực Trung Hoa/Hong Kong), domain `les-4saisonsgeneve.ch`.

- **Framework:** Astro 6 — `output: 'static'` (xem `astro.config.mjs`). Build ra `dist/` HTML thuần.
- **Build URL format:** `build.format: 'file'` → giữ URL `.html` cũ (`/menu.html`, `/about.html`…) để không vỡ SEO.
- **Animation/UX:** GSAP + ScrollTrigger, Lenis (smooth scroll), SplitType (tách chữ hero) — cài qua npm, bundle bởi Astro.
- **Font:** Playfair Display + Roboto (Google Fonts). **Icon:** Font Awesome (CDN).
- **Theme:** dark/light (warm) qua CSS variables + `localStorage`.

> ⚠️ KHÔNG đổi sang `output: 'server'`/adapter SSR — Hostinger shared hosting không chạy Node.

---

## Lệnh

```bash
npm install      # cài deps (đã có .npmrc xử lý lỗi TLS proxy nội bộ — không commit)
npm run dev      # dev server http://localhost:4321
npm run build    # build ra dist/
npm run preview  # xem thử bản static đã build
```

> ⚠️ Trang chạy qua **`npm run dev`**, KHÔNG phải Live Server trên các file `.html` cũ ở root.

---

## Cấu trúc thư mục

```
restaurant-page/
├── astro.config.mjs        # static, site, base:'/', build.format:'file'
├── package.json
├── .npmrc                  # strict-ssl=false (proxy nội bộ) — gitignored
├── src/
│   ├── pages/              # mỗi file = 1 route
│   │   ├── index.astro         → /            (trang chủ)
│   │   ├── menu.astro          → /menu.html   (à-la-carte render BUILD-TIME từ data)
│   │   ├── about.astro         → /about.html
│   │   ├── gallery.astro       → /gallery.html
│   │   ├── 404.astro           → /404.html
│   │   └── sub-page/
│   │       ├── category.astro     → /sub-page/category.html  (render CLIENT theo ?category=)
│   │       └── dish-detail.astro  → /sub-page/dish-detail.html (đọc CLIENT query-param)
│   ├── layouts/
│   │   └── Layout.astro    # <head> chung, theme-init inline, JSON-LD, mount Header/Footer/Preloader, nạp main.js
│   ├── components/
│   │   ├── Header.astro    # nav + active (Astro.url.pathname) + theme toggle + mobile toggle
│   │   ├── Footer.astro
│   │   ├── Preloader.astro # màn intro logo
│   │   ├── SliderMenu.astro# "La carte des mets" (data: sliderCategories)
│   │   ├── Hero.astro      # hero cinematic
│   │   ├── HoursStrip.astro# giờ mở cửa (dưới hero)
│   │   ├── Takeaway.astro
│   │   ├── AboutTeaser.astro
│   │   └── Gallery.astro   # strip ảnh trang chủ
│   ├── data/
│   │   ├── menu.js         # menuData + menuOrder + sliderCategories (NGUỒN DỮ LIỆU MÓN)
│   │   └── site.js         # openingHours, phone
│   ├── styles/             # CSS thuần (global, import trong Layout/pages)
│   │   ├── base.css        # *** CORE *** tokens warm, header, footer, preloader, cursor, slider, dish grid, reveal
│   │   ├── home.css  menu.css  about.css  gallery.css  category.css  dish-detail.css
│   └── scripts/            # client JS (bundle bởi Astro)
│       ├── main.js         # entry: scroll/header/nav/theme/preloader/anchor + gọi animations & cursor
│       ├── animations.js   # Lenis + GSAP reveal [data-reveal], hero timeline (SplitType), Ken Burns, parallax
│       └── cursor.js       # custom cursor 2 lớp (pointer:fine)
├── public/                 # asset tĩnh, copy nguyên vào dist/ (giữ path /images, /icon)
│   ├── images/  icon/  .htaccess
└── dist/                   # OUTPUT build (gitignored) — đây là thứ upload lên Hostinger

# Thư mục CŨ (vanilla) còn lại nhưng KHÔNG còn dùng — có thể xoá sau khi xác nhận:
#   *.html (root), _includes/, js/, style/, data/menu-data.js
```

---

## Hệ thống Theme (dark/light, warm)

1. **`Layout.astro` — inline `<script is:inline>`** chạy trước paint: đọc `localStorage.theme`, set `data-theme` trên `<html>` + thêm class `has-js` (chống FOUC, và bật ẩn-ban-đầu cho reveal).
2. **`src/styles/base.css`**: token trong `:root` (dark warm mặc định) và `[data-theme="light"]` (cream).
3. **`src/scripts/main.js` → `initThemeToggle()`**: nút moon/sun, toggle + lưu localStorage, transition mượt qua class `.theme-transitioning`.

### Nhóm token chính (base.css)
`--bg-page/-surface/-surface-alt/-hover/-input`, `--text-main/-sub/-muted/-faint`,
`--border-soft/-medium`, `--header-*`, `--gold`, `--gold-bright`, `--red`, `--wine-1/2/3`,
`--radius*`, `--shadow-soft/-lift`, `--ease`.

### KHÔNG đổi theo theme (cố ý)
Footer (warm brown), `#menu-slider-section` (đỏ wine), hero/takeaway overlay (tối vì trên ảnh), `.category` trong slider (chữ trắng).

---

## Hiệu ứng "wow"

- **Preloader** (`Preloader.astro` + base.css + `main.js → hidePreloader`): logo fade/scale, ẩn khi `window.load` (min ~700ms). Tắt khi reduced-motion.
- **Hero cinematic** (`Hero.astro` + home.css + `animations.js`): lớp `.hero-bg` Ken Burns; chữ reveal theo lớp bằng **SplitType + GSAP timeline**.
- **Scroll-reveal**: gắn `data-reveal` (1 phần tử) hoặc `data-reveal-stagger` (animate các con) → GSAP ScrollTrigger lo. Ẩn ban đầu qua `html.has-js [data-reveal]{opacity:0}`.
- **Custom cursor** (`cursor.js`): dot + ring, phóng to khi hover link/card. Chỉ `pointer:fine`, tắt khi touch/reduced-motion.
- **Reduced-motion**: `@media (prefers-reduced-motion)` trong base.css tắt mọi animation + ép nội dung hiện.

---

## Luồng dữ liệu Menu

`src/data/menu.js` là **nguồn duy nhất** (`menuData`, `menuOrder`, `sliderCategories`).

- **`menu.astro`**: render à-la-carte **lúc build** (server-render) từ `menuData`/`menuOrder`. Mỗi món là `<a>` link sẵn query-param sang `dish-detail.html` (không cần JS để điều hướng).
- **`category.astro`**: client script `import { menuData }` (bundle vào JS), đọc `?category=`, render dish card. Giữ URL `category.html?category=...`.
- **`dish-detail.astro`**: client script đọc `?name=&image=&description=&price=` → đổ nội dung. Ảnh placeholder → `image-bientot-disponible.svg`.

> Đường dẫn ảnh trong data là **tuyệt đối** (`/images/...`) → dùng trực tiếp, KHÔNG prefix `../` như bản cũ.

---

## Lưu ý khi phát triển tiếp

1. Thêm trang mới → tạo `src/pages/<tên>.astro`, bọc trong `<Layout>`, import CSS riêng nếu cần. URL = tên file + `.html`.
2. Màu mới → dùng token trong `base.css`, không hardcode hex.
3. Cần animate khi scroll → thêm `data-reveal` / `data-reveal-stagger`, không cần viết JS.
4. Sửa thực đơn → chỉ sửa `src/data/menu.js`.
5. Deploy → `npm run build` rồi upload **ruột `dist/`** vào `public_html/` (xem `DEPLOY.md`).
6. Dọn dẹp: các file vanilla cũ ở root (`*.html`, `_includes/`, `js/`, `style/`, `data/menu-data.js`) đã được thay thế hoàn toàn bởi `src/` — có thể xoá khi đã chốt.
