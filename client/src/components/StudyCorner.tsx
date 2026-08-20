import { BookOpen, ChevronDown, Laptop, LampDesk, MoonStar, PanelTop, Sparkles, SunMedium, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { ProfileState } from "../../../shared/study";

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

const STORAGE_KEY = "gocnhocuaong-study-corner-v1";
const defaultSettings: CornerSettings = { lightMode: "day", lampOn: false, lampIntensity: 62, windowOpen: true, curtainOpen: true, laptopOpen: true, bookOpen: true, ambientEnabled: false, ambientVolume: 35 };
const lightModes: Array<{ id: LightMode; label: string; icon: typeof SunMedium; description: string }> = [
  { id: "day", label: "Ban ngày", icon: SunMedium, description: "Ánh sáng tự nhiên dịu và rõ." },
  { id: "sunset", label: "Chiều", icon: Sparkles, description: "Nắng ấm, mềm hơn cho buổi học." },
  { id: "night", label: "Ban đêm", icon: MoonStar, description: "Phòng tối, tập trung vào mặt bàn." },
];

function readSettings(): CornerSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<CornerSettings> | null;
    if (!raw) return defaultSettings;
    return {
      ...defaultSettings,
      ...raw,
      lightMode: raw.lightMode === "sunset" || raw.lightMode === "night" ? raw.lightMode : "day",
      lampIntensity: Math.max(0, Math.min(100, Number(raw.lampIntensity) || defaultSettings.lampIntensity)),
      ambientVolume: Math.max(0, Math.min(100, Number(raw.ambientVolume) || defaultSettings.ambientVolume)),
    };
  } catch {
    return defaultSettings;
  }
}

export function StudyCorner({ profile }: { profile: ProfileState }) {
  const [settings, setSettings] = useState<CornerSettings>(readSettings);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [lastAction, setLastAction] = useState("Góc học tập đang chờ Ong bắt đầu.");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const selectedScene = profile.defaultAmbientScene ?? "morning";
  const sceneAsset = useMemo(() => profile.personalAudioAssets?.find((asset) => asset.enabled && !asset.deletedAt && asset.category === "background" && (asset.target === selectedScene || asset.target === "study-corner")), [profile.personalAudioAssets, selectedScene]);
  const sceneClass = settings.lightMode === "night" ? "study-corner--night" : settings.lightMode === "sunset" ? "study-corner--sunset" : "study-corner--day";
  const update = (patch: Partial<CornerSettings>, action: string) => { setSettings((current) => ({ ...current, ...patch })); setLastAction(action); };

  return <section id="study-corner" aria-label="Góc học tập" className="study-corner-shell">
    <div className="study-corner-heading">
      <div><p className="study-corner-kicker">🏠 GÓC HỌC TẬP</p><h1>Góc học tập của Ong</h1><p className="study-corner-lead">Một khoảng riêng để Ong ngồi xuống, mở sách và bắt đầu từng bước nhỏ. Không có bảng quản lý chen vào không gian này.</p></div>
      <div className="study-corner-status" role="status"><span className="study-corner-status-dot" />{lastAction}</div>
    </div>

    <div className={`study-corner-scene ${sceneClass}`}>
      <div className="study-corner-window" aria-label="Cửa sổ và rèm">
        <div className={`study-corner-sky ${settings.windowOpen ? "is-open" : "is-closed"}`}><span className="study-corner-sun" /></div>
        <div className={`study-corner-curtain ${settings.curtainOpen ? "is-open" : "is-closed"}`} />
        <button type="button" className="study-corner-hotspot hotspot-window" onClick={() => update({ windowOpen: !settings.windowOpen }, settings.windowOpen ? "Đã khép cửa sổ." : "Đã mở cửa sổ.")} aria-label={settings.windowOpen ? "Đóng cửa sổ" : "Mở cửa sổ"}><PanelTop /></button>
        <button type="button" className="study-corner-hotspot hotspot-curtain" onClick={() => update({ curtainOpen: !settings.curtainOpen }, settings.curtainOpen ? "Đã kéo rèm." : "Đã mở rèm.")} aria-label={settings.curtainOpen ? "Kéo rèm" : "Mở rèm"}><ChevronDown /></button>
      </div>
      <div className="study-corner-wall-note"><span>Hôm nay không cần hoàn hảo.</span><b>Chỉ cần bắt đầu một trang.</b></div>
      <div className="study-corner-floor-glow" />
      <div className="study-corner-desk">
        <div className="study-corner-laptop-wrap">
          <button type="button" className={`study-corner-laptop ${settings.laptopOpen ? "is-open" : "is-closed"}`} onClick={() => update({ laptopOpen: !settings.laptopOpen }, settings.laptopOpen ? "Đã gập laptop." : "Đã mở laptop.")} aria-label={settings.laptopOpen ? "Gập laptop" : "Mở laptop"}><Laptop /><span>{settings.laptopOpen ? "Góc tập trung" : "Đang nghỉ"}</span></button>
          <div className="study-corner-notebook"><button type="button" onClick={() => update({ bookOpen: !settings.bookOpen }, settings.bookOpen ? "Đã khép sách." : "Đã mở sách.")} aria-label={settings.bookOpen ? "Khép sách" : "Mở sách"}><BookOpen /><span>{settings.bookOpen ? "Mở trang đang học" : "Sách đã khép"}</span></button></div>
        </div>
        <div className={`study-corner-lamp ${settings.lampOn ? "is-on" : ""}`} style={{ "--lamp-intensity": settings.lampIntensity / 100 } as CSSProperties}>
          <button type="button" onClick={() => update({ lampOn: !settings.lampOn }, settings.lampOn ? "Đã tắt đèn bàn." : "Đã bật đèn bàn.")} aria-label={settings.lampOn ? "Tắt đèn bàn" : "Bật đèn bàn"}><LampDesk /><span>Đèn bàn</span></button><i />
        </div>
        <div className="study-corner-mug" aria-hidden="true">☕</div><div className="study-corner-pencil" aria-hidden="true" />
      </div>
      <div className="study-corner-edge" />
    </div>

    <div className="study-corner-toolbar" aria-label="Điều khiển góc học tập">
      <div className="study-corner-light-buttons">{lightModes.map(({ id, label, icon: Icon, description }) => <button key={id} type="button" onClick={() => update({ lightMode: id }, `Đã chuyển sang ${label.toLowerCase()}.`)} className={settings.lightMode === id ? "is-selected" : ""} aria-pressed={settings.lightMode === id}><Icon /><span><b>{label}</b><small>{description}</small></span></button>)}</div>
      <button type="button" className="study-corner-controls-toggle" onClick={() => setControlsOpen((open) => !open)} aria-expanded={controlsOpen}><span><Sparkles /> Cài đặt góc học tập</span><ChevronDown className={controlsOpen ? "rotate-180" : ""} /></button>
    </div>
    {controlsOpen && <div className="study-corner-controls" role="region" aria-label="Cài đặt chi tiết góc học tập">
      <label><span>Độ sáng đèn bàn <b>{settings.lampIntensity}%</b></span><input type="range" min="0" max="100" value={settings.lampIntensity} onChange={(event) => update({ lampIntensity: Number(event.target.value) }, "Đã điều chỉnh độ sáng đèn bàn.")} /></label>
      <label><span>Âm thanh môi trường <b>{settings.ambientVolume}%</b></span><input type="range" min="0" max="100" value={settings.ambientVolume} disabled={!settings.ambientEnabled} onChange={(event) => update({ ambientVolume: Number(event.target.value) }, "Đã điều chỉnh âm lượng môi trường.")} /></label>
      <button type="button" className="study-corner-audio-toggle" onClick={() => update({ ambientEnabled: !settings.ambientEnabled }, settings.ambientEnabled ? "Đã tắt âm thanh môi trường." : sceneAsset ? "Đã bật âm thanh môi trường." : "Chưa có file âm thanh môi trường thật để phát.")} aria-pressed={settings.ambientEnabled}>{settings.ambientEnabled ? <Volume2 /> : <VolumeX />}<span><b>{settings.ambientEnabled ? "Âm thanh môi trường đang bật" : "Âm thanh môi trường đang tắt"}</b><small>{sceneAsset ? "Đang dùng bản thu đã lưu của Ong." : "Chưa có file thật cho cảnh này; không phát âm thanh giả."}</small></span></button>
      {sceneAsset && <audio src={settings.ambientEnabled ? sceneAsset.url : undefined} autoPlay={settings.ambientEnabled} loop controls className="study-corner-audio" aria-label="Âm thanh môi trường của góc học tập" />}
    </div>}
  </section>;
}
