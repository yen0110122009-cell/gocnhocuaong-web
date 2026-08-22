from pathlib import Path
import re

path = Path('/home/ubuntu/gocnhocuaong-web/client/src/pages/Pomodoro.tsx')
s = path.read_text()

def once(old: str, new: str, label: str) -> None:
    global s
    if old not in s:
        raise SystemExit(f'missing: {label}')
    s = s.replace(old, new, 1)

once('type PersonalPomodoroAmbientPreset, ', '', 'ambient type import')
once('SOUNDSCAPE_LAYERS, SOUNDSCAPE_PRESETS, ', '', 'soundscape imports')
for token in [
    'import { DEFAULT_AMBIENT_BOOK_PAGES_URL, DEFAULT_AMBIENT_MORNING_URL, DEFAULT_AMBIENT_RAIN_URL, DEFAULT_AMBIENT_STORM_URL, DEFAULT_POMODORO_AMBIENT_PRESET } from "../lib/defaultAmbient";\n',
]:
    once(token, '', 'default ambient import')

for line in [
    '  const [backgroundRequested, setBackgroundRequested] = useState(false);\n',
    '  const [backgroundActive, setBackgroundActive] = useState(false);\n',
    '  const [backgroundSound, setBackgroundSound] = useState(restoredSession?.backgroundSound ?? "Mưa nhẹ");\n',
    '  const [backgroundVolume, setBackgroundVolume] = useState(restoredSession?.backgroundVolume ?? profile.audioMixer?.pomodoroBackground ?? 68);\n',
    '  const [layerVolumes, setLayerVolumes] = useState<Record<string, number>>(restoredSession?.layerVolumes ?? profile.audioMixer?.pomodoroLayers ?? {});\n',
    '  const [pomodoroAmbientMix, setPomodoroAmbientMix] = useState(restoredSession?.pomodoroAmbientMix ?? profile.audioMixer?.pomodoroAmbientMix ?? { morning: 25, storm: 75 });\n',
    '  const [ambientPresetName, setAmbientPresetName] = useState("");\n',
    '  const [editingAmbientPresetId, setEditingAmbientPresetId] = useState<string | null>(null);\n',
    '  const [appliedAmbientPresetId, setAppliedAmbientPresetId] = useState<string | null>(null);\n',
    '  const appliedAmbientPresetTimerRef = useRef<number | null>(null);\n',
    '  const backgroundStopRef = useRef<(() => void) | null>(null);\n',
    '  const personalBackgroundRef = useRef<HTMLAudioElement | null>(null);\n',
    '  const backgroundGenerationRef = useRef(0);\n',
    '  const previewStopRef = useRef<(() => void) | null>(null);\n',
    '  const personalBackgroundRef = useRef<HTMLAudioElement | null>(null);\n',
    '  const backgroundGenerationRef = useRef(0);\n',
    '  const audioPresetSnapshot = backgroundSound === "Bình minh & Bão nhẹ" ? DEFAULT_POMODORO_AMBIENT_PRESET : undefined;\n',
    '  const audioAmbientMixSnapshot = { morning: clamp(pomodoroAmbientMix.morning, 0, 100), storm: clamp(pomodoroAmbientMix.storm, 0, 100) };\n',
]:
    s = s.replace(line, '', 1)

# Remove the legacy audio functions by stable function boundaries.
for start, end, label in [
    ('  function stopPreview() {', '  function stopPersonalCue()', 'stop preview/fade/background helpers'),
    ('  async function startBackground(', '  async function playSequence(', 'background playback'),
    ('  async function previewBackground()', '  async function toggleAudioCenter()', 'background preview'),
    ('  async function toggleAudioCenter()', '  async function toggleBackgroundPlayback()', 'audio center toggle'),
    ('  async function toggleBackgroundPlayback()', '  useEffect(() => () => {', 'background toggle'),
]:
    i = s.find(start)
    j = s.find(end, i + len(start))
    if i < 0 or j < 0:
        raise SystemExit(f'missing function block: {label}')
    s = s[:i] + s[j:]

# Remove effects that only keep background audio alive.
for block in [
    '  useEffect(() => () => { stopPreview(); stopPersonalCue(); stopBackground(); void audioContextRef.current?.close(); }, []);\n',
    '  useEffect(() => { if (!sound) { stopPreview(); stopBackground(); } }, [sound]);\n',
    '  useEffect(() => {\n    if (!sound || !backgroundRequested) { stopBackground(); return; }\n    void startBackground();\n    return () => stopBackground();\n  }, [sound, backgroundRequested, backgroundSound, backgroundVolume, layerVolumes]);\n\n',
]:
    s = s.replace(block, '', 1)

# Keep only the alert volume in the profile mixer synchronization effect.
old = re.compile(r'  useEffect\(\(\) => \{\n    if \(!audioMixerHydratedRef\.current\).*?\n  \}, \[alertVolume, backgroundVolume, layerVolumes\]\);\n', re.S)
new = '''  useEffect(() => {
    if (!audioMixerHydratedRef.current) { audioMixerHydratedRef.current = true; return; }
    onProfile({ ...profile, audioMixer: { ...(profile.audioMixer ?? { ambientSceneVolumes: {} as ProfileState["audioMixer"]["ambientSceneVolumes"], pomodoroBell: 70 }), pomodoroBell: alertVolume } });
  }, [alertVolume]);
'''
s, count = old.subn(new, s, count=1)
if count != 1:
    raise SystemExit('missing mixer sync effect')

# Remove legacy hydration and persistence fields.
s = s.replace('        setBackgroundSound(saved.backgroundSound || "Mưa nhẹ");\n', '', 1)
s = s.replace('    writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, totalSessions, sessionStartedAt, backgroundSound, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix: audioAmbientMixSnapshot, compactMode, miniPlayerPinned });', '    writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, totalSessions, sessionStartedAt, alertVolume, compactMode, miniPlayerPinned });', 1)
s = s.replace('  }, [focus, shortBreak, longBreak, autoAdvance, pendingTransition, sound, backgroundSound, compactMode, seconds, mode, running, subject, topic, activity, totalSessions, sessionStartedAt, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix, miniPlayerPinned]);', '  }, [focus, shortBreak, longBreak, autoAdvance, pendingTransition, compactMode, seconds, mode, running, subject, topic, activity, totalSessions, sessionStartedAt, alertVolume, miniPlayerPinned]);', 1)

# Remove ambient data from history records and reset.
s = re.sub(r', audioPresetId: audioPresetSnapshot\?\.id, audioPresetName: audioPresetSnapshot\?\.name \?\? selectedSoundscape\.label, audioAmbientMix: audioAmbientMixSnapshot', '', s)
s = s.replace(' setSessionStartedAt(null); completionRef.current = false; stopBackground();', ' setSessionStartedAt(null); completionRef.current = false;', 1)

# Remove legacy personal ambient preset helpers.
i = s.find('  const personalAmbientPresets = profile.personalPomodoroAmbientPresets ?? [];')
j = s.find('  function handleMainAction()', i)
if i < 0 or j < 0:
    raise SystemExit('missing ambient preset helper block')
s = s[:i] + s[j:]

# Remove obsolete derived soundscape constant.
s = s.replace('  const selectedSoundscape = { label: "Âm báo chuyển trạng thái", layers: [] as string[] };\n', '', 1)

# Ensure hidden mini-player no longer references ambient state.
s = s.replace('{modeLabels[mode]} · {backgroundActive ? "Âm nền đang phát" : "Đang giữ phiên"}', '{modeLabels[mode]} · 🔔 Chỉ âm báo trạng thái')

# Remove old history ambient display/action from the single-line JSX.
s = re.sub(r'\{item\.audioPresetName \? <small.*?</small> : null\}', '', s, count=1)
s = re.sub(r'\{item\.audioPresetName \? <button.*?</button> : null\}', '', s, count=1)

path.write_text(s)
print('cleaned Pomodoro ambient/background flows')
