export const isGitHubPages = typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

/** Chuẩn hóa đường dẫn storage khi state được dùng ngoài origin backend. */
export function resolveMediaUrl(value: string | undefined | null): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw || raw.startsWith("data:") || raw.startsWith("blob:") || /^https?:\/\//i.test(raw)) return raw;
  if (isGitHubPages && raw.startsWith("/manus-storage/")) {
    return `${FULLSTACK_PREVIEW_URL.replace(/\/+$/, "")}${raw}`;
  }
  return raw;
}

// GitHub Pages chỉ phục vụ frontend tĩnh; auth không email chạy trên bản full-stack.
export const FULLSTACK_PREVIEW_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/";

export function openFullstackLogin() {
  if (typeof window !== "undefined") window.location.assign(FULLSTACK_PREVIEW_URL);
}

export const noEmailLoginHint = "Đăng nhập bằng tên, mật khẩu và mã thành viên — không cần email.";
export const githubPagesAuthMessage = "GitHub Pages chỉ hiển thị giao diện. Hãy mở bản full-stack để đăng nhập không cần email.";
