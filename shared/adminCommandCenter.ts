import type { AdminReward, CollectionEvent, HistoricalCharacter, PieceExchangeFormula, PieceExchangeRule } from "./study";

export type AdminAiCommand =
  | "CREATE_ACHIEVEMENT"
  | "CREATE_TITLE"
  | "CREATE_EVENT"
  | "CREATE_HISTORICAL_CHARACTER"
  | "CREATE_PIECE"
  | "CREATE_SHOP_ITEM"
  | "CREATE_REWARD"
  | "CREATE_CONTENT";

export type AdminDraftStatus = "ai_suggestion" | "admin_review" | "approved" | "rejected";

export type AdminAiDraft = {
  id: string;
  command: AdminAiCommand;
  title: string;
  payload: Record<string, unknown>;
  sourceText?: string;
  sourceUrls?: string[];
  warnings: string[];
  verificationChecklist: string[];
  status: AdminDraftStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
};

export const ADMIN_AI_COMMANDS: Array<{ value: AdminAiCommand; label: string; description: string }> = [
  { value: "CREATE_ACHIEVEMENT", label: "Tạo Thành tích", description: "Tạo bản nháp điều kiện đo lường được và phần thưởng công khai." },
  { value: "CREATE_TITLE", label: "Tạo Danh hiệu", description: "Tạo bản nháp tên, ý nghĩa, nguồn cảm hứng và giải thích." },
  { value: "CREATE_EVENT", label: "Tạo Event", description: "Tạo bản nháp thời gian, nhiệm vụ, điều kiện, giới hạn và phần thưởng." },
  { value: "CREATE_HISTORICAL_CHARACTER", label: "Tạo Nhân vật lịch sử", description: "Tạo bản nháp dựa trên tư liệu nguồn do Admin cung cấp." },
  { value: "CREATE_PIECE", label: "Tạo loại mảnh", description: "Tạo cấu hình loại mảnh, giá trị, công dụng và cách nhận." },
  { value: "CREATE_SHOP_ITEM", label: "Tạo vật phẩm cửa hàng", description: "Tạo bản nháp vật phẩm và giá cấu hình được." },
  { value: "CREATE_REWARD", label: "Tạo phần thưởng", description: "Tạo bản nháp reward, không thực hiện cấp thưởng." },
  { value: "CREATE_CONTENT", label: "Tạo nội dung Lumi", description: "Tạo bản nháp nội dung hỗ trợ học tập chờ Admin duyệt." },
];

export function createAdminAiDraft(command: AdminAiCommand, payload: Record<string, unknown>, now = new Date().toISOString()): AdminAiDraft {
  const title = String(payload.title ?? payload.name ?? command).trim() || command;
  const sourceUrls = Array.isArray(payload.sourceUrls) ? payload.sourceUrls.map(String).filter(Boolean) : [];
  return {
    id: `ai-draft-${command.toLowerCase()}-${Date.now()}`,
    command,
    title,
    payload,
    sourceText: typeof payload.sourceText === "string" ? payload.sourceText : undefined,
    sourceUrls,
    warnings: ["Bản nháp do AI đề xuất; chưa phải dữ liệu chính thức.", "Admin phải kiểm tra nguồn, điều kiện, phần thưởng và tính đo lường trước khi duyệt."],
    verificationChecklist: command === "CREATE_HISTORICAL_CHARACTER" || command === "CREATE_TITLE"
      ? ["Xác minh nguồn tư liệu", "Kiểm tra dữ kiện văn hóa/lịch sử", "Kiểm tra ảnh và quyền sử dụng", "Admin duyệt thủ công"]
      : ["Kiểm tra dữ liệu bắt buộc", "Kiểm tra không có điều kiện ẩn", "Kiểm tra phần thưởng rõ ràng", "Admin duyệt thủ công"],
    status: "ai_suggestion",
    createdAt: now,
  };
}

export function approveAdminAiDraft(draft: AdminAiDraft, adminId: string, note = "", now = new Date().toISOString()) {
  if (draft.status === "approved") return { draft, approved: false, reason: "already_approved" as const };
  if (!adminId.trim()) return { draft, approved: false, reason: "missing_admin" as const };
  return { draft: { ...draft, status: "approved" as const, reviewedAt: now, reviewedBy: adminId, reviewNote: note.trim() || undefined }, approved: true, reason: "ok" as const };
}

export function canPublishAdminDraft(draft: AdminAiDraft) {
  return draft.status === "approved" && Boolean(draft.reviewedBy && draft.reviewedAt);
}

export function adminDraftTypeGuard(value: unknown): value is AdminAiDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<AdminAiDraft>;
  return typeof draft.id === "string" && typeof draft.command === "string" && typeof draft.title === "string" && typeof draft.payload === "object" && Array.isArray(draft.warnings) && ["ai_suggestion", "admin_review", "approved", "rejected"].includes(String(draft.status));
}

export type AdminDraftEntity = AdminReward | CollectionEvent | HistoricalCharacter | PieceExchangeRule | PieceExchangeFormula;
