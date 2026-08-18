# Kiểm kê ý tưởng bị thiếu — 2026-08-18

## Nguồn đã đối chiếu

- `upload/study-quest-standalone.html`, các mục 19–23, 26, 28–31 và 36.
- `idea-review-report.md`, các mục Audio/accessibility, Start Small, Focus Journey, comeback và weekly review.
- `client/src/lib/pomodoroAudio.ts`, `client/src/pages/Pomodoro.tsx`, `client/src/lib/emotionThemes.ts` và `todo.md`.

## Đã có trong mã hiện tại

- Sáu event âm báo Pomodoro: start, tick, complete, warning, reward, error.
- Sáu lựa chọn soundscape tonal: Mưa, Mưa nhẹ, Rừng, Thư viện, White noise, Brown noise.
- Soundscape tự khởi tạo sau Bắt đầu phiên, dừng khi pause/mute/reset/cleanup, có preview và volume.
- Emotion Studio, Lazy Mode/Thử 2 phút, combo, Critical Moment, Boss Trì hoãn, Ong vs Trì hoãn, completion flow và mascot Lumi/Ong.

## Thiếu hoặc mới chỉ là ý tưởng

### Audio Center và soundscape

- Catalog phong phú theo bốn nhóm: thiên nhiên (mưa nhẹ, mưa lớn, sấm xa, rừng, gió, biển, suối); không gian (quán cà phê, thư viện, phòng học, tiếng bút, lật sách, bàn phím); thư giãn (piano nhẹ, ambient, lo-fi, night ambience); tập trung (white noise, brown noise, deep focus, ticking nhẹ).
- Mix nhiều lớp độc lập với volume riêng cho từng lớp, thay vì chỉ chọn một `backgroundSound`.
- Chuyển cảnh mượt giữa lớp âm thanh; loop/dynamic modulation duy trì lâu, không chỉ đổi frequency trong vài oscillator.
- Mini player trong trang khi đang học: timer, trạng thái, soundscape, pause, volume, mở rộng/thu nhỏ/đóng.
- Pin mini player trong phạm vi trang; không giả vờ always-on-top của hệ điều hành.

### Trải nghiệm nền và nhịp học

- Background “thở”: mây trôi, ánh sáng thay đổi, cây rung nhẹ, bụi sáng, mascot chớp mắt; cần toggle và reduced-motion.
- Chuyển tone theo buổi sáng/chiều/tối nhưng vẫn giữ nhận diện đỏ sáng + xanh lá.
- Comeback sau vài ngày nghỉ, không phạt streak.
- Trì hoãn analytics và gợi ý dựa trên hành vi.
- Hộp nhiệm vụ ngẫu nhiên, Lumi chọn giúp, giảm decision fatigue.
- “Một ngày hoàn hảo” và recap cuối ngày theo các hành động có ý nghĩa.

## Ưu tiên phục hồi

1. Soundscape engine đa lớp, catalog đầy đủ, loop lâu và chuyển cảnh mượt.
2. Audio Center trong Pomodoro với mix volume, preset và mini player.
3. Background breathing/time-of-day với toggle và reduced-motion.
4. Hộp nhiệm vụ ngẫu nhiên/comeback/recap nếu không phá flow hiện tại.
5. Ghi rõ các hạng mục chưa phục hồi trong todo, không tuyên bố đã có nếu chỉ mới là placeholder.
