# 📚 Tài liệu dự án — Les 4 Saisons

> Website nhà hàng **Les 4 Saisons** — Genève | Domain: `les-4saisonsgeneve.ch`
> Stack: **Astro 6 (static)** · Deploy: **Hostinger shared hosting**

> 📝 **[CHANGELOG.md](./CHANGELOG.md)** — nhật ký các mục đã sửa đổi.

---

## Cấu trúc tài liệu

```
docs/
├── getting-started/     # Bắt đầu nhanh với dự án
├── architecture/        # Kiến trúc hệ thống & luồng dữ liệu
├── ui-system/           # Giao diện, theme, hiệu ứng
├── deployment/          # Hướng dẫn triển khai
└── contributing/        # Quy tắc & lưu ý khi phát triển tiếp
```

---

## 🚀 Getting Started

| File | Nội dung |
|---|---|
| [overview.md](./getting-started/overview.md) | Giới thiệu, tech stack, lệnh thường dùng |

---

## 🏗️ Architecture

| File | Nội dung |
|---|---|
| [structure.md](./architecture/structure.md) | Sơ đồ thư mục chi tiết, danh sách thư mục cũ cần dọn |
| [menu-data.md](./architecture/menu-data.md) | Nguồn dữ liệu menu, sơ đồ luồng, chi tiết từng trang |
| [routing.md](./architecture/routing.md) | Helper `url()` — gotcha dev/prod `.html`, tránh 404 |
| [backend.md](./architecture/backend.md) | Backend PHP (`server/`), API, deploy hybrid, bảo mật secrets |

---

## 🎨 UI System

| File | Nội dung |
|---|---|
| [theme.md](./ui-system/theme.md) | Hệ thống Dark/Light, chống FOUC, bảng CSS tokens |
| [animations.md](./ui-system/animations.md) | Preloader, hero cinematic, scroll reveal, custom cursor |
| [i18n.md](./ui-system/i18n.md) | Đa ngôn ngữ FR/EN (`data-i18n`), key menu cần thêm |
| [menu-page.md](./ui-system/menu-page.md) | Trang menu: tab dính, card món, fallback, signature |
| [gallery.md](./ui-system/gallery.md) | Gallery lightbox (phím/vuốt/đếm số) |

---

## 🚢 Deployment

| File | Nội dung |
|---|---|
| [hostinger.md](./deployment/hostinger.md) | Build, upload manual, GitHub Actions CI/CD, checklist |

---

## 🤝 Contributing

| File | Nội dung |
|---|---|
| [dev-notes.md](./contributing/dev-notes.md) | Quy tắc phát triển, template trang mới, gotchas |
