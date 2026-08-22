# Đối chiếu pasted_content_6 — nguồn mới nhất

## Theme và audio

| ID mới nhất | Theme | Audio BGM | Volume | Ghi chú chính |
|---|---|---|---:|---|
| spring-blossom | Mùa Xuân Thanh Tân | https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg | 0.35 | Hoa đào/mai góc phải, chim én, hoa rơi |
| summer-beach | Mùa Hạ Biển Xanh & Nắng Vàng | https://actions.google.com/sounds/v1/water/ocean_waves.ogg | 0.40 | Mặt trời, dừa+dép, sóng chân trang |
| autumn-leave | Mùa Thu Lá Vàng Rơi | https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg | 0.35 | Cây phong, tách trà, lá rơi dọc |
| winter-snow | Mùa Đông Tuyết Rơi & Người Tuyết | https://actions.google.com/sounds/v1/ambiences/winter_wind.ogg | 0.30 | Người tuyết, thảm tuyết, tuyết rơi |
| halloween-spooky | Đêm Hội Halloween | https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg | 0.35 | Bí ngô, lâu đài ma, dơi bay |
| lunar-new-year | Tết Cổ Truyền Rực Rỡ | https://actions.google.com/sounds/v1/festivals/fireworks_distant.ogg | 0.35 | Bánh chưng/lì xì, câu đối, pháo hoa |
| thunder-storm | Sấm Chớp Bão Bùng | https://actions.google.com/sounds/v1/weather/thunderclap.ogg | 0.45 | Mây đen, sét, flash, mưa |
| rainy-day | Mưa Rào Tình Cảm | https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg | 0.35 | Mây/ô, ếch/lá sen, mưa và ripple |
| sunny-day | Nắng Nhiệt Đới Rực Rỡ | https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg | 0.30 | Mặt trời, hướng dương, tia nắng |
| foggy-morning | Sương Mù Mờ Áo | https://actions.google.com/sounds/v1/ambiences/foghorn_distant.ogg | 0.25 | Blur nhẹ, đèn đường, dải sương |

## Quy tắc áp dụng

Nội dung của tệp này được ưu tiên hơn các bản mô tả cũ khi trùng theme. Tuy nhiên, các lớp phủ có z-index cao hoặc opacity lớn trong ví dụ tham chiếu không được bê nguyên xi: triển khai thực tế phải dùng `pointer-events: none`, opacity nhẹ, không che chữ/menu và giữ tương phản WCAG. Các âm thanh lời Lumi và âm báo Pomodoro vẫn là luồng riêng, không gộp vào BGM theme.
