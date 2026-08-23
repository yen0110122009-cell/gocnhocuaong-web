# Audio sources

Các file MP3 trong thư mục này được tự host để tránh phụ thuộc host âm thanh ngoài và tăng khả năng tương thích với trình duyệt mobile/Safari. Chúng được chuyển đổi từ các clip OGG nguồn tương ứng bằng codec MP3, giữ nguyên nội dung âm thanh.

- `rain-and-thunder.mp3`: chuyển đổi từ [Wikimedia Commons — Rain and thunder.ogg](https://commons.wikimedia.org/wiki/File:Rain_and_thunder.ogg), phát hành public domain bởi tác giả Caesar.
- `turning-a-page.mp3`: chuyển đổi từ [Wikimedia Commons — Turning a page.ogg](https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg), public domain bởi tác giả planish.
- `bird-singing.mp3`: chuyển đổi từ [Wikimedia Commons — Bird singing.ogg](https://commons.wikimedia.org/wiki/File:Bird_singing.ogg), public domain bởi tác giả jc.
- `synthetic-bell.mp3`: chuyển đổi từ [Wikimedia Commons — Synthetic bell sound.ogg](https://commons.wikimedia.org/wiki/File:Synthetic_bell_sound.ogg), CC0 1.0 Universal Public Domain Dedication bởi tác giả Achim55.

Các file được dùng làm âm nền/âm thanh tích hợp trong ứng dụng. Link YouTube dạng `watch` không được dùng làm `src` cho thẻ `<audio>` vì đó là URL trang xem, không phải URL media trực tiếp.

## Festive theme tracks

Các file `festive-*.mp3` là 14 track instrumental nguyên bản được tạo riêng theo brief âm thanh của từng giao diện; không tải hoặc trích xuất audio từ các link YouTube `watch`. Tên file tương ứng trực tiếp với id của 14 festive theme trong registry `LOCAL_FESTIVE_AUDIO`, vì vậy mỗi theme có một nguồn riêng thay vì dùng chung bốn clip ambience cơ bản.

Các track được thiết kế làm âm nền học tập ở âm lượng thấp, không có giọng hát, lời nói hay giai điệu nhận diện từ tác phẩm có sẵn. Link YouTube người dùng cung cấp chỉ được giữ như tham chiếu ý tưởng, không được nhúng vào `audio.src`.
