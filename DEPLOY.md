# Deploy lên GitHub Pages

Tài liệu này dùng cho repository public có tên chính xác là `de-ds-interview-lab` trên tài khoản `minora2k4`.

Sau khi deploy thành công, địa chỉ là:

<https://minora2k4.github.io/de-ds-interview-lab/>

Ứng dụng dùng hash router, nên các trang kiến thức có dạng `/#/de/spark/...`. Không cần thêm `404.html`.

## 1. Kiểm tra trên máy

Mở Terminal tại thư mục dự án rồi chạy:

```bash
cd /home/minora/Documents/Web/DE_learning
export PATH="$HOME/.local/bin:$PATH"
npx tsc -b
npm test
npm run validate:content
npm run build
npm run preview -- --host
```

Mở địa chỉ Vite in ra để kiểm tra bản build. Dừng preview bằng `Ctrl+C` khi xong.

## 2. Tạo repository trên GitHub

1. Đăng nhập GitHub bằng tài khoản `minora2k4`.
2. Chọn **New repository**.
3. Đặt tên là `de-ds-interview-lab` và chọn **Public**.
4. Không chọn tạo sẵn README, `.gitignore` hoặc license. Repository cần trống để lần push đầu không phải gộp lịch sử.
5. Chọn **Create repository**.

## 3. Đưa mã nguồn lên GitHub

Đây là các lệnh chỉ bạn tự chạy sau khi đã kiểm tra xong. Chúng khởi tạo Git và push mã nguồn lên GitHub.

```bash
cd /home/minora/Documents/Web/DE_learning
git init
git branch -M main
git add index.html package.json package-lock.json vite.config.ts components.json \
  tsconfig.json tsconfig.app.json tsconfig.node.json tsconfig.scripts.json \
  public src scripts .github .gitignore .oxlintrc.json README.md DEPLOY.md
git status --short
git commit -m "Initial release"
git remote add origin git@github.com:minora2k4/de-ds-interview-lab.git
git push -u origin main
```

Trước `git commit`, đọc kết quả `git status --short`. Không thêm mật khẩu, khóa riêng hoặc tệp cá nhân.

Lệnh trên chủ động không đưa `research/`, `CONTENT_GUIDE.md`, `AGENTS.md`, `CLAUDE.md` và `HANDOFF.md` lên repository public. Nếu bạn muốn công khai tài liệu nào trong số này, thêm riêng tệp đó bằng `git add <tên-tệp>`.

## 4. Bật GitHub Pages

1. Vào repository `de-ds-interview-lab` trên GitHub.
2. Chọn **Settings** → **Pages**.
3. Trong **Build and deployment**, chọn **GitHub Actions** ở mục **Source**.
4. Vào tab **Actions**, mở workflow **Deploy GitHub Pages** và chờ hai job `build` và `deploy` đều có dấu tích xanh.
5. Mở URL ở đầu tài liệu. Lần deploy đầu có thể mất vài phút.

Workflow đã kiểm tra nội dung, chạy unit test, build Vite và chỉ deploy thư mục `dist/`. Nó chạy khi push vào nhánh `main`.

## Cập nhật về sau

Sau mỗi thay đổi đã kiểm tra:

```bash
git add <các-tệp-đã-sửa>
git status --short
git commit -m "Mô tả ngắn thay đổi"
git push
```

Mở tab **Actions** để theo dõi lần deploy mới. Khi workflow xanh, tải lại trang bằng `Ctrl+Shift+R` nếu trình duyệt còn giữ bản cũ.

## Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Trang trắng hoặc không tải được asset | Repository phải có tên `de-ds-interview-lab`, khớp `base: '/de-ds-interview-lab/'` trong `vite.config.ts`. Nếu đổi tên repo, sửa `base` rồi build và push lại. |
| Workflow không chạy | Kiểm tra file `.github/workflows/deploy.yml` đã được commit trên nhánh `main`, sau đó vào Settings → Pages và chọn **GitHub Actions**. |
| Job build đỏ | Mở log của bước lỗi trong tab Actions. Chạy lại đúng lệnh tương ứng ở mục 1 trên máy trước khi push lại. |
| Trang cũ sau deploy | Chờ workflow hoàn tất, sau đó hard refresh bằng `Ctrl+Shift+R` hoặc mở cửa sổ riêng tư. |
| Link trang con bị lỗi | Giữ hash router. URL phải có `/#/`, không đổi sang browser router. |

Tham khảo hướng dẫn chính thức: [GitHub Pages với workflow tùy chỉnh](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) và [chọn nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
