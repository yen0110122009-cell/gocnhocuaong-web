import { Music2, Pause, Play, Plus, SlidersHorizontal, Sparkles, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { AmbientScenePreference, EmotionThemeId, PersonalAudioAsset, PersonalAudioCategory, PersonalStudyPreset, ProfileState } from "../../../shared/study";
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

export function PersonalStudySpaceControls({ profile, emotion, onEmotion, onProfile }: Props) {
  const upload = trpc.study.profile.uploadCompanionMedia.useMutation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<PersonalAudioCategory>("background");
  const [target, setTarget] = useState("general");
  const [presetName, setPresetName] = useState("");
  const [previewing, setPreviewing] = useState<string | null>(null);
  const assets = profile.personalAudioAssets ?? [];
  const presets = profile.personalStudyPresets ?? [];
  const enabledAssets = useMemo(() => assets.filter((asset) => asset.enabled), [assets]);

  function saveAssets(next: PersonalAudioAsset[], message?: string) { onProfile({ ...profile, personalAudioAssets: next }, message); }
  function savePresets(next: PersonalStudyPreset[], message?: string) { onProfile({ ...profile, personalStudyPresets: next }, message); }
  function createId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
  function addAsset(nextUrl: string, source: PersonalAudioAsset["source"], fileName?: string) {
    const safeUrl = nextUrl.trim();
    if (!name.trim() || !safeUrl) return onProfile(profile, "Hãy nhập tên và chọn tệp hoặc URL âm thanh hợp lệ.");
    if (source === "external_url" && !/^https:\/\//.test(safeUrl)) return onProfile(profile, "URL âm thanh cần bắt đầu bằng https://.");
    const now = new Date().toISOString();
    saveAssets([...assets, { id: createId("personal-audio"), name: name.trim().slice(0, 100), description: fileName, url: safeUrl, source, category, target: target.trim().slice(0, 80) || "general", enabled: true, volume: 70, createdAt: now, updatedAt: now }], "Đã thêm âm thanh vào thư viện cá nhân.");
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
  function updateAsset(id: string, patch: Partial<PersonalAudioAsset>) { saveAssets(assets.map((asset) => asset.id === id ? { ...asset, ...patch, updatedAt: new Date().toISOString() } : asset)); }
  function createPreset() {
    if (!presetName.trim()) return onProfile(profile, "Hãy đặt tên cho preset trước khi lưu.");
    const now = new Date().toISOString();
    const preset: PersonalStudyPreset = { id: createId("study-space"), name: presetName.trim().slice(0, 80), emotion, ambientScene: profile.defaultAmbientScene, audioAssetIds: enabledAssets.map((asset) => asset.id), companionMode: profile.companionMode ?? "both", focusMode: profile.focusMode === true, createdAt: now, updatedAt: now };
    savePresets([...presets, preset], "Đã lưu preset Không gian học cá nhân."); setPresetName("");
  }
  function applyPreset(preset: PersonalStudyPreset) {
    if (preset.emotion) onEmotion(preset.emotion);
    onProfile({ ...profile, activePersonalStudyPresetId: preset.id, defaultAmbientScene: preset.ambientScene ?? profile.defaultAmbientScene, companionMode: preset.companionMode, focusMode: preset.focusMode, showLumi: preset.companionMode === "lumi" || preset.companionMode === "both", showMascot: preset.companionMode === "ong" || preset.companionMode === "both" }, `Đã áp dụng preset “${preset.name}”.`);
  }
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
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-black text-[#7f1d1d]">Không gian học cá nhân</p><p className="mt-1 max-w-2xl text-xs leading-5 text-[#35523a]">Tạo bộ màu, cảnh, âm thanh và đồng hành riêng. Hệ thống chỉ phát tệp khi Ong chủ động nhấn nút nghe hoặc bắt đầu phiên học.</p></div><button type="button" onClick={randomMix} className="rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white"><Sparkles className="mr-1 inline h-3.5 w-3.5" />Mix ngẫu nhiên</button></div>
      <div className="grid gap-2 rounded-2xl border border-[#2e7d32]/15 bg-[#eff9ef] p-3 md:grid-cols-4"><label className="text-xs font-bold text-[#35523a]">Hiển thị bạn đồng hành<select value={profile.companionMode ?? "both"} onChange={(event) => { const mode = event.target.value as PersonalStudyPreset["companionMode"]; onProfile({ ...profile, companionMode: mode, showLumi: mode === "lumi" || mode === "both", showMascot: mode === "ong" || mode === "both" }); }} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2"><option value="both">Lumi và Ong</option><option value="lumi">Chỉ Lumi</option><option value="ong">Chỉ Ong</option><option value="hidden">Ẩn cả hai</option></select></label><label className="text-xs font-bold text-[#35523a]">Cảnh nền<select value={profile.defaultAmbientScene ?? "morning"} onChange={(event) => onProfile({ ...profile, defaultAmbientScene: event.target.value as AmbientScenePreference })} className="mt-1 w-full rounded-lg border border-[#2e7d32]/20 bg-white p-2">{scenes.map((scene) => <option key={scene.id} value={scene.id}>{scene.label}</option>)}</select></label><label className="flex items-center gap-2 pt-5 text-xs font-bold text-[#35523a]"><input type="checkbox" checked={profile.focusMode === true} onChange={(event) => onProfile({ ...profile, focusMode: event.target.checked })} />Chế độ tập trung</label><label className="flex items-center gap-2 pt-5 text-xs font-bold text-[#35523a]"><input type="checkbox" checked={profile.autoNightMode === true} onChange={(event) => onProfile({ ...profile, autoNightMode: event.target.checked })} />Tự động ban đêm</label></div>
      <div className="rounded-2xl border border-[#c62828]/15 bg-[#fff7f2] p-3"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">Thêm âm thanh của tôi</p><div className="mt-2 grid gap-2 md:grid-cols-4"><input value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="Tên âm thanh" /><select value={category} onChange={(event) => setCategory(event.target.value as PersonalAudioCategory)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm">{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><input value={target} onChange={(event) => setTarget(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="Ví dụ: bắt đầu, mưa" /><input value={url} onChange={(event) => setUrl(event.target.value)} className="rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="https://…" /></div><div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => addAsset(url, "external_url")} className="rounded-xl border border-[#c62828]/25 bg-white px-3 py-2 text-xs font-black text-[#c62828]"><Plus className="mr-1 inline h-3.5 w-3.5" />Thêm URL</button><input ref={inputRef} type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4,audio/x-m4a,.m4a" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file); event.target.value = ""; }} /><button type="button" disabled={upload.isPending} onClick={() => inputRef.current?.click()} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white disabled:opacity-60"><Upload className="mr-1 inline h-3.5 w-3.5" />{upload.isPending ? "Đang tải…" : "Tải tệp MP3/WAV/OGG/M4A"}</button></div></div>
      <div className="grid gap-2 md:grid-cols-2">{assets.length ? assets.map((asset) => <article key={asset.id} className="rounded-2xl border border-[#2e7d32]/15 bg-white p-3"><div className="flex justify-between gap-2"><div><p className="font-black text-[#35523a]">{asset.name}</p><p className="mt-1 text-xs text-[#6f5a53]">{categories.find((item) => item.id === asset.category)?.label} · {asset.target}</p></div><button type="button" onClick={() => saveAssets(assets.filter((item) => item.id !== asset.id), "Đã xóa âm thanh khỏi thư viện cá nhân.")} className="rounded-lg p-2 text-[#c62828]" aria-label={`Xóa ${asset.name}`}><Trash2 className="h-4 w-4" /></button></div><div className="mt-3 flex flex-wrap items-center gap-3"><button type="button" onClick={() => preview(asset)} className="rounded-lg bg-[#eff9ef] px-2.5 py-1.5 text-xs font-black text-[#2e7d32]">{previewing === asset.id ? <><Pause className="mr-1 inline h-3.5 w-3.5" />Dừng</> : <><Play className="mr-1 inline h-3.5 w-3.5" />Nghe thử</>}</button><label className="flex items-center gap-1 text-xs font-bold text-[#35523a]"><input type="checkbox" checked={asset.enabled} onChange={(event) => updateAsset(asset.id, { enabled: event.target.checked })} />Dùng</label><label className="ml-auto flex items-center gap-2 text-xs font-bold text-[#35523a]"><SlidersHorizontal className="h-3.5 w-3.5" />{asset.volume}%<input type="range" min="0" max="100" value={asset.volume} onChange={(event) => updateAsset(asset.id, { volume: Number(event.target.value) })} className="w-20 accent-[#c62828]" /></label></div></article>) : <p className="rounded-xl border border-dashed border-[#2e7d32]/25 p-4 text-sm text-[#35523a]">Chưa có âm thanh cá nhân. Ong có thể tải bản thu của mình hoặc thêm một URL HTTPS hợp lệ.</p>}</div>
      <div className="rounded-2xl border border-[#2e7d32]/15 bg-[#eff9ef] p-3"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Preset của tôi</p><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input value={presetName} onChange={(event) => setPresetName(event.target.value)} className="flex-1 rounded-xl border border-[#2e7d32]/20 bg-white px-3 py-2 text-sm" placeholder="Ví dụ: Đêm học yên tĩnh" /><button type="button" onClick={createPreset} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white"><Plus className="mr-1 inline h-3.5 w-3.5" />Lưu preset</button></div><div className="mt-2 flex flex-wrap gap-2">{presets.map((preset) => <div key={preset.id} className="flex items-center gap-1 rounded-xl bg-white p-1"><button type="button" onClick={() => applyPreset(preset)} className="px-2 py-1.5 text-xs font-black text-[#35523a]"><Music2 className="mr-1 inline h-3.5 w-3.5" />{preset.name}</button><button type="button" onClick={() => savePresets(presets.filter((item) => item.id !== preset.id), "Đã xóa preset cá nhân.")} className="rounded-lg p-1.5 text-[#c62828]" aria-label={`Xóa preset ${preset.name}`}><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div></div>
    </section>
  </PersistentCollapsible>;
}
