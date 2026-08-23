# Ghi nhận kiểm tra audio Lumi

- Ngày kiểm tra: 2026-08-23.
- Bản xem trước tải đến màn hình đăng nhập bình thường, không có lớp phủ chặn thao tác.
- Phiên trình duyệt kiểm tra chưa đăng nhập và chưa có dữ liệu bản thu, vì vậy không thể xác minh quyền micro hoặc phát một bản thu cá nhân trực tiếp trên môi trường này.
- Luồng lỗi micro và lỗi media đã được bổ sung trong giao diện; việc ghi/phát trên thiết bị người dùng vẫn cần kiểm tra với quyền micro thật.
- Lần thử vào phiên khách từ browser sandbox bị hết thời gian và phiên sau trở về trang trống; đây không phải bằng chứng về lỗi giao diện hay quyền micro của người dùng.
