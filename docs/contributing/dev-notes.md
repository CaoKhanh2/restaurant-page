# 🛠️ Lưu ý khi phát triển tiếp

---

## Quy tắc chung

| Tác vụ | Cách làm đúng |
|---|---|
| **Thêm trang mới** | Tạo `src/pages/<tên>.astro`, bọc trong `<Layout>`, import CSS riêng nếu cần. Route = tên file + `.html` |
| **Thêm internal link** | **Bọc qua `url()`** (`src/scripts/utils/url.js`) — vd `href={url('/menu')}`. Hardcode `.html` sẽ **404 ở dev**. Xem [routing.md](../architecture/routing.md) |
| **Thêm chuỗi dịch** | Gắn `data-i18n="key"` + thêm key vào `src/scripts/i18n.js` (FR & EN). Xem [i18n.md](../ui-system/i18n.md) |
| **Thêm màu mới** | Dùng token trong `base.css`, **không hardcode hex** |
| **Animate khi scroll** | Thêm `data-reveal` / `data-reveal-stagger` vào element — không cần viết JS |
| **Sửa thực đơn** | Chỉ sửa `src/data/menu.js` |
| **Deploy** | `npm run build` → upload **ruột `dist/`** vào `public_html/` (xem [hostinger.md](../deployment/hostinger.md)) |

---

## Dọn dẹp thư mục cũ

Các file/thư mục vanilla cũ còn sót ở root **đã được thay thế hoàn toàn** bởi `src/`:

```
*.html (root)
_includes/
js/
style/
data/menu-data.js
```

> ✅ Có thể **xoá an toàn** sau khi đã xác nhận bản Astro chạy ổn trên production.

---

## Template khi thêm trang mới

```astro
---
// src/pages/ten-trang.astro
import Layout from '../layouts/Layout.astro';
import '../styles/ten-trang.css';
---

<Layout title="Tiêu đề trang" description="Mô tả SEO">
  <main>
    <!-- Nội dung trang -->
  </main>
</Layout>
```

---

## Gotchas & Lưu ý quan trọng

1. **Đường dẫn ảnh** trong `menu.js` là tuyệt đối (`/images/...`) → dùng trực tiếp, không prefix `../`
2. **`.npmrc`** chứa `strict-ssl=false` cho proxy nội bộ — **không commit** lên git
3. **`dist/`** là output build — **gitignored**, không commit
4. Không chạy trang bằng Live Server trực tiếp trên các `.html` ở root — phải dùng `npm run dev`
5. Không bật SSR / adapter — Hostinger shared hosting chỉ serve file tĩnh
6. **Internal link** phải qua `url()` — hardcode `.html` → 404 ở dev ([routing.md](../architecture/routing.md))
7. **`position: sticky`** cần `body { overflow-x: clip }` (KHÔNG `hidden`) — đã set ở `base.css`
8. **Con trỏ tuỳ biến** `z-index: 10050` phải > lightbox (10002) — đừng hạ xuống
9. Tab/scroll-spy của menu dùng **`data-target`** (không `href="#"`) để không đụng anchor handler global
