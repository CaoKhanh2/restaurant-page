# 🎨 Hệ thống Theme (Dark / Light)

---

## Cơ chế hoạt động

### 1. Chống FOUC — `Layout.astro`
Có một `<script is:inline>` chạy **trước khi paint**:
- Đọc `localStorage.theme`
- Set `data-theme` trên thẻ `<html>`
- Thêm class `has-js` (bật ẩn-ban-đầu cho reveal animation)

### 2. CSS Tokens — `src/styles/base.css`
Tokens được khai báo trong:
- `:root` → **dark warm** (mặc định)
- `[data-theme="light"]` → **cream (sáng ấm)**

### 3. Toggle — `src/scripts/main.js → initThemeToggle()`
- Nút moon/sun
- Toggle + lưu vào `localStorage`
- Transition mượt qua class `.theme-transitioning`

---

## Bảng CSS Tokens chính (`base.css`)

### Màu nền & bề mặt
| Token | Mô tả |
|---|---|
| `--bg-page` | Màu nền trang |
| `--bg-surface` | Màu bề mặt card/panel |
| `--bg-surface-alt` | Bề mặt thay thế |
| `--bg-hover` | Nền khi hover |
| `--bg-input` | Nền input |

### Màu chữ
| Token | Mô tả |
|---|---|
| `--text-main` | Chữ chính |
| `--text-sub` | Chữ phụ |
| `--text-muted` | Chữ mờ |
| `--text-faint` | Chữ rất mờ |

### Accent & Brand
| Token | Mô tả |
|---|---|
| `--gold` | Màu vàng chính |
| `--gold-bright` | Vàng sáng (hover) |
| `--red` | Đỏ accent |
| `--wine-1` / `--wine-2` / `--wine-3` | Gradient đỏ rượu (slider) |

### Khác
| Token | Mô tả |
|---|---|
| `--border-soft` / `--border-medium` | Đường viền |
| `--header-*` | Màu riêng cho header |
| `--radius*` | Bo góc |
| `--shadow-soft` / `--shadow-lift` | Đổ bóng |
| `--ease` | Cubic-bezier mặc định |

---

## Các khu vực KHÔNG đổi theo theme (cố ý)

| Thành phần | Lý do giữ cố định |
|---|---|
| **Footer** | Warm brown — nhận diện thương hiệu |
| **`#menu-slider-section`** | Đỏ wine — phong cách Hong Kong |
| **Hero / Takeaway overlay** | Tối vì overlay trên ảnh |
| **`.category` trong slider** | Chữ trắng trên nền đậm |
