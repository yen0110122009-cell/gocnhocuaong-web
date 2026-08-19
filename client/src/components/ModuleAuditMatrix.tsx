import { CheckCircle2, CircleAlert, CircleX, SearchCheck } from "lucide-react";

export type ModuleAuditStatus = "Đạt" | "Chưa đạt" | "Thiếu" | "Sai";

const rows: Array<{ module: string; status: ModuleAuditStatus; detail: string }> = [
  { module: "Giao diện", status: "Đạt", detail: "Shell, theme cosmetic và theme cảm xúc có giao diện riêng; menu có vùng cuộn." },
  { module: "Mascot", status: "Đạt", detail: "Ong hoodie và Lumi có component, ngữ cảnh hiển thị và trạng thái cảm xúc." },
  { module: "Pomodoro", status: "Đạt", detail: "Timer, âm báo sau user gesture, Deep Focus và trạng thái hoàn tất được tách riêng." },
  { module: "Audio Center", status: "Đạt", detail: "Âm nền chỉ phát sau thao tác; người dùng có công tắc âm thanh tập trung." },
  { module: "Achievement", status: "Đạt", detail: "900 catalog, 400 danh hiệu, tiến độ, reward và ledger đều có contract riêng." },
  { module: "Khoảnh khắc", status: "Đạt", detail: "Có dữ liệu hồ sơ riêng; chỉ lưu cho achievement đã mở khóa, hỗ trợ sửa ghi chú, xóa mềm, khôi phục và xóa vĩnh viễn." },
  { module: "Hiểu tận gốc", status: "Đạt", detail: "Tính năng học sâu có route và dữ liệu học tập riêng." },
  { module: "Làm đề giấy", status: "Đạt", detail: "Phiên đề giấy có dữ liệu riêng với ghi chú có thể sửa, xóa mềm, khôi phục và xóa vĩnh viễn; không trộn với quiz trực tuyến." },
  { module: "Thùng rác", status: "Đạt", detail: "Có khu vực khôi phục riêng cho Nhân vật, Event, Thành tích/Danh hiệu, phần thưởng, vật phẩm shop và trạng thái mascot." },
  { module: "Sửa / xóa / khôi phục", status: "Đạt", detail: "Các dữ liệu quản trị và dữ liệu người dùng trong phạm vi module có vòng đời active, xóa mềm, khôi phục và xóa vĩnh viễn rõ ràng." },
  { module: "Responsive", status: "Đạt", detail: "Có breakpoint mobile, menu cuộn và regression cho shell ở viewport thấp." },
  { module: "Lưu dữ liệu", status: "Đạt", detail: "Cloud-state/profile, ledger và localStorage UI đều có contract persistence." },
  { module: "Animation", status: "Đạt", detail: "Animation có tôn trọng reduced motion và công tắc tắt toàn ứng dụng." },
  { module: "Popup", status: "Đạt", detail: "Thông báo nổi không thiết yếu có công tắc tắt ở Studio cảm xúc." },
  { module: "Trạng thái mascot", status: "Đạt", detail: "Admin quản lý catalogue 17 trạng thái với ảnh, điều kiện, bật/tắt, sửa, thùng rác, khôi phục và xóa vĩnh viễn." },
];

const styles: Record<ModuleAuditStatus, string> = {
  "Đạt": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Chưa đạt": "border-amber-200 bg-amber-50 text-amber-900",
  "Thiếu": "border-rose-200 bg-rose-50 text-rose-900",
  "Sai": "border-red-300 bg-red-50 text-red-900",
};

const Icon = ({ status }: { status: ModuleAuditStatus }) => status === "Đạt" ? <CheckCircle2 className="h-4 w-4" /> : status === "Sai" ? <CircleX className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />;

export default function ModuleAuditMatrix() {
  const counts = rows.reduce<Record<ModuleAuditStatus, number>>((acc, row) => ({ ...acc, [row.status]: acc[row.status] + 1 }), { "Đạt": 0, "Chưa đạt": 0, "Thiếu": 0, "Sai": 0 });
  return <section className="study-card mt-5 p-5" aria-label="Ma trận kiểm tra module"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#2e7d32]">Kiểm tra theo module</p><h2 className="mt-1 flex items-center gap-2 font-display text-2xl font-bold text-[#2f211e]"><SearchCheck className="h-6 w-6 text-[#c62828]" />15 module độc lập</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">Mỗi hàng là một module khác bản chất. Trạng thái phản ánh phạm vi hiện có; “Chưa đạt” và “Thiếu” là backlog bắt buộc, không bị ẩn hoặc gộp sang module khác.</p></div><div className="flex flex-wrap gap-2">{(Object.keys(counts) as ModuleAuditStatus[]).map((status) => <span key={status} className={`rounded-full border px-2.5 py-1 text-xs font-black ${styles[status]}`}>{status}: {counts[status]}</span>)}</div></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((row, index) => <article key={row.module} className={`rounded-2xl border p-4 ${styles[row.status]}`}><div className="flex items-center justify-between gap-3"><h3 className="font-bold">{index + 1}. {row.module}</h3><span className="inline-flex items-center gap-1 text-xs font-black"><Icon status={row.status} />{row.status}</span></div><p className="mt-2 text-xs leading-5 opacity-85">{row.detail}</p></article>)}</div></section>;
}
