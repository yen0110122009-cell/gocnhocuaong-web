export const isGitHubPages = typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

// GitHub Pages chỉ phục vụ frontend tĩnh; auth không email chạy trên bản full-stack.
export const FULLSTACK_PREVIEW_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/";

export function openFullstackLogin() {
  if (typeof window !== "undefined") window.location.assign(FULLSTACK_PREVIEW_URL);
}

export const noEmailLoginHint = "Đăng nhập bằng tên, mật khẩu và mã thành viên — không cần email.";
export const githubPagesAuthMessage = "GitHub Pages chỉ hiển thị giao diện. Hãy mở bản full-stack để đăng nhập không cần email.";
