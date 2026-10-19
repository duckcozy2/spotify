# AuraTune — Glassmorphism Next.js Demo

Website demo tiếng Việt giới thiệu Spotify Premium, **không phải website chính thức của Spotify**. Giá chỉ là ví dụ, không có thanh toán hoặc kích hoạt thực tế.

## Chạy demo

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## SEO

Có metadata cho từng trang, sitemap.xml, robots.txt, nội dung hướng dẫn, FAQ, so sánh Free/Premium và Premium sinh viên. Thiết lập `NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.vn` khi triển khai để tạo canonical/sitemap đúng và bật index. Trước khi bán thật, thay giá mẫu, bổ sung thông tin pháp lý, chính sách, quyền cung cấp dịch vụ và phương thức đăng ký hợp lệ. Không thu thập mật khẩu Spotify.

## Triển khai

Đẩy mã lên GitHub, triển khai trên nền tảng hỗ trợ Next.js runtime hoặc cấu hình Cloudflare Workers/OpenNext tương thích. Không dùng cấu hình static export nếu dự án cần tính năng server trong tương lai.
