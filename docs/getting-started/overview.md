# 📋 Tổng quan dự án — Les 4 Saisons

> Website nhà hàng **Les 4 Saisons** (Genève, ẩm thực Trung Hoa / Hong Kong)
> Domain: `les-4saisonsgeneve.ch`

---

## Giới thiệu

Dự án đã **migrate sang Astro** (static site) + refactor UI theo phong cách **ấm áp & mộc mạc Hong Kong**.
Tài liệu này dành cho developer kế tiếp.

---

## Tech Stack

| Thành phần | Chi tiết |
|---|---|
| **Framework** | Astro 6 — `output: 'static'` |
| **Build format** | `build.format: 'file'` → giữ URL `.html` (`/menu.html`, `/about.html`…) để không vỡ SEO |
| **Animation** | GSAP + ScrollTrigger, Lenis (smooth scroll), SplitType (tách chữ hero) |
| **Font** | Playfair Display + Roboto (Google Fonts) |
| **Icon** | Font Awesome (CDN) |
| **Theme** | Dark / Light (warm) — CSS variables + `localStorage` |

> ⚠️ **KHÔNG** đổi sang `output: 'server'` / adapter SSR — Hostinger shared hosting không chạy Node.

---

## Lệnh thường dùng

```bash
npm install      # cài dependencies (đã có .npmrc xử lý lỗi TLS proxy nội bộ — không commit)
npm run dev      # dev server → http://localhost:4321
npm run build    # build ra dist/
npm run preview  # xem thử bản static đã build
```

> ⚠️ Trang chạy qua **`npm run dev`**, KHÔNG phải Live Server trên các file `.html` cũ ở root.
