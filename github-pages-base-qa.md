# GitHub Pages base-path QA

Date: 2026-08-18
URL: https://yen0110122009-cell.github.io/gocnhocuaong2/?v=220a095-basefix
Artifact commit: `220a095`

## Results

- Page title: `GÓC HỌC TẬP CỦA ONG`.
- Login form rendered correctly with Name + Password + Member Code and no email field.
- Browser-visible JavaScript and CSS paths use `/gocnhocuaong2/assets/...` rather than root `/assets/...`.
- Submit with QA-only invalid values (`QA Base Fix`, `wrong-password`, `999999`) entered loading state `Đang xử lý…`, then returned to the idle button.
- The clear red error shown was: `Mã tài khoản không tồn tại. Hãy liên hệ Admin hoặc Founder để được cấp mã.`
- No `Unexpected token '<'` message appeared.

No real credentials were stored in this evidence file.

## Still pending

Authenticated dashboard, achievement progress, Founder/Admin controls, and the special code-111 dashboard require a user-provided test account or an explicitly authorized disposable account. Mobile authenticated QA and physical-device Pomodoro sound testing remain pending.

## Deployment note

The prior artifact had root-relative `/assets` references and produced a blank page because the repository is served at `/gocnhocuaong2/`. Rebuilding with `GITHUB_ACTIONS=1` and pushing the generated static artifact corrected this at commit `220a095`.

## Public support-popup QA

- `Quên mật khẩu?` opens `Hỗ trợ đăng nhập / Quên mật khẩu` and explains that password reset requires Founder/Admin because the no-email flow has no reset link.
- `Quên mã thành viên?` opens `Hỗ trợ đăng nhập / Quên mã thành viên` and explains that the code is issued and managed by Founder/Admin.
- Both dialogs expose a visible `Đã hiểu` action and a close control.

## Plain URL verification after cache-refresh deployment

After commit `9c9a39c`, the plain URL `https://yen0110122009-cell.github.io/gocnhocuaong2/` was opened without a query string. It rendered the branded no-email login form and displayed the updated cloud-state warning, confirming that the refreshed fingerprint is served from the normal URL rather than only from a cache-busting URL.

## JSON guard regression QA

Commit `1c53da5` was opened at the cache-busted GitHub Pages URL. A QA login with an unknown code completed the loading state and displayed `Mã tài khoản không tồn tại. Hãy liên hệ Admin hoặc Founder để được cấp mã.` The browser output contained no `Unexpected token '<'` error. The deployed index referenced `/gocnhocuaong2/assets/index-TJIvYv7x.js`.

## tRPC transform-envelope QA

Commit `fbd8d48` was opened at `https://yen0110122009-cell.github.io/gocnhocuaong2/?v=fbd8d48-transformfix`. The page loaded the new static bundle and a QA login with code `999` completed with the clear message `Mã tài khoản không tồn tại. Hãy liên hệ Admin hoặc Founder để được cấp mã.` The browser session did not expose `Unable to transform response from server`.

## Empty tRPC fallback QA

Commit `e7aa6d2` was opened at `https://yen0110122009-cell.github.io/gocnhocuaong2/?v=e7aa6d2-emptyfix`. The page loaded the new bundle `index-B-7JnR8L.js`; submitting QA code `999` entered the normal `Đang xử lý…` state without showing either `Unable to transform response from server` or the old static-host error message during the browser observation.

The follow-up browser view confirmed the loading state exited and showed the red account-code error. No `Unable to transform response from server` text and no `Bản GitHub Pages dùng cloud-state...` error text appeared.
