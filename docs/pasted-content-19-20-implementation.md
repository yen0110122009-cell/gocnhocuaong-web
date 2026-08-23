# Palette 18 tone và Theme lễ hội

Nguồn yêu cầu: `pasted_content_19.txt` và `pasted_content_20.txt` do người dùng đính kèm ngày 23-08-2026.

## Tiêu chí triển khai

Hệ giao diện phải cung cấp 18 tone với hai biến thể sáng/tối, trong đó token nền, chữ, bề mặt, viền, màu chính và màu nhấn luôn được áp dụng đồng bộ. Bốn tone màn đêm hoặc huyền bí cần nền hiệu ứng CSS không chặn tương tác: `bg-starry-twinkle` cho Rừng Đêm Huyền Bí, Chàm Đêm và Vũ Trụ; `bg-aurora-glow` cho Cực Quang. Các hiệu ứng phải tôn trọng `prefers-reduced-motion`.

Mỗi trong 14 theme lễ hội cần giữ bảng màu sáng/tối tương phản cao, mô tả âm thanh của theme và ba tùy chọn độc lập, được lưu cùng hồ sơ:

| Cờ | Phạm vi khi tắt |
| --- | --- |
| `enableThemeTone` | Không áp dụng token màu của theme, nhưng vẫn giữ theme được chọn. |
| `enableAmbientAudio` | Không phát hoặc tải lại âm nền theme. |
| `enableVFX` | Không render linh vật và icon trang trí của theme. |

Không bổ sung URL âm thanh tự tạo. Audio chỉ phát sau cử chỉ người dùng, giữ một phần tử audio và dừng an toàn khi nguồn chính/fallback đều không tải được.
