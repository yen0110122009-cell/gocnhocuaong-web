# Checklist QA theo module — GÓC HỌC TẬP CỦA ONG

Quy ước trạng thái: **Đạt** = đã kiểm tra và đúng; **Chưa đạt** = đã kiểm tra nhưng còn lỗi; **Thiếu** = chưa có hoặc chưa đủ chức năng; **Sai** = lệch yêu cầu hoặc dữ liệu hiển thị sai.

| # | Module | Checklist kiểm tra | Trạng thái |
|---:|---|---|---|
| 1 | Giao diện | Đỏ sáng + xanh lá là màu chủ đạo; tương phản sáng/tối; không có chữ chìm; điều khiển bật/tắt rõ ràng | Đạt |
| 2 | Mascot | Lumi là bạn đồng hành; Ong người là avatar học; hoodie/chibi là biến thể; fallback không dùng asset cũ | Đạt |
| 3 | Pomodoro | Bắt đầu nhỏ, 5 phút cuối, hoàn thành, combo, Comeback, lưu phiên và không phạt XP | Đạt |
| 4 | Audio Center | Preset, nhiều lớp, mixer từng lớp, volume, mute, preview, cleanup và reduced motion | Đạt |
| 5 | Achievement | Điều kiện, tiến độ, remaining, phần thưởng và hành trình không tạo áp lực 100% | Đạt |
| 6 | Khoảnh khắc | Hiển thị dữ liệu khoảnh khắc thật, không bịa thành tích hoặc lời chứng thực | Thiếu |
| 7 | Hiểu tận gốc | Câu đúng +1, giải thích +3, phát hiện lỗi +4, làm lại +3, cách khác +5; lưu event riêng | Đạt |
| 8 | Làm đề giấy | Timer, pause tùy chọn, kết quả từng câu, ghi chú, lưu phiên và trạng thái abandoned/completed | Đạt |
| 9 | Thùng rác | Xóa mềm, ngày xóa, lọc mục đã xóa, xác nhận xóa vĩnh viễn | Đạt |
| 10 | Sửa/xóa/khôi phục | Có thao tác riêng cho nội dung, mascot state và cấp độ; không để AI tự sửa/xóa | Thiếu |
| 11 | Responsive | Login, dashboard, Pomodoro, Audio Center, Admin trên desktop/mobile; không tràn ngang | Đạt |
| 12 | Lưu dữ liệu | ProfileState/AppConfig cloud-state, deep events, level definitions và fallback dữ liệu cũ | Đạt |
| 13 | Animation | Start/completion/breathing có bật/tắt; tôn trọng prefers-reduced-motion | Đạt |
| 14 | Popup | Nội dung rõ, đóng được bằng nút/ESC khi phù hợp, không chặn thao tác chính | Đạt |
| 15 | Trạng thái mascot | idle, studying, focus, tired, sleepy, procrastinating, comeback, deep_focus, completed và các trạng thái còn lại có mapping | Đạt |

## Bằng chứng kiểm thử

- TypeScript: đạt sau khi thêm `DeepLearningEvent`, `XP_PER_LEVEL` và công thức level mới.
- Regression mục tiêu hiện tại: 9/9 tests đạt cho audio/procrastination.
- Browser preview: đã kiểm tra landing/login desktop và mobile; cần chạy lại các màn hình authenticated sau khi hoàn thiện UI quản trị level và Khoảnh khắc.
- Các mục **Thiếu** không được đánh dấu hoàn tất cho đến khi có UI và test riêng tương ứng.
