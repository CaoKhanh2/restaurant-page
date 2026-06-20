# 🍽️ Trang Menu — Layout & cách hoạt động

**File:** `src/pages/menu.astro` + `src/styles/menu.css`

> Mục tiêu redesign: trước đây 12 nhóm / ~60 món xếp **2 cột rối mắt, không điều hướng** → khó đọc/chọn.
> Nay: **tab dính + mỗi danh mục 1 section + card mỗi món**.

---

## Cấu trúc trang

```
#full-menu-page
├── .menu-header        (subtitle + h1 + legend 🌶️/🌱)
├── .menu-tabs          ← STICKY: Formules + 12 danh mục (nút data-target)
├── #cat-menus          (Formules — 4 set-menu-card)
└── #cat-{key} ×12      (mỗi danh mục: header + .carte-grid card món)
```

---

## Thanh tab dính (`.menu-tabs`)

- `position: sticky; top: 84px` (dưới header). **Yêu cầu** `body { overflow-x: clip }` ở `base.css` — nếu để `hidden`, sticky **không** hoạt động.
- Nút dùng **`<button data-target="cat-xxx">`** (KHÔNG `href="#"`) để tránh đụng anchor handler global trong `main.js`.
- Script trang (inline trong `menu.astro`):
  - Click tab → `window.__lenis.scrollTo(el, { offset: -118 })` (trừ header + tab bar), fallback `window.scrollTo`.
  - **Active state** theo scroll bằng `IntersectionObserver` (`rootMargin: '-130px 0px -65% 0px'`) + tự canh tab vào giữa.
- Nếu header cao/thấp khác → chỉnh `.menu-tabs { top }` và `offset`.

---

## Card món (`.carte-card`)

Lưới `repeat(auto-fill, minmax(220px, 1fr))`. Mỗi card là `<a>` link sang dish-detail (qua `url()` — xem [routing.md](../architecture/routing.md)).

| Thành phần | Mô tả |
|---|---|
| Ảnh thật | Khi `image` không phải placeholder |
| **Fallback tile** | Món thiếu ảnh → gradient ấm + icon `fa-bowl-food` + "Les 4 Saisons" → đồng nhất, không "bể" |
| **Badge "Signature"** | Món có `featured: true` |
| **Tag 🌶️ / 🌱** | 🌶️ tách từ tên (`isSpicy`); 🌱 nếu danh mục `vegetariens` |
| Giá | Gold, đáy card |

Logic phụ trợ (frontmatter `menu.astro`): `splitTitle` (tách "FR / EN"), `isPlaceholder`, `isSpicy`, `cleanName` (bỏ 🌶️ khỏi tên hiển thị), `catIcons` (icon medallion cho potages/entrees/dimsum/poulet/boeuf).

---

## i18n
Nhãn tĩnh đã gắn `data-i18n="menu.*"` — cần thêm key vào `i18n.js`, xem [i18n.md](./i18n.md). Tên món lấy từ `menu.js`.

## Set menus (Formules)
4 card cố định (`setMenus` trong frontmatter), section `#cat-menus`, có 1 tab riêng "Formules".
