# Project TODO — GÓC HỌC TẬP CỦA ONG

- [x] Thiết kế migration Supabase cho 10 bảng bắt buộc và các enum/trigger liên quan.
- [x] Thiết lập Row Level Security và chính sách truy cập cho từng bảng Supabase.
- [x] Kiểm tra hoặc kích hoạt connector Supabase, áp dụng migration additive vào cloud và xác minh đủ 10 bảng cùng RLS policies.
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
- [x] Thiết kế landing page, dashboard layout và UI responsive theo brand GÓC HỌC TẬP CỦA ONG cùng mascot Lumi.
- [x] Thêm kiểm thử Vitest cho database contract, phân quyền, ledger và router cốt lõi.
- [x] Chạy kiểm thử build và smoke test giao diện.
- [x] Đồng bộ các thay đổi phù hợp lên GitHub repository yen0110122009-cell/gocnhocuaong2.
- [x] Tạo checkpoint trung gian trước khi tiếp tục QA E2E và cloud apply.

- [x] Chạy browser smoke/regression trực tiếp cho Dashboard, Catalog, Museum, AI Studio, Pomodoro và Admin Panel trong gocnhocuaong-web.
- [x] Chạy test router/module cốt lõi trực tiếp trong gocnhocuaong-web; catalog 900/400, permissions/auth, ledger và Supabase smoke đã đạt.
- [x] Xác nhận responsive landing page và dashboard ở desktop/mobile, bao gồm mascot Lumi và brand fidelity.
- [x] Khắc phục hoặc xác nhận không còn lỗi runtime module resolution sau khi đồng bộ source.

- [x] Chạy QA responsive riêng cho landing và dashboard ở cả desktop và mobile, lưu screenshot/evidence rõ ràng cho layout, navigation và trạng thái sau đăng nhập.
- [x] Xác nhận trực quan mascot Lumi hiển thị đúng trên UI và ghi lại evidence brand fidelity gồm tên thương hiệu, màu sắc, hình ong và typography.
- [x] Chạy browser QA chi tiết trên Catalog: tìm kiếm, bộ lọc và thanh tiến trình đã được xác nhận trực tiếp.
- [x] Chạy browser QA chi tiết trên Museum Journey: empty, non-empty và locked state đã được xác nhận trực tiếp.
- [x] AI Studio file TXT upload, document-to-JSON, Flashcard và Quiz mutation đã được xác minh trực tiếp; history sau khi nộp Quiz cũng đã được xác nhận.
- [x] Chạy browser QA Pomodoro đến bước kết thúc phiên và xác nhận persistence; phiên tùy chỉnh 1 phút đã hoàn tất và xuất hiện trong lịch sử.
- [x] Chạy browser QA Admin Panel cho member management, role change, lock/reset/delete và reward config mutations; các mutation member/role/lock/reset/delete đã xác nhận, dữ liệu QA đã dọn.
- [x] Bổ sung và chạy Vitest cho study router/module cốt lõi cùng database invariants thực tế.
- [x] Xác nhận trực tiếp progress bar của Catalog trong browser, không chỉ số đếm văn bản.
- [x] Tạo dữ liệu nhân vật lịch sử hợp lệ qua Admin flow để kiểm tra Museum non-empty state và trạng thái mảnh ghép.
- [x] Đánh dấu regression E2E hoàn tất sau khi AI Studio, Pomodoro và Admin Panel có evidence thực thi trực tiếp; 20 test files/51 tests contract/unit cũng đã đạt.
- [x] Chạy lại browser QA trên Catalog sau khi thêm progress bar, ghi rõ thanh tiến trình hiển thị trong UI và lưu screenshot/evidence sau thay đổi.
- [x] Cập nhật qa-evidence-webdev.md với bằng chứng trực tiếp cho progress bar Catalog sau restart, tách biệt khỏi evidence search/filter cũ.
- [x] Khắc phục lỗi Study Account không đăng nhập được trên live preview bằng cách bổ sung import `eq`, `and`, `gt` cho studyStore.
- [x] Xác minh validation, session bootstrap và quyền truy cập procedure sau login; `study.auth.login` và `study.auth.session` đều trả HTTP 200 với tài khoản Lumi QA Founder.
- [x] Chạy browser login end-to-end với Founder QA và lưu evidence; server-side login/session smoke cùng build/Vitest đã đạt.
- [x] Sửa AI Studio parser để chấp nhận cả JSON array trực tiếp và wrapper `{ "cards": [...] }`, đồng bộ output của `Tạo từ tài liệu` với nút `Tạo Flashcard`, rồi thêm regression test.

- [x] Sửa chấm điểm Quiz trả lời ngắn để bỏ qua khác biệt dấu câu/khoảng trắng thường gặp, rồi chạy lại browser QA nộp bài và lưu evidence; browser xác nhận `40.` và `Trưng Nhị.` đều đúng, kết quả 100% và history đã lưu.
- [x] Chạy lại browser QA Pomodoro và lưu bằng chứng trực tiếp từ chính danh sách lịch sử phiên sau khi hoàn thành 1 phiên ngắn; danh sách `Các phiên gần đây` hiển thị `Tự học · 1 phút · 05:54:52 17/8/2026 · Hoàn thành`.
- [x] Chạy browser QA trực tiếp cho ít nhất một reward config mutation trong Admin Panel và ghi rõ kết quả persistence/toast/UI; reward QA tạm đã tạo, hiển thị và xóa sạch thành công.
- [x] Chỉ đánh dấu regression E2E hoàn tất sau khi AI Quiz, Pomodoro history list và Admin reward config đều có evidence trực tiếp, không còn bug rõ ràng; AI Quiz 100%, Pomodoro history và Admin reward mutation đều đã xác nhận.

- [x] Miễn giới hạn tài khoản cho mã thành viên `111`: login/session bỏ qua trạng thái khóa, Admin không thể khóa mã này; regression test, TypeScript check và production build đã đạt.

- [ ] Tạo menu truy cập nhanh và bảng điều khiển đặc biệt chỉ hiển thị cho tài khoản mã `111` sau đăng nhập; desktop authenticated QA đã đạt, còn cần mobile authenticated QA và browser QA trực tiếp với account không thuộc policy 111.

- [x] Điều tra lỗi mã thành viên `111` vẫn không đăng nhập được: code/schema local đã sửa để bỏ unique và login theo mã+tên; execution test thật xác nhận hai account khác tên login/session 200, sai mật khẩu bị từ chối; dữ liệu QA đã dọn.

- [ ] Thiết kế và triển khai policy cho nhiều tài khoản dùng mã `111`: local schema/login/create, execution test hai account, Supabase cloud migration `20260817084111`, 55 tests/build và desktop menu QA đã đạt; còn cần mobile authenticated QA và non-111 browser QA.

- [x] Tạo hai tài khoản QA tạm thời khác tên dùng chung mã `111`, kiểm thử login độc lập/session và sai mật khẩu, rồi xóa sạch cả hai tài khoản cùng session/profile liên quan.
- [ ] Chạy browser QA mobile trong phiên đã đăng nhập bằng tài khoản mã `111`, chụp evidence sidebar/dashboard Trung tâm 111 ở authenticated state.
- [ ] Chạy browser QA trực tiếp với ít nhất một tài khoản không thuộc policy `111`, xác nhận menu/bảng điều khiển đặc biệt không hiển thị trong UI.

- [x] Export phiên bản hiện tại của dự án lên repository GitHub `yen0110122009-cell/gocnhocuaong2`, xác minh branch `webdev/gocnhocuaong-platform` và commit `faeaad5`.

- [ ] Điều tra và sửa lỗi âm thanh được người dùng báo; xác định module/luồng phát audio, thêm regression test và browser QA trước checkpoint.

- [x] Rà soát `study-quest-standalone.html`: lập bản đồ tính năng, đánh giá khoảng trống ý tưởng/UX và đề xuất roadmap ưu tiên trong `idea-review-report.md`.
