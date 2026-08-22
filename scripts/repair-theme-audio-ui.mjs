import fs from "node:fs";
const path = "client/src/pages/Home.tsx";
let s = fs.readFileSync(path, "utf8");
const original = 'onClick={() => onProfile({ ...profile, defaultAmbientScene: scene.id }, `Đã áp dụng cảnh ${scene.label}.`)}';
s = s.replaceAll('onClick={() => chooseAudioTheme(scene)}', original);
const start = s.indexOf('function AppearanceStudio(');
const nextFunction = s.indexOf("\nfunction ", start + 20);
const end = nextFunction >= 0 ? nextFunction : s.length;
if (start < 0 || end < 0) throw new Error("Không tìm thấy AppearanceStudio");
let body = s.slice(start, end);
body = body.replaceAll(original, 'onClick={() => chooseAudioTheme(scene)}');
if (!body.includes('const [audioTheme')) {
  const marker = '  const selected = profile.activeCosmeticTheme ?? "ong-red";';
  const state = '  const [audioTheme, setAudioTheme] = useState<{ id: string; label: string; url: string } | null>(null);\n  const [audioVolume, setAudioVolume] = useState(42);\n  const [audioEnabled, setAudioEnabled] = useState(true);\n  const audioRef = useRef<HTMLAudioElement | null>(null);\n  const chooseAudioTheme = (scene: { id: string; label: string }) => { const audio = AUDIO_BACKED_SCENE_AUDIO[scene.id]; if (!audio) return; onProfile({ ...profile, defaultAmbientScene: scene.id as ProfileState["defaultAmbientScene"] }, `Đã áp dụng ${scene.label}.`); setAudioTheme({ id: scene.id, label: audio.label, url: audio.url }); };\n  const toggleThemeAudio = () => { const player = audioRef.current; if (!player || !audioEnabled) return; if (player.paused) { player.volume = audioVolume / 100; void player.play().catch(() => undefined); } else player.pause(); };\n  const updateThemeAudioVolume = (value: number) => { setAudioVolume(value); if (audioRef.current) audioRef.current.volume = value / 100; };';
  body = body.replace(marker, marker + '\n' + state);
}
const modal = '    {audioTheme ? <div role="dialog" aria-modal="true" aria-label="Điều khiển âm nền theme" className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/45 p-4" onClick={() => setAudioTheme(null)}><div className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-emerald-400/25 dark:bg-slate-900 dark:text-slate-100" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-300">Âm nền giao diện</p><h3 className="mt-1 text-xl font-black">{audioTheme.label}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Bật/tắt và điều chỉnh âm lượng.</p></div><button type="button" aria-label="Đóng điều khiển âm nền" onClick={() => setAudioTheme(null)} className="rounded-xl p-2"><X className="h-5 w-5" /></button></div><audio ref={audioRef} src={audioTheme.url} loop preload="none" onLoadedMetadata={(event) => { event.currentTarget.volume = audioVolume / 100; }} /><button type="button" onClick={toggleThemeAudio} className="mt-5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white">{audioEnabled ? "Bật / dừng nghe thử" : "Âm nền đang tắt"}</button><label className="mt-4 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={audioEnabled} onChange={(event) => { setAudioEnabled(event.target.checked); if (!event.target.checked) audioRef.current?.pause(); }} />Cho phép âm nền</label><label className="mt-4 block text-sm font-bold">Âm lượng {audioVolume}%<input className="mt-2 w-full accent-emerald-600" type="range" min="0" max="100" value={audioVolume} onChange={(event) => updateThemeAudioVolume(Number(event.target.value))} aria-label="Âm lượng âm nền theme" /></label></div></div> : null}\n';
if (!body.includes('aria-label="Điều khiển âm nền theme"')) body = body.replace('  </div>;\n}', modal + '  </div>;\n}');
s = s.slice(0, start) + body + s.slice(end);
fs.writeFileSync(path, s);
