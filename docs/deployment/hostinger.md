# 🚀 Hướng dẫn Deploy — Hostinger

> Trang build bằng **Astro static** → sinh ra thư mục `dist/` chỉ gồm HTML/CSS/JS thuần.
> Hostinger shared hosting **chỉ phục vụ file tĩnh, không chạy Node** → không có conflict.

> ⚠️ **Tuyệt đối không** đổi `astro.config.mjs` sang `output: 'server'` hay thêm adapter SSR
> — cái đó cần Node runtime và sẽ **không chạy** trên shared hosting.

---

## Bước 1 — Build ở máy

```bash
npm install        # lần đầu (đã có .npmrc xử lý lỗi TLS proxy nội bộ)
npm run build      # sinh ra dist/
```

Kiểm tra thử bản tĩnh trước khi upload:

```bash
npm run preview    # mở http://localhost:4321
```

---

## Bước 2 — Upload lên Hostinger

Mở **hPanel → File Manager** (hoặc dùng FTP/SFTP):

1. Vào thư mục `public_html/` của domain `les-4saisonsgeneve.ch`
2. **Xoá nội dung cũ** trong `public_html/` (sao lưu trước nếu cần)
3. Upload **toàn bộ nội dung BÊN TRONG `dist/`** vào `public_html/`:
   - `index.html`, `menu.html`, `about.html`, `gallery.html`
   - Thư mục: `menu/`, `images/`, `icon/`, `_astro/` (+ `api/`, `admin/`, `config/`, `uploads/` nếu deploy kèm backend)
   - File: `.htaccess`, `404.html`

> ⚠️ Upload **ruột** của `dist/`, **KHÔNG** upload nguyên thư mục `dist` rồi để file nằm trong `public_html/dist/`.

### Mẹo upload nhanh (zip)
1. Nén `dist/` thành file `.zip`
2. Upload 1 file zip vào `public_html/`
3. Dùng **Extract** của File Manager để giải nén tại chỗ

---

## Bước 3 — Bật SSL & ép HTTPS (nên làm, để ổn định + bảo mật)

1. hPanel → **Security → SSL** → cài SSL miễn phí (Let's Encrypt) cho `les-4saisonsgeneve.ch`. Chờ trạng thái **Active** (vài phút).
2. **Ép HTTPS:** bật toggle **"Force HTTPS"** trong hPanel (hoặc bỏ comment khối `RewriteCond %{HTTPS} off` trong `.htaccess`).
3. Mở `https://les-4saisonsgeneve.ch` → thấy ổ khoá xanh là OK.

> Asset đều dùng path tuyệt đối root-relative (`/images`, `/_astro`) nên chạy đúng trên domain gốc; có thể test trước trên URL tạm của Hostinger (`*.hostingersite.com`) rồi mới trỏ domain.

---

## Bước 4 — Tự động hoá: push `main` → CI build → branch `deploy` (CÁCH ĐANG DÙNG)

> ⚠️ **QUAN TRỌNG:** Hostinger phục vụ branch **`deploy`** và **KHÔNG build hộ**. Astro chỉ ra site thật sau khi build (`dist/`).
> ⇒ Branch `deploy` phải chứa **bản đã build**, KHÔNG phải source. **Merge tay `main → deploy` sẽ KHÔNG hoạt động** (chỉ đẩy source chưa build).

File **`.github/workflows/deploy.yml`** (đã tạo sẵn): push `main` → `npm run build` → đẩy `dist/` lên branch `deploy` (peaceiris/actions-gh-pages, giữ history tuyến tính để Hostinger `git pull` fast-forward).

**Kích hoạt (1 lần):**
```bash
git add .github/workflows/deploy.yml package-lock.json
git commit -m "ci: auto build + deploy dist to deploy branch"
git push origin main
```
> ⚠️ Lần push đầu **ghi đè branch `deploy`** (site vanilla cũ → site Astro mới — đây là điều mong muốn). Muốn backup trước:
> `git push origin origin/deploy:refs/heads/deploy-backup`

**Cấu hình Hostinger:**
- hPanel → Advanced → **GIT**: trỏ repo, branch **`deploy`**, path `/` (`public_html`).
- Bật **Auto-Deployment** để Hostinger tự pull khi `deploy` đổi. Muốn CI tự gọi → thêm secret **`HOSTINGER_DEPLOY_HOOK`** (GitHub → Settings → Secrets → Actions = webhook URL của hPanel GIT). Không thì sau mỗi CI vào hPanel GIT bấm **Deploy**.

**Từ nay:** chỉ **push lên `main`** → CI tự build → deploy. **Không merge tay** main→deploy nữa.

> CI chạy trên runner sạch (không proxy) → KHÔNG cần `.npmrc`. `npm ci` cần `package-lock.json` đã commit; nếu chưa, workflow tự fallback `npm install`.

---

## Checklist sau deploy

- [ ] Trang chủ load: preloader chạy gọn → hero Ken Burns + chữ hiện theo lớp
- [ ] `/menu.html`, `/gallery.html`, `/about.html` hiển thị đúng tông ấm
- [ ] Bấm 1 món ở menu → mở `/menu/dish-detail.html?...` đúng nội dung
- [ ] Slider "La carte des mets" → bấm category mở `/menu/category.html?category=...` ra danh sách món
- [ ] Nút chuyển dark/light hoạt động, lưu lựa chọn
- [ ] Mở trên điện thoại: menu hamburger, layout không vỡ
- [ ] Gõ URL sai → ra trang 404 đẹp (nhờ `.htaccess`)
