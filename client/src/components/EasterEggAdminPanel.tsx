import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EASTER_EGG_MESSAGES_UPDATED_EVENT, addEasterEggMessage, readEasterEggMessages, removeEasterEggMessage, restoreEasterEggMessages, saveEasterEggMessages, type EasterEggPopupMessage } from "@/lib/easterEggMessages";

export function EasterEggAdminPanel() {
  const [messages, setMessages] = useState<EasterEggPopupMessage[]>(() => readEasterEggMessages());
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const syncMessages = (event?: Event) => {
      const detail = (event as CustomEvent<EasterEggPopupMessage[]> | undefined)?.detail;
      setMessages(detail?.length ? detail : readEasterEggMessages());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "easter_egg_messages" || event.key === "easter_egg_message") syncMessages();
    };
    syncMessages();
    window.addEventListener(EASTER_EGG_MESSAGES_UPDATED_EVENT, syncMessages);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EASTER_EGG_MESSAGES_UPDATED_EVENT, syncMessages);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const addMessage = () => {
    const text = draft.trim();
    if (!text) {
      toast.error("Hãy nhập nội dung pop-up trước.");
      return;
    }
    setMessages(addEasterEggMessage(messages, text));
    setDraft("");
    toast.success("Đã thêm pop-up lời nhắn mới.");
  };

  const removeMessage = (id: string) => {
    setMessages(removeEasterEggMessage(messages, id));
    toast.success("Đã xóa pop-up lời nhắn.");
  };

  const restoreDefault = () => {
    setMessages(restoreEasterEggMessages());
    setDraft("");
    toast.success("Đã khôi phục bộ pop-up cỏ bốn lá mặc định.");
  };

  const useMessage = (message: string) => {
    const current = messages.filter((item) => item.message !== message);
    setMessages(saveEasterEggMessages([{ id: `selected-${Date.now()}`, message }, ...current]));
    toast.success("Đã đưa lời nhắn này lên đầu danh sách.");
  };

  return <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-300/20 dark:bg-emerald-950/15" aria-labelledby="admin-easter-egg-title">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Trứng Phục Sinh 🍀</p>
        <h2 id="admin-easter-egg-title" className="mt-1 font-display text-xl font-black">Quản lý nhiều pop-up cỏ bốn lá</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Thêm bao nhiêu lời nhắn tùy thích. Không giới hạn số ký tự; nội dung được giữ nguyên xuống dòng, lưu vào localStorage và đồng bộ ngay với pop-up ngoài màn hình.</p>
      </div>
      <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-black text-emerald-700 dark:border-emerald-300/20 dark:bg-slate-900 dark:text-emerald-300">{messages.length} pop-up đang lưu</span>
    </div>

    <div className="mt-4 rounded-2xl border border-emerald-200 bg-white/80 p-4 dark:border-emerald-300/20 dark:bg-slate-900/60">
      <label className="block text-sm font-black text-slate-800 dark:text-slate-100" htmlFor="admin-easter-egg-message">Nội dung pop-up mới
        <textarea id="admin-easter-egg-message" className="input mt-2 min-h-32 resize-y whitespace-pre-wrap" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Viết lời nhắn bất kỳ, có thể nhiều dòng…" />
      </label>
      <button type="button" className="primary-button mt-3" onClick={addMessage}><Plus className="h-4 w-4" />Thêm pop-up mới</button>
    </div>

    <div className="mt-4 space-y-2" aria-label="Danh sách pop-up cỏ bốn lá">
      {messages.map((item, index) => <article key={item.id} className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm dark:border-emerald-300/15 dark:bg-slate-900">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200">{index + 1}</span>
        <p className="min-w-0 flex-1 whitespace-pre-line break-words text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{item.message}</p>
        <div className="flex shrink-0 gap-1">
          <button type="button" className="secondary-button !px-2 !py-1.5 text-xs" onClick={() => useMessage(item.message)}>Hiển thị</button>
          <button type="button" className="secondary-button !px-2 !py-1.5 text-xs text-rose-700" onClick={() => removeMessage(item.id)} aria-label={`Xóa pop-up ${index + 1}`}><Trash2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Xóa</span></button>
        </div>
      </article>)}
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" className="secondary-button" onClick={restoreDefault}><RotateCcw className="h-4 w-4" />Khôi phục bộ câu gốc</button>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">Popup đang mở tự đổi lời nhắn sau 6 giây; bạn cũng có thể bấm “Lời nhắn khác”.</span>
    </div>
  </section>;
}
