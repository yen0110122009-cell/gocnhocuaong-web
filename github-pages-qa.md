# GitHub Pages QA Evidence

Ngày kiểm tra: 2026-08-17.

GitHub Pages URL: https://yen0110122009-cell.github.io/gocnhocuaong2/

Kết quả: Sau khi branch `main` nhận commit `12689759d93baf322e661bd43da54ef9368bbd42`, GitHub Pages build API báo trạng thái `built`. Browser mở URL với cache-busting query và nhận title `GÓC HỌC TẬP CỦA ONG`, hiển thị landing page, mascot Lumi, nội dung thương hiệu và form đăng nhập gồm tên thành viên, mật khẩu, mã thành viên.

Giới hạn: Đây là bản frontend tĩnh trên GitHub Pages. Các luồng cần Express/tRPC/database/session không thể chạy đầy đủ nếu không có backend riêng; URL Manus vẫn là nơi chạy bản full-stack.

Workflow source: `.github/workflows/deploy-pages.yml` trên branch `webdev/gocnhocuaong-platform`.
