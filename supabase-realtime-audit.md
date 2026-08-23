# Audit Supabase realtime

## Hiện trạng

Ứng dụng GitHub Pages đang dùng Supabase REST qua `@supabase/supabase-js` và biến `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`. Dữ liệu được lưu trong một dòng `public.app_state` có `id = global_state`; toàn bộ accounts, profiles và config nằm trong payload JSON dưới khóa `__gocnhocuaong`. Các hàm `cloudLoadProfile` và `cloudSaveProfile` hiện đọc/ghi toàn bộ payload, nên có rủi ro last-write-wins khi nhiều thiết bị lưu gần đồng thời.

Ứng dụng hiện có cơ chế tài khoản riêng ở phía client: session token được tạo trong trình duyệt và lưu ở `sessionStorage`, không phải Supabase Auth JWT. Vì vậy không thể tự động dùng RLS theo `auth.uid()` cho kênh riêng mà không thay đổi mô hình xác thực.

## Kết quả tài liệu chính thức

Supabase Realtime hỗ trợ Postgres Changes qua channel WebSocket; bảng phải được thêm vào publication `supabase_realtime`, và các bản ghi gửi đến client vẫn chịu RLS. Supabase hiện khuyến nghị Broadcast cho khả năng mở rộng/bảo mật tốt hơn Postgres Changes, nhưng Broadcast private cần RLS trên `realtime.messages` và một JWT xác thực phù hợp.

## Kết luận kỹ thuật

Có thể giữ nguyên Supabase làm backend. Tuy nhiên không nên chỉ subscribe public vào `app_state`, vì mỗi thay đổi sẽ phát toàn bộ accounts/profiles/config và không giải quyết xung đột ghi. Phương án an toàn là tạo bảng theo tài khoản, ví dụ `profile_state(account_id primary key, profile jsonb, updated_at timestamptz, version bigint)`, chuyển dần dữ liệu từ payload cũ, dùng Supabase Auth hoặc một proxy server để cấp quyền theo tài khoản, bật RLS, rồi dùng Realtime trên các row riêng của tài khoản. Nên dùng Postgres Changes cho bản MVP nhỏ; dùng Broadcast private sau khi hoàn thiện Auth/RLS nếu cần mở rộng.

Không được triển khai migration hoặc bật realtime production chỉ bằng publishable key từ GitHub Pages nếu chưa có quyền SQL/RLS và chưa xác nhận schema của project. Không được in hoặc nhúng service-role key vào frontend.

## Nguồn

1. https://supabase.com/docs/guides/realtime/postgres-changes
2. https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
3. https://supabase.com/docs/guides/realtime/authorization
