# Hướng dẫn Deploy — Hostinger (site tĩnh Astro)

Trang web giờ build bằng **Astro** ở chế độ **static** → sinh ra thư mục `dist/` chỉ gồm HTML/CSS/JS thuần.
Hostinger (shared hosting) **chỉ phục vụ file tĩnh, không chạy Node** → **không có conflict**. Quy trình: build ở máy → upload `dist/`.

> ⚠️ Tuyệt đối **không** đổi `astro.config.mjs` sang `output: 'server'` hay thêm adapter SSR — cái đó mới cần Node runtime và sẽ không chạy trên shared hosting.

---

## 1. Build ở máy

```bash
npm install        # lần đầu (đã có .npmrc xử lý lỗi TLS proxy nội bộ)
npm run build      # sinh ra dist/
```

Kiểm tra thử bản tĩnh trước khi upload:

```bash
npm run preview    # mở http://localhost:4321
```

## 2. Upload lên Hostinger

Mở **hPanel → File Manager** (hoặc dùng FTP/SFTP):

1. Vào thư mục `public_html/` của domain `les-4saisonsgeneve.ch`.
2. **Xoá nội dung cũ** trong `public_html/` (sao lưu trước nếu cần).
3. Upload **toàn bộ nội dung BÊN TRONG `dist/`** vào `public_html/`
   (tức là `index.html`, `menu.html`, `about.html`, `gallery.html`, thư mục `sub-page/`, `images/`, `icon/`, `_astro/`, `.htaccess`, `404.html`…).
   → Lưu ý: upload **ruột** của `dist/`, KHÔNG upload nguyên thư mục `dist` rồi để file nằm trong `public_html/dist/`.

Xong. Truy cập `https://les-4saisonsgeneve.ch` để kiểm tra.

### Mẹo upload nhanh
Nén `dist/` thành `.zip`, upload 1 file zip vào `public_html/`, rồi dùng **Extract** của File Manager để giải nén tại chỗ (nhớ đưa file ra đúng `public_html/`).

---

## 3. (Tuỳ chọn) Tự động hoá bằng GitHub Actions → FTP

Tạo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
      - name: Upload via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: ./public_html/
```

Khai báo `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` trong **GitHub → Settings → Secrets**
(lấy thông tin FTP trong hPanel → Files → FTP Accounts). CI dùng `npm ci` trên runner sạch nên **không gặp lỗi TLS** như máy nội bộ → không cần `.npmrc`.

---

## Admin Dashboard — Hướng dẫn deploy riêng

### Bước 1: Tạo MySQL Database
1. hPanel → **Cơ sở dữ liệu** → Tạo MySQL mới
2. Ghi lại: DB name, username, password (prefix `u444601569_`)

### Bước 2: Import schema
1. hPanel → **phpMyAdmin** → chọn database vừa tạo
2. Tab **Import** → chọn file `server/schema.sql` → Execute
3. Kiểm tra: 7 bảng đã tạo + 12 categories seeded

### Bước 3: Cấu hình database
- Mở `server/config/db.php`
- Điền DB_NAME, DB_USER, DB_PASS đúng với bước 1
- **KHÔNG commit file này lên git!**

### Bước 4: Tạo subdomain admin
1. hPanel → **Domains** → Subdomains
2. Tạo `admin.les-4saisonsgeneve.ch` → trỏ vào `public_html/admin/`

### Bước 5: Upload files PHP
Upload toàn bộ nội dung `server/` vào `public_html/` (merge, không xoá file Astro):
```
public_html/
├── api/          ← từ server/api/
├── config/       ← từ server/config/
├── uploads/      ← từ server/uploads/
└── admin/        ← từ server/admin/
```

### Bước 6: Seed data menu
1. Mở `server/seed.php` → đổi `SEED_TOKEN` thành chuỗi random
2. Upload file → truy cập: `https://les-4saisonsgeneve.ch/seed.php?token=CHUOI_RANDOM`
3. Xem kết quả "73 dishes inserted" → **XOÁ seed.php ngay lập tức!**

### Bước 7: Deploy Astro site
```bash
npm run build
```
Upload `dist/` lên `public_html/` (giữ api/, config/, uploads/, admin/ không xoá)

### Bước 8: Đổi mật khẩu admin
Truy cập `https://admin.les-4saisonsgeneve.ch`  
Login: `admin` / `change_me_123`  
→ **Đổi ngay trong database via phpMyAdmin** (chạy query UPDATE với password_hash mới)

---

## Checklist sau deploy

- [ ] Trang chủ load: preloader chạy gọn → hero Ken Burns + chữ hiện theo lớp.
- [ ] `/menu` load dishes từ API (không còn hardcode).
- [ ] `/gallery` load images từ API.
- [ ] Form đặt bàn ở `/about` submit → nhận "Votre demande a été envoyée".
- [ ] `admin.les-4saisonsgeneve.ch` → login thành công.
- [ ] Dashboard hiện stats + chart visitors.
- [ ] Thêm 1 món mới trong admin → xuất hiện trên `/menu`.
- [ ] Slider "La carte des mets" → bấm category → danh sách món từ API.
- [ ] Nút chuyển dark/light hoạt động, lưu lựa chọn.
- [ ] Mở trên điện thoại: menu hamburger, layout không vỡ.
