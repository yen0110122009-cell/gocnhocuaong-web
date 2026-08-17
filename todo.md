# Project TODO — GÓC HỌC TẬP CỦA ONG

- [x] Thiết kế migration Supabase cho 10 bảng bắt buộc và các enum/trigger liên quan.
- [x] Thiết lập Row Level Security và chính sách truy cập cho từng bảng Supabase.
- [ ] Kiểm tra hoặc kích hoạt connector Supabase, áp dụng migration vào cloud khi có quyền quản trị cần thiết.
- [x] Đồng bộ domain schema MySQL/Drizzle cho dữ liệu học tập, catalog, ledger, AI Studio và quản trị.
- [x] Tạo migration Drizzle và áp dụng schema MySQL/TiDB của website.
- [x] Triển khai ranh giới xác thực Founder, Admin và Member với các quy tắc khóa, xóa tài khoản và phiên làm việc.
- [x] Triển khai dashboard học tập: XP, điểm số, lịch sử, Knowledge Map và tiến trình.
- [x] Triển khai catalog 900 Thành tích và 400 Danh hiệu với tìm kiếm, lọc và tiến trình.
- [x] Triển khai Bảo tàng Hành trình, nhân vật lịch sử và bộ sưu tập mảnh ghép.
- [x] Triển khai Piece Ledger atomic, idempotency key, audit log và điều chỉnh có kiểm soát.
- [x] Triển khai AI Studio cho upload tài liệu, Flashcard, Quiz và lịch sử làm bài.
- [x] Triển khai Pomodoro với cấu hình tùy chỉnh và lưu phiên học tập.
- [x] Triển khai Admin Panel cho thành viên, phần thưởng và import nhân vật.
- [ ] Thiết kế landing page, dashboard layout và UI responsive theo brand GÓC HỌC TẬP CỦA ONG cùng mascot Lumi.
- [x] Thêm kiểm thử Vitest cho database contract, phân quyền, ledger và router cốt lõi.
- [x] Chạy kiểm thử build và smoke test giao diện.
- [ ] Đồng bộ các thay đổi phù hợp lên GitHub repository yen0110122009-cell/gocnhocuaong2.
- [ ] Tạo checkpoint sau khi toàn bộ hạng mục hoàn thành và bàn giao website.

- [x] Chạy browser smoke/regression trực tiếp cho Dashboard, Catalog, Museum, AI Studio, Pomodoro và Admin Panel trong gocnhocuaong-web.
- [x] Chạy test router/module cốt lõi trực tiếp trong gocnhocuaong-web; catalog 900/400, permissions/auth, ledger và Supabase smoke đã đạt.
- [ ] Xác nhận responsive landing page và dashboard ở desktop/mobile, bao gồm mascot Lumi và brand fidelity.
- [x] Khắc phục hoặc xác nhận không còn lỗi runtime module resolution sau khi đồng bộ source.

- [ ] Chạy QA responsive riêng cho landing và dashboard ở cả desktop và mobile, lưu screenshot/evidence rõ ràng cho layout, navigation và trạng thái sau đăng nhập.
- [x] Xác nhận trực quan mascot Lumi hiển thị đúng trên UI và ghi lại evidence brand fidelity gồm tên thương hiệu, màu sắc, hình ong và typography.
- [ ] Chạy browser QA chi tiết trên Catalog: tìm kiếm và bộ lọc đã được xác nhận; còn phải xác nhận trực tiếp thanh tiến trình.
- [ ] Chạy browser QA chi tiết trên Museum Journey: non-empty/locked state đã được xác nhận; còn phải ghi evidence empty state riêng.
- [ ] Chạy end-to-end QA cho AI Studio: upload tài liệu, tạo Flashcard/Quiz và kiểm tra lịch sử làm bài.
- [ ] Chạy QA Pomodoro end-to-end: đổi cấu hình, bắt đầu phiên, lưu và truy xuất trạng thái phiên học.
- [ ] Chạy QA Admin Panel end-to-end: quản lý thành viên, cấu hình phần thưởng và import nhân vật với kết quả mutation rõ ràng.
- [x] Bổ sung và chạy Vitest cho study router/module cốt lõi cùng database invariants thực tế.
- [ ] Xác nhận trực tiếp progress bar của Catalog trong browser, không chỉ số đếm văn bản.
- [x] Tạo dữ liệu nhân vật lịch sử hợp lệ qua Admin flow để kiểm tra Museum non-empty state và trạng thái mảnh ghép.
- [ ] Hoàn tất regression end-to-end cho AI Studio, Pomodoro và Admin Panel với mutation/persistence thật rồi lưu evidence.
