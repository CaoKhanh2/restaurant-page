# 🍽️ Luồng dữ liệu Menu

---

## Nguồn dữ liệu duy nhất

**File:** `src/data/menu.js`

Chứa 3 export chính:

| Export | Mô tả |
|---|---|
| `menuData` | Toàn bộ dữ liệu món ăn |
| `menuOrder` | Thứ tự hiển thị các category |
| `sliderCategories` | Danh sách category dùng cho slider trang chủ |

> ✅ Khi cần sửa thực đơn → **chỉ sửa file này**, không chỉnh ở nơi nào khác.

---

## Sơ đồ luồng dữ liệu

```
src/data/menu.js
    │
    ├──► menu.astro          (Build-time render)
    │        └──► /menu.html  — render sẵn HTML lúc build, link từng món → dish-detail
    │
    ├──► category.astro      (Client-side render)
    │        └──► /sub-page/category.html?category=...  — đọc query-param, render dish cards
    │
    └──► SliderMenu.astro    (Build-time — slider trang chủ)
             └──► "La carte des mets" slider
```

---

## Chi tiết từng trang

### `menu.astro` → `/menu.html`
- Render à-la-carte **lúc build** (server-render / static)
- Mỗi món là thẻ `<a>` có sẵn query-param → dish-detail (link build qua `url()`, xem [routing.md](./routing.md))
- **Không cần JS để điều hướng** (chỉ JS cho tab dính + scroll-spy)
- Layout: tab danh mục dính + card mỗi món + fallback tile — xem [ui-system/menu-page.md](../ui-system/menu-page.md)

### `category.astro` → `/sub-page/category.html`
- Client script `import { menuData }` (bundle vào JS)
- Đọc `?category=` từ URL
- Render dish cards phía client
- Giữ URL format: `category.html?category=...`

### `dish-detail.astro` → `/sub-page/dish-detail.html`
- Client script đọc query-params: `?name=&image=&description=&price=`
- Đổ nội dung vào DOM
- Ảnh placeholder: `image-bientot-disponible.svg`

---

## Lưu ý đường dẫn ảnh

> Đường dẫn ảnh trong `menu.js` là **tuyệt đối** (`/images/...`)
> → dùng trực tiếp trong `src`, **KHÔNG prefix `../`** như bản vanilla cũ.
