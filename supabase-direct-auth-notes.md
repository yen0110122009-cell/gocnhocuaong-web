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
