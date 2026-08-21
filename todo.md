# Project TODO

- [x] Hoàn tất bốn cảnh Mùa hè, Mùa xuân, Tết và Halloween.
- [x] Bổ sung điều khiển mật độ lá/tuyết/nước, kéo thả người tuyết và lịch cảnh tự động.
- [x] Mở rộng tone giao diện, tăng tương phản chữ và đồng bộ màu cấp độ.

## Tinh chỉnh mật độ và bố cục cảnh lần tiếp theo
- [x] Thu nhỏ, giãn thưa và giảm mật độ hạt mưa, vũng nước cùng lá rơi.
- [x] Làm mây xám đen dày hơn và bảo đảm tia sét xuất hiện rõ trong cảnh Sấm chớp.
- [x] Khôi phục sắc Mùa xuân cũ, làm nền Tết sáng hơn và bổ sung icon bánh ở đáy.
- [x] Cải thiện Buổi sáng, thay người tuyết bằng icon và khôi phục nền đáy Halloween trước đó.
- [x] Áp dụng ngôn ngữ thẻ bo tròn, biểu tượng dễ nhận biết và lớp cảnh đáy tinh gọn theo mẫu tham khảo, không sao chép nguyên mẫu.
- [x] Bổ sung regression tests, xác minh responsive, TypeScript, Vitest và production build.
- [x] Đồng bộ shell, menu, header và chữ đang dùng màu cứng sang token cảnh để theme áp dụng nhất quán.
- [x] Bổ sung regression test cho việc shell dùng token cảnh.
- [x] Lưu checkpoint phát hành tinh chỉnh mật độ/bố cục cảnh.

## Chuẩn hóa lớp phủ cảnh toàn giao diện
- [x] Duy trì lớp phủ fixed, pointer-events:none và z-index cao cho hiệu ứng xuyên qua menu, thanh điều hướng và nội dung.
- [x] Đồng bộ các bảng màu Thu, Hè, Halloween, Tuyết, Mưa và Xuân theo hướng dẫn mới, có bảo đảm tương phản chữ.
- [x] Giữ hiệu ứng tiết chế: lá/hoa/tuyết/mưa thưa, mặt trời và gợn nước cố định, ma bay theo nhịp thưa.
- [x] Kiểm thử lại full suite, TypeScript, production build và phát hành checkpoint chuẩn hóa cảnh.

## Kho linh vật emoji trong Giao diện & tone màu
- [x] Rà soát dữ liệu hồ sơ, mục Giao diện & tone màu và các lớp phủ cảnh hiện có.
- [x] Tạo kho emoji có danh sách cuộn, chọn linh vật và hỗ trợ bàn phím.
- [x] Cho phép kéo thả bằng chuột/cảm ứng, thả rơi về đáy và giới hạn vị trí trong màn hình.
- [x] Lưu linh vật cùng vị trí cá nhân, có nút xóa/đặt lại và không cản các nút học tập.
- [x] Bổ sung Vitest, kiểm tra TypeScript, production build, responsive và lưu checkpoint phát hành.

## Theme Sa mạc và Cảnh đêm
- [x] Rà soát loại scene, dữ liệu hồ sơ và lớp phủ fixed hiện có để mở rộng tương thích.
- [x] Thêm cảnh Sa mạc với bảng màu cát/nâu, mặt trời và xương rồng cố định.
- [x] Thêm cảnh Cảnh đêm với nền xanh than, đèn vàng và màn sương nhẹ.
- [x] Chuẩn hóa lại cảnh Sấm chớp theo lớp mây tối, sét ngang và token chữ tương phản.
- [x] Bổ sung lựa chọn trong Giao diện & tone màu, giữ reduced-motion và pointer-events:none.
- [x] Bổ sung regression, kiểm tra TypeScript, production build, responsive và lưu checkpoint phát hành.

## Bộ 14 theme Giao diện & tone màu
- [x] Chuẩn hóa 14 theme: Sa mạc, Rừng xanh, Cảnh đêm, Mưa giông, Tuyết, Hoàng hôn, Không gian, Trăng non, Biển, Neon, Sakura, Thu, Pháo hoa và Lễ hội.
- [x] Mở rộng kiểu scene, dữ liệu hồ sơ, preset và bộ chọn giao diện có lưu để dùng đủ các theme.
- [x] Tạo lớp phủ fixed theo theme với pointer-events:none, reduced-motion và token màu chữ/menu tương phản.
- [x] Thêm tương tác con trỏ tiết chế cho Pháo hoa và hiệu ứng thời gian thực nhẹ cho các cảnh có yêu cầu.
- [x] Bổ sung regression, kiểm tra TypeScript, production build, responsive; checkpoint phát hành sẽ được lưu sau cùng.

## Linh vật người tuyết nguyên bản
- [x] Tạo diện mạo người tuyết nguyên bản, không sao chép nhân vật phim, cho linh vật đang chọn.
- [x] Bổ sung chế độ thả rông: tự đi dạo nhẹ trong vùng an toàn khi không kéo thả.
- [x] Giữ kéo thả chuột/cảm ứng, điều khiển bàn phím, lưu vị trí và reduced-motion.
- [x] Bổ sung regression, kiểm tra TypeScript, production build và responsive; checkpoint phát hành sẽ được lưu sau cùng.

## Phạm vi kho linh vật độc lập
- [x] Xác nhận và giữ nguyên Không gian cảm xúc của Lumi, không gắn linh vật vào khu vực này.
- [x] Đặt kho linh vật và điều khiển tự do chuyển động chỉ trong Giao diện & tone màu.
- [x] Kiểm thử regression để bảo đảm linh vật nổi dùng toàn màn hình nhưng không che menu/nút học tập.

## Thu gọn Lumi và 14 theme theo tài liệu tham chiếu
- [x] Thêm Thu gọn/Mở rộng có lưu trạng thái riêng cho Không gian cảm xúc của Lumi.
- [x] Giữ kho linh vật emoji/động vật độc lập trong Giao diện & tone màu, với chuyển động toàn màn hình như người tuyết cảnh Tuyết.
- [x] Chuẩn hóa 14 theme: Sa mạc, Công viên, Bình minh, Núi hoàng hôn, Sao băng & băng, Ngân hà, Đô thị ngày, Hoàng hôn đô thị, Chiều tà, Thành phố đêm, Cầu đêm, Sương mù đô thị, Pháo hoa que, Pháo hoa lớn.
- [x] Áp dụng token màu, lớp phủ fixed không chặn thao tác, reduced-motion và tương phản chữ/menu cho từng theme.
- [x] Bổ sung regression, kiểm tra TypeScript, production build, responsive; checkpoint phát hành sẽ được lưu sau cùng.

## Lỗi tương tác popup âm thanh
- [x] Xác định sự kiện click/focus/blur hoặc cập nhật state làm điều khiển âm thanh giật và popup đóng sai.
- [x] Ổn định vị trí popup, ngăn đóng khi thao tác bên trong và tránh re-render làm nhảy giao diện.
- [x] Bổ sung regression cho mở/đóng popup âm thanh và kiểm tra TypeScript, production build, responsive.

## Xác nhận lại Lumi và kho linh vật theo phản hồi
- [x] Kiểm tra Không gian cảm xúc của Lumi có nút thu gọn/mở rộng rõ ràng và trạng thái được lưu độc lập.
- [x] Kiểm tra linh vật emoji được chọn trong Giao diện & tone màu tự đi dạo toàn màn hình, kéo thả được và không che thao tác học.
- [x] Bổ sung regression, kiểm tra TypeScript, production build, responsive; checkpoint phát hành sẽ được lưu sau cùng.

## Năm theme sáng tạo theo tệp tham chiếu
- [x] Thêm theme Núi lửa: palette than–đỏ, núi lửa cố định và tia lửa/đá lửa tiết chế.
- [x] Thêm theme Đại dương sâu: palette biển sâu, san hô đáy, cá voi lướt ngang và bọt nước đi lên.
- [x] Thêm theme Rừng phép thuật: palette xanh tím, nấm dạ quang góc đáy và bướm phát sáng thưa.
- [x] Thêm theme Trạm vũ trụ: palette kim loại vũ trụ, hành tinh/đĩa bay cố định và tia quét tiết chế.
- [x] Thêm theme Cánh đồng hoa: palette xanh cỏ, hàng hoa hướng dương đáy và ong/bọ cánh cam bay nhẹ.
- [x] Đồng bộ hợp đồng scene, preset audio, bộ chọn có lưu, token toàn giao diện, reduced-motion, regression, TypeScript, build và responsive; checkpoint phát hành sẽ được lưu sau cùng.
- [x] Hoàn thiện Đại dương sâu với san hô đáy rõ ràng, cá voi lướt ngang và bọt nước đi lên; thêm regression chuyên biệt.
- [x] Hoàn thiện Rừng phép thuật cùng Cánh đồng hoa bằng chuyển động bay nhẹ riêng cho bướm, ong và bọ cánh cam.
- [x] Hoàn thiện Trạm vũ trụ với hành tinh cố định và tia quét tiết chế có animation riêng; bổ sung regression cho các keyframe/selector.
