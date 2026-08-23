# Tóm tắt đặc tả VFX và theme từ `pasted_content_13.txt` và `pasted_content_14.txt`

- Lớp VFX phải phủ toàn viewport (`fixed`, `inset: 0`, `z-index: 50`, `pointer-events: none`, `overflow: hidden`); nội dung ở lớp 1, sidebar/header ở lớp 3 (`z-index: 100`).
- Icon tương tác là phần tử con có `pointer-events: auto`, `touch-action: none`, kích thước trong khoảng 80–140 px và con trỏ `grab/grabbing`.
- Kéo thả dùng Pointer Events với `setPointerCapture`/`releasePointerCapture`, cập nhật tọa độ theo offset thực, xử lý `pointercancel`, phản hồi nhấc lên `scale(1.15)` và physics khi thả: gravity-heavy, float-feather, bounce-elastic hoặc static-stay.
- Các icon lễ hội dưới đáy trải từ 0–100vw, sát đáy với khoảng ngẫu nhiên 0–40 px; mỗi theme có khoảng 25–30 icon phân theo danh sách người dùng nêu (Tết, Giỗ Tổ, 26/3, 30/4, 27/7, 19/8, 2/9, Trung Thu, 20/11, 8/3).
- Linh vật không bị khóa một chỗ; có thể kéo khắp màn hình và tự đổi vị trí theo chu kỳ khoảng 4–5 giây, tôn trọng reduced motion.
- Khi chọn theme, cập nhật token màu nền, chữ, panel và accent ở `:root` để cả trang đổi đồng bộ, đồng thời bảo đảm độ tương phản.
- Âm thanh chỉ được phát sau cử chỉ đầu tiên của người dùng; luồng cần xử lý Promise bị từ chối, tránh autoplay và không tự thêm URL audio ngoài nguồn đã có.
