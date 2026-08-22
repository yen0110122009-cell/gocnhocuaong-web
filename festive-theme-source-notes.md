# Nguồn cấu hình Theme Ngày Lễ Hội Việt Nam

Nguồn: `/home/ubuntu/upload/pasted_content_10.txt` do người dùng cung cấp ngày 22-08-2026.

| Nhóm | Theme ID | Mascot | Animation | BGM nguồn cung cấp |
|---|---|---|---|---|
| Lễ truyền thống | `tet-nguyen-dan` | 🦁 | bounce | `https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg` |
| Lễ truyền thống | `gio-to-hung-vuong` | 🦅 | sine-wave | `https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg` |
| Ngày kỷ niệm | `ngay-thanh-nien-26-3` | ⭐ | không chỉ định | `https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg` |
| Ngày kỷ niệm | `giai-phong-30-4` | 🕊️ | không chỉ định | `https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg` |
| Ngày kỷ niệm | `thuong-binh-liet-si-27-7` | 🕯️ | không chỉ định | `https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg` |
| Ngày kỷ niệm | `cach-mang-19-8` | ✊ | không chỉ định | `https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg` |
| Ngày kỷ niệm | `quoc-khanh-2-9` | 🇻🇳 | float | `https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg` |
| Lễ truyền thống | `tet-trung-thu` | 🐇 | không chỉ định | `https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg` |
| Ngày kỷ niệm | `nha-giao-viet-nam-20-11` | 💐 | không chỉ định | `https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg` |
| Ngày kỷ niệm | `quoc-te-phu-nu-8-3` | 🌷 | float | `https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg` |
| Lễ truyền thống | `tet-doan-ngo-5-5` | 🍇 | bounce | `https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg` |
| Lễ truyền thống | `vu-lan-bao-hieu` | 📿 | sine-wave | `https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg` |
| Ngày kỷ niệm | `phu-nu-viet-nam-20-10` | 🌹 | circular | `https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg` |
| Ngày kỷ niệm | `quan-doi-nhan-dan-22-12` | 🪖 | bounce | `https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg` |

Quy ước chung: mascot z-index 100, kéo thả bằng Pointer Events; nền đáy z-index 50, item kéo thả riêng. Màu light/dark và size/vị trí/mật độ theo JSON. Click effect được chỉ định chi tiết cho Tết Nguyên Đán, Giỗ Tổ Hùng Vương và Quốc Khánh 2/9; các effect cần hỗ trợ là `scale-bounce`, `shake`, `particle-burst`, `ripple-wave`, `pulse-glow`.
