import { RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_EASTER_EGG_MESSAGE, EASTER_EGG_UPDATED_EVENT, readEasterEggMessage, saveEasterEggMessage } from "@/lib/easterEgg";

export function EasterEggAdminPanel() {
  const [draft, setDraft] = useState(() => readEasterEggMessage());
  const [savedMessage, setSavedMessage] = useState(() => readEasterEggMessage());

  useEffect(() => {
    const syncMessage = () => {
      const next = readEasterEggMessage();
      setDraft(next);
      setSavedMessage(next);
    };
    window.addEventListener(EASTER_EGG_UPDATED_EVENT, syncMessage);
    window.addEventListener("storage", syncMessage);
    return () => {
      window.removeEventListener(EASTER_EGG_UPDATED_EVENT, syncMessage);
      window.removeEventListener("storage", syncMessage);
    };
  }, []);

  const saveMessage = () => {
    const saved = saveEasterEggMessage(draft);
    setDraft(saved);
    setSavedMessage(saved);
    toast.success("Đã cập nhật lời nhắn trong pop-up cỏ bốn lá.");
  };

  const restoreDefault = () => {
    const saved = saveEasterEggMessage("");
    setDraft(saved);
    setSavedMessage(saved);
    toast.success("Đã khôi phục lời nhắn mặc định của cỏ bốn lá.");
  };

  return <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-300/20 dark:bg-emerald-950/15" aria-labelledby="admin-easter-egg-title">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Trứng Phục Sinh 🍀</p>
        <h2 id="admin-easter-egg-title" className="mt-1 font-display text-xl font-black">Chỉnh sửa pop-up cỏ bốn lá</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Thay đổi lời nhắn xuất hiện bên trong pop-up “Lời nhắn từ bạn 🍀”. Nội dung được lưu ở localStorage và đồng bộ ngay với pop-up đang mở ở góc màn hình.</p>
      </div>
      <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-black text-emerald-700 dark:border-emerald-300/20 dark:bg-slate-900 dark:text-emerald-300">Đang dùng: {savedMessage.length}/240 ký tự</span>
    </div>

    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,.9fr)]">
      <label className="block text-sm font-black text-slate-800 dark:text-slate-100" htmlFor="admin-easter-egg-message">
        Lời nhắn trong pop-up
        <textarea id="admin-easter-egg-message" className="input mt-2 min-h-32 resize-y" maxLength={240} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={DEFAULT_EASTER_EGG_MESSAGE} />
        <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-300">Nếu để trống, hệ thống sẽ dùng lời nhắn mặc định.</span>
      </label>
      <article className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-emerald-300/20 dark:bg-slate-900" aria-label="Xem trước pop-up cỏ bốn lá">
        <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Xem trước pop-up</p>
        <p className="mt-3 text-sm font-black text-emerald-800 dark:text-emerald-200">Lời nhắn từ bạn 🍀</p>
        <p className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-center text-sm font-bold leading-6 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-950/30 dark:text-emerald-50">{draft.trim() || DEFAULT_EASTER_EGG_MESSAGE}</p>
      </article>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" className="primary-button" onClick={saveMessage}><Save className="h-4 w-4" />Lưu lời nhắn pop-up</button>
      <button type="button" className="secondary-button" onClick={restoreDefault}><RotateCcw className="h-4 w-4" />Khôi phục mặc định</button>
    </div>
  </section>;
}

