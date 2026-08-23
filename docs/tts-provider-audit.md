
# Audit nhà cung cấp TTS tiếng Việt

## FPT AI Text to Speech

Nguồn chính thức: https://fptcloud.com/product/fpt-ai-text-to-speech/

Trang FPT Cloud mô tả FPT AI Text to Speech là dịch vụ chuyển văn bản thành giọng nói tiếng Việt, có lựa chọn giọng nam/nữ và ngữ âm Bắc, Trung, Nam. Trang cũng nêu dịch vụ có thể truy cập dưới dạng API và tích hợp trên nhiều hệ thống, ứng dụng và thiết bị. Đây là ứng viên phù hợp nếu ưu tiên giọng Việt theo vùng miền và nhà cung cấp trong nước. Trang sản phẩm không hiển thị đầy đủ endpoint/auth contract trong nội dung đã đọc; cần lấy API reference/credential từ console hoặc tài liệu chính thức trước khi viết Edge Function.

## Google Cloud Text-to-Speech

Nguồn chính thức: https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types

Tài liệu chính thức liệt kê các voice `vi-VN`, gồm các nhóm voice cao cấp và voice tổng quát. Có thể gọi qua HTTPS từ Supabase Edge Function bằng secret server-side. Cần tạo Google Cloud project, bật Cloud Text-to-Speech API và lưu credential trong Supabase Edge Function secret; không đưa key vào GitHub Pages.

## Supabase Edge Function design constraints

Edge Function nên nhận text đã giới hạn kích thước, kiểm tra ngôn ngữ/đầu vào, gọi provider bằng secret, trả audio bytes hoặc URL có thời hạn, thêm cache theo hash text+voice và giới hạn tốc độ. Không nên proxy trực tiếp bằng frontend key. Cần kiểm tra điều khoản dữ liệu, giá, quota và định dạng audio của provider trước khi bật production.

## Viettel AI Text to Speech

Nguồn chính thức: https://viettelai.vn/en/tai-lieu và https://viettelai.vn/en/chuyen-giong-noi

Trang tài liệu Viettel AI có mục API TTS và mô tả dịch vụ chuyển văn bản thành giọng nói tiếng Việt với đa dạng giọng vùng miền. Đây là ứng viên phù hợp nếu ưu tiên nhà cung cấp Việt Nam và cần giọng địa phương. Cần đăng nhập/đăng ký để lấy thông tin endpoint, token, quota và bảng giá chính thức.

## Google Cloud voice catalog

Trang tài liệu Google Cloud được mở trực tiếp và cho thấy Cloud TTS có các nhóm voice Standard, WaveNet, Neural2, Studio và Chirp 3: HD; tài liệu hướng dẫn chỉ định voice trong request tổng hợp. Phần danh sách voice hỗ trợ tra cứu theo ngôn ngữ, trong đó có mã ngôn ngữ `vi-VN`. Google có tài liệu REST API chính thức tại https://docs.cloud.google.com/text-to-speech/docs/reference/rest.
