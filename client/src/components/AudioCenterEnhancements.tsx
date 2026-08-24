import { CheckCircle2, Filter, GripVertical, Layers3, Pause, Play, Radio, RotateCcw, Search, Trash2, Upload, Volume2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MascotVoiceLine, PersonalAudioAsset, ProfileState } from "../../../shared/study";
import { purgeAudioAssetsFromTrash } from "../../../shared/audioPurge";
import { trpc } from "../lib/trpc";
import { PersistentCollapsible } from "./PersistentCollapsible";
import { toast } from "sonner";
import { DEFAULT_AMBIENT_ASSET, DEFAULT_AMBIENT_ASSETS, DEFAULT_AMBIENT_BOOK_PAGES_ASSET, DEFAULT_AMBIENT_MORNING_ASSET, DEFAULT_AMBIENT_STORM_ASSET, DEFAULT_POMODORO_AMBIENT_PRESET } from "../lib/defaultAmbient";
import { resolveMediaUrl } from "../lib/runtime";

type AudioChannel = "environment" | "music" | "voice";
type PlaybackStatus = Record<AudioChannel, { active: boolean; label: string; url?: string; currentTime?: number; duration?: number; volume?: number; muted?: boolean }>;
type Props = {
  profile: ProfileState;
  onProfile: (profile: ProfileState, message?: string) => void;
  voiceLines: MascotVoiceLine[];
  playbackStatus: PlaybackStatus;
  onPlayAsset: (url: string, channel: AudioChannel, label: string, volume?: number, playbackRate?: number) => void;
  onStopPlayback: (channel?: AudioChannel) => void;
  onSeekPlayback: (seconds: number) => void;
};

type AcceptedAudioMime = "audio/webm" | "audio/ogg" | "audio/wav" | "audio/mpeg" | "audio/mp4" | "audio/x-m4a";
const acceptedMime: AcceptedAudioMime[] = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp4", "audio/x-m4a"];
const environmentTargets = [
  { id: "rain", label: "Mưa rơi" },
  { id: "book", label: "Lật sách" },
  { id: "morning", label: "Buổi sáng" },
  { id: "storm", label: "Bão nhẹ" },
] as const;
function environmentTargetLabel(target: string) {
  return environmentTargets.find((item) => item.id === target)?.label ?? target;
}
const voiceCategories = ["all", "lumi", "ong", "member"] as const;
type PreviewRate = 0.5 | 1 | 1.5 | 2;
const speedPresetCategories = ["background", "weather", "season", "pomodoro", "emotion", "lumi", "ong", "member"] as const;
function defaultSpeedPreset(category: PreviewRate extends never ? never : (typeof speedPresetCategories)[number]): PreviewRate[] {
  if (category === "pomodoro") return [0.5, 1, 1.5, 2];
  if (["lumi", "ong", "member"].includes(category)) return [0.5, 1, 1.5];
  return [0.5, 1, 1.5];
}
function defaultPreviewRate(asset: Pick<PersonalAudioAsset, "category" | "target" | "name" | "tags">): PreviewRate {
  const descriptor = `${asset.name} ${(asset.tags ?? []).join(" ")}`.toLocaleLowerCase("vi-VN");
  if (/siêu nhanh|very[- ]?fast/.test(descriptor)) return 2;
  if (/nhanh|fast/.test(descriptor)) return 1.5;
  if (/chậm|slow|thư giãn|relax/.test(descriptor)) return 0.5;
  if (asset.category === "background") return 1;
  if (asset.category === "member") return 1.5;
  return 1;
}

function getToken() {
  try { return JSON.parse(sessionStorage.getItem("study_historia_session_v1") || "{}").token as string || ""; } catch { return ""; }
}
function readDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc tệp âm thanh."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
function createId() { return `personal-audio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function suggestAudioTags(fileName: string, target: string) {
  const normalized = fileName.toLocaleLowerCase("vi-VN");
  const tags = new Set<string>(["environment", target]);
  const keywordTags: Array<[string, string]> = [["mưa", "rain"], ["rain", "rain"], ["sách", "book"], ["book", "book"], ["rừng", "forest"], ["forest", "forest"], ["biển", "ocean"], ["ocean", "ocean"], ["chim", "birds"], ["bird", "birds"], ["gió", "wind"], ["wind", "wind"], ["sấm", "storm"], ["thunder", "storm"], ["piano", "music"], ["nhạc", "music"], ["music", "music"]];
  keywordTags.forEach(([keyword, tag]) => { if (normalized.includes(keyword)) tags.add(tag); });
  return Array.from(tags);
}
function formatDuration(seconds?: number) {
  if (!seconds || !Number.isFinite(seconds)) return "Chưa đọc được thời lượng";
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
function fallbackWaveform(file: File) {
  return file.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    const bars = 48;
    return Array.from({ length: bars }, (_, index) => {
      const start = Math.floor(index * bytes.length / bars);
      const end = Math.max(start + 1, Math.floor((index + 1) * bytes.length / bars));
      let total = 0;
      for (let cursor = start; cursor < end; cursor += 1) total += Math.abs((bytes[cursor] ?? 128) - 128);
      return Math.max(0.12, Math.min(1, total / Math.max(1, end - start) / 96));
    });
  });
}
async function inspectAudio(file: File) {
  const fallback = await fallbackWaveform(file);
  let durationSeconds: number | undefined;
  const objectUrl = URL.createObjectURL(file);
  try {
    durationSeconds = await new Promise<number | undefined>((resolve) => {
      const audio = new Audio();
      const finish = (value?: number) => { audio.removeAttribute("src"); audio.load(); resolve(value); };
      audio.onloadedmetadata = () => finish(Number.isFinite(audio.duration) ? audio.duration : undefined);
      audio.onerror = () => finish(undefined);
      audio.src = objectUrl;
    });
  } finally { URL.revokeObjectURL(objectUrl); }
  let context: AudioContext | null = null;
  try {
    context = new AudioContext();
    const decoded = await context.decodeAudioData(await file.arrayBuffer());
    const channel = decoded.getChannelData(0);
    const bars = 48;
    const waveform = Array.from({ length: bars }, (_, index) => {
      const start = Math.floor(index * channel.length / bars);
      const end = Math.max(start + 1, Math.floor((index + 1) * channel.length / bars));
      let energy = 0;
      for (let cursor = start; cursor < end; cursor += 1) energy += Math.abs(channel[cursor] ?? 0);
      return Math.max(0.12, Math.min(1, energy / Math.max(1, end - start) * 2.4));
    });
    return { durationSeconds: durationSeconds ?? decoded.duration, waveform };
  } catch {
    return { durationSeconds, waveform: fallback };
  } finally {
    if (context && context.state !== "closed") await context.close().catch(() => undefined);
  }
}
function Waveform({ values, currentTime = 0, duration, onSeek, onPlay, label }: { values?: number[]; currentTime?: number; duration?: number; onSeek?: (seconds: number) => void; onPlay?: () => void; label?: string }) {
  const bars = values?.length ? values : Array.from({ length: 48 }, (_, index) => 0.18 + ((index * 17) % 60) / 100);
  const progress = duration && duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;
  function seek(event: React.MouseEvent<HTMLDivElement>) {
    if (!duration || duration <= 0) return;
    if (onPlay && !onSeek) { onPlay(); return; }
    if (!onSeek) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(duration, ((event.clientX - rect.left) / rect.width) * duration)));
  }
  const interactive = Boolean(duration && (onSeek || onPlay));
  return <div className={`relative flex h-10 items-center gap-px overflow-hidden rounded-lg bg-[#edf8ee] px-2 ${interactive ? "cursor-pointer" : ""}`} role={onSeek && duration ? "slider" : "img"} aria-label={onSeek && duration ? `Tua ${label ?? "audio"}` : onPlay ? `Phát thử ${label ?? "audio"}` : "Biểu đồ dạng sóng audio"} aria-valuemin={onSeek && duration ? 0 : undefined} aria-valuemax={onSeek && duration ? duration : undefined} aria-valuenow={onSeek && duration ? currentTime : undefined} tabIndex={interactive ? 0 : undefined} onClick={seek} onKeyDown={(event) => { if (event.key === "Enter" && onPlay && !onSeek) { event.preventDefault(); onPlay(); } if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && onSeek && duration) { event.preventDefault(); onSeek(Math.max(0, Math.min(duration, currentTime + (event.key === "ArrowRight" ? 5 : -5)))); } }}><div className="pointer-events-none absolute inset-y-0 left-0 bg-[#c62828]/15 transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />{bars.map((value, index) => <span key={index} className={`relative z-10 w-full rounded-full ${index / bars.length < progress ? "bg-[#c62828]" : "bg-[#2e7d32]"}`} style={{ height: `${Math.round(Math.max(12, Math.min(100, value * 100)))}%`, opacity: 0.45 + value * 0.5 }} />)}</div>;
}

export function AudioCenterEnhancements({ profile, onProfile, voiceLines, playbackStatus, onPlayAsset, onStopPlayback, onSeekPlayback }: Props) {
  const upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [voiceSearch, setVoiceSearch] = useState("");
  const [voiceCategory, setVoiceCategory] = useState<(typeof voiceCategories)[number]>("all");
  const [voiceEmotion, setVoiceEmotion] = useState("all");
  const [voiceEvent, setVoiceEvent] = useState("all");
  const [busyTarget, setBusyTarget] = useState<string | null>(null);
  const assets = profile.personalAudioAssets ?? [];
  const trash = profile.personalAudioTrash ?? [];
  const activeAssets = useMemo(() => assets.filter((asset) => !asset.deletedAt).sort((a, b) => (a.sortOrder ?? 999999) - (b.sortOrder ?? 999999)), [assets]);
  const [draggedAssetId, setDraggedAssetId] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState("all");
  const [audioSearch, setAudioSearch] = useState("");
  const [audioSource, setAudioSource] = useState("all");
  const [audioStatus, setAudioStatus] = useState("all");
  const [audioTag, setAudioTag] = useState("all");
  const [audioTarget, setAudioTarget] = useState("all");
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [previewRate, setPreviewRate] = useState<PreviewRate>(1);
  const [useTypeSpeedPreset, setUseTypeSpeedPreset] = useState(true);
  const [speedPresetCategory, setSpeedPresetCategory] = useState<(typeof speedPresetCategories)[number]>("background");
  const [speedPresetDraft, setSpeedPresetDraft] = useState<PreviewRate[]>(() => profile.audioPreviewSpeedPresets?.background ?? defaultSpeedPreset("background"));
  const [healthByAssetId, setHealthByAssetId] = useState<Record<string, { status: "checking" | "ok" | "error"; message?: string; checkedAt?: string }>>({});

  const emotionOptions = useMemo(() => Array.from(new Set([
    ...voiceLines.map((item) => item.emotion).filter(Boolean),
    ...activeAssets.filter((item) => ["lumi", "ong", "member"].includes(item.category)).map((item) => item.target).filter((target) => target !== "general"),
  ])).sort((a, b) => String(a).localeCompare(String(b), "vi")), [activeAssets, voiceLines]);
  const eventOptions = useMemo(() => Array.from(new Set(voiceLines.map((item) => item.state).filter(Boolean))).sort((a, b) => a.localeCompare(b, "vi")), [voiceLines]);
  const groupOptions = useMemo(() => Array.from(new Set(activeAssets.map((asset) => asset.group).filter((group): group is string => Boolean(group)))).sort((a, b) => a.localeCompare(b, "vi")), [activeAssets]);
  const tagOptions = useMemo(() => Array.from(new Set(activeAssets.flatMap((asset) => asset.tags ?? []))).sort((a, b) => a.localeCompare(b, "vi")), [activeAssets]);
  const libraryAssets = useMemo(() => {
    const query = audioSearch.trim().toLocaleLowerCase("vi-VN");
    return activeAssets.filter((asset) => {
      const haystack = [asset.name, asset.description, asset.category, asset.target, asset.group, ...(asset.tags ?? [])].filter(Boolean).join(" ").toLocaleLowerCase("vi-VN");
      return (!query || haystack.includes(query)) && (groupFilter === "all" || asset.group === groupFilter) && (audioSource === "all" || asset.source === audioSource) && (audioStatus === "all" || (audioStatus === "enabled" ? asset.enabled : !asset.enabled)) && (audioTag === "all" || (asset.tags ?? []).includes(audioTag)) && (audioTarget === "all" || asset.target === audioTarget);
    });
  }, [activeAssets, audioSearch, audioSource, audioStatus, audioTag, audioTarget, groupFilter]);
  const audioGroupPresets = profile.audioGroupPresets ?? [];
  const visibleLibraryAssets = libraryAssets.filter((asset) => asset.category === "background");
  const ambientHealthAssets = useMemo(() => [...activeAssets.filter((asset) => asset.category === "background"), ...DEFAULT_AMBIENT_ASSETS].filter((asset, index, list) => list.findIndex((candidate) => candidate.id === asset.id) === index), [activeAssets]);
  const healthRetryCooldownMs = 60_000;
  const healthRetryStorageKey = "study-empire:ambient-health-last-retry-v1";
  useEffect(() => {
    let cancelled = false;
    const timers = new Set<number>();
    const controllers = new Set<AbortController>();
    const maxAttempts = 3;
    const maxConcurrentChecks = 3;
    const backoffMs = [500, 1200, 2500];
    let lastRetryByAsset: Record<string, number> = {};
    try {
      const stored = JSON.parse(window.localStorage.getItem(healthRetryStorageKey) || "{}");
      if (stored && typeof stored === "object") {
        lastRetryByAsset = Object.fromEntries(Object.entries(stored).flatMap(([key, value]) => typeof value === "number" && Number.isFinite(value) ? [[key, value]] : []));
      }
    } catch { /* localStorage có thể bị chặn hoặc chứa dữ liệu cũ không hợp lệ. */ }
    const queue = [...ambientHealthAssets];
    const checkAsset = async (asset: (typeof ambientHealthAssets)[number]) => {
      let attempt = 0;
      let finished = false;
      const finish = (status: "ok" | "error", message?: string, checkedAt = new Date().toISOString()) => {
        if (finished || cancelled) return;
        finished = true;
        setHealthByAssetId((current) => ({ ...current, [asset.id]: { status, message, checkedAt } }));
      };
      const lastRetryAt = lastRetryByAsset[asset.id];
      if (lastRetryAt && Date.now() - lastRetryAt < healthRetryCooldownMs) {
        finish("error", "Storage vừa bị giới hạn tạm thời (429). Hệ thống sẽ kiểm tra lại sau một chút.", new Date(lastRetryAt).toISOString());
        return;
      }
      const inspectWithAudio = () => new Promise<void>((resolve) => {
        if (cancelled || finished) { resolve(); return; }
        const audio = new Audio();
        audio.preload = "metadata";
        let settled = false;
        const close = (status: "ok" | "error", message?: string) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          audio.onloadedmetadata = null;
          audio.oncanplay = null;
          audio.onerror = null;
          audio.removeAttribute("src");
          audio.load();
          finish(status, message);
          resolve();
        };
        const timeoutId = window.setTimeout(() => close("error", "Không nhận được metadata sau nhiều lần thử; hãy kiểm tra URL hoặc storage."), 7000);
        audio.onloadedmetadata = () => close("ok");
        audio.oncanplay = () => close("ok");
        audio.onerror = () => close("error", "URL không tải được hoặc định dạng không được trình duyệt hỗ trợ.");
        audio.src = resolveMediaUrl(asset.url);
        audio.load();
      });
      const check = async (): Promise<void> => {
        if (cancelled || finished) return;
        attempt += 1;
        setHealthByAssetId((current) => ({ ...current, [asset.id]: { status: "checking", message: `Đang kiểm tra lần ${attempt}/${maxAttempts}…` } }));
        let requestTimeout: number | undefined;
        let controller: AbortController | undefined;
        try {
          const activeController = new AbortController();
          controller = activeController;
          controllers.add(activeController);
          requestTimeout = window.setTimeout(() => activeController.abort(), 5000);
          const response = await fetch(resolveMediaUrl(asset.url), { method: "HEAD", cache: "no-store", signal: activeController.signal });
          if (response.status === 429) {
            if (attempt < maxAttempts) {
              const retryAt = Date.now();
              lastRetryByAsset[asset.id] = retryAt;
              try { window.localStorage.setItem(healthRetryStorageKey, JSON.stringify(lastRetryByAsset)); } catch { /* không làm gián đoạn health-check nếu storage bị chặn. */ }
              if (attempt === 1) toast.info("Storage đang bận", { description: `Audio Center sẽ tự thử lại “${asset.name}” sau ít giây.` });
              await new Promise<void>((resolve) => {
                const timer = window.setTimeout(() => { timers.delete(timer); resolve(); }, backoffMs[attempt - 1] ?? 2500);
                timers.add(timer);
              });
              if (!cancelled) await check();
              return;
            }
            const retryAt = Date.now();
            lastRetryByAsset[asset.id] = retryAt;
            try { window.localStorage.setItem(healthRetryStorageKey, JSON.stringify(lastRetryByAsset)); } catch { /* không làm gián đoạn health-check nếu storage bị chặn. */ }
            toast.warning("Tạm thời bị giới hạn truy cập", { description: `Hãy chờ một chút rồi thử lại “${asset.name}”.` });
            finish("error", "Storage đang giới hạn tạm thời (429). Hãy chờ một chút rồi thử lại.");
            return;
          }
          if (response.status >= 400 && response.status !== 405) {
            finish("error", `Storage trả về lỗi HTTP ${response.status}.`);
            return;
          }
          await inspectWithAudio();
        } catch {
          // Một số trình duyệt chặn hoặc treo HEAD cross-origin; vẫn xác minh bằng metadata Audio.
          await inspectWithAudio();
        } finally {
          if (requestTimeout !== undefined) window.clearTimeout(requestTimeout);
          if (controller) controllers.delete(controller);
        }
      };
      await check();
    };
    const worker = async () => {
      while (!cancelled) {
        const asset = queue.shift();
        if (!asset) return;
        await checkAsset(asset);
      }
    };
    const workerCount = Math.min(maxConcurrentChecks, queue.length);
    void Promise.all(Array.from({ length: workerCount }, () => worker()));
    return () => { cancelled = true; controllers.forEach((controller) => controller.abort()); controllers.clear(); timers.forEach((timer) => window.clearTimeout(timer)); timers.clear(); };
  }, [ambientHealthAssets]);
  function healthBadge(asset: PersonalAudioAsset) {
    const health = healthByAssetId[asset.id];
    const checkedLabel = health?.checkedAt ? ` · kiểm tra ${new Date(health.checkedAt).toLocaleString("vi-VN")}` : "";
    if (!health || health.status === "checking") return <span className="rounded-full bg-[#fff3cd] px-2 py-0.5 text-[10px] font-bold text-[#8a5a00]">Đang kiểm tra URL{checkedLabel}</span>;
    if (health.status === "ok") return <span className="rounded-full bg-[#e6f7e9] px-2 py-0.5 text-[10px] font-bold text-[#236b2e]">URL hoạt động{checkedLabel}</span>;
    return <span title={health.message} className="rounded-full bg-[#ffe6e3] px-2 py-0.5 text-[10px] font-bold text-[#a72820]">URL lỗi · thử lại{checkedLabel}</span>;
  }
  const selectedVisibleAssets = visibleLibraryAssets.filter((asset) => selectedAssetIds.includes(asset.id));
  function previewRateFor(asset: Pick<PersonalAudioAsset, "category" | "target" | "name" | "tags">): PreviewRate {
    if (!useTypeSpeedPreset) return previewRate;
    return profile.audioPreviewSpeedPresets?.[asset.category]?.[0] ?? defaultPreviewRate(asset);
  }
  function changeSpeedPresetCategory(category: (typeof speedPresetCategories)[number]) {
    setSpeedPresetCategory(category);
    setSpeedPresetDraft(profile.audioPreviewSpeedPresets?.[category] ?? defaultSpeedPreset(category));
  }
  function toggleSpeedPreset(rate: PreviewRate) {
    setSpeedPresetDraft((current) => current.includes(rate) ? current.filter((item) => item !== rate) : [...current, rate].sort((a, b) => a - b));
  }
  function saveSpeedPreset() {
    const speeds = speedPresetDraft.length ? speedPresetDraft : [1];
    onProfile({ ...profile, audioPreviewSpeedPresets: { ...(profile.audioPreviewSpeedPresets ?? {}), [speedPresetCategory]: speeds } }, `Đã lưu preset tốc độ cho ${speedPresetCategory}.`);
  }
  function resetSpeedPreset() {
    const next = { ...(profile.audioPreviewSpeedPresets ?? {}) };
    delete next[speedPresetCategory];
    const defaults = defaultSpeedPreset(speedPresetCategory);
    setSpeedPresetDraft(defaults);
    onProfile({ ...profile, audioPreviewSpeedPresets: next }, `Đã khôi phục preset tốc độ mặc định cho ${speedPresetCategory}.`);
  }

  const filteredVoices = useMemo(() => {
    const normalizedQuery = voiceSearch.trim().toLocaleLowerCase("vi-VN");
    const personal = activeAssets.filter((asset) => ["lumi", "ong", "member"].includes(asset.category) && asset.enabled).map((asset) => ({
      id: asset.id,
      label: asset.category === "lumi" ? "Lumi" : asset.category === "ong" ? "Ong" : "Thành viên",
      name: asset.name,
      text: asset.description || asset.name,
      emotion: asset.target === "general" ? undefined : asset.target,
      event: undefined,
      url: asset.url,
      volume: asset.volume,
    }));
    const approved = voiceLines.filter((line) => line.enabled && !line.deletedAt).map((line) => ({
      id: line.id,
      label: line.source === "admin" ? "Lumi/Ong · quản trị" : "Lumi/Ong · thành viên",
      name: line.state,
      text: line.text,
      emotion: line.emotion,
      event: line.state,
      url: line.audioUrl,
      volume: 75,
    }));
    return [...personal, ...approved].filter((item) => {
      const haystack = `${item.label} ${item.name} ${item.text} ${item.emotion ?? ""} ${item.event ?? ""}`.toLocaleLowerCase("vi-VN");
      return (!normalizedQuery || haystack.includes(normalizedQuery)) && (voiceCategory === "all" || item.label.toLocaleLowerCase("vi-VN").includes(voiceCategory === "member" ? "thành viên" : voiceCategory)) && (voiceEmotion === "all" || item.emotion === voiceEmotion) && (voiceEvent === "all" || item.event === voiceEvent);
    });
  }, [activeAssets, voiceCategory, voiceEmotion, voiceEvent, voiceLines, voiceSearch]);

  function patchAsset(id: string, patch: Partial<PersonalAudioAsset>, message?: string) {
    onProfile({ ...profile, personalAudioAssets: assets.map((asset) => asset.id === id ? { ...asset, ...patch, updatedAt: new Date().toISOString() } : asset) }, message);
  }

  function softDeleteAsset(asset: PersonalAudioAsset) {
    const deletedAt = new Date().toISOString();
    onProfile({ ...profile, personalAudioAssets: assets.filter((candidate) => candidate.id !== asset.id), personalAudioTrash: [...trash.filter((candidate) => candidate.id !== asset.id), { ...asset, enabled: false, isDefault: false, deletedAt }] }, `Đã chuyển “${asset.name}” vào thùng rác audio.`);
  }

  function restoreAsset(asset: PersonalAudioAsset) {
    const { deletedAt: _deletedAt, ...restored } = asset;
    const nextOrder = assets.reduce((max, candidate) => Math.max(max, candidate.sortOrder ?? -1), -1) + 1;
    onProfile({ ...profile, personalAudioAssets: [...assets, { ...restored, enabled: true, sortOrder: nextOrder, updatedAt: new Date().toISOString() }], personalAudioTrash: trash.filter((candidate) => candidate.id !== asset.id) }, `Đã khôi phục “${asset.name}”.`);
  }

  function restoreAllAssets() {
    if (!trash.length) return;
    const restored = trash.map(({ deletedAt: _deletedAt, ...asset }, index) => ({ ...asset, enabled: true, sortOrder: assets.length + index, updatedAt: new Date().toISOString() }));
    onProfile({ ...profile, personalAudioAssets: [...assets, ...restored], personalAudioTrash: [] }, `Đã khôi phục ${restored.length} asset audio.`);
  }

  function permanentlyDeleteAsset(asset: PersonalAudioAsset) {
    if (!window.confirm(`Xóa vĩnh viễn “${asset.name}”? Thao tác này không thể hoàn tác.`)) return;
    const nextProfile = purgeAudioAssetsFromTrash(profile, [asset]);
    onProfile(nextProfile, `Đã xóa vĩnh viễn “${asset.name}”. Metadata, key và snapshot đã bị loại bỏ; tệp không còn truy cập được theo storage contract.`);
    toast.success(`Đã xóa vĩnh viễn “${asset.name}”`, { description: "Tệp không còn truy cập được từ hồ sơ, preset hoặc nhật ký khôi phục." });
  }

  function permanentlyDeleteAllAssets() {
    if (!trash.length || !window.confirm(`Xóa vĩnh viễn ${trash.length} tệp trong thùng rác? Thao tác này không thể hoàn tác.`)) return;
    const nextProfile = purgeAudioAssetsFromTrash(profile, trash);
    onProfile(nextProfile, `Đã xóa vĩnh viễn ${trash.length} tệp audio. Metadata, key và snapshot đã bị loại bỏ; tệp không còn truy cập được theo storage contract.`);
    toast.success(`Đã xóa vĩnh viễn ${trash.length} tệp audio`, { description: "Các tệp không còn truy cập được từ hồ sơ, preset hoặc nhật ký khôi phục." });
  }

  function saveGroupPreset(group: string) {
    const ids = activeAssets.filter((asset) => asset.group === group).map((asset) => asset.id);
    if (!ids.length) return;
    const name = window.prompt(`Tên preset cho nhóm “${group}”`, group)?.trim();
    if (!name) return;
    const now = new Date().toISOString();
    const preset = { id: createId(), name: name.slice(0, 80), audioAssetIds: ids, enabled: true, createdAt: now, updatedAt: now };
    onProfile({ ...profile, audioGroupPresets: [...audioGroupPresets, preset] }, `Đã lưu preset nhóm “${preset.name}”.`);
  }

  function applyGroupPreset(preset: NonNullable<ProfileState["audioGroupPresets"]>[number], enabled: boolean) {
    const ids = new Set(preset.audioAssetIds);
    const now = new Date().toISOString();
    onProfile({ ...profile, personalAudioAssets: assets.map((asset) => ids.has(asset.id) ? { ...asset, enabled, updatedAt: now } : asset), audioGroupPresets: audioGroupPresets.map((item) => item.id === preset.id ? { ...item, enabled, updatedAt: now } : item) }, `${enabled ? "Đã bật" : "Đã tắt"} preset “${preset.name}”.`);
  }

  function deleteGroupPreset(preset: NonNullable<ProfileState["audioGroupPresets"]>[number]) {
    if (!window.confirm(`Xóa preset “${preset.name}”? Các tệp audio sẽ không bị xóa.`)) return;
    onProfile({ ...profile, audioGroupPresets: audioGroupPresets.filter((item) => item.id !== preset.id) }, `Đã xóa preset “${preset.name}”.`);
  }

  function reorderAssets(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const next = [...activeAssets];
    const sourceIndex = next.findIndex((asset) => asset.id === sourceId);
    const targetIndex = next.findIndex((asset) => asset.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    const orderById = new Map(next.map((asset, index) => [asset.id, index]));
    onProfile({ ...profile, personalAudioAssets: assets.map((asset) => orderById.has(asset.id) ? { ...asset, sortOrder: orderById.get(asset.id), updatedAt: new Date().toISOString() } : asset) }, "Đã lưu thứ tự phát audio mới.");
  }

  function assignGroup(asset: PersonalAudioAsset) {
    const nextGroup = window.prompt("Tên nhóm/chủ đề cho asset", asset.group ?? "")?.trim();
    if (nextGroup !== undefined) patchAsset(asset.id, { group: nextGroup ? nextGroup.slice(0, 60) : undefined }, nextGroup ? `Đã nhóm “${asset.name}” vào “${nextGroup}”.` : `Đã bỏ nhóm của “${asset.name}”.`);
  }

  function renameAsset(asset: PersonalAudioAsset) {
    const nextName = window.prompt("Tên mới cho asset âm thanh", asset.name)?.trim();
    if (nextName && nextName !== asset.name) patchAsset(asset.id, { name: nextName.slice(0, 100) }, `Đã đổi tên “${asset.name}”.`);
  }

  function toggleAssetSelection(id: string) {
    setSelectedAssetIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleSelectAllVisible() {
    setSelectedAssetIds((current) => selectedVisibleAssets.length > 0 && selectedVisibleAssets.every((asset) => current.includes(asset.id))
      ? current.filter((id) => !selectedVisibleAssets.some((asset) => asset.id === id))
      : Array.from(new Set([...current, ...selectedVisibleAssets.map((asset) => asset.id)])));
  }

  function bulkUpdateAssets(patch: Partial<PersonalAudioAsset>, message: string) {
    if (!selectedVisibleAssets.length) return;
    const ids = new Set(selectedVisibleAssets.map((asset) => asset.id));
    onProfile({ ...profile, personalAudioAssets: assets.map((asset) => ids.has(asset.id) ? { ...asset, ...patch, updatedAt: new Date().toISOString() } : asset) }, message);
    setSelectedAssetIds([]);
  }

  function bulkTagAssets() {
    if (!selectedVisibleAssets.length) return;
    const input = window.prompt("Nhãn áp dụng cho các tệp đã chọn (phân cách bằng dấu phẩy)", "");
    if (input === null) return;
    const tags = Array.from(new Set(input.split(",").map((tag) => tag.trim().toLocaleLowerCase("vi-VN")).filter(Boolean))).slice(0, 12);
    bulkUpdateAssets({ tags }, `Đã gắn ${tags.length} nhãn cho ${selectedVisibleAssets.length} tệp audio.`);
  }

  function bulkMoveAssets() {
    if (!selectedVisibleAssets.length) return;
    const group = window.prompt("Nhóm/chủ đề mới cho các tệp đã chọn", "")?.trim();
    if (group === undefined) return;
    bulkUpdateAssets({ group: group ? group.slice(0, 60) : undefined }, group ? `Đã chuyển ${selectedVisibleAssets.length} tệp vào nhóm “${group}”.` : `Đã bỏ nhóm của ${selectedVisibleAssets.length} tệp.`);
  }

  function bulkSoftDeleteAssets() {
    if (!selectedVisibleAssets.length || !window.confirm(`Chuyển ${selectedVisibleAssets.length} tệp vào thùng rác?`)) return;
    const ids = new Set(selectedVisibleAssets.map((asset) => asset.id));
    const deletedAt = new Date().toISOString();
    const removed = assets.filter((asset) => ids.has(asset.id));
    onProfile({ ...profile, personalAudioAssets: assets.filter((asset) => !ids.has(asset.id)), personalAudioTrash: [...trash.filter((asset) => !ids.has(asset.id)), ...removed.map((asset) => ({ ...asset, enabled: false, isDefault: false, deletedAt }))] }, `Đã chuyển ${removed.length} tệp audio vào thùng rác.`);
    setSelectedAssetIds([]);
  }

  async function uploadEnvironment(file: File, target: (typeof environmentTargets)[number]["id"]) {
    if (!acceptedMime.includes(file.type as AcceptedAudioMime)) { onProfile(profile, "Chỉ hỗ trợ MP3, WAV, OGG, WEBM hoặc M4A cho âm thanh môi trường."); return; }
    if (file.size > 8 * 1024 * 1024) { onProfile(profile, "Tệp âm thanh môi trường tối đa 8 MB."); return; }
    const token = getToken();
    if (!token) { onProfile(profile, "Phiên đăng nhập đã hết. Hãy đăng nhập lại trước khi tải âm thanh."); return; }
    setBusyTarget(target);
    try {
      const result = await upload.mutateAsync({ token, mediaType: "personal-audio", fileName: file.name, contentType: file.type as AcceptedAudioMime, dataUrl: await readDataUrl(file) });
      const now = new Date().toISOString();
      const category = "background" as const;
      const hasDefault = activeAssets.some((asset) => asset.category === category && asset.target === target && asset.isDefault);
      const metadata = await inspectAudio(file);
      const suggestedTags = suggestAudioTags(file.name, target);
      const nextAsset: PersonalAudioAsset = { id: createId(), name: file.name.replace(/\.[^.]+$/, "").slice(0, 100), description: `Âm thanh môi trường · ${environmentTargetLabel(target)}`, tags: suggestedTags, url: result.url, source: "user_upload", category, target, enabled: true, isDefault: !hasDefault, volume: 70, durationSeconds: metadata.durationSeconds, waveform: metadata.waveform, sortOrder: activeAssets.length, group: target === "rain" ? "Thiên nhiên" : target === "book" ? "Đọc sách" : "Thời tiết", createdAt: now, updatedAt: now };
      onProfile({ ...profile, personalAudioAssets: [...assets, nextAsset] }, `Đã tải “${nextAsset.name}” với nhãn gợi ý: ${suggestedTags.join(", ")}. Bạn có thể chỉnh sửa nhãn trong thư viện.`);
    } catch (error) { onProfile(profile, error instanceof Error ? error.message : "Không thể tải âm thanh môi trường."); }
    finally { setBusyTarget(null); }
  }

  function applyPomodoroAmbientPreset() {
    const presets = profile.personalStudyPresets ?? [];
    const hasPreset = presets.some((preset) => preset.id === DEFAULT_POMODORO_AMBIENT_PRESET.id);
    onProfile({ ...profile, personalStudyPresets: hasPreset ? presets : [...presets, DEFAULT_POMODORO_AMBIENT_PRESET], activePersonalStudyPresetId: DEFAULT_POMODORO_AMBIENT_PRESET.id }, `Đã áp dụng preset “${DEFAULT_POMODORO_AMBIENT_PRESET.name}”.`);
  }
  // Các panel này không có luồng mở hoàn chỉnh nên không được render trong giao diện người dùng.
  const showUnavailableAudioCenterPanels = false;
  return <div className="relative z-10 mt-4 grid gap-3" onPointerDownCapture={(event) => event.stopPropagation()} onClickCapture={(event) => event.stopPropagation()}>
    <div className="rounded-2xl border border-[#2e7d32]/20 bg-gradient-to-r from-[#f6fff2] to-[#fff8ed] p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c62828]">Preset Pomodoro mới</p><h3 className="mt-1 text-sm font-black text-[#25582c]">{DEFAULT_POMODORO_AMBIENT_PRESET.name}</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-[#5a6d5d]">Phối hai lớp âm thanh Buổi sáng và Bão nhẹ ở mức dịu, phù hợp khi muốn đổi không gian tập trung.</p></div><button type="button" onClick={applyPomodoroAmbientPreset} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white shadow-sm transition-transform active:scale-[.98]" aria-label="Áp dụng preset Pomodoro Bình minh và Bão nhẹ"><Play className="h-3.5 w-3.5" />Áp dụng preset</button></div>
    </div>
    {showUnavailableAudioCenterPanels ? <>
    <PersistentCollapsible storageKey="audio-center-upload" eyebrow="Audio Center" title="Tải âm thanh môi trường thật" className="border-[#c62828]/20 bg-white/90">
      <p className="text-xs leading-5 text-[#35523a]">Thêm bản thu sạch cho mưa rơi hoặc lật sách. Hệ thống chỉ lưu MP3/WAV/OGG/WEBM/M4A vào storage, không tạo âm tổng hợp.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {environmentTargets.map((target) => {
          const personalCurrent = activeAssets.find((asset) => asset.enabled && asset.category === "background" && asset.target === target.id);
          const current = personalCurrent ?? (target.id === "rain" ? DEFAULT_AMBIENT_ASSET : target.id === "book" ? DEFAULT_AMBIENT_BOOK_PAGES_ASSET : target.id === "morning" ? DEFAULT_AMBIENT_MORNING_ASSET : target.id === "storm" ? DEFAULT_AMBIENT_STORM_ASSET : undefined);
          return <div key={target.id} className="rounded-xl border border-[#2e7d32]/15 bg-[#f8fff8] p-3"><div className="flex items-start justify-between gap-2"><div><b className="text-sm text-[#25582c]">{target.label}</b><span className="mt-1 block text-[11px] text-[#5a6d5d]">{current ? `${current.source === "built_in" ? "Mặc định" : "Đang dùng"}: ${current.name}` : "Chưa có bản thu thật"}</span>{current ? <div className="mt-1">{healthBadge(current)}</div> : null}</div><div className="flex shrink-0 flex-wrap justify-end gap-1">{current?.source === "built_in" ? <button type="button" onClick={() => onPlayAsset(resolveMediaUrl(current.url), "environment", current.name, current.volume, 1)} className="inline-flex items-center gap-1 rounded-lg bg-[#2e7d32] px-2.5 py-2 text-xs font-black text-white"><Play className="h-3.5 w-3.5" />Nghe thử</button> : null}<input ref={(node) => { inputRefs.current[target.id] = node; }} type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4,audio/x-m4a" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadEnvironment(file, target.id); event.target.value = ""; }} /><button type="button" disabled={busyTarget === target.id} onClick={() => inputRefs.current[target.id]?.click()} className="inline-flex items-center gap-1 rounded-lg bg-[#c62828] px-2.5 py-2 text-xs font-black text-white disabled:opacity-60"><Upload className="h-3.5 w-3.5" />{busyTarget === target.id ? "Đang tải…" : personalCurrent ? "Thay file" : "Tải file"}</button></div></div></div>;
        })}
      </div>
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="audio-center-library" eyebrow="Audio Center" title="Thư viện asset đã tải lên" className="border-[#2e7d32]/20 bg-white/90">
      <p className="text-xs leading-5 text-[#35523a]">Kéo thả để đổi thứ tự phát. Mỗi asset có waveform, thời lượng, nhóm chủ đề và thao tác bật/tắt, đổi tên, nghe thử hoặc xóa mềm.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"><label className="relative lg:col-span-2"><Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[#6f5a53]" /><input value={audioSearch} onChange={(event) => setAudioSearch(event.target.value)} placeholder="Tìm theo tên, mô tả, nhóm, nhãn…" className="w-full rounded-xl border border-[#2e7d32]/20 bg-white py-2 pl-8 pr-3 text-xs outline-none focus:border-[#c62828]" aria-label="Tìm kiếm nâng cao thư viện audio" /></label><select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc nhóm audio"><option value="all">Tất cả nhóm</option>{groupOptions.map((group) => <option key={group} value={group}>{group}</option>)}</select><select value={audioSource} onChange={(event) => setAudioSource(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc nguồn audio"><option value="all">Tất cả nguồn</option><option value="user_upload">Người dùng tải lên</option><option value="built_in">Có sẵn</option><option value="admin">Quản trị</option></select><select value={audioStatus} onChange={(event) => setAudioStatus(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc trạng thái audio"><option value="all">Mọi trạng thái</option><option value="enabled">Đang bật</option><option value="disabled">Đang tắt</option></select><select value={audioTarget} onChange={(event) => setAudioTarget(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc mục tiêu audio"><option value="all">Mọi mục tiêu</option>{environmentTargets.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}</select><select value={audioTag} onChange={(event) => setAudioTag(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc nhãn audio"><option value="all">Mọi nhãn</option>{tagOptions.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select></div>      <div className="mt-2 rounded-xl border border-[#c62828]/15 bg-[#fff8f5] p-3"><div className="flex flex-wrap items-center justify-between gap-2"><b className="text-[11px] font-black text-[#7f1d1d]">Preset tốc độ theo loại tệp</b><select value={speedPresetCategory} onChange={(event) => changeSpeedPresetCategory(event.target.value as (typeof speedPresetCategories)[number])} className="rounded-lg border border-[#c62828]/20 bg-white px-2 py-1 text-[10px]" aria-label="Chọn loại tệp để chỉnh preset tốc độ">{speedPresetCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></div><div className="mt-2 flex flex-wrap items-center gap-2">{([0.5, 1, 1.5, 2] as PreviewRate[]).map((rate) => <label key={rate} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#35523a]"><input type="checkbox" checked={speedPresetDraft.includes(rate)} onChange={() => toggleSpeedPreset(rate)} />{rate}x</label>)}<button type="button" onClick={saveSpeedPreset} className="rounded-lg bg-[#2e7d32] px-2 py-1 text-[10px] font-black text-white">Lưu preset</button><button type="button" onClick={resetSpeedPreset} className="rounded-lg border border-[#c62828]/20 bg-white px-2 py-1 text-[10px] font-black text-[#c62828]">Khôi phục</button></div></div><div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#5a6d5d]"><span><Search className="mr-1 inline h-3.5 w-3.5" />{libraryAssets.length} asset phù hợp</span><label className="inline-flex items-center gap-1.5">Tốc độ nghe thử<select value={useTypeSpeedPreset ? "auto" : String(previewRate)} onChange={(event) => { if (event.target.value === "auto") setUseTypeSpeedPreset(true); else { setUseTypeSpeedPreset(false); setPreviewRate(Number(event.target.value) as PreviewRate); } }} className="rounded-lg border border-[#2e7d32]/20 bg-white px-2 py-1 text-[10px]" aria-label="Tốc độ phát waveform preview"><option value="auto">Tự động theo loại tệp</option><option value="0.5">0.5x</option><option value="1">1x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></label><span><GripVertical className="mr-1 inline h-3.5 w-3.5" />Thứ tự phát được lưu tự động</span></div>
      <div className="mt-3 rounded-xl border border-[#c62828]/15 bg-[#fff8f5] p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><b className="text-xs text-[#7f1d1d]">Preset nhóm âm thanh</b><p className="mt-1 text-[11px] text-[#5a6d5d]">Lưu các tệp cùng chủ đề để bật hoặc tắt cả nhóm trong một lần nhấn.</p></div>{groupOptions.length ? <div className="flex flex-wrap gap-1">{groupOptions.map((group) => <button key={group} type="button" onClick={() => saveGroupPreset(group)} className="rounded-lg border border-[#c62828]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#c62828]">Lưu “{group}”</button>)}</div> : null}</div>{audioGroupPresets.length ? <div className="mt-2 grid gap-2 sm:grid-cols-2">{audioGroupPresets.map((preset) => <div key={preset.id} className="flex items-center justify-between gap-2 rounded-lg border border-[#2e7d32]/15 bg-white p-2"><div className="min-w-0"><b className="block truncate text-[11px] text-[#25582c]">{preset.name}</b><span className="text-[10px] text-[#5a6d5d]">{preset.audioAssetIds.length} tệp · {preset.enabled ? "đang bật" : "đang tắt"}</span></div><div className="flex shrink-0 gap-1"><button type="button" onClick={() => applyGroupPreset(preset, !preset.enabled)} className="rounded-md bg-[#2e7d32] px-2 py-1 text-[10px] font-black text-white">{preset.enabled ? "Tắt nhóm" : "Bật nhóm"}</button><button type="button" onClick={() => deleteGroupPreset(preset)} className="rounded-md border border-[#c62828]/20 px-2 py-1 text-[10px] font-black text-[#c62828]">Xóa</button></div></div>)}</div> : <p className="mt-2 text-[10px] text-[#5a6d5d]">Chưa có preset nhóm. Hãy gán nhóm cho asset rồi lưu preset.</p>}</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#2e7d32]/15 bg-[#f8fff8] p-2.5"><label className="inline-flex items-center gap-2 text-xs font-black text-[#25582c]"><input type="checkbox" checked={visibleLibraryAssets.length > 0 && visibleLibraryAssets.every((asset) => selectedAssetIds.includes(asset.id))} onChange={toggleSelectAllVisible} />Chọn tất cả tệp đang hiển thị</label>{selectedVisibleAssets.length ? <div className="flex flex-wrap items-center gap-1.5"><span className="text-[11px] font-bold text-[#5a6d5d]">Đã chọn {selectedVisibleAssets.length}</span><button type="button" onClick={bulkMoveAssets} className="rounded-lg border border-[#2e7d32]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#2e7d32]">Chuyển nhóm</button><button type="button" onClick={bulkTagAssets} className="rounded-lg border border-[#2e7d32]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#2e7d32]">Gắn nhãn</button><button type="button" onClick={bulkSoftDeleteAssets} className="rounded-lg border border-[#c62828]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#c62828]">Xóa đã chọn</button><button type="button" onClick={() => setSelectedAssetIds([])} className="rounded-lg border border-[#5a6d5d]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#5a6d5d]">Bỏ chọn</button></div> : null}</div>
      <div className="mt-3 grid gap-2">{libraryAssets.filter((asset) => asset.category === "background").length ? libraryAssets.filter((asset) => asset.category === "background").map((asset) => <div key={asset.id} draggable onDragStart={() => setDraggedAssetId(asset.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedAssetId) reorderAssets(draggedAssetId, asset.id); setDraggedAssetId(null); }} onDragEnd={() => setDraggedAssetId(null)} className={`rounded-xl border bg-[#f8fff8] p-3 transition ${draggedAssetId === asset.id ? "border-[#c62828] opacity-60" : "border-[#2e7d32]/15"}`}><div className="flex items-start gap-3"><input type="checkbox" checked={selectedAssetIds.includes(asset.id)} onChange={() => toggleAssetSelection(asset.id)} aria-label={`Chọn ${asset.name}`} className="mt-2" /><button type="button" className="mt-1 cursor-grab text-[#5a6d5d]" aria-label={`Kéo ${asset.name}`}><GripVertical className="h-5 w-5" /></button><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><b className="block truncate text-xs text-[#25582c]">{asset.name}</b><span className="mt-1 block text-[11px] text-[#5a6d5d]">{environmentTargetLabel(asset.target)} · {asset.group ?? "Chưa nhóm"} · {asset.enabled ? "Đang bật" : "Đang tắt"}</span><div className="mt-1">{healthBadge(asset)}</div></div><span className="shrink-0 rounded-full bg-[#fff1e9] px-2 py-1 text-[10px] font-black text-[#7f1d1d]">{formatDuration(asset.durationSeconds)}</span></div><div className="mt-2"><Waveform values={asset.waveform} currentTime={playbackStatus.environment.url === asset.url ? playbackStatus.environment.currentTime : 0} duration={playbackStatus.environment.url === asset.url ? playbackStatus.environment.duration ?? asset.durationSeconds : asset.durationSeconds} onSeek={playbackStatus.environment.url === asset.url ? onSeekPlayback : undefined} onPlay={() => onPlayAsset(asset.url, "environment", asset.name, asset.volume, previewRateFor(asset))} label={asset.name} /></div><div className="mt-2 flex flex-wrap gap-1"><button type="button" onClick={() => onPlayAsset(asset.url, "environment", asset.name, asset.volume, previewRateFor(asset))} className="inline-flex items-center gap-1 rounded-lg bg-[#2e7d32] px-2 py-1.5 text-[10px] font-black text-white" aria-label={`Nghe thử ${asset.name}`}><Play className="h-3 w-3" />Nghe thử</button><button type="button" onClick={() => patchAsset(asset.id, { enabled: !asset.enabled }, `${asset.enabled ? "Đã tắt" : "Đã bật"} “${asset.name}”.`)} className="inline-flex items-center gap-1 rounded-lg border border-[#2e7d32]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#2e7d32]" aria-label={asset.enabled ? `Tắt ${asset.name}` : `Bật ${asset.name}`}><Volume2 className="h-3 w-3" />{asset.enabled ? "Tắt" : "Bật"}</button><button type="button" onClick={() => assignGroup(asset)} className="inline-flex items-center gap-1 rounded-lg border border-[#2e7d32]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#2e7d32]"><Layers3 className="h-3 w-3" />Nhóm</button><button type="button" onClick={() => renameAsset(asset)} className="rounded-lg border border-[#c62828]/20 bg-white px-2 py-1.5 text-[10px] font-black text-[#c62828]">Đổi tên</button><button type="button" onClick={() => softDeleteAsset(asset)} className="rounded-lg border border-[#c62828]/20 bg-white p-1.5 text-[#c62828]" aria-label={`Xóa mềm ${asset.name}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div></div></div>) : <div className="rounded-xl border border-dashed border-[#2e7d32]/20 p-4 text-center text-xs text-[#5a6d5d]">Chưa có asset môi trường nào phù hợp.</div>}</div>
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="audio-center-trash" eyebrow="Audio Center" title={`Thùng rác audio (${trash.length})`} className="border-[#c62828]/20 bg-white/90">
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs leading-5 text-[#35523a]">Asset trong thùng rác được giữ tối đa 30 ngày theo chính sách hồ sơ. Bạn có thể khôi phục hoặc xóa vĩnh viễn sau khi xác nhận.</p>{trash.length ? <div className="flex flex-wrap gap-2"><button type="button" onClick={restoreAllAssets} className="inline-flex items-center gap-1 rounded-lg bg-[#2e7d32] px-2.5 py-2 text-xs font-black text-white"><RotateCcw className="h-3.5 w-3.5" />Khôi phục tất cả</button><button type="button" onClick={permanentlyDeleteAllAssets} className="inline-flex items-center gap-1 rounded-lg border border-[#c62828]/25 bg-white px-2.5 py-2 text-xs font-black text-[#c62828]">Xóa vĩnh viễn tất cả</button></div> : null}</div>
      <div className="mt-3 grid gap-2">{trash.length ? trash.map((asset) => <div key={asset.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#c62828]/15 bg-[#fff8f5] p-3"><div className="min-w-0"><b className="block truncate text-xs text-[#7f1d1d]">{asset.name}</b><span className="mt-1 block text-[11px] text-[#5a6d5d]">Đã xóa {asset.deletedAt ? new Date(asset.deletedAt).toLocaleDateString("vi-VN") : ""} · {formatDuration(asset.durationSeconds)}</span></div><div className="flex shrink-0 flex-wrap justify-end gap-1"><button type="button" onClick={() => restoreAsset(asset)} className="inline-flex items-center gap-1 rounded-lg border border-[#2e7d32]/20 bg-white px-2.5 py-2 text-xs font-black text-[#2e7d32]"><RotateCcw className="h-3.5 w-3.5" />Khôi phục</button><button type="button" onClick={() => permanentlyDeleteAsset(asset)} className="rounded-lg border border-[#c62828]/20 bg-white px-2 py-2 text-[11px] font-black text-[#c62828]">Xóa vĩnh viễn</button></div></div>) : <div className="rounded-xl border border-dashed border-[#c62828]/20 p-4 text-center text-xs text-[#5a6d5d]">Thùng rác đang trống.</div>}</div>
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="audio-center-status" eyebrow="Audio Center" title="Trạng thái đang phát" className="border-[#2e7d32]/20 bg-white/90">
      <div className="grid gap-2 sm:grid-cols-3" aria-label="Trạng thái phát audio"><StatusCard label="Môi trường" status={playbackStatus.environment} onStop={() => onStopPlayback("environment")} /><StatusCard label="Nhạc nền" status={playbackStatus.music} onStop={() => onStopPlayback("music")} /><StatusCard label="Thoại" status={playbackStatus.voice} onStop={() => onStopPlayback("voice")} /></div>
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="audio-center-voice-filter" eyebrow="Audio Center" title="Lọc thư viện lời thoại" className="border-[#c62828]/20 bg-white/90">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><label className="relative"><Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[#6f5a53]" /><input value={voiceSearch} onChange={(event) => setVoiceSearch(event.target.value)} placeholder="Tìm lời thoại…" className="w-full rounded-xl border border-[#2e7d32]/20 bg-white py-2 pl-8 pr-3 text-xs outline-none focus:border-[#c62828]" aria-label="Tìm lời thoại" /></label><select value={voiceCategory} onChange={(event) => setVoiceCategory(event.target.value as (typeof voiceCategories)[number])} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc nguồn lời thoại"><option value="all">Tất cả nguồn</option><option value="lumi">Lumi</option><option value="ong">Ong</option><option value="member">Thành viên</option></select><select value={voiceEmotion} onChange={(event) => setVoiceEmotion(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc cảm xúc"><option value="all">Tất cả cảm xúc</option>{emotionOptions.map((emotion) => <option key={String(emotion)} value={String(emotion)}>{String(emotion)}</option>)}</select><select value={voiceEvent} onChange={(event) => setVoiceEvent(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc sự kiện"><option value="all">Tất cả sự kiện</option>{eventOptions.map((event) => <option key={event} value={event}>{event}</option>)}</select></div>
      <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#35523a]"><span><Filter className="mr-1 inline h-3.5 w-3.5" />{filteredVoices.length} bản thu phù hợp</span><span>Lọc theo nguồn · cảm xúc · sự kiện</span></div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">{filteredVoices.length ? filteredVoices.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#2e7d32]/15 bg-[#f8fff8] p-3"><div className="min-w-0"><b className="block truncate text-xs text-[#25582c]">{item.label} · {item.name}</b><span className="mt-1 block line-clamp-2 text-xs text-[#5a6d5d]">{item.text}</span><span className="mt-1 block text-[10px] text-[#7f1d1d]">{item.emotion ?? "chung"}{item.event ? ` · ${item.event}` : ""}</span></div>{item.url ? <button type="button" onClick={() => onPlayAsset(item.url!, "voice", `${item.label} · ${item.name}`, item.volume)} className="shrink-0 rounded-lg bg-[#2e7d32] p-2 text-white" aria-label={`Phát ${item.name}`}><Play className="h-3.5 w-3.5" /></button> : <span className="shrink-0 text-[10px] font-bold text-amber-700">Chưa có audio</span>}</div>) : <div className="rounded-xl border border-dashed border-[#2e7d32]/20 p-4 text-center text-xs text-[#5a6d5d]">Không có bản thu phù hợp với bộ lọc hiện tại.</div>}</div>
    </PersistentCollapsible>
    </> : null}
  </div>;
}

function StatusCard({ label, status, onStop }: { label: string; status: PlaybackStatus[AudioChannel]; onStop: () => void }) {
  const volume = Math.max(0, Math.min(100, Math.round(status.muted ? 0 : status.volume ?? 0)));
  return <div className={`rounded-xl border p-3 ${status.active ? "border-[#2e7d32]/30 bg-[#eff9ef]" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-black text-[#35523a]">{label}</span>{status.active ? <Radio className="h-4 w-4 animate-pulse text-[#2e7d32]" /> : <Volume2 className="h-4 w-4 text-slate-300" />}</div><p className="mt-2 truncate text-xs font-bold text-[#25582c]">{status.active ? status.label : "Đang dừng"}</p><p className="mt-1 text-[11px] font-bold text-[#5a6d5d]" aria-label={`Âm lượng ${label}`}>{status.active ? `Âm lượng: ${volume}%${status.muted ? " · Đã tắt tiếng" : ""}` : "Âm lượng: —"}</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" role="meter" aria-label={`Mức âm lượng ${label}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={status.active ? volume : 0}><div className={`h-full rounded-full transition-[width] duration-200 ${status.muted ? "bg-slate-400" : "bg-[#2e7d32]"}`} style={{ width: `${status.active ? volume : 0}%` }} /></div>{status.active ? <button type="button" onClick={onStop} className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#c62828]/20 bg-white px-2 py-1 text-[11px] font-black text-[#c62828]"><Pause className="h-3 w-3" />Dừng</button> : <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-400"><CheckCircle2 className="h-3 w-3" />Sẵn sàng</span>}</div>;
}

export type { AudioChannel, PlaybackStatus };
