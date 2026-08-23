# Chuẩn bị Supabase Realtime theo từng tài khoản

## Phạm vi

Migration `20260823170000_prepare_profile_realtime_state.sql` chỉ tạo thêm bảng `public.profile_sync_state`, trigger cập nhật thời gian, policy RLS và đăng ký bảng vào publication `supabase_realtime` nếu publication này tồn tại. Migration **không đọc, sửa, di chuyển hoặc xóa** dòng `public.app_state` hiện tại.

> Đây là bước chuẩn bị hạ tầng, chưa phải bước chuyển ứng dụng sang realtime. Ứng dụng hiện tại vẫn đọc/ghi `app_state` qua REST để bảo toàn tương thích.

## Điều kiện trước khi chạy

Project đã kiểm tra là project active `cuompgnxcbzufaeodgvx` (tên dashboard: `Ong`). Bảng `app_state` hiện có một dòng toàn cục và policy `anon` cho phép đọc/ghi; publication `supabase_realtime` hiện chưa có bảng public nào. Project cũng đã có các bảng `study_accounts`/`study_profiles` gắn với `auth.users`, nhưng luồng đăng nhập của app cũ cần được chuyển sang Supabase Auth trước khi dùng bảng mới.

Migration được thiết kế cho `authenticated` và dùng `auth.uid()` để mỗi người chỉ đọc/ghi row của mình. Không cấp quyền `anon` cho bảng mới. Không đưa service-role key vào GitHub Pages.

## Cách chạy

Mở Supabase Dashboard của project `Ong`, vào **SQL Editor**, xem lại toàn bộ file migration rồi chạy một lần. Hoặc dùng Supabase CLI trong quy trình migration của dự án nếu bạn đang quản lý schema bằng CLI. Sau khi chạy, kiểm tra bảng mới có RLS bật, các policy owner tồn tại và bảng xuất hiện trong publication `supabase_realtime`.

Không chạy migration này vào project khác. Không chạy bước backfill từ `app_state` ở thời điểm này vì account ID cũ trong payload JSON chưa có mapping đáng tin cậy với `auth.users`.

## Bước ứng dụng tiếp theo

1. Bổ sung/hoàn thiện Supabase Auth để session browser có JWT thật.
2. Map mỗi account cũ sang một `auth.users.id` đã xác minh.
3. Viết job backfill có kiểm tra và snapshot trước khi sao chép profile sang `profile_sync_state`.
4. Thay REST whole-payload bằng đọc/ghi row riêng và dùng optimistic concurrency theo `revision`.
5. Subscribe Realtime theo `auth_user_id`; chỉ sau khi kiểm thử RLS trên một tài khoản thử nghiệm mới bật production.

## Rollback hạ tầng

Nếu chưa có dữ liệu mới, có thể rollback bằng cách xóa trigger, policy và bảng `profile_sync_state` trong một migration riêng sau khi xác nhận không có code production nào sử dụng bảng đó. Không xóa `app_state`. Nếu đã có dữ liệu, phải export/snapshot bảng mới trước và chỉ rollback sau khi có kế hoạch phục hồi.

## Nguồn kỹ thuật

Supabase mô tả Postgres Changes là listener trên các thay đổi Postgres; bảng cần nằm trong publication `supabase_realtime` và bản ghi vẫn chịu RLS. Supabase hiện khuyến nghị Broadcast cho quy mô/bảo mật cao hơn, nhưng private Broadcast cần RLS trên `realtime.messages` và JWT hợp lệ.

- https://supabase.com/docs/guides/realtime/postgres-changes
- https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
- https://supabase.com/docs/guides/realtime/authorization
