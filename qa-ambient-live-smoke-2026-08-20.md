# QA live Audio Center — 2026-08-20

## Kết quả

GitHub Pages `https://yen0110122009-cell.github.io/gocnhocuaong-web/` sau cache-busting đã tải đúng frontend, không còn màn hình trắng. Form cloud-state đăng nhập bằng tài khoản `Ong` / mã `111` đi tới dashboard; hồ sơ hiển thị `Ong`, `Founder`, mã `111`, cấp 1.

Audio Center trên trang chủ hiển thị độc lập hai lựa chọn **Mưa rơi** và **Lật sách**, mỗi lựa chọn có nút **Nghe thử**, **Tải file** và badge health-check. Asset lật sách dùng storage path `ambient-book-pages-default_790e9c11.wav`.

## Media smoke test

Nút **Nghe thử** tiếng mưa đã được nhấn trên live Pages. Kiểm tra `Audio` trong console ghi nhận `readyState: 0`, `networkState: 3`, `MediaError.code: 4` tại thời điểm kiểm tra. Kiểm tra HTTP độc lập cho endpoint storage sau nhiều lần truy cập ghi nhận `429 Too Many Requests` từ storage proxy; vì vậy lỗi media code 4 trong phiên QA được phân loại là rate-limit tạm thời của proxy, không phải 404 hoặc file thiếu.

Các URL backend trả redirect 307 tới signed CloudFront URL trước khi bị rate-limit. File nguồn đã được kiểm tra là WAV PCM hợp lệ: rain stereo 44.1 kHz, book mono 44.1 kHz. Health-check runtime có timeout 7 giây và luôn lưu `checkedAt` để UI hiển thị thời điểm kiểm tra gần nhất.

## Build / deploy

GitHub Actions workflow `32386085521` cho commit `eebc8d99898c8a2c6b01b3f66954c02583e29d51` hoàn tất `success`. Regression đạt 62 test files / 251 tests; TypeScript và production build đạt.

## Khuyến nghị kiểm tra lại

Nếu người dùng vẫn gặp lỗi phát, thử lại sau khi storage proxy hết rate-limit hoặc dùng nút nghe thử lần nữa; health badge sẽ hiển thị trạng thái lỗi cùng thời điểm kiểm tra thay vì treo ở “Đang kiểm tra URL”.

> Không đưa Authorization header vào client hoặc network log; signed URL chỉ do backend proxy tạo.

---
