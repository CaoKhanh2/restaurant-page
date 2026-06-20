# 🔗 Routing & Helper `url()`

---

## Vấn đề (gotcha quan trọng)

`astro.config.mjs` dùng `build.format: 'file'` → khi **build** sinh ra `/menu.html`, `/gallery.html`…
Nhưng **dev server** của Astro (`npm run dev`) chỉ phục vụ **path sạch** (`/menu`, `/gallery`), **không** nhận `.html`.

→ Nếu hardcode link `href="/menu.html"`, link sẽ **404 ở dev** (vẫn chạy ở prod).

---

## Giải pháp — `src/utils/url.js`

```js
export function url(path, query = '') {
  const suffix = import.meta.env.PROD ? '.html' : '';
  return `${path}${suffix}${query}`;
}
```

| Môi trường | `url('/menu')` | Ghi chú |
|---|---|---|
| **Dev** (`npm run dev`) | `/menu` | Astro dev không nhận `.html` |
| **Prod** (`npm run build`) | `/menu.html` | `build.format:'file'` |

Có query thì truyền tham số 2:
```js
url('/sub-page/dish-detail', '?name=...&price=...')
// dev  → /sub-page/dish-detail?name=...
// prod → /sub-page/dish-detail.html?name=...
```

---

## Quy tắc dùng

✅ **MỌI internal link có đuôi `.html`** phải đi qua `url()`:

```astro
---
import { url } from '../utils/url.js';   // chỉnh độ sâu ../ cho đúng vị trí file
---
<a href={url('/menu')}>La carte</a>
<a href={url('/about')}>À propos</a>
```

Trong **client `<script>`** cũng import được (Vite thay `import.meta.env.PROD` lúc build):
```js
import { url } from '../../utils/url.js';
const href = url('/sub-page/dish-detail', '?' + new URLSearchParams(d).toString());
```

❌ **KHÔNG** dùng `url()` cho: external link, `tel:`, asset (ảnh/font), anchor `#...`, và `href="/"` (trang chủ — giống nhau ở cả dev/prod).

---

## Các nơi đã áp dụng

`Header.astro` · `SliderMenu.astro` · `Hero.astro` · `AboutTeaser.astro` · `menu.astro` (dishHref) ·
`sub-page/dish-detail.astro` (nút Retour) · `sub-page/category.astro` (client `dishHref`).

> Khi thêm link mới → nhớ bọc `url()`, nếu không sẽ 404 ở dev.
