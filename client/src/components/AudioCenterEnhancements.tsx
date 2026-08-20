import { CheckCircle2, Filter, Pause, Play, Radio, Search, Upload, Volume2 } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import type { MascotVoiceLine, PersonalAudioAsset, ProfileState } from "../../../shared/study";
import { trpc } from "../lib/trpc";
import { PersistentCollapsible } from "./PersistentCollapsible";

type AudioChannel = "environment" | "music" | "voice";
type PlaybackStatus = Record<AudioChannel, { active: boolean; label: string }>;
type Props = {
  profile: ProfileState;
  onProfile: (profile: ProfileState, message?: string) => void;
  voiceLines: MascotVoiceLine[];
  playbackStatus: PlaybackStatus;
  onPlayAsset: (url: string, channel: AudioChannel, label: string, volume?: number) => void;
  onStopPlayback: (channel?: AudioChannel) => void;
};

type AcceptedAudioMime = "audio/webm" | "audio/ogg" | "audio/wav" | "audio/mpeg" | "audio/mp4" | "audio/x-m4a";
const acceptedMime: AcceptedAudioMime[] = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp4", "audio/x-m4a"];
const environmentTargets = [
  { id: "rain", label: "Mưa rơi" },
  { id: "book", label: "Lật sách" },
] as const;
const voiceCategories = ["all", "lumi", "ong", "member"] as const;

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

export function AudioCenterEnhancements({ profile, onProfile, voiceLines, playbackStatus, onPlayAsset, onStopPlayback }: Props) {
  const upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [voiceSearch, setVoiceSearch] = useState("");
  const [voiceCategory, setVoiceCategory] = useState<(typeof voiceCategories)[number]>("all");
  const [voiceEmotion, setVoiceEmotion] = useState("all");
  const [voiceEvent, setVoiceEvent] = useState("all");
  const [busyTarget, setBusyTarget] = useState<string | null>(null);
  const assets = profile.personalAudioAssets ?? [];

  const emotionOptions = useMemo(() => Array.from(new Set([
    ...voiceLines.map((item) => item.emotion).filter(Boolean),
    ...assets.filter((item) => ["lumi", "ong", "member"].includes(item.category)).map((item) => item.target).filter((target) => target !== "general"),
  ])).sort((a, b) => String(a).localeCompare(String(b), "vi")), [assets, voiceLines]);
  const eventOptions = useMemo(() => Array.from(new Set(voiceLines.map((item) => item.state).filter(Boolean))).sort((a, b) => a.localeCompare(b, "vi")), [voiceLines]);

  const filteredVoices = useMemo(() => {
    const normalizedQuery = voiceSearch.trim().toLocaleLowerCase("vi-VN");
    const personal = assets.filter((asset) => ["lumi", "ong", "member"].includes(asset.category) && asset.enabled).map((asset) => ({
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
  }, [assets, voiceCategory, voiceEmotion, voiceEvent, voiceLines, voiceSearch]);

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
      const hasDefault = assets.some((asset) => asset.category === category && asset.target === target && asset.isDefault);
      const nextAsset: PersonalAudioAsset = { id: createId(), name: file.name.replace(/\.[^.]+$/, "").slice(0, 100), description: `Âm thanh môi trường · ${target}`, tags: ["environment", target], url: result.url, source: "user_upload", category, target, enabled: true, isDefault: !hasDefault, volume: 70, createdAt: now, updatedAt: now };
      onProfile({ ...profile, personalAudioAssets: [...assets, nextAsset] }, `Đã tải “${nextAsset.name}” vào Audio Center cho ${target === "rain" ? "mưa rơi" : "lật sách"}.`);
    } catch (error) { onProfile(profile, error instanceof Error ? error.message : "Không thể tải âm thanh môi trường."); }
    finally { setBusyTarget(null); }
  }

  return <div className="relative z-10 mt-4 grid gap-3">
    <PersistentCollapsible storageKey="audio-center-upload" eyebrow="Audio Center" title="Tải âm thanh môi trường thật" className="border-[#c62828]/20 bg-white/90">
      <p className="text-xs leading-5 text-[#35523a]">Thêm bản thu sạch cho mưa rơi hoặc lật sách. Hệ thống chỉ lưu MP3/WAV/OGG/WEBM/M4A vào storage, không tạo âm tổng hợp.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {environmentTargets.map((target) => {
          const current = assets.find((asset) => asset.enabled && asset.category === "background" && asset.target === target.id);
          return <div key={target.id} className="rounded-xl border border-[#2e7d32]/15 bg-[#f8fff8] p-3"><div className="flex items-center justify-between gap-2"><div><b className="text-sm text-[#25582c]">{target.label}</b><span className="mt-1 block text-[11px] text-[#5a6d5d]">{current ? `Đang dùng: ${current.name}` : "Chưa có bản thu thật"}</span></div><input ref={(node) => { inputRefs.current[target.id] = node; }} type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4,audio/x-m4a" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadEnvironment(file, target.id); event.target.value = ""; }} /><button type="button" disabled={busyTarget === target.id} onClick={() => inputRefs.current[target.id]?.click()} className="inline-flex items-center gap-1 rounded-lg bg-[#c62828] px-2.5 py-2 text-xs font-black text-white disabled:opacity-60"><Upload className="h-3.5 w-3.5" />{busyTarget === target.id ? "Đang tải…" : "Tải file"}</button></div></div>;
        })}
      </div>
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="audio-center-status" eyebrow="Audio Center" title="Trạng thái đang phát" className="border-[#2e7d32]/20 bg-white/90">
      <div className="grid gap-2 sm:grid-cols-3" aria-label="Trạng thái phát audio"><StatusCard label="Môi trường" status={playbackStatus.environment} onStop={() => onStopPlayback("environment")} /><StatusCard label="Nhạc nền" status={playbackStatus.music} onStop={() => onStopPlayback("music")} /><StatusCard label="Thoại" status={playbackStatus.voice} onStop={() => onStopPlayback("voice")} /></div>
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="audio-center-voice-filter" eyebrow="Audio Center" title="Lọc thư viện lời thoại" className="border-[#c62828]/20 bg-white/90">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><label className="relative"><Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[#6f5a53]" /><input value={voiceSearch} onChange={(event) => setVoiceSearch(event.target.value)} placeholder="Tìm lời thoại…" className="w-full rounded-xl border border-[#2e7d32]/20 bg-white py-2 pl-8 pr-3 text-xs outline-none focus:border-[#c62828]" aria-label="Tìm lời thoại" /></label><select value={voiceCategory} onChange={(event) => setVoiceCategory(event.target.value as (typeof voiceCategories)[number])} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc nguồn lời thoại"><option value="all">Tất cả nguồn</option><option value="lumi">Lumi</option><option value="ong">Ong</option><option value="member">Thành viên</option></select><select value={voiceEmotion} onChange={(event) => setVoiceEmotion(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc cảm xúc"><option value="all">Tất cả cảm xúc</option>{emotionOptions.map((emotion) => <option key={String(emotion)} value={String(emotion)}>{String(emotion)}</option>)}</select><select value={voiceEvent} onChange={(event) => setVoiceEvent(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-xs" aria-label="Lọc sự kiện"><option value="all">Tất cả sự kiện</option>{eventOptions.map((event) => <option key={event} value={event}>{event}</option>)}</select></div>
      <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#35523a]"><span><Filter className="mr-1 inline h-3.5 w-3.5" />{filteredVoices.length} bản thu phù hợp</span><span>Lọc theo nguồn · cảm xúc · sự kiện</span></div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">{filteredVoices.length ? filteredVoices.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#2e7d32]/15 bg-[#f8fff8] p-3"><div className="min-w-0"><b className="block truncate text-xs text-[#25582c]">{item.label} · {item.name}</b><span className="mt-1 block line-clamp-2 text-xs text-[#5a6d5d]">{item.text}</span><span className="mt-1 block text-[10px] text-[#7f1d1d]">{item.emotion ?? "chung"}{item.event ? ` · ${item.event}` : ""}</span></div>{item.url ? <button type="button" onClick={() => onPlayAsset(item.url!, "voice", `${item.label} · ${item.name}`, item.volume)} className="shrink-0 rounded-lg bg-[#2e7d32] p-2 text-white" aria-label={`Phát ${item.name}`}><Play className="h-3.5 w-3.5" /></button> : <span className="shrink-0 text-[10px] font-bold text-amber-700">Chưa có audio</span>}</div>) : <div className="rounded-xl border border-dashed border-[#2e7d32]/20 p-4 text-center text-xs text-[#5a6d5d]">Không có bản thu phù hợp với bộ lọc hiện tại.</div>}</div>
    </PersistentCollapsible>
  </div>;
}

function StatusCard({ label, status, onStop }: { label: string; status: PlaybackStatus[AudioChannel]; onStop: () => void }) {
  return <div className={`rounded-xl border p-3 ${status.active ? "border-[#2e7d32]/30 bg-[#eff9ef]" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-black text-[#35523a]">{label}</span>{status.active ? <Radio className="h-4 w-4 animate-pulse text-[#2e7d32]" /> : <Volume2 className="h-4 w-4 text-slate-300" />}</div><p className="mt-2 truncate text-xs font-bold text-[#25582c]">{status.active ? status.label : "Đang dừng"}</p>{status.active ? <button type="button" onClick={onStop} className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#c62828]/20 bg-white px-2 py-1 text-[11px] font-black text-[#c62828]"><Pause className="h-3 w-3" />Dừng</button> : <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-400"><CheckCircle2 className="h-3 w-3" />Sẵn sàng</span>}</div>;
}

export type { AudioChannel, PlaybackStatus };
