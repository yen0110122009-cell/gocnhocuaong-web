# Ghi nhận kiểm tra trình duyệt — 2026-08-23

Màn đăng nhập tải thành công và hiển thị đầy đủ trường **Tên thành viên**, **Mật khẩu**, **Mã được cấp**, nút đăng nhập cùng lựa chọn khách. Lần chọn luồng khách từ trình duyệt sandbox hết thời gian và chuyển phiên quan sát sang `about:blank`, nên chưa thể dùng phiên này để xác nhận tương tác sau đăng nhập hoặc VFX đã chọn.

Các thay đổi VFX, nền palette và âm nền vì vậy sẽ được xác minh bằng regression, build và ảnh preview; cần kiểm tra thủ công thêm với một tài khoản hợp lệ sau phát hành.

## Kiểm tra responsive sau khôi phục palette/VFX

- Ảnh desktop 1280×720 và mobile 375×812 cho thấy màn đăng nhập có nền sáng, chữ đỏ/xanh đủ tương phản, trường nhập liệu dễ đọc và không có lớp phủ trắng chặn thao tác.
- Việc xác minh trực tiếp nền palette, linh vật lễ hội và kéo thả Pointer Capture vẫn cần một phiên thành viên hợp lệ; các nhánh này đã được bao phủ bằng regression và kiểm tra kiểu/build trong đợt cập nhật.
