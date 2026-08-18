# Mascot asset audit

- `OngLearnerAvatar.tsx` hiện dùng `/manus-storage/study-historia-bee-mascot_45260784.png` làm `DEFAULT_IMAGE`.
- `Home.tsx` dùng `OngLearnerAvatar` cho nhãn `Ong`.
- `ExperienceStudio.tsx` dùng asset Lumi riêng và `OngLearnerAvatar` cho người học.
- Khi mở trực tiếp URL asset Ong qua preview, tài nguyên chuyển tới CloudFront nhưng browser nhận `AccessDenied`; component có fallback SVG nên có thể hiển thị hình thay thế.
- Cần thay bằng đúng asset Ong mà người dùng đã gửi trước đây hoặc yêu cầu người dùng tải lại asset nếu không còn trong workspace. Không được suy đoán ảnh mới là ảnh chuẩn.
