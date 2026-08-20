import { ArchiveRestore, CalendarDays, Download, FileUp, History, Music2, Pause, PenLine, Play, Plus, Search, SlidersHorizontal, Sparkles, Star, Trash2, Upload } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { AmbientScenePreference, AudioActionLog, EmotionThemeId, PersonalAudioAsset, PersonalAudioCategory, PersonalStudyPreset, PersonalStudyPresetPomodoroRule, PersonalStudyPresetTimeRule, ProfileState } from "../../../shared/study";
import { trpc } from "../lib/trpc";
import { PersistentCollapsible } from "./PersistentCollapsible";

type Props = { profile: ProfileState; emotion: EmotionThemeId; onEmotion: (emotion: EmotionThemeId) => void; onProfile: (profile: ProfileState, message?: string) => void };
type AcceptedAudioMime = "audio/webm" | "audio/ogg" | "audio/wav" | "audio/mpeg" | "audio/mp4" | "audio/x-m4a";

const categories: Array<{ id: PersonalAudioCategory; label: string }> = [
  { id: "background", label: "Nhạc nền" }, { id: "emotion", label: "Theo cảm xúc" }, { id: "season", label: "Theo mùa" }, { id: "weather", label: "Theo thời tiết" }, { id: "pomodoro", label: "Theo Pomodoro" }, { id: "lumi", label: "Lời Lumi" }, { id: "ong", label: "Lời Ong" },
];
const scenes: Array<{ id: AmbientScenePreference; label: string }> = [{ id: "morning", label: "Buổi sáng" }, { id: "rain", label: "Mưa" }, { id: "snow", label: "Tuyết" }, { id: "leaves", label: "Lá rơi" }, { id: "storm", label: "Sấm chớp" }];
function getToken() { try { return JSON.parse(sessionStorage.getItem("study_historia_session_v1") || "{}").token as string || ""; } catch { return ""; } }
function readDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error("Không thể đọc tệp âm thanh.")); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }); }
function audioType(file: File): AcceptedAudioMime | "" { return ["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg", "audio/mp4", "audio/x-m4a"].includes(file.type) ? file.type as AcceptedAudioMime : ""; }
function isSafeExternalAudioUrl(value: string) { try { const parsed = new URL(value); return parsed.protocol === "https:" && !parsed.username && !parsed.password; } catch { return false; } }

export function PersonalStudySpaceControls({ profile, emotion, onEmotion, onProfile }: Props) {
  let upload: ReturnType<typeof trpc.study.profile.uploadCompanionMedia.useMutation>;
  try {
    upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  } catch {
    upload = { isPending: false, mutateAsync: async () => { throw new Error("Cần tRPC provider để tải tệp."); } } as unknown as typeof upload;
  }
  const inputRef = useRef<HTMLInputElement | null>(null);
  const backupInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<PersonalAudioCategory>("background");
  const [target, setTarget] = useState("general");
  const [presetName, setPresetName] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [previewing, setPreviewing] = useState<string | null>(null);
  const assets = profile.personalAudioAssets ?? [];
  const trashedAssets = profile.personalAudioTrash ?? [];
  const presets = profile.personalStudyPresets ?? [];
  const schedule = profile.personalStudyPresetSchedule ?? [];
  const presetHistory = profile.personalStudyPresetHistory ?? [];
  const timeRules = profile.personalStudyPresetTimeRules ?? [];
  const pomodoroRules = profile.personalStudyPresetPomodoroRules ?? [];
  const actionLogs = profile.audioActionLogs ?? [];
  const [historyFilter, setHistoryFilter] = useState<"all" | "preset" | "asset">("all");
  const [previewAt, setPreviewAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [previewMode, setPreviewMode] = useState<PersonalStudyPresetPomodoroRule["mode"] | "none">("none");
  const [previewResult, setPreviewResult] = useState<{ preset?: PersonalStudyPreset; source: string; detail: string } | null>(null);
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const enabledAssets = useMemo(() => assets.filter((asset) => asset.enabled), [assets]);
  const labels = useMemo(() => Array.from(new Set(assets.flatMap((asset) => asset.tags ?? []).map((tag) => tag.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "vi")), [assets]);
  const visibleAssets = useMemo(() => assets.filter((asset) => {
    const haystack = `${asset.name} ${asset.description ?? ""} ${asset.category} ${asset.target} ${(asset.tags ?? []).join(" ")}`.toLocaleLowerCase();
    const matchesSearch = !librarySearch.trim() || haystack.includes(librarySearch.trim().toLocaleLowerCase());
    const matchesLabel = selectedLabel === "all" || (selectedLabel === "none" ? !(asset.tags ?? []).length : (asset.tags ?? []).includes(selectedLabel));
    return matchesSearch && matchesLabel;
  }), [assets, librarySearch, selectedLabel]);

  function saveAssets(next: PersonalAudioAsset[], message?: string) { onProfile({ ...profile, personalAudioAssets: next }, message); }
  function saveAudioLibrary(nextAssets: PersonalAudioAsset[], nextTrash: PersonalAudioAsset[], message?: string) { onProfile({ ...profile, personalAudioAssets: nextAssets, personalAudioTrash: nextTrash }, message); }
  function savePresets(next: PersonalStudyPreset[], message?: string, log?: Omit<AudioActionLog, "id" | "occurredAt">) {
    const nextLogs = log ? [{ ...log, id: createId("audio-log"), occurredAt: new Date().toISOString() }, ...actionLogs].slice(0, 200) : actionLogs;
    onProfile({ ...profile, personalStudyPresets: next, audioActionLogs: nextLogs }, message);
  }
  function appendLog(log: Omit<AudioActionLog, "id" | "occurredAt">, message?: string, patch: Partial<ProfileState> = {}) {
    const nextLogs = [{ ...log, id: createId("audio-log"), occurredAt: new Date().toISOString() }, ...actionLogs].slice(0, 200);
    onProfile({ ...profile, ...patch, audioActionLogs: nextLogs }, message);
  }
  function createId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
  function applyAudioPreset(presetId: string, reason: "apply" | "autoApply" = "apply") {
    const preset = presets.find((item) => item.id === presetId);
    if (!preset) return;
    const updatedAssets = assets.map((asset) => ({ ...asset, enabled: preset.audioAssetIds.includes(asset.id) }));
    appendLog({ action: reason, entityType: "preset", entityId: preset.id, entityName: preset.name, summary: reason === "apply" ? `Đã áp dụng preset ${preset.name}.` : `Tự động áp dụng preset ${preset.name}.`, snapshot: preset, previousSnapshot: presets.find((item) => item.id === profile.activePersonalStudyPresetId) }, "Đã áp dụng preset âm thanh.", { personalAudioAssets: updatedAssets, activePersonalStudyPresetId: preset.id });
  }
  function timeIsInsideRule(now: Date, rule: PersonalStudyPresetTimeRule) {
    const current = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = rule.startTime.split(":").map(Number);
    const [endHour, endMinute] = rule.endTime.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    const validDay = !rule.daysOfWeek?.length || rule.daysOfWeek.includes(now.getDay());
    return validDay && (start <= end ? current >= start && current <= end : current >= start || current <= end);
  }
  function previewRules() {
    const selectedDate = new Date(previewAt);
    if (Number.isNaN(selectedDate.getTime())) {
      setPreviewResult({ source: "Lỗi dữ liệu", detail: "Hãy chọn một thời điểm hợp lệ." });
      return;
    }
    const pomodoroRule = previewMode === "none" ? undefined : pomodoroRules.filter((rule) => rule.enabled && rule.mode === previewMode).sort((a, b) => a.priority - b.priority || Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
    const timeRule = timeRules.filter((rule) => rule.enabled && timeIsInsideRule(selectedDate, rule)).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
    const weeklyRule = schedule.find((rule) => rule.enabled && rule.dayOfWeek === selectedDate.getDay());
    const winner = pomodoroRule ?? timeRule ?? weeklyRule;
    const preset = winner ? presets.find((item) => item.id === winner.presetId) : undefined;
    const source = pomodoroRule ? "Pomodoro" : timeRule ? "Khung giờ" : weeklyRule ? "Lịch theo tuần" : "Không có rule";
    const detail = preset ? `Tại ${selectedDate.toLocaleString("vi-VN")}${previewMode !== "none" ? ` với trạng thái ${previewMode === "focus" ? "Tập trung" : previewMode === "shortBreak" ? "Nghỉ ngắn" : "Nghỉ dài"}` : ""}, preset “${preset.name}” sẽ được kích hoạt theo ${source.toLocaleLowerCase()}.` : `Không có preset phù hợp tại ${selectedDate.toLocaleString("vi-VN")}.`;
    setPreviewResult({ preset, source, detail });
  }
  function exportPersonalSpace() {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      personalAudioAssets: assets,
      personalAudioTrash: trashedAssets,
      audioGroupPresets: profile.audioGroupPresets ?? [],
      personalStudyPresets: presets,
      personalStudyPresetSchedule: schedule,
      personalStudyPresetTimeRules: timeRules,
      personalStudyPresetPomodoroRules: pomodoroRules,
      personalStudyPresetHistory: presetHistory,
      audioActionLogs: actionLogs,
    };
    const link = document.createElement("a");     link.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })); link.download = `khong-gian-hoc-ca-nhan-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(link.href);

    onProfile(profile, "Đã xuất sao lưu Không gian học. Tệp chỉ lưu liên kết audio, không sao chép tệp âm thanh.");
  }
  function importPersonalSpace(file: File) {
    const reader = new FileReader();
    reader.onerror = () => onProfile(profile, "Không thể đọc tệp sao lưu.");
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { version?: unknown; personalAudioAssets?: unknown; personalAudioTrash?: unknown; audioGroupPresets?: unknown; personalStudyPresets?: unknown; personalStudyPresetSchedule?: unknown; personalStudyPresetTimeRules?: unknown; personalStudyPresetPomodoroRules?: unknown; personalStudyPresetHistory?: unknown; audioActionLogs?: unknown };
        if (parsed.version !== 1 && parsed.version !== 2) throw new Error();
        if (!Array.isArray(parsed.personalAudioAssets) || !Array.isArray(parsed.personalStudyPresets)) throw new Error();
        const importAssets = parsed.personalAudioAssets.filter((item): item is PersonalAudioAsset => Boolean(item && typeof item === "object" && typeof (item as PersonalAudioAsset).id === "string" && typeof (item as PersonalAudioAsset).url === "string" && typeof (item as PersonalAudioAsset).name === "string"));
        const importTrash = Array.isArray(parsed.personalAudioTrash) ? parsed.personalAudioTrash.filter((item): item is PersonalAudioAsset => Boolean(item && typeof item === "object" && typeof (item as PersonalAudioAsset).id === "string" && typeof (item as PersonalAudioAsset).url === "string")) : [];
        const importPresets = parsed.personalStudyPresets.filter((item): item is PersonalStudyPreset => Boolean(item && typeof item === "object" && typeof (item as PersonalStudyPreset).id === "string" && typeof (item as PersonalStudyPreset).name === "string"));
        const importGroups = Array.isArray(parsed.audioGroupPresets) ? parsed.audioGroupPresets.filter((item): item is NonNullable<ProfileState["audioGroupPresets"]>[number] => Boolean(item && typeof item === "object" && typeof (item as { id?: unknown }).id === "string" && typeof (item as { name?: unknown }).name === "string")) : [];
        const importSchedule = Array.isArray(parsed.personalStudyPresetSchedule) ? parsed.personalStudyPresetSchedule : [];
        const importTimeRules = Array.isArray(parsed.personalStudyPresetTimeRules) ? parsed.personalStudyPresetTimeRules : [];
        const importPomodoroRules = Array.isArray(parsed.personalStudyPresetPomodoroRules) ? parsed.personalStudyPresetPomodoroRules : [];
        const importHistory = Array.isArray(parsed.personalStudyPresetHistory) ? parsed.personalStudyPresetHistory : [];
        const importLogs = Array.isArray(parsed.audioActionLogs) ? parsed.audioActionLogs : [];
        const keep = <T extends { id: string }>(existing: T[], incoming: T[]) => [...existing, ...incoming.filter((item) => !existing.some((known) => known.id === item.id))];
        const replaceOrMerge = <T extends { id: string }>(existing: T[], incoming: T[]) => importMode === "replace" ? incoming : keep(existing, incoming);
        onProfile({ ...profile, personalAudioAssets: replaceOrMerge(assets, importAssets), personalAudioTrash: replaceOrMerge(trashedAssets, importTrash), audioGroupPresets: replaceOrMerge(profile.audioGroupPresets ?? [], importGroups), personalStudyPresets: replaceOrMerge(presets, importPresets), personalStudyPresetSchedule: replaceOrMerge(schedule, importSchedule as typeof schedule), personalStudyPresetTimeRules: replaceOrMerge(timeRules, importTimeRules as typeof timeRules), personalStudyPresetPomodoroRules: replaceOrMerge(pomodoroRules, importPomodoroRules as typeof pomodoroRules), personalStudyPresetHistory: replaceOrMerge(presetHistory, importHistory as typeof presetHistory), audioActionLogs: replaceOrMerge(actionLogs, importLogs as typeof actionLogs) }, `Đã ${importMode === "replace" ? "thay thế" : "hợp nhất"} sao lưu: ${importAssets.length} âm thanh, ${importPresets.length} preset và ${importLogs.length} nhật ký.`);
      } catch { onProfile(profile, "Tệp sao lưu Không gian học không hợp lệ hoặc không đúng phiên bản."); }
    };
    reader.readAsText(file);
  }
  function addAsset(nextUrl: string, source: PersonalAudioAsset["source"], fileName?: string) {
    const safeUrl = nextUrl.trim();
    if (!name.trim() || !safeUrl) return onProfile(profile, "Hãy nhập tên và chọn tệp hoặc URL âm thanh hợp lệ.");
    if (source === "external_url" && !isSafeExternalAudioUrl(safeUrl)) return onProfile(profile, "URL âm thanh phải là HTTPS hợp lệ, không kèm thông tin đăng nhập.");
    const now = new Date().toISOString();
    const normalizedTarget = target.trim().slice(0, 80) || "general";
    const hasDefault = assets.some((asset) => asset.category === category && asset.target === normalizedTarget && asset.isDefault);
    saveAssets([...assets, { id: createId("personal-audio"), name: name.trim().slice(0, 100), description: fileName, tags: [], url: safeUrl, source, category, target: normalizedTarget, enabled: true, isDefault: !hasDefault, volume: 70, createdAt: now, updatedAt: now }], "Đã thêm âm thanh vào thư viện cá nhân.");
    setName(""); setUrl(""); setTarget("general");
  }
  async function uploadFile(file: File) {
    const contentType = audioType(file);
    if (!contentType) return onProfile(profile, "Chỉ hỗ trợ MP3, WAV, OGG, WEBM hoặc M4A.");
    if (file.size > 8 * 1024 * 1024) return onProfile(profile, "Tệp âm thanh tối đa 8 MB.");
    try {
      const result = await upload.mutateAsync({ token: getToken(), mediaType: "personal-audio", fileName: file.name, contentType, dataUrl: await readDataUrl(file) });
      addAsset(result.url, "user_upload", file.name);
    } catch (error) { onProfile(profile, error instanceof Error ? error.message : "Không thể tải tệp âm thanh."); }
  }
  function preview(asset: PersonalAudioAsset) {
    if (previewing === asset.id) { audioRef.current?.pause(); setPreviewing(null); return; }
    audioRef.current?.pause(); const audio = new Audio(asset.url); audio.volume = asset.volume / 100; audioRef.current = audio; audio.onended = () => setPreviewing(null); void audio.play().then(() => setPreviewing(asset.id)).catch(() => onProfile(profile, "Không thể phát âm thanh này."));
  }
  function updateAsset(id: string, patch: Partial<PersonalAudioAsset>) { const previous = assets.find((asset) => asset.id === id); const next = assets.map((asset) => asset.id === id ? { ...asset, ...patch, updatedAt: new Date().toISOString() } : asset); if (previous) appendLog({ action: "update", entityType: "asset", entityId: id, entityName: String(patch.name ?? previous.name), summary: `Đã chỉnh sửa tệp ${previous.name}.`, snapshot: next.find((asset) => asset.id === id), previousSnapshot: previous }, undefined, { personalAudioAssets: next }); else saveAssets(next); }
  function updatePresetSchedule(dayOfWeek: number, presetId: string) {
    const now = new Date().toISOString();
    const next = schedule.filter((item) => item.dayOfWeek !== dayOfWeek);
    if (presetId !== "none") next.push({ id: createId("preset-day"), dayOfWeek, presetId, enabled: true, updatedAt: now });
    onProfile({ ...profile, personalStudyPresetSchedule: next.sort((a, b) => a.dayOfWeek - b.dayOfWeek) }, "Đã lưu lịch preset theo tuần.");
  }
  function changePreset(preset: PersonalStudyPreset, message: string) {
    const previous = presets.find((item) => item.id === profile.activePersonalStudyPresetId);
    const history = previous && previous.id !== preset.id ? [{ id: createId("preset-history"), presetId: previous.id, presetName: previous.name, snapshot: { ...previous }, changedAt: new Date().toISOString(), reason: message }, ...presetHistory].slice(0, 100) : presetHistory;
    if (preset.emotion) onEmotion(preset.emotion);
    const log: AudioActionLog = { id: createId("audio-log"), occurredAt: new Date().toISOString(), action: "apply", entityType: "preset", entityId: preset.id, entityName: preset.name, summary: message, snapshot: preset, previousSnapshot: previous };
    onProfile({ ...profile, activePersonalStudyPresetId: preset.id, defaultAmbientScene: preset.ambientScene ?? profile.defaultAmbientScene, companionMode: preset.companionMode, focusMode: preset.focusMode, showLumi: preset.companionMode === "lumi" || preset.companionMode === "both", showMascot: preset.companionMode === "ong" || preset.companionMode === "both", personalStudyPresetHistory: history, audioActionLogs: [log, ...actionLogs].slice(0, 200) }, message);
  }
  function restorePresetHistory(entry: NonNullable<ProfileState["personalStudyPresetHistory"]>[number]) {
    const existing = presets.find((item) => item.id === entry.snapshot.id);
    changePreset(existing ?? { ...entry.snapshot, updatedAt: new Date().toISOString() }, `Đã khôi phục cấu hình “${entry.presetName}” từ lịch sử.`);
  }
  useEffect(() => {
    const today = new Date().getDay();
    const rule = schedule.find((item) => item.dayOfWeek === today && item.enabled);
    const scheduledPreset = rule ? presets.find((preset) => preset.id === rule.presetId) : undefined;
    if (!scheduledPreset || scheduledPreset.id === profile.activePersonalStudyPresetId) return;
    const previous = presets.find((preset) => preset.id === profile.activePersonalStudyPresetId);
    const history = previous ? [{ id: createId("preset-history"), presetId: previous.id, presetName: previous.name, snapshot: { ...previous }, changedAt: new Date().toISOString(), reason: "Tự động áp dụng theo lịch preset trong tuần." }, ...presetHistory].slice(0, 100) : presetHistory;
    onProfile({ ...profile, activePersonalStudyPresetId: scheduledPreset.id, defaultAmbientScene: scheduledPreset.ambientScene ?? profile.defaultAmbientScene, companionMode: scheduledPreset.companionMode, emotionTheme: scheduledPreset.emotion ?? profile.emotionTheme, focusMode: scheduledPreset.focusMode, showLumi: scheduledPreset.companionMode === "lumi" || scheduledPreset.companionMode === "both", showMascot: scheduledPreset.companionMode === "ong" || scheduledPreset.companionMode === "both", personalStudyPresetHistory: history }, `Đã tự động áp dụng preset “${scheduledPreset.name}” theo lịch hôm nay.`);
  }, [schedule, presets, profile.activePersonalStudyPresetId]);
  useEffect(() => {
    const applyTimeRule = () => {
      const now = new Date();
      const rule = timeRules.filter((item) => item.enabled && timeIsInsideRule(now, item)).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
      const preset = rule ? presets.find((item) => item.id === rule.presetId) : undefined;
      if (preset && preset.id !== profile.activePersonalStudyPresetId) applyAudioPreset(preset.id, "autoApply");
    };
    applyTimeRule();
    const timer = window.setInterval(applyTimeRule, 60_000);
    return () => window.clearInterval(timer);
  }, [timeRules, presets, profile.activePersonalStudyPresetId]);
  function updateTimeRule(id: string, patch: Partial<PersonalStudyPresetTimeRule>) {
    onProfile({ ...profile, personalStudyPresetTimeRules: timeRules.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item) }, "Đã cập nhật lịch preset theo giờ.");
  }
  function addTimeRule() {
    const preset = presets[0];
    if (!preset) return onProfile(profile, "Hãy lưu ít nhất một preset trước khi tạo lịch theo giờ.");
    const now = new Date().toISOString();
    onProfile({ ...profile, personalStudyPresetTimeRules: [...timeRules, { id: createId("preset-time"), startTime: "08:00", endTime: "12:00", presetId: preset.id, enabled: true, updatedAt: now }] }, "Đã thêm lịch preset theo giờ.");
  }
  function updatePomodoroRule(mode: PersonalStudyPresetPomodoroRule["mode"], presetId: string) {
    const next = pomodoroRules.filter((item) => item.mode !== mode);
    if (presetId !== "none") next.push({ id: createId("preset-pomo"), mode, presetId, enabled: true, priority: next.length, updatedAt: new Date().toISOString() });
    onProfile({ ...profile, personalStudyPresetPomodoroRules: next }, "Đã lưu preset tự động theo Pomodoro.");
  }
  function restoreAudioLog(log: AudioActionLog) {
    if (!log.snapshot) return onProfile(profile, "Nhật ký này không có snapshot để khôi phục.");
    if (log.entityType === "asset") {
      const asset = log.snapshot as PersonalAudioAsset;
      const exists = assets.some((item) => item.id === asset.id);
      onProfile({ ...profile, personalAudioAssets: exists ? assets.map((item) => item.id === asset.id ? { ...asset, updatedAt: new Date().toISOString() } : item) : [...assets, { ...asset, updatedAt: new Date().toISOString() }], personalAudioTrash: trashedAssets.filter((item) => item.id !== asset.id) }, `Đã khôi phục tệp “${asset.name}” từ nhật ký.`);
    } else {
      const preset = log.snapshot as PersonalStudyPreset;
      const exists = presets.some((item) => item.id === preset.id);
      onProfile({ ...profile, personalStudyPresets: exists ? presets.map((item) => item.id === preset.id ? preset : item) : [...presets, preset] }, `Đã khôi phục preset “${preset.name}” từ nhật ký.`);
    }
  }
  function setDefaultAsset(asset: PersonalAudioAsset) {
    saveAssets(assets.map((item) => ({ ...item, isDefault: item.category === asset.category && item.target === asset.target ? item.id === asset.id : item.isDefault, updatedAt: item.id === asset.id ? new Date().toISOString() : item.updatedAt })), `Đã đặt “${asset.name}” làm âm thanh mặc định cho ${asset.target}.`);
  }
  function trashAsset(asset: PersonalAudioAsset) {
    const deletedAt = new Date().toISOString();
    const trashed = { ...asset, deletedAt, updatedAt: deletedAt };
    appendLog({ action: "delete", entityType: "asset", entityId: asset.id, entityName: asset.name, summary: `Đã chuyển ${asset.name} vào thùng rác.`, snapshot: asset }, `Đã chuyển “${asset.name}” vào Thùng rác âm thanh.`, { personalAudioAssets: assets.filter((item) => item.id !== asset.id), personalAudioTrash: [trashed, ...trashedAssets].slice(0, 300) });
  }
  function restoreAsset(asset: PersonalAudioAsset) {
    const { deletedAt: _deletedAt, ...restored } = asset;
    const sameDefault = assets.some((item) => item.category === restored.category && item.target === restored.target && item.isDefault);
    const nextAsset = { ...restored, isDefault: restored.isDefault && !sameDefault, updatedAt: new Date().toISOString() };
    appendLog({ action: "restore", entityType: "asset", entityId: asset.id, entityName: asset.name, summary: `Đã khôi phục ${asset.name}.`, snapshot: nextAsset, previousSnapshot: asset }, `Đã khôi phục “${asset.name}” vào thư viện.`, { personalAudioAssets: [...assets, nextAsset], personalAudioTrash: trashedAssets.filter((item) => item.id !== asset.id) });
  }
  function permanentlyDeleteAsset(asset: PersonalAudioAsset) {
    if (!window.confirm(`Xóa vĩnh viễn “${asset.name}”? Thao tác này không thể hoàn tác.`)) return;
    appendLog({ action: "delete", entityType: "asset", entityId: asset.id, entityName: asset.name, summary: `Đã xóa vĩnh viễn ${asset.name}; nhật ký vẫn giữ snapshot khôi phục.`, snapshot: asset }, `Đã xóa vĩnh viễn “${asset.name}”.`, { personalAudioAssets: assets, personalAudioTrash: trashedAssets.filter((item) => item.id !== asset.id) });
  }
  function createPreset() {
    if (!presetName.trim()) return onProfile(profile, "Hãy đặt tên cho preset trước khi lưu.");
    const now = new Date().toISOString();
    const preset: PersonalStudyPreset = { id: createId("study-space"), name: presetName.trim().slice(0, 80), emotion, ambientScene: profile.defaultAmbientScene, audioAssetIds: enabledAssets.map((asset) => asset.id), companionMode: profile.companionMode ?? "both", focusMode: profile.focusMode === true, createdAt: now, updatedAt: now };
    savePresets([...presets, preset], "Đã lưu preset Không gian học cá nhân."); setPresetName("");
  }
  function applyPreset(preset: PersonalStudyPreset) { changePreset(preset, `Đã áp dụng preset “${preset.name}”.`); }
  function randomMix() {
    const usable = enabledAssets.length ? [...enabledAssets].sort(() => Math.random() - .5).slice(0, Math.min(3, enabledAssets.length)) : [];
    const emotions: EmotionThemeId[] = ["calm", "happy", "focused", "hopeful", "curious", "comeback"];
    const scene = scenes[Math.floor(Math.random() * scenes.length)]?.id ?? "morning";
    const chosenEmotion = emotions[Math.floor(Math.random() * emotions.length)] ?? emotion;
    onEmotion(chosenEmotion);
    onProfile({ ...profile, defaultAmbientScene: scene, activePersonalStudyPresetId: undefined, companionMode: "both", showLumi: true, showMascot: true }, usable.length ? `Đã phối ngẫu nhiên ${usable.length} âm thanh đã bật trong Không gian học.` : "Đã phối nền, cảm xúc và nhân vật; hãy thêm âm thanh cá nhân để Mix ngẫu nhiên có thêm lựa chọn.");
  }

  return <PersistentCollapsible storageKey="personal-study-space" eyebrow="Cá nhân hóa" title="Âm thanh & Chủ đề của tôi" className="relative z-10 mt-4 border-[#2e7d32]/20 bg-white/85">
    <section className="space-y-4" aria-label="Không gian học cá nhân">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black text-[#7f1d1d]">Không gian học cá nhân</p><p className="mt-1 max-w-2xl text-xs leading-5 text-[#35523a]">Tạo bộ màu, cảnh, âm thanh và đồng hành riêng. Hệ thống chỉ phát tệp khi Ong chủ động nhấn nút nghe hoặc bắt đầu phiên học.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={exportPersonalSpace} className="rounded-xl border border-[#2e7d32]/25 bg-white px-3 py-2 text-xs font-black text-[#2e7d32]"><Download className="mr-1 inline h-3.5 w-3.5" />Sao lưu preset + nhật ký</button><input ref={backupInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) importPersonalSpace(file); event.target.value = ""; }} /><select value={importMode} onChange={(event) => setImportMode(event.target.value as typeof importMode)} className="rounded-xl border border-[#2e7d32]/25 bg-white px-2 py-2 text-xs font-bold text-[#2e7d32]" aria-label="Cách nhập sao lưu"><option value="merge">Nhập và hợp nhất</option><option value="replace">Nhập và thay thế</option></select><button type="button" onClick={() => backupInputRef.current?.click()} className="rounded-xl border border-[#2e7d32]/25 bg-white px-3 py-2 text-xs font-black text-[#2e7d32]"><FileUp className="mr-1 inline h-3.5 w-3.5" />Nhập sao lưu</button><button type="button" onClick={randomMix} className="rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white"><Sparkles className="mr-1 inline h-3.5 w-3.5" />Mix ngẫu nhiên</button></div></div>
      <div className="grid gap-2 rounded-2xl border border-[#2e7d32]/15 bg-[#eff9ef] p-3 md:grid-cols-4"><label className="text-xs font-bold text-[#35523a]">Hiển thị bạn đồng hành<select value={profile.companionMode ?? "both"} onChange={(event) => { const mode = event.target.value as PersonalStudyPreset["companionMode"]; onProfile({ ...profile, companionMode: mode, showLumi: mode === "lumi" || mode === "both", showMascot: mode === "ong" || mode === "both" }); }} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2"><option value="both">Lumi và Ong</option><option value="lumi">Chỉ Lumi</option><option value="ong">Chỉ Ong</option><option value="hidden">Ẩn cả hai</option></select></label><label className="text-xs font-bold text-[#35523a]">Cảnh nền<select value={profile.defaultAmbientScene ?? "morning"} onChange={(event) => onProfile({ ...profile, defaultAmbientScene: event.target.value as AmbientScenePreference })} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2">{scenes.map((scene) => <option key={scene.id} value={scene.id}>{scene.label}</option>)}</select></label><label className="flex items-center gap-2 pt-5 text-xs font-bold text-[#35523a]"><input type="checkbox" checked={profile.focusMode === true} onChange={(event) => onProfile({ ...profile, focusMode: event.target.checked })} />Chế độ tập trung</label><label className="flex items-center gap-2 pt-5 text-xs font-bold text-[#35523a]"><input type="checkbox" checked={profile.autoNightMode === true} onChange={(event) => onProfile({ ...profile, autoNightMode: event.target.checked })} />Tự động ban đêm</label></div>
      <div className="rounded-2xl border border-[#c62828]/15 bg-[#fff7f2] p-3"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">Thêm âm thanh của tôi</p><div className="mt-2 grid gap-2 md:grid-cols-4"><input value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="Tên âm thanh" /><select value={category} onChange={(event) => setCategory(event.target.value as PersonalAudioCategory)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm">{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><input value={target} onChange={(event) => setTarget(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="Ví dụ: bắt đầu, mưa" /><input value={url} onChange={(event) => setUrl(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="https://…" /></div><div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => addAsset(url, "external_url")} className="rounded-xl border border-[#c62828]/25 bg-white px-3 py-2 text-xs font-black text-[#c62828]"><Plus className="mr-1 inline h-3.5 w-3.5" />Thêm URL</button><input ref={inputRef} type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4,audio/x-m4a,.m4a" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file); event.target.value = ""; }} /><button type="button" disabled={upload.isPending} onClick={() => inputRef.current?.click()} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white disabled:opacity-60"><Upload className="mr-1 inline h-3.5 w-3.5" />{upload.isPending ? "Đang tải…" : "Tải tệp MP3/WAV/OGG/M4A"}</button></div></div>
      <div className="rounded-2xl border border-[#2e7d32]/15 bg-[#f7fbf5] p-3"><div className="flex flex-wrap items-center gap-2"><div className="relative min-w-56 flex-1"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#6f5a53]" /><input value={librarySearch} onChange={(event) => setLibrarySearch(event.target.value)} className="w-full rounded-xl border border-[#2e7d32]/20 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Tìm nhanh tên, loại, bối cảnh hoặc nhãn…" aria-label="Tìm nhanh thư viện âm thanh" /></div><select value={selectedLabel} onChange={(event) => setSelectedLabel(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" aria-label="Lọc theo nhãn"><option value="all">Tất cả nhãn</option><option value="none">Chưa gắn nhãn</option>{labels.map((label) => <option key={label} value={label}>{label}</option>)}</select></div><p className="mt-2 text-[11px] text-[#6f5a53]">{visibleAssets.length}/{assets.length} bản thu · Nhãn cách nhau bằng dấu phẩy.</p></div>
      <div className="grid gap-2 md:grid-cols-2">{visibleAssets.length ? visibleAssets.map((asset) => <article key={asset.id} className="rounded-2xl border border-[#2e7d32]/15 bg-white p-3"><div className="flex justify-between gap-2"><div className="min-w-0 flex-1"><label className="sr-only" htmlFor={`personal-audio-name-${asset.id}`}>Tên âm thanh</label><input id={`personal-audio-name-${asset.id}`} defaultValue={asset.name} onBlur={(event) => { const nextName = event.target.value.trim().slice(0, 100); if (nextName && nextName !== asset.name) updateAsset(asset.id, { name: nextName }); }} className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 font-black text-[#35523a] focus:border-[#2e7d32]/25 focus:bg-[#eff9ef]" aria-label={`Đổi tên ${asset.name}`} /><div className="mt-1 flex flex-wrap gap-1"><label className="text-xs text-[#6f5a53]"><span className="sr-only">Loại âm thanh</span><select value={asset.category} onChange={(event) => updateAsset(asset.id, { category: event.target.value as PersonalAudioCategory })} className="rounded border border-[#2e7d32]/15 bg-white px-1 py-0.5">{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label className="text-xs text-[#6f5a53]"><span className="sr-only">Thời điểm hoặc cảnh dùng âm thanh</span><input defaultValue={asset.target} onBlur={(event) => { const nextTarget = event.target.value.trim().slice(0, 80) || "general"; if (nextTarget !== asset.target) updateAsset(asset.id, { target: nextTarget }); }} className="w-24 rounded border border-[#2e7d32]/15 px-1 py-0.5" aria-label={`Sửa thời điểm dùng ${asset.name}`} /></label><label className="text-xs text-[#6f5a53]"><span className="sr-only">Nhãn âm thanh</span><input defaultValue={(asset.tags ?? []).join(", ")} onBlur={(event) => updateAsset(asset.id, { tags: Array.from(new Set(event.target.value.split(",").map((tag) => tag.trim().slice(0, 30)).filter(Boolean))).slice(0, 12) })} className="w-36 rounded border border-[#2e7d32]/15 px-1 py-0.5" placeholder="nhãn, ví dụ: mưa" aria-label={`Sửa nhãn của ${asset.name}`} /></label></div></div><button type="button" onClick={() => trashAsset(asset)} className="rounded-lg p-2 text-[#c62828]" aria-label={`Chuyển ${asset.name} vào thùng rác`} title="Chuyển vào Thùng rác"><Trash2 className="h-4 w-4" /></button></div><div className="mt-3 flex flex-wrap items-center gap-2"><button type="button" onClick={() => preview(asset)} className="rounded-lg bg-[#eff9ef] px-2.5 py-1.5 text-xs font-black text-[#2e7d32]">{previewing === asset.id ? <><Pause className="mr-1 inline h-3.5 w-3.5" />Dừng</> : <><Play className="mr-1 inline h-3.5 w-3.5" />Nghe thử</>}</button><button type="button" onClick={() => setDefaultAsset(asset)} className={`rounded-lg px-2.5 py-1.5 text-xs font-black ${asset.isDefault ? "bg-[#fff3cd] text-[#8a5a00]" : "border border-[#d5cab8] text-[#6f5a53]"}`}><Star className="mr-1 inline h-3.5 w-3.5" />{asset.isDefault ? "Mặc định" : "Đặt mặc định"}</button><label className="flex items-center gap-1 text-xs font-bold text-[#35523a]"><input type="checkbox" checked={asset.enabled} onChange={(event) => updateAsset(asset.id, { enabled: event.target.checked })} />Dùng</label><label className="ml-auto flex items-center gap-2 text-xs font-bold text-[#35523a]"><SlidersHorizontal className="h-3.5 w-3.5" />{asset.volume}%<input type="range" min="0" max="100" value={asset.volume} onChange={(event) => updateAsset(asset.id, { volume: Number(event.target.value) })} className="w-20 accent-[#c62828]" /></label></div><p className="mt-2 flex items-center gap-1 text-[11px] text-[#6f5a53]"><PenLine className="h-3 w-3" />Sửa tên, loại hoặc thời điểm dùng trực tiếp trên thẻ.</p></article>) : <p className="rounded-xl border border-dashed border-[#2e7d32]/25 p-4 text-sm text-[#35523a]">Chưa có âm thanh cá nhân. Ong có thể tải bản thu của mình hoặc thêm một URL HTTPS hợp lệ.</p>}</div>
      <PersistentCollapsible storageKey="personal-audio-trash" eyebrow="Khôi phục" title={`Thùng rác âm thanh (${trashedAssets.length})`} className="border-[#c62828]/20 bg-[#fff8f4]"><div className="space-y-2">{trashedAssets.length ? trashedAssets.map((asset) => <div key={asset.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#c62828]/15 bg-white p-2"><div><p className="text-sm font-black text-[#35523a]">{asset.name}</p><p className="text-xs text-[#6f5a53]">Đã xóa {asset.deletedAt ? new Date(asset.deletedAt).toLocaleDateString("vi-VN") : ""} · tự dọn sau 30 ngày</p></div><div className="flex gap-1"><button type="button" onClick={() => restoreAsset(asset)} className="rounded-lg bg-[#eff9ef] px-2 py-1.5 text-xs font-black text-[#2e7d32]"><ArchiveRestore className="mr-1 inline h-3.5 w-3.5" />Khôi phục</button><button type="button" onClick={() => permanentlyDeleteAsset(asset)} className="rounded-lg bg-[#c62828] px-2 py-1.5 text-xs font-black text-white">Xóa vĩnh viễn</button></div></div>) : <p className="text-sm text-[#6f5a53]">Thùng rác âm thanh đang trống.</p>}</div></PersistentCollapsible>
      <PersistentCollapsible storageKey="personal-study-presets" eyebrow="Cấu hình" title="Preset của tôi" className="border-[#2e7d32]/20 bg-[#eff9ef]"><div className="space-y-3"><div className="flex flex-col gap-2 sm:flex-row"><input value={presetName} onChange={(event) => setPresetName(event.target.value)} className="flex-1 rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="Ví dụ: Đêm học yên tĩnh" /><button type="button" onClick={createPreset} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white"><Plus className="mr-1 inline h-3.5 w-3.5" />Lưu preset</button></div><div className="flex flex-wrap gap-2">{presets.map((preset) => <div key={preset.id} className="flex items-center gap-1 rounded-xl bg-white p-1"><button type="button" onClick={() => applyPreset(preset)} className={`px-2 py-1.5 text-xs font-black ${profile.activePersonalStudyPresetId === preset.id ? "text-[#c62828]" : "text-[#35523a]"}`}><Music2 className="mr-1 inline h-3.5 w-3.5" />{preset.name}{profile.activePersonalStudyPresetId === preset.id ? " · đang dùng" : ""}</button><button type="button" onClick={() => savePresets(presets.filter((item) => item.id !== preset.id), "Đã xóa preset cá nhân.")} className="rounded-lg p-1.5 text-[#c62828]" aria-label={`Xóa preset ${preset.name}`}><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div></div></PersistentCollapsible>
      <PersistentCollapsible storageKey="personal-study-schedule" eyebrow="Tự động hóa" title="Lịch preset theo tuần và thời gian" className="border-[#2e7d32]/20 bg-white/90"><div className="space-y-4"><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4, 5, 6, 0].map((day) => <label key={day} className="text-xs font-bold text-[#35523a]">{["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"][day]}<select value={schedule.find((item) => item.dayOfWeek === day)?.presetId ?? "none"} onChange={(event) => updatePresetSchedule(day, event.target.value)} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2"><option value="none">Không tự đổi</option>{presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>)}</div><div className="rounded-xl border border-[#2e7d32]/15 bg-[#eff9ef] p-3"><div className="flex items-center justify-between gap-2"><div><p className="text-sm font-black text-[#35523a]">Preset theo khung giờ</p><p className="text-[11px] text-[#6f5a53]">Hệ thống kiểm tra mỗi phút và ưu tiên rule mới hơn nếu bị trùng.</p></div><button type="button" onClick={addTimeRule} className="rounded-lg bg-[#2e7d32] px-2.5 py-1.5 text-xs font-black text-white"><Plus className="mr-1 inline h-3.5 w-3.5" />Thêm rule</button></div><div className="mt-2 space-y-2">{timeRules.length ? timeRules.map((rule) => <div key={rule.id} className="grid gap-2 rounded-lg bg-white p-2 sm:grid-cols-[auto_auto_1fr_auto_auto]"><input type="time" value={rule.startTime} onChange={(event) => updateTimeRule(rule.id, { startTime: event.target.value })} className="rounded border p-1 text-xs" aria-label="Giờ bắt đầu rule" /><input type="time" value={rule.endTime} onChange={(event) => updateTimeRule(rule.id, { endTime: event.target.value })} className="rounded border p-1 text-xs" aria-label="Giờ kết thúc rule" /><select value={rule.presetId} onChange={(event) => updateTimeRule(rule.id, { presetId: event.target.value })} className="rounded border p-1 text-xs">{presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={rule.enabled} onChange={(event) => updateTimeRule(rule.id, { enabled: event.target.checked })} />Bật</label><button type="button" onClick={() => onProfile({ ...profile, personalStudyPresetTimeRules: timeRules.filter((item) => item.id !== rule.id) }, "Đã xóa rule preset theo giờ.")} className="rounded p-1 text-[#c62828]" aria-label="Xóa rule theo giờ"><Trash2 className="h-3.5 w-3.5" /></button></div>) : <p className="text-xs text-[#6f5a53]">Chưa có rule theo giờ.</p>}</div></div><div className="rounded-xl border border-[#c62828]/15 bg-[#fff7f2] p-3"><p className="text-sm font-black text-[#7f1d1d]">Preset theo trạng thái Pomodoro</p><div className="mt-2 grid gap-2 sm:grid-cols-3">{(["focus", "shortBreak", "longBreak"] as const).map((mode) => <label key={mode} className="text-xs font-bold text-[#35523a]">{mode === "focus" ? "Tập trung" : mode === "shortBreak" ? "Nghỉ ngắn" : "Nghỉ dài"}<select value={pomodoroRules.find((rule) => rule.mode === mode)?.presetId ?? "none"} onChange={(event) => updatePomodoroRule(mode, event.target.value)} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2"><option value="none">Không tự đổi</option>{presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>)}</div><p className="mt-2 text-[11px] text-[#6f5a53]">Rule Pomodoro được lưu sẵn để bộ đếm áp dụng khi chuyển sang mốc tương ứng.</p></div><div className="rounded-xl border border-[#2e7d32]/15 bg-[#f7fbf5] p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-black text-[#35523a]">Xem trước quy tắc</p><p className="text-[11px] text-[#6f5a53]">Kiểm tra preset sẽ được kích hoạt trước khi chờ đến thời điểm hoặc bắt đầu phiên.</p></div><button type="button" onClick={previewRules} className="rounded-lg bg-[#c62828] px-2.5 py-1.5 text-xs font-black text-white">Xem trước</button></div><div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><label className="text-xs font-bold text-[#35523a]">Thời điểm<input type="datetime-local" value={previewAt} onChange={(event) => setPreviewAt(event.target.value)} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2 text-xs" aria-label="Thời điểm xem trước rule" /></label><label className="text-xs font-bold text-[#35523a]">Trạng thái Pomodoro<select value={previewMode} onChange={(event) => setPreviewMode(event.target.value as typeof previewMode)} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2 text-xs" aria-label="Trạng thái Pomodoro xem trước"><option value="none">Không chọn</option><option value="focus">Tập trung</option><option value="shortBreak">Nghỉ ngắn</option><option value="longBreak">Nghỉ dài</option></select></label><div className="flex items-end"><span className="rounded-lg bg-white px-2.5 py-2 text-xs font-black text-[#35523a]">{previewResult ? previewResult.source : "Chưa kiểm tra"}</span></div></div>{previewResult ? <div className={`mt-2 rounded-lg border p-2 text-xs ${previewResult.preset ? "border-[#2e7d32]/20 bg-[#eff9ef] text-[#35523a]" : "border-[#c62828]/20 bg-[#fff7f2] text-[#7f1d1d]"}`} role="status">{previewResult.detail}</div> : null}</div><p className="text-[11px] text-[#6f5a53]"><CalendarDays className="mr-1 inline h-3.5 w-3.5" />Lịch theo tuần vẫn được giữ để tương thích cấu hình cũ.</p></div></PersistentCollapsible>
      <PersistentCollapsible storageKey="personal-study-history" eyebrow="Khôi phục" title={`Nhật ký thao tác và preset (${actionLogs.length + presetHistory.length})`} className="border-[#2e7d32]/20 bg-[#fffaf0]"><div className="space-y-3"><div className="flex flex-wrap gap-2"><select value={historyFilter} onChange={(event) => setHistoryFilter(event.target.value as typeof historyFilter)} className="rounded-lg border border-[#2e7d32]/20 bg-white px-2 py-1.5 text-xs"><option value="all">Tất cả thao tác</option><option value="preset">Chỉ preset</option><option value="asset">Chỉ tệp audio</option></select><span className="self-center text-[11px] text-[#6f5a53]">Snapshot được giữ tối đa 200 mục.</span></div>{actionLogs.filter((log) => historyFilter === "all" || log.entityType === historyFilter).slice(0, 30).map((log) => <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#2e7d32]/15 bg-white p-3"><div><p className="text-sm font-black text-[#35523a]">{log.entityName}</p><p className="text-xs text-[#6f5a53]">{new Date(log.occurredAt).toLocaleString("vi-VN")} · {log.summary}</p></div>{log.snapshot ? <button type="button" onClick={() => restoreAudioLog(log)} className="rounded-lg bg-[#eff9ef] px-2.5 py-1.5 text-xs font-black text-[#2e7d32]"><History className="mr-1 inline h-3.5 w-3.5" />Khôi phục snapshot</button> : null}</div>)}{presetHistory.slice(0, 8).map((entry) => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#2e7d32]/15 bg-white p-3"><div><p className="text-sm font-black text-[#35523a]">{entry.presetName}</p><p className="text-xs text-[#6f5a53]">{new Date(entry.changedAt).toLocaleString("vi-VN")} · {entry.reason ?? "Thay đổi preset"}</p></div><button type="button" onClick={() => restorePresetHistory(entry)} className="rounded-lg bg-[#eff9ef] px-2.5 py-1.5 text-xs font-black text-[#2e7d32]"><History className="mr-1 inline h-3.5 w-3.5" />Khôi phục</button></div>)}{!actionLogs.length && !presetHistory.length ? <p className="text-sm text-[#6f5a53]">Chưa có thao tác để khôi phục.</p> : null}</div></PersistentCollapsible>
    </section>
  </PersistentCollapsible>;
}
