
## QA hoàn tất sau commit bba0f52

GitHub Pages build API báo `built` với commit `bba0f522b009ae4636ffcdf2bb5a27329a919c9a`. Browser xác nhận trang không còn trắng; HTML dùng asset path `/gocnhocuaong2/assets/...`; giao diện branded hiển thị bình thường. Form đăng nhập hiển thị thông báo: `Đây là bản xem trước trên GitHub Pages. Đăng nhập và dữ liệu cần mở bản website đầy đủ có backend.` Các query profile/config bị tắt trên hostname `github.io`, session cũ bị bỏ qua, nên không còn request tương đối trả HTML rồi gây `Unexpected token '<'` như JSON.
