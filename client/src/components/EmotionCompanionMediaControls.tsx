import { Eye, EyeOff, ImagePlus, Mic, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { EmotionThemeId, ProfileState } from "../../../shared/study";
import { emotionThemes } from "../lib/emotionThemes";
import { trpc } from "../lib/trpc";
import { OngLearnerAvatar } from "./OngLearnerAvatar";

type MediaKind = "mascot-image" | "lumi-image" | "lumi-voice";
type Props = { profile: ProfileState; emotion: EmotionThemeId; onProfile: (profile: ProfileState, message?: string) => void };

function getToken() { try { return JSON.parse(sessionStorage.getItem("study_historia_session_v1") || "{}").token as string || ""; } catch { return ""; } }
function toDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error("Không thể đọc tệp.")); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }); }

export function EmotionCompanionMediaControls({ profile, emotion, onProfile }: Props) {
  const upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  const [busy, setBusy] = useState<MediaKind | null>(null);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const media = profile.companionEmotionMedia?.[emotion] ?? {};
  const emotionLabel = emotionThemes.find((item) => item.id === emotion)?.label ?? emotion;
  const update = (patch: Partial<typeof media>, message?: string) => onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [emotion]: { ...media, ...patch } } }, message);
  const remove = (key: keyof typeof media) => { const next = { ...media }; delete next[key]; onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [emotion]: next } }, "Đã gỡ media của cảm xúc này."); };

  async function uploadFile(file: File, kind: MediaKind) {
    const token = getToken();
    if (!token) { alert("Phiên đăng nhập đã hết. Hãy đăng nhập lại trước khi tải tệp."); return; }
    const isAudio = kind === "lumi-voice";
    const allowed = isAudio ? ["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg"] : ["image/png", "image/jpeg", "image/webp", "image/gif"];
    const limit = isAudio ? 8 * 1024 * 1024 : 3 * 1024 * 1024;
    if (!allowed.includes(file.type) || file.size > limit) { alert(isAudio ? "Chỉ nhận WebM, OGG, WAV hoặc MP3, tối đa 8 MB." : "Chỉ nhận PNG, JPG, WEBP hoặc GIF, tối đa 3 MB."); return; }
    setBusy(kind);
    try {
      const result = await upload.mutateAsync({ token, fileName: file.name, contentType: file.type as "image/png", dataUrl: await toDataUrl(file), mediaType: kind });
      update(kind === "mascot-image" ? { mascotImageUrl: result.url } : kind === "lumi-image" ? { lumiImageUrl: result.url } : { lumiVoiceUrl: result.url }, `Đã lưu ${kind === "lumi-voice" ? "bản thu Lumi" : "ảnh"} cho cảm xúc “${emotionLabel}”.`);
    } catch (error) { alert(error instanceof Error ? error.message : "Không thể tải tệp. Hãy thử lại."); }
    finally { setBusy(null); }
  }

  async function toggleRecord() {
    if (recording) { recorderRef.current?.stop(); setRecording(false); return; }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { alert("Trình duyệt này chưa hỗ trợ ghi âm. Bạn vẫn có thể tải tệp âm thanh lên."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : undefined });
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => { stream.getTracks().forEach((track) => track.stop()); const file = new File([new Blob(chunks, { type: recorder.mimeType || "audio/webm" })], `lumi-${emotion}-${Date.now()}.webm`, { type: recorder.mimeType || "audio/webm" }); void uploadFile(file, "lumi-voice"); };
      recorderRef.current = recorder; recorder.start(); setRecording(true);
    } catch { alert("Không thể dùng micro. Hãy cho phép quyền micro hoặc tải bản thu có sẵn."); }
  }

  const ImageInput = ({ kind, label }: { kind: "mascot-image" | "lumi-image"; label: string }) => <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs font-bold text-[#2e7d32] hover:bg-[#eff9ef]"><ImagePlus className="h-4 w-4" />{busy === kind ? "Đang tải…" : label}<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, kind); event.currentTarget.value = ""; }} /></label>;
  return <section className="relative z-10 mt-4 rounded-2xl border border-[#2e7d32]/20 bg-white/85 p-4 shadow-sm" aria-label="Ảnh và giọng Lumi theo cảm xúc">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#2e7d32]">Đồng hành theo cảm xúc</p><h3 className="mt-1 font-display text-lg font-black text-[#7f1d1d]">Mascot & Lumi · {emotionLabel}</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-[#35523a]">Ảnh và bản thu này thuộc riêng hồ sơ của Ong, chỉ dùng khi đang chọn cảm xúc hiện tại.</p></div><div className="flex gap-2"><button type="button" onClick={() => onProfile({ ...profile, showMascot: profile.showMascot === false })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{profile.showMascot === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{profile.showMascot === false ? "Hiện Mascot" : "Ẩn Mascot"}</button><button type="button" onClick={() => onProfile({ ...profile, showLumi: profile.showLumi === false })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{profile.showLumi === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{profile.showLumi === false ? "Hiện Lumi" : "Ẩn Lumi"}</button></div></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3"><p className="text-xs font-black text-amber-800">Mascot của Ong</p>{profile.showMascot === false ? <p className="mt-3 text-xs text-amber-800">Đang ẩn theo lựa chọn.</p> : <OngLearnerAvatar className="mt-3" size="sm" imageUrl={media.mascotImageUrl} /> }<div className="mt-3 flex flex-wrap gap-2"><ImageInput kind="mascot-image" label="Tải ảnh" />{media.mascotImageUrl ? <button type="button" onClick={() => remove("mascotImageUrl")} className="rounded-xl border border-red-200 p-2 text-red-700" aria-label="Gỡ ảnh Mascot"><Trash2 className="h-4 w-4" /></button> : null}</div></div><div className="rounded-xl border border-red-200 bg-red-50/60 p-3"><p className="text-xs font-black text-[#8e1b1b]">Lumi</p>{profile.showLumi === false ? <p className="mt-3 text-xs text-[#8e1b1b]">Đang ẩn theo lựa chọn.</p> : <img src={media.lumiImageUrl || "/manus-storage/lumi-mascot-clean_28a6da68.png"} alt={`Lumi khi ${emotionLabel}`} className="mt-3 h-14 w-12 rounded-xl object-cover object-top" /> }<div className="mt-3 flex flex-wrap gap-2"><ImageInput kind="lumi-image" label="Tải ảnh" />{media.lumiImageUrl ? <button type="button" onClick={() => remove("lumiImageUrl")} className="rounded-xl border border-red-200 p-2 text-red-700" aria-label="Gỡ ảnh Lumi"><Trash2 className="h-4 w-4" /></button> : null}</div></div><div className="rounded-xl border border-violet-200 bg-violet-50/70 p-3"><p className="text-xs font-black text-violet-800">Giọng Lumi cá nhân</p><p className="mt-2 text-xs leading-5 text-violet-800">Ghi trực tiếp hoặc tải bản thu để phát trước bản thu quản trị.</p><div className="mt-3 flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-800"><Upload className="h-4 w-4" />{busy === "lumi-voice" ? "Đang tải…" : "Tải bản thu"}<input className="sr-only" type="file" accept="audio/webm,audio/ogg,audio/wav,audio/mpeg" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, "lumi-voice"); event.currentTarget.value = ""; }} /></label><button type="button" onClick={() => void toggleRecord()} disabled={Boolean(busy)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white ${recording ? "bg-red-600" : "bg-violet-700"}`}><Mic className="h-4 w-4" />{recording ? "Dừng ghi" : "Ghi âm"}</button>{media.lumiVoiceUrl ? <button type="button" onClick={() => remove("lumiVoiceUrl")} className="rounded-xl border border-red-200 bg-white p-2 text-red-700" aria-label="Gỡ bản thu Lumi"><Trash2 className="h-4 w-4" /></button> : null}</div></div></div>
  </section>;
}
