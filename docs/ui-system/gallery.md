# 🖼️ Trang Gallery — Lightbox

**File:** `src/pages/gallery.astro` + `src/styles/gallery.css`

---

## Tổng quan
- Lưới masonry (CSS grid, `grid-auto-flow: dense`, vài ô span 2 hàng/cột qua `:nth-child(5n/7n)`).
- **Lightbox vanilla** (không thêm lib): bấm ảnh → xem full màn hình.

---

## Lightbox — tính năng

| Tương tác | Hành vi |
|---|---|
| Bấm ảnh / Enter / Space | Mở lightbox tại ảnh đó |
| Nút ‹ › | Ảnh trước / sau (vòng tròn) |
| Phím ← / → | Trước / sau |
| Phím Esc / bấm nền | Đóng |
| Vuốt trái/phải (mobile) | Trước / sau |
| Bộ đếm | `3 / 15` |

- Nền mờ (backdrop blur), ảnh scale-in mượt, **preload** ảnh kế bên.
- Khi mở: khoá scroll nền (`html.lb-open { overflow: hidden }`) + **tạm dừng Lenis** (`window.__lenis.stop()`), mở lại khi đóng.
- **Affordance:** hover ảnh hiện **icon phóng to gold** (`.grid-zoom`) ở giữa.
- **A11y:** `.grid-item` có `role="button" tabindex="0"`, focus ring gold, nút có `aria-label`. Tôn trọng `prefers-reduced-motion`.

---

## ⚠️ Gotcha: con trỏ tuỳ biến vs lightbox
Lightbox ở `z-index: 10002`. Con trỏ tuỳ biến (`.cursor-dot/.cursor-ring` trong `base.css`) phải có `z-index` **cao hơn** (hiện **10050**) — nếu không, khi mở lightbox `body.has-cursor { cursor: none }` ẩn trỏ thật mà trỏ tuỳ biến lại nằm **dưới** lightbox → **không thấy con trỏ** để bấm.
