# 📁 Cấu trúc thư mục

> Dự án **hybrid**: **frontend Astro (static)** trong `src/` + **backend PHP (API + admin + MySQL)** trong `server/`.

---

## Sơ đồ tổng thể

```
restaurant-page/
├── astro.config.mjs          # static, base:'/', build.format:'file'
├── package.json  tsconfig.json
├── .npmrc                    # strict-ssl=false (proxy nội bộ) — gitignored
│
├── src/                      # ===== FRONTEND (Astro → build ra dist/) =====
│   ├── pages/                # mỗi file = 1 route (.html)
│   │   ├── index.astro            → /
│   │   ├── about.astro            → /about.html
│   │   ├── gallery.astro          → /gallery.html   (fetch /api/gallery.php)
│   │   ├── 404.astro              → /404.html
│   │   └── menu/
│   │       ├── index.astro        → /menu.html          (à-la-carte)
│   │       ├── category.astro     → /menu/category.html (client ?category=)
│   │       └── dish-detail.astro  → /menu/dish-detail.html (client query-param)
│   │
│   ├── layouts/Layout.astro  # <head> chung, theme-init inline, JSON-LD, mount Header/Footer/Preloader
│   │
│   ├── components/
│   │   ├── layout/           # Header, Footer
│   │   ├── sections/         # Hero, HoursStrip, Takeaway, AboutTeaser  (khối trang chủ)
│   │   └── ui/               # SliderMenu, Gallery, Preloader  (UI tái dùng)
│   │
│   ├── data/                 # menu.js (menuData/menuOrder/sliderCategories), site.js
│   │
│   ├── scripts/              # client JS (bundle bởi Astro)
│   │   ├── core/main.js      # entry: scroll/header/nav/theme/preloader/anchor + init features
│   │   ├── features/         # animations.js (Lenis+GSAP), cursor.js, i18n.js
│   │   └── utils/url.js      # helper link dev/prod .html (xem routing.md)
│   │
│   └── styles/
│       ├── global/base.css   # *** CORE *** tokens warm, header, footer, preloader, cursor, slider, reveal
│       └── pages/            # home, menu, about, gallery, category, dish-detail
│
├── server/                   # ===== BACKEND (PHP, deploy riêng — xem backend.md) =====
│   ├── api/                  # API công khai: gallery, menu, banners, reservations, analytics
│   ├── admin/                # Trang quản trị (dashboard, pages/, api/, includes/)
│   ├── config/db.php         # ⚠️ SECRETS (DB credentials) — KHÔNG commit, đặt thủ công trên server
│   ├── schema.sql            # Schema MySQL (import 1 lần qua phpMyAdmin)
│   └── seed.php              # Seed dữ liệu — chạy 1 lần rồi XOÁ
│
├── public/                   # asset tĩnh → copy nguyên vào dist/ (giữ path /images, /icon)
│   ├── images/  icon/  .htaccess
│
├── docs/                     # tài liệu (bạn đang đọc)
├── .github/workflows/        # CI: build + deploy lên branch `deploy`
└── dist/                     # OUTPUT build (gitignored)
```

---

## Quy ước phân tầng (để dễ bảo trì)

| Thư mục | Chứa gì | Khi nào thêm vào đây |
|---|---|---|
| `components/layout/` | Khung trang dùng mọi nơi | Header, Footer, (nav…) |
| `components/sections/` | Khối lớn của 1 trang | Hero, các section trang chủ |
| `components/ui/` | Mảnh UI tái dùng | Slider, card, modal, preloader… |
| `scripts/core/` | Entry + điều phối | `main.js` |
| `scripts/features/` | 1 tính năng độc lập | animations, cursor, i18n, (lightbox…) |
| `scripts/utils/` | Hàm thuần tái dùng | `url.js`, format, helper… |
| `styles/global/` | Token + style toàn site | `base.css` |
| `styles/pages/` | Style riêng 1 trang | `home.css`, `menu.css`… |

> **Routing:** route theo cây `pages/` → `/menu/category.html`… Link nội bộ phải bọc `url()` ([routing.md](./routing.md)).
> **Frontend ↔ Backend:** trang gọi API qua `fetch('/api/*.php')` (gallery, menu…). Deploy backend xem [backend.md](./backend.md).

---

## ✅ Đã dọn (không còn ở root)
Site vanilla cũ (`index.html`, `about/gallery/menu.html`, `sub-page/`, `_includes/`, `js/`, `style/`, `data/menu-data.js`) và bản trùng `images/`, `icon/` ở root **đã xoá** (được `src/` + `public/` thay thế). Vẫn còn trong git history nếu cần.
