import { AudioLines, Mic, Pencil, Play, Plus, Save, Square, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { EmotionId } from "../lib/emotionThemes";
import type { LumiCongratulationMessage, ProfileState } from "../../../shared/study";
import { trpc } from "../lib/trpc";
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

function getToken() { try { return JSON.parse(sessionStorage.getItem("study_historia_session_v1") || "{}").token as string || ""; } catch { return ""; } }

export function LumiCongratulationControls({ profile, emotion, emotionLabel, onProfile }: Props) {
  const upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  const messages = profile.lumiCongratulationMessages?.[emotion] ?? [];
  const [draft, setDraft] = useState("");
  const [draftAudioUrl, setDraftAudioUrl] = useState<string | undefined>();
  const [draftAudioMimeType, setDraftAudioMimeType] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("");
  const [showAllMessages, setShowAllMessages] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const visibleMessages = showAllMessages ? messages : messages.slice(0, 1);

  useEffect(() => () => { recorderRef.current?.stream.getTracks().forEach((track) => track.stop()); }, []);

  function save() {
    const text = draft.trim();
    if (!text && !draftAudioUrl) return;
    const now = new Date().toISOString();
    const previous = editingId ? messages.find((item) => item.id === editingId) : undefined;
    const nextMessage: LumiCongratulationMessage = {
      ...(previous ?? { id: crypto.randomUUID(), createdAt: now }),
      text: text || previous?.text || `Bản thu Lumi · ${emotionLabel}`,
      updatedAt: now,
      ...(draftAudioUrl ? { audioUrl: draftAudioUrl, ...(draftAudioMimeType ? { audioMimeType: draftAudioMimeType } : {}) } : previous?.audioUrl ? { audioUrl: previous.audioUrl, audioMimeType: previous.audioMimeType, audioDurationSeconds: previous.audioDurationSeconds } : {}),
    };
    const nextMessages = editingId ? messages.map((item) => item.id === editingId ? nextMessage : item) : [nextMessage, ...messages].slice(0, 30);
    onProfile({ ...profile, lumiCongratulationMessages: { ...(profile.lumiCongratulationMessages ?? {}), [emotion]: nextMessages } }, editingId ? "Đã cập nhật lời chúc và bản ghi của Lumi." : "Đã thêm lời chúc của Lumi.");
    setDraft(""); setDraftAudioUrl(undefined); setDraftAudioMimeType(undefined); setEditingId(null); setRecordingError(""); setRecordingStatus("Đã lưu lời chúc và bản thu Lumi.");
  }

  function beginEdit(message: LumiCongratulationMessage) {
    setEditingId(message.id); setDraft(message.text); setDraftAudioUrl(message.audioUrl); setDraftAudioMimeType(message.audioMimeType); setRecordingError(""); setRecordingStatus("");
  }

  function cancelEdit() { setEditingId(null); setDraft(""); setDraftAudioUrl(undefined); setDraftAudioMimeType(undefined); setRecordingError(""); setRecordingStatus(""); }

  function remove(id: string) {
    const nextMessages = messages.filter((item) => item.id !== id);
    const nextByEmotion = { ...(profile.lumiCongratulationMessages ?? {}) };
    if (nextMessages.length) nextByEmotion[emotion] = nextMessages; else delete nextByEmotion[emotion];
    onProfile({ ...profile, lumiCongratulationMessages: nextByEmotion }, "Đã xóa lời chúc đã chọn.");
    if (editingId === id) cancelEdit();
  }

  async function toggleRecording() {
    setRecordingError(""); setRecordingStatus("");
    if (recording) {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      setRecording(false);
      setRecordingStatus("Đang tạo bản nghe thử từ phần vừa ghi…");
      return;
    }
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) { setRecordingError("Trình duyệt này chưa hỗ trợ ghi âm trực tiếp. Hãy dùng Chrome, Edge hoặc Safari bản mới, rồi cho phép micro."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onerror = () => { stream.getTracks().forEach((track) => track.stop()); recorderRef.current = null; setRecording(false); setRecordingError("Ghi âm bị gián đoạn. Hãy kiểm tra micro, đóng ứng dụng khác đang dùng micro rồi thử lại."); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        const audioMimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: audioMimeType });
        if (!blob.size) { setRecordingError("Bản ghi trống. Hãy kiểm tra micro, nói thử vài giây rồi ghi lại."); return; }
        if (blob.size > 25 * 1024 * 1024) { setRecordingError("Bản ghi vượt quá 25 MB. Hãy ghi ngắn hơn rồi thử lại."); return; }
        const token = getToken();
        if (!token) { setRecordingError("Cần đăng nhập bằng mã được cấp để lưu bản thu Lumi. Phiên khách chỉ xem được và không lưu được tiến trình."); return; }
        const extension = audioMimeType.includes("mp4") ? "m4a" : audioMimeType.includes("ogg") ? "ogg" : audioMimeType.includes("wav") ? "wav" : "webm";
        try {
          setRecordingStatus("Đang lưu bản thu vào thư viện an toàn…");
          const result = await upload.mutateAsync({ token, fileName: `loi-chuc-lumi-${emotion}-${Date.now()}.${extension}`, contentType: audioMimeType as "audio/webm", dataUrl: await toDataUrl(blob), mediaType: "lumi-voice" });
          setDraftAudioUrl(result.url);
          setDraftAudioMimeType(audioMimeType);
          setRecordingStatus("Đã ghi và lưu tệp âm thanh. Nhấn nút phát nghe thử; nếu ổn, hãy nhấn Lưu bản thu.");
        } catch (error) { setRecordingError(error instanceof Error ? error.message : "Không thể lưu bản ghi. Hãy kiểm tra kết nối rồi thử lại."); }
      };
      recorderRef.current = recorder; recorder.start(500); setRecording(true); setRecordingStatus("Đang ghi âm. Nhấn Dừng ghi âm khi hoàn tất.");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setRecordingError(name === "NotAllowedError" || name === "SecurityError" ? "Micro đang bị chặn. Hãy nhấn biểu tượng khóa/cài đặt cạnh thanh địa chỉ, cho phép Microphone cho trang này rồi nhấn Ghi âm trực tiếp lại." : name === "NotFoundError" ? "Không tìm thấy micro khả dụng. Hãy kết nối micro hoặc kiểm tra cài đặt thiết bị rồi thử lại." : "Không thể mở micro trên thiết bị này. Hãy đóng ứng dụng khác đang dùng micro rồi thử lại.");
    }
  }

  function clearDraftAudio() { setDraftAudioUrl(undefined); setDraftAudioMimeType(undefined); }

  return <PersistentCollapsible storageKey={`lumi-congratulations-${emotion}`} eyebrow="Cá nhân hóa Lumi" title={`Lời chúc khi ${emotionLabel}`} className="relative z-10 mt-4">
    <div id={`lumi-congratulations-${emotion}`} tabIndex={-1} className="scroll-mt-6 outline-none">
    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Viết lời chúc, an ủi hoặc động viên. Khi dừng ghi, bản thu được lưu thành tệp audio riêng rồi hiện nút nghe thử; không nhúng tệp lớn vào hồ sơ.</p>
    <div className="mt-4 rounded-2xl border border-[#c62828]/15 bg-[#fff8f5] p-3 dark:bg-white/5">
      <label className="text-xs font-black uppercase tracking-wider text-[#7f1d1d]" htmlFor={`lumi-congratulation-${emotion}`}>{editingId ? "Sửa lời thoại" : "Thêm lời thoại mới"}</label>
      <textarea id={`lumi-congratulation-${emotion}`} value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 320))} placeholder="Ví dụ: Bạn đã cố gắng rất nhiều rồi, mình nghỉ một nhịp và tự hào nhé." className="field mt-2 min-h-24 w-full border-[#c62828]/20 bg-white text-sm dark:bg-slate-950" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggleRecording} aria-pressed={recording} className={`rounded-xl px-3 py-2 text-xs font-black text-white ${recording ? "bg-[#c62828]" : "bg-[#2e7d32]"}`}>{recording ? <><Square className="mr-1 inline h-3.5 w-3.5" />Dừng ghi âm</> : <><Mic className="mr-1 inline h-3.5 w-3.5" />{draftAudioUrl ? "Ghi lại giọng" : "Ghi âm trực tiếp"}</>}</button>
        {draftAudioUrl ? <><audio controls src={draftAudioUrl} onError={() => setRecordingError("Không thể phát bản nghe thử này. Hãy ghi lại bằng Chrome, Edge hoặc Safari bản mới.")} className="h-9 max-w-full" aria-label="Nghe thử bản ghi lời thoại" /><button type="button" onClick={clearDraftAudio} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-950 dark:text-slate-200"><X className="mr-1 inline h-3.5 w-3.5" />Bỏ bản ghi</button></> : null}
      </div>
      {recording ? <p className="mt-2 text-xs font-bold text-[#c62828]" role="status"><span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-[#c62828]" />Đang ghi âm. Nhấn “Dừng ghi âm” khi hoàn tất.</p> : null}
      {recordingStatus ? <p className="mt-2 text-xs font-bold text-[#2e7d32]" role="status">{recordingStatus}</p> : null}
      {recordingError ? <p className="mt-2 text-xs font-bold text-[#c62828]" role="alert">{recordingError}</p> : null}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-bold text-slate-500">{draft.length}/320 ký tự</span><span className="flex gap-2"><button type="button" onClick={save} disabled={(!draft.trim() && !draftAudioUrl) || recording} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-45">{editingId ? <><Save className="mr-1 inline h-3.5 w-3.5" />Lưu sửa</> : <><Plus className="mr-1 inline h-3.5 w-3.5" />Lưu lời chúc hoặc bản thu</>}</button>{editingId ? <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-950 dark:text-slate-200"><X className="mr-1 inline h-3.5 w-3.5" />Hủy</button> : null}</span></div>
    </div>
    <div className="mt-4 space-y-2">{messages.length ? <><p className="text-xs font-bold text-slate-500">Lời đang chọn {messages.length > 1 ? `· còn ${messages.length - 1} lời trong thư viện` : ""}</p>{visibleMessages.map((item) => <article key={item.id} className="rounded-2xl border border-[#2e7d32]/15 bg-[#f5fff5] p-3 dark:bg-white/5"><p className="text-sm font-bold leading-6 text-[#35523a] dark:text-slate-100">“{item.text}”</p><div className="mt-3 flex flex-wrap items-center gap-2"><small className="mr-auto text-[11px] font-bold text-slate-500">Cập nhật {new Date(item.updatedAt).toLocaleDateString("vi-VN")}</small>{item.audioUrl ? <audio controls src={item.audioUrl} onError={() => setRecordingError("Không thể phát bản thu đã lưu. Hãy ghi lại một bản mới.")} className="h-8 max-w-full" aria-label="Phát bản ghi của lời thoại" /> : <span className="text-[11px] font-bold text-slate-500"><AudioLines className="mr-1 inline h-3.5 w-3.5" />Chưa có bản ghi</span>}<button type="button" onClick={() => beginEdit(item)} className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#2e7d32] shadow-sm dark:bg-slate-950"><Pencil className="mr-1 inline h-3.5 w-3.5" />Sửa</button><button type="button" onClick={() => remove(item.id)} className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#c62828] shadow-sm dark:bg-slate-950"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Xóa</button></div></article>)}{messages.length > 1 ? <button type="button" onClick={() => setShowAllMessages((value) => !value)} className="rounded-xl border border-[#2e7d32]/25 bg-white px-3 py-2 text-xs font-black text-[#2e7d32] dark:bg-slate-950">{showAllMessages ? "Thu gọn thư viện lời chúc" : `Mở ${messages.length - 1} lời còn lại`}</button> : null}</> : <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-500 dark:bg-white/5">Chưa có lời thoại cá nhân cho cảm xúc này.</p>}</div>
    </div>
  </PersistentCollapsible>;
}
