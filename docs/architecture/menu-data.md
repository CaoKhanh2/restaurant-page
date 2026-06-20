# 🍽️ Luồng dữ liệu Menu & Gallery (HYBRID: tĩnh + DB)

> Mô hình **progressive enhancement**: render **tĩnh từ code** lúc build (SEO + chạy không cần backend),
> rồi **tự nâng cấp từ DB** qua API PHP nếu backend sống. API lỗi/không có → giữ bản tĩnh.

---

## 2 nguồn dữ liệu

| Nguồn | Là gì | Vai trò |
|---|---|---|
| **Code (build-time)** | `src/data/menu.js` (`menuData`, `menuOrder`, `sliderCategories`) + ảnh `/images` | **Fallback + SEO** — luôn hiển thị, kể cả khi chưa có backend |
| **DB (runtime)** | MySQL qua API PHP `/api/menu.php`, `/api/gallery.php` | **Nội dung sống** — phản ánh chỉnh sửa từ trang admin |

> DB ban đầu được **seed từ `menu.js`** (xem `server/seed.php`). `menu.js` vẫn giữ làm fallback — **đừng xoá**.

---

## Sơ đồ hybrid

```
src/data/menu.js ──(build-time)──► HTML tĩnh (menu/gallery hiển thị ngay)
                                          │
                            (client) fetch /api/*.php
                                          │
                    ┌─────────────────────┴─────────────────────┐
              API OK + có data                          API lỗi / rỗng
                    │                                            │
        thay nội dung = dữ liệu DB                      GIỮ NGUYÊN bản tĩnh
```

---

## Chi tiết từng trang

### `menu/index.astro` → `/menu.html`
- **Build-time:** render đủ tab + à-la-carte (64 món) từ `menu.js`.
- **Client:** `fetch('/api/menu.php')` → nếu có `categories[].dishes[]`, **thay innerHTML từng `.carte-grid`** theo `#cat-{key}`. Cấu trúc tab/section giữ nguyên (danh mục cố định).
- Lỗi/DB rỗng → giữ bản tĩnh.

### `gallery.astro` → `/gallery.html`
- **Build-time:** 15 ảnh `/images/food/*` + lightbox.
- **Client:** `fetch('/api/gallery.php')` → nếu có `images[]`, thay lưới + gắn lại lightbox.

### `menu/category.astro` → `/menu/category.html`
- Render **client từ `menuData` bundled** (tĩnh, không API). Đọc `?category=`.
- *(Tuỳ chọn tương lai: đổi sang `/api/menu.php?category=` để đồng bộ DB.)*

### `menu/dish-detail.astro` → `/menu/dish-detail.html`
- Đọc query-param `?name=&image=&description=&price=` (truyền từ card). Không gọi API.

### `SliderMenu.astro` (trang chủ + sub)
- Build-time từ `sliderCategories` trong `menu.js`. Link qua `url()`.

---

## API contract (PHP → JSON)

| Endpoint | Method | Trả về |
|---|---|---|
| `/api/menu.php` | GET | `{ categories: [{ key, title_fr, title_en, dishes: [{ name_fr, name_en, price, description_fr, image_path, is_featured }] }] }` |
| `/api/menu.php?category=KEY` | GET | `{ dishes: [...] }` |
| `/api/gallery.php` | GET | `{ images: [{ image_path, alt_text, display_order }] }` |

> ⚠️ **Field DB khác field code:** DB dùng `name_fr/name_en/image_path/is_featured`, còn `menu.js` dùng `name/translation/image/featured`. Script client map đúng field DB khi nâng cấp. Chi tiết backend: [backend.md](./backend.md).

---

## Lưu ý đường dẫn ảnh
- Ảnh trong `menu.js` (fallback) là path tuyệt đối `/images/...` (deploy qua `public/`).
- Ảnh từ DB (`image_path`) có thể là `/images/...` (seed) hoặc `/uploads/...` (admin upload) — cần thư mục `uploads/` tồn tại trên server.
