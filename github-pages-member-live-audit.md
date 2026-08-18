# GitHub Pages member-list live audit

Checked URL: https://yen0110122009-cell.github.io/gocnhocuaong2/

The live HTML currently references `/gocnhocuaong2/assets/index-B-xgSHNJ.js` and `/gocnhocuaong2/assets/index-C9YfHwpO.css`, confirming the GitHub Actions artifact uses the correct project base path. The live JavaScript contains the string `Danh sách thành viên`, so the Admin member-list UI code is present in the published bundle. The next required verification is an authenticated Admin session to capture the actual GET/PATCH response and error message; the current sandbox browser session is not logged into the user's Admin account.

## Browser QA 2026-08-18
URL: https://yen0110122009-cell.github.io/gocnhocuaong2/?v=member-create-qa-20260818

Phiên trình duyệt đang ở vai trò `Ong` / `Founder` và mở đúng Admin Panel → Thành viên. Khu vực hiển thị `0 tài khoản` và nút `Làm mới`. Sau khi bấm `Cấp mã tài khoản` với tên `1`, mã `1`, vai trò `Member`, giao diện hiển thị toast đỏ: `Unexpected token '<', "<html> <he"... is not valid JSON`. Console trước thao tác không có output. Đây là tái hiện trực tiếp, xác nhận đường tạo member đang gọi endpoint trả HTML thay vì cloud-state REST JSON.

## Browser QA after workflow 32147721622

- URL: https://yen0110122009-cell.github.io/gocnhocuaong2/?v=00af709-member-sync
- Commit: `00af7094a26f44291341b01125e55c8213cb48a6`
- Result: login page loads normally; no blank page; footer shows `Bản cập nhật member-sync.`; workflow build and deploy both succeeded.
- Authenticated Admin member-list/create verification remains required because this fresh browser view is not logged into the user's session.

## Authenticated Admin QA after workflow 32147721622

Phiên test đã đăng nhập thành công bằng tài khoản `BY`, mật khẩu test do người dùng cung cấp và mã `111`; dashboard xác nhận vai trò Founder. Trong Admin Panel, danh sách ban đầu có 3 tài khoản. Thao tác cấp tài khoản với tên `Tên 1`, mã nhập `Mã 1`, vai trò `Member` đã ghi thành công vào namespace `__gocnhocuaong` của Supabase app_state. Adapter chuẩn hóa mã thành chữ hoa nên bản ghi cloud là `MÃ 1`.

Sau khi bấm `Làm mới`, giao diện hiển thị `4 tài khoản` và hàng `Tên 1 — MÃ 1 — Member`. Truy vấn read-only trực tiếp Supabase cũng xác nhận bản ghi có id `5b89aef9-72c7-4948-b177-b2849e842404`, role `Member`, locked `false`, không có passwordHash ban đầu. Kết luận: luồng đăng nhập mã 111, cấp member và đồng bộ danh sách trên GitHub Pages đã pass; dữ liệu legacy `memberAccounts`/`membersList` không phải namespace mà cloud adapter mới sử dụng.
