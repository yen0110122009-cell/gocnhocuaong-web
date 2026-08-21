# QA live tài khoản 111 — Lumi audio-only và Pomodoro

- URL: https://gocnhocuaong-dtezjgqf.manus.space/
- Phiên live đã nhận diện tài khoản BY, mã thành viên 111, Founder.
- Dark mode: nút chuyển thành “Chuyển sang chế độ sáng”; shell chuyển nền tối, scene vẫn giữ lớp cảnh phủ toàn trang.
- Trang chủ khi mở Không gian cảm xúc hiển thị các nút “Phát âm nền cho cảm xúc …”, gồm cả “Căng thẳng”, nên lời Lumi có đường phát audio độc lập.
- Pomodoro được mở bằng menu và module lazy-load hiển thị “Lumi đang mở không gian học… / Chỉ tải module khi Ong cần dùng.”; route không trả lỗi 404.
- Screenshot QA: /home/ubuntu/screenshots/gocnhocuaong-dtezjgqf_2026-08-21_02-08-17_7265.webp và /home/ubuntu/screenshots/gocnhocuaong-dtezjgqf_2026-08-21_02-08-26_5698.webp
- Chưa thể kết luận phiên timer đang chạy qua điều hướng chỉ từ smoke test hiện tại; cần thực hiện click bắt đầu, chuyển route, quay lại và kiểm tra số giây/state phục hồi.
- Lần QA này không quan sát thấy lỗi 429 trong phản hồi trang live; audio network-level vẫn cần thử phát trực tiếp trong trình duyệt.
