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
  customPrompt?: string;
  warnings: string[];
  verificationChecklist: string[];
  status: AdminDraftStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
};

export type AdminAiCommandGuide = { value: AdminAiCommand; label: string; description: string; purpose: string; inputGuide: string; outputGuide: string; approvalGuide: string };

export const ADMIN_AI_COMMANDS: AdminAiCommandGuide[] = [
  { value: "CREATE_ACHIEVEMENT", label: "Tạo Thành tích", description: "Tạo bản nháp điều kiện đo lường được và phần thưởng công khai.", purpose: "Dùng khi cần đề xuất một mốc tiến bộ có thể tính tự động trong catalog 900 Thành tích.", inputGuide: "Nhập chủ đề, độ khó, chỉ số cần đo, mục tiêu, nhóm, nguồn cảm hứng và phần thưởng mong muốn. Không nhập điều kiện mơ hồ như 'chăm chỉ hơn'.", outputGuide: "AI phải trả về tên, mô tả, điều kiện, cách tính tiến độ, mục tiêu, cấp, nhóm, phần thưởng cụ thể và các điểm cần Admin kiểm tra.", approvalGuide: "Admin đối chiếu khả năng đo lường, không trùng mốc hiện có, phần thưởng rõ ràng rồi mới duyệt." },
  { value: "CREATE_TITLE", label: "Tạo Danh hiệu", description: "Tạo bản nháp tên, ý nghĩa, nguồn cảm hứng và giải thích.", purpose: "Dùng cho 400 thành tích đặc biệt tạo thành Danh hiệu công khai.", inputGuide: "Nhập thành tích liên quan, chủ đề, câu ca dao/tục ngữ nếu đã có nguồn và tư liệu xác minh. Nếu không có nguồn, yêu cầu AI ghi rõ 'lấy cảm hứng'.", outputGuide: "AI phải trả về tên, ý nghĩa, điều kiện liên kết, nguồn/cảm hứng, giải thích câu nói, lý do phù hợp và phần thưởng.", approvalGuide: "Admin kiểm tra nguồn văn hóa, tránh bịa câu nói, kiểm tra không có danh hiệu ẩn rồi mới duyệt." },
  { value: "CREATE_EVENT", label: "Tạo Event", description: "Tạo bản nháp thời gian, nhiệm vụ, điều kiện, giới hạn và phần thưởng.", purpose: "Dùng để đề xuất Event có dữ liệu thật, nhiệm vụ thật và cơ chế nhận thưởng idempotent.", inputGuide: "Nhập chủ đề, thời gian, mục tiêu, nhiệm vụ, điều kiện tham gia, giới hạn nhận và loại mảnh/phần thưởng.", outputGuide: "AI phải trả về tên, mô tả, thời gian, điều kiện, nhiệm vụ, tiêu chí hoàn thành, giới hạn và thông báo.", approvalGuide: "Admin kiểm tra ngày tháng, điều kiện có thể đo, giới hạn farm và phần thưởng trước khi kích hoạt." },
  { value: "CREATE_HISTORICAL_CHARACTER", label: "Tạo Nhân vật lịch sử", description: "Tạo bản nháp dựa trên tư liệu nguồn do Admin cung cấp.", purpose: "Dùng để tạo hồ sơ nhân vật lịch sử từ tư liệu có nguồn, không tự bịa ảnh hay dữ kiện.", inputGuide: "Nhập tên, nguồn, URL và dán tư liệu tham khảo. Chỉ cung cấp nội dung Admin có quyền sử dụng.", outputGuide: "AI phải trả về thời kỳ, mô tả, đóng góp, ý nghĩa giáo dục, độ hiếm đề xuất, giá mở khóa và dữ kiện cần kiểm chứng.", approvalGuide: "Admin kiểm chứng từng dữ kiện, nguồn, bản quyền ảnh và trạng thái ảnh trước khi duyệt." },
  { value: "CREATE_PIECE", label: "Tạo loại mảnh", description: "Tạo cấu hình loại mảnh, giá trị, công dụng và cách nhận.", purpose: "Dùng để đề xuất loại mảnh mới cho nền kinh tế minh bạch.", inputGuide: "Nhập tên, mã, độ hiếm, giá trị, công dụng, nguồn nhận và cách đổi.", outputGuide: "AI phải trả về cấu hình có mã duy nhất, giá trị, mô tả công dụng, cách nhận và công thức đổi đề xuất.", approvalGuide: "Admin kiểm tra giá trị tăng theo độ hiếm, không tạo mảnh âm và không tạo tỷ lệ đổi ngoài cấu hình." },
  { value: "CREATE_SHOP_ITEM", label: "Tạo vật phẩm cửa hàng", description: "Tạo bản nháp vật phẩm và giá cấu hình được.", purpose: "Dùng để đề xuất theme, nền animation hoặc vật phẩm sưu tầm bán bằng currency hiện có.", inputGuide: "Nhập loại vật phẩm, mã cosmetic, giá, currency, độ hiếm, công dụng và trạng thái.", outputGuide: "AI phải trả về tên, mô tả công dụng, loại, giá, currency, độ hiếm, preview và điều kiện sử dụng.", approvalGuide: "Admin kiểm tra giá, mô tả, asset thật và khả năng giao dịch qua ledger trước khi duyệt." },
  { value: "CREATE_REWARD", label: "Tạo phần thưởng", description: "Tạo bản nháp reward, không thực hiện cấp thưởng.", purpose: "Dùng để chuẩn hóa phần thưởng cho thành tích, Event hoặc thao tác quản trị.", inputGuide: "Nhập tên, loại, giá trị, độ hiếm, icon, mô tả và điều kiện.", outputGuide: "AI phải trả về reward đầy đủ trường và ghi rõ không có phần thưởng ẩn.", approvalGuide: "Admin kiểm tra giá trị, điều kiện, nguồn cấp và audit metadata; AI không được tự cấp." },
  { value: "CREATE_CONTENT", label: "Tạo nội dung Lumi", description: "Tạo bản nháp nội dung hỗ trợ học tập chờ Admin duyệt.", purpose: "Dùng cho lời khích lệ, an ủi, nhắc học hoặc micro-task phù hợp ngữ cảnh.", inputGuide: "Nhập ngữ cảnh, giọng điệu, độ dài, đối tượng và điều cần tránh.", outputGuide: "AI phải trả về nội dung, ngữ cảnh, tone, mascot và các điểm cần kiểm duyệt.", approvalGuide: "Admin đọc từng câu, loại nội dung gây áp lực hoặc sai ngữ cảnh rồi mới duyệt." },
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
    customPrompt: typeof payload.customPrompt === "string" ? payload.customPrompt : undefined,
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
