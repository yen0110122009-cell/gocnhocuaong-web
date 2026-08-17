# Ghi chú rà soát Supabase trực tiếp

- Project được chọn: `Ong`, project ref `cuompgnxcbzufaeodgvx`, trạng thái `ACTIVE_HEALTHY`, region `ap-northeast-1`.
- Connector Supabase MCP đang bật; Supabase API connector riêng đang tắt.
- Frontend đã có `client/src/lib/supabase.ts` dùng `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`, với `persistSession`, `autoRefreshToken`, `detectSessionInUrl`.
- Frontend đã có `client/src/lib/supabaseStudyStore.ts` cho `study_profiles`, `flashcard_decks`, `quiz_attempts` theo `auth.uid()`.
- Kết quả list_tables xác nhận các bảng public hiện hữu có RLS bật; output MCP bị dài/truncated nên cần truy vấn có chọn cột cụ thể trước khi thiết kế migration.
- Không được đặt service-role key trong frontend; chỉ dùng publishable key và RLS.

## Phát hiện quan trọng
Backend hiện xác thực bằng bảng Drizzle `study_accounts` trong MySQL/TiDB và hash `scrypt` (`salt:derived`), với mã + tên + mật khẩu; mã `111` có thể tự tạo tài khoản theo tên. Supabase public `study_accounts` chỉ có `user_id`, `account_code`, `display_name`, `role`, trạng thái khóa và metadata, không có password hash. Vì vậy không thể chuyển login hiện tại sang Supabase Auth chỉ bằng cách đổi client: cần chiến lược migration/password reset hoặc một Edge Function/server-side bridge. Tuyệt đối không đưa password hash hay service-role key vào GitHub Pages.

## Quyết định phương án 2B
Bản GitHub Pages sẽ dùng Supabase Auth email/password. Form đăng ký cần email, tên hiển thị, mã tài khoản và mật khẩu; sau khi xác thực, hồ sơ `study_accounts` liên kết bằng `auth.uid()`. Tài khoản đăng ký từ Pages mặc định là Member; quyền Founder/Admin chỉ được cấp bằng backend/quản trị an toàn. Mã `111` được cho phép trùng, không bị khóa ở UI/API; việc cấp vai trò đặc biệt vẫn không giao cho client public. Luồng cũ trên Manus giữ nguyên.

## Đối chiếu file 12.html — 2026-08-17

File mẫu `/home/ubuntu/upload/12.html` có cấu hình Supabase REST trực tiếp ở khoảng dòng 1217–1238:

- Supabase URL: `https://cuompgnxcbzufaeodgvx.supabase.co`
- REST base: `https://cuompgnxcbzufaeodgvx.supabase.co/rest/v1`
- Bảng đồng bộ chính: `app_state`
- Khóa dòng: `global_state`
- Header dùng `apikey` và `Authorization: Bearer` cùng publishable key.
- Tuy nhiên luồng đăng nhập ở khoảng dòng 1290–1418 không gọi Supabase Auth. Nó đọc/ghi `state` trong browser, giữ session bằng `sessionStorage` với key `study_tracker_session_v1`, và dùng Supabase REST cloud sync cho `app_state`. Tài khoản/role/password được kiểm tra trong state của file, không phải Supabase Auth email/password.
- Luồng login là Tên + Mật khẩu + Mã; mã `111` dùng Founder, mã `999` dùng Admin, thành viên dùng `memberAccounts`; mật khẩu lần đầu có thể được khởi tạo trong state.

Kết luận: 12.html “lưu trên Supabase” ở phần cloud sync, nhưng auth không email là custom client-side state + REST sync, khác với Supabase Auth. Cần kiểm tra RLS và cấu hình app trước khi chọn cách tương thích an toàn; không đưa password hash/service-role key vào GitHub Pages.

## Cloud-sync V2 implementation detail

`12.html` đọc `app_state?id=eq.global_state&select=payload`, dùng payload JSON trực tiếp; khi ghi, tạo snapshot gồm state/session-stripped và external stores, rồi PATCH `app_state?id=eq.global_state` với `{payload}` và header `Prefer: return=minimal`. Nếu chưa có dòng, POST `{id: 'global_state', payload: ...}`. Các thao tác đều dùng publishable key ở header `apikey` và `Authorization: Bearer`.

## Đối chiếu cloud-sync 12.html — chi tiết REST
Nguồn: `/home/ubuntu/upload/12.html`, dòng 4573–4762.

`12.html` dùng Supabase REST trực tiếp với `https://cuompgnxcbzufaeodgvx.supabase.co/rest/v1/app_state`, bản ghi `id=global_state`, header `apikey` và `Authorization: Bearer` bằng publishable key. GET đọc `payload`; nếu chưa có bản ghi thì POST `{ id: global_state, payload }`; khi đã có thì PATCH theo `id=eq.global_state`. Payload chứa toàn bộ state, kèm metadata `__studyEmpireSync` và external stores. Cơ chế này không dùng Supabase Auth email; state/auth không email được lưu trong cloud payload. Đây là mô hình demo với RLS anon cho phép SELECT/INSERT/UPDATE và không phù hợp cho dữ liệu nhạy cảm.
