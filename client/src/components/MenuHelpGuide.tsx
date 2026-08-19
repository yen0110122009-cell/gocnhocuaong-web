import { CircleHelp, Sparkles, X } from "lucide-react";
import { useState } from "react";

type MenuHelpItem = {
  id: string;
  title: string;
  purpose: string;
  firstStep: string;
  audience?: "admin" | "special111";
};

const menuHelpItems: MenuHelpItem[] = [
  { id: "dashboard", title: "Trang chủ", purpose: "Xem nhanh cấp độ, XP, việc học gần đây và những gợi ý nên làm tiếp theo.", firstStep: "Bắt đầu từ thẻ gợi ý phù hợp với phiên học hôm nay." },
  { id: "special111", title: "Trung tâm 111", purpose: "Không gian điều khiển mở rộng dành riêng cho tài khoản sử dụng mã thành viên 111.", firstStep: "Chọn một lối tắt để vào ngay hoạt động bạn đang cần.", audience: "special111" },
  { id: "focus", title: "Ôn tập thông minh", purpose: "Chọn hoạt động ôn tập ngắn, phù hợp với nhịp học và mục tiêu hiện tại.", firstStep: "Chọn một gợi ý rồi học theo từng bước nhỏ." },
  { id: "ai-import", title: "Nhập dữ liệu AI", purpose: "Đưa tài liệu vào hệ thống để tạo dữ liệu học tập có cấu trúc như Flashcard hoặc câu hỏi.", firstStep: "Dán nội dung hoặc tải tài liệu lên, sau đó kiểm tra bản nháp trước khi lưu." },
  { id: "pomodoro", title: "Pomodoro", purpose: "Chia thời gian học thành các phiên tập trung, có nghỉ giữa chặng và lưu lại lịch sử học.", firstStep: "Chọn thời lượng, bật âm thanh nếu cần rồi bắt đầu phiên đầu tiên." },
  { id: "knowledge", title: "Bản đồ kiến thức", purpose: "Theo dõi các chủ đề đã học và nhận ra phần kiến thức cần củng cố.", firstStep: "Mở một nhánh kiến thức để xem nội dung hoặc tiến độ liên quan." },
  { id: "history", title: "Lịch sử học", purpose: "Xem lại các phiên học, thời lượng và dấu mốc đã hoàn thành theo thời gian.", firstStep: "Dùng lịch sử để nhận diện ngày học hiệu quả và điều chỉnh nhịp học." },
  { id: "exam", title: "Tôi sắp kiểm tra", purpose: "Lập kế hoạch ôn theo kỳ kiểm tra sắp tới và ưu tiên nội dung cần chuẩn bị.", firstStep: "Tạo hoặc chọn một kế hoạch ôn, sau đó hoàn thành từng việc nhỏ." },
  { id: "progress", title: "Tiến trình", purpose: "Xem sự thay đổi trong quá trình học, từ XP, số phiên đến các mục tiêu đang theo đuổi.", firstStep: "So sánh tiến độ hiện tại với mục tiêu để chọn bước tiếp theo." },
  { id: "studio", title: "AI Studio", purpose: "Tạo và chỉnh sửa Flashcard, câu hỏi hoặc nội dung học tập có sự hỗ trợ của AI.", firstStep: "Nhập yêu cầu rõ ràng, xem bản nháp và tự kiểm tra trước khi sử dụng." },
  { id: "flashcards", title: "Flashcard", purpose: "Học và ôn kiến thức bằng các bộ thẻ hỏi–đáp, có thể theo dõi trạng thái từng thẻ.", firstStep: "Mở một bộ thẻ, trả lời lần lượt và đánh dấu thẻ cần ôn lại." },
  { id: "quizzes", title: "Đề kiểm tra", purpose: "Làm bài kiểm tra, xem kết quả và lưu lịch sử để biết phần nào cần học lại.", firstStep: "Chọn đề phù hợp, làm bài độc lập rồi đọc phần giải thích sau khi nộp." },
  { id: "achievements", title: "Thành tích", purpose: "Theo dõi toàn bộ 900 Thành tích và 400 Danh hiệu công khai cùng điều kiện, tiến độ và phần thưởng rõ ràng.", firstStep: "Lọc theo nhóm hoặc cấp độ, rồi xem mục còn thiếu để biết cách chinh phục." },
  { id: "museum", title: "Bảo tàng hành trình", purpose: "Sưu tầm mảnh ghép, mở khóa nhân vật lịch sử và xem nguồn tư liệu của từng nhân vật.", firstStep: "Mở phần Bộ sưu tập mảnh ghép để xem mảnh đang có thể dùng vào đâu." },
  { id: "shop", title: "Cửa hàng giao diện", purpose: "Đổi mảnh ghép hoặc vé lấy bảng màu và nền chuyển động để cá nhân hóa không gian học.", firstStep: "Xem rõ giá và số dư trước, rồi mua hoặc trang bị vật phẩm bạn đã sở hữu." },
  { id: "wheel", title: "Vòng quay tri thức", purpose: "Tham gia hoạt động quay thưởng theo các cấu hình công khai của hệ thống.", firstStep: "Đọc phần thưởng và điều kiện hiển thị trước khi thực hiện lượt quay." },
  { id: "account", title: "Tài khoản", purpose: "Quản lý thông tin hồ sơ, danh hiệu hiển thị, trạng thái cảm xúc và các tùy chọn tập trung cá nhân.", firstStep: "Chọn một danh hiệu đã đạt hoặc điều chỉnh cài đặt phù hợp với cách học của bạn." },
  { id: "admin", title: "Admin Panel", purpose: "Khu vực quản trị để kiểm soát nội dung, Event, phần thưởng, dữ liệu AI và kiểm tra module.", firstStep: "Tạo hoặc chỉnh sửa dữ liệu theo form, kiểm tra bản nháp AI và tự duyệt trước khi công bố.", audience: "admin" },
];

export function MenuHelpGuide({ currentView, isAdmin, isUnlimitedAccount }: { currentView: string; isAdmin: boolean; isUnlimitedAccount: boolean }) {
  const [open, setOpen] = useState(false);
  const visibleItems = menuHelpItems.filter((item) => (!item.audience || item.audience === "admin" ? isAdmin : isUnlimitedAccount));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mở hướng dẫn các mục menu"
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border-2 border-white/75 bg-[#c62828] text-white shadow-[0_12px_26px_rgba(142,27,27,.32)] transition-transform duration-150 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f4b942]/60 active:scale-95 dark:border-[#3a2a1d]"
      >
        <CircleHelp className="h-6 w-6" aria-hidden="true" />
      </button>
      {open && <div role="dialog" aria-modal="true" aria-labelledby="menu-help-title" className="fixed inset-0 z-[60] flex justify-end bg-slate-950/45" onClick={() => setOpen(false)}>
        <section className="flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-[#eadfd2] bg-[#fffdf8] text-slate-800 shadow-2xl dark:border-white/10 dark:bg-[#241b16] dark:text-slate-100" onClick={(event) => event.stopPropagation()}>
          <header className="relative border-b border-[#eadfd2] bg-white/75 px-6 py-5 pr-14 dark:border-white/10 dark:bg-[#2b2019]">
            <div className="flex items-center gap-2 text-[#8e1b1b] dark:text-amber-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[.18em]">Hướng dẫn sử dụng</span>
            </div>
            <h2 id="menu-help-title" className="mt-2 font-display text-2xl font-bold text-[#8e1b1b] dark:text-amber-100">Mỗi phần trong menu dùng để làm gì?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Chạm vào dấu hỏi này ở bất kỳ màn hình nào để xem chức năng và cách bắt đầu ngắn gọn của từng khu vực.</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng hướng dẫn menu" className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c62828] dark:text-slate-300 dark:hover:bg-white/10"><X className="h-5 w-5" /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-5 sm:p-6">
            {visibleItems.map((item) => {
              const isCurrent = item.id === currentView;
              return <article key={item.id} className={`rounded-2xl border p-4 ${isCurrent ? "border-[#c62828]/45 bg-[#fff4e7] shadow-sm dark:border-amber-300/40 dark:bg-[#3a2a1d]" : "border-[#eadfd2] bg-white/80 dark:border-white/10 dark:bg-white/5"}`}>
                <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-[#8e1b1b] dark:text-amber-100">{item.title}</h3>{isCurrent && <span className="shrink-0 rounded-full bg-[#c62828] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Đang mở</span>}</div>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.purpose}</p>
                <p className="mt-3 rounded-xl bg-[#f5f7f2] px-3 py-2 text-xs leading-5 text-[#2e7d32] dark:bg-[#253526] dark:text-green-200"><strong>Bắt đầu:</strong> {item.firstStep}</p>
              </article>;
            })}
          </div>
        </section>
      </div>}
    </>
  );
}
