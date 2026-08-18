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

- [ ] Điều tra và sửa lỗi âm thanh được người dùng báo; Web Audio preview, volume scaling, stop preview và Pomodoro alert đã được triển khai cùng regression test/build, còn xác nhận âm thanh thực tế trên thiết bị người dùng.

- [x] Rà soát `study-quest-standalone.html`: lập bản đồ tính năng, đánh giá khoảng trống ý tưởng/UX và đề xuất roadmap ưu tiên trong `idea-review-report.md`.

- [ ] Tạo tài khoản QA mã `112` theo xác nhận người dùng, kiểm tra browser account không thuộc policy `111`, sau đó xóa sạch tài khoản và dữ liệu liên quan.

- [ ] Cập nhật tài khoản `102` mã `102` về vai trò Admin theo yêu cầu người dùng, đăng nhập QA và xác nhận không hiển thị Trung tâm 111.

- [ ] Sửa quyền Admin Panel để Founder được xóa Founder khác khi không phải tài khoản hệ thống, giữ bảo vệ tài khoản owner/system và thêm regression test + QA; backend/UI đã sửa, regression đạt 57 tests, TypeScript và production build đạt, còn browser QA xóa thật cần xác nhận đúng tài khoản mục tiêu.
- [x] Điều tra và khắc phục GitHub Pages trả về lỗi không tìm thấy `index.html` khi truy cập URL site; branch `main` đã có `index.html`, Pages build trạng thái `built` và browser xác nhận URL hiển thị frontend.
- [x] Tạo bản frontend tĩnh cho GitHub Pages và ghi rõ các chức năng backend không thể chạy trên Pages trong `github-pages-qa.md`; Pages hiện publish thành công từ branch `main` theo chế độ legacy.
- [ ] Bật nguồn Pages kiểu GitHub Actions trong Settings và xác minh workflow deploy chạy end-to-end; hiện quyền API không cho phép đổi cấu hình Pages tự động, còn bản legacy đã hoạt động.
- [x] Khắc phục lỗi truy cập `localhost` bị `ERR_CONNECTION_REFUSED` bằng cách restart dev server; preview hiện chạy tại `https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/` và browser đã xác nhận tải trang.
- [x] Khắc phục lỗi bản GitHub Pages phân tích phản hồi HTML `Unexpected token '<'` như JSON khi không có backend API; tắt query backend trên hostname `github.io`, bỏ qua session cũ, hiển thị cảnh báo static-host, sửa base path asset và browser QA đã đạt với commit Pages `bba0f52`.
- [x] Chuyển luồng đăng nhập trực tiếp trên bản GitHub Pages sang Supabase Auth/Data API theo phương án 2B; adapter cloud-state app_state không email, RLS và browser QA form đã hoàn tất; live login thành công với tài khoản thật vẫn cần người dùng xác nhận.
- [x] Thêm hiệu ứng cuộn trang mượt mà bằng IntersectionObserver, tối ưu responsive mobile, thêm hỗ trợ `prefers-reduced-motion`; code/build/test và contract CSS đã đạt, browser QA trực tiếp vẫn được tách riêng bên dưới.
- [ ] Browser QA trực tiếp scroll reveal trên màn hình có nhiều section, xác nhận không nhấp nháy hoặc để nội dung trắng.
- [ ] Browser QA `prefers-reduced-motion`, xác nhận animation và smooth scroll được giảm/tắt đúng.
- [ ] Browser QA mobile cho login và dashboard/auth shell; login public ở viewport 390x844 đã đạt, còn dashboard/authenticated shell, header/search/menu cần phiên đăng nhập người dùng.
- [ ] Đối chiếu file mẫu `12.html` và sửa luồng đăng nhập hiện tại theo cách đăng nhập đã được xác minh; đã thêm nút xem mật khẩu, hướng dẫn mã `111`, placeholder rõ ràng và đạt TypeScript/59 tests, còn live login cần xác nhận với tên + mật khẩu >=6 ký tự + mã.
- [x] Xác minh lại kết nối Supabase của `12.html` và đối chiếu với app hiện tại, đặc biệt Auth, RLS, redirect URL và cách gọi REST/API trên GitHub Pages; xác nhận `app_state` cho phép anon SELECT/INSERT/UPDATE và auth không email nằm trong state cloud-sync.
- [x] Triển khai bản GitHub Pages demo theo mô hình B: login Tên + Mật khẩu + Mã thành viên, đồng bộ state qua Supabase `app_state`, không dùng service-role key; hiển thị cảnh báo dữ liệu không phù hợp cho thông tin nhạy cảm.
- [x] Đổi bản đăng nhập GitHub Pages từ Supabase email/password sang luồng không email: Tên + Mật khẩu + Mã thành viên; người dùng đã xác nhận dùng full-stack preview cho auth, GitHub Pages chỉ làm bản tĩnh; giữ an toàn hash/password và không đưa secret backend lên frontend.
- [x] Cập nhật thông báo và liên kết giữa GitHub Pages/full-stack để người dùng không nhầm bản tĩnh có thể đăng nhập không email; commit Pages `4ef9e93`, Pages status `built`, browser xác nhận nút `Mở bản full-stack để đăng nhập`.

- [x] Implement Supabase REST app_state cloud-state adapter for GitHub Pages no-email auth
- [x] Connect GitHub Pages login, registration, session restore, profile/config persistence to app_state adapter
- [x] Verify Supabase app_state RLS and run cloud integration checks
- [x] Run browser QA on GitHub Pages for Name + Password + Code login without redirect; URL cache-busted xác nhận form cloud-state, không còn register tab và không redirect; submit QA không hợp lệ giữ nguyên URL Pages.
- [x] Publish updated static artifact to GitHub Pages legacy branch main commit b111191; Pages API status built và browser xác nhận bundle cloud-state mới.
- [x] Remove misleading GitHub Pages registration tab or implement only the supported code 111 first-login creation path
- [x] Add direct Supabase app_state INSERT/RLS verification evidence for the empty-row path

- [x] Add basic member dashboard after successful login with greeting and member information
- [x] Add login button loading state and clear red invalid-login error message
- [x] Add Forgot password and Forgot member code links with admin-contact guidance popup
- [x] Add regression tests for the new auth/dashboard flow and public mobile QA; authenticated browser shell QA remains pending a test account/code

- [x] Audit configuration and runtime behavior for the four learning challenge/reward cards shown on the dashboard; `getFragmentWays(AppConfig)` now derives runtime state
- [x] Configure missing challenge/reward thresholds or clearly mark unsupported items as pending configuration; pending cards now expose explicit Admin/Founder guidance
- [x] Add regression coverage for challenge/reward configuration and verify the dashboard display; 30 files/84 tests pass

- [x] Show explicit unlock requirements for every achievement
- [x] Calculate and display current achievement progress percentage, current value, target, and remaining amount
- [x] Update achievement list UI with progress bars, condition text and actionable next-step text
- [x] Add achievement progress regression tests
- [ ] Run browser QA on Achievements screen at desktop and mobile, verifying locked/unlocked states, condition text, progress percentage, current/target and remaining amount

- [x] Add clearly labeled starter achievement/reward configuration examples without fabricating user-earned progress
- [x] Add Admin/Founder controls to create, edit, enable/disable and delete achievement milestones
- [x] Add Admin/Founder controls to create, edit, enable/disable and delete wheel rewards
- [x] Add regression tests for starter config integrity and admin-only mutation behavior

- [x] Add edit/update and save/cancel flow for existing custom achievement milestones
- [x] Add edit/update and enable/disable controls for existing wheel rewards
- [x] Add runtime regression tests proving non-admin access is denied and Admin/Founder config mutations are allowed

- [x] Add a real Admin milestone edit UI with explicit save/cancel controls and full-field editing for existing custom achievements
- [x] Add runtime/UI regression tests that verify Members cannot access or use config controls, while Admin/Founder can perform achievement and wheel reward config mutations through the actual component flow

- [x] Add render test mounting Admin config UI with Member and verify controls are blocked
- [x] Add render tests for Admin and Founder showing config controls
- [x] Add executable mutation-flow tests for achievement and wheel reward create/edit/toggle/delete behavior

- [x] Diagnose the reported Unexpected token '<' response and identify the exact non-JSON request path: cloud-state REST parsing had no content-type/body guard, so an HTML response surfaced as a raw JSON SyntaxError
- [x] Add defensive response parsing and environment-specific error handling for HTML-as-JSON responses
- [x] Add regression coverage for the repaired request path, push the repaired artifact to Pages legacy branch `main` at commit `535d89c`, and verify browser now serves `assets/index-CVazIDuF.js` with the no-email cloud-state form

- [x] Reproduce and diagnose the reported deployed GitHub Pages error at https://yen0110122009-cell.github.io/gocnhocuaong2/
- [x] Verify the deployed HTML and JavaScript asset hashes match the repaired cloud-state parser after base-path correction commit `220a095`; evidence is in `github-pages-base-qa.md`
- [x] Browser-verify corrected base-path artifact commit `220a095`; login renders and invalid QA submit returns a clear red account-code error without HTML-as-JSON failure

- [x] Reproduce the recurring HTML-as-JSON error from the user's current device report after the previous deployed fix
- [x] Audit every JSON response parser and runtime endpoint fallback, including non-cloud-state requests; the remaining path was `useAuth` calling relative tRPC `auth.me` on github.io
- [x] Add regression test for remaining HTML response path and redeploy corrected Pages artifacts on `main` commits `fad88a5` and `220a095`; browser verification is recorded in `github-pages-base-qa.md`
