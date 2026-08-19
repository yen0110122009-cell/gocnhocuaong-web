import { Copy, Eye, EyeOff, GripVertical, ImagePlus, Mic, Play, Search, Star, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { CompanionEmotionMedia, EmotionThemeId, LumiVoiceRecording, ProfileState } from "../../../shared/study";
import { CLASSIC_LUMI_IMAGE, getDefaultLumiImage } from "../lib/defaultCompanionMedia";
import { emotionThemes } from "../lib/emotionThemes";
import { trpc } from "../lib/trpc";
import { OngLearnerAvatar } from "./OngLearnerAvatar";

type MediaKind = "mascot-image" | "lumi-image" | "lumi-voice";
type LibraryItem = LumiVoiceRecording & { emotion: EmotionThemeId; emotionLabel: string; linkedImage: string };
type Props = { profile: ProfileState; emotion: EmotionThemeId; onProfile: (profile: ProfileState, message?: string) => void };

function getToken() { try { return JSON.parse(sessionStorage.getItem("study_historia_session_v1") || "{}").token as string || ""; } catch { return ""; } }
function toDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error("Không thể đọc tệp.")); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }); }

function recordingsFromMedia(media: CompanionEmotionMedia | undefined, targetEmotion: EmotionThemeId): LumiVoiceRecording[] {
  if (media?.lumiVoiceRecordings?.length) return media.lumiVoiceRecordings;
  return media?.lumiVoiceUrl ? [{ id: `legacy-${targetEmotion}`, url: media.lumiVoiceUrl, label: "Bản thu Lumi đã lưu", createdAt: new Date(0).toISOString(), imageUrl: media.lumiImageUrl }] : [];
}

export function EmotionCompanionMediaControls({ profile, emotion, onProfile }: Props) {
  const upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  const [busy, setBusy] = useState<MediaKind | null>(null);
  const [recording, setRecording] = useState(false);
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState<EmotionThemeId | "all">(emotion);
  const [imageFilter, setImageFilter] = useState("all");
  const [dragging, setDragging] = useState<{ id: string; emotion: EmotionThemeId } | null>(null);
  const [collectionMessage, setCollectionMessage] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const media = profile.companionEmotionMedia?.[emotion] ?? {};
  const voiceRecordings = recordingsFromMedia(media, emotion);
  const favoriteVoice = voiceRecordings.find((item) => item.id === media.favoriteLumiVoiceId) ?? voiceRecordings[0];
  const emotionLabel = emotionThemes.find((item) => item.id === emotion)?.label ?? emotion;

  const libraryItems = useMemo<LibraryItem[]>(() => emotionThemes.flatMap((theme) => {
    const themeMedia = profile.companionEmotionMedia?.[theme.id];
    return recordingsFromMedia(themeMedia, theme.id).map((item) => ({
      ...item,
      emotion: theme.id,
      emotionLabel: theme.label,
      linkedImage: item.imageUrl || themeMedia?.lumiImageUrl || getDefaultLumiImage(theme.id),
    }));
  }), [profile.companionEmotionMedia]);

  const imageOptions = useMemo(() => Array.from(new Map(libraryItems.map((item) => [item.linkedImage, item])).values()), [libraryItems]);
  const visibleItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("vi-VN");
    return libraryItems.filter((item) => {
      const matchesEmotion = emotionFilter === "all" || item.emotion === emotionFilter;
      const matchesImage = imageFilter === "all" || item.linkedImage === imageFilter;
      const haystack = `${item.label} ${item.emotionLabel} ${item.linkedImage}`.toLocaleLowerCase("vi-VN");
      return matchesEmotion && matchesImage && (!normalizedSearch || haystack.includes(normalizedSearch));
    });
  }, [emotionFilter, imageFilter, libraryItems, search]);

  const update = (patch: Partial<typeof media>, message?: string) => onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [emotion]: { ...media, ...patch } } }, message);
  const remove = (key: keyof typeof media) => { const next = { ...media }; delete next[key]; onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [emotion]: next } }, "Đã gỡ media của cảm xúc này."); };
  const updateVoiceRecordingsForEmotion = (targetEmotion: EmotionThemeId, nextRecordings: LumiVoiceRecording[], favoriteLumiVoiceId?: string, message?: string) => {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    const next = { ...targetMedia, lumiVoiceRecordings: nextRecordings, favoriteLumiVoiceId };
    delete next.lumiVoiceUrl;
    onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [targetEmotion]: next } }, message);
  };
  const updateVoiceRecordings = (nextRecordings: LumiVoiceRecording[], favoriteLumiVoiceId?: string, message?: string) => updateVoiceRecordingsForEmotion(emotion, nextRecordings, favoriteLumiVoiceId, message);
  const updateRecordingImage = (recordingId: string, imageUrl: string, targetEmotion = emotion, message = "Đã đổi ảnh đại diện cho bản thu Lumi.") => {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    const targetRecordings = recordingsFromMedia(targetMedia, targetEmotion);
    updateVoiceRecordingsForEmotion(targetEmotion, targetRecordings.map((voice) => voice.id === recordingId ? { ...voice, imageUrl } : voice), targetMedia.favoriteLumiVoiceId, message);
  };

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
      if (kind === "lumi-voice") {
        const id = crypto.randomUUID();
        const item: LumiVoiceRecording = { id, url: result.url, label: file.name.replace(/\.[^/.]+$/, "").slice(0, 80) || "Bản thu Lumi", createdAt: new Date().toISOString(), imageUrl: media.lumiImageUrl || CLASSIC_LUMI_IMAGE };
        updateVoiceRecordings([...voiceRecordings, item], media.favoriteLumiVoiceId ?? id, `Đã thêm bản thu Lumi cho cảm xúc “${emotionLabel}”.`);
      } else update(kind === "mascot-image" ? { mascotImageUrl: result.url } : { lumiImageUrl: result.url }, `Đã lưu ảnh cho cảm xúc “${emotionLabel}”.`);
    } catch (error) { alert(error instanceof Error ? error.message : "Không thể tải tệp. Hãy thử lại."); }
    finally { setBusy(null); }
  }

  async function uploadRecordingImage(file: File, recordingId: string, targetEmotion = emotion) {
    const token = getToken();
    if (!token) { alert("Phiên đăng nhập đã hết. Hãy đăng nhập lại trước khi tải ảnh."); return; }
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowed.includes(file.type) || file.size > 3 * 1024 * 1024) { alert("Chỉ nhận PNG, JPG, WEBP hoặc GIF, tối đa 3 MB."); return; }
    setBusy("lumi-image");
    try {
      const result = await upload.mutateAsync({ token, fileName: file.name, contentType: file.type as "image/png", dataUrl: await toDataUrl(file), mediaType: "lumi-image" });
      updateRecordingImage(recordingId, result.url, targetEmotion, "Đã đổi ảnh đi kèm bản thu Lumi.");
    } catch (error) { alert(error instanceof Error ? error.message : "Không thể tải ảnh. Hãy thử lại."); }
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

  function removeVoice(recordingId: string, targetEmotion = emotion) {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    const nextRecordings = recordingsFromMedia(targetMedia, targetEmotion).filter((item) => item.id !== recordingId);
    const nextFavorite = targetMedia.favoriteLumiVoiceId === recordingId ? nextRecordings[0]?.id : targetMedia.favoriteLumiVoiceId;
    updateVoiceRecordingsForEmotion(targetEmotion, nextRecordings, nextFavorite, "Đã gỡ bản thu Lumi đã chọn.");
  }

  function renameVoice(recordingId: string, label: string, targetEmotion: EmotionThemeId) {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    updateVoiceRecordingsForEmotion(targetEmotion, recordingsFromMedia(targetMedia, targetEmotion).map((voice) => voice.id === recordingId ? { ...voice, label } : voice), targetMedia.favoriteLumiVoiceId);
  }

  function selectFavorite(recordingId: string, targetEmotion: EmotionThemeId, label: string) {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    updateVoiceRecordingsForEmotion(targetEmotion, recordingsFromMedia(targetMedia, targetEmotion), recordingId, `Đã chọn “${label}” làm bản thu ưu tiên.`);
  }

  function duplicateVoice(item: LibraryItem) {
    const targetMedia = profile.companionEmotionMedia?.[item.emotion] ?? {};
    const clone: LumiVoiceRecording = { ...item, id: crypto.randomUUID(), label: `${item.label} · bản sao`.slice(0, 80), createdAt: new Date().toISOString() };
    updateVoiceRecordingsForEmotion(item.emotion, [...recordingsFromMedia(targetMedia, item.emotion), clone], targetMedia.favoriteLumiVoiceId, `Đã nhân bản “${item.label}”. Bạn có thể đổi tên, ảnh hoặc đặt lại bản ưu tiên.`);
  }

  function reorderWithinEmotion(target: LibraryItem) {
    if (!dragging) return;
    if (dragging.emotion !== target.emotion) { setCollectionMessage("Chỉ có thể kéo thẻ để sắp xếp trong cùng một cảm xúc."); return; }
    if (dragging.id === target.id) return;
    const targetMedia = profile.companionEmotionMedia?.[target.emotion] ?? {};
    const next = [...recordingsFromMedia(targetMedia, target.emotion)];
    const from = next.findIndex((item) => item.id === dragging.id);
    const to = next.findIndex((item) => item.id === target.id);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateVoiceRecordingsForEmotion(target.emotion, next, targetMedia.favoriteLumiVoiceId, "Đã lưu thứ tự bản thu cho cảm xúc này.");
  }

  function preview(item: LibraryItem) {
    const audio = new Audio(item.url);
    audio.volume = (profile.audioMixer?.lumi ?? 75) / 100;
    void audio.play().catch(() => setCollectionMessage("Không thể phát bản thu này. Hãy kiểm tra quyền âm thanh hoặc thử lại."));
  }

  const ImageInput = ({ kind, label }: { kind: "mascot-image" | "lumi-image"; label: string }) => <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs font-bold text-[#2e7d32] hover:bg-[#eff9ef]"><ImagePlus className="h-4 w-4" />{busy === kind ? "Đang tải…" : label}<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, kind); event.currentTarget.value = ""; }} /></label>;
  const VoiceInput = () => <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-800"><Upload className="h-4 w-4" />{busy === "lumi-voice" ? "Đang tải…" : "Tải bản thu"}<input className="sr-only" type="file" accept="audio/webm,audio/ogg,audio/wav,audio/mpeg" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, "lumi-voice"); event.currentTarget.value = ""; }} /></label>;

  return <section className="relative z-10 mt-4 rounded-2xl border border-[#2e7d32]/20 bg-white/85 p-4 shadow-sm" aria-label="Ảnh và giọng Lumi theo cảm xúc">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#2e7d32]">Đồng hành theo cảm xúc</p><h3 className="mt-1 font-display text-lg font-black text-[#7f1d1d]">Mascot & Lumi · {emotionLabel}</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-[#35523a]">Ảnh và bản thu này thuộc riêng hồ sơ của Ong, chỉ dùng khi đang chọn cảm xúc hiện tại.</p></div><div className="flex gap-2"><button type="button" onClick={() => onProfile({ ...profile, showMascot: profile.showMascot === false })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{profile.showMascot === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{profile.showMascot === false ? "Hiện Mascot" : "Ẩn Mascot"}</button><button type="button" onClick={() => onProfile({ ...profile, showLumi: profile.showLumi === false })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{profile.showLumi === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{profile.showLumi === false ? "Hiện Lumi" : "Ẩn Lumi"}</button></div></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3"><p className="text-xs font-black text-amber-800">Mascot của Ong</p>{profile.showMascot === false ? <p className="mt-3 text-xs text-amber-800">Đang ẩn theo lựa chọn.</p> : <OngLearnerAvatar className="mt-3" size="sm" imageUrl={media.mascotImageUrl} emotion={emotion} /> }<p className="mt-2 text-[11px] leading-4 text-amber-800">Chưa tải ảnh riêng sẽ dùng ảnh mặc định phù hợp cảm xúc.</p><div className="mt-3 flex flex-wrap gap-2"><ImageInput kind="mascot-image" label="Tải ảnh" />{media.mascotImageUrl ? <button type="button" onClick={() => remove("mascotImageUrl")} className="rounded-xl border border-red-200 p-2 text-red-700" aria-label="Gỡ ảnh Mascot"><Trash2 className="h-4 w-4" /></button> : null}</div></div>
      <div className="rounded-xl border border-red-200 bg-red-50/60 p-3"><p className="text-xs font-black text-[#8e1b1b]">Lumi</p>{profile.showLumi === false ? <p className="mt-3 text-xs text-[#8e1b1b]">Đang ẩn theo lựa chọn.</p> : <img src={media.lumiImageUrl || getDefaultLumiImage(emotion)} alt={`Lumi khi ${emotionLabel}`} className="mt-3 h-14 w-12 rounded-xl object-cover object-top" /> }<p className="mt-2 text-[11px] leading-4 text-[#8e1b1b]">Ảnh mặc định sẽ hiện khi Ong chưa tải ảnh Lumi riêng.</p><div className="mt-3 flex flex-wrap gap-2"><ImageInput kind="lumi-image" label="Tải ảnh" />{media.lumiImageUrl ? <button type="button" onClick={() => remove("lumiImageUrl")} className="rounded-xl border border-red-200 p-2 text-red-700" aria-label="Gỡ ảnh Lumi"><Trash2 className="h-4 w-4" /></button> : null}</div></div>
      <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-3 sm:col-span-2"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-black text-violet-800">Thêm bản thu cho {emotionLabel}</p><p className="mt-1 text-xs leading-5 text-violet-800">Bản thu mới sẽ giữ ảnh Lumi đang chọn; sau đó Ong có thể đổi ảnh riêng ngay trong lưới.</p></div></div><div className="mt-3 flex flex-wrap gap-2"><VoiceInput /><button type="button" onClick={() => void toggleRecord()} disabled={Boolean(busy)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white ${recording ? "bg-red-600" : "bg-violet-700"}`}><Mic className="h-4 w-4" />{recording ? "Dừng ghi" : "Ghi âm"}</button></div></div>
    </div>

    <section className="mt-4 rounded-xl border border-violet-200 bg-violet-50/70 p-3" aria-label="Bộ sưu tập ảnh giọng Lumi">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black text-violet-800">Bộ sưu tập ảnh–giọng Lumi</p><p className="mt-1 text-xs leading-5 text-violet-800">Kéo thẻ để đổi thứ tự trong cùng cảm xúc. Mỗi cặp có ảnh, giọng, nút nghe thử và thao tác nhân bản riêng.</p></div><span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[10px] font-black text-violet-800">{libraryItems.length} bản thu</span></div>
      <div className="mt-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_180px_190px]"><label className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-violet-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên bản thu hoặc ảnh…" className="w-full rounded-xl border border-violet-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-violet-950" /></label><select value={emotionFilter} onChange={(event) => setEmotionFilter(event.target.value as EmotionThemeId | "all")} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-900" aria-label="Lọc bản thu theo cảm xúc"><option value="all">Tất cả cảm xúc</option>{emotionThemes.map((theme) => <option key={theme.id} value={theme.id}>{theme.label}</option>)}</select><select value={imageFilter} onChange={(event) => setImageFilter(event.target.value)} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-900" aria-label="Lọc bản thu theo ảnh đại diện"><option value="all">Tất cả ảnh đại diện</option>{imageOptions.map((item, index) => <option key={item.linkedImage} value={item.linkedImage}>Ảnh {index + 1} · {item.emotionLabel}</option>)}</select></div>
      {collectionMessage ? <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900" role="status">{collectionMessage}</p> : null}
      {visibleItems.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visibleItems.map((item) => {
        const itemMedia = profile.companionEmotionMedia?.[item.emotion] ?? {};
        const isFavorite = (recordingsFromMedia(itemMedia, item.emotion).find((voice) => voice.id === itemMedia.favoriteLumiVoiceId) ?? recordingsFromMedia(itemMedia, item.emotion)[0])?.id === item.id;
        const isDragging = dragging?.id === item.id && dragging.emotion === item.emotion;
        return <article key={`${item.emotion}-${item.id}`} draggable onDragStart={() => { setDragging({ id: item.id, emotion: item.emotion }); setCollectionMessage(""); }} onDragEnd={() => setDragging(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); reorderWithinEmotion(item); setDragging(null); }} className={`overflow-hidden rounded-xl border p-2 shadow-sm transition ${isDragging ? "scale-[0.98] border-violet-400 opacity-60" : isFavorite ? "border-amber-300 bg-amber-50" : "border-violet-100 bg-white/85"}`}><div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-violet-100"><img src={item.linkedImage} alt={`Ảnh Lumi gắn với ${item.label}`} className="h-full w-full object-cover object-top transition duration-200 group-hover:scale-[1.03]" /><button type="button" onClick={() => preview(item)} className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-violet-800/90 text-white shadow-lg transition hover:scale-105" aria-label={`Nghe thử ${item.label}`}><Play className="ml-0.5 h-5 w-5" fill="currentColor" /></button>{isFavorite ? <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-black text-amber-950"><Star className="h-3 w-3" fill="currentColor" />Bản thu ưu tiên</span> : null}<span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-violet-800"><GripVertical className="h-3 w-3" />{item.emotionLabel}</span></div><div className="mt-2"><input value={item.label} maxLength={80} aria-label="Tên bản thu Lumi" onChange={(event) => renameVoice(item.id, event.target.value, item.emotion)} className="w-full rounded-lg border border-violet-100 bg-white px-2 py-1.5 text-xs font-bold text-violet-950" /><p className="mt-1 text-[10px] font-medium text-violet-700">{new Date(item.createdAt).toLocaleDateString("vi-VN")} · {item.emotionLabel}</p></div><div className="mt-2 flex flex-wrap gap-1.5"><label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-violet-200 bg-white px-2 py-1.5 text-[10px] font-black text-violet-800 hover:bg-violet-50"><ImagePlus className="h-3.5 w-3.5" />{busy === "lumi-image" ? "Đang tải…" : "Đổi ảnh"}<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadRecordingImage(file, item.id, item.emotion); event.currentTarget.value = ""; }} /></label><button type="button" onClick={() => updateRecordingImage(item.id, CLASSIC_LUMI_IMAGE, item.emotion, "Đã dùng lại ảnh Lumi cũ cho bản thu này.")} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-black text-slate-700 hover:bg-slate-50">Ảnh Lumi cũ</button><button type="button" onClick={() => selectFavorite(item.id, item.emotion, item.label)} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-black ${isFavorite ? "bg-amber-400 text-amber-950" : "border border-amber-200 bg-white text-amber-700 hover:bg-amber-50"}`} aria-label={`Chọn ${item.label} làm yêu thích`}><Star className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />{isFavorite ? "Ưu tiên" : "Chọn"}</button><button type="button" onClick={() => duplicateVoice(item)} className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2 py-1.5 text-[10px] font-black text-sky-700 hover:bg-sky-50"><Copy className="h-3.5 w-3.5" />Nhân bản</button><button type="button" onClick={() => removeVoice(item.id, item.emotion)} className="rounded-lg border border-red-200 bg-white px-2 py-1.5 text-red-700 hover:bg-red-50" aria-label={`Xóa ${item.label}`}><Trash2 className="h-3.5 w-3.5" /></button></div></article>;
      })}</div> : <p className="mt-4 rounded-xl border border-dashed border-violet-200 bg-white/80 p-4 text-center text-xs font-semibold text-violet-800">Không tìm thấy bản thu phù hợp. Hãy đổi bộ lọc hoặc thêm một bản thu mới.</p>}
    </section>
  </section>;
}
