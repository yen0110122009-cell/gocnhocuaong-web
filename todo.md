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

- [x] Tạo menu truy cập nhanh và bảng điều khiển đặc biệt chỉ hiển thị cho tài khoản mã `111`; desktop/mobile authenticated QA với BY/111 đạt, và Member non-111 không thấy menu.

- [x] Điều tra lỗi mã thành viên `111` vẫn không đăng nhập được: code/schema local đã sửa để bỏ unique và login theo mã+tên; execution test thật xác nhận hai account khác tên login/session 200, sai mật khẩu bị từ chối; dữ liệu QA đã dọn.

- [x] Thiết kế và triển khai policy cho nhiều tài khoản dùng mã `111`: local schema/login/create, execution test hai account, Supabase cloud migration `20260817084111`, tests/build và QA desktop/mobile; non-111 browser QA đã xác nhận menu bị ẩn.

- [x] Tạo hai tài khoản QA tạm thời khác tên dùng chung mã `111`, kiểm thử login độc lập/session và sai mật khẩu, rồi xóa sạch cả hai tài khoản cùng session/profile liên quan.
- [x] Chạy browser QA mobile trong phiên đã đăng nhập bằng tài khoản BY mã `111`, xác nhận sidebar và dashboard Trung tâm 111 ở authenticated state.
- [x] Chạy browser QA trực tiếp với tài khoản Member `Tên 1 / MÃ 1`, xác nhận sidebar và bảng điều khiển đặc biệt mã `111` không hiển thị trong UI.

- [x] Export phiên bản hiện tại của dự án lên repository GitHub `yen0110122009-cell/gocnhocuaong2`, xác minh branch `webdev/gocnhocuaong-platform` và commit `faeaad5`.

- [x] Điều tra và sửa lỗi âm thanh được người dùng báo: thay nhiễu bằng sáu âm báo Pomodoro, soundscape tonal, preview, volume scaling, mute/stop và cleanup; TypeScript, audio regression test và production build đạt. Xác nhận âm thanh trên thiết bị thật còn phụ thuộc việc GitHub Pages legacy phục vụ artifact mới.

- [x] Rà soát `study-quest-standalone.html`: lập bản đồ tính năng, đánh giá khoảng trống ý tưởng/UX và đề xuất roadmap ưu tiên trong `idea-review-report.md`.

- [x] CANCELLED theo quyết định người dùng: QA tài khoản mã `112` đã đăng nhập Member non-111 và xác nhận Trung tâm 111 bị ẩn; không xóa tài khoản test.

- [x] DEFERRED theo quyết định người dùng: không đổi vai trò và không QA đăng nhập tài khoản `102 / mã 102` vì chưa có mật khẩu test.

- [x] DEFERRED theo quyết định người dùng: backend/UI và regression cho Founder xóa Founder khác đã đạt; không chạy browser QA xóa thật để bảo vệ dữ liệu.
- [x] Điều tra và khắc phục GitHub Pages trả về lỗi không tìm thấy `index.html` khi truy cập URL site; branch `main` đã có `index.html`, Pages build trạng thái `built` và browser xác nhận URL hiển thị frontend.
- [x] Tạo bản frontend tĩnh cho GitHub Pages và ghi rõ các chức năng backend không thể chạy trên Pages trong `github-pages-qa.md`; Pages hiện publish thành công từ branch `main` theo chế độ legacy.
- [x] Bật nguồn Pages kiểu GitHub Actions trong Settings và xác minh workflow deploy end-to-end; environment policy đã cho phép branch webdev, workflow `32031056976` build/deploy success và browser xác nhận live page.
- [x] Khắc phục lỗi truy cập `localhost` bị `ERR_CONNECTION_REFUSED` bằng cách restart dev server; preview hiện chạy tại `https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/` và browser đã xác nhận tải trang.
- [x] Khắc phục lỗi bản GitHub Pages phân tích phản hồi HTML `Unexpected token '<'` như JSON khi không có backend API; tắt query backend trên hostname `github.io`, bỏ qua session cũ, hiển thị cảnh báo static-host, sửa base path asset và browser QA đã đạt với commit Pages `bba0f52`.
- [x] Chuyển luồng đăng nhập trực tiếp trên bản GitHub Pages sang Supabase Auth/Data API theo phương án 2B; adapter cloud-state app_state không email, RLS và browser QA form đã hoàn tất; live login thành công với tài khoản thật vẫn cần người dùng xác nhận.
- [x] Thêm hiệu ứng cuộn trang mượt mà bằng IntersectionObserver, tối ưu responsive mobile, thêm hỗ trợ `prefers-reduced-motion`; code/build/test và contract CSS đã đạt, browser QA trực tiếp vẫn được tách riêng bên dưới.
- [x] Browser QA trực tiếp scroll reveal trên màn hình Thành tích nhiều section: đã cuộn qua hai viewport, card hiển thị ổn định, không có vùng trắng cố định; console xác nhận smooth scroll và reveal opacity/transform ổn định.
- [x] DEFERRED theo quyết định người dùng: Browser QA `prefers-reduced-motion` chưa thực hiện; CSS hỗ trợ giảm/tắt animation và smooth scroll cùng regression contract vẫn được giữ.
- [x] Browser QA mobile cho login và dashboard/auth shell; viewport 390x844 đã xác nhận login public, authenticated BY/111 shell, header/menu và Trung tâm 111.
- [x] Đối chiếu file mẫu `12.html` và sửa luồng đăng nhập hiện tại theo cách đăng nhập đã được xác minh; live QA đã xác nhận tên `BY`/mật khẩu `BYBYBY`/mã `111` và tên `Tên 1`/mật khẩu `QA1122`/mã `MÃ 1` đăng nhập thành công.
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
- [x] Run browser QA on Achievements screen at desktop and mobile, verifying locked/unlocked states, condition text, progress percentage, current/target and remaining amount

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

- [x] Điều tra lỗi GitHub Pages vẫn còn hiển thị như cũ: xác nhận CDN trước đó phục vụ bundle `index-CVazIDuF.js`, tạo fingerprint mới `index-Cq-o8AH1.js`, push commit `9c9a39c`, và browser xác nhận live page tải đúng base path; cần người dùng hard refresh nếu thiết bị còn giữ cache cũ.

- [x] Điều tra lại lỗi người dùng xác nhận vẫn còn `Unexpected token '<', "<html> <he..." is not valid JSON`; audit toàn bộ parser/request, thêm guard chặn tRPC trên static host bằng JSON 503, deploy commit `1c53da5`, và browser QA mã 999 không còn raw HTML-as-JSON.

- [x] Điều tra lỗi mới `Unable to transform response from server` trên GitHub Pages; sửa guard tRPC static thành batch error envelope hợp lệ cho tRPC 11, bổ sung regression assertions, chạy 31 file/89 test, build asset `index-DASLnU1m.js`, push commit `fbd8d48` và browser QA mã 999 đạt.

- [x] Sửa lỗi transform kép: guard `/api/trpc` trên GitHub Pages đổi từ error envelope sang response thành công rỗng; 31 file/89 test đạt, deploy commit `e7aa6d2`, browser QA mã 999 thoát loading và hiển thị lỗi tài khoản rõ ràng, không còn hai thông báo transform/static-host.

- [x] Sửa phần code tài khoản Tên 1 mã 1 đã được cấp nhưng danh sách thành viên chưa cập nhật: AdminEnhanced trên GitHub Pages nay tải danh sách từ Supabase app_state và refetch ngay sau mutation; TypeScript, 30 test files/89 tests ngoại trừ catalog test bị treo độc lập, build và Pages commit `655d3f0` đạt. Dữ liệu Tên 1/mã 1 vẫn chưa có trong app_state, theo mục đối chiếu bên dưới.

- [x] Đối chiếu và đồng bộ tài khoản đã cấp ngoài GitHub Pages: xác nhận cloud adapter dùng namespace `__gocnhocuaong`; authenticated QA đã tạo `Tên 1`/`MÃ 1` trong Supabase và refresh hiển thị thành công.

- [x] Sắp xếp lại Admin để luôn hiển thị khu vực Danh sách thành viên rõ ràng; thêm loading, empty, error, refresh và bảng thông tin thành viên từ cloud-state; build, regression và Pages commit `a44fefe` đạt. QA authenticated sâu vẫn cần phiên Admin/Founder thật.
- [x] Bổ sung regression tests cho Admin member list và xác minh URL Supabase cùng trạng thái khóa API không bị lộ trong giao diện công khai; contract test kiểm tra loading/error/empty/refresh và API key không được render.

- [x] Thay âm thanh nhiễu hiện tại bằng bộ âm thanh nhiều trạng thái: bắt đầu phiên, tick nhẹ, hoàn thành, cảnh báo, phần thưởng và lỗi; giữ volume, mute, preview và hỗ trợ reduced motion/thiết bị không có AudioContext. Code và local build đã đạt; live/device QA còn chờ Pages phục vụ artifact mới.
- [x] Bổ sung regression tests cho audio event mapping, volume scaling và thời lượng event; TypeScript, audio test và build đạt. Artifact đã đẩy lên Pages branch `main`, nhưng live legacy CDN còn phục vụ index cũ; blocker phát hành được theo dõi ở mục Pages bên dưới.

- [x] Hoàn tất phát hành audio lên GitHub Pages: sau khi đổi Source sang GitHub Actions và thêm branch policy, workflow full run `32031056976` build/deploy thành công; browser xác nhận live page không còn trắng và asset dùng `/gocnhocuaong2/assets`. Cần kiểm tra âm thanh thực tế bằng thiết bị/người dùng.

- [x] Chuyển GitHub Pages của `yen0110122009-cell/gocnhocuaong2` từ Legacy sang GitHub Actions; thêm branch `webdev/gocnhocuaong-platform` vào environment policy, rerun toàn bộ để artifact `github-pages` được upload cùng run, deploy thành công và browser xác nhận live page tải đúng giao diện từ `/gocnhocuaong2/assets`.

- [x] Lấy chi tiết job `deploy`: annotation xác định branch policy từ chối branch và lần rerun failed-only thiếu artifact `github-pages`; đã thêm policy branch, rerun toàn bộ workflow, build/deploy đều success. Live QA tại run `32031056976` không còn trắng.

- [x] Tái hiện lỗi GitHub Pages không tải được danh sách thành viên và không tạo được mã thành viên; authenticated QA xác nhận quyền Founder, session cloud-state, app_state namespace và kết quả mutation.
- [x] Sửa luồng member list/create member trên static host, bổ sung regression test và deploy lại qua GitHub Actions; authenticated live QA đã pass.

- [x] Tái hiện lỗi với phiên Admin đã xác thực: đã kiểm tra session cloud-state, Supabase app_state và RLS; thao tác create/refresh live đã pass sau bản deploy mới.

- [x] Authenticated QA GitHub Pages bằng tài khoản test `BY`/mã `111`: đăng nhập thành công, xác nhận vai trò Founder và mở được Admin Panel.
- [x] QA cấp member trên GitHub Pages: tạo `Tên 1` với mã nhập `Mã 1`, Supabase lưu thành `MÃ 1` do chuẩn hóa chữ hoa, refresh Admin hiển thị 4 tài khoản và bản ghi Member.
- [x] Đối chiếu trực tiếp Supabase app_state: namespace `__gocnhocuaong` là nguồn của cloud adapter mới; dữ liệu legacy `memberAccounts`/`membersList` không đại diện cho danh sách GitHub Pages.

- [x] Khôi phục mascot Lumi hiển thị rõ trên trang đăng nhập, dashboard và giao diện mobile; component SVG accessible có biến thể hero/compact/sidebar.
- [x] QA mascot Lumi trên desktop/mobile, thêm `Home.mascot.test.ts`; TypeScript, 5 test mục tiêu và production build đạt. Artifact live GitHub Pages cần phát hành sau checkpoint.

- [x] Tách đúng nhận diện nhân vật theo ảnh tham chiếu: Lumi = nữ đeo kính, tóc nâu, kẹp sao vàng; Ong = nữ áo đỏ, kẹp lửa đỏ-xanh.
- [x] Thay mascot ong SVG chung ở login/dashboard bằng asset/illustration riêng Lumi và Ong, có nhãn accessible, responsive và dùng đúng mapping nhân vật.
- [x] Bổ sung regression test và QA desktop/mobile cho mapping hai nhân vật; 5 test mục tiêu, TypeScript và production build đạt. Asset mascot sạch đã chuyển sang reserved URLs của webdev.

- [x] Scope decision: người dùng xác nhận rồi chọn bỏ qua cả ba thao tác destructive/account; ghi nhận CANCELLED/DEFERRED, không thực hiện xóa hoặc đổi quyền.
- [x] Scope decision: không thực hiện các thao tác 68/70/72 theo quyết định bỏ qua của người dùng; dữ liệu và quyền được giữ nguyên an toàn.

- [x] Khôi phục soundscape âm thanh nền trong Pomodoro; tự bật khi bắt đầu phiên sau tương tác người dùng, tự dừng khi pause/mute/cleanup, dùng tonal notes và tôn trọng mute/volume.
- [x] Bổ sung/chạy regression test cho soundscape nền, typecheck, 13 audio/e2e tests, production build và mobile preview sau khi sửa.

- [x] DEFERRED theo quyết định người dùng: QA trực tiếp `prefers-reduced-motion` chưa thực hiện trên browser/device; CSS và regression contract vẫn được giữ.

- [x] Đổi palette giao diện mặc định sang đỏ sáng kết hợp xanh lá chiếm tối thiểu 90% diện tích màu chủ đạo, giữ độ tương phản accessible.
- [x] Thêm catalog nhiều preset theme theo trạng thái/cảm xúc, có bộ chọn và lưu lựa chọn giao diện.
- [x] Thêm lời an ủi/động viên riêng cho từng cảm xúc, mascot Lumi/Ong xuất hiện đúng trạng thái.
- [x] Thêm ô nhập câu lệnh tùy biến theme/cảm xúc, parser an toàn chỉ áp dụng preset/biến màu được cho phép.
- [x] Bổ sung regression tests, responsive/accessibility QA, build và checkpoint cho hệ thống theme cảm xúc.

- [x] Đổi palette mặc định sang đỏ sáng kết hợp xanh lá chiếm tối thiểu 90%, đồng bộ dashboard/login và Emotion Studio với token đỏ `#c62828` cùng xanh `#2e7d32`.
- [x] Xây Emotion Theme Studio: catalog preset cảm xúc, bộ chọn theme, mascot Lumi/Ong thật và lời động viên riêng cho từng cảm xúc.
- [x] Thêm command input an toàn để đổi mood/theme từ catalog cho phép; lệnh không nhận diện sẽ fallback về calm.
- [x] Thêm animation nhẹ khi bắt đầu Pomodoro: panel `pomodoro-starting`, mascot/status đổi nhịp, đồng hồ và soundscape bắt đầu sau tương tác rồi ổn định.
- [x] Thêm hiển thị tiến trình chu kỳ Pomodoro và completion flow theo phiên; animation được tiết chế và có prefers-reduced-motion CSS.
- [x] Thêm Critical Moment khi còn 5 phút: banner `5 PHÚT CUỐI`, lời nhắc mascot và trạng thái panel critical.
- [x] Thêm completion flow: mascot ăn mừng, ghi nhận phiên và XP, sound alert/reward, nút Nghỉ/Làm tiếp.
- [x] Thêm Chế độ lười với 3 mức năng lượng và nhiệm vụ thử 2 phút không gây áp lực.
- [x] Thêm card Boss Trì hoãn HP metaphor và bảng Ong vs Trì hoãn với thông điệp nhẹ nhàng.
- [x] Completion/reward flow đã có mascot, lời động viên, âm thanh reward và nút tiếp tục; achievement unlock dùng reward system hiện có.
- [x] Bổ sung `ExperienceStudio.test.ts`, 17 test mục tiêu pass, TypeScript pass, production build pass và mobile preview pass.

- [x] Tăng âm báo kết thúc Pomodoro: chuỗi nhiều nhịp đủ nổi bật để thu hút người học, gain an toàn, không clipping/chói, vẫn tôn trọng mute/volume/preview.
- [x] Bổ sung regression test cho alert sequence/gain, chạy typecheck, production build và QA preview sau khi sửa.
- [x] Kiểm kê và khôi phục các ý tưởng bị thiếu trong file nguồn, đặc biệt soundscape dài và đa lớp.
- [x] Mở rộng soundscape Pomodoro thành các cảnh âm thanh phong phú, chuyển lớp mượt và duy trì liên tục.
- [x] Khôi phục tiếp Background “thở”, chuyển cảnh theo thời gian, Comeback, trì hoãn analytics và hộp nhiệm vụ ngẫu nhiên theo roadmap.
- [x] Sửa mapping mascot: Lumi là bạn đồng hành an ủi/động viên theo cảm xúc; Ong vàng là người học/người dùng.
- [x] Thêm quản trị ảnh Lumi cho từng nhiệm vụ, mốc học tập hoặc phần thưởng; giữ ảnh Ong vàng mặc định cho người học.
- [x] Sửa độ tương phản dark mode: chữ, card, input, placeholder, tiêu đề và trạng thái phải dễ đọc.
- [x] Khôi phục palette đỏ sáng + xanh lá chiếm tối thiểu 90% giao diện và rà dark-mode không làm lệch nhận diện.
- [x] Mở rộng Emotion Theme Studio với nhiều preset, câu lệnh riêng, lời an ủi và Lumi xuất hiện cho từng cảm xúc.
- [x] Sửa hiển thị asset Ong vàng để người học nhìn thấy rõ ở Home, login và khu vực cảm xúc.
- [x] Xây dựng Kho lời nói & ý tưởng gồm 4 nhóm: an ủi, động viên, gợi ý hiểu bài và chống trì hoãn.
- [x] Nối lời nhắn theo sự kiện: sai bài, điểm thấp, bỏ dở, mất streak, bắt đầu, hoàn thành, critical moment và quay lại.
- [x] Bổ sung lựa chọn chống trì hoãn: Học 5 phút, Ôn bài cũ và Lumi chọn nhiệm vụ.
- [x] Bổ sung thư viện nhiệm vụ siêu nhỏ và lời nhắc nhẹ, có chọn ngẫu nhiên.
- [x] Thêm form ＋ Thêm nội dung với loại, nội dung, nhiều ngữ cảnh, mascot và mức độ.
- [x] Sửa fallback/hiển thị ảnh Ong vàng để không còn ô ảnh trống và có trạng thái dễ hiểu khi asset lỗi.
- [x] Sửa thông điệp tiến độ thành tích theo hướng khích lệ, không nhấn vào số còn thiếu.
- [x] Bổ sung Bảo tàng Hành trình theo năm/tháng và câu chuyện khi mở từng hiện vật.
- [x] Hoàn thiện nhiệm vụ siêu nhỏ, lời nhắc nhẹ và form ＋ Thêm nội dung với đầy đủ trường yêu cầu.
- [x] Thay ảnh Ong vàng bằng fallback minh họa ổn định, không phụ thuộc storage URL lỗi.
- [x] Mở rộng kho nội dung theo module và ngữ cảnh: Pomodoro, Làm đề, Hiểu tận gốc, Thành tích, Nhật ký, Chống trì hoãn.
- [x] Chọn lời phù hợp theo context với lịch sử gần đây để giảm lặp nội dung.
- [x] Thêm trạng thái bật/tắt; nội dung tắt không được bộ chọn sử dụng.
- [x] Thêm thùng rác có ngày tạo/xóa, khôi phục, chọn tất cả và xóa vĩnh viễn có xác nhận.
- [x] Bổ sung regression tests cho chọn lời, module context và luồng trash/restore/permanent delete.
- [x] Thêm nút THÔI, BẮT ĐẦU NHÉ với hover mascot, animation nhẹ, âm thanh và đếm ngược 3–2–1.
- [x] Thêm HỌC THỬ 5 PHÚT, Lumi chọn giúp và luồng nhiệm vụ nhỏ nhất không ép buộc.
- [x] Mở rộng quản trị mascot theo 17 trạng thái, có ảnh/tên/mô tả/điều kiện và sửa/xóa/khôi phục.
- [x] Bổ sung regression cho countdown, Start Small, random task và mascot lifecycle.
- [x] Thêm tìm kiếm và bộ lọc kho nội dung theo loại, module, ngữ cảnh, mascot, ngày tạo và trạng thái.
- [x] Thêm xuất/nhập kho nội dung JSON/CSV với kiểm tra dữ liệu và không làm mất kho hiện tại khi nhập lỗi.
- [x] Tạo khu vực AI đề xuất riêng; chỉ thêm vào kho chính sau thao tác Ong duyệt/thêm vào kho.
- [x] Bảo vệ nội dung do Ong tạo khỏi tự động sửa/xóa bởi AI.
- [x] Chuẩn hóa mapping ảnh tham chiếu Lumi/Ong vàng và fallback hiển thị ổn định.
- [x] Kiểm tra và hoàn thiện Audio Center với đủ nhóm âm thanh thiên nhiên, không gian, thư giãn và tập trung.
- [x] Hoàn thiện mixer nhiều lớp với thanh âm lượng riêng và lưu không gian học.
- [x] Hoàn thiện mini player trong trang với thu nhỏ/phóng to/đóng/mute và ghim trong web UI, không giả lập always-on-top hệ điều hành.
- [x] Hoàn thiện nền thở có bật/tắt, reduced-motion và chuyển cảnh sáng/chiều/tối giữ đỏ sáng + xanh lá.
- [x] Bổ sung regression cho audio center, mixer, mini player, motion và brand palette.
- [x] Bổ sung Trì hoãn Analytics theo sự kiện bắt đầu, bỏ dở, mở trang chưa học, thời điểm và kích thước nhiệm vụ.
- [x] Bổ sung nhật ký lý do hôm nay khó học và lời nhận xét Lumi dựa trên dữ liệu đã ghi nhận.
- [x] Bổ sung gợi ý Lumi tối giản ba lựa chọn để giảm decision fatigue khi Ong đứng lâu ở màn hình chính.
- [x] Bổ sung Hộp nhiệm vụ ngẫu nhiên với shuffle và nhiệm vụ siêu nhỏ có thể hoàn thành.
- [x] Bổ sung Combo nhiệm vụ theo chuỗi bước, tiến độ, hoàn thành và phần thưởng nhẹ nhàng.
- [x] Bổ sung regression tests, responsive QA và build cho hệ thống chống trì hoãn mới.
- [x] Rà soát và sửa mapping/asset mascot Ong để hiển thị đúng nhân vật người học, không ảnh hưởng Lumi.
- [x] Bổ sung module Hiểu tận gốc liên kết dữ liệu học và XP theo các hành vi hiểu sâu.
- [x] Đảm bảo XP chỉ tăng khi có hành động tích cực, không trừ XP khi không học.
- [x] Bổ sung level không giới hạn theo ngưỡng 300 XP/cấp và 12 tên cấp mặc định có thể quản trị.
- [x] Bổ sung quản trị tên cấp: thêm, sửa, bật/tắt, xóa mềm, khôi phục và xóa vĩnh viễn nếu thuộc dữ liệu người dùng.
- [x] Bổ sung tổng kết cuối ngày theo các hành động học thực tế, không bịa dữ liệu.
- [x] Tạo checklist QA tách riêng cho 15 module: giao diện, mascot, Pomodoro, Audio Center, Achievement, Khoảnh khắc, Hiểu tận gốc, Làm đề giấy, thùng rác, sửa/xóa/khôi phục, responsive, lưu dữ liệu, animation, popup và trạng thái mascot.
- [x] Bổ sung regression tests, browser/mobile QA và build cho các thay đổi mới.
- [x] Lưu ảnh tham chiếu mascot mới vào asset workspace, giữ nguyên bản gốc và ghi nguồn tệp người dùng.
- [x] Chuẩn hóa mapping mascot theo ảnh: Ong người, Ong hoodie, Ong chibi; Lumi là bạn đồng hành riêng.
- [x] Tách hoặc dùng crop/asset phù hợp cho các biến thể mascot, không dùng bee mascot cũ làm default.
- [x] Bổ sung quản trị variant/trạng thái mascot theo đúng ảnh tham chiếu và có fallback rõ ràng.
- [x] QA trực quan mascot ở Home, login, Emotion Studio, Pomodoro và mobile sau khi thay asset.
- [x] Xây dựng Bản đồ Hành trình dạng nhánh thay cho achievement chỉ là danh sách.
- [x] Bổ sung Cây tiến bộ theo nhóm kỹ năng/kiến thức với node, quan hệ nhánh và trạng thái.
- [x] Bổ sung Bản đồ chưa khám phá với achievement bí mật ẩn tên/điều kiện cho tới khi mở khóa.
- [x] Bổ sung câu chuyện riêng cho achievement đã mở khóa, dựa trên điều kiện và lịch sử thật.
- [x] Bổ sung Khoảnh khắc mở khóa: ảnh, ghi chú, cảm xúc, mascot và lưu/xóa/khôi phục theo dữ liệu người dùng.
- [x] Dùng riêng asset Ong hoodie trong Achievement, Bản đồ, Cây tiến bộ và Khoảnh khắc; không dùng Ong phong cách người.
- [x] Bổ sung regression tests và responsive QA cho toàn bộ hệ thống achievement dạng bản đồ.
- [x] Bổ sung nút “Tại sao Ong nhận được?” với danh sách evidence từ lịch sử học thật và kết luận đủ điều kiện.
- [x] Bổ sung achievement không hoàn hảo: quay lại, sửa lỗi, chưa hiểu, học lại, ít năng lượng và không bỏ cuộc.
- [x] Bổ sung achievement hiểu sai, không lặp lại lỗi và tiến bộ so với chính mình dựa trên dữ liệu thật.
- [x] Bổ sung achievement hồi sinh sau khi mất streak hoặc tiến độ, không coi đó là thất bại vĩnh viễn.
- [x] Bổ sung mascot reaction theo achievement state và speech có context, không random vô nghĩa.
- [x] Bổ sung quản trị/ghi âm giọng nói người dùng cho lời thoại mascot, có bật/tắt và xử lý quyền microphone.
- [x] Bổ sung card “Thành tích tiếp theo” và “3 thành tích gần nhất” trên dashboard.
- [x] Bổ sung regression tests và responsive/browser QA cho evidence, speech, recording và achievement cards.

- [x] Tinh chỉnh thông điệp tiến độ thành tích theo hướng ghi nhận số dấu mốc đã mở khóa, không tạo cảm giác phải đạt 100%.
- [x] Mở rộng Bảo tàng Hành trình theo mốc năm/tháng, hiện vật achievement có câu chuyện và trạng thái rỗng thân thiện.
- [x] Chạy regression test và browser QA responsive cho trải nghiệm thành tích/Bảo tàng sau thay đổi.

- [x] Mở rộng catalog thành 900 thành tích công khai, chia đều thành 9 nhóm với cấp độ dễ đến rất khó.
- [x] Chuyển 400 mốc cuối thành 400 danh hiệu công khai, hiển thị tên, ý nghĩa, điều kiện, tiến độ, phần thưởng, độ hiếm và giải thích liên quan.
- [x] Loại bỏ trạng thái ẩn/bí mật trên toàn bộ giao diện achievement; mục chưa đạt phải hiển thị đầy đủ thông tin và trạng thái 🔒 Chưa đạt.
- [x] Hoàn thiện hệ thống mảnh ghép: nguồn nhận, số lượng, công dụng, ngưỡng ghép, đã nhận, còn thiếu và thành phẩm.
- [x] Bổ sung regression, hiệu năng và browser QA cho catalog 900 achievement/400 danh hiệu trên desktop và mobile.

- [x] Bổ sung schema đầy đủ cho achievement: code, nhóm, điều kiện, tiến độ, phần thưởng, mảnh ghép và timestamps.
- [x] Hỗ trợ nhiều điều kiện độc lập trong một achievement và tính trạng thái tổng hợp còn thiếu.
- [x] Hiển thị progress bar, phần trăm, giá trị hiện tại, mục tiêu và số còn thiếu cho từng achievement.
- [x] Duy trì tương thích cloud-state/achievement cũ và thêm regression tests cho schema, tiến độ và điều kiện đa tiêu chí.

- [x] Ưu tiên tab/khu vực 400 Danh hiệu trước trong giao diện Thành tích và giữ toàn bộ danh hiệu công khai khi chưa đạt.
- [x] Bổ sung ý nghĩa, giải thích tên, nguồn cảm hứng và cách diễn đạt thận trọng cho từng danh hiệu; không khẳng định sai nguồn ca dao/tục ngữ.
- [x] Bổ sung metadata phần thưởng danh hiệu gồm điểm thành tích, mảnh ghép lịch sử, vé đổi vật phẩm và vật phẩm trang trí.
- [x] Viết regression và browser QA cho thứ tự hiển thị, metadata danh hiệu, điều kiện công khai và phần thưởng responsive.

- [x] Chuyển mô hình mảnh ghép từ ghép tranh sang mở khóa và hoàn thiện hồ sơ nhân vật lịch sử.
- [x] Lưu bảng giá trị quy đổi cho sáu cấp mảnh trong dữ liệu cấu hình/database, bảo đảm cấp cao luôn có giá trị lớn hơn.
- [x] Bổ sung các lớp mở khóa hồ sơ nhân vật: cơ bản, tiểu sử mở rộng, dòng thời gian, sự kiện, thành tựu, câu nói có nguồn và tư liệu học tập.
- [x] Bổ sung quy đổi mảnh thành Vé Sưu Tầm theo tỷ lệ cấu hình trong Admin.
- [x] Xây dựng Cửa hàng Sưu tầm với vật phẩm, giá, loại tiền, độ hiếm, số lượng và trạng thái.
- [x] Viết kiểm thử ledger/kinh tế, kiểm tra dữ liệu lịch sử có nguồn và browser QA responsive cho Kho/Cửa hàng.

- [x] Bổ sung catalog nguồn nhận mảnh cho thành tích, phiên học, Pomodoro, làm đề/Deep Review, streak, nhiệm vụ và event.
- [x] Cấu hình giới hạn nhận theo ngày và theo từng mốc để ngăn farm vô hạn; mọi giới hạn phải hiển thị rõ cho người dùng.
- [x] Bổ sung reward rules cho các mốc Pomodoro, streak, cải thiện điểm và Deep Review với điều kiện cấu hình được.
- [x] Xây dựng module Event CRUD cho Admin gồm tên, mô tả, banner, thời gian, trạng thái, độ khó, mục tiêu, nhiệm vụ, điều kiện tham gia, phần thưởng và giới hạn nhận.
- [x] Viết regression cho idempotency/ledger, giới hạn nhận, phân quyền Admin và browser QA responsive cho nguồn nhận mảnh/Event.

- [x] Bổ sung các mốc học tập theo tổng thời gian và phần thưởng tương ứng.
- [x] Xây dựng Admin Reward Catalog CRUD với tên, loại, giá trị, độ hiếm, icon, mô tả, điều kiện và trạng thái Active.
- [x] Ghi lịch sử giao dịch mảnh bất biến với thời gian, nguồn, loại giao dịch, số lượng, cấp và claim key.
- [x] Xây dựng Kho Mảnh Ghép hiển thị số dư theo cấp, tổng giá trị, nguồn nhận và lịch sử sử dụng.
- [x] Bảo đảm giao dịch kiểm tra số dư/điều kiện, không phát sinh mảnh âm và có audit log.
- [x] Bổ sung Kho Đổi Thưởng, quy đổi mảnh trực tiếp và tỷ lệ cấu hình được bởi Admin.
- [x] Tạo trang giải thích minh bạch cho Thành tích, Danh hiệu, Mảnh ghép, Event, Cửa hàng và Phần thưởng.
- [x] Thiết kế database contract cho các bảng achievement, title, character, piece, reward, event, shop, admin transaction và audit log; viết regression/QA tương ứng.

- [x] Bổ sung đầy đủ metadata giao dịch mảnh: transaction_id, user_id, piece_type, quantity, source_type, source_id, reason và created_at.
- [x] Bổ sung reward_claimed/claimed_at và unique claim key để chống nhận lại phần thưởng khi reload hoặc retry.
- [x] Bảo đảm giao dịch nguyên tử, kiểm tra số dư/điều kiện trước khi ghi và tuyệt đối không phát sinh mảnh âm.
- [x] Bổ sung audit log cho grant, spend, exchange, admin grant/revoke và reward claim.
- [x] Tạo checklist tự kiểm tra toàn bộ yêu cầu 900/400, mảnh, nhân vật lịch sử, Event, cửa hàng, phần thưởng và tính minh bạch.
- [x] Viết regression cho duplicate/concurrent claims, số dư âm, transaction metadata, audit và browser QA checklist.

- [x] Đối chiếu và chuẩn hóa 900 thành tích theo 9 nhóm chủ đề, mỗi nhóm đúng 100 mục, hiển thị toàn bộ không ẩn.
- [x] Bảo đảm 400 thành tích đặc biệt cuối catalog hiển thị như 400 danh hiệu, mỗi mục có tên, điều kiện, tiến độ, phần thưởng, ý nghĩa, nguồn/cảm hứng và giải thích.
- [x] Bổ sung/kiểm tra tag phụ cho thành tích và bộ lọc theo 9 nhóm chủ đề.
- [x] Bảo đảm mảnh ghép dùng cho hồ sơ hình ảnh nhân vật lịch sử, có giá trị tăng nghiêm ngặt theo độ khó, cửa hàng và quy đổi cấu hình được.
- [x] Bảo đảm Admin CRUD cho thành tích, danh hiệu, mảnh ghép, nhân vật lịch sử, phần thưởng và Event.
- [x] Bổ sung khu vực prompt mẫu để Admin yêu cầu AI đề xuất dữ liệu; mọi nội dung AI phải qua duyệt thủ công trước khi thêm vào catalog.
- [x] Bổ sung regression cho 9 nhóm × 100, 900/400, công khai điều kiện/phần thưởng, tag phụ, prompt AI và trạng thái duyệt.
- [x] Chạy browser QA responsive cho Catalog, Danh hiệu, Kho/Cửa hàng, Event và Admin content tools.

- [x] Thêm celebration animation khi nhận mảnh ghép và khi mở khóa Danh hiệu.
- [x] Thêm thanh tiến độ trực quan cho kho mảnh và tiến độ Danh hiệu sau sự kiện nhận thưởng/mở khóa.
- [x] Thêm tùy chọn bật/tắt animation, tôn trọng prefers-reduced-motion và không ảnh hưởng logic phần thưởng.
- [x] Viết regression và chạy browser QA responsive cho celebration/progress states.

- [x] Chuẩn hóa Ong mặc hoodie làm mascot cố định cho khu vực Achievement và Khoảnh khắc.
- [x] Hiển thị Ong hoodie trong celebration overlay khi mở khóa Danh hiệu hoặc nhận mảnh ghép.
- [x] Bổ sung regression contract và browser QA responsive cho mapping mascot hoodie.

- [x] Xác nhận 400 Danh hiệu là 400 thành tích cuối trong tổng đúng 900, không tạo thêm catalog ngoài 900.
- [x] Phân chia 400 Danh hiệu thành 8 nhóm × 50, tăng dần độ khó và hiển thị nhóm/cấp rõ ràng.
- [x] Bổ sung hoặc xác nhận metadata nguồn văn hóa: source_type, source_text, source_note; dùng nhãn “Lấy cảm hứng từ…” khi chưa xác minh nguồn.
- [x] Bảo đảm mỗi Danh hiệu công khai tên, điều kiện, tiến độ, ý nghĩa, nguồn/cảm hứng, giải thích và phần thưởng chi tiết.
- [x] Bảo đảm phần thưởng theo độ khó tăng dần và lấy từ config/database, không hard-code trong UI.
- [x] Viết regression và chạy browser QA cho các invariant Danh hiệu mới.

- [x] Chuẩn hóa 400 Danh hiệu là 400 thành tích cuối trong tổng 900, không tạo thêm catalog ngoài 900.
- [x] Phân bổ 400 Danh hiệu thành 8 nhóm × 50, tăng dần độ khó.
- [x] Bổ sung source_type, source_text, source_note và hiển thị công khai nguồn/cảm hứng.
- [x] Bảo đảm phần thưởng XP/mảnh tăng nghiêm ngặt theo nhóm Danh hiệu và giữ cấu hình ở generator/config.
- [x] Bổ sung Admin CRUD cho nhóm Danh hiệu và metadata nguồn của thành tích tùy chỉnh.
- [x] Viết regression cho 900/400, 8 nhóm × 50, nguồn bắt buộc và phần thưởng tăng dần.
- [x] QA giao diện catalog/Admin và sửa copy mảnh ghép theo hướng mở khóa hồ sơ nhân vật lịch sử.

- [x] Sửa nhãn/avatar “Ong · người học” đang hiển thị biến thể người sang Ong mặc hoodie.
- [x] Rà soát các điểm render avatar người học liên quan, thêm regression và QA responsive.

- [x] Bổ sung mục giải thích công dụng thực tế của từng cấp mảnh ghép và liên kết với hồ sơ nhân vật lịch sử.
- [x] Chuẩn hóa model historical character: metadata lịch sử, rarity, unlock cost, image status, nguồn, ghi chú và timestamps.
- [x] Bảo đảm ảnh nhân vật chỉ hiển thị khi có URL Storage hợp lệ; thiếu ảnh phải hiển thị trạng thái rõ ràng, không bịa ảnh.
- [x] Hoàn thiện Admin CRUD nhân vật: tạo, sửa, xóa mềm, khôi phục và xóa vĩnh viễn.
- [x] Thêm form nguồn tư liệu và prompt AI tạo bản nháp nhân vật; không tự xuất bản khi chưa duyệt.
- [x] Viết regression cho mảnh ghép, source metadata, image status, trash/restore và quy trình draft approval.
- [x] Chạy QA responsive cho Bộ sưu tập Nhân vật Lịch sử và Admin content hub.

- [x] Chuẩn hóa Event dữ liệu thật với thời gian, điều kiện, nhiệm vụ, phần thưởng, loại/số lượng mảnh, giới hạn nhận và số lần tham gia.
- [x] Bổ sung auto-reward Event theo luồng kiểm tra điều kiện → reward record → ledger → thông báo, chống claim trùng.
- [x] Bổ sung Admin grant mảnh/điểm/vật phẩm/vé/Danh hiệu với admin_id, recipient_user_id, reward_type, reward_value, reason, created_at và audit.
- [x] Bổ sung form Admin tạo Thành tích thường/Danh hiệu và prompt AI tạo bản nháp cho Event, Thành tích, Danh hiệu.
- [x] Viết regression cho Event claim limit/idempotency, Admin grant audit và quy tắc AI không tự xuất bản.

- [x] Bổ sung bảng Admin quản lý 900 Thành tích với tìm kiếm, lọc cấp/nhóm/trạng thái, chỉnh sửa và xem chi tiết.
- [x] Bổ sung bảng Admin riêng cho 400 Danh hiệu với xem, sửa, thêm, xóa mềm, khôi phục và xóa vĩnh viễn.
- [x] Bổ sung tổng quan trang người dùng Thành tích: số đã mở khóa/tổng, tiến độ 900 và tiến độ 400 Danh hiệu.
- [x] Bổ sung bộ lọc trang Thành tích theo trạng thái, cấp độ, nhóm và loại Thành tích/Danh hiệu.
- [x] Bổ sung trang chi tiết Danh hiệu công khai đầy đủ điều kiện, tiến độ, ý nghĩa, nguồn, giải thích và phần thưởng.
- [x] Bổ sung Bộ sưu tập Mảnh ghép theo cấp với giá trị, công dụng, cách nhận, cách đổi và nội dung có thể mở khóa.
- [x] Bổ sung lịch sử Mảnh ghép hiển thị ngày, loại, số lượng, nguồn và hành động.
- [x] Viết regression và chạy browser QA responsive cho các bảng, bộ lọc, chi tiết và lịch sử mới.
- [x] Cập nhật checkpoint sau khi toàn bộ mục mở rộng đạt kiểm thử.

- [x] Bổ sung transaction đổi mảnh nguyên tử: kiểm tra số dư, đúng loại, item/event còn hiệu lực, trừ mảnh, cộng vật phẩm và ghi lịch sử.
- [x] Bổ sung transaction mở khóa nhân vật lịch sử với kiểm tra chi phí, trạng thái đã mở khóa, ledger và collection progress.
- [x] Bổ sung Admin tạo loại mảnh động với mã, độ hiếm, giá trị, công dụng, cách nhận và cách đổi.
- [x] Bổ sung Admin tạo công dụng và công thức đổi nhiều đầu vào, lưu cấu hình thay vì hard-code.
- [x] Bổ sung AI Command Center với các lệnh tạo bản nháp có cấu trúc và hàng đợi duyệt thủ công, không tự xuất bản/sửa/xóa/cấp thưởng.
- [x] Viết regression cho tính nguyên tử, không âm số dư, idempotency, mở khóa nhân vật và approval gate của AI.
- [x] Chạy TypeScript, Vitest, production build và browser QA cho các luồng mới.
- [x] Lưu checkpoint cho vòng mở rộng đổi mảnh, nhân vật, cấu hình và AI Command Center.

- [x] Cho phép người dùng chọn Danh hiệu đã đạt để hiển thị trên hồ sơ và đổi bất kỳ lúc nào.
- [x] Chặn tuyệt đối việc chọn Danh hiệu chưa đạt hoặc Danh hiệu không còn active.
- [x] Bổ sung thống kê Admin 900/900, 400/400, lượt đạt, mảnh phát/tiêu, nhân vật mở khóa và Event đã tổ chức.
- [x] Bổ sung biểu đồ thống kê aggregate theo thời gian từ audit/ledger thực tế, không mock số liệu người dùng; biểu đồ ledger/audit dùng ProfileState hiện tại và timestamps giao dịch thật.
- [x] Bổ sung trạng thái soft deleted/restored/permanently deleted và khu vực Thùng rác cho Nhân vật lịch sử/Event; các loại dữ liệu Admin khác còn chờ mở rộng.
- [x] Bổ sung bộ kiểm tra hệ thống cho invariant Thành tích, Danh hiệu, Mảnh ghép, Nhân vật, Event và AI approval gate.
- [x] Viết regression và chạy browser QA responsive cho profile title, panel thống kê/invariant, biểu đồ hoạt động nội dung và Thùng rác Nhân vật/Event.
- [x] Lưu checkpoint cho vòng hồ sơ, thống kê, kiểm tra toàn vẹn và soft delete.

- [x] Rà soát toàn bộ khu vực giao diện và bổ sung nút thu gọn/mở rộng nhất quán; các section chính MuseumJourney/Pomodoro và toàn bộ View đã có control.
- [x] Lưu trạng thái thu gọn theo từng khu vực vào persistence để tải lại trang vẫn giữ trạng thái đã chọn.
- [x] Đảm bảo mặc định các khu vực có thể thu gọn ở trạng thái thu gọn và chỉ mở khi người dùng nhấn lại.
- [x] Rà soát audio nền, autoplay policy, nút bật/tắt, volume và resume sau tương tác người dùng; chỉ phát sau user gesture để tuân thủ trình duyệt.
- [x] Bổ sung regression cho persistence thu gọn và trạng thái audio nền.
- [x] Chạy TypeScript, 43 file/145 test, production build và browser QA desktop/mobile cho thu gọn/audio.
- [x] Lưu checkpoint cho vòng thu gọn toàn giao diện và audio nền.

- [x] Loại bỏ wrapper thu gọn cấp View/trang vì không đúng yêu cầu thu gọn theo từng mục.
- [x] Áp dụng thu gọn độc lập cho từng mục nội dung có thể thu gọn, với storage key riêng cho từng mục.
- [x] Bảo đảm trạng thái từng mục không tự mở lại sau tải trang, trừ khi chính người dùng đã mở mục đó.
- [x] Cập nhật regression và QA desktop/mobile cho cơ chế thu gọn theo từng mục.
- [x] Lưu checkpoint cho bản sửa phạm vi thu gọn theo từng mục.

- [x] Bổ sung catalog cửa hàng cho theme màu và nền animation với giá, loại tiền, độ hiếm, trạng thái sở hữu/trang bị.
- [x] Thực hiện giao dịch mua/trang bị theme và nền bằng tiền tệ hệ thống qua ledger, kiểm tra số dư và chống mua trùng.
- [x] Lưu theme/nền đang chọn và khôi phục sau khi tải lại trang, có hỗ trợ prefers-reduced-motion.
- [x] Tăng âm báo Pomodoro về độ to/độ vang, giữ giới hạn âm lượng và cho phép nghe thử/bật tắt rõ ràng.
- [x] Viết regression cho giao dịch shop, persistence theme/nền và cấu hình âm báo Pomodoro.
- [x] Chạy TypeScript, Vitest, production build và browser/audio QA desktop/mobile.
- [x] Lưu checkpoint cho vòng shop theme/nền động và audio Pomodoro.


## Vòng mở rộng kế tiếp
- [x] Mở rộng catalog Cửa hàng bằng item theme màu và nền animation, dùng currency/ledger hiện có
- [x] Thêm state sở hữu/trang bị theme và nền, lưu bền vững qua cloud-state/localStorage và áp dụng toàn app
- [x] Nâng cấp âm thanh hoàn tất Pomodoro: lớn hơn, vang hơn, có reverb/echo nhưng tôn trọng user gesture
- [x] Mở rộng soft-delete/thùng rác cho Achievements, Titles, Rewards và Shop items
- [x] Giảm cảnh báo bundle >500kB bằng code-splitting các trang nặng
- [x] Bổ sung Vitest regression cho shop cosmetic, theme persistence, audio alert và soft-delete
- [x] Chạy typecheck, test, build và browser QA responsive cho vòng mở rộng này


## Yêu cầu cập nhật AI Command Center
- [x] Bổ sung giải thích chi tiết mục đích, đầu vào, đầu ra và cách kiểm duyệt cho từng prompt mẫu
- [x] Hỗ trợ nhập prompt tùy chỉnh trong một ô chung và giữ cảnh báo AI chỉ tạo bản nháp
- [x] Thêm regression test cho prompt explanation, custom prompt và approval gate
- [x] Chạy typecheck, Vitest, build và QA giao diện Admin Command Center

## Sửa menu và Chế độ lười
- [x] Cho menu điều hướng cuộn được toàn bộ mục trên màn hình nhỏ và desktop có chiều cao hạn chế
- [x] Cho phép bỏ chọn/tắt Chế độ lười sau khi đã chọn một micro-task
- [x] Thêm regression và QA responsive cho menu cuộn cùng thao tác bỏ chọn

## Cảm xúc và lời động viên
- [x] Phân tích 12.html và trích xuất các tương tác theme cảm xúc phù hợp để áp dụng an toàn
- [x] Bỏ các nhãn “Bật” thừa trong lựa chọn cảm xúc và làm rõ trạng thái đang chọn
- [x] Áp dụng theme màu toàn giao diện cùng câu động viên khi người dùng chọn cảm xúc
- [x] Bổ sung lệnh AI quản trị có hướng dẫn chi tiết để tạo lời an ủi và động viên dưới dạng bản nháp
- [x] Thêm regression, TypeScript, Vitest, build và QA responsive cho vòng cập nhật cảm xúc

## Rà soát module độc lập và kiểm soát mất tập trung
- [x] Lập ma trận trạng thái Đạt / Chưa đạt / Thiếu / Sai cho Giao diện, Mascot, Pomodoro, Audio, Achievement, Khoảnh khắc, Hiểu tận gốc, Làm đề giấy, Thùng rác, CRUD/khôi phục, Responsive, Lưu dữ liệu, Animation, Popup và trạng thái mascot
- [x] Rà soát mỗi module để xác nhận giao diện riêng, dữ liệu riêng, trạng thái rõ ràng và thao tác thêm/sửa/xóa/khôi phục khi áp dụng
- [x] Bổ sung cài đặt tập trung để bật/tắt animation, popup và âm thanh độc lập
- [x] Bổ sung các khoảng trống ưu tiên cao phát hiện từ ma trận kiểm tra mà không gộp các module khác bản chất
- [x] Viết regression, thực hiện QA từng module và cập nhật checklist trạng thái cuối cùng

## Sửa lag và lặp theme cảm xúc
- [x] Xác định nguồn lặp render hoặc side effect khi chọn cảm xúc
- [x] Ổn định cập nhật theme để chỉ chạy một lần cho mỗi thao tác người dùng
- [x] Giảm thao tác DOM/persistence thừa gây lag trong luồng chọn cảm xúc
- [x] Thêm regression và QA thao tác chọn/bỏ chọn cảm xúc liên tiếp
- [x] Rà soát đồng bộ cảm xúc giữa Dashboard, Pomodoro, chuyển View và lúc khôi phục localStorage
- [x] Rà soát CSS toàn cục của theme, nền animation, dark mode và attention controls để loại bỏ style/transition cạnh tranh
- [x] Kiểm tra giao diện desktop/mobile khi đổi cảm xúc liên tục, điều hướng trang và tải lại trang

## Trợ giúp giới thiệu menu
- [x] Rà soát toàn bộ mục điều hướng và xác định nội dung giới thiệu riêng cho từng phần
- [x] Thêm nút trợ giúp dấu hỏi cố định, có thể mở/đóng thuận tiện ở desktop và mobile
- [x] Hiển thị mục đích, thao tác chính và gợi ý bắt đầu cho từng menu trong bảng trợ giúp
- [x] Thêm regression, TypeScript, build và QA responsive cho hệ thống trợ giúp

## Tìm kiếm và điều hướng từ bảng trợ giúp
- [x] Thêm thanh tìm kiếm lọc theo tên, công dụng và bước bắt đầu của từng mục hướng dẫn
- [x] Thêm nút "Đi tới phần này" để chuyển đến menu tương ứng và tự đóng bảng trợ giúp
- [x] Bổ sung regression, TypeScript, build và QA responsive cho hai thao tác mới

## Cải tổ trải nghiệm cảm xúc, âm thanh và Lumi
- [x] Gỡ Cửa hàng giao diện và toàn bộ luồng mua/trang bị giao diện; chỉ giữ đổi màu theo cảm xúc
- [x] Khôi phục và làm rõ cơ chế thu gọn theo từng mục, mặc định đóng và lưu trạng thái giữa các lần tải
- [x] Hiển thị tên cấp học đi kèm số cấp trong sidebar và các vị trí cấp hiện tại
- [x] Mở rộng trợ giúp dấu hỏi từ mô tả menu thành hướng dẫn chi tiết về công dụng, thao tác và trạng thái của từng phần
- [x] Thay ý tưởng ghi âm mascot bằng thẻ lời an ủi/động viên Lumi có ảnh và nút phát giọng nói trực tiếp
- [x] Bổ sung phương án Admin quản lý ảnh và bản thu giọng nói Lumi theo ngữ cảnh/cảm xúc
- [x] Sửa Audio Center để âm thanh tập trung thực sự phát sau thao tác người dùng, có trạng thái phát/dừng/âm lượng rõ ràng
- [x] Tăng độ lớn, độ vang và khả năng nghe rõ của chuông hoàn thành Pomodoro sau thao tác người dùng
- [x] Thay nền Pomodoro bằng hiệu ứng được nhìn thấy rõ và không gây giật; bổ sung cảnh nền theo cảm xúc, mùa và thời tiết
- [x] Thêm nút điều khiển âm thanh môi trường tại khu điều khiển cảm xúc, gồm các ngữ cảnh sáng/mưa/tuyết/lá rơi/sấm chớp
- [x] Giữ các tuỳ chọn animation, popup và âm thanh độc lập, có tôn trọng giảm chuyển động
- [x] Bổ sung regression, TypeScript, build và QA responsive/audio cho toàn bộ vòng cải tổ

## Sửa theme trực quan và cá nhân hóa âm thanh
- [x] Chẩn đoán và sửa việc chọn cảm xúc/cảnh nền chưa làm thay đổi màu sắc hoặc nền hiển thị thực tế
- [x] Cho người dùng chọn cảnh nền yêu thích và lưu làm mặc định giữa các lần mở web
- [x] Tạo mixer âm lượng độc lập cho từng lớp âm thanh môi trường và chuông Pomodoro
- [x] Tạo thư viện lời thoại Lumi theo ngày trong tuần, tự chọn nội dung phù hợp ngày học
- [x] Bổ sung regression, kiểm tra âm thanh sau user gesture và QA trực quan desktop/mobile
## Lumi theo cảm xúc, báo cáo Pomodoro và âm nền
- [x] Ánh xạ bản thu giọng nói Lumi đã được Admin duyệt theo trạng thái cảm xúc người học và phát đúng bản thu khi có dữ liệu.
- [x] Thêm biểu đồ tổng thời gian Pomodoro thực tế trong bảy ngày gần nhất, có trạng thái không dữ liệu rõ ràng.
- [x] Chẩn đoán và sửa âm nền để chỉ khởi tạo/phát sau thao tác người dùng, có phản hồi lỗi và điều khiển dừng đáng tin cậy.
- [x] Rà soát và sửa riêng Audio Center Pomodoro: bật/tắt, nghe thử, đổi cảnh, mixer, chuyển trang và chuông phải phản ánh đúng trạng thái phát.
- [x] Bổ sung regression, TypeScript, build và QA desktop/mobile cho các luồng mới.
## Ảnh đồng hành, mục tiêu tuần và bản thu Lumi cá nhân
- [x] Cho người dùng tự tải ảnh Mascot và Lumi riêng cho từng cảm xúc, kèm điều khiển hiển thị/ẩn từng nhân vật và lưu trạng thái theo hồ sơ.
- [x] Thêm mục tiêu số phút Pomodoro theo tuần và hiển thị tiến độ thực tế ngay trên biểu đồ bảy ngày.
- [x] Bổ sung thanh điều chỉnh âm lượng riêng cho giọng nói Lumi, dùng chung cho bản thu và đọc bằng thiết bị.
- [x] Cho người dùng tự ghi âm hoặc tải bản thu giọng Lumi, lưu dữ liệu an toàn và cho phép phát/xóa bản thu của chính họ.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho ảnh, mục tiêu và bản thu cá nhân.
## Ảnh dự phòng, mốc tuần và thư viện bản thu Lumi
- [x] Thêm bộ ảnh mặc định riêng cho Mascot và Lumi ở từng cảm xúc, dùng khi người học chưa tự tải ảnh.
- [x] Hiển thị hiệu ứng chúc mừng và thông báo nổi bật một lần khi người học hoàn thành mục tiêu Pomodoro tuần.
- [x] Cho phép lưu nhiều bản thu Lumi theo từng cảm xúc, chọn một bản yêu thích để phát ưu tiên và quản lý từng bản.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho ảnh dự phòng, mốc tuần và thư viện bản thu.

## Lịch sử mục tiêu tuần, lời chúc Lumi và chuyển tiếp cảm xúc
- [x] Lưu và hiển thị lịch sử các tuần người học hoàn thành mục tiêu Pomodoro, gồm tuần, mục tiêu và số phút thực tế.
- [x] Cho phép thêm, sửa và xóa câu chúc mừng Lumi riêng theo từng cảm xúc, với dữ liệu lưu theo hồ sơ.
- [x] Thêm chuyển tiếp hình ảnh và hiệu ứng âm thanh ngắn, có tôn trọng cài đặt giảm chuyển động/âm thanh, khi đổi cảm xúc Lumi.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho lịch sử tuần, lời chúc và chuyển tiếp cảm xúc.

## Ổn định Audio Center và âm thanh nền
- [x] Chẩn đoán lỗi âm thanh khi bật, dừng, nghe thử, đổi cảnh và đổi cảm xúc; ghi lại nguyên nhân kỹ thuật.
- [x] Khắc phục phát âm thanh nền sau thao tác người dùng, đồng bộ trạng thái phát/dừng và các thanh âm lượng.
- [x] Bổ sung regression, kiểm tra lỗi runtime, TypeScript, build và QA responsive cho luồng âm thanh đã sửa.

## Thu gọn độc lập cho các vùng mới
- [x] Bổ sung nút thu gọn mặc định đóng và lưu trạng thái riêng cho lịch sử mục tiêu tuần, quản lý lời chúc Lumi và các nhóm điều khiển âm thanh mới.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho các vùng thu gọn mới.

## Ảnh cũ và giọng Lumi theo ảnh
- [x] Khôi phục ảnh Lumi cũ cho lời an ủi và động viên, không tự thay bằng bộ ảnh mới.
- [x] Gắn từng bản thu Lumi với đúng ảnh Lumi tương ứng để phát cùng một cặp đồng hành.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho liên kết ảnh–giọng Lumi.

## Bộ sưu tập ảnh–giọng Lumi theo bản thu
- [x] Cho phép thay đổi ảnh đại diện riêng của từng bản thu Lumi đã lưu.
- [x] Hiển thị các cặp ảnh–giọng Lumi dưới dạng lưới trực quan để quản lý.
- [x] Thêm nút nghe thử trực tiếp trên từng thẻ ảnh Lumi trong bộ sưu tập.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho bộ sưu tập ảnh–giọng Lumi.

## Sắp xếp, lọc và bảo vệ ảnh Lumi
- [x] Xác định và khôi phục ảnh Lumi cũ đã bị thay đổi ngoài ý muốn; bảo toàn ảnh của mọi bản thu hiện có.
- [x] Cho phép kéo-thả để sắp xếp lại thứ tự bản thu Lumi và lưu thứ tự theo cảm xúc.
- [x] Thêm tìm kiếm và lọc bản thu theo cảm xúc hoặc ảnh đại diện.
- [x] Cho phép nhân bản một cặp ảnh–giọng Lumi để chỉnh sửa nhanh mà không tạo lại từ đầu.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho ảnh Lumi, sắp xếp, lọc và nhân bản.

## Hoàn tác, nhãn màu và sao lưu thư viện Lumi
- [x] Thêm hoàn tác sau khi kéo-thả hoặc xóa một bản thu Lumi, không làm mất dữ liệu đang lưu.
- [x] Cho phép chọn và lưu nhãn màu tùy chỉnh theo từng bản thu Lumi.
- [x] Cho phép xuất thư viện bản thu thành tệp sao lưu và nhập lại tệp hợp lệ có kiểm tra dữ liệu.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho hoàn tác, nhãn màu và xuất/nhập thư viện.

## Thu nhỏ Pomodoro, lọc nhãn màu và thùng rác Lumi
- [x] Thêm chế độ thu nhỏ độc lập cho Pomodoro, lưu trạng thái và vẫn cho phép khôi phục về giao diện đầy đủ.
- [x] Thêm bộ lọc nhanh bản thu Lumi theo nhãn màu, tương thích với tìm kiếm và các bộ lọc hiện có.
- [x] Bổ sung thùng rác riêng cho bản thu Lumi đã xóa, gồm khôi phục và xóa vĩnh viễn dữ liệu.
- [x] Bổ sung regression, TypeScript, build và QA responsive cho thu nhỏ Pomodoro, lọc màu và thùng rác Lumi.

## Giọng Lumi, thư viện bản thu và hệ thống âm thanh cá nhân
- [x] Loại bỏ mọi hành vi tự phát giọng đọc thiết bị hoặc tự khởi động ghi âm; chỉ phát bản thu/âm thanh người dùng đã chọn sau thao tác chủ động.
- [x] Thêm chọn toàn bộ, bỏ chọn từng bản thu, khôi phục/xóa vĩnh viễn hàng loạt trong thùng rác Lumi.
- [x] Thêm dọn vĩnh viễn bản thu Lumi đã ở thùng rác quá 30 ngày bằng tác vụ định kỳ idempotent, không làm mất bản thu còn hạn.
- [x] Thêm sắp xếp thư viện bản thu Lumi theo thời gian tạo hoặc chỉnh sửa gần nhất, lưu thứ tự ưu tiên phù hợp.
- [x] Thêm phím tắt có thể khám phá để thu nhỏ/mở rộng Pomodoro, không kích hoạt khi đang gõ trong ô nhập liệu.
- [x] Thiết kế dữ liệu tương thích để thành viên quản lý âm thanh riêng theo cảm xúc, mùa, thời tiết, Pomodoro, Lumi, Ong và thư viện cá nhân.
- [x] Cho phép thành viên thêm, sửa, nghe thử, bật/tắt, chỉnh âm lượng, chọn mặc định, khôi phục và xóa âm thanh thuộc sở hữu của mình; hỗ trợ tải tệp MP3/WAV/OGG/M4A hoặc URL hợp lệ.
- [x] Tích hợp lựa chọn âm thanh cá nhân với cảm xúc, mùa, thời tiết, cảnh nền và các mốc Pomodoro mà không làm thay đổi dữ liệu/âm thanh cũ ngoài ý muốn.
- [x] Bảo vệ quyền sở hữu âm thanh cá nhân, nguồn audio và tương thích sao lưu; không tạo URL hoặc nội dung audio giả.
- [x] Bổ sung migration, regression, TypeScript, build, QA responsive và phát hành an toàn cho toàn bộ yêu cầu âm thanh mới.

## Không gian học cá nhân
- [x] Tạo hồ sơ chủ đề cá nhân gồm tên, màu, nền, hiệu ứng, âm thanh, Pomodoro, lời Lumi/Ong và trạng thái hoạt động.
- [x] Cho phép phối cảm xúc, mùa và thời tiết thành một không gian học, với lựa chọn nền, hoạt ảnh CSS và âm thanh của riêng thành viên.
- [x] Tạo bộ trộn âm thanh tách riêng nhạc nền, môi trường, Pomodoro, Lumi/Ong và hiệu ứng hoàn thành.
- [x] Thêm Mix ngẫu nhiên chỉ dùng các thành phần thành viên đã cho phép và lưu kết quả thành preset khi người dùng chọn.
- [x] Thêm gói chủ đề và preset cá nhân có thể áp dụng một lần cho màu, nền, hiệu ứng, âm thanh và nhân vật đồng hành.
- [x] Bổ sung điều khiển nhân vật đồng hành: Lumi, Ong, cả hai hoặc ẩn, cùng lời/bản thu theo mốc Pomodoro và cảm xúc.
- [x] Tạo thư viện “Âm thanh & Chủ đề của tôi” với quản lý quyền sở hữu, nguồn hợp lệ, bật/tắt, âm lượng, nghe thử, khôi phục và xóa an toàn.
- [x] Thêm chế độ tự động ban đêm theo giờ địa phương và Chế độ tập trung trong Pomodoro, tôn trọng tùy chọn giảm hiệu ứng/âm thanh.

## Tóm tắt website, Góc học tập của tôi và lịch preset
- [x] Thêm phần tóm tắt sơ qua về GÓC HỌC TẬP CỦA ONG, mục tiêu, các khu vực chính và cách bắt đầu.
- [x] Khôi phục/hiển thị rõ Góc học tập của tôi với minh họa góc bàn học, khu vực học tập cá nhân và các thành phần liên quan.
- [x] Thêm nhãn cho âm thanh cá nhân và tìm kiếm nhanh theo tên, nhãn, nhóm, cảm xúc hoặc mốc sử dụng.
- [x] Thêm lịch tự động chuyển preset theo từng ngày trong tuần, có thể tắt/bật và lưu theo hồ sơ.
- [x] Thêm lịch sử thay đổi preset, xem chi tiết, áp dụng lại và khôi phục cấu hình cũ an toàn.
- [x] Bổ sung regression, TypeScript, build, QA responsive và phát hành cho các hạng mục mới.
- [x] Kiểm tra mọi mục mới có thu gọn độc lập, mặc định đóng và ghi nhớ trạng thái sau reload.

## Tóm tắt web và Góc học tập của tôi — yêu cầu tiếp tục
- [x] Hiển thị phần tóm tắt sơ qua về GÓC HỌC TẬP CỦA ONG ở vị trí dễ thấy trên trang chính.
- [x] Hiển thị rõ Góc học tập của tôi với minh họa góc bàn học/phòng học, không để mục này bị ẩn trong Experience Studio.
- [x] Bổ sung nhãn và tìm kiếm nhanh trong thư viện âm thanh cá nhân.
- [x] Bổ sung lịch tự động chuyển preset theo từng ngày trong tuần.
- [x] Bổ sung lịch sử thay đổi preset, xem lại và khôi phục cấu hình cũ.
- [x] Kiểm tra các mục mới có thu gọn độc lập, mặc định đóng và ghi nhớ trạng thái sau reload.
- [x] Cập nhật regression, TypeScript, build, QA responsive và phát hành.

## Xác minh GitHub và hoàn thiện Góc học tập — tiếp tục
- [x] Kiểm tra remote GitHub, branch hiện tại, commit mới nhất và xác nhận các thay đổi đã được đồng bộ.
- [x] Kiểm tra tệp index chính của ứng dụng và giải thích rõ vị trí `index.html`/`index.tsx` nếu người dùng đang tìm tệp khác.
- [x] Hoàn thiện phần Tóm tắt sơ qua về web.
- [x] Hiển thị rõ Góc học tập của tôi với minh họa góc bàn học.
- [x] Hoàn thiện nhãn/tìm kiếm âm thanh, lịch preset theo ngày và lịch sử khôi phục preset.
- [x] Chạy test, build, QA và checkpoint sau khi hoàn tất.

- [x] Bổ sung phần “Tóm tắt sơ qua về web” trên dashboard, mô tả rõ tác dụng các nhóm chức năng và liên kết đi tới từng phần.
- [x] Bổ sung “Góc học tập của tôi” với bố cục bàn học trực quan, vùng đặt Lumi/Ong, cảnh nền và trạng thái preset hiện tại.
- [x] Thêm nhãn tùy chỉnh và tìm kiếm nhanh cho thư viện âm thanh cá nhân; giữ thao tác sửa, nghe thử, bật/tắt và thùng rác 30 ngày.
- [x] Bổ sung lịch tự động chuyển preset theo từng ngày trong tuần, lưu cấu hình và áp dụng preset của ngày hiện tại an toàn.
- [x] Bổ sung lịch sử thay đổi preset, hiển thị chi tiết và cho phép khôi phục cấu hình cũ.
- [x] Kiểm thử hồi quy cho dữ liệu, giao diện, lịch preset, lịch sử khôi phục, Tóm tắt website và Góc học tập; chạy TypeScript, Vitest, build và QA responsive.
- [x] Đồng bộ checkpoint hoàn thiện lên GitHub user_github/main.

## Đặc tả mới — Góc học tập độc lập theo tệp pasted_content_3.txt
- [x] Tái cấu trúc thành một mục duy nhất “🏠 Góc học tập”, không trình bày như dashboard nhiều thẻ.
- [x] Tách module StudyCorner gồm cảnh first-person, bàn học, laptop, sách/vở, đèn bàn, cửa sổ, âm thanh môi trường, bộ điều khiển ánh sáng và controls.
- [x] Xây dựng góc nhìn eye-level/seated perspective với mặt bàn tiền cảnh, trung cảnh laptop/đèn/sách và hậu cảnh phòng; không hiển thị nhân vật người học.
- [x] Thêm ánh sáng Ban ngày/Chiều/Ban đêm chuyển mượt, đèn bàn bật/tắt và cường độ sáng.
- [x] Thêm tương tác trang trí nhẹ cho đèn, laptop, sách và cửa sổ/rèm, không biến thành hệ thống quản lý.
- [x] Tách âm thanh môi trường khỏi nhạc nền; có mute, âm lượng ghi nhớ, trạng thái rõ ràng và placeholder minh bạch nếu chưa có file thật.
- [x] Thêm chuyển cảnh Sáng/Chiều/Tối nhẹ, giữ bố cục first-person trên desktop/tablet/mobile.
- [x] Giới hạn phạm vi Góc học tập, không đưa Todo, Journal, Achievement, Badge, Streak, lịch học, môn học, cửa hàng, nhân vật lịch sử hoặc phần thưởng vào module mới.
- [x] Kiểm thử module StudyCorner độc lập, regression dữ liệu/cài đặt, TypeScript, Vitest, build và QA responsive.

## Đặc tả mở rộng — Môi trường thích ứng theo pasted_content_3.txt
- [x] Bổ sung lớp môi trường liên kết thời gian, mùa, thời tiết, cảm xúc, màu sắc, âm thanh và ánh sáng trong StudyCorner.
- [x] Hỗ trợ bốn mùa Spring/Summer/Autumn/Winter với palette, ambience, ánh sáng và mô tả cảm giác riêng.
- [x] Hỗ trợ thời tiết Nắng, Có mây, Nhiều mây, Mưa, Mưa lớn/Bão, Sương mù và Tuyết mô phỏng; có Auto/Manual, không giả định dữ liệu thời tiết thật.
- [x] Hỗ trợ các trạng thái cảm xúc Neutral/Bình thường, Bình yên, Vui vẻ, Có động lực, Tập trung, Buồn, Mệt, Cần thư giãn và Cần năng lượng; người dùng tự chọn, không tự gán cảm xúc.
- [x] Triển khai phối hợp Weather × Emotion và Weather × Season, bảo đảm cảm xúc chỉ điều chỉnh chứ không ghi đè thời tiết/mùa.
- [x] Triển khai adaptive color profile cho background, light, accent, button, icon, border, secondary text, glow và ambience với tương phản dễ đọc.
- [x] Tách sound profile theo thời tiết, mùa và cảm xúc; mute, âm lượng, fade in/out và trạng thái placeholder khi chưa có asset thật.
- [x] Bổ sung ánh sáng tự nhiên/đèn bàn theo time-of-day, weather, season và emotion; chuyển cảnh 1.5–4 giây, tôn trọng reduced motion.
- [x] Thêm preset môi trường, lưu thiết lập người dùng, khôi phục mặc định, Auto Environment và điều khiển bật/tắt hiệu ứng/âm thanh/animation.
- [x] Bổ sung checklist accessibility, mobile, hiệu năng, không tự phát audio ngoài user gesture và không hiển thị nhân vật người học trong StudyCorner.
- [x] Viết regression contract cho toàn bộ ma trận môi trường; chạy TypeScript, Vitest, build, QA desktop/mobile và phát hành checkpoint.

## StudyCorner — diễn biến môi trường, cửa sổ, cây sống và nhớ không gian
- [x] CANCELLED theo yêu cầu người dùng: gỡ StudyCorner, không tiếp tục triển khai mô hình diễn biến thời tiết trong màn hình đã loại bỏ.
- [x] CANCELLED theo yêu cầu người dùng: gỡ StudyCorner, không tiếp tục triển khai cảnh cửa sổ trong màn hình đã loại bỏ.
- [x] CANCELLED theo yêu cầu người dùng: gỡ StudyCorner, không tiếp tục triển khai cây sống trong màn hình đã loại bỏ.
- [x] CANCELLED theo yêu cầu người dùng: gỡ StudyCorner, không tiếp tục mở rộng trạng thái nhớ không gian của màn hình đã loại bỏ.
- [x] CANCELLED theo yêu cầu người dùng: hợp nhất âm thanh về trang chủ, không tiếp tục phân lớp audio theo StudyCorner.
- [x] CANCELLED theo yêu cầu người dùng: không kiểm thử các tính năng StudyCorner đã bị gỡ; regression audio trang chủ đã được cập nhật riêng.

## Lỗi triển khai GitHub Pages
- [x] Điều tra lỗi 404 tại GitHub Pages: kiểm tra branch, workflow, thư mục artifact và entry point index.html.
- [x] Sửa cấu hình GitHub Pages hoặc hướng dẫn dùng đúng domain Manus nếu repository không được cấu hình để host trực tiếp.
- [x] Xác nhận URL root và deep-link sau khi sửa; không làm ảnh hưởng deployment Manus hiện tại.

## Điều chỉnh phạm vi — gỡ Góc học tập, hợp nhất âm thanh
- [x] Gỡ mục StudyCorner khỏi menu/route/luồng hiển thị theo yêu cầu mới, không xóa dữ liệu profile đã có.
- [x] Xác định và hợp nhất các bộ phát âm thanh nền đang nằm ở Home, Experience Studio và StudyCorner thành một controller dùng chung.
- [x] Chặn phát chồng, dừng âm thanh cũ trước khi đổi cảnh, không tự phát khi chưa có user gesture và đồng bộ mute/volume.
- [x] Hiển thị điều khiển âm thanh nền tập trung trên trang chủ, gồm trạng thái, mute, âm lượng và lỗi asset rõ ràng.
- [x] Cập nhật regression, TypeScript, Vitest, build và QA responsive cho luồng âm thanh mới.

## Nâng cấp Audio Center — âm lượng, fade và thoại có nguồn rõ ràng
- [x] Thêm thanh âm lượng độc lập cho nhạc nền, âm thanh môi trường, Pomodoro, hiệu ứng UI, giọng Lumi, giọng Ong và bản ghi thành viên.
- [x] Sửa audio engine để fade in/fade out khi bật, tắt, đổi cảnh hoặc đổi nguồn; chống phát chồng và dừng node cũ an toàn.
- [x] Loại bỏ hoặc vô hiệu hóa các nguồn âm thanh tạo nhiễu; chỉ cho phát asset đã xác thực hoặc placeholder rõ ràng.
- [x] Bổ sung các ambience sạch như mưa rơi và lật sách, có preview, mute, volume và không tự phát ngoài user gesture.
- [x] Phân loại lời thoại theo nguồn Lumi/Ong/thành viên; hiển thị nguồn, cảm xúc, sự kiện và cho phép thành viên tự ghi âm/chọn bản ghi yêu thích.
- [x] Bổ sung regression cho volume độc lập, fade, chống phát chồng, chất lượng nguồn âm và nguồn lời thoại; chạy TypeScript, Vitest, build và QA.

## Audio Center — upload asset, lọc thoại và trạng thái phát
- [x] Cho phép tải lên file audio môi trường/nhạc/hiệu ứng như tiếng mưa và tiếng lật sách, xác thực định dạng/kích thước và lưu file qua storage.
- [x] Hiển thị thư viện asset đã tải lên với nghe thử, dùng làm ambience, đổi tên, bật/tắt và xóa mềm nếu phù hợp.
- [x] Thêm bộ lọc thoại Lumi/Ong/thành viên theo nguồn, cảm xúc và sự kiện; giữ lựa chọn bản ghi yêu thích.
- [x] Tạo trạng thái phát trực quan riêng cho môi trường, nhạc nền và thoại, gồm đang phát/tạm dừng/tắt, tên asset và mức âm lượng.
- [x] Bổ sung regression upload, lọc thoại, trạng thái phát; chạy TypeScript, Vitest, build và QA responsive.

- [x] Audio Center: cho phép tải MP3/WAV cho âm thanh môi trường mưa và lật sách qua storage, kiểm tra định dạng/dung lượng và lưu metadata vào hồ sơ.
- [x] Audio Center: thêm bộ lọc thư viện lời thoại Lumi/Ong/Thành viên theo cảm xúc và sự kiện, giữ trạng thái bản ghi phù hợp.
- [x] Audio Center: hiển thị bảng trạng thái trực quan cho các kênh Environment/Music/Voice và cập nhật theo phát/dừng/fade.
- [x] Audio Center: bổ sung test contract cho upload/filter/playback-status và chạy Vitest, typecheck, build, QA responsive.

### Lịch sử yêu cầu Audio Center — kế thừa
- [x] Mixer đa kênh và fade in/out không dùng oscillator cho âm nền đã triển khai.
- [x] GitHub Pages dùng base `/gocnhocuaong-web/` và workflow theo `main` đã ổn định.

## Audio Center — thùng rác, waveform và sắp xếp
- [x] Tạo màn hình thùng rác audio riêng, liệt kê asset xóa mềm và cho phép khôi phục từng tệp hoặc khôi phục hàng loạt.
- [x] Bổ sung metadata thời lượng và waveform trực quan cho từng tệp audio trong thư viện, có fallback rõ ràng khi trình duyệt không đọc được metadata.
- [x] Thêm kéo thả để sắp xếp thứ tự phát, lưu thứ tự vào profile và cho phép nhóm asset theo chủ đề.
- [x] Bổ sung regression cho trash/restore, waveform/duration, drag-drop/group và chạy TypeScript, Vitest, build, QA responsive.

## Audio Center — xóa vĩnh viễn, waveform tương tác và preset nhóm
- [x] Thêm xóa vĩnh viễn từng tệp hoặc hàng loạt trong thùng rác audio, luôn yêu cầu hộp thoại xác nhận.
- [x] Nâng waveform để hiển thị tiến trình phát trực tiếp và cho phép nhấp vào waveform để tua tới vị trí tương ứng.
- [x] Cho phép lưu nhóm audio thành preset, áp dụng preset và bật/tắt toàn bộ nhóm trong một thao tác.
- [x] Bổ sung regression cho permanent-delete confirmation, waveform seek/progress và group presets; chạy TypeScript, Vitest, build, QA responsive.

## Audio Center — preset tự động và nhật ký thao tác
- [x] Cho phép cấu hình preset âm thanh mặc định theo khung giờ trong ngày và tự động áp dụng khi mở/đang dùng dashboard.
- [x] Cho phép cấu hình preset theo trạng thái hoặc mốc Pomodoro, ưu tiên quy tắc rõ ràng khi có nhiều điều kiện trùng nhau.
- [x] Ghi nhật ký thao tác đối với preset và tệp audio, gồm thời gian, loại thao tác và snapshot đủ để khôi phục.
- [x] Tạo giao diện xem lịch sử, xem chi tiết và khôi phục preset/tệp audio về phiên bản trước.
- [x] Bổ sung regression cho auto preset, conflict resolution, audit log/restore; chạy TypeScript, Vitest, build và QA responsive.

## Audio Center — xem trước quy tắc và sao lưu cục bộ
- [x] Thêm nút xem trước quy tắc để kiểm tra preset được chọn theo thời điểm cụ thể và trạng thái Pomodoro.
- [x] Xuất preset, quy tắc tự động và nhật ký thao tác thành tệp JSON sao lưu cục bộ.
- [x] Nhập tệp JSON có kiểm tra schema, phiên bản, giới hạn dữ liệu và lựa chọn hợp nhất/thay thế an toàn.
- [x] Bổ sung regression cho preview rule và export/import backup; chạy TypeScript, Vitest, build và QA responsive.

## Backup — tên tùy chỉnh và tag
- [x] Cho phép người dùng đặt tên tùy chỉnh cho từng file backup khi xuất dữ liệu.
- [x] Cho phép thêm, sửa và chuẩn hóa danh sách tag cho từng file backup.
- [x] Lưu tên/tag trong metadata gói JSON và bảo toàn khi nhập lại, hợp nhất hoặc thay thế.
- [x] Bổ sung regression cho tên/tag backup, validate metadata và chạy TypeScript, Vitest, build, QA responsive.

## Audit lỗi và gợi ý cải thiện
- [x] Audit tĩnh toàn bộ contract Audio Center, backup tên/tag, persistence, auth, GitHub Pages và responsive.
- [x] Audit runtime logs và các luồng phát audio, upload/trash/restore/permanent-delete, export/import và auto preset.
- [x] Audit trực quan desktop/mobile, khả năng thu gọn, khả năng hiểu trạng thái và lỗi hiển thị.
- [x] Tổng hợp lỗi theo mức độ Critical/High/Medium/Low kèm bằng chứng, cách tái hiện và gợi ý xử lý.

## Sửa lỗi audit và QA Audio Center
- [x] Permanent Delete dọn key/URL, metadata, preset references và audit snapshots để object không còn đường truy cập; physical object delete không được platform hỗ trợ theo storage contract và đã được ghi rõ, không giả vờ cam kết.
- [x] Redact Authorization header, cookie và token nhạy cảm khỏi network log trước khi ghi.
- [x] Lazy-load ExperienceStudio/Audio Center và đo lại kích thước chunk chính sau build.
- [x] QA responsive public shell desktop/mobile và xác nhận Audio Center lazy fallback không phá SSR; QA đăng nhập sâu cần phiên tài khoản hợp lệ.
- [x] Chạy regression/typecheck/build sau bản sửa; 56 test files và 221 tests đạt.
## Audit tiếp theo — redaction và tính nhất quán storage
- [x] Bịt rò rỉ Authorization/Cookie/Token trong network và console debug logs.
- [x] Củng cố Permanent Delete: dọn metadata, preset references và audit snapshot; ghi rõ giới hạn storage object nếu platform chưa có API xóa vật lý.
- [x] Rà soát lazy-load module lớn và đo lại bundle chính.
- [x] Viết regression tests cho redaction và permanent-delete semantics.
- [x] Chạy typecheck, Vitest, production build và QA responsive sau bản sửa.
- [x] Lưu checkpoint sau khi mọi kiểm tra đạt; checkpoint cuối cùng là `3529acb9`, đã tự động publish.

## Audio Center — skeleton, tìm kiếm nâng cao và xác nhận xóa
- [x] Thêm loading skeleton trong lúc lazy-load Audio Center, có fallback accessible và không tự mở lại các mục đã thu gọn.
- [x] Bổ sung tìm kiếm/lọc nâng cao cho thư viện âm thanh theo tên, nguồn, cảm xúc, sự kiện, nhóm, nhãn và trạng thái.
- [x] Hiển thị toast rõ ràng sau permanent delete, nêu rằng metadata/key đã bị loại bỏ và tệp không còn truy cập được theo storage contract.
- [x] Viết regression tests cho skeleton, bộ lọc nâng cao và toast permanent delete.
- [x] Chạy typecheck, Vitest, production build và QA desktop/mobile.
- [x] Xác minh GitHub remote/branch, workflow Pages và URL web; trước checkpoint, main vẫn đang ở commit `0205ee9` và workflow gần nhất thành công là bản audit trước.
- [x] Lưu checkpoint và xác nhận đồng bộ sau khi mọi kiểm tra đạt; phiên bản `43071d25` đã lưu và tự động publish.

## Audio Center — waveform preview, thao tác hàng loạt và tự phát âm nền
- [x] Thêm phát thử trực tiếp trên waveform, có trạng thái đang phát, tiến trình và tua bằng thao tác trên waveform.
- [x] Thêm chọn nhiều tệp và thao tác hàng loạt: xóa mềm, di chuyển/nhóm và gắn thẻ.
- [x] Tự động nhận diện và gợi ý nhãn cho tệp âm thanh mới tải lên, cho phép người dùng xem/chỉnh sửa trước khi lưu.
- [x] Cải thiện tự phát âm nền liên tục từ khi mở trang đến khi đóng web; xử lý autoplay policy, mute preference, cleanup và không phát chồng.
- [x] Viết regression tests cho waveform preview, bulk actions, tag suggestions và autoplay-safe audio lifecycle.
- [x] Chạy typecheck, Vitest, production build và QA desktop/mobile; checkpoint đang được đồng bộ GitHub/Pages.

## Audio Center — volume/mute và tốc độ waveform
- [x] Thêm nút điều chỉnh âm lượng và bật/tắt mute cho âm thanh nền, lưu preference và đồng bộ với playback hiện tại.
- [x] Thêm lựa chọn tốc độ phát waveform preview: 0.5x, 1x, 1.5x, 2x; áp dụng cho audio đang nghe thử và giữ trạng thái dễ hiểu.
- [x] Viết regression tests cho volume/mute và playback rate.
- [x] Chạy typecheck, Vitest, production build và QA desktop/mobile; checkpoint `7eb2bf4f` đã lưu.

## Audio Center — volume status và preset tốc độ theo loại tệp
- [x] Hiển thị phần trăm âm lượng hiện tại trong từng trạng thái đang phát và cập nhật theo mute/slider.
- [x] Bổ sung preset tốc độ mặc định theo loại tệp âm thanh, cho phép áp dụng nhanh nhưng vẫn chọn tốc độ thủ công.
- [x] Viết regression tests cho volume status và speed presets theo loại tệp.
- [x] Chạy typecheck, Vitest, production build và QA desktop/mobile; checkpoint `3a5acbf1` đã lưu.

## Audio Center — tùy chỉnh tốc độ và biểu đồ âm lượng
- [x] Cho phép người dùng tự chỉnh và lưu preset tốc độ mặc định riêng cho từng loại tệp âm thanh.
- [x] Cho phép khôi phục preset tốc độ mặc định và áp dụng preset đã lưu vào waveform preview.
- [x] Hiển thị thanh biểu đồ mức âm lượng trực quan cạnh từng kênh đang phát, phản ánh volume/mute hiện tại.
- [x] Viết regression tests cho tùy chỉnh speed preset và volume meter.
- [x] Chạy typecheck, Vitest, production build và QA desktop/mobile; checkpoint `8fd8cce8` đã lưu.

## Tái cấu trúc mascot/Lumi và ảnh–ghi âm
- [x] Loại vùng hiển thị mascot/Lumi lớn khỏi trang chủ, chỉ giữ nội dung học tập và Audio Center cần thiết.
- [x] Đưa khu vực mascot, Lumi, ảnh và ghi âm vào trang cá nhân; cung cấp đường dẫn quản trị riêng nếu người dùng có quyền.
- [x] Đặt ảnh mascot/Lumi mặc định ở trạng thái “Chưa có ảnh”, không tự gán ảnh mặc định trong hồ sơ mới.
- [x] Sửa luồng tải ảnh: kiểm MIME/kích thước, preview, thay/xóa ảnh, lỗi upload rõ ràng và không lưu trạng thái dở dang.
- [x] Bắt buộc mỗi ảnh người dùng thêm phải có bản ghi âm do người dùng tự ghi âm liên kết với ảnh trước khi kích hoạt.
- [x] Cho phép nhấn vào ảnh để phát bản ghi âm liên kết, có nút phát/ghi âm riêng ở góc ảnh và hỗ trợ lời động viên/an ủi Lumi kèm ảnh.
- [x] Bổ sung regression tests cho route, trạng thái chưa có ảnh, upload ảnh, liên kết audio và phát khi nhấn ảnh.
- [x] Chạy typecheck, Vitest, production build, QA desktop/mobile và lưu checkpoint mới.

- [x] Di chuyển EmotionCompanionMediaControls khỏi Dashboard/ExperienceStudio sang Account.
- [x] Giữ Dashboard tập trung vào Audio Center và không hiển thị khu chỉnh sửa mascot/Lumi.
- [x] Bảo đảm Mascot và Lumi khởi đầu ở trạng thái “Chưa có ảnh”, không dùng ảnh mặc định.
- [x] Bắt buộc có ít nhất một bản ghi âm do người dùng ghi trước khi tải ảnh Lumi theo cảm xúc.
- [x] Gắn ảnh Lumi với bản thu cụ thể và giữ liên kết khi thay đổi ảnh đại diện bản thu.
- [x] Cho phép nhấn ảnh Lumi/bản thu để phát đúng âm thanh liên kết.
- [x] Bảo đảm nút phát âm thanh trên từng ảnh không phát chồng hoặc tạo vòng lặp ngoài ý muốn.
- [x] Sửa thông báo, trạng thái loading/lỗi và luồng upload ảnh mascot/Lumi.
- [x] Bổ sung regression tests cho relocation, no-image, audio-image linkage và click-to-play.
- [x] Chạy Vitest, typecheck, production build và QA responsive desktop/mobile.
- [x] Đọc lại todo.md, đánh dấu toàn bộ hạng mục hoàn tất trước checkpoint.

## UX mobile — loading và cải thiện trải nghiệm
- [x] Thêm trạng thái loading rõ ràng trong lúc ghi âm Lumi trên thiết bị di động.
- [x] Thêm trạng thái loading/progress khi tải ảnh Mascot hoặc Lumi lên storage.
- [x] Khóa thao tác trùng trong lúc ghi âm và upload, có trạng thái lỗi có thể thử lại.
- [x] Bổ sung regression tests cho loading ghi âm/upload và accessibility mobile.
- [x] Chạy typecheck, Vitest, production build và QA responsive sau thay đổi.
- [x] Tổng hợp các góp ý UX ưu tiên cho website.
