from pathlib import Path
import re

root = Path('/home/ubuntu/gocnhocuaong-web')
p = root / 'client/src/pages/Pomodoro.tsx'
s = p.read_text()

# Remove background-only imports and state/refs.
s = s.replace('import { DEFAULT_AMBIENT_BOOK_PAGES_URL, DEFAULT_AMBIENT_MORNING_URL, DEFAULT_AMBIENT_RAIN_URL, DEFAULT_AMBIENT_STORM_URL, DEFAULT_POMODORO_AMBIENT_PRESET } from "../lib/defaultAmbient";', '')
s = s.replace('import { COMPLETE_ALERT_PROFILE, SOUND_EVENTS, SOUNDSCAPE_LAYERS, SOUNDSCAPE_PRESETS, scaledGain, soundEventDuration, soundEventGainMultiplier, soundEventSpacing, type SoundEvent } from "../lib/pomodoroAudio";', 'import { COMPLETE_ALERT_PROFILE, SOUND_EVENTS, scaledGain, soundEventDuration, soundEventGainMultiplier, soundEventSpacing, type SoundEvent } from "../lib/pomodoroAudio";')
for line in [
'  const [backgroundRequested, setBackgroundRequested] = useState(false);\n',
'  const [backgroundActive, setBackgroundActive] = useState(false);\n',
'  const [backgroundSound, setBackgroundSound] = useState(restoredSession?.backgroundSound ?? "Mưa nhẹ");\n',
'  const [backgroundVolume, setBackgroundVolume] = useState(restoredSession?.backgroundVolume ?? profile.audioMixer?.pomodoroBackground ?? 68);\n',
'  const [layerVolumes, setLayerVolumes] = useState<Record<string, number>>(restoredSession?.layerVolumes ?? profile.audioMixer?.pomodoroLayers ?? {});\n',
'  const [pomodoroAmbientMix, setPomodoroAmbientMix] = useState(restoredSession?.pomodoroAmbientMix ?? profile.audioMixer?.pomodoroAmbientMix ?? { morning: 25, storm: 75 });\n',
'  const backgroundStopRef = useRef<(() => void) | null>(null);\n',
'  const personalBackgroundRef = useRef<HTMLAudioElement | null>(null);\n',
'  const backgroundGenerationRef = useRef(0);\n',
]: s = s.replace(line, '')
s = re.sub(r'  const audioPresetSnapshot = .*?;\n  const audioAmbientMixSnapshot = .*?;\n', '', s)

# Remove background playback helpers from stopBackground through startBackground and preview/toggle helpers.
s = re.sub(r'  function stopBackground\(\) \{.*?\n  async function playSequence', '  async function playSequence', s, flags=re.S)
s = re.sub(r'  async function startBackground\(.*?\n  async function playSequence', '  async function playSequence', s, flags=re.S)
# The previous pattern may leave one helper block; explicitly remove preview/toggle background region.
s = re.sub(r'  async function previewBackground\(\) \{.*?\n  async function toggleAudioCenter', '  async function toggleAudioCenter', s, flags=re.S)
s = re.sub(r'  async function toggleAudioCenter\(\) \{.*?\n  useEffect\(\(\) => \(\) =>', '  useEffect(() => () =>', s, flags=re.S)
# Remove old cleanup and background effects, keeping the audio context cleanup.
s = s.replace('useEffect(() => () => { stopPreview(); stopPersonalCue(); stopBackground(); void audioContextRef.current?.close(); }, []);', 'useEffect(() => () => { stopPersonalCue(); void audioContextRef.current?.close(); }, []);')
s = re.sub(r'  useEffect\(\(\) => \{ if \(!sound\) \{ stopPreview\(\); stopBackground\(\); \} \}, \[sound\]\);\n', '', s)
s = re.sub(r'  useEffect\(\(\) => \{\n    if \(!sound \|\| !backgroundRequested\).*?\n  \}, \[sound, backgroundRequested, backgroundSound, backgroundVolume, layerVolumes\]\);\n', '', s, flags=re.S)

# Restore preferences without background fields, and persist only timer + alert configuration.
s = s.replace('        setBackgroundSound(saved.backgroundSound || "Mưa nhẹ");\n', '')
s = s.replace('writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, totalSessions, sessionStartedAt, backgroundSound, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix: audioAmbientMixSnapshot, compactMode, miniPlayerPinned });', 'writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, totalSessions, sessionStartedAt, alertVolume, compactMode, miniPlayerPinned });')
s = s.replace('  }, [focus, shortBreak, longBreak, autoAdvance, pendingTransition, sound, backgroundSound, compactMode, seconds, mode, running, subject, topic, activity, totalSessions, sessionStartedAt, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix, miniPlayerPinned]);', '  }, [focus, shortBreak, longBreak, autoAdvance, pendingTransition, sound, compactMode, seconds, mode, running, subject, topic, activity, totalSessions, sessionStartedAt, alertVolume, miniPlayerPinned]);')

# Simplify profile mixer sync to alert volume only; leave global legacy mixer fields untouched.
old = 'onProfile({ ...profile, audioMixer: { ...(profile.audioMixer ?? { ambientSceneVolumes: { morning: 55, rain: 50, snow: 45, leaves: 50, storm: 40, summer: 36, spring: 34, tet: 38, halloween: 30, desert: 28, night: 30, naturepark: 35, sunrise: 36, mountainsunset: 32, meteorice: 28, galaxy: 28, cityday: 34, citysunset: 32, citydusk: 30, citynight: 29, bridgefog: 26, urbanfog: 26, sparklers: 34, fireworks: 38, forest: 34, sunset: 31, space: 28, crescentmoon: 27, ocean: 36, neon: 30, sakura: 34, autumn: 32, festival: 38, volcano: 34, deepocean: 32, magicforest: 31, spacestation: 29, flowerfield: 35, fairytale: 32, circus: 38, prehistoric: 31, cyberrace: 36, foodfestival: 34 }, pomodoroLayers: {}, pomodoroBackground: 40, pomodoroBell: 70, environment: 35, music: 30, uiEffects: 28, lumi: 75, ong: 75, memberVoice: 75 }), pomodoroBackground: backgroundVolume, pomodoroLayers: layerVolumes, pomodoroBell: alertVolume } });'
if old in s:
    s = s.replace(old, 'onProfile({ ...profile, audioMixer: { ...(profile.audioMixer ?? {}), pomodoroBell: alertVolume } });')
else:
    s = re.sub(r'onProfile\(\{ \.\.\.profile, audioMixer: \{.*?pomodoroBell: alertVolume \} \}\);', 'onProfile({ ...profile, audioMixer: { ...(profile.audioMixer ?? {}), pomodoroBell: alertVolume } });', s, count=1, flags=re.S)

# Remove old background/history snapshot fields and reload-audio affordance.
s = re.sub(r', audioPresetId: audioPresetSnapshot\?\.id, audioPresetName: audioPresetSnapshot\?\.name \?\? selectedSoundscape\.label, audioAmbientMix: audioAmbientMixSnapshot', '', s)
s = s.replace('  const selectedSoundscape = { label: "Âm báo chuyển trạng thái", layers: [] as string[] };\n', '')
s = s.replace('🎵 {selectedSoundscape.label} · {selectedSoundscape.layers.length} lớp đang hòa', '🔔 Âm báo chuyển trạng thái')
s = re.sub(r'\{item\.audioPresetName \? <small.*?</span><span className="flex items-center gap-2 text-xs font-bold text-slate-500">\{item\.audioPresetName \? <button.*?</button> : null\}<span>\{item\.status', '<span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span>{item.status', s, flags=re.S)
s = s.replace('    setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionRef.current = false; stopBackground();', '    setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionRef.current = false;')

# Update main action button to show manual transition labels.
s = s.replace('{running ? "Tạm dừng" : sessionStartedAt ? "Tiếp tục" : mode === "focus" ? "Bắt đầu tập trung" : `Bắt đầu ${modeLabels[mode].toLowerCase()}`}', '{mainActionLabel}')
# Remove reward playback and any stale background labels.
s = s.replace(' · {backgroundActive ? "Âm nền đang phát" : "Đang giữ phiên"}', ' · Âm báo trạng thái sẵn sàng')
s = s.replace('  function toggleAudioCenter', '  function toggleAudioCenter')
# Remove any now-unused toggle function remnants if regex left them.
s = re.sub(r'  async function toggleAudioCenter\(\).*?\n  useEffect\(\(\) => \(\) =>', '  useEffect(() => () =>', s, flags=re.S)
s = re.sub(r'  function toggleBackgroundPlayback\(\).*?\n  useEffect\(\(\) =>', '  useEffect(() =>', s, flags=re.S)

p.write_text(s)

# Legacy persistence fields remain readable but are optional when writing new sessions.
q = root / 'client/src/lib/pomodoroPersistence.ts'
t = q.read_text()
t = t.replace('  backgroundSound: string;\n  backgroundVolume: number;\n  layerVolumes: Record<string, number>;\n  alertVolume: number;\n  pomodoroAmbientMix: { morning: number; storm: number };', '  backgroundSound?: string;\n  backgroundVolume?: number;\n  layerVolumes?: Record<string, number>;\n  alertVolume: number;\n  pomodoroAmbientMix?: { morning: number; storm: number };')
q.write_text(t)
print('cleanup complete')
