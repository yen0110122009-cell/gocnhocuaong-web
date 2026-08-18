# Checklist kiểm tra tính toàn vẹn và minh bạch

Mỗi module được đánh giá theo bốn trạng thái: **Đạt / Chưa đạt / Thiếu / Sai**. Kết quả regression hiện tại được ghi ở cột Đánh giá.

| Module | Đạt | Chưa đạt | Thiếu | Sai | Đánh giá hiện tại |
|---|---|---|---|---|---|
| 1. Catalog 900 thành tích | 900 mục, 9 nhóm, toàn bộ công khai | Có mục bị ẩn | Thiếu trường bắt buộc | Sai số lượng/nhóm | Đạt — regression catalog |
| 2. Catalog 400 danh hiệu | 400 mốc cuối, hiển thị trước, có giải thích | Danh hiệu bị giấu | Thiếu nguồn cảm hứng/điều kiện | Gán sai nhóm hoặc phần thưởng | Đạt — regression catalog |
| 3. Điều kiện và tiến độ | Có progress, target, nhiều điều kiện độc lập | Chỉ hiển thị trạng thái | Thiếu điều kiện hoặc evidence | Tính phần trăm sai | Đạt — regression achievement |
| 4. XP và level | 300 XP/cấp, không giới hạn, không trừ XP | Có deduction | Thiếu tên cấp/quản trị | Sai ngưỡng cấp | Đạt — regression progress |
| 5. Sáu cấp mảnh | Giá trị cấu hình, cấp cao luôn lớn hơn | Giá trị bằng/thấp hơn | Thiếu tier hoặc value | Ledger tính sai | Đạt — regression economy |
| 6. Reward claim | Claim key duy nhất, receipt và thời điểm nhận | Retry nhận thêm | Thiếu receipt | Claim trùng | Đạt — 3 integrity tests |
| 7. Transaction metadata | id, source type, source id, reason, claim key, thời gian | Giao dịch không truy vết | Legacy thiếu fallback | Gán sai nguồn | Đạt — regression integrity; legacy hiển thị rõ |
| 8. Ledger và số dư | Kiểm tra trước khi spend/exchange, không âm | Có số âm | Thiếu kiểm tra cạnh tranh ở DB thật | Race condition chưa mô phỏng server | Đạt — unit invariant; cần QA concurrency backend |
| 9. Audit log | Grant, exchange và receipt có audit | Hành động không ghi | Thiếu admin revoke/spend runtime | Audit trùng hoặc sai entity | Đạt một phần — grant/exchange; cần hoàn thiện các luồng admin |
| 10. Nhân vật lịch sử | Mảnh mở hồ sơ, có nguồn xác minh | Ghép tranh | Thiếu nguồn/timeline | Tiểu sử sai nguồn | Đạt — UI cảnh báo nguồn |
| 11. Event và reward catalog | Admin CRUD, mục tiêu, nhiệm vụ, giới hạn, phần thưởng | Event chỉ là text | Thiếu field CRUD | Phần thưởng không rõ | Đạt — regression/Admin QA |
| 12. Cửa hàng và quy đổi | Giá, currency, stock, rarity, tỷ lệ cấu hình | Tự đặt tỷ lệ | Thiếu lịch sử purchase | Trừ sai số dư | Đạt — regression economy |
| 13. Lịch sử giao dịch | Hiển thị nguồn, source type/id, reason, loại, cấp, số lượng | Giao dịch biến mất | Thiếu phân trang | Hiển thị dấu âm sai | Đạt — UI contract/build |
| 14. Mobile/responsive | Bảng cuộn ngang, card không tràn | Vỡ layout | Thiếu browser mobile QA sâu | Mất nội dung | Chưa đạt — cần screenshot mobile |
| 15. Cloud-state tương thích | Legacy fallback không crash | State cũ gây lỗi | Migration dữ liệu cũ chưa backfill | Merge ghi đè claim | Đạt — typecheck/regression; cần QA dữ liệu thật |

## Invariants bắt buộc

| Invariant | Cách kiểm tra |
|---|---|
| Không nhận thưởng hai lần | Cùng `claimKey` phải trả `already_claimed`, không tăng ledger, không thêm transaction/audit |
| Không có mảnh âm | Mọi spend/exchange kiểm tra số dư trước; mọi ledger output phải có giá trị không âm |
| Giao dịch có nguồn | `sourceType`, `sourceId`, `reason`, `occurredAt`, `claimKey` phải hiện diện hoặc có fallback legacy rõ ràng |
| Audit không trùng | Cùng entity/action/thời điểm không tạo bản ghi audit thứ hai |
| Mảnh cấp cao có giá trị cao hơn | Cấu hình tier values phải tăng nghiêm ngặt từ I đến VI |
| Không có phần thưởng ẩn | Achievement/title/reward/event/shop đều phải hiển thị điều kiện và phần thưởng |

## Kết quả kiểm thử tự động hiện tại

- **38 file test, 124 test đạt**.
- **TypeScript `--noEmit` đạt**.
- **Production build đạt**.
- Còn cần kiểm tra bổ sung: concurrency ở lớp persistence/backend, admin revoke/spend audit đầy đủ, dữ liệu nhân vật lịch sử đã kiểm chứng và screenshot mobile.
