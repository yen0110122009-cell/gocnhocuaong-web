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
