# GitHub Pages error QA

Source URL: https://yen0110122009-cell.github.io/gocnhocuaong2/

On 2026-08-18, the deployed page loaded the branded no-email form with fields for member name, password, and member code, plus Forgot password/member code links. A cache-busted check previously served `assets/index-CVazIDuF.js` after Pages branch main commit `535d89c`.

A non-sensitive invalid QA submission was entered as name `qa-html-json-check`, password `wrong-password-123`, and member code `000`. The deployed button changed to `Đang xử lý…` and the URL stayed on GitHub Pages. Follow-up observation is required to confirm the final error message is returned and the request does not remain pending.

This file records only UI QA evidence; no real account credentials or user data are stored.
