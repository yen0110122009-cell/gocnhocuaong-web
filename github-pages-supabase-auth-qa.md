# GitHub Pages Supabase Auth QA

Ngày kiểm tra: 2026-08-17.

URL kiểm tra: https://yen0110122009-cell.github.io/gocnhocuaong2/?auth=85fe3ae-2

Commit Pages: `85fe3ae8482831853bc6ef955c6fb7a5d52da599`.

Kết quả browser QA:

- GitHub Pages phục vụ asset mới có chuỗi `Bản GitHub Pages dùng Supabase Auth` và `Tạo tài khoản Supabase`.
- Form đăng nhập hiển thị email, mật khẩu và nút `Quên mật khẩu?`.
- Tab `Tạo tài khoản` hiển thị email, tên thành viên, mật khẩu và mã thành viên.
- Tài khoản đăng ký từ frontend được ghi rõ mặc định là `Member`; không cho client tự cấp Founder/Admin.
- Không thực hiện submit đăng ký thật trong QA để tránh tạo tài khoản dữ liệu thật khi chưa có email/mật khẩu do người dùng xác nhận.

Kiểm thử tự động local: 21 test files / 58 tests passed; TypeScript check và production build passed.

Giới hạn còn lại: cần người dùng cung cấp email và tự đặt mật khẩu để kiểm thử live signup; Supabase Auth email confirmation/reset redirect phải được cho phép trong project settings nếu Supabase đang bật email confirmation.
