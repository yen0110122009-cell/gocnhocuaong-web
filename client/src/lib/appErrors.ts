export type AppErrorKind = "network" | "authentication" | "sync" | "data" | "unknown";

export type FriendlyAppError = {
  kind: AppErrorKind;
  title: string;
  message: string;
  action: string;
};

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? "");
}

export function classifyAppError(error: unknown, context: "login" | "sync" | "load" | "save" | "data" = "sync"): AppErrorKind {
  const text = errorText(error).toLowerCase();
  if (context === "login" || /unauthorized|forbidden|401|403|mật khẩu|đăng nhập|tài khoản|token|phiên .*hết hạn/.test(text)) return "authentication";
  if (/json|html thay vì|malformed|không hợp lệ|parse|cấu trúc|dữ liệu/.test(text) || context === "data") return "data";
  if (/network|failed to fetch|fetch failed|offline|internet|kết nối|dns|timed out|timeout|503|502|504|failed to load resource/.test(text) || (typeof navigator !== "undefined" && navigator.onLine === false)) return "network";
  if (context === "sync" || context === "load" || context === "save" || /cloud-state|đồng bộ|supabase|ghi cloud|đọc cloud/.test(text)) return "sync";
  return "unknown";
}

export function friendlyAppError(error: unknown, context: "login" | "sync" | "load" | "save" | "data" = "sync"): FriendlyAppError {
  const kind = classifyAppError(error, context);
  if (kind === "network") return { kind, title: "Đang mất kết nối", message: "Không thể kết nối máy chủ lúc này. Dữ liệu mới vẫn được giữ trên thiết bị và sẽ chờ đồng bộ khi mạng trở lại.", action: "Kiểm tra Wi‑Fi/4G rồi thử lại." };
  if (kind === "authentication") return { kind, title: "Không thể đăng nhập", message: "Thông tin đăng nhập hoặc phiên tài khoản chưa được chấp nhận.", action: "Kiểm tra tên, mật khẩu, mã tài khoản hoặc đăng nhập lại." };
  if (kind === "sync") return { kind, title: "Đồng bộ chưa hoàn tất", message: "Thay đổi trên thiết bị chưa được ghi lên cloud.", action: "Giữ nguyên trang và thử đồng bộ lại sau ít phút." };
  if (kind === "data") return { kind, title: "Dữ liệu không hợp lệ", message: "Ứng dụng không thể đọc hoặc xử lý dữ liệu nhận được.", action: "Tải lại trang; nếu đang nhập file, hãy chọn đúng file JSON của Góc Học Tập Của Ong." };
  return { kind, title: "Có lỗi xảy ra", message: "Ứng dụng chưa thể hoàn thành thao tác này.", action: "Thử lại; nếu lỗi tiếp tục, hãy tải lại trang." };
}

export function errorForLogin(error: unknown) {
  const detail = errorText(error);
  const friendly = friendlyAppError(error, "login");
  return `${friendly.message} ${friendly.action}${detail && friendly.kind === "authentication" ? ` Chi tiết: ${detail}` : ""}`;
}
