# QA audit âm thanh nền GitHub Pages

URL kiểm tra: https://yen0110122009-cell.github.io/gocnhocuaong-web/?qa=ambient-audit-final-964940fd

Thời điểm kiểm tra: 2026-08-20.

Kết quả live sau đăng nhập tài khoản 111:

- Đăng nhập thành công; trang hiển thị Ong12345@@, Founder, mã thành viên 111.
- UI có Audio Center, nút `Phát thử âm nền`, mute, volume và các nút phát âm nền theo cảm xúc.
- Console inspection trước khi phát cho thấy `audio` elements = 0.
- Account 111 hiện chưa có bản thu ambient thật: UI hiển thị `Mưa rơi — Chưa có bản thu thật` và `Lật sách — Chưa có bản thu thật`.
- Nút phát âm nền Bình tĩnh vẫn hiện và có thể bấm; logic source xử lý nhánh thiếu asset bằng thông báo `Chưa có bản thu âm nền hợp lệ...`, không tạo audio element giả.
- Logic asset thật dùng `new Audio()`, preload, loop, fade-in 320ms, volume/mute, onerror, autoplay rejection message và cleanup qua `stopAmbient()`.
- Vì tài khoản QA không có ambient asset, chưa thể xác nhận âm thanh phát ra thực tế hoặc đo readyState/playback của một file thật. Đây là giới hạn dữ liệu test, không phải bằng chứng lỗi URL/playback.

Kết luận: chưa quan sát thấy lỗi JavaScript mới ở luồng ambient; cần upload một file MP3/WAV/OGG/WEBM/M4A hợp lệ vào account 111 để hoàn tất test phát thật trên GitHub Pages, gồm autoplay fallback, volume, mute, fade-in và stop/cleanup.
