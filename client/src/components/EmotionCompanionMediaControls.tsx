import { Copy, Download, Eye, EyeOff, GripVertical, ImagePlus, Mic, Play, Search, Star, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CompanionEmotionMedia, EmotionThemeId, LumiVoiceRecording, LumiVoiceRecordingTrashEntry, ProfileState } from "../../../shared/study";
import { CLASSIC_LUMI_IMAGE, getDefaultLumiImage } from "../lib/defaultCompanionMedia";
import { emotionThemes } from "../lib/emotionThemes";
import { trpc } from "../lib/trpc";
import { OngLearnerAvatar } from "./OngLearnerAvatar";
import { PersistentCollapsible } from "./PersistentCollapsible";

type MediaKind = "mascot-image" | "lumi-image" | "lumi-voice";
type LibraryItem = LumiVoiceRecording & { emotion: EmotionThemeId; emotionLabel: string; linkedImage: string };
type Props = { profile: ProfileState; emotion: EmotionThemeId; onProfile: (profile: ProfileState, message?: string) => void };
type UndoEntry = { emotion: EmotionThemeId; recordings: LumiVoiceRecording[]; favoriteId?: string; description: string; trashedRecordingId?: string };
type ImportMode = "merge" | "replace";
type LibrarySort = "manual" | "created_desc" | "updated_desc";

const COLOR_LABELS = [
  { id: "red", label: "Đỏ", className: "bg-red-500" },
  { id: "orange", label: "Cam", className: "bg-orange-500" },
  { id: "yellow", label: "Vàng", className: "bg-yellow-400" },
  { id: "green", label: "Xanh lá", className: "bg-green-500" },
  { id: "blue", label: "Xanh dương", className: "bg-blue-500" },
  { id: "purple", label: "Tím", className: "bg-violet-500" },
  { id: "pink", label: "Hồng", className: "bg-pink-500" },
  { id: "gray", label: "Xám", className: "bg-slate-500" },
] as const;
const COLOR_LABEL_IDS = new Set<string>(COLOR_LABELS.map((color) => color.id));

function getToken() { try { return JSON.parse(sessionStorage.getItem("study_historia_session_v1") || "{}").token as string || ""; } catch { return ""; } }
function toDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error("Không thể đọc tệp.")); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }); }

function recordingsFromMedia(media: CompanionEmotionMedia | undefined, targetEmotion: EmotionThemeId): LumiVoiceRecording[] {
  if (media?.lumiVoiceRecordings?.length) return media.lumiVoiceRecordings;
  return media?.lumiVoiceUrl ? [{ id: `legacy-${targetEmotion}`, url: media.lumiVoiceUrl, label: "Bản thu Lumi đã lưu", createdAt: new Date(0).toISOString(), imageUrl: media.lumiImageUrl }] : [];
}

function validImportedRecording(value: unknown, index: number): LumiVoiceRecording | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<LumiVoiceRecording>;
  if (typeof candidate.id !== "string" || !candidate.id.trim() || typeof candidate.url !== "string" || !candidate.url.trim()) return null;
  return {
    id: candidate.id.trim(),
    url: candidate.url.trim(),
    label: typeof candidate.label === "string" && candidate.label.trim() ? candidate.label.trim().slice(0, 80) : `Bản thu Lumi ${index + 1}`,
    createdAt: typeof candidate.createdAt === "string" && candidate.createdAt ? candidate.createdAt : new Date(0).toISOString(),
    updatedAt: typeof candidate.updatedAt === "string" && candidate.updatedAt ? candidate.updatedAt : undefined,
    imageUrl: typeof candidate.imageUrl === "string" && candidate.imageUrl.trim() ? candidate.imageUrl.trim() : undefined,
    colorLabel: typeof candidate.colorLabel === "string" && COLOR_LABEL_IDS.has(candidate.colorLabel) ? candidate.colorLabel : undefined,
  };
}

export function EmotionCompanionMediaControls({ profile, emotion, onProfile }: Props) {
  const upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  const [busy, setBusy] = useState<MediaKind | null>(null);
  const [recording, setRecording] = useState(false);
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState<EmotionThemeId | "all">(emotion);
  const [imageFilter, setImageFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [librarySort, setLibrarySort] = useState<LibrarySort>("manual");
  const [selectedTrashKeys, setSelectedTrashKeys] = useState<string[]>([]);
  const [dragging, setDragging] = useState<{ id: string; emotion: EmotionThemeId } | null>(null);
  const [collectionMessage, setCollectionMessage] = useState("");
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [undoMessage, setUndoMessage] = useState("");
  const [importMode, setImportMode] = useState<ImportMode>("merge");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  const media = profile.companionEmotionMedia?.[emotion] ?? {};
  const voiceRecordings = recordingsFromMedia(media, emotion);
  const trashedRecordings = useMemo(() => emotionThemes.flatMap((theme) => (profile.lumiVoiceRecordingTrash?.[theme.id] ?? []).map((entry) => ({ ...entry, emotion: theme.id, emotionLabel: theme.label, linkedImage: entry.recording.imageUrl || profile.companionEmotionMedia?.[theme.id]?.lumiImageUrl || getDefaultLumiImage(theme.id) }))), [profile.companionEmotionMedia, profile.lumiVoiceRecordingTrash]);
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
    const filtered = libraryItems.filter((item) => {
      const matchesEmotion = emotionFilter === "all" || item.emotion === emotionFilter;
      const matchesImage = imageFilter === "all" || item.linkedImage === imageFilter;
      const matchesColor = colorFilter === "all" || (colorFilter === "none" ? !item.colorLabel : item.colorLabel === colorFilter);
      const haystack = `${item.label} ${item.emotionLabel} ${item.linkedImage}`.toLocaleLowerCase("vi-VN");
      return matchesEmotion && matchesImage && matchesColor && (!normalizedSearch || haystack.includes(normalizedSearch));
    });
    if (librarySort === "manual") return filtered;
    const timestamp = (item: LibraryItem) => Date.parse(librarySort === "created_desc" ? item.createdAt : item.updatedAt ?? item.createdAt) || 0;
    return [...filtered].sort((first, second) => timestamp(second) - timestamp(first));
  }, [colorFilter, emotionFilter, imageFilter, libraryItems, librarySort, search]);

  useEffect(() => () => { if (undoTimerRef.current !== null) window.clearTimeout(undoTimerRef.current); }, []);
  useEffect(() => { setUndoStack([]); setUndoMessage(""); }, [emotion]);

  const update = (patch: Partial<typeof media>, message?: string) => onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [emotion]: { ...media, ...patch } } }, message);
  const remove = (key: keyof typeof media) => { const next = { ...media }; delete next[key]; onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [emotion]: next } }, "Đã gỡ media của cảm xúc này."); };
  const updateVoiceRecordingsForEmotion = (targetEmotion: EmotionThemeId, nextRecordings: LumiVoiceRecording[], favoriteLumiVoiceId?: string, message?: string) => {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    const next = { ...targetMedia, lumiVoiceRecordings: nextRecordings, favoriteLumiVoiceId };
    delete next.lumiVoiceUrl;
    onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [targetEmotion]: next } }, message);
  };
  const updateVoiceRecordings = (nextRecordings: LumiVoiceRecording[], favoriteLumiVoiceId?: string, message?: string) => updateVoiceRecordingsForEmotion(emotion, nextRecordings, favoriteLumiVoiceId, message);

  function offerUndo(targetEmotion: EmotionThemeId, recordings: LumiVoiceRecording[], favoriteId: string | undefined, description: string, trashedRecordingId?: string) {
    setUndoStack((stack) => [...stack.slice(-4), { emotion: targetEmotion, recordings: recordings.map((item) => ({ ...item })), favoriteId, description, trashedRecordingId }]);
    setUndoMessage(description);
    if (undoTimerRef.current !== null) window.clearTimeout(undoTimerRef.current);
    undoTimerRef.current = window.setTimeout(() => setUndoMessage(""), 5_000);
  }

  function undoLastAction() {
    const entry = undoStack[undoStack.length - 1];
    if (!entry) return;
    const remaining = undoStack.slice(0, -1);
    const targetMedia = profile.companionEmotionMedia?.[entry.emotion] ?? {};
    const nextMedia = { ...targetMedia, lumiVoiceRecordings: entry.recordings, favoriteLumiVoiceId: entry.favoriteId };
    delete nextMedia.lumiVoiceUrl;
    const nextTrash = entry.trashedRecordingId ? { ...(profile.lumiVoiceRecordingTrash ?? {}), [entry.emotion]: (profile.lumiVoiceRecordingTrash?.[entry.emotion] ?? []).filter((item) => item.recording.id !== entry.trashedRecordingId) } : profile.lumiVoiceRecordingTrash;
    onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [entry.emotion]: nextMedia }, lumiVoiceRecordingTrash: nextTrash }, `Đã hoàn tác: ${entry.description}`);
    setUndoStack(remaining);
    const previous = remaining[remaining.length - 1];
    setUndoMessage(previous?.description ?? "");
    if (undoTimerRef.current !== null) window.clearTimeout(undoTimerRef.current);
    if (previous) undoTimerRef.current = window.setTimeout(() => setUndoMessage(""), 5_000);
  }

  function updateRecordingImage(recordingId: string, imageUrl: string, targetEmotion = emotion, message = "Đã đổi ảnh đại diện cho bản thu Lumi.") {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    const targetRecordings = recordingsFromMedia(targetMedia, targetEmotion);
    updateVoiceRecordingsForEmotion(targetEmotion, targetRecordings.map((voice) => voice.id === recordingId ? { ...voice, imageUrl, updatedAt: new Date().toISOString() } : voice), targetMedia.favoriteLumiVoiceId, message);
  }

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
        const createdAt = new Date().toISOString();
        const item: LumiVoiceRecording = { id, url: result.url, label: file.name.replace(/\.[^/.]+$/, "").slice(0, 80) || "Bản thu Lumi", createdAt, updatedAt: createdAt, imageUrl: media.lumiImageUrl || CLASSIC_LUMI_IMAGE };
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
    const previousRecordings = recordingsFromMedia(targetMedia, targetEmotion);
    const removed = previousRecordings.find((item) => item.id === recordingId);
    if (!removed) return;
    const nextRecordings = previousRecordings.filter((item) => item.id !== recordingId);
    const nextFavorite = targetMedia.favoriteLumiVoiceId === recordingId ? nextRecordings[0]?.id : targetMedia.favoriteLumiVoiceId;
    const nextMedia = { ...targetMedia, lumiVoiceRecordings: nextRecordings, favoriteLumiVoiceId: nextFavorite };
    delete nextMedia.lumiVoiceUrl;
    const trashEntry: LumiVoiceRecordingTrashEntry = { recording: { ...removed }, deletedAt: new Date().toISOString(), originalIndex: previousRecordings.findIndex((item) => item.id === recordingId), previousFavoriteId: targetMedia.favoriteLumiVoiceId };
    const nextTrash = { ...(profile.lumiVoiceRecordingTrash ?? {}), [targetEmotion]: [trashEntry, ...(profile.lumiVoiceRecordingTrash?.[targetEmotion] ?? [])].slice(0, 200) };
    offerUndo(targetEmotion, previousRecordings, targetMedia.favoriteLumiVoiceId, "Đã chuyển một bản thu Lumi vào thùng rác.", recordingId);
    onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [targetEmotion]: nextMedia }, lumiVoiceRecordingTrash: nextTrash }, "Đã chuyển bản thu Lumi đã chọn vào thùng rác.");
  }

  function restoreTrashedVoice(targetEmotion: EmotionThemeId, recordingId: string) {
    const trash = profile.lumiVoiceRecordingTrash?.[targetEmotion] ?? [];
    const entry = trash.find((item) => item.recording.id === recordingId);
    if (!entry) return;
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    const existing = recordingsFromMedia(targetMedia, targetEmotion);
    if (existing.some((item) => item.id === recordingId)) {
      onProfile({ ...profile, lumiVoiceRecordingTrash: { ...(profile.lumiVoiceRecordingTrash ?? {}), [targetEmotion]: trash.filter((item) => item.recording.id !== recordingId) } }, "Bản thu đã có trong thư viện; đã dọn mục trùng khỏi thùng rác.");
      return;
    }
    const next = [...existing];
    next.splice(Math.min(entry.originalIndex, next.length), 0, entry.recording);
    const favoriteId = targetMedia.favoriteLumiVoiceId ?? (entry.previousFavoriteId && next.some((item) => item.id === entry.previousFavoriteId) ? entry.previousFavoriteId : next[0]?.id);
    const nextMedia = { ...targetMedia, lumiVoiceRecordings: next, favoriteLumiVoiceId: favoriteId };
    delete nextMedia.lumiVoiceUrl;
    onProfile({ ...profile, companionEmotionMedia: { ...(profile.companionEmotionMedia ?? {}), [targetEmotion]: nextMedia }, lumiVoiceRecordingTrash: { ...(profile.lumiVoiceRecordingTrash ?? {}), [targetEmotion]: trash.filter((item) => item.recording.id !== recordingId) } }, `Đã khôi phục “${entry.recording.label}”.`);
  }

  function permanentlyDeleteTrashedVoice(targetEmotion: EmotionThemeId, recordingId: string) {
    const trash = profile.lumiVoiceRecordingTrash?.[targetEmotion] ?? [];
    const entry = trash.find((item) => item.recording.id === recordingId);
    if (!entry || !window.confirm(`Xóa vĩnh viễn “${entry.recording.label}”? Thao tác này không thể hoàn tác.`)) return;
    onProfile({ ...profile, lumiVoiceRecordingTrash: { ...(profile.lumiVoiceRecordingTrash ?? {}), [targetEmotion]: trash.filter((item) => item.recording.id !== recordingId) } }, "Đã xóa vĩnh viễn bản thu Lumi khỏi thùng rác.");
  }

  const trashKey = (targetEmotion: EmotionThemeId, recordingId: string) => `${targetEmotion}:${recordingId}`;
  function toggleTrashSelection(targetEmotion: EmotionThemeId, recordingId: string) {
    const key = trashKey(targetEmotion, recordingId);
    setSelectedTrashKeys((selected) => selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key]);
  }
  function restoreSelectedTrashedVoices() {
    const selected = trashedRecordings.filter((entry) => selectedTrashKeys.includes(trashKey(entry.emotion, entry.recording.id)));
    if (!selected.length) return;
    const nextMedia: Partial<Record<EmotionThemeId, CompanionEmotionMedia>> = { ...(profile.companionEmotionMedia ?? {}) };
    const nextTrash = { ...(profile.lumiVoiceRecordingTrash ?? {}) };
    let restored = 0;
    for (const entry of selected) {
      const targetMedia = nextMedia[entry.emotion] ?? {};
      const existing = recordingsFromMedia(targetMedia, entry.emotion);
      if (!existing.some((item) => item.id === entry.recording.id)) {
        const next = [...existing];
        next.splice(Math.min(entry.originalIndex, next.length), 0, entry.recording);
        const favoriteLumiVoiceId = targetMedia.favoriteLumiVoiceId ?? (entry.previousFavoriteId && next.some((item) => item.id === entry.previousFavoriteId) ? entry.previousFavoriteId : next[0]?.id);
        nextMedia[entry.emotion] = { ...targetMedia, lumiVoiceRecordings: next, favoriteLumiVoiceId };
        delete nextMedia[entry.emotion]!.lumiVoiceUrl;
        restored += 1;
      }
      nextTrash[entry.emotion] = (nextTrash[entry.emotion] ?? []).filter((item) => item.recording.id !== entry.recording.id);
    }
    onProfile({ ...profile, companionEmotionMedia: nextMedia, lumiVoiceRecordingTrash: nextTrash }, restored ? `Đã khôi phục ${restored} bản thu đã chọn.` : "Các bản thu đã chọn đã có trong thư viện; đã dọn mục trùng khỏi thùng rác.");
    setSelectedTrashKeys([]);
  }
  function permanentlyDeleteSelectedTrashedVoices() {
    const selected = trashedRecordings.filter((entry) => selectedTrashKeys.includes(trashKey(entry.emotion, entry.recording.id)));
    if (!selected.length || !window.confirm(`Xóa vĩnh viễn ${selected.length} bản thu đã chọn? Thao tác này không thể hoàn tác.`)) return;
    const byEmotion = new Map<EmotionThemeId, Set<string>>();
    for (const entry of selected) {
      const ids = byEmotion.get(entry.emotion) ?? new Set<string>();
      ids.add(entry.recording.id);
      byEmotion.set(entry.emotion, ids);
    }
    const nextTrash: Partial<Record<EmotionThemeId, LumiVoiceRecordingTrashEntry[]>> = { ...(profile.lumiVoiceRecordingTrash ?? {}) };
    Array.from(byEmotion.entries()).forEach(([targetEmotion, ids]) => {
      nextTrash[targetEmotion] = (nextTrash[targetEmotion] ?? []).filter((item) => !ids.has(item.recording.id));
    });
    onProfile({ ...profile, lumiVoiceRecordingTrash: nextTrash }, `Đã xóa vĩnh viễn ${selected.length} bản thu Lumi đã chọn.`);
    setSelectedTrashKeys([]);
  }

  function renameVoice(recordingId: string, label: string, targetEmotion: EmotionThemeId) {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    updateVoiceRecordingsForEmotion(targetEmotion, recordingsFromMedia(targetMedia, targetEmotion).map((voice) => voice.id === recordingId ? { ...voice, label, updatedAt: new Date().toISOString() } : voice), targetMedia.favoriteLumiVoiceId);
  }

  function selectFavorite(recordingId: string, targetEmotion: EmotionThemeId, label: string) {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    updateVoiceRecordingsForEmotion(targetEmotion, recordingsFromMedia(targetMedia, targetEmotion), recordingId, `Đã chọn “${label}” làm bản thu ưu tiên.`);
  }

  function duplicateVoice(item: LibraryItem) {
    const targetMedia = profile.companionEmotionMedia?.[item.emotion] ?? {};
    const createdAt = new Date().toISOString();
    const clone: LumiVoiceRecording = { ...item, id: crypto.randomUUID(), label: `${item.label} · bản sao`.slice(0, 80), createdAt, updatedAt: createdAt };
    updateVoiceRecordingsForEmotion(item.emotion, [...recordingsFromMedia(targetMedia, item.emotion), clone], targetMedia.favoriteLumiVoiceId, `Đã nhân bản “${item.label}”. Bạn có thể đổi tên, ảnh hoặc đặt lại bản ưu tiên.`);
  }

  function setColorLabel(recordingId: string, targetEmotion: EmotionThemeId, colorLabel?: string) {
    const targetMedia = profile.companionEmotionMedia?.[targetEmotion] ?? {};
    updateVoiceRecordingsForEmotion(targetEmotion, recordingsFromMedia(targetMedia, targetEmotion).map((voice) => voice.id === recordingId ? { ...voice, colorLabel, updatedAt: new Date().toISOString() } : voice), targetMedia.favoriteLumiVoiceId, colorLabel ? "Đã gắn nhãn màu cho bản thu Lumi." : "Đã gỡ nhãn màu của bản thu Lumi.");
  }

  function reorderWithinEmotion(target: LibraryItem) {
    if (!dragging) return;
    if (dragging.emotion !== target.emotion) { setCollectionMessage("Chỉ có thể kéo thẻ để sắp xếp trong cùng một cảm xúc."); return; }
    if (dragging.id === target.id) return;
    const targetMedia = profile.companionEmotionMedia?.[target.emotion] ?? {};
    const previousRecordings = recordingsFromMedia(targetMedia, target.emotion);
    const next = [...previousRecordings];
    const from = next.findIndex((item) => item.id === dragging.id);
    const to = next.findIndex((item) => item.id === target.id);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    offerUndo(target.emotion, previousRecordings, targetMedia.favoriteLumiVoiceId, "Đã sắp xếp lại thứ tự bản thu.");
    updateVoiceRecordingsForEmotion(target.emotion, next, targetMedia.favoriteLumiVoiceId, "Đã lưu thứ tự bản thu cho cảm xúc này.");
  }

  function preview(item: LibraryItem) {
    const audio = new Audio(item.url);
    audio.volume = (profile.audioMixer?.lumi ?? 75) / 100;
    void audio.play().catch(() => setCollectionMessage("Không thể phát bản thu này. Hãy kiểm tra quyền âm thanh hoặc thử lại."));
  }

  function exportLibrary() {
    const companionEmotionMedia = Object.fromEntries(emotionThemes.flatMap((theme) => {
      const themeMedia = profile.companionEmotionMedia?.[theme.id];
      const recordings = recordingsFromMedia(themeMedia, theme.id);
      return recordings.length ? [[theme.id, { lumiVoiceRecordings: recordings, favoriteLumiVoiceId: themeMedia?.favoriteLumiVoiceId }]] : [];
    }));
    const lumiVoiceRecordingTrash = Object.fromEntries(emotionThemes.flatMap((theme) => {
      const entries = profile.lumiVoiceRecordingTrash?.[theme.id] ?? [];
      return entries.length ? [[theme.id, entries]] : [];
    }));
    const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), companionEmotionMedia, lumiVoiceRecordingTrash }, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `lumi-library-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 0);
    setCollectionMessage(`Đã xuất ${libraryItems.length} bản thu. Tệp chỉ lưu liên kết ảnh/âm thanh hiện có, không sao chép tệp media.`);
  }

  async function importLibrary(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const root = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
      const source = root?.companionEmotionMedia && typeof root.companionEmotionMedia === "object" && !Array.isArray(root.companionEmotionMedia) ? root.companionEmotionMedia as Record<string, unknown> : root;
      if (!source) throw new Error("Tệp sao lưu không có dữ liệu thư viện hợp lệ.");
      const knownEmotions = new Set<EmotionThemeId>(emotionThemes.map((theme) => theme.id));
      const nextMedia: Partial<Record<EmotionThemeId, CompanionEmotionMedia>> = { ...(profile.companionEmotionMedia ?? {}) };
      let imported = 0;
      let skipped = 0;
      let foundLibrary = false;
      for (const [rawEmotion, rawMedia] of Object.entries(source)) {
        if (!knownEmotions.has(rawEmotion as EmotionThemeId) || !rawMedia || typeof rawMedia !== "object" || Array.isArray(rawMedia)) { skipped += 1; continue; }
        const targetEmotion = rawEmotion as EmotionThemeId;
        const importedMedia = rawMedia as { lumiVoiceRecordings?: unknown; favoriteLumiVoiceId?: unknown };
        if (!Array.isArray(importedMedia.lumiVoiceRecordings)) { skipped += 1; continue; }
        foundLibrary = true;
        const seenImported = new Set<string>();
        const validRecords = importedMedia.lumiVoiceRecordings.flatMap((entry, index) => {
          const item = validImportedRecording(entry, index);
          if (!item || seenImported.has(item.id)) { skipped += 1; return []; }
          seenImported.add(item.id);
          return [item];
        });
        const existing = recordingsFromMedia(nextMedia[targetEmotion], targetEmotion);
        const existingIds = new Set(existing.map((item) => item.id));
        const uniqueImported = validRecords.filter((item) => {
          if (existingIds.has(item.id)) { skipped += 1; return false; }
          existingIds.add(item.id);
          return true;
        });
        const recordings = importMode === "replace" ? validRecords : [...existing, ...uniqueImported];
        const favoriteId = typeof importedMedia.favoriteLumiVoiceId === "string" && recordings.some((item) => item.id === importedMedia.favoriteLumiVoiceId)
          ? importedMedia.favoriteLumiVoiceId
          : nextMedia[targetEmotion]?.favoriteLumiVoiceId && recordings.some((item) => item.id === nextMedia[targetEmotion]?.favoriteLumiVoiceId)
            ? nextMedia[targetEmotion]?.favoriteLumiVoiceId
            : recordings[0]?.id;
        const updatedMedia = { ...(nextMedia[targetEmotion] ?? {}), lumiVoiceRecordings: recordings, favoriteLumiVoiceId: favoriteId };
        delete updatedMedia.lumiVoiceUrl;
        nextMedia[targetEmotion] = updatedMedia;
        imported += importMode === "replace" ? validRecords.length : uniqueImported.length;
      }
      if (!foundLibrary) throw new Error("Tệp sao lưu không chứa danh sách bản thu Lumi hợp lệ.");
      onProfile({ ...profile, companionEmotionMedia: nextMedia }, `Đã nhập ${imported} bản thu${skipped ? `; bỏ qua ${skipped} mục không hợp lệ hoặc bị trùng` : ""}.`);
      setCollectionMessage(`Đã nhập ${imported} bản thu${skipped ? `, bỏ qua ${skipped} mục` : ""}. Liên kết ảnh và âm thanh được giữ nguyên từ tệp sao lưu.`);
    } catch (error) {
      setCollectionMessage(error instanceof Error ? error.message : "Không thể đọc tệp sao lưu. Hãy chọn tệp JSON hợp lệ.");
    }
  }

  const ImageInput = ({ kind, label }: { kind: "mascot-image" | "lumi-image"; label: string }) => <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs font-bold text-[#2e7d32] hover:bg-[#eff9ef]"><ImagePlus className="h-4 w-4" />{busy === kind ? "Đang tải…" : label}<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, kind); event.currentTarget.value = ""; }} /></label>;
  const VoiceInput = () => <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-800"><Upload className="h-4 w-4" />{busy === "lumi-voice" ? "Đang tải…" : "Tải bản thu"}<input className="sr-only" type="file" accept="audio/webm,audio/ogg,audio/wav,audio/mpeg,audio/mp4,audio/x-m4a" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, "lumi-voice"); event.currentTarget.value = ""; }} /></label>;

  return <section className="relative z-10 mt-4 rounded-2xl border border-[#2e7d32]/20 bg-white/85 p-4 shadow-sm" aria-label="Ảnh và giọng Lumi theo cảm xúc">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#2e7d32]">Đồng hành theo cảm xúc</p><h3 className="mt-1 font-display text-lg font-black text-[#7f1d1d]">Mascot & Lumi · {emotionLabel}</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-[#35523a]">Ảnh và bản thu này thuộc riêng hồ sơ của Ong, chỉ dùng khi đang chọn cảm xúc hiện tại.</p></div><div className="flex gap-2"><button type="button" onClick={() => onProfile({ ...profile, showMascot: profile.showMascot === false })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{profile.showMascot === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{profile.showMascot === false ? "Hiện Mascot" : "Ẩn Mascot"}</button><button type="button" onClick={() => onProfile({ ...profile, showLumi: profile.showLumi === false })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{profile.showLumi === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{profile.showLumi === false ? "Hiện Lumi" : "Ẩn Lumi"}</button></div></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3"><p className="text-xs font-black text-amber-800">Mascot của Ong</p>{profile.showMascot === false ? <p className="mt-3 text-xs text-amber-800">Đang ẩn theo lựa chọn.</p> : <OngLearnerAvatar className="mt-3" size="sm" imageUrl={media.mascotImageUrl} emotion={emotion} />}<p className="mt-2 text-[11px] leading-4 text-amber-800">Chưa tải ảnh riêng sẽ dùng ảnh mặc định phù hợp cảm xúc.</p><div className="mt-3 flex flex-wrap gap-2"><ImageInput kind="mascot-image" label="Tải ảnh" />{media.mascotImageUrl ? <button type="button" onClick={() => remove("mascotImageUrl")} className="rounded-xl border border-red-200 p-2 text-red-700" aria-label="Gỡ ảnh Mascot"><Trash2 className="h-4 w-4" /></button> : null}</div></div>
      <div className="rounded-xl border border-red-200 bg-red-50/60 p-3"><p className="text-xs font-black text-[#8e1b1b]">Lumi</p>{profile.showLumi === false ? <p className="mt-3 text-xs text-[#8e1b1b]">Đang ẩn theo lựa chọn.</p> : <img src={media.lumiImageUrl || getDefaultLumiImage(emotion)} alt={`Lumi khi ${emotionLabel}`} className="mt-3 h-14 w-12 rounded-xl object-cover object-top" />}<p className="mt-2 text-[11px] leading-4 text-[#8e1b1b]">Ảnh mặc định sẽ hiện khi Ong chưa tải ảnh Lumi riêng.</p><div className="mt-3 flex flex-wrap gap-2"><ImageInput kind="lumi-image" label="Tải ảnh" />{media.lumiImageUrl ? <button type="button" onClick={() => remove("lumiImageUrl")} className="rounded-xl border border-red-200 p-2 text-red-700" aria-label="Gỡ ảnh Lumi"><Trash2 className="h-4 w-4" /></button> : null}</div></div>
      <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-3 sm:col-span-2"><p className="text-xs font-black text-violet-800">Thêm bản thu cho {emotionLabel}</p><p className="mt-1 text-xs leading-5 text-violet-800">Bản thu mới sẽ giữ ảnh Lumi đang chọn; sau đó Ong có thể đổi ảnh riêng ngay trong lưới.</p><div className="mt-3 flex flex-wrap gap-2"><VoiceInput /><button type="button" onClick={() => void toggleRecord()} disabled={Boolean(busy)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white ${recording ? "bg-red-600" : "bg-violet-700"}`}><Mic className="h-4 w-4" />{recording ? "Dừng ghi" : "Ghi âm"}</button></div></div>
    </div>

    <section className="mt-4 rounded-xl border border-violet-200 bg-violet-50/70 p-3" aria-label="Bộ sưu tập ảnh giọng Lumi">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black text-violet-800">Bộ sưu tập ảnh–giọng Lumi</p><p className="mt-1 text-xs leading-5 text-violet-800">Kéo thẻ để đổi thứ tự trong cùng cảm xúc. Mỗi cặp có ảnh, giọng, nhãn màu, nghe thử và thao tác nhân bản riêng.</p></div><span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[10px] font-black text-violet-800">{libraryItems.length} bản thu</span></div>
      <div className="mt-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_165px_165px_180px]"><label className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-violet-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên bản thu hoặc ảnh…" className="w-full rounded-xl border border-violet-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-violet-950" /></label><select value={emotionFilter} onChange={(event) => setEmotionFilter(event.target.value as EmotionThemeId | "all")} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-900" aria-label="Lọc bản thu theo cảm xúc"><option value="all">Tất cả cảm xúc</option>{emotionThemes.map((theme) => <option key={theme.id} value={theme.id}>{theme.label}</option>)}</select><select value={colorFilter} onChange={(event) => setColorFilter(event.target.value)} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-900" aria-label="Lọc nhanh bản thu theo nhãn màu"><option value="all">Tất cả nhãn màu</option><option value="none">Chưa gắn nhãn</option>{COLOR_LABELS.map((color) => <option key={color.id} value={color.id}>{color.label}</option>)}</select><select value={imageFilter} onChange={(event) => setImageFilter(event.target.value)} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-900" aria-label="Lọc bản thu theo ảnh đại diện"><option value="all">Tất cả ảnh đại diện</option>{imageOptions.map((item, index) => <option key={item.linkedImage} value={item.linkedImage}>Ảnh {index + 1} · {item.emotionLabel}</option>)}</select></div>
      <div className="mt-2 flex flex-wrap items-center gap-2"><label className="text-[11px] font-black text-violet-800" htmlFor="lumi-library-sort">Sắp xếp:</label><select id="lumi-library-sort" value={librarySort} onChange={(event) => setLibrarySort(event.target.value as LibrarySort)} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-900" aria-label="Sắp xếp thư viện bản thu Lumi"><option value="manual">Thứ tự thủ công</option><option value="created_desc">Mới tạo gần nhất</option><option value="updated_desc">Chỉnh sửa gần nhất</option></select>{librarySort !== "manual" ? <span className="text-[10px] font-bold text-violet-700">Đang xem theo thời gian; kéo thả vẫn chỉ áp dụng cho thứ tự thủ công.</span> : null}</div>
      {undoMessage ? <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900" role="status"><span>{undoMessage}</span><button type="button" onClick={undoLastAction} className="rounded-lg bg-emerald-700 px-2.5 py-1.5 text-[11px] font-black text-white hover:bg-emerald-800">Hoàn tác</button></div> : null}
      {collectionMessage ? <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900" role="status">{collectionMessage}</p> : null}
      {visibleItems.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visibleItems.map((item) => {
        const itemMedia = profile.companionEmotionMedia?.[item.emotion] ?? {};
        const isFavorite = (recordingsFromMedia(itemMedia, item.emotion).find((voice) => voice.id === itemMedia.favoriteLumiVoiceId) ?? recordingsFromMedia(itemMedia, item.emotion)[0])?.id === item.id;
        const isDragging = dragging?.id === item.id && dragging.emotion === item.emotion;
        const currentColor = COLOR_LABELS.find((color) => color.id === item.colorLabel);
        return <article key={`${item.emotion}-${item.id}`} draggable onDragStart={() => { setDragging({ id: item.id, emotion: item.emotion }); setCollectionMessage(""); }} onDragEnd={() => setDragging(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); reorderWithinEmotion(item); setDragging(null); }} className={`overflow-hidden rounded-xl border p-2 shadow-sm transition ${isDragging ? "scale-[0.98] border-violet-400 opacity-60" : isFavorite ? "border-amber-300 bg-amber-50" : "border-violet-100 bg-white/85"}`}><div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-violet-100"><img src={item.linkedImage} alt={`Ảnh Lumi gắn với ${item.label}`} className="h-full w-full object-cover object-top transition duration-200 group-hover:scale-[1.03]" /><button type="button" onClick={() => preview(item)} className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-violet-800/90 text-white shadow-lg transition hover:scale-105" aria-label={`Nghe thử ${item.label}`}><Play className="ml-0.5 h-5 w-5" fill="currentColor" /></button>{isFavorite ? <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-black text-amber-950"><Star className="h-3 w-3" fill="currentColor" />Bản thu ưu tiên</span> : null}<span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-violet-800"><GripVertical className="h-3 w-3" />{item.emotionLabel}</span>{currentColor ? <span className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white shadow ${currentColor.className}`} title={`Nhãn ${currentColor.label}`} aria-label={`Nhãn màu ${currentColor.label}`} /> : null}</div><div className="mt-2"><input value={item.label} maxLength={80} aria-label="Tên bản thu Lumi" onChange={(event) => renameVoice(item.id, event.target.value, item.emotion)} className="w-full rounded-lg border border-violet-100 bg-white px-2 py-1.5 text-xs font-bold text-violet-950" /><p className="mt-1 text-[10px] font-medium text-violet-700">{new Date(item.createdAt).toLocaleDateString("vi-VN")} · {item.emotionLabel}</p></div><div className="mt-2 flex flex-wrap gap-1.5"><label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-violet-200 bg-white px-2 py-1.5 text-[10px] font-black text-violet-800 hover:bg-violet-50"><ImagePlus className="h-3.5 w-3.5" />{busy === "lumi-image" ? "Đang tải…" : "Đổi ảnh"}<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={Boolean(busy)} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadRecordingImage(file, item.id, item.emotion); event.currentTarget.value = ""; }} /></label><button type="button" onClick={() => updateRecordingImage(item.id, CLASSIC_LUMI_IMAGE, item.emotion, "Đã dùng lại ảnh Lumi cũ cho bản thu này.")} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-black text-slate-700 hover:bg-slate-50">Ảnh Lumi cũ</button><button type="button" onClick={() => selectFavorite(item.id, item.emotion, item.label)} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-black ${isFavorite ? "bg-amber-400 text-amber-950" : "border border-amber-200 bg-white text-amber-700 hover:bg-amber-50"}`} aria-label={`Chọn ${item.label} làm yêu thích`}><Star className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />{isFavorite ? "Ưu tiên" : "Chọn"}</button><button type="button" onClick={() => duplicateVoice(item)} className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2 py-1.5 text-[10px] font-black text-sky-700 hover:bg-sky-50"><Copy className="h-3.5 w-3.5" />Nhân bản</button><button type="button" onClick={() => removeVoice(item.id, item.emotion)} className="rounded-lg border border-red-200 bg-white px-2 py-1.5 text-red-700 hover:bg-red-50" aria-label={`Xóa ${item.label}`}><Trash2 className="h-3.5 w-3.5" /></button></div><div className="mt-2 flex items-center gap-1.5 border-t border-violet-100 pt-2" aria-label={`Chọn nhãn màu cho ${item.label}`}><span className="mr-1 text-[10px] font-black text-violet-700">Nhãn:</span>{COLOR_LABELS.map((color) => <button key={color.id} type="button" onClick={() => setColorLabel(item.id, item.emotion, item.colorLabel === color.id ? undefined : color.id)} aria-label={`Nhãn ${color.label}`} aria-pressed={item.colorLabel === color.id} className={`h-5 w-5 rounded-full border-2 ${color.className} ${item.colorLabel === color.id ? "scale-110 border-violet-950 ring-2 ring-violet-200" : "border-white"}`} />)}</div></article>;
      })}</div> : <p className="mt-4 rounded-xl border border-dashed border-violet-200 bg-white/80 p-4 text-center text-xs font-semibold text-violet-800">Không tìm thấy bản thu phù hợp. Hãy đổi bộ lọc hoặc thêm một bản thu mới.</p>}
      <PersistentCollapsible storageKey="lumi-library-backup" title="Sao lưu & khôi phục thư viện Lumi" className="mt-4">
        <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3"><p className="text-xs leading-5 text-sky-900">Tệp sao lưu chỉ lưu thông tin bản thu và các liên kết ảnh/âm thanh đang có; không sao chép tệp media vào JSON. Khi nhập, hệ thống kiểm tra cấu trúc, bỏ qua mục không hợp lệ hoặc trùng lặp.</p><div className="mt-3 flex flex-wrap items-center gap-2"><button type="button" onClick={exportLibrary} className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-3 py-2 text-xs font-black text-white hover:bg-sky-800"><Download className="h-4 w-4" />Xuất tệp JSON</button><select value={importMode} onChange={(event) => setImportMode(event.target.value as ImportMode)} className="rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-900" aria-label="Cách nhập thư viện Lumi"><option value="merge">Gộp với thư viện hiện có</option><option value="replace">Thay thư viện theo cảm xúc</option></select><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-sky-300 bg-white px-3 py-2 text-xs font-black text-sky-800 hover:bg-sky-100"><Upload className="h-4 w-4" />Nhập tệp JSON<input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importLibrary(file); event.currentTarget.value = ""; }} /></label></div></div>
      </PersistentCollapsible>
      <PersistentCollapsible storageKey="lumi-recording-trash" eyebrow="Xóa mềm" title={`Thùng rác bản thu Lumi${trashedRecordings.length ? ` · ${trashedRecordings.length}` : ""}`} className="mt-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
          <p className="text-xs leading-5 text-rose-900">Bản thu bị xóa vẫn ở đây sau khi thời gian hoàn tác 5 giây kết thúc. Mục quá 30 ngày được tự dọn vĩnh viễn; Ong có thể khôi phục về đúng cảm xúc/vị trí hoặc xóa sớm hơn.</p>
          {trashedRecordings.length ? <>
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-rose-200 bg-white p-2">
              <label className="inline-flex items-center gap-2 text-xs font-black text-rose-900"><input type="checkbox" checked={selectedTrashKeys.length === trashedRecordings.length} onChange={(event) => setSelectedTrashKeys(event.target.checked ? trashedRecordings.map((entry) => trashKey(entry.emotion, entry.recording.id)) : [])} />Chọn tất cả</label>
              <span className="text-[11px] font-bold text-rose-700">Đã chọn {selectedTrashKeys.length}/{trashedRecordings.length}</span>
              <button type="button" disabled={!selectedTrashKeys.length} onClick={restoreSelectedTrashedVoices} className="rounded-lg bg-emerald-700 px-2.5 py-1.5 text-[10px] font-black text-white disabled:opacity-45">Khôi phục đã chọn</button>
              <button type="button" disabled={!selectedTrashKeys.length} onClick={permanentlyDeleteSelectedTrashedVoices} className="rounded-lg border border-rose-300 bg-white px-2.5 py-1.5 text-[10px] font-black text-rose-800 disabled:opacity-45">Xóa vĩnh viễn đã chọn</button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">{trashedRecordings.map((entry) => {
              const key = trashKey(entry.emotion, entry.recording.id);
              return <article key={`${entry.emotion}-${entry.recording.id}`} className="flex gap-3 rounded-xl border border-rose-100 bg-white p-2.5"><input type="checkbox" aria-label={`Chọn ${entry.recording.label}`} checked={selectedTrashKeys.includes(key)} onChange={() => toggleTrashSelection(entry.emotion, entry.recording.id)} className="mt-1 h-4 w-4 accent-rose-700" /><img src={entry.linkedImage} alt="Ảnh Lumi của bản thu đã xóa" className="h-12 w-12 rounded-lg object-cover object-top" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-rose-950">{entry.recording.label}</p><p className="mt-1 text-[10px] font-bold text-rose-700">{entry.emotionLabel} · xóa {new Date(entry.deletedAt).toLocaleString("vi-VN")}</p><div className="mt-2 flex flex-wrap gap-1.5"><button type="button" onClick={() => restoreTrashedVoice(entry.emotion, entry.recording.id)} className="rounded-lg bg-emerald-700 px-2 py-1.5 text-[10px] font-black text-white hover:bg-emerald-800">Khôi phục</button><button type="button" onClick={() => permanentlyDeleteTrashedVoice(entry.emotion, entry.recording.id)} className="rounded-lg border border-rose-200 bg-white px-2 py-1.5 text-[10px] font-black text-rose-800 hover:bg-rose-50">Xóa vĩnh viễn</button></div></div></article>;
            })}</div>
          </> : <p className="mt-3 rounded-lg bg-white p-3 text-xs font-bold text-rose-800">Thùng rác đang trống. Bản thu xóa sau này sẽ xuất hiện ở đây thay vì bị mất ngay.</p>}
        </div>
      </PersistentCollapsible>
    </section>
  </section>;
}
