# Đặc tả triển khai `pasted_content_18`

## Kế hoạch ngày từ câu lệnh

- Khu vực Kế hoạch cung cấp ô nhập những việc muốn hoàn thành hôm nay.
- Ứng dụng tạo một prompt tiếng Việt có thể sao chép để dùng với AI bên ngoài.
- Khi người dùng chủ động chọn tạo bản nháp, AI chỉ trả về dữ liệu có cấu trúc; người dùng xem và chỉnh sửa trước khi lưu vào Kế hoạch ngày.
- Phiên khách không gọi AI và không lưu dữ liệu.

## Linh vật và VFX

- Linh vật được đặt trong `#vfx-stage`, thuộc layer VFX, hiển thị ở kích thước 130px và dùng Pointer Capture để kéo thả.
- Khi thay lựa chọn linh vật, phần tử linh vật được gắn lại toàn bộ handler kéo-thả, tương đương `bindMascotDrag` trong kiến trúc React.
- Chỉ giữ ba lớp: nội dung, VFX stage, menu/header; VFX không chặn thao tác nội dung và luôn nằm dưới menu/header.
- Duy trì năm physics thả icon: ground, float, bounce, orbit và snap.
- Audio chỉ kích hoạt sau cử chỉ chủ động và dừng an toàn nếu nguồn lỗi, không ảnh hưởng Pomodoro hoặc Lumi.
