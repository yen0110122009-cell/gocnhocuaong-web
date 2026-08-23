# Ghi chú đối chiếu đặc tả nâng cấp theme

Nguồn: tệp người dùng cung cấp tại `/home/ubuntu/upload/pasted_content.txt`, đọc ngày 2026-08-23.

## Yêu cầu cần đối chiếu

Đặc tả yêu cầu token màu sáng/tối có tương phản cao; tách hành vi chọn tone UI với chọn theme/cảnh; hiệu ứng chỉ dùng emoji và sáu nhóm hoạt ảnh (rơi, bay lên, nảy, phát sáng, lao chéo, rơi/nằm đáy); khoảng 25–35 emoji cho một theme; mascot kéo thả; các vật thể đáy có thể kéo thả và chịu bốn kiểu phản hồi vật lý kín; âm thanh cần được phát từ thao tác chọn theme; nút reset phải trả scene/theme về mặc định và dừng âm thanh; mascot tiếp tục chuyển động nhẹ sau khi được thả.

Đặc tả nêu hoặc điều chỉnh mười theme lễ hội Việt Nam: Tết Nguyên Đán, Giỗ Tổ Hùng Vương, Ngày Thành Lập Đoàn 26/3, Giải Phóng Miền Nam 30/4, Ngày Thương Binh Liệt Sĩ 27/7, Cách Mạng Tháng Tám 19/8, Quốc Khánh 2/9, Tết Trung Thu, Ngày Nhà Giáo Việt Nam 20/11 và Quốc Tế Phụ Nữ 8/3. Các emoji, palette và mặc định âm lượng trong tệp là dữ liệu tham khảo để ánh xạ vào registry hiện có.

## Ràng buộc áp dụng

Không chép các URL mẫu `https://actions.google.com/...` hoặc `https://cdn.pixabay.com/...` từ đặc tả vào sản phẩm, vì đây là URL minh họa/chưa được xác nhận là nguồn người dùng cung cấp. Chỉ sử dụng mapping audio đã được dự án audit hoặc bản ghi do người dùng tải lên. Lớp trang trí phải luôn không chặn menu/nội dung; trạng thái reduced motion và tắt hiệu ứng sẵn có phải được tôn trọng.

## Đối chiếu ban đầu

`FestiveThemeLayer` đã cung cấp mascot và đồ vật đáy kéo thả, phản hồi click, token màu theo scene, mười bốn theme lễ hội và lớp hiệu ứng không chặn thao tác. `ProfileState` đã có `defaultAmbientScene`, `favoriteAmbientScenes`, `appearanceEmojiPet`, `sceneEffectPreferences`, `sceneAutomation` và `audioMixer`. Đợt triển khai sẽ mở rộng các điểm còn thiếu thay vì tạo song song một `#vfx-stage` hoặc nguồn audio thứ hai.
