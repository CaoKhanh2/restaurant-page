# ✨ Hiệu ứng & Animations

---

## Preloader

**File:** `Preloader.astro` + `base.css` + `main.js → hidePreloader()`

- Logo **fade + scale** khi trang load
- Tự ẩn sau khi `window.load` (tối thiểu ~700ms để tránh nhấp nháy)
- **Tắt tự động** khi người dùng bật `prefers-reduced-motion`

---

## Hero Cinematic

**File:** `Hero.astro` + `home.css` + `animations.js`

- Lớp `.hero-bg` chạy hiệu ứng **Ken Burns** (zoom chậm + pan)
- Chữ reveal từng lớp bằng **SplitType + GSAP timeline**

---

## Scroll Reveal

Cơ chế dùng `data-*` attribute — không cần viết thêm JS:

| Attribute | Tác dụng |
|---|---|
| `data-reveal` | Animate **1 phần tử** khi scroll đến |
| `data-reveal-stagger` | Animate **các phần tử con** lần lượt (stagger) |

**Cách hoạt động:**
1. Khi `html.has-js` → CSS ẩn mọi `[data-reveal]` ban đầu (`opacity: 0`)
2. GSAP ScrollTrigger theo dõi scroll → trigger animation khi vào viewport

---

## Custom Cursor

**File:** `cursor.js`

- Gồm **2 lớp**: dot nhỏ (tâm) + ring lớn (lag theo)
- Phóng to khi hover lên link / card
- **Chỉ hiển thị** trên `pointer: fine` (chuột thật)
- **Tắt tự động** khi touch device hoặc `prefers-reduced-motion`
- ⚠️ **`z-index: 10050`** (trong `base.css`) — phải cao hơn lightbox (10002), nếu không sẽ bị che khi xem ảnh. Xem [gallery.md](./gallery.md).

> Gallery có **lightbox** riêng (phím/vuốt/đếm số) — xem [gallery.md](./gallery.md).

---

## Reduced Motion

Toàn bộ animation được tắt khi người dùng bật **Reduce Motion** trong hệ điều hành:

```css
@media (prefers-reduced-motion: reduce) {
  /* Tắt mọi animation + ép nội dung hiện ngay */
}
```

Xử lý trong `base.css` — áp dụng toàn site.

---

## Thư viện sử dụng

| Thư viện | Mục đích |
|---|---|
| **GSAP** + ScrollTrigger | Animation chính, scroll reveal |
| **Lenis** | Smooth scroll |
| **SplitType** | Tách chữ để animate từng ký tự / dòng |
