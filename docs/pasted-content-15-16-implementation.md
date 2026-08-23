# Đối chiếu đặc tả VFX và audio theme

Hai tệp `pasted_content_15.txt` và `pasted_content_16.txt` được áp dụng cho renderer lễ hội React hiện hữu. Icon đáy và linh vật được chuẩn hóa trong khoảng 100–140px. Renderer tạo đúng 28 icon đáy, sắp xếp bằng thứ tự xáo trộn xác định theo ID theme và luân phiên năm physics: rơi về đáy, trôi tự do, nảy, quỹ đạo và snap theo lưới.

Lớp trang trí mặc định không nhận thao tác; chỉ icon đáy và linh vật là phần tử nhận Pointer Events. Cả hai luồng đều dùng Pointer Capture, xử lý `pointercancel`, thả capture an toàn và giới hạn tọa độ trong viewport. Sidebar và header được đặt trên lớp VFX; reduced-motion vô hiệu hóa các animation không thiết yếu.

Mười URL audio do người dùng cung cấp được lưu như nguồn chính cho các theme lễ hội tương ứng. Một registry duy nhất mang cả URL chính và URL đã audit dự phòng. Trình phát trong bảng Giao diện tiếp tục dùng một phần tử audio, chỉ bắt đầu sau cử chỉ **Nghe thử**, và tự chuyển sang fallback khi nguồn chính phát lỗi.
