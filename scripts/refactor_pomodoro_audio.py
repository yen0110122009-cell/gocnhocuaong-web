from pathlib import Path

root = Path('/home/ubuntu/gocnhocuaong-web')
pomodoro_path = root / 'client/src/pages/Pomodoro.tsx'
audio_path = root / 'client/src/lib/pomodoroAudio.ts'
persistence_path = root / 'client/src/lib/pomodoroPersistence.ts'

pomodoro = pomodoro_path.read_text()
audio = audio_path.read_text()
persistence = persistence_path.read_text()

# Extend transition-alert vocabulary while keeping old soundscape contracts available elsewhere.
audio = audio.replace('export type SoundEvent = "start" | "tick" | "complete" | "warning" | "reward" | "error";', 'export type SoundEvent = "start" | "breakStart" | "breakEnd" | "tick" | "complete" | "warning" | "reward" | "error";')
audio = audio.replace('  tick: [880],\n  complete:', '  breakStart: [392, 523, 659],\n  breakEnd: [659, 523, 392],\n  tick: [880],\n  complete:')
audio = audio.replace('  if (event === "tick") return 0.055;\n  if (event === "complete")', '  if (event === "tick") return 0.055;\n  if (event === "breakStart" || event === "breakEnd") return 0.24;\n  if (event === "complete")')
audio = audio.replace('  if (event === "tick") return 0.04;\n  if (event === "complete")', '  if (event === "tick") return 0.04;\n  if (event === "breakStart" || event === "breakEnd") return 0.1;\n  if (event === "complete")')
# Keep complete as the only legacy completion alert; transition cues use the normal short duration.

audio_path.write_text(audio)

# Persist a manual transition checkpoint without removing legacy audio fields from old sessions.
persistence = persistence.replace('  autoAdvance: boolean;\n  subject:', '  autoAdvance: boolean;\n  pendingTransition?: "break" | "focus" | null;\n  subject:')
persistence = persistence.replace('      autoAdvance: value.autoAdvance !== false,\n      subject:', '      autoAdvance: value.autoAdvance !== false,\n      pendingTransition: value.pendingTransition === "break" || value.pendingTransition === "focus" ? value.pendingTransition : null,\n      subject:')
persistence_path.write_text(persistence)

# Add pending transition state and restore it.
pomodoro = pomodoro.replace('  const [autoAdvance, setAutoAdvance] = useState(restoredSession?.autoAdvance ?? true);\n', '  const [autoAdvance, setAutoAdvance] = useState(restoredSession?.autoAdvance ?? true);\n  const [pendingTransition, setPendingTransition] = useState<"break" | "focus" | null>(restoredSession?.pendingTransition ?? null);\n')
pomodoro = pomodoro.replace('    setAutoAdvance(saved.autoAdvance);\n', '    setAutoAdvance(saved.autoAdvance);\n    setPendingTransition(saved.pendingTransition ?? null);\n')
pomodoro = pomodoro.replace('    localStorage.setItem(KEY, JSON.stringify({ focus, shortBreak, longBreak, autoAdvance, sound, backgroundSound, compactMode }));\n    writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, subject, topic, activity, totalSessions, sessionStartedAt, backgroundSound, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix: audioAmbientMixSnapshot, compactMode, miniPlayerPinned });', '    localStorage.setItem(KEY, JSON.stringify({ focus, shortBreak, longBreak, autoAdvance, compactMode }));\n    writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, totalSessions, sessionStartedAt, backgroundSound, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix: audioAmbientMixSnapshot, compactMode, miniPlayerPinned });')
pomodoro = pomodoro.replace('  }, [focus, shortBreak, longBreak, autoAdvance, sound, backgroundSound, compactMode, seconds, mode, running, subject, topic, activity, totalSessions, sessionStartedAt, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix, miniPlayerPinned]);', '  }, [focus, shortBreak, longBreak, autoAdvance, pendingTransition, sound, backgroundSound, compactMode, seconds, mode, running, subject, topic, activity, totalSessions, sessionStartedAt, backgroundVolume, layerVolumes, alertVolume, pomodoroAmbientMix, miniPlayerPinned]);')

# Do not resume an ambient track as part of a Pomodoro restore/start flow.
pomodoro = pomodoro.replace('  const [backgroundRequested, setBackgroundRequested] = useState(restoredSession?.running ?? false);', '  const [backgroundRequested, setBackgroundRequested] = useState(false);')
pomodoro = pomodoro.replace('      setBackgroundRequested(true);\n      void unlockAudio(true);', '      void unlockAudio(true);')
pomodoro = pomodoro.replace('    if (sound) { setBackgroundRequested(true); void startBackground(); }\n', '')

# Only transition alerts remain in the timer loop; remove tick and warning playback.
pomodoro = pomodoro.replace('  useEffect(() => {\n    if (!running || seconds <= 0 || seconds % 60 !== 0) return;\n    if (seconds === 60) { void playPersonalCue("warning").then((played) => { if (!played) void playSequence("warning"); }); }\n    else playSequence("tick");\n  }, [running, seconds]);\n', '')

# Replace the zero-second transition effect.
old_effect = '''  useEffect(() => {\n    if (seconds !== 0 || completionRef.current) return;\n    completionRef.current = true;\n    if (mode === "focus") completeFocus();\n    else {\n      setRunning(false); setMode("focus"); setSeconds(focus * 60); completionRef.current = false;\n      toast.success("Đã hết thời gian nghỉ. Sẵn sàng cho phiên tiếp theo.");\n    }\n  }, [seconds, mode, focus]);\n'''
new_effect = '''  useEffect(() => {\n    if (seconds !== 0 || completionRef.current) return;\n    completionRef.current = true;\n    if (mode === "focus") completeFocus();\n    else completeBreak();\n  }, [seconds, mode, focus]);\n'''
if old_effect not in pomodoro:
    raise SystemExit('timer transition effect not found')
pomodoro = pomodoro.replace(old_effect, new_effect)

# Replace completion logic with explicit manual/automatic transition branches.
old_complete = '''    const nextMode: Mode = autoAdvance ? (session.sessionNumber % 4 === 0 ? "longBreak" : "shortBreak") : "focus";\n    setRunning(false); setSessionStartedAt(null); setMode(nextMode); setSeconds((nextMode === "longBreak" ? longBreak : nextMode === "shortBreak" ? shortBreak : focus) * 60); completionRef.current = false;\n    if (sound) {\n      try { window.navigator.vibrate?.(COMPLETE_ALERT_PROFILE.vibratePattern); } catch { /* optional */ }\n      void playPersonalCue("complete").then((played) => { if (!played) playAlert(); });\n      if (rewarded.newlyUnlocked.length) void playPersonalCue("reward").then((played) => { if (!played) void playSequence("reward"); });\n    }\n    setCompletionBanner(true);\n    window.setTimeout(() => setCompletionBanner(false), 5200);\n    toast.success("Một phiên nữa đã hoàn thành! Thời gian học đã được ghi nhận.");\n  }\n'''
new_complete = '''    const nextMode: Mode = session.sessionNumber % 4 === 0 ? "longBreak" : "shortBreak";\n    setSessionStartedAt(null);\n    setCompletionBanner(true);\n    window.setTimeout(() => setCompletionBanner(false), 5200);\n    if (sound) {\n      try { window.navigator.vibrate?.(COMPLETE_ALERT_PROFILE.vibratePattern); } catch { /* optional */ }\n      void playPersonalCue("complete").then((played) => { if (!played) playAlert(); });\n    }\n    if (autoAdvance) {\n      setPendingTransition(null); setMode(nextMode); setSeconds((nextMode === "longBreak" ? longBreak : shortBreak) * 60); setRunning(true); completionRef.current = false;\n      if (sound) void playPersonalCue("breakStart").then((played) => { if (!played) void playSequence("breakStart"); });\n      toast.success("Phiên đã xong. Pomodoro tự chuyển sang thời gian nghỉ.");\n    } else {\n      setPendingTransition("break"); setMode(nextMode); setSeconds(0); setRunning(false); completionRef.current = false;\n      toast.success("Phiên đã xong. Khi sẵn sàng, hãy nhấn Bắt đầu nghỉ.");\n    }\n  }\n\n  function completeBreak() {\n    setRunning(false); setSessionStartedAt(null); setSeconds(0); completionRef.current = false;\n    if (sound) void playPersonalCue("breakEnd").then((played) => { if (!played) void playSequence("breakEnd"); });\n    if (autoAdvance) {\n      setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setRunning(true); setSessionStartedAt(new Date().toISOString());\n      toast.success("Thời gian nghỉ đã hết. Pomodoro tự chuyển sang phiên học tiếp theo.");\n    } else {\n      setPendingTransition("focus");\n      setMode("focus");\n      toast.success("Thời gian nghỉ đã hết. Khi sẵn sàng, hãy nhấn Bắt đầu phiên tiếp theo.");\n    }\n  }\n'''
if old_complete not in pomodoro:
    raise SystemExit('completeFocus block not found')
pomodoro = pomodoro.replace(old_complete, new_complete)

# Add explicit manual transition handling at the beginning of start().
old_start = '''  async function start() {\n    if (sound) await unlockAudio();\n'''
new_start = '''  async function start() {\n    if (pendingTransition === "break") {\n      setPendingTransition(null); setSeconds((mode === "longBreak" ? longBreak : shortBreak) * 60); setRunning(true); completionRef.current = false;\n      if (sound) void playPersonalCue("breakStart").then((played) => { if (!played) void playSequence("breakStart"); });\n      toast.success("Đã bắt đầu thời gian nghỉ.");\n      return;\n    }\n    if (pendingTransition === "focus") {\n      setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(new Date().toISOString()); setRunning(true); completionRef.current = false;\n      if (sound) void playPersonalCue("start").then((played) => { if (!played) void playSequence("start"); });\n      toast.success("Đã bắt đầu phiên học tiếp theo.");\n      return;\n    }\n    if (sound) await unlockAudio();\n'''
if old_start not in pomodoro:
    raise SystemExit('start function not found')
pomodoro = pomodoro.replace(old_start, new_start)

# Stop manual transition state when resetting/changing presets.
pomodoro = pomodoro.replace('    setRunning(false); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionRef.current = false; stopBackground();', '    setRunning(false); setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionRef.current = false; stopBackground();')
pomodoro = pomodoro.replace('  function choosePreset(preset: Preset) { if (running && !window.confirm("Đổi preset sẽ dừng phiên hiện tại. Tiếp tục?")) return; setRunning(false); setFocus(preset.focus);', '  function choosePreset(preset: Preset) { if (running && !window.confirm("Đổi preset sẽ dừng phiên hiện tại. Tiếp tục?")) return; setRunning(false); setPendingTransition(null); setFocus(preset.focus);')

# Use a status label independent of ambient soundscape names.
pomodoro = pomodoro.replace('  const selectedSoundscape = SOUNDSCAPE_PRESETS[backgroundSound] ?? SOUNDSCAPE_PRESETS["Mưa nhẹ"];', '  const selectedSoundscape = { label: "Âm báo chuyển trạng thái", layers: [] as string[] };')
pomodoro = pomodoro.replace('  const statusText = running ? (mode === "focus" ? "Đừng bỏ cuộc giữa chừng nhé, Ong." : "Nghỉ một chút rồi quay lại nhé.") : mode === "focus" ? (sessionStartedAt ? "Phiên học đang tạm dừng." : "Bạn đã sẵn sàng học chưa?") : "Khi sẵn sàng, hãy bắt đầu phiên tiếp theo.";', '  const statusText = pendingTransition === "break" ? "Phiên đã hoàn thành. Chọn khi bạn muốn bắt đầu nghỉ." : pendingTransition === "focus" ? "Thời gian nghỉ đã xong. Chọn khi bạn muốn học tiếp." : running ? (mode === "focus" ? "Đừng bỏ cuộc giữa chừng nhé, Ong." : "Nghỉ một chút rồi quay lại nhé.") : mode === "focus" ? (sessionStartedAt ? "Phiên học đang tạm dừng." : "Bạn đã sẵn sàng học chưa?") : "Khi sẵn sàng, hãy bắt đầu phiên tiếp theo.";\n  const mainActionLabel = pendingTransition === "break" ? "Bắt đầu nghỉ" : pendingTransition === "focus" ? "Bắt đầu phiên tiếp theo" : running ? "Tạm dừng" : "Bắt đầu";')
pomodoro = pomodoro.replace('{running ? "Tạm dừng" : "Bắt đầu"}', '{mainActionLabel}')

# Remove the old nested Pomodoro ambient Audio Center and insert transition-alert controls.
start_marker = '<PersistentCollapsible storageKey="pomodoro-audio-center"'
start = pomodoro.find(start_marker)
if start == -1:
    raise SystemExit('audio center section not found')
end = pomodoro.find('</PersistentCollapsible>', start)
if end == -1:
    raise SystemExit('audio center section end not found')
end += len('</PersistentCollapsible>')
replacement = '''    <section className="panel p-5" aria-label="Âm báo và chuyển phiên Pomodoro"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#c62828]">Âm báo Pomodoro</p><h2 className="mt-2 font-display text-xl font-black">Chỉ báo trạng thái, không phát âm nền tập trung</h2><p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-300">Pomodoro chỉ phát âm khi bắt đầu phiên, kết thúc phiên, bắt đầu nghỉ hoặc kết thúc nghỉ.</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold">Âm lượng âm báo · {alertVolume}%<input aria-label="Âm lượng âm báo" type="range" min="0" max="100" value={alertVolume} onChange={(e) => setAlertVolume(Number(e.target.value))} /></label><fieldset className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5"><legend className="sr-only">Cách chuyển phiên</legend><p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Cách chuyển phiên</p><label className="flex items-center gap-2"><input type="radio" name="pomodoro-transition-mode" checked={autoAdvance} onChange={() => setAutoAdvance(true)} />Tự động chuyển phiên</label><label className="mt-2 flex items-center gap-2"><input type="radio" name="pomodoro-transition-mode" checked={!autoAdvance} onChange={() => setAutoAdvance(false)} />Tôi tự nhấn để chuyển</label></fieldset></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><button className="secondary-button justify-center text-xs" onClick={() => void previewEvent("start")}>▶ Bắt đầu phiên</button><button className="secondary-button justify-center text-xs" onClick={() => void previewEvent("complete")}>▶ Kết thúc phiên</button><button className="secondary-button justify-center text-xs" onClick={() => void previewEvent("breakStart")}>▶ Bắt đầu nghỉ</button><button className="secondary-button justify-center text-xs" onClick={() => void previewEvent("breakEnd")}>▶ Kết thúc nghỉ</button></div></section>'''
pomodoro = pomodoro[:start] + replacement + pomodoro[end:]

# Update cue targets to match the four explicit transition states.
pomodoro = pomodoro.replace('target: "start" | "warning" | "complete" | "break" | "reward"', 'target: "start" | "complete" | "breakStart" | "breakEnd"')
# Remove weekly/reward sound playback; rewards remain visual/profile events.
pomodoro = pomodoro.replace('    if (sound) void playPersonalCue("reward").then((played) => { if (!played) void playSequence("reward"); });\n', '')

pomodoro_path.write_text(pomodoro)
print('refactor complete')
