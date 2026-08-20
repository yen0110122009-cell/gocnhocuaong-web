import { AudioLines, Mic, Pencil, Play, Plus, Save, Square, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { EmotionId } from "../lib/emotionThemes";
import type { LumiCongratulationMessage, ProfileState } from "../../../shared/study";
import { PersistentCollapsible } from "./PersistentCollapsible";

type Props = {
  profile: ProfileState;
  emotion: EmotionId;
  emotionLabel: string;
  onProfile: (profile: ProfileState, message?: string) => void;
};

function toDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Không thể đọc bản ghi."));
    reader.readAsDataURL(blob);
  });
}

export function LumiCongratulationControls({ profile, emotion, emotionLabel, onProfile }: Props) {
  const messages = profile.lumiCongratulationMessages?.[emotion] ?? [];
  const [draft, setDraft] = useState("");
  const [draftAudioUrl, setDraftAudioUrl] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => () => { recorderRef.current?.stream.getTracks().forEach((track) => track.stop()); }, []);

  function save() {
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toISOString();
    const previous = editingId ? messages.find((item) => item.id === editingId) : undefined;
    const nextMessage: LumiCongratulationMessage = {
      ...(previous ?? { id: crypto.randomUUID(), createdAt: now }),
      text,
      updatedAt: now,
      ...(draftAudioUrl ? { audioUrl: draftAudioUrl, audioMimeType: draftAudioUrl.match(/^data:([^;]+)/)?.[1] } : previous?.audioUrl ? { audioUrl: previous.audioUrl, audioMimeType: previous.audioMimeType, audioDurationSeconds: previous.audioDurationSeconds } : {}),
    };
    const nextMessages = editingId ? messages.map((item) => item.id === editingId ? nextMessage : item) : [nextMessage, ...messages].slice(0, 30);
    onProfile({ ...profile, lumiCongratulationMessages: { ...(profile.lumiCongratulationMessages ?? {}), [emotion]: nextMessages } }, editingId ? "Đã cập nhật lời chúc và bản ghi của Lumi." : "Đã thêm lời chúc của Lumi.");
    setDraft(""); setDraftAudioUrl(undefined); setEditingId(null); setRecordingError("");
  }

  function beginEdit(message: LumiCongratulationMessage) {
    setEditingId(message.id); setDraft(message.text); setDraftAudioUrl(message.audioUrl); setRecordingError("");
  }

  function cancelEdit() { setEditingId(null); setDraft(""); setDraftAudioUrl(undefined); setRecordingError(""); }

  function remove(id: string) {
    const nextMessages = messages.filter((item) => item.id !== id);
    const nextByEmotion = { ...(profile.lumiCongratulationMessages ?? {}) };
    if (nextMessages.length) nextByEmotion[emotion] = nextMessages; else delete nextByEmotion[emotion];
    onProfile({ ...profile, lumiCongratulationMessages: nextByEmotion }, "Đã xóa lời chúc đã chọn.");
    if (editingId === id) cancelEdit();
  }

  async function toggleRecording() {
    setRecordingError("");
    if (recording) { recorderRef.current?.stop(); setRecording(false); return; }
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) { setRecordingError("Thiết bị hoặc trình duyệt chưa hỗ trợ ghi âm trực tiếp."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        try { setDraftAudioUrl(await toDataUrl(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }))); }
        catch (error) { setRecordingError(error instanceof Error ? error.message : "Không thể lưu bản ghi."); }
      };
      recorderRef.current = recorder; recorder.start(); setRecording(true);
    } catch (error) { setRecordingError(error instanceof Error && error.name === "NotAllowedError" ? "Bạn cần cho phép quyền micro để ghi lời thoại." : "Không thể mở micro trên thiết bị này."); }
  }

  function clearDraftAudio() { setDraftAudioUrl(undefined); }

  return <PersistentCollapsible storageKey={`lumi-congratulations-${emotion}`} eyebrow="Cá nhân hóa Lumi" title={`Lời chúc khi ${emotionLabel}`} className="relative z-10 mt-4">
    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Viết lời chúc, an ủi hoặc động viên. Bạn có thể tự ghi giọng nói ngay trên thiết bị; bản ghi là tùy chọn và không cần tải file âm thanh.</p>
    <div className="mt-4 rounded-2xl border border-[#c62828]/15 bg-[#fff8f5] p-3 dark:bg-white/5">
      <label className="text-xs font-black uppercase tracking-wider text-[#7f1d1d]" htmlFor={`lumi-congratulation-${emotion}`}>{editingId ? "Sửa lời thoại" : "Thêm lời thoại mới"}</label>
      <textarea id={`lumi-congratulation-${emotion}`} value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 320))} placeholder="Ví dụ: Bạn đã cố gắng rất nhiều rồi, mình nghỉ một nhịp và tự hào nhé." className="field mt-2 min-h-24 w-full border-[#c62828]/20 bg-white text-sm dark:bg-slate-950" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggleRecording} aria-pressed={recording} className={`rounded-xl px-3 py-2 text-xs font-black text-white ${recording ? "bg-[#c62828]" : "bg-[#2e7d32]"}`}>{recording ? <><Square className="mr-1 inline h-3.5 w-3.5" />Dừng ghi âm</> : <><Mic className="mr-1 inline h-3.5 w-3.5" />{draftAudioUrl ? "Ghi lại giọng" : "Ghi âm trực tiếp"}</>}</button>
        {draftAudioUrl ? <><audio controls src={draftAudioUrl} className="h-9 max-w-full" aria-label="Nghe thử bản ghi lời thoại" /><button type="button" onClick={clearDraftAudio} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-950 dark:text-slate-200"><X className="mr-1 inline h-3.5 w-3.5" />Bỏ bản ghi</button></> : null}
      </div>
      {recording ? <p className="mt-2 text-xs font-bold text-[#c62828]" role="status"><span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-[#c62828]" />Đang ghi âm. Nhấn “Dừng ghi âm” khi hoàn tất.</p> : null}
      {recordingError ? <p className="mt-2 text-xs font-bold text-[#c62828]" role="alert">{recordingError}</p> : null}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-bold text-slate-500">{draft.length}/320 ký tự</span><span className="flex gap-2"><button type="button" onClick={save} disabled={!draft.trim() || recording} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-45">{editingId ? <><Save className="mr-1 inline h-3.5 w-3.5" />Lưu sửa</> : <><Plus className="mr-1 inline h-3.5 w-3.5" />Thêm lời thoại</>}</button>{editingId ? <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-950 dark:text-slate-200"><X className="mr-1 inline h-3.5 w-3.5" />Hủy</button> : null}</span></div>
    </div>
    <div className="mt-4 space-y-2">{messages.length ? messages.map((item) => <article key={item.id} className="rounded-2xl border border-[#2e7d32]/15 bg-[#f5fff5] p-3 dark:bg-white/5"><p className="text-sm font-bold leading-6 text-[#35523a] dark:text-slate-100">“{item.text}”</p><div className="mt-3 flex flex-wrap items-center gap-2"><small className="mr-auto text-[11px] font-bold text-slate-500">Cập nhật {new Date(item.updatedAt).toLocaleDateString("vi-VN")}</small>{item.audioUrl ? <audio controls src={item.audioUrl} className="h-8 max-w-full" aria-label="Phát bản ghi của lời thoại" /> : <span className="text-[11px] font-bold text-slate-500"><AudioLines className="mr-1 inline h-3.5 w-3.5" />Chưa có bản ghi</span>}<button type="button" onClick={() => beginEdit(item)} className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#2e7d32] shadow-sm dark:bg-slate-950"><Pencil className="mr-1 inline h-3.5 w-3.5" />Sửa</button><button type="button" onClick={() => remove(item.id)} className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#c62828] shadow-sm dark:bg-slate-950"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Xóa</button></div></article>) : <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-500 dark:bg-white/5">Chưa có lời thoại cá nhân cho cảm xúc này.</p>}</div>
  </PersistentCollapsible>;
}
