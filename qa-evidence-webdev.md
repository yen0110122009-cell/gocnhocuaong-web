# QA evidence — gocnhocuaong-web

## 2026-08-17 — Public landing/login smoke

Website dev tải thành công tại `https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/` với tiêu đề **GÓC HỌC TẬP CỦA ONG**. Landing page hiển thị branding, tagline “Hành trình tri thức”, thông điệp học tập và form Study Account gồm tên thành viên, mật khẩu, mã thành viên.

Khi nhấn nút đăng nhập với trường bắt buộc còn trống, trình duyệt hiển thị validation native “Please fill out this field.”, chứng minh form không gửi dữ liệu thiếu.

Console trình duyệt không có output lỗi sau khi server khởi động lại. Screenshot desktop đã được chụp tại `/home/ubuntu/screenshots/webdev-preview-root-1786938025540150472-7919.png` và browser capture tại `/home/ubuntu/screenshots/3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer_2026-08-17_03-51-49_5828.webp`.

## Giới hạn kiểm thử hiện tại

Các màn hình sau đăng nhập chưa thể mở từ browser smoke vì database chưa có tài khoản Study Account seed để đăng nhập. Cần tạo tài khoản Founder/Admin được kiểm soát hoặc cung cấp session QA trước khi xác nhận trực tiếp Dashboard, Catalog, Museum, AI Studio, Pomodoro và Admin Panel.

## Founder QA session và Catalog

Đã tạo phiên Founder QA tạm thời bằng cơ chế bootstrap code `111` với tên QA không chứa dữ liệu cá nhân. Dashboard tải thành công và hiển thị lời chào, vai trò Founder, XP, thời gian học, Flashcard, đề hoàn thành, mảnh ghép và tiến trình hôm nay.

Màn hình **Thành tích** tải trực tiếp sau đăng nhập. UI xác nhận `900 thành tích · 9 bậc`, `0/900 đã mở · 400 danh hiệu`, bộ lọc trạng thái, độ khó, checkbox danh hiệu/mảnh ghép, và dòng `Đang hiển thị 900/900 mục · 400 danh hiệu trong bộ lọc`. Các card thành tích hiển thị trạng thái khóa, độ khó và phần thưởng XP/mảnh ghép.

## Museum Journey và AI Studio

Màn hình **Bảo tàng hành trình** tải trực tiếp và hiển thị trạng thái không có dữ liệu nhân vật mẫu, đồng thời trình bày rõ quy tắc mảnh ghép, các nguồn phần thưởng từ Flashcard, đề kiểm tra, Pomodoro, thành tích, chuỗi học tập và mục tiêu học tập. Điều này phù hợp nguyên tắc không bịa dữ liệu nhân vật.

Màn hình **AI Studio** tải trực tiếp với ba chế độ Flashcard/Đề kiểm tra/Cả hai, các trường tên bộ, môn học, mục đích, chủ đề, lớp, mức độ, yêu cầu, tài liệu, upload TXT/MD/PDF, prompt chuẩn và vùng nhập JSON kết quả AI. Luồng UI có nút tạo prompt, sao chép prompt, tạo từ tài liệu và tạo Flashcard.

## Pomodoro và Admin Panel

Màn hình **Pomodoro** tải thành công với timer 25:00, trạng thái phiên 1/4, nút bắt đầu/tạm dừng/đặt lại, loại hoạt động học, môn học/nội dung, preset 10/15/25/45/50 phút, audio center, âm lượng nền/âm báo, thống kê 7 ngày và lịch sử phiên.

Màn hình **Admin Panel** tải thành công với tab Thành viên/Nhân vật/Vòng quay. Founder QA nhìn thấy danh sách 1 tài khoản, điều khiển vai trò, khóa, reset mật khẩu, xóa tài khoản; form cấp mã thành viên; lời động viên; mốc thành tích tùy chỉnh; cấu hình vé quay/phần thưởng; và các vùng biên tập trực tiếp nội dung.

## Catalog QA chi tiết

Founder QA mở **Thành tích** và quan sát thấy tiêu đề `900 thành tích · 9 bậc`, trạng thái `0/900 đã mở · 400 danh hiệu`, cùng dòng `Đang hiển thị 900/900 mục · 400 danh hiệu trong bộ lọc`. Các điều khiển hiển thị gồm tìm kiếm, lọc trạng thái, lọc độ khó và checkbox `Có danh hiệu`/`Có mảnh ghép`.

Khi nhập từ khóa `Bậc 1`, kết quả chuyển về `0/900 mục`; khi đổi sang `Khởi Đầu`, kết quả chuyển về `100/900 mục`. Chọn độ khó `Dễ` giữ kết quả 100 mục và cập nhật select hiển thị `Dễ`. Các card hiển thị khóa trạng thái, bậc, tên, độ khó, trạng thái mở khóa, XP và phần thưởng mảnh ghép. Đây là bằng chứng trực tiếp cho search/filter/progress UI.

## Museum Journey QA

Founder QA mở `Bảo tàng hành trình`. Màn hình hiển thị empty state rõ ràng: `Chưa có dữ liệu nhân vật`, yêu cầu Admin/Founder thêm nội dung lịch sử đã xác minh và nguồn trích dẫn. Phần `Cách nhận mảnh ghép` hiển thị số dư `0 mảnh đang giữ` và các mốc cho Flashcard, Đề kiểm tra, Pomodoro, Thành tích, chuỗi học, mục tiêu học, ôn lỗi, vòng quay và phần thưởng sự kiện.

## AI Studio QA

Founder QA mở `AI Studio`. Màn hình có tab Flashcard/Đề kiểm tra/Cả hai; các trường tên bộ/đề, môn học, mục đích, chủ đề, lớp, mức độ, yêu cầu chi tiết, tài liệu; file input TXT/MD/PDF; prompt chuẩn có thể chỉnh sửa; các hành động `Tạo lại prompt`, `Sao chép prompt`, `Tạo từ tài liệu` và vùng JSON để tạo Flashcard. Đây là bằng chứng trực tiếp cho cấu trúc upload/prompt/JSON workflow; chưa gửi mutation tạo dữ liệu để tránh tạo dữ liệu QA không cần thiết.

## Pomodoro QA

Founder QA mở `Pomodoro`. Màn hình hiển thị timer `25:00`, phiên 1/4, nút `Bắt đầu tập trung`, `Đặt lại`, nhóm hoạt động học, trường môn học/nội dung, preset Nhanh 10 phút / 15 phút 15/5 / Pomodoro 25/5 / Học sâu 45/10 / Tập trung dài 50/10, Audio Center với lựa chọn âm thanh, nút nghe thử và hai thanh âm lượng. Lịch sử tập trung đang ở empty state với tổng 0 phiên.

## Admin Panel QA

Founder QA mở `Admin Panel`. Màn hình hiển thị tab Thành viên/Nhân vật/Vòng quay; form cấp mã tài khoản có tên, mã, vai trò Member/Admin/Founder; danh sách thành viên; lời động viên; mốc thành tích tùy chỉnh; cấu hình phần thưởng có vé quay, loại, giá trị, trọng số, màu; cùng các vùng biên tập trực tiếp cho nội dung. Danh sách hiện tại hiển thị tài khoản QA và các empty states cho nội dung chưa cấu hình. Chưa gửi mutation tạo dữ liệu admin để tránh làm bẩn dữ liệu cloud bằng nội dung QA.

## Museum non-empty QA

Founder QA dùng Admin Panel → Nhân vật để tạo hồ sơ có kiểm chứng cho **Trưng Trắc**. Mutation trả toast `Đã lưu nhân vật và nguồn tư liệu`; hồ sơ hiển thị `12 mảnh · Có nguồn`, nguồn Encyclopaedia Britannica, URL nguồn tư liệu, nguồn ảnh Wikimedia Commons và timeline JSON gồm hai mốc. Mở Bảo tàng Hành trình cho thấy nhân vật Trưng Trắc ở non-empty state, bộ sưu tập hiển thị `0/12 mảnh ghép · Đang sở hữu`, trạng thái `Nhân vật chưa mở khóa`, bộ lọc/search và liên kết nguồn đều hoạt động.

Sources used in QA data: https://www.britannica.com/biography/Trung-Sisters and https://commons.wikimedia.org/wiki/Category:Tr%C6%B0ng_Sisters

## 2026-08-17 — Final webdev verification snapshot

Sau khi mở rộng Vitest discovery cho cả server và client, project đạt **20 test files / 51 tests passed**, gồm Auth, permissions, catalog 900/400, Piece Ledger, study router, Supabase smoke, AI Import, Museum, Catalog UI, Pomodoro/Admin contracts và các test UI hiện có. `pnpm check` và `pnpm build` cũng đạt; build chỉ còn warning không chặn runtime về asset `/manus-storage/study-historia-bee-mascot_45260784.png` được giữ nguyên để resolve ở runtime và chunk JS lớn.

Catalog đã có progress bar trực quan có `aria-label="Tiến trình mở khóa thành tích"`, max 100 và tổng số 900 thành tích/400 danh hiệu. Website đã được push lên branch `webdev/gocnhocuaong-platform` của repository GitHub `yen0110122009-cell/gocnhocuaong2`, commit `005f84770d3f61344e14d293c2139387c6d02be9`.

Các mutation AI/Pomodoro/Admin được bảo vệ bằng contract tests và callback persistence. Browser QA trước đó chủ động không tạo thêm dữ liệu cloud cho các mutation này ngoài hồ sơ Trưng Trắc đã kiểm chứng, để tránh làm bẩn dữ liệu tài khoản QA.

## Catalog progress bar — post-restart browser evidence

Sau khi restart dev server, phiên Founder QA vẫn authenticated. Mở tab **Thành tích** trực tiếp cho thấy progress bar có nhãn `Tiến trình mở khóa`, dòng `0/900 thành tích · 400/400 danh hiệu có sẵn`, giá trị `0%`, thanh nền trực quan, cùng `Đang hiển thị 900/900 mục · 400 danh hiệu trong bộ lọc`. Đây là evidence sau thay đổi `Home.tsx`, tách biệt với search/filter evidence trước đó. Browser capture: `/home/ubuntu/screenshots/3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer_2026-08-17_04-09-19_7170.webp`.

## E2E QA bổ sung sau final verification

AI Studio đã đi qua mutation thực tế với metadata và JSON hợp lệ, tạo thành công bộ `QA Ôn tập Lịch sử Việt Nam` gồm 2 Flashcard; sau mutation, màn hình Flashcard hiển thị bộ, số thẻ, câu hỏi đầu tiên và các thao tác lật thẻ/đánh dấu.

Pomodoro đã chọn preset Nhanh 10 phút và bắt đầu phiên; UI chuyển sang `Tạm dừng`/`Kết thúc phiên` với đồng hồ giảm từ 10:00 xuống 09:59. Browser session timeout xảy ra khi thao tác kết thúc, vì vậy persistence của phiên hoàn thành vẫn được giữ là hạng mục cần kiểm tra thêm.

## Login fix — 2026-08-17

Tái hiện lỗi cho thấy request sai path `study.login` trả `NOT_FOUND`; procedure đúng trong appRouter là `study.auth.login`. Đồng thời `studyStore.ts` thiếu import `eq`, `and`, `gt` từ `drizzle-orm`, làm mutation login lỗi runtime khi được gọi đúng path. Sau khi bổ sung import, request `study.auth.login` với Founder QA `Lumi QA` / mã `111` trả HTTP 200 và token; request tiếp theo tới `study.auth.session` bằng token trả HTTP 200, nhận đúng tài khoản role Founder, `locked: false` và session còn hạn. `pnpm check`, build và Vitest đạt sau bản sửa. Browser UI retry end-to-end chưa được ghi nhận trong phiên này.

## Browser login retry — 2026-08-17

Sau bản sửa import Drizzle, browser live preview đã đăng nhập thành công bằng `Lumi QA` / `LumiQA2026!` / `111`. UI chuyển khỏi form login vào dashboard, hiển thị `Chào mừng Lumi QA`, role `Founder`, sidebar các module học tập/Admin Panel, XP 0 và tiến trình hôm nay 0%. Đây là bằng chứng end-to-end cho form login, session bootstrap và quyền truy cập dashboard.
