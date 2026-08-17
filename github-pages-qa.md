
## QA hoàn tất sau commit bba0f52

GitHub Pages build API báo `built` với commit `bba0f522b009ae4636ffcdf2bb5a27329a919c9a`. Browser xác nhận trang không còn trắng; HTML dùng asset path `/gocnhocuaong2/assets/...`; giao diện branded hiển thị bình thường. Form đăng nhập hiển thị thông báo: `Đây là bản xem trước trên GitHub Pages. Đăng nhập và dữ liệu cần mở bản website đầy đủ có backend.` Các query profile/config bị tắt trên hostname `github.io`, session cũ bị bỏ qua, nên không còn request tương đối trả HTML rồi gây `Unexpected token '<'` như JSON.

## QA 2026-08-17 — no-email full-stack redirect

Source: https://yen0110122009-cell.github.io/gocnhocuaong2/?auth=no-email-built-4ef9e93

GitHub Pages API status chuyển từ `building` sang `built` sau commit `4ef9e930f678398f053f718b4791611d637c303e`.

Browser xác nhận bản tĩnh đã bỏ trường Email, hiển thị Tên thành viên, Mật khẩu, Mã thành viên; thông báo nói GitHub Pages chỉ hiển thị giao diện và nút `Mở bản full-stack để đăng nhập`. Nút có đích preview `https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/`. Bản Pages không xác thực tài khoản; full-stack hỗ trợ login không email.
