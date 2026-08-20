import {
  BookOpen,
  ChevronDown,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSun,
  Laptop,
  LampDesk,
  MoonStar,
  PanelTop,
  Play,
  RotateCcw,
  Sparkles,
  SunMedium,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type {
  ProfileState,
  StudyCornerAdaptiveEmotion,
  StudyCornerColorProfile,
  StudyCornerEnvironment,
  StudyCornerSeason,
  StudyCornerWeather,
} from "../../../shared/study";
import { DEFAULT_STUDY_CORNER_ENVIRONMENT as DEFAULT_ENV } from "../../../shared/study";

type LightMode = "day" | "sunset" | "night";

type CornerSettings = {
  lightMode: LightMode;
  lampOn: boolean;
  lampIntensity: number;
  windowOpen: boolean;
  curtainOpen: boolean;
  laptopOpen: boolean;
  bookOpen: boolean;
  ambientEnabled: boolean;
  ambientVolume: number;
};

type Props = { profile: ProfileState; onProfile?: (profile: ProfileState, message?: string) => void };

type Choice<T extends string> = { id: T; label: string; icon?: string; description?: string };

const SETTINGS_KEY = "gocnhocuaong-study-corner-v1";
const PANELS_KEY = "gocnhocuaong-study-corner-panels-v1";
const defaultSettings: CornerSettings = { lightMode: "day", lampOn: false, lampIntensity: 62, windowOpen: true, curtainOpen: true, laptopOpen: true, bookOpen: true, ambientEnabled: false, ambientVolume: 35 };

const seasons: Choice<StudyCornerSeason>[] = [
  { id: "spring", label: "Mùa xuân", icon: "🌸", description: "Tươi mới, trong trẻo" },
  { id: "summer", label: "Mùa hè", icon: "☀️", description: "Sáng, năng lượng" },
  { id: "autumn", label: "Mùa thu", icon: "🍂", description: "Ấm, trầm, tập trung" },
  { id: "winter", label: "Mùa đông", icon: "❄️", description: "Yên tĩnh, sâu" },
];
const weathers: Choice<StudyCornerWeather>[] = [
  { id: "sunny", label: "Nắng", icon: "☀️" },
  { id: "partlyCloudy", label: "Có mây", icon: "🌤️" },
  { id: "cloudy", label: "Nhiều mây", icon: "☁️" },
  { id: "rain", label: "Mưa", icon: "🌧️" },
  { id: "storm", label: "Mưa lớn", icon: "⛈️" },
  { id: "fog", label: "Sương mù", icon: "🌫️" },
  { id: "snow", label: "Tuyết", icon: "❄️" },
];
const emotions: Choice<StudyCornerAdaptiveEmotion>[] = [
  { id: "neutral", label: "Bình thường", icon: "◌" },
  { id: "calm", label: "Bình yên", icon: "😌" },
  { id: "happy", label: "Vui vẻ", icon: "😊" },
  { id: "motivated", label: "Có động lực", icon: "🔥" },
  { id: "focused", label: "Tập trung", icon: "🧠" },
  { id: "sad", label: "Buồn", icon: "😔" },
  { id: "tired", label: "Mệt", icon: "😴" },
  { id: "relaxed", label: "Cần thư giãn", icon: "🌱" },
  { id: "energetic", label: "Cần năng lượng", icon: "⚡" },
];
const lightModes: Array<{ id: LightMode; label: string; icon: typeof SunMedium; description: string }> = [
  { id: "day", label: "Ban ngày", icon: SunMedium, description: "Ánh sáng tự nhiên dịu và rõ." },
  { id: "sunset", label: "Chiều", icon: Sparkles, description: "Nắng ấm, mềm hơn cho buổi học." },
  { id: "night", label: "Ban đêm", icon: MoonStar, description: "Phòng tối, tập trung vào mặt bàn." },
];

const presets = [
  { id: "rainy-study", label: "Rainy Study", icon: "🌧️", description: "Mưa + tối + vàng ấm", season: "winter", weather: "rain", emotion: "calm", lightOverride: "night", colorProfile: "winter" },
  { id: "fresh-morning", label: "Fresh Morning", icon: "☀️", description: "Sáng + nắng + chim", season: "summer", weather: "sunny", emotion: "happy", lightOverride: "day", colorProfile: "summer" },
  { id: "autumn-focus", label: "Autumn Focus", icon: "🍂", description: "Thu + chiều + gió nhẹ", season: "autumn", weather: "partlyCloudy", emotion: "focused", lightOverride: "sunset", colorProfile: "autumn" },
  { id: "midnight-calm", label: "Midnight Calm", icon: "🌙", description: "Tối + đèn vàng + phòng yên", season: "winter", weather: "cloudy", emotion: "calm", lightOverride: "night", colorProfile: "winter" },
  { id: "nature-focus", label: "Nature Focus", icon: "🌿", description: "Thiên nhiên + xanh nhẹ", season: "spring", weather: "sunny", emotion: "focused", lightOverride: "day", colorProfile: "spring" },
  { id: "motivation", label: "Motivation", icon: "🔥", description: "Ấm + cam nhẹ + năng lượng", season: "summer", weather: "partlyCloudy", emotion: "motivated", lightOverride: "sunset", colorProfile: "motivated" },
] as const;

const colorProfiles: Record<string, Record<string, string>> = {
  spring: { primary: "#f4d7d7", secondary: "#dce8d5", accent: "#d18b45", glow: "#ffe6a8", ambience: "#eef7e9" },
  summer: { primary: "#f6e6b4", secondary: "#d8eaf2", accent: "#d98235", glow: "#ffe08a", ambience: "#eaf5fb" },
  autumn: { primary: "#d99a68", secondary: "#e8d5b5", accent: "#a85d35", glow: "#f8c477", ambience: "#f4e4d0" },
  winter: { primary: "#dde5ea", secondary: "#f2e9d8", accent: "#9b6a43", glow: "#f8d998", ambience: "#e9eef0" },
  calm: { primary: "#e7e4da", secondary: "#dce5e5", accent: "#aa8967", glow: "#ffe5a8", ambience: "#eef1ed" },
  happy: { primary: "#f6e4ac", secondary: "#f3d4b9", accent: "#d78639", glow: "#ffdf77", ambience: "#fff5d5" },
  motivated: { primary: "#edc2a8", secondary: "#f3ddb0", accent: "#b65a35", glow: "#ffd06d", ambience: "#fff0d0" },
  focused: { primary: "#cbdce3", secondary: "#e8eee9", accent: "#587785", glow: "#d9f0e8", ambience: "#eaf1f2" },
  sad: { primary: "#cdd7df", secondary: "#e4dfea", accent: "#6d7189", glow: "#d9d4e8", ambience: "#e7ebef" },
  tired: { primary: "#e6d8c5", secondary: "#efe5d3", accent: "#967255", glow: "#f8db9b", ambience: "#f3eee5" },
};

const getStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(window.localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
};
const clamp = (value: number) => Math.max(0, Math.min(100, value));
const autoSeason = (): StudyCornerSeason => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};
const autoLight = (): LightMode => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 16 ? "day" : hour < 19 ? "sunset" : "night";
};
function readCornerSettings(): CornerSettings {
  const raw = getStored<Partial<CornerSettings>>(SETTINGS_KEY, {});
  return { ...defaultSettings, ...raw, lightMode: raw.lightMode === "sunset" || raw.lightMode === "night" ? raw.lightMode : "day", lampIntensity: clamp(Number(raw.lampIntensity) || 62), ambientVolume: clamp(Number(raw.ambientVolume) || 35) };
}

function EnvironmentPanel({ title, children, open, onToggle }: { title: string; children: React.ReactNode; open: boolean; onToggle: () => void }) {
  return <div className="study-corner-panel">
    <button type="button" className="study-corner-panel-heading" onClick={onToggle} aria-expanded={open}><span>{title}</span><ChevronDown className={open ? "rotate-180" : ""} /></button>
    {open && <div className="study-corner-panel-body">{children}</div>}
  </div>;
}

export function StudyCorner({ profile, onProfile }: Props) {
  const [settings, setSettings] = useState<CornerSettings>(() => ({ ...readCornerSettings(), ...(profile.studyCornerSettings ?? {}) }));
  const [environment, setEnvironment] = useState<StudyCornerEnvironment>(() => ({ ...DEFAULT_ENV, ...(profile.studyCornerEnvironment ?? {}) }));
  const [panels, setPanels] = useState<Record<string, boolean>>(() => getStored(PANELS_KEY, { environment: true, presets: false, audio: false, accessibility: false }));
  const [lastAction, setLastAction] = useState("Góc học tập đang chờ Ong bắt đầu.");
  const [audioError, setAudioError] = useState(false);

  useEffect(() => { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { window.localStorage.setItem(PANELS_KEY, JSON.stringify(panels)); }, [panels]);
  useEffect(() => { if (profile.studyCornerEnvironment) setEnvironment({ ...DEFAULT_ENV, ...profile.studyCornerEnvironment }); }, [profile.studyCornerEnvironment]);

  const effectiveSeason = environment.mode === "auto" ? autoSeason() : environment.season;
  const effectiveWeather = environment.weather;
  const effectiveEmotion = environment.emotion;
  const effectiveLight = environment.lightOverride === "auto" ? autoLight() : environment.lightOverride;
  const selectedProfile = environment.colorProfile === "auto" ? effectiveEmotion !== "neutral" ? effectiveEmotion : effectiveSeason : environment.colorProfile;
  const palette = colorProfiles[selectedProfile] ?? colorProfiles.spring;
  const selectedScene = profile.defaultAmbientScene ?? "morning";
  const ambientAsset = useMemo(() => {
    const assets = (profile.personalAudioAssets ?? []).filter((asset) => asset.enabled && !asset.deletedAt && asset.category === "background");
    const targets = [effectiveWeather, effectiveSeason, selectedScene, "study-corner"];
    return assets.find((asset) => targets.includes(asset.target));
  }, [effectiveSeason, effectiveWeather, profile.personalAudioAssets, selectedScene]);
  const sceneClass = `study-corner--${effectiveLight} study-corner-season--${effectiveSeason} study-corner-weather--${effectiveWeather} study-corner-emotion--${effectiveEmotion}`;
  const style = { "--corner-primary": palette.primary, "--corner-secondary": palette.secondary, "--corner-accent": palette.accent, "--corner-glow": palette.glow, "--corner-ambience": palette.ambience, "--corner-sound-volume": environment.soundVolume / 100, "--corner-motion": environment.reduceMotion || !environment.effectsEnabled ? "0s" : "2.4s" } as CSSProperties;

  const setPanel = (id: string) => setPanels((current) => ({ ...current, [id]: !current[id] }));
  const commitEnvironment = (patch: Partial<StudyCornerEnvironment>, message: string) => {
    const next = { ...environment, ...patch };
    setEnvironment(next);
    setLastAction(message);
    onProfile?.({ ...profile, studyCornerEnvironment: next, studyCornerSettings: { ...(profile.studyCornerSettings ?? defaultSettings), lightMode: next.lightOverride === "auto" ? effectiveLight : next.lightOverride, ambientEnabled: next.soundEnabled, ambientVolume: next.soundVolume } }, message);
  };
  const updateSettings = (patch: Partial<CornerSettings>, message: string) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    setLastAction(message);
    onProfile?.({ ...profile, studyCornerSettings: next }, message);
  };
  const toggleObject = (patch: Partial<CornerSettings>, message: string) => updateSettings(patch, message);
  const applyPreset = (preset: typeof presets[number]) => commitEnvironment({ mode: "manual", season: preset.season, weather: preset.weather, emotion: preset.emotion, lightOverride: preset.lightOverride, colorProfile: preset.colorProfile, selectedPresetId: preset.id }, `Đã chuyển sang preset ${preset.label}.`);
  const resetEnvironment = () => commitEnvironment({ ...DEFAULT_ENV, mode: "auto" }, "Đã quay lại Auto Environment.");

  return <section id="study-corner" aria-label="Góc học tập" className="study-corner-shell" style={style}>
    <div className="study-corner-heading">
      <div><p className="study-corner-kicker">🏠 GÓC HỌC TẬP · MÔI TRƯỜNG THÍCH ỨNG</p><h1>Góc học tập của Ong</h1><p className="study-corner-lead">Thời gian, mùa, thời tiết, cảm xúc, màu sắc, âm thanh và ánh sáng cùng thay đổi nhẹ để mỗi lần trở lại bàn học có một sắc thái riêng.</p></div>
      <div className="study-corner-status" role="status"><span className="study-corner-status-dot" />{lastAction}</div>
    </div>

    <div className={`study-corner-scene ${sceneClass}`}>
      <div className="study-corner-weather-layer" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="study-corner-window" aria-label="Cửa sổ và rèm">
        <div className={`study-corner-sky ${settings.windowOpen ? "is-open" : "is-closed"}`}><span className="study-corner-sun" /></div>
        <div className={`study-corner-curtain ${settings.curtainOpen ? "is-open" : "is-closed"}`} />
        <button type="button" className="study-corner-hotspot hotspot-window" onClick={() => toggleObject({ windowOpen: !settings.windowOpen }, settings.windowOpen ? "Đã khép cửa sổ." : "Đã mở cửa sổ.")} aria-label={settings.windowOpen ? "Đóng cửa sổ" : "Mở cửa sổ"}><PanelTop /></button>
        <button type="button" className="study-corner-hotspot hotspot-curtain" onClick={() => toggleObject({ curtainOpen: !settings.curtainOpen }, settings.curtainOpen ? "Đã kéo rèm." : "Đã mở rèm.")} aria-label={settings.curtainOpen ? "Kéo rèm" : "Mở rèm"}><ChevronDown /></button>
      </div>
      <div className="study-corner-wall-note"><span>{effectiveWeather === "rain" || effectiveWeather === "storm" ? "Ngoài kia có mưa." : "Hôm nay không cần hoàn hảo."}</span><b>{effectiveEmotion === "motivated" || effectiveEmotion === "energetic" ? "Mình bắt đầu bằng một bước." : "Chỉ cần bắt đầu một trang."}</b></div>
      <div className="study-corner-floor-glow" />
      <div className="study-corner-desk">
        <div className="study-corner-laptop-wrap">
          <button type="button" className={`study-corner-laptop ${settings.laptopOpen ? "is-open" : "is-closed"}`} onClick={() => toggleObject({ laptopOpen: !settings.laptopOpen }, settings.laptopOpen ? "Đã gập laptop." : "Đã mở laptop.")} aria-label={settings.laptopOpen ? "Gập laptop" : "Mở laptop"}><Laptop /><span>{settings.laptopOpen ? "Góc tập trung" : "Đang nghỉ"}</span></button>
          <div className="study-corner-notebook"><button type="button" onClick={() => toggleObject({ bookOpen: !settings.bookOpen }, settings.bookOpen ? "Đã khép sách." : "Đã mở sách.")} aria-label={settings.bookOpen ? "Khép sách" : "Mở sách"}><BookOpen /><span>{settings.bookOpen ? "Mở trang đang học" : "Sách đã khép"}</span></button></div>
        </div>
        <div className={`study-corner-lamp ${settings.lampOn ? "is-on" : ""}`} style={{ "--lamp-intensity": settings.lampIntensity / 100 } as CSSProperties}>
          <button type="button" onClick={() => toggleObject({ lampOn: !settings.lampOn }, settings.lampOn ? "Đã tắt đèn bàn." : "Đã bật đèn bàn.")} aria-label={settings.lampOn ? "Tắt đèn bàn" : "Bật đèn bàn"}><LampDesk /><span>Đèn bàn</span></button><i />
        </div>
        <div className="study-corner-mug" aria-hidden="true">☕</div><div className="study-corner-pencil" aria-hidden="true" />
      </div>
      <div className="study-corner-edge" />
    </div>

    <div className="study-corner-toolbar" aria-label="Điều khiển góc học tập">
      <div className="study-corner-light-buttons">{lightModes.map(({ id, label, icon: Icon, description }) => <button key={id} type="button" onClick={() => { updateSettings({ lightMode: id }, `Đã chuyển sang ${label.toLowerCase()}.`); commitEnvironment({ lightOverride: id }, `Đã chuyển sang ${label.toLowerCase()}.`); }} className={effectiveLight === id ? "is-selected" : ""} aria-pressed={effectiveLight === id}><Icon /><span><b>{label}</b><small>{description}</small></span></button>)}</div>
      <div className="study-corner-summary-row"><span><b>{seasons.find((item) => item.id === effectiveSeason)?.icon} {seasons.find((item) => item.id === effectiveSeason)?.label}</b> · {weathers.find((item) => item.id === effectiveWeather)?.icon} {weathers.find((item) => item.id === effectiveWeather)?.label} · {emotions.find((item) => item.id === effectiveEmotion)?.icon} {emotions.find((item) => item.id === effectiveEmotion)?.label}</span><button type="button" className="study-corner-auto-button" onClick={resetEnvironment}><RotateCcw /> Auto</button></div>
    </div>

    <div className="study-corner-panels" aria-label="Thiết lập môi trường">
      <EnvironmentPanel title="🌦️ Môi trường: thời gian · mùa · thời tiết · cảm xúc · màu sắc" open={Boolean(panels.environment)} onToggle={() => setPanel("environment")}>
        <div className="study-corner-mode-row"><div><b>Chế độ môi trường</b><small>{environment.mode === "auto" ? "Auto kết hợp thời gian, mùa, thời tiết và cảm xúc hợp lệ." : "Manual: Ong tự chọn các yếu tố của cảnh."}</small></div><div className="study-corner-segmented"><button type="button" className={environment.mode === "auto" ? "is-selected" : ""} onClick={() => commitEnvironment({ mode: "auto" }, "Đã bật Auto Environment.")}>🤖 Auto</button><button type="button" className={environment.mode === "manual" ? "is-selected" : ""} onClick={() => commitEnvironment({ mode: "manual" }, "Đã bật chế độ Manual.")}>✋ Manual</button></div></div>
        <div className="study-corner-choice-grid"><div><h3>🌸 Mùa</h3><div className="study-corner-choice-list">{seasons.map((item) => <button key={item.id} type="button" disabled={environment.mode === "auto"} className={environment.season === item.id ? "is-selected" : ""} onClick={() => commitEnvironment({ season: item.id }, `Đã chọn ${item.label}.`)} aria-pressed={environment.season === item.id}><span>{item.icon}</span><b>{item.label}</b><small>{item.description}</small></button>)}</div></div><div><h3>🌦️ Thời tiết mô phỏng</h3><div className="study-corner-choice-list">{weathers.map((item) => <button key={item.id} type="button" disabled={environment.mode === "auto"} className={environment.weather === item.id ? "is-selected" : ""} onClick={() => commitEnvironment({ weather: item.id }, `Đã chọn thời tiết ${item.label}.`)} aria-pressed={environment.weather === item.id}><span>{item.icon}</span><b>{item.label}</b><small>Không lấy dữ liệu thời tiết thật</small></button>)}</div></div><div><h3>💭 Cảm xúc do Ong chọn</h3><div className="study-corner-choice-list">{emotions.map((item) => <button key={item.id} type="button" disabled={environment.mode === "auto"} className={environment.emotion === item.id ? "is-selected" : ""} onClick={() => commitEnvironment({ emotion: item.id }, `Đã chọn trạng thái ${item.label}.`)} aria-pressed={environment.emotion === item.id}><span>{item.icon}</span><b>{item.label}</b><small>{item.id === "neutral" ? "Không tự kết luận cảm xúc" : "Chỉ điều chỉnh cảnh, không ghi đè thời tiết"}</small></button>)}</div></div></div>
        <div className="study-corner-inline-controls"><label><span>Color profile</span><select value={environment.colorProfile} onChange={(event) => commitEnvironment({ colorProfile: event.target.value as StudyCornerColorProfile }, "Đã đổi color profile.")}><option value="auto">Auto theo môi trường</option>{Object.keys(colorProfiles).map((id) => <option key={id} value={id}>{id}</option>)}</select></label><label><span>Ánh sáng thủ công</span><select value={environment.lightOverride} onChange={(event) => commitEnvironment({ lightOverride: event.target.value as StudyCornerEnvironment["lightOverride"] }, "Đã đổi ưu tiên ánh sáng.")}><option value="auto">Auto theo thời gian</option><option value="day">Ban ngày</option><option value="sunset">Chiều</option><option value="night">Ban đêm</option></select></label></div>
      </EnvironmentPanel>

      <EnvironmentPanel title="🎨 Preset môi trường" open={Boolean(panels.presets)} onToggle={() => setPanel("presets")}><div className="study-corner-presets">{presets.map((preset) => <button type="button" key={preset.id} className={environment.selectedPresetId === preset.id ? "is-selected" : ""} onClick={() => applyPreset(preset)}><span>{preset.icon}</span><b>{preset.label}</b><small>{preset.description}</small></button>)}</div><p className="study-corner-note">Preset chỉ thay đổi môi trường của Góc học tập, không tạo thêm hệ thống chức năng khác.</p></EnvironmentPanel>

      <EnvironmentPanel title="🎵 Âm thanh thích ứng" open={Boolean(panels.audio)} onToggle={() => setPanel("audio")}><div className="study-corner-audio-grid"><div className="study-corner-audio-state"><button type="button" className="study-corner-audio-toggle" onClick={() => { setAudioError(false); commitEnvironment({ soundEnabled: !environment.soundEnabled }, environment.soundEnabled ? "Đã tắt âm thanh môi trường." : ambientAsset ? "Đã bật âm thanh môi trường." : "Chưa có file âm thanh thật để phát."); }} aria-pressed={environment.soundEnabled}>{environment.soundEnabled ? <Volume2 /> : <VolumeX />}<span><b>{environment.soundEnabled ? "Âm thanh đang bật" : "Âm thanh đang tắt"}</b><small>{ambientAsset ? `Đang dùng: ${ambientAsset.name}` : "Chưa có asset thật; không phát âm thanh giả."}</small></span></button>{ambientAsset && environment.soundEnabled && <audio key={ambientAsset.url} src={ambientAsset.url} autoPlay loop controls className="study-corner-audio" onError={() => setAudioError(true)} aria-label="Âm thanh môi trường thích ứng" />}{audioError && <small className="study-corner-error">Không thể phát file này. Hãy kiểm tra URL hoặc chọn bản thu khác.</small>}</div><label><span>Âm lượng môi trường <b>{environment.soundVolume}%</b></span><input type="range" min="0" max="100" value={environment.soundVolume} onChange={(event) => commitEnvironment({ soundVolume: Number(event.target.value) }, "Đã điều chỉnh âm lượng môi trường.")} /></label><label className="study-corner-checkbox"><input type="checkbox" checked={environment.thunderEnabled} onChange={(event) => commitEnvironment({ thunderEnabled: event.target.checked }, event.target.checked ? "Đã bật sấm rất nhẹ." : "Đã tắt sấm.")} /><span><b>Sấm rất nhẹ</b><small>Chỉ là tùy chọn, không gây giật mình.</small></span></label></div><p className="study-corner-note">Âm thanh chỉ bắt đầu sau thao tác chủ động của Ong. Âm thanh theo mùa/thời tiết/cảm xúc cần bản thu thật trong thư viện cá nhân.</p></EnvironmentPanel>

      <EnvironmentPanel title="♿ Accessibility & hiệu ứng" open={Boolean(panels.accessibility)} onToggle={() => setPanel("accessibility")}><div className="study-corner-accessibility"><label className="study-corner-checkbox"><input type="checkbox" checked={!environment.effectsEnabled} onChange={(event) => commitEnvironment({ effectsEnabled: !event.target.checked }, event.target.checked ? "Đã giảm hiệu ứng." : "Đã bật hiệu ứng.")} /><span><b>Giảm/tắt hiệu ứng</b><small>Không dùng màu sắc làm tín hiệu duy nhất.</small></span></label><label className="study-corner-checkbox"><input type="checkbox" checked={environment.reduceMotion} onChange={(event) => commitEnvironment({ reduceMotion: event.target.checked }, event.target.checked ? "Đã bật Reduce Motion." : "Đã tắt Reduce Motion.")} /><span><b>Reduce Motion</b><small>Giảm chuyển động và chuyển cảnh.</small></span></label><button type="button" className="study-corner-reset" onClick={() => { setSettings(defaultSettings); resetEnvironment(); setLastAction("Đã khôi phục thiết lập mặc định."); }}><RotateCcw /> Khôi phục mặc định</button></div></EnvironmentPanel>
    </div>
  </section>;
}
