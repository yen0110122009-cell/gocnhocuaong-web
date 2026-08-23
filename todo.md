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

## Tinh chỉnh Tết Cổ Truyền theo tệp tham chiếu
- [x] Đồng bộ palette đỏ thắm–vàng kim cho nền, shell, menu, panel và chữ tương phản cao.
- [x] Bổ sung lồng đèn hai góc, cây hoa mai/đào góc đáy, cánh hoa rơi thưa, lì xì/pháo trang trí và bánh chưng/bánh tét cố định.
- [x] Bảo đảm lớp phủ toàn màn hình không cản thao tác, reduced-motion, regression, TypeScript, production build và responsive; checkpoint phát hành sẽ được lưu sau cùng.
- [x] Xác nhận bằng CSS và regression rằng lồng đèn neo ở hai góc, cây hoa neo góc đáy, icon bánh chưng/bánh tét cố định trong lớp phủ Tết.

## Năm theme kể chuyện theo tệp tham chiếu
- [x] Thêm Lâu đài cổ tích: nền tím hồng–xanh đêm, lâu đài góc đáy, tiên/bụi phép bay thưa và chữ vàng tương phản.
- [x] Thêm Gánh xiếc: nền sọc đỏ đun–xanh hải quân, lều xiếc neo đáy, bóng bay bay lên và chữ trắng/vàng chanh.
- [x] Thêm Thời tiền sử: nền xanh rêu, khủng long lấp ló cạnh trái, dấu chân mờ và chữ vàng cam tương phản.
- [x] Thêm Đường đua Cyberpunk: nền kim loại tối, đèn giao thông cố định, xe đua/vệt neon chạy ở đáy và chữ cyan/hồng neon.
- [x] Thêm Lễ hội ẩm thực: nền cam–nâu sô-cô-la, trà sữa/donut ở đáy, pizza/kem rơi nhẹ và chữ kem tương phản.
- [x] Đồng bộ hợp đồng scene, preset audio, bộ chọn có lưu, reduced-motion, regression, TypeScript, build, responsive và checkpoint phát hành.

## Tái cấu trúc âm thanh và chuyển phiên Pomodoro
- [x] Loại bỏ âm thanh nền/tập trung khỏi Pomodoro, chỉ giữ âm báo trạng thái và âm báo kết thúc.
- [x] Bổ sung âm báo riêng cho bắt đầu phiên học, kết thúc phiên, bắt đầu nghỉ và kết thúc nghỉ/chuyển về phiên học.
- [x] Thêm lựa chọn chế độ chuyển phiên thủ công hoặc tự động, có persistence và nút hành động rõ ràng.
- [x] Bổ sung regression, kiểm tra TypeScript, production build, responsive và checkpoint phát hành.
- [x] Kiểm tra các âm thanh thử trạng thái hiện có để tránh phát nhầm âm nền Pomodoro.

## Ghi chú nội dung đính kèm chưa triển khai
- [x] Đã rà soát trực tiếp `pasted_content.txt`, `pasted_content_2.txt` và `pasted_content_3.txt`: đây là đề xuất theme/transition riêng, không thuộc yêu cầu Pomodoro hiện tại; không đưa mã JavaScript tạo DOM ngoài kiến trúc React vào dự án.


## Khoảng trống cần xử lý trong refactor Pomodoro
- [x] Gỡ sạch state/helper/UI/history/action còn liên quan ambient/background khỏi Pomodoro, gồm preset áp lại, setBackgroundSound, setPomodoroAmbientMix và background playback calls.
- [x] Hoàn thiện CTA thủ công riêng cho focus→break và break→focus, đồng thời ghi/khôi phục transition mode trong persistence.
- [x] Bổ sung regression khẳng định previewEvent chỉ phát alert events, không gọi background playback, và Pomodoro không còn ambient UI cũ.
- [x] Chạy responsive smoke riêng cho Pomodoro sau refactor và chỉ đánh dấu phát hành sau checkpoint mới.

## Cải thiện mini-player Pomodoro ghim
- [x] Đổi nền mini-player ghim khỏi màu navy quá tối sang palette sáng/trung tính dễ chịu.
- [x] Tăng tương phản cho tiêu đề, thời gian, trạng thái và nút điều khiển; bảo đảm đọc rõ khi scene thay đổi.
- [x] Bổ sung regression và kiểm tra responsive cho mini-player sau khi chỉnh style.

## Tái thiết Đề kiểm tra, Ôn tập và Flash Cards
- [x] Rà soát model, persistence và UI hiện có cho đề/Flash Cards; xác định dữ liệu cần giữ tương thích.
- [x] Thêm thao tác Chỉnh sửa và Xóa cho từng đề đã tạo, có xác nhận xóa và cập nhật danh sách.
- [x] Thêm thao tác Chỉnh sửa và Xóa cho từng bộ Flash Cards đã tạo, có xác nhận xóa và cập nhật danh sách.
- [x] Tách rõ Đề kiểm tra (giới hạn thời gian do người dùng đặt) khỏi Ôn tập (tùy số câu, có thể không giới hạn và lưu để làm tiếp).
- [x] Thêm âm báo hết giờ theo cơ chế âm báo Pomodoro và xử lý trạng thái hết giờ an toàn.
- [x] Kiểm thử persistence, chỉnh sửa/xóa, chuyển chế độ, TypeScript, full test, production build, responsive và checkpoint phát hành.
- [x] Không triển khai các đoạn JavaScript tạo DOM trực tiếp trong tệp tham chiếu; giữ kiến trúc React/CSS hiện tại.

## Bổ sung quản lý trên route QuizEnhanced
- [x] Thêm nút Chỉnh sửa/Xóa trực tiếp vào danh sách của QuizEnhanced, có xác nhận và cập nhật profile.
- [x] Gắn nút Chỉnh sửa bộ Flashcard đang có vào giao diện Cards.
- [x] Chạy full suite sau cùng, kiểm tra responsive mobile cho Quiz/Flashcard và lưu checkpoint phát hành.

## Rà soát tương phản Light/Dark mode
- [x] Rà soát CSS variables, ThemeProvider, token cảnh và các màu hard-coded có nguy cơ chìm trên nền.
- [x] Cân chỉnh palette Light/Dark cho nền, chữ, icon, border, card, panel và input theo mục tiêu WCAG.
- [x] Bổ sung regression cho token tương phản và bảo đảm tệp tham chiếu không đưa JS tạo DOM trực tiếp vào app.
- [x] Chạy full test, TypeScript, production build, kiểm tra responsive Light/Dark và lưu checkpoint phát hành.

## Chế độ khách và quản trị thành viên
- [x] Rà soát các luồng đăng nhập hiện có, dữ liệu hồ sơ, quyền Admin và khả năng theo dõi hoạt động mà không lộ mã nội bộ.
- [x] Thêm nút đăng nhập khách có hộp xác nhận, giới hạn ở chế độ tham quan và không lưu tiến trình học/quiz/flashcard.
- [x] Ẩn hướng dẫn hoặc nhãn tiết lộ mã nội bộ; chuẩn hóa trường đăng nhập chỉ hiển thị “Mã được cấp”.
- [x] Thêm thông tin liên hệ xét duyệt tài khoản, ưu tiên Facebook và dự phòng Zalo theo nội dung người dùng cung cấp.
- [x] Bổ sung quản trị thành viên: danh sách, lần hoạt động gần nhất, trạng thái khóa và thao tác khóa/mở khóa có xác nhận.
- [x] Viết regression cho quyền khách/quản trị, chạy TypeScript, full test, build, responsive và checkpoint phát hành.
- [x] Lưu checkpoint/phát hành mới cho bản cập nhật chế độ khách và quản trị thành viên sau khi đã qua test/build/responsive.

## Mở rộng Giao diện, âm nền chung và yêu thích
- [x] Rà soát các theme đã có trong tài liệu, chỉ chọn những theme có nguồn âm thanh được cung cấp để gắn audio.
- [x] Đưa các theme mới vào mục Giao diện trong menu, với thẻ mô tả, trạng thái đang chọn và tone màu đồng bộ.
- [x] Thêm nghe thử, bật/tắt âm nền và thanh âm lượng riêng cho theme; không tự phát khi chưa có tương tác người dùng.
- [x] Thay khu cảnh Lumi liên quan bằng mục Giao diện yêu thích không giới hạn, thu gọn/mở rộng và áp dụng theme khi nhấn.
- [x] Dùng âm nền theme chung cho Pomodoro, có bật/tắt và chỉnh âm lượng; vẫn giữ âm báo chuyển phiên riêng.
- [x] Bổ sung regression cho theme/audio/favorites/Pomodoro, chạy TypeScript, full test, build, responsive và checkpoint phát hành.

## Điều chỉnh vị trí Giao diện yêu thích
- [x] Thay trực tiếp panel “Giao diện” trong Không gian cảm xúc của Lumi bằng panel “Giao diện yêu thích”, không tạo panel trùng ở khu vực khác.
- [x] Giữ danh sách yêu thích không giới hạn, thu gọn/mở rộng và áp dụng theme khi nhấn vào mục yêu thích.

## Regression bổ sung cho theme và audio chung
- [x] Thêm/cập nhật regression cho danh sách Giao diện yêu thích không giới hạn và thao tác áp dụng theme.
- [x] Thêm/cập nhật regression cho audio theme: chỉ dùng nguồn được cung cấp, nghe thử, bật/tắt và cập nhật âm lượng.
- [x] Thêm/cập nhật regression cho công tắc âm nền theme chung trong Pomodoro, bảo đảm vẫn tách âm báo chuyển phiên.
- [x] Chạy lại TypeScript, full Vitest, production build và responsive sau khi bổ sung regression.
- [x] Lưu checkpoint phát hành nhóm thay đổi Giao diện yêu thích và audio theme/Pomodoro.

## Gap regression cần xử lý trước phát hành
- [x] Viết regression tương tác cho Giao diện yêu thích: nhấn mục yêu thích áp dụng đúng scene và giữ persistence/thu gọn hợp lệ.
- [x] Viết regression hành vi audio theme: chỉ map nguồn được cung cấp, nghe thử hoạt động, bật/tắt dừng-phát đúng và slider cập nhật âm lượng.
- [x] Bổ sung test Pomodoro cho công tắc âm nền theme chung và khẳng định alert chuyển phiên vẫn độc lập.
- [x] Chạy lại responsive smoke sau bộ regression cuối rồi lưu bằng chứng/checkpoint phát hành mới.
- [x] Lưu checkpoint riêng cho nhóm Giao diện yêu thích + audio theme/Pomodoro sau khi mọi test pass.

## Mở rộng toàn bộ catalog theme theo tài liệu tham chiếu
- [x] Kiểm kê toàn bộ tệp tham chiếu đã gửi và lập danh sách đầy đủ các nhóm theme/ý tưởng, không chỉ 5 theme gần nhất.
- [x] Đối chiếu từng theme với scene, token màu, hiệu ứng, audio và trạng thái đã có; ghi rõ mục nào thiếu hoặc chỉ có mô tả.
- [x] Bổ sung toàn bộ theme có đủ dữ liệu triển khai vào Giao diện yêu thích, giữ các theme chưa đủ audio ở trạng thái không có âm thanh thay vì tự tạo nguồn.
- [x] Bổ sung regression cho số lượng và nhãn catalog theme, persistence yêu thích, áp dụng theme, audio và responsive.
- [x] Chạy full test, TypeScript, production build, responsive và lưu checkpoint sau khi catalog đầy đủ.

## Ưu tiên bản chỉnh sửa mới nhất của theme
- [x] Lập timeline cho mọi tệp tham chiếu và nhóm các theme trùng tên hoặc trùng ý tưởng.
- [x] Ghi nhận bản mới nhất là nguồn ưu tiên; đánh dấu riêng các màu, hiệu ứng, mật độ, vị trí và audio đã bị thay thế.
- [x] Không cộng dồn chi tiết bị phủ định ở các bản cũ; yêu cầu không rõ hoặc mâu thuẫn cần được nêu ra để xác nhận.
- [x] Cập nhật catalog Giao diện yêu thích theo bản ưu tiên và bổ sung regression đối chiếu phiên bản.

## Catalog 12 scene còn thiếu từ audio-catalog mới nhất
- [x] Thêm scene Pixel, Hải tặc, Thể thao, Disco, Phòng thí nghiệm, Ai Cập, Steampunk, Nghệ thuật, Ninja, Cà phê, AI và Gấu bông.
- [x] Thêm metadata audio trực tiếp cho rainy_season, stormy_season, morning_chill và coffee; không tự tạo URL cho các theme chỉ có mô tả.
- [x] Thêm token shell và overlay CSS/emoji cho 12 scene mới, bảo đảm pointer-events:none, contrast và reduced-motion.
- [x] Cập nhật parser, default volume, favorites, schedule và audio mapping cho các scene mới.
- [x] Viết regression catalog/audio/overlay và chạy full validation trước checkpoint.

## Thay Lumi cảnh nền bằng Giao diện yêu thích và popup âm nền theme
- [x] Xóa khỏi Không gian cảm xúc của Lumi toàn bộ UI chọn cảnh nền và âm thanh cảnh nền.
- [x] Chỉ hiển thị các theme/cảm xúc có âm nền được cung cấp; loại toàn bộ mục không có audio khỏi picker và favorites.
- [x] Làm sạch favorites/persistence để theme cũ không có audio không còn được áp dụng.
- [x] Kiểm thử mapping audio, popup chọn âm lượng và Pomodoro sau khi lọc catalog.
- [x] Giữ riêng panel Giao diện yêu thích trong Lumi, danh sách không giới hạn và thu gọn/mở rộng.
- [x] Khi chọn theme trong Giao diện & tone màu, áp dụng theme và mở popup điều khiển âm nền của theme.
- [x] Popup cho phép nghe thử, bật/tắt và chỉnh âm lượng; tránh popup nhảy/đóng sai khi thao tác bên trong.
- [x] Bảo đảm âm báo Pomodoro vẫn độc lập và không bị thay đổi bởi refactor này.
- [x] Bổ sung regression, chạy full test, TypeScript, build, responsive và lưu checkpoint.

## Rà soát pasted_content_6 và lớp phủ theme
- [x] Đọc toàn bộ pasted_content_6.txt và lập danh sách yêu cầu/theme mới.
- [x] Đối chiếu yêu cầu mới nhất với catalog theme hiện hành, ghi nhận các điểm thay thế hoặc xung đột.
- [x] Rà soát toàn bộ overlay theme cũ, giảm opacity/độ phủ và loại bỏ lớp làm tối che chữ/menu.
- [x] Bảo đảm overlay chỉ là hiệu ứng trang trí nhẹ, pointer-events:none, không che nội dung và giữ contrast WCAG.
- [x] Tích hợp các yêu cầu mới trong pasted_content_6.txt vào website theo phạm vi hợp lệ.
- [x] Cập nhật regression cho overlay, contrast và theme mới; chạy test, TypeScript, build và responsive.
- [x] Lưu checkpoint phát hành sau khi xác minh trực quan.

## Sửa lỗi audio giao diện và scene Không gian
- [x] Điều tra vì sao audio theme không phát khi người dùng nhấn trong popup Giao diện.
- [x] Sửa lifecycle audio element, autoplay sau gesture và trạng thái bật/tắt để nghe được âm thanh đã cung cấp.
- [x] Bảo đảm scene Không gian trong Cảnh mở rộng thật sự đổi nền, menu, panel, chữ và hiệu ứng.
- [x] Bổ sung regression cho audio playback flow và token scene space.
- [x] Chạy test, TypeScript, build, responsive smoke và lưu checkpoint.
- [x] Khắc phục lỗi Babel `Expecting Unicode escape sequence` tại Home.tsx phát hiện sau khi đọc pasted_content_6.

## Theme mới theo ảnh tham chiếu dark nâu–đỏ
- [x] Đối chiếu ảnh tham chiếu với shell hiện tại: sidebar, thẻ cấp độ, thanh tìm kiếm, nút sáng/âm thanh và avatar Ong.
- [x] Thêm theme dark nâu–đỏ bằng token nền/menu/card/panel/chữ/border tương phản cao, không dùng ảnh watermark.
- [x] Sửa lỗi hiển thị linh vật Ong: kích thước, vị trí, nhãn trạng thái và pointer-events không che thao tác.
- [x] Bảo đảm overlay theme mới nhẹ, không che nội dung/menu và tôn trọng reduced-motion.
- [x] Bổ sung regression cho theme, linh vật, contrast và responsive; chạy test, TypeScript, build và lưu checkpoint.

## Dọn nền cũ lỗi và sửa audio theme
- [x] Kiểm kê các overlay, ánh nắng và hiệu ứng nền cũ còn được render ngoài theme đang chọn.
- [x] Xóa dứt điểm các lớp nền/hiệu ứng cũ bị lỗi thay vì tiếp tục chồng thêm bản vá.
- [x] Khôi phục nền mặc định sạch, không còn ánh nắng hoặc hiệu ứng sót từ scene trước.
- [x] Sửa audio theme để khi mở/chọn giao diện, nguồn audio được khởi tạo và phát sau gesture người dùng.
- [x] Bổ sung regression cho việc không còn overlay cũ và audio playback; chạy test, TypeScript, build, responsive và lưu checkpoint.

## Kiểm kê lại toàn bộ ý tưởng theme
- [x] Thu thập tất cả tệp tham chiếu theme hiện có trong thư mục upload và audit của dự án.
- [x] Lập bảng coverage đầy đủ: ý tưởng, phiên bản, trạng thái đã triển khai, audio, linh vật, hiệu ứng và token màu.
- [x] Đối chiếu bản gửi sau với bản gửi trước, không bỏ sót các ý tưởng bị ẩn trong mô tả dài hoặc ảnh tham chiếu.
- [x] Bổ sung catalog và UI cho toàn bộ theme còn thiếu sau khi hoàn tất coverage.
- [x] Thêm regression để khóa số lượng theme và nội dung catalog sau khi hoàn tất.

## Khôi phục đầy đủ ý tưởng theme đang bị ẩn
- [x] Hiển thị toàn bộ sceneOptions trong Giao diện & tone màu, không lọc mất theme chỉ vì chưa có audio trực tiếp.
- [x] Cho phép áp dụng mọi theme; theme có audio mới mở điều khiển âm thanh, theme chưa có audio phải hiển thị trạng thái rõ ràng.
- [x] Hiển thị toàn bộ favorites hợp lệ, không làm mất các theme đã lưu chỉ vì thiếu audio.
- [x] Đồng bộ normalizeProfile, volume map và preset scene với toàn bộ AmbientScenePreference.
- [x] Bổ sung regression coverage để khóa catalog đầy đủ và phân biệt trạng thái audio.
- [x] Chạy full test, TypeScript, build, responsive và lưu checkpoint.


## Khôi phục đầy đủ catalog theme
- [x] Render toàn bộ scene IDs trong AmbientScenePreference tại Giao diện & tone màu, không lọc theo audio.
- [x] Đồng bộ whitelist normalizeProfile cho default scene, time rules và ambientSceneVolumes với toàn bộ catalog.
- [x] Bổ sung chỉ báo trực quan Có âm nền/Chỉ giao diện trên từng thẻ theme và giữ popup audio cho theme có URL.
- [x] Viết regression cho độ phủ catalog, persistence scene mới và chỉ báo audio; chạy TypeScript, full test, build và responsive smoke.
- [x] Lưu checkpoint phát hành sau khi xác minh toàn bộ mục trên.


## Sửa lỗi theme/audio và linh vật theo phản hồi mới
- [x] Điều tra và sửa chuyển đổi Light/Dark không phản hồi, bảo đảm ThemeProvider và token đồng bộ.
- [x] Sửa công tắc audio bị nhấp nháy giữa bật/tắt; ổn định lifecycle audio element và state sau thao tác người dùng.
- [x] Rà soát catalog nguồn âm nền, bổ sung đúng các URL đã được cung cấp và hiển thị nguồn gốc; không tự tạo URL.
- [x] Xử lý yêu cầu xóa theme visual-only theo catalog audio đã xác nhận, không làm mất theme có nguồn hợp lệ.
- [x] Khôi phục nền mặc định sạch, không render mặt trời/chim/overlay khi chưa chọn scene.
- [x] Cân chỉnh toàn bộ chữ/icon/border ở Dark mode và kiểm tra tương phản các surface.
- [x] Khôi phục linh vật tự do kéo thả toàn màn hình và tự di chuyển trong vùng an toàn.
- [x] Thêm hover transition mượt và tooltip thông tin chi tiết cho thẻ theme.
- [x] Bổ sung regression, chạy full test, TypeScript, build và responsive smoke.
- [x] Đọc lại TODO, lưu checkpoint phát hành sau khi mọi mục hoàn tất.


## Theme mới từ pasted_content_7/8/9
- [x] Lập coverage report cho toàn bộ scene mới, nhóm, ID, linh vật, overlay, màu và âm thanh từ ba tệp.
- [x] Đối chiếu trùng lặp/xung đột với catalog hiện tại, ưu tiên cấu hình mới nhất và ghi rõ các quyết định.
- [x] Thêm các scene mới có audio URL được cung cấp vào contract, metadata, volume map, normalize và picker.
- [x] Triển khai overlay CSS/emoji 3 tầng, linh vật duy nhất kéo thả/tự di chuyển và click đứng yên/chạy tiếp theo phạm vi an toàn.
- [x] Hiển thị nguồn audio, volume mặc định và điều khiển nghe thử/bật tắt đúng theo từng theme.
- [x] Bổ sung regression, chạy TypeScript, full Vitest, build và responsive smoke.
- [x] Đọc lại TODO và lưu checkpoint phát hành sau khi hoàn tất.


## Xóa ảnh hưởng nền legacy còn sót
- [x] Truy vết background, pseudo-element, gradient, overlay và component scene cũ còn tác động lên nền hiện tại.
- [x] Xóa nguồn legacy gây ảnh hưởng, bảo đảm nền mặc định sạch và scene đang chọn chỉ áp dụng đúng lớp của nó.
- [x] Bổ sung regression chống nền/overlay cũ quay lại và xác minh tương phản, responsive, TypeScript, test, build.
- [x] Đọc lại TODO và lưu checkpoint phát hành bản sửa.


## Sửa overlay trắng và bố cục menu
- [x] Truy vết lớp phủ trắng xuất hiện khi chọn/thử scene mới và xác định nguồn CSS/component tạo lớp phủ.
- [x] Sửa z-index, pointer-events và trạng thái overlay để preview scene không khóa toàn màn hình hoặc chặn thao tác.
- [x] Khôi phục bố cục menu/header để luôn nằm đúng trong shell, dễ truy cập khi cuộn và không bị tách khỏi nội dung.
- [x] Bổ sung regression cho overlay scene và cấu trúc menu; kiểm tra desktop/mobile, full test, build và lưu checkpoint.


## Sửa lỗi tái diễn linh vật và menu
- [x] Kiểm tra tương tác thực tế để xác định vì sao linh vật vẫn bị giới hạn chuyển động hoặc bị lớp khác che.
- [x] Kiểm tra cấu trúc sidebar/header/inset và trạng thái cuộn để xác định vì sao menu bị tách khỏi nội dung.
- [x] Sửa linh vật tự di chuyển và kéo thả tự do trên viewport, đồng thời sửa shell menu/header theo một layout nhất quán.
- [x] Viết regression hành vi, kiểm tra desktop/mobile và lưu checkpoint sau khi xác minh.

## Tái kiểm tra bắt buộc các lỗi giao diện tái diễn
- [x] Tái hiện bằng tương tác thực tế việc kéo thả linh vật trên toàn viewport, chọn scene mới, mở menu ở vị trí cuộn và trạng thái nền mặc định.
- [x] Loại bỏ mọi overlay hoặc pseudo-element có thể tạo lớp trắng, che nội dung hay nhận pointer events khi thử scene.
- [x] Sửa lại vị trí và vùng kéo thả linh vật để thao tác chuột/cảm ứng hoạt động tự do trên toàn màn hình, không bị shell hoặc overlay giới hạn.
- [x] Neo menu và header vào shell cuộn nhất quán, bảo đảm nút ba sọc luôn hiển thị và truy cập được ở mọi vị trí cuộn.
- [x] Loại bỏ dứt điểm ảnh hưởng nền legacy còn sót, thêm regression hành vi, kiểm tra desktop/mobile, test, build và checkpoint.

## Sửa lớp phủ sau đăng nhập và cải thiện tương tác linh vật
- [x] Tái hiện lớp phủ trắng sau đăng nhập và truy vết phần tử nhận pointer events nhưng không phải luồng thao tác chủ đích.
- [x] Gỡ hoặc giới hạn lớp phủ để chuột, cảm ứng và bàn phím tương tác được với mọi control sau đăng nhập.
- [x] Thêm nút nhỏ, dễ truy cập để đặt lại linh vật về vị trí mặc định.
- [x] Thêm phản hồi hình ảnh và âm thanh nhẹ sau thao tác kéo/thả linh vật, tôn trọng reduced-motion và quyền autoplay.
- [x] Làm mượt chuyển cảnh khi đổi giao diện nền, không tạo lớp phủ chặn tương tác.
- [x] Thêm regression tương tác, kiểm tra desktop/mobile, full test, build và checkpoint.

## Sửa lớp phủ làm mờ dashboard và bảng bộ nhớ
- [x] Tái hiện chính xác dashboard bị làm mờ sau đăng nhập và xác định phần tử/lớp xếp chồng đang phủ lên toàn giao diện.
- [x] Truy vết nguồn bảng “Mức sử dụng bộ nhớ”, phân biệt công cụ debug, dialog hợp lệ và UI ứng dụng để không sửa nhầm.
- [x] Loại bỏ hoặc cô lập lớp phủ gây mờ/chặn thao tác, bảo đảm dialog hợp lệ luôn có đường thoát rõ ràng.
- [x] Bổ sung regression cho lớp phủ sau đăng nhập; xác minh click, nhập bàn phím, menu, kéo thả linh vật, test/build và checkpoint.

## Theme Ngày Lễ Hội Việt Nam từ cấu hình JSON
- [x] Chuẩn hóa toàn bộ cấu hình lễ hội, gồm màu light/dark, BGM, mascot, nền đáy, animation, ripple và click effect.
- [x] Hiển thị các theme lễ hội trong catalog; áp dụng token màu light/dark theo theme đang chọn mà vẫn bảo đảm tương phản chữ.
- [x] Tạo mascot lễ hội kéo thả độc lập, vị trí/kích thước/z-index/animation theo cấu hình và tôn trọng reduced-motion.
- [x] Tạo các ground-item ở đáy theo mật độ và kích thước cấu hình; từng mục kéo thả độc lập, không chặn thao tác shell.
- [x] Cài click effects scale-bounce, shake, particle-burst, ripple-wave và pulse-glow, tách biệt với drag.
- [x] Đồng bộ phát/dừng BGM theo theme, volume/loop theo cấu hình và chỉ phát sau cử chỉ người dùng.
- [x] Bổ sung regression cấu hình/tương tác; kiểm tra TypeScript, Vitest, production build, browser desktop/mobile và checkpoint.

## Dọn các khối Audio Center không mở được
- [x] Xác định và gỡ “Tải âm thanh môi trường thật”, “Thư viện asset đã tải lên”, “Thùng rác audio”, “Trạng thái đang phát” và “Lọc thư viện lời thoại”.
- [x] Loại bỏ mọi trigger, heading và khoảng trống liên quan để không còn panel rỗng hoặc thao tác không phản hồi.
- [x] Cập nhật regression Audio Center và xác minh giao diện sau khi loại bỏ.

## Ổn định âm thanh, theme, thùng rác học liệu và ghi âm
- [x] Tái hiện và sửa công tắc tắt/bật âm thanh cạnh chế độ sáng/tối để không còn nhảy trạng thái.
- [x] Rà soát token chữ/surface light-dark; bảo đảm nền sáng dùng chữ đủ tối, nền tối dùng chữ đủ sáng và không còn theme làm mờ nội dung.
- [x] Chỉ giữ các nền có audio và/hoặc hiệu ứng được cấu hình; sửa renderer để hiệu ứng lễ hội hiển thị đúng khi chọn theme.
- [x] Thiết kế Thùng rác học liệu riêng, phân nhóm Flashcard và Đề kiểm tra với số lượng mục đã xóa, mở rộng/thu gọn, chọn tất cả, xóa vĩnh viễn và khôi phục theo từng nhóm.
- [x] Nối luồng xóa mềm Flashcard/Đề kiểm tra vào Thùng rác và bảo toàn dữ liệu trong profile.
- [x] Chẩn đoán, sửa giới hạn ghi âm theo quyền micro, thời lượng, dừng/hoàn tất và thông báo lỗi có thể hành động.
- [x] Bổ sung regression, kiểm tra TypeScript/Vitest/build, xác minh responsive và lưu checkpoint.

## Đối chiếu cấu hình lễ hội và dọn nút trợ giúp
- [x] Đối chiếu 14 theme trong JSON mới với registry/renderer: mascot, nền đáy, BGM, token màu, animation, ripple và click effect.
- [x] Xóa nút dấu hỏi trợ giúp ở góc dưới màn hình cùng mọi sự kiện/tooltip liên quan.
- [x] Bổ sung regression, kiểm thử TypeScript/Vitest/build/responsive và lưu checkpoint.

## Lời động viên Lumi trong Pomodoro
- [x] Gỡ khu Chế độ lười và toàn bộ lựa chọn mức năng lượng không còn dùng.
- [x] Gỡ khu “Trung tâm điều khiển của Ong”/mã 111 khỏi giao diện và điều hướng liên quan.
- [x] Sửa nghe thử và ghi âm lời Lumi, gồm quyền micro, bản thu, trạng thái phát và thông báo lỗi có thể hành động.
- [x] Biến Mascot theo trạng thái thành cấu hình hoạt động thực tế cho lời an ủi/động viên, tôn trọng trạng thái đã tắt và thùng rác.
- [x] Thêm lựa chọn trong Pomodoro: nhận an ủi, nhận động viên hoặc không nhận; lưu lựa chọn riêng theo hồ sơ.
- [x] Hiển thị khung gợi ý không chặn thao tác theo nhịp trong phiên Pomodoro; cho phép trả lời cảm xúc và phát lời/bản thu khi có.
- [x] Bổ sung regression, TypeScript/Vitest/build, kiểm tra responsive và checkpoint phát hành.

## Sửa lỗi phát/ghi âm Lumi sau phát hành
- [x] Tái hiện và chẩn đoán lỗi không phát được lời Lumi trong Không gian cảm xúc và Pomodoro.
- [x] Tái hiện và chẩn đoán lỗi không thể bắt đầu hoặc lưu ghi âm Lumi, gồm quyền micro và codec trình duyệt.
- [x] Rút gọn danh sách lời thoại Lumi, chỉ giữ một lời đang chọn và thư viện thu gọn có thể mở khi cần.
- [x] Bổ sung kiểm thử lỗi audio, xác minh trên trình duyệt và lưu checkpoint phát hành.

## Khôi phục hiệu ứng nền và trạng thái yêu thích Lumi
- [x] Rà soát và khôi phục toàn bộ renderer/hiệu ứng nền cũ bị mất sau các thay đổi gần đây.
- [x] Chỉnh Giao diện yêu thích trong Lumi: khi chưa có yêu thích, chỉ hiển thị trạng thái trống nhẹ, không ép chọn hoặc hiển thị theme thay thế.
- [x] Bổ sung regression, TypeScript/Vitest/build, kiểm tra responsive và checkpoint phát hành.

## Đối chiếu đặc tả nâng cấp theme và tương tác
- [x] Đối chiếu toàn bộ yêu cầu trong `pasted_content.txt` với registry, renderer, token màu, audio và tương tác đang có.
- [x] Bổ sung hoặc chuẩn hóa các cấu hình theme/tương tác tương thích, không dùng URL âm thanh mẫu hoặc chưa được người dùng cung cấp.
- [x] Bổ sung regression, TypeScript/Vitest/build, kiểm tra responsive và checkpoint phát hành.

## Tái cấu trúc theo `pasted_content_12.txt`
- [x] Kiểm kê mọi bề mặt Thành tích, Cấp độ, Danh hiệu, Bảo tàng hành trình, Bản đồ kiến thức, hồ sơ/dữ liệu liên quan và các phụ thuộc quản trị.
- [x] Thiết kế và bổ sung Kế hoạch ngày-tuần: tạo/sửa/xóa, tick mục tiêu, phần thưởng mảnh ghép hoặc vé quay, thu gọn/mở rộng và event mẫu có thể quản lý.
- [x] Gỡ các cơ chế Pomodoro đã yêu cầu: cấp độ/EXP, Ong–Trì hoãn, Boss Trì Hoãn, combo, nhiệm vụ siêu nhỏ và preset Pomodoro; giữ và làm nổi bật Chống trì hoãn.
- [x] Đồng bộ mô tả công việc và các mục đã tick của Pomodoro vào lịch sử học/lịch sử Pomodoro.
- [x] Tạo mục Bạn đồng hành Lumi riêng, chuyển thư viện bản ghi và điều khiển Lumi về đó, bổ sung lời nhắc ở mini Pomodoro và điều hướng Giao diện yêu thích không ép chọn.
- [x] Hợp nhất Nhập dữ liệu AI và AI Studio; thêm prompt nhập liệu cùng phân loại học liệu/đề kiểm tra theo môn, cấp học và khóa học.
- [x] Thu gọn các mục quản trị, làm rõ bộ lọc báo cáo và gỡ các bề mặt không còn dùng.
- [x] Bổ sung regression, TypeScript/Vitest/build, kiểm tra responsive và checkpoint phát hành.

## Xóa dữ liệu thử Thành tích và Danh hiệu
- [x] Kiểm kê mọi dữ liệu khởi tạo, catalog thử và dữ liệu mẫu Thành tích/Danh hiệu trong hợp đồng, normalizer và cấu hình quản trị.
- [x] Xóa dữ liệu thử Thành tích/Danh hiệu, không chạm vào Kế hoạch, Pomodoro, Flashcard, Đề kiểm tra và dữ liệu người học.
- [x] Bổ sung regression xác nhận không còn dữ liệu thử Thành tích/Danh hiệu; chạy TypeScript, Vitest, build và checkpoint phát hành.

## VFX lễ hội, kéo thả và âm thanh theme
- [x] Kiểm kê renderer lớp VFX, linh vật, drag-and-drop, token màu theme và luồng phát âm thanh hiện tại.
- [x] Chuẩn hóa lớp VFX toàn màn hình: icon lễ hội đáy 80–140px, kéo thả pointer capture, physics khi thả và sidebar/header luôn ở lớp trên.
- [x] Cập nhật linh vật tự do di chuyển, token màu toàn cục và cơ chế mở khóa âm thanh sau cử chỉ đầu tiên mà không thêm URL audio mới.
- [x] Bổ sung regression, kiểm thử TypeScript/Vitest/build và xác minh desktop/mobile trước checkpoint phát hành.

## Gỡ bề mặt Thành tích, Cấp độ và Danh hiệu còn sót
- [x] Kiểm kê toàn bộ trang, menu, thẻ, lịch sử và quản trị còn hiển thị Thành tích, Cấp độ hoặc Danh hiệu.
- [x] Gỡ các phần giao diện legacy đã kiểm kê, nhưng không ảnh hưởng Kế hoạch, Pomodoro, Lumi và dữ liệu học tập.
- [x] Bổ sung regression; chạy TypeScript, Vitest, build, kiểm tra desktop/mobile và checkpoint phát hành.

## Nâng cấp VFX và âm thanh từ `pasted_content_15/16`
- [x] Đối chiếu renderer lễ hội hiện có với kích thước 100–140px, 5 physics khi thả, Pointer Capture, lớp dưới menu và reduced-motion.
- [x] Hoàn thiện mở khóa audio sau cử chỉ đầu tiên bằng một phần tử audio ổn định, chỉ dùng URL đã được người dùng cung cấp hoặc audio đã audit.
- [x] Kiểm tra khả dụng của 10 URL âm thanh được cung cấp; không tạo asset local giả, và ghi nhận fallback an toàn khi một URL không tải được.
- [x] Bổ sung regression cho physics, kích thước, lớp VFX/audio unlock; chạy TypeScript, Vitest, build, kiểm tra desktop/mobile và checkpoint phát hành.

## Âm báo Pomodoro Web Audio và gỡ Cấp độ còn sót
- [x] Kiểm kê và gỡ các bề mặt đang hiển thị còn dùng Cấp độ/XP, không ảnh hưởng Kế hoạch, Pomodoro, Lumi và dữ liệu học.
- [x] Tạo bộ tổng hợp âm báo Web Audio API gồm tối thiểu 10 âm báo, dùng một audio context theo cử chỉ và không có âm nền.
- [x] Lưu cấu hình độc lập cho Bắt đầu phiên học, Kết thúc phiên học, Bắt đầu nghỉ, Kết thúc nghỉ: bật/tắt, âm báo và âm lượng chung 0–200%.
- [x] Bổ sung bảng cài đặt có chọn âm, công tắc và Nghe thử cho từng sự kiện; tăng mặc định âm báo để rõ, to và dài hơn.
- [x] Bổ sung regression, chạy TypeScript, Vitest, build, kiểm tra desktop/mobile và checkpoint phát hành.
