
## Nguồn pasted_content.txt
- Halloween & Lâu đài ma búp bê: 🎃 👻 🦇 🕸️ 🔮 🧹; tím tối/đen; bí ngô góc dưới, mạng nhện góc menu, dơi/ma bay; chữ xanh dạ quang/vàng chanh.
- Chuyến bay & bầu trời mây trắng: ✈️ 🛩️ 🪂 ☁️ 🌤️ 🎈; nền xanh trời, menu xanh lam; máy bay cố định, mây trôi, dù hạ cánh; chữ trắng/vàng kim.
- Pixel & trò chơi điện tử: 🎮 🕹️ 👾 🪙 🍄; nền đen Game Boy, menu neon xanh; tay cầm cố định, quái vật pixel, xu xoay; chữ neon xanh/hồng.
- Đảo cướp biển & kho báu: 🏴‍☠️ 🦜 ⚓ 🗺️ 🪙 ⚔️ 💎; nền đại dương đêm/menu gỗ; neo/rương góc dưới, vẹt bay, xu rơi; chữ vàng.
- Ngày hội thể thao & sân cỏ: ⚽ 🏀 🎾 🏆 🥇 🥊; nền xanh cỏ/menu xanh đậm; cúp góc dưới, bóng lăn nảy; chữ trắng/vàng chanh.
- Nguồn minh họa trong tệp yêu cầu overlay phủ màn hình/z-index cao; khi triển khai website phải ưu tiên không che chữ, không chặn click theo yêu cầu mới nhất.

## Nguồn pasted_content_2.txt
- Mùa mưa phủ phàng & hạt mưa: 🌧️ ☔ 💧 ☂️ 🌈 ⛈️; nền xanh xám bão, menu xám đá; ô góc dưới, mưa rơi; chữ vàng/cyan.
- Mùa bão giật & sấm chớp: 🌀 ⚡ 🌩️ 🌪️ 🍃 🌊; nền đen tím, menu xám; lốc/mây góc dưới, chớp nhấp nháy; chữ cyan/trắng.
- Buổi sáng tinh khôi & nắng ban mai: 🌅 ☕ 🐦 🍃 🌻 🌤️; nền xanh ấm, menu gỗ; cà phê/mặt trời góc dưới, tia nắng và chim; chữ vàng.
- Audio URL: rainy_season BGM https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg; rainy SFX https://actions.google.com/sounds/v1/water/water_drop.ogg; stormy_season BGM https://actions.google.com/sounds/v1/weather/heavy_wind_storm.ogg; stormy SFX https://actions.google.com/sounds/v1/weather/thunder_heavy.ogg; morning_chill BGM https://actions.google.com/sounds/v1/nature/morning_birds_acoustic.ogg; morning SFX https://actions.google.com/sounds/v1/nature/bird_chirp.ogg.
- Audio style: rain lofi + rain, storm dark ambient + wind/thunder, morning acoustic + birds.

## Nguồn pasted_content_3
- Mỏ Kim Cương & Hang Động Tinh Thể: 💎 🔮 🪨 ⛏️ 🌟; tím đêm, menu xám đá; kim cương góc dưới, tinh thể/lấp lánh; chữ vàng/cyan.
- Thế Giới Đua Xe F1 & Cờ Đích: 🏎️ 🏁 🚦 🛞 ⛽ 🏆; nền đường đua đen, menu cờ; xe chạy chân trang, cờ góc menu; chữ đỏ cam/vàng.
- Vương Quốc Bánh Kẹo: 🍭 🍬 🍫 🧁 🍩 🍨; nền hồng tối, menu chocolate; kẹo mút góc dưới, kẹo rơi; chữ cyan/trắng kem.
- Du Lịch Vòng Quanh Thế Giới: 🧳 🗽 🗼 🗺️ 📸 ✈️; nền bản đồ cổ, menu da vali; landmark góc dưới, đường bay; chữ vàng kim.
- Sóng Biển Lướt Ván & Mùa Hè Nhiệt Đới: 🏄 🥥 🌴 🐬 🕶️ 🌊; nền xanh ngọc, menu cát; dừa và cá heo/sóng; chữ trắng/vàng.

## Nguồn pasted_content_4
- Bảng audio mô tả audio-backed cho nhóm: Núi Lửa, Đại Dương Sâu, Rừng Phép Thuật, Trạm Vũ Trụ, Cánh Đồng Hoa, Tết, Lâu Đài Cổ Tích, Gánh Xiếc, Khủng Long, Cyberpunk, Lễ Hội Ẩm Thực, Halloween, Chuyến Bay, Pixel, Hải tặc, Thể thao, Disco, Phòng Thí nghiệm, Ai Cập, Steampunk, Nghệ thuật, Ninja, Cà phê, AI và Gấu bông. Nhiều mục chỉ có style/SFX filename, không có URL BGM trực tiếp.
- URL trực tiếp được nêu: tet BGM `https://actions.google.com/sounds/v1/holidays/lunar_new_year_music.ogg`, tet SFX `https://actions.google.com/sounds/v1/fireworks/small_explosion.ogg`; space BGM `https://actions.google.com/sounds/v1/science_fiction/space_synth_pad.ogg`, space SFX `https://actions.google.com/sounds/v1/science_fiction/scifi_laser.ogg`; coffee BGM `https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg`, coffee SFX `https://actions.google.com/sounds/v1/household/pouring_water.ogg`.
- Tệp minh họa dùng `new Audio(...).play()` và loop/volume; khi triển khai phải gắn vào gesture người dùng và xử lý lỗi play promise.
