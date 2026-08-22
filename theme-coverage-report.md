# Theme Coverage Report

## Nguồn đã đối chiếu

- `/home/ubuntu/upload/pasted_content.txt`
- `/home/ubuntu/upload/pasted_content_2.txt`
- `/home/ubuntu/upload/pasted_content_3.txt`
- `/home/ubuntu/upload/pasted_content_4.txt`
- `/home/ubuntu/upload/pasted_content_5.txt`
- `/home/ubuntu/upload/pasted_content_6.txt`
- `theme-audit-input.md`, `theme-audit-input.txt`, `theme-audit-input-6.md`
- `missing-ideas-audit.md`

## Kết luận coverage

| Nhóm | Ý tưởng/theme | Hợp đồng scene | Hiển thị UI | Audio BGM trực tiếp |
|---|---|---:|---:|---:|
| Thời tiết bản mới | Mùa Xuân, Mùa Hạ, Mùa Thu, Mùa Đông, Halloween, Tết, Sấm Chớp, Mưa, Nắng, Sương Mù | Có | Có/đang lọc | Có URL trong `pasted_content_6` |
| Thời tiết bản cũ | `rainy_season`, `stormy_season`, `morning_chill` | Có | Có/đang lọc | Có URL trực tiếp |
| Cảnh kể chuyện/audio | Núi Lửa, Đại Dương Sâu, Rừng Phép Thuật, Trạm Vũ Trụ, Cánh Đồng Hoa, Lâu Đài, Gánh Xiếc, Khủng Long, Cyberpunk, Lễ Hội Ẩm Thực, Halloween, Chuyến Bay | Có phần lớn | Một số bị ẩn | Phần lớn chỉ có style/SFX filename, chưa có URL BGM |
| Theme mở rộng | Pixel, Hải tặc, Thể thao, Disco, Phòng Thí nghiệm, Ai Cập, Steampunk, Nghệ thuật, Ninja, Cà phê, AI, Gấu Bông | Có | Đang bị audio filter ẩn một phần | Chỉ Cà phê có URL trực tiếp; nhóm còn lại mới có mô tả/style |
| Theme trước đó | Công viên, Bình Minh, Núi Hoàng Hôn, Sao Băng & Băng, Dải Ngân Hà, Đô thị, Cầu Đêm, Sương Mù, Pháo Hoa, Sa Mạc, Rừng Xanh, Hoàng Hôn, Không Gian, Trăng Non, Biển, Neon, Sakura, Thu, Lễ Hội, v.v. | Có nhiều phần | Không đồng đều | Không đồng đều |
| Catalog phụ | Soundscape thiên nhiên/không gian/thư giãn/tập trung; preset cá nhân | Có module riêng | Có nhưng dropdown còn nhỏ | Dùng fallback/mixer, không phải toàn bộ theme |

## Vấn đề khiến người dùng thấy thiếu nhiều ý tưởng

1. `shared/study.ts` đã có nhiều ID scene, nhưng `Home.tsx` và `ExperienceStudio.tsx` giới hạn bộ chọn bằng `AUDIO_BACKED_SCENE_IDS`, nên các theme chỉ có style/SFX filename bị ẩn.
2. `defaultAmbient.ts` có URL trực tiếp cho một số theme, nhưng không phải tất cả theme trong bảng mô tả audio. Không được tự tạo URL hoặc giả âm thanh cho nhóm chưa có nguồn.
3. `PersonalStudySpaceControls.tsx` vẫn chỉ hiển thị 5 scene legacy trong dropdown preset, tạo cảm giác catalog bị thiếu dù hợp đồng shared đã lớn hơn.
4. `pasted_content_6.txt` là bản mới nhất cho 10 theme thời tiết, cần ưu tiên mô tả/màu/hiệu ứng ở đó khi trùng bản cũ.
5. Các ví dụ overlay trong nguồn chỉ là minh họa; không bê nguyên lớp phủ đậm hoặc z-index cao. Mọi overlay thực tế phải nhẹ, `pointer-events: none`, không che chữ/menu và có reduced-motion.

## Quyết định triển khai cần giữ

- Không tự nhận theme có audio nếu chỉ có tên file SFX hoặc mô tả phong cách mà không có URL BGM trực tiếp.
- Cần tách rõ hai trạng thái: `catalog scene đã có trong hợp đồng` và `theme được bật trong picker audio-backed`.
- Để đáp ứng phàn nàn “thiếu ý tưởng”, UI cần cho phép xem toàn bộ catalog scene; với theme không có URL BGM thì hiển thị rõ “Chưa có âm nền được cung cấp” thay vì âm thanh giả, hoặc chỉ loại khỏi picker audio nếu yêu cầu audio-only được giữ.
- Giữ audio lời Lumi và âm báo Pomodoro độc lập với BGM theme.


## Cập nhật sau checkpoint catalog đầy đủ

| Hạng mục kiểm tra | Kết quả hiện tại |
|---|---|
| Nguồn tham chiếu | Đã kiểm kê 6 `pasted_content` cùng các audit nội bộ; các ảnh được dùng làm tham chiếu ý tưởng, không đưa ảnh watermark vào theme. |
| Catalog UI | `AppearanceStudio` dùng `AMBIENT_SCENE_IDS` làm nguồn và render `fullCatalogSceneCards`, nên toàn bộ scene trong contract đều hiển thị, kể cả scene không có BGM. |
| Audio | Chỉ các ID có URL trực tiếp trong `AUDIO_BACKED_SCENE_AUDIO` mở popup nghe thử/bật tắt/âm lượng; scene còn lại ghi rõ “Chỉ giao diện”. |
| Persistence | `normalizeProfile` dùng `AMBIENT_SCENE_IDS` cho scene mặc định, time rules và volume map; scene hyphenated được giữ sau reload. |
| Tương phản/interaction | Thẻ có trạng thái active rõ ràng, nhãn audio có icon, focus ring, overlay không cản tương tác và reduced-motion được giữ theo regression hiện có. |
| UNMAPPED_SOURCE | 0 đối với các scene/ý tưởng đã được chuẩn hóa thành scene contract; các nguồn chỉ mô tả audio nhưng không có URL vẫn được ghi nhận là visual-only, không tự tạo audio. |
