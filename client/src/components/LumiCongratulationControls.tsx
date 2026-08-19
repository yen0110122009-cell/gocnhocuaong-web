import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { EmotionId } from "../lib/emotionThemes";
import type { LumiCongratulationMessage, ProfileState } from "../../../shared/study";
import { PersistentCollapsible } from "./PersistentCollapsible";

type Props = {
  profile: ProfileState;
  emotion: EmotionId;
  emotionLabel: string;
  onProfile: (profile: ProfileState, message?: string) => void;
};

export function LumiCongratulationControls({ profile, emotion, emotionLabel, onProfile }: Props) {
  const messages = profile.lumiCongratulationMessages?.[emotion] ?? [];
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function save() {
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toISOString();
    const nextMessage: LumiCongratulationMessage = editingId
      ? (messages.find((item) => item.id === editingId) ? { ...messages.find((item) => item.id === editingId)!, text, updatedAt: now } : { id: crypto.randomUUID(), text, createdAt: now, updatedAt: now })
      : { id: crypto.randomUUID(), text, createdAt: now, updatedAt: now };
    const nextMessages = editingId
      ? messages.map((item) => item.id === editingId ? nextMessage : item)
      : [nextMessage, ...messages].slice(0, 30);
    onProfile({ ...profile, lumiCongratulationMessages: { ...(profile.lumiCongratulationMessages ?? {}), [emotion]: nextMessages } }, editingId ? "Đã cập nhật lời chúc của Lumi." : "Đã thêm lời chúc mới của Lumi.");
    setDraft("");
    setEditingId(null);
  }

  function beginEdit(message: LumiCongratulationMessage) {
    setEditingId(message.id);
    setDraft(message.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }

  function remove(id: string) {
    const nextMessages = messages.filter((item) => item.id !== id);
    const nextByEmotion = { ...(profile.lumiCongratulationMessages ?? {}) };
    if (nextMessages.length) nextByEmotion[emotion] = nextMessages;
    else delete nextByEmotion[emotion];
    onProfile({ ...profile, lumiCongratulationMessages: nextByEmotion }, "Đã xóa lời chúc đã chọn.");
    if (editingId === id) cancelEdit();
  }

  return <PersistentCollapsible storageKey={`lumi-congratulations-${emotion}`} eyebrow="Cá nhân hóa Lumi" title={`Lời chúc khi ${emotionLabel}`} className="relative z-10 mt-4">
    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Tự viết những câu Lumi sẽ hiển thị và đọc bằng giọng thiết bị khi Ong đang ở cảm xúc này. Nếu chưa thêm câu nào, Lumi dùng lời động viên mặc định.</p>
    <div className="mt-4 rounded-2xl border border-[#c62828]/15 bg-[#fff8f5] p-3 dark:bg-white/5">
      <label className="text-xs font-black uppercase tracking-wider text-[#7f1d1d]" htmlFor={`lumi-congratulation-${emotion}`}>{editingId ? "Sửa lời chúc" : "Thêm lời chúc mới"}</label>
      <textarea id={`lumi-congratulation-${emotion}`} value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 320))} placeholder="Ví dụ: Ong đã cố gắng rất nhiều rồi, mình nghỉ một nhịp và tự hào nhé." className="field mt-2 min-h-24 w-full border-[#c62828]/20 bg-white text-sm dark:bg-slate-950" />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-bold text-slate-500">{draft.length}/320 ký tự</span><span className="flex gap-2"><button type="button" onClick={save} disabled={!draft.trim()} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-45">{editingId ? <><Save className="mr-1 inline h-3.5 w-3.5" />Lưu sửa</> : <><Plus className="mr-1 inline h-3.5 w-3.5" />Thêm lời chúc</>}</button>{editingId ? <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-950 dark:text-slate-200"><X className="mr-1 inline h-3.5 w-3.5" />Hủy</button> : null}</span></div>
    </div>
    <div className="mt-4 space-y-2">{messages.length ? messages.map((item) => <article key={item.id} className="rounded-2xl border border-[#2e7d32]/15 bg-[#f5fff5] p-3 dark:bg-white/5"><p className="text-sm font-bold leading-6 text-[#35523a] dark:text-slate-100">“{item.text}”</p><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><small className="text-[11px] font-bold text-slate-500">Cập nhật {new Date(item.updatedAt).toLocaleDateString("vi-VN")}</small><span className="flex gap-2"><button type="button" onClick={() => beginEdit(item)} className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#2e7d32] shadow-sm dark:bg-slate-950"><Pencil className="mr-1 inline h-3.5 w-3.5" />Sửa</button><button type="button" onClick={() => remove(item.id)} className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#c62828] shadow-sm dark:bg-slate-950"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Xóa</button></span></div></article>) : <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-500 dark:bg-white/5">Chưa có lời chúc cá nhân cho cảm xúc này.</p>}</div>
  </PersistentCollapsible>;
}
