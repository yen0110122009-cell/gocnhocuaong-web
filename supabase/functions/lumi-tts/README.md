# Lumi TTS Edge Function

Function `lumi-tts` nhận `POST` JSON với trường `text`, gọi Google Cloud Text-to-Speech từng đoạn và trả về một file `audio/wav` đã ghép nối.

## Cấu hình secret

Không đặt key trong GitHub Pages hoặc file `.env` frontend. Tạo Google Cloud API key có quyền gọi Text-to-Speech API, sau đó lưu ở Supabase Edge Function secrets với tên `GOOGLE_TTS_API_KEY`.

```bash
supabase secrets set GOOGLE_TTS_API_KEY="<API_KEY_THAT>"
supabase secrets set LUMI_TTS_ALLOWED_ORIGINS="https://yen0110122009-cell.github.io,http://localhost:5173"
```

Nếu dùng Supabase Dashboard, vào **Edge Functions → Secrets** và tạo đúng hai tên secret trên. Không commit giá trị secret vào Git.

## Request

```json
{
  "text": "Một đoạn văn tiếng Việt dài có thể gồm nhiều câu và nhiều đoạn.",
  "voiceName": "vi-VN-Wavenet-A",
  "speakingRate": 0.96,
  "pitch": 1.08
}
```

Function tự chia theo đoạn/câu, giới hạn kích thước từng request gửi Google, gọi tuần tự, trích phần PCM của từng WAV và tạo một RIFF/WAV duy nhất. Văn bản được giữ nguyên về nội dung; giới hạn 1 MB là giới hạn an toàn của HTTP/Edge Function, không phải giới hạn nhập liệu của giao diện Lumi.

## Bảo mật và vận hành

Function đang dùng `verify_jwt=false` để tương thích frontend GitHub Pages hiện chưa dùng Supabase Auth JWT. Vì vậy function kiểm tra `Origin`, giới hạn tần suất theo địa chỉ chuyển tiếp và chỉ sử dụng API key server-side. Khi app chuyển sang Supabase Auth, nên bật lại `verify_jwt=true` và yêu cầu bearer token.

Nếu chưa có `GOOGLE_TTS_API_KEY`, function trả `503`; client Lumi tự fallback sang Web Speech nhưng vẫn chỉ chọn voice tiếng Việt, không đọc fallback bằng tiếng Anh.
