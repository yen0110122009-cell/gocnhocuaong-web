# GitHub Pages member-list live audit

Checked URL: https://yen0110122009-cell.github.io/gocnhocuaong2/

The live HTML currently references `/gocnhocuaong2/assets/index-B-xgSHNJ.js` and `/gocnhocuaong2/assets/index-C9YfHwpO.css`, confirming the GitHub Actions artifact uses the correct project base path. The live JavaScript contains the string `Danh sách thành viên`, so the Admin member-list UI code is present in the published bundle. The next required verification is an authenticated Admin session to capture the actual GET/PATCH response and error message; the current sandbox browser session is not logged into the user's Admin account.

## Browser QA 2026-08-18
URL: https://yen0110122009-cell.github.io/gocnhocuaong2/?v=member-create-qa-20260818

Phiên trình duyệt đang ở vai trò `Ong` / `Founder` và mở đúng Admin Panel → Thành viên. Khu vực hiển thị `0 tài khoản` và nút `Làm mới`. Sau khi bấm `Cấp mã tài khoản` với tên `1`, mã `1`, vai trò `Member`, giao diện hiển thị toast đỏ: `Unexpected token '<', "<html> <he"... is not valid JSON`. Console trước thao tác không có output. Đây là tái hiện trực tiếp, xác nhận đường tạo member đang gọi endpoint trả HTML thay vì cloud-state REST JSON.

## Browser QA after workflow 32147721622

- URL: https://yen0110122009-cell.github.io/gocnhocuaong2/?v=00af709-member-sync
- Commit: `00af7094a26f44291341b01125e55c8213cb48a6`
- Result: login page loads normally; no blank page; footer shows `Bản cập nhật member-sync.`; workflow build and deploy both succeeded.
- Authenticated Admin member-list/create verification remains required because this fresh browser view is not logged into the user's session.

## Authenticated Admin QA after workflow 32147721622

Phiên test đã đăng nhập thành công bằng tài khoản `BY`, mật khẩu test do người dùng cung cấp và mã `111`; dashboard xác nhận vai trò Founder. Trong Admin Panel, danh sách ban đầu có 3 tài khoản. Thao tác cấp tài khoản với tên `Tên 1`, mã nhập `Mã 1`, vai trò `Member` đã ghi thành công vào namespace `__gocnhocuaong` của Supabase app_state. Adapter chuẩn hóa mã thành chữ hoa nên bản ghi cloud là `MÃ 1`.

Sau khi bấm `Làm mới`, giao diện hiển thị `4 tài khoản` và hàng `Tên 1 — MÃ 1 — Member`. Truy vấn read-only trực tiếp Supabase cũng xác nhận bản ghi có id `5b89aef9-72c7-4948-b177-b2849e842404`, role `Member`, locked `false`, không có passwordHash ban đầu. Kết luận: luồng đăng nhập mã 111, cấp member và đồng bộ danh sách trên GitHub Pages đã pass; dữ liệu legacy `memberAccounts`/`membersList` không phải namespace mà cloud adapter mới sử dụng.

## QA bổ sung — 2026-08-18

- Phiên `BY / BYBYBY / 111` đã mở `Trung tâm 111`; giao diện hiển thị nhãn `Khu vực đặc biệt · Mã 111`, trạng thái `Mã 111 · Không giới hạn`, các lối tắt Ôn tập thông minh, Pomodoro, AI Studio và Thành tích.
- Sau khi đăng xuất, phiên Member `Tên 1 / QA1122 / MÃ 1` đăng nhập thành công; sidebar không hiển thị mục `Trung tâm 111` và màn hình tài khoản xác nhận vai trò `Member`.
- Màn hình Thành tích trong phiên Member hiển thị `0/900 đã mở`, bộ lọc trạng thái/độ khó, điều kiện từng mốc, tiến độ hiện tại/mục tiêu, số lượng còn thiếu và phần thưởng. Ví dụ mốc Khởi Đầu 1 hiển thị điều kiện 10 Flashcard, tiến độ 0/10, còn 10 đơn vị và phần thưởng 20 XP.
- QA mobile public login tại viewport 390x844: form Tên thành viên, Mật khẩu, Mã thành viên, liên kết trợ giúp và nút đăng nhập hiển thị vừa khung, không tràn ngang.
- Lưu ý: phiên browser hiện tại dùng viewport desktop; mobile authenticated dashboard và mobile authenticated Thành tích vẫn cần một phiên/thiết bị có khả năng thay đổi viewport để đóng mục QA tương ứng.

- Scroll QA trên màn hình Thành tích đã đi qua hai viewport liên tiếp ở phiên Member; các card ở vùng giữa xuất hiện với nội dung điều kiện, tiến độ, số còn thiếu và phần thưởng. Một số card đang chuyển hiệu ứng reveal tại mép viewport nhưng không có card trắng cố định hoặc lỗi layout.

- Console QA live ghi nhận `document.documentElement` có `scrollBehavior: smooth`, có 902 phần tử thuộc nhóm reveal trên màn hình Thành tích và 8 phần tử mẫu đang ở `opacity: 1` cùng transform identity sau khi vào viewport. Phiên hiện tại không bật `prefers-reduced-motion`; kiểm thử emulation của media query cần viewport/devtools có hỗ trợ emulation riêng.

## Achievement viewport QA — 2026-08-18

Live URL: https://yen0110122009-cell.github.io/gocnhocuaong2/?v=qa-achievements-viewports-20260818

Authenticated session: BY / Founder / mã 111. Desktop browser evidence xác nhận màn hình `Thành tích` tải ổn định với `900 thành tích · 9 bậc`, bộ lọc trạng thái/độ khó, progress tổng `0/900`, và các card khóa hiển thị đầy đủ điều kiện, phần thưởng, tiến độ hiện tại/mục tiêu, phần trăm và số đơn vị còn thiếu. Ví dụ card #1 hiển thị `Đạt 10 Flashcard đã nhớ`, `Tiến độ: 0/10`, `0%`, còn `10` đơn vị.

Live desktop screenshot: `/home/ubuntu/screenshots/yen0110122009-cell_g_2026-08-18_14-50-03_1971.webp`. Mobile login/dashboard shell ở viewport 390x844 đã được QA trước đó; mobile-specific Achievement viewport vẫn cần xác nhận riêng bằng emulation trước khi đóng mục TODO tương ứng.

## QA mascot Lumi/Ong — 2026-08-18

Đã xác nhận mapping theo ảnh người dùng: Lumi là nhân vật nữ đeo kính, tóc nâu, kẹp sao vàng; Ong là nhân vật nữ mặc áo đỏ với kẹp tóc hình ngọn lửa đỏ-xanh. Home.tsx hiện render hai component riêng `LumiMascot` và `OngMascot` ở hero desktop và header mobile, có alt text/aria-label và kích thước responsive.

Đã thay crop có nguy cơ dính chữ bằng hai asset mascot sạch qua reserved webdev URLs: `/manus-storage/lumi-mascot-clean_28a6da68.png` và `/manus-storage/ong-mascot-clean_079128db.png`. QA mobile 390x844 xác nhận cả hai nhãn Lumi/Ong xuất hiện cạnh brand và không làm tràn form. TypeScript, 2 regression files/5 tests mục tiêu và production build đều đạt.

Ghi chú: asset generated mới được hệ thống thay thế tự động từ placeholder khi hoàn tất generation; chưa tự publish GitHub Pages trong bước này.
