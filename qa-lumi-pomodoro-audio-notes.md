# QA — Lumi, Pomodoro và Audio Center

Ngày kiểm tra: 19/08/2026.

- Trang đăng nhập hiển thị ổn định tại 1280×720 và 375×812; không phát hiện tràn ngang hoặc lỗi bố cục sau cập nhật dữ liệu audio.
- Xác minh bằng TypeScript, Vitest và production build đã hoàn tất trước QA trực quan.
- Các khu vực yêu cầu tài khoản (Experience Studio, Pomodoro và Admin) được bảo vệ sau đăng nhập, nên kiểm thử hành vi phát âm thanh tại đây được bao phủ bởi regression contract thay vì tự phát âm thanh trong trang đăng nhập.
