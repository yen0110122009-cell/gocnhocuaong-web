# GitHub Pages audit — 2026-08-20

Source URL: https://yen0110122009-cell.github.io/gocnhocuaong-web/

GitHub Pages API reported `status: built`, source branch `main`, path `/`.
Latest successful workflow `Deploy frontend to GitHub Pages` used commit `dc52add776049c899ffe4631b1384f635c42f324` and run URL: https://github.com/yen0110122009-cell/gocnhocuaong-web/actions/runs/32375648123

The live page returned HTTP 200 and loaded an HTML shell with assets under `/gocnhocuaong-web/assets/`. The page markdown exposed a Lumi image reference `/manus-storage/lumi-mascot-clean_28a6da68.png`, while the screenshot showed the Lumi card with broken/missing image content and alt text visible. The page says GitHub Pages uses cloud-state demo via Supabase anon and does not share the full-stack storage session automatically.

Important diagnosis direction: GitHub Pages is connected and deploying current main, but `/manus-storage/...` is a platform-relative storage path and is not guaranteed to resolve from GitHub Pages. User-uploaded images stored in the full-stack/S3 account also cannot automatically appear in a separate static GitHub Pages deployment unless their public URL/metadata is explicitly synchronized through a reachable backend or exported static asset flow.

## Kiểm tra bổ sung
- URL live: https://yen0110122009-cell.github.io/gocnhocuaong-web/
- Repository: https://github.com/yen0110122009-cell/gocnhocuaong-web
- Workflow deploy-pages gần nhất thành công với HEAD dc52add776049c899ffe4631b1384f635c42f324.
- Local HEAD và user_github/main cùng ở dc52add.
- HTML live vẫn render ảnh Lumi với src `/manus-storage/lumi-mascot-clean_28a6da68.png`, tức đường dẫn tương đối trỏ vào origin GitHub Pages; GitHub Pages không phục vụ endpoint `/manus-storage`, nên ảnh không thể hiển thị.
- Trang live hiện mở được shell đăng nhập, nhưng ảnh Lumi trong screenshot bị vỡ; đây là lỗi asset origin/path, không phải workflow chưa chạy.
