import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bird, CloudRain, Eye, EyeOff, ImagePlus, Leaf, Mic, Pause, Play, Snowflake, Trash2, Upload, Volume2, VolumeX, Zap } from "lucide-react";
import { emotionFromCommand, emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { lumiQuoteForDate } from "../lib/lumiDailyQuotes";
import { activeContentFor, antiProcrastinationChoices, gentleReminders, randomAntiProcrastinationSpeech, randomMicroTask, speechForEvent, speechGroupLabels, type SpeechGroup } from "../lib/speechLibrary";
import type { AppConfig, ProfileState } from "../../../shared/study";
import { OngLearnerAvatar } from "./OngLearnerAvatar";
import { LumiCongratulationControls } from "./LumiCongratulationControls";
import { PersonalStudySpaceControls } from "./PersonalStudySpaceControls";
import { PersistentCollapsible } from "./PersistentCollapsible";
import { trpc } from "@/lib/trpc";
import { resolveMediaUrl } from "../lib/runtime";
import { DEFAULT_AMBIENT_ASSET } from "../lib/defaultAmbient";
import { AudioCenterEnhancements, type AudioChannel as PlaybackChannel, type PlaybackStatus as AudioPlaybackStatus } from "./AudioCenterEnhancements";

type AttentionPreferences = { animationsEnabled: boolean; popupsEnabled: boolean; soundEnabled: boolean };
type AmbientScene = "morning" | "rain" | "snow" | "leaves" | "storm";
type AmbientVolumes = Record<AmbientScene, number>;
type AudioChannel = "environment" | "music" | "uiEffects" | "lumi" | "ong" | "memberVoice";
type AudioChannelVolumes = Record<AudioChannel, number>;
const defaultAudioChannelVolumes: AudioChannelVolumes = { environment: 35, music: 30, uiEffects: 28, lumi: 75, ong: 75, memberVoice: 75 };
type Props = {
  selected: EmotionId;
  onSelect: (id: EmotionId) => void;
  profile?: ProfileState;
  onProfile?: (profile: ProfileState, message?: string) => void;
  onStartTwoMinutes?: () => void;
  customContent?: AppConfig["customContent"];
  mascotStates?: AppConfig["mascotStates"];
  voiceLines?: AppConfig["mascotVoiceLines"];
};

const sceneOptions: Array<{ id: AmbientScene; label: string; detail: string; icon: typeof Bird }> = [
  { id: "morning", label: "Buổi sáng", detail: "chim hót · nắng nhẹ", icon: Bird },
  { id: "rain", label: "Mưa", detail: "mưa rơi · thư giãn", icon: CloudRain },
  { id: "snow", label: "Tuyết", detail: "tĩnh lặng · dịu mắt", icon: Snowflake },
  { id: "leaves", label: "Lá rơi", detail: "gió nhẹ · mùa thu", icon: Leaf },
  { id: "storm", label: "Sấm chớp", detail: "mưa xa · tập trung", icon: Zap },
];
const defaultAmbientVolumes: AmbientVolumes = { morning: 45, rain: 42, snow: 32, leaves: 36, storm: 38 };
const emotionVoiceStates: Record<EmotionId, string[]> = {
  calm: ["comeback", "streak_recovered"], happy: ["achievement_unlocked"], tired: ["failed", "comeback"], sad: ["failed", "comeback"], stressed: ["failed", "streak_recovered"], lazy: ["failed", "comeback"], proud: ["achievement_unlocked"], focused: ["almost_unlocked"], hopeful: ["almost_unlocked", "comeback"], overwhelmed: ["failed", "comeback"], sleepy: ["failed", "comeback"], excited: ["achievement_unlocked"], lonely: ["failed", "comeback"], confident: ["achievement_unlocked", "almost_unlocked"], curious: ["almost_unlocked"], comeback: ["comeback", "streak_recovered"],
};
export function ExperienceStudio({ selected, onSelect, profile, onProfile, onStartTwoMinutes, customContent = [], mascotStates = [], voiceLines = [] }: Props) {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
  const [lazyLevel, setLazyLevel] = useState<"mild" | "very" | "none" | null>(null);
  const [speechGroup, setSpeechGroup] = useState<SpeechGroup>("comfort");
  const [speech, setSpeech] = useState(() => speechForEvent("procrastination"));
  const [recentContentIds, setRecentContentIds] = useState<string[]>([]);
  const [microTask, setMicroTask] = useState(() => randomMicroTask());
  const [reminder, setReminder] = useState<string>(() => gentleReminders[0]);
  const [favoriteScene, setFavoriteScene] = useState<AmbientScene>(() => profile?.defaultAmbientScene ?? "morning");
  const [ambientScene, setAmbientScene] = useState<AmbientScene>(() => profile?.defaultAmbientScene ?? "morning");
  const [ambientVolumes, setAmbientVolumes] = useState<AmbientVolumes>(() => ({ ...defaultAmbientVolumes, ...profile?.audioMixer?.ambientSceneVolumes }));
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [ambientError, setAmbientError] = useState<string | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<AudioPlaybackStatus>({ environment: { active: false, label: "", volume: 0, muted: false }, music: { active: false, label: "", volume: 0, muted: false }, voice: { active: false, label: "", volume: 0, muted: false } });
  const attentionPreferences: AttentionPreferences = { animationsEnabled: profile?.animationsEnabled !== false, popupsEnabled: profile?.popupsEnabled !== false, soundEnabled: profile?.soundEnabled !== false };
  const restoredEmotionRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientStopRef = useRef<(() => void) | null>(null);
  const ambientMasterRef = useRef<GainNode | null>(null);
  const ambientGenerationRef = useRef(0);
  const ambientTrackRef = useRef<HTMLAudioElement | null>(null);
  const lumiAudioRef = useRef<HTMLAudioElement | null>(null);
  const emotionTransitionTimerRef = useRef<number | null>(null);
  const playbackTickerRef = useRef<number | null>(null);
  const theme = emotionThemes.find((item) => item.id === selected) ?? emotionThemes[0];
  const companionMedia = profile?.companionEmotionMedia?.[theme.id];
  const configuredMascotImage = companionMedia?.mascotImageUrl;
  const configuredLumiImage = companionMedia?.lumiImageUrl;
  const preferredPersonalVoice = companionMedia?.lumiVoiceRecordings?.find((recording) => recording.id === companionMedia.favoriteLumiVoiceId) ?? companionMedia?.lumiVoiceRecordings?.[0];
  const selectedPreset = profile?.personalStudyPresets?.find((preset) => preset.id === profile.activePersonalStudyPresetId);
  const selectedPersonalAudioIds = selectedPreset?.audioAssetIds ?? [];
  const preferredCompanionAudio = (kind: "lumi" | "ong") => (profile?.personalAudioAssets ?? [])
    .filter((asset) => asset.enabled && asset.category === kind)
    .filter((asset) => selectedPersonalAudioIds.length === 0 || selectedPersonalAudioIds.includes(asset.id))
    .filter((asset) => [theme.id, "general"].includes(asset.target.trim().toLocaleLowerCase("vi-VN")))
    .sort((left, right) => Number(right.isDefault) - Number(left.isDefault) || right.updatedAt.localeCompare(left.updatedAt))[0];
  const voiceLinkedLumiImage = resolveMediaUrl(companionMedia?.lumiImageUrl);
  const matchingVoiceLine = [...voiceLines].reverse().find((item) => item.enabled && !item.deletedAt && (item.emotion === theme.id || item.state === `emotion-${theme.id}` || (!item.emotion && emotionVoiceStates[theme.id].includes(item.state))));
  const preferredMemberVoice = (profile?.personalAudioAssets ?? [])
    .filter((asset) => asset.enabled && asset.category === "member")
    .filter((asset) => selectedPersonalAudioIds.length === 0 || selectedPersonalAudioIds.includes(asset.id))
    .filter((asset) => [theme.id, "general"].includes(asset.target.trim().toLocaleLowerCase("vi-VN")))
    .sort((left, right) => Number(right.isDefault) - Number(left.isDefault) || right.updatedAt.localeCompare(left.updatedAt))[0];
  const voiceMatchLabel = matchingVoiceLine?.emotion === theme.id || matchingVoiceLine?.state === `emotion-${theme.id}` ? `Bản thu cho cảm xúc “${theme.label}”` : matchingVoiceLine ? `Bản thu ngữ cảnh phù hợp với “${theme.label}”` : "Chưa có bản thu được duyệt cho cảm xúc này";
  const safeCommandHint = useMemo(() => "Ví dụ: vui vẻ, tôi đang mệt, cần đồng hành", []);
  const weekdayLumi = useMemo(() => lumiQuoteForDate(), []);
  const customCongratulation = profile?.lumiCongratulationMessages?.[theme.id]?.[0];
  const lumiCongratulationText = customCongratulation?.text || theme.encouragement;
  const lumiVoiceText = matchingVoiceLine?.text || customCongratulation?.text || weekdayLumi.text;
  const audioChannelVolumes: AudioChannelVolumes = { ...defaultAudioChannelVolumes, environment: profile?.audioMixer?.environment ?? 35, music: profile?.audioMixer?.music ?? 30, uiEffects: profile?.audioMixer?.uiEffects ?? 28, lumi: profile?.audioMixer?.lumi ?? 75, ong: profile?.audioMixer?.ong ?? 75, memberVoice: profile?.audioMixer?.memberVoice ?? 75 };
  const lumiVolume = audioChannelVolumes.lumi;
  const [transitioningEmotion, setTransitioningEmotion] = useState<EmotionId | null>(null);

  useEffect(() => {
    if (restoredEmotionRef.current) return;
    restoredEmotionRef.current = true;
    const saved = window.localStorage.getItem("study-empire:emotion-theme") as EmotionId | null;
    const rootEmotion = document.documentElement.dataset.emotion as EmotionId | undefined;
    const next = emotionThemes.some((item) => item.id === rootEmotion) ? rootEmotion : emotionThemes.some((item) => item.id === saved) ? saved : null;
    if (next && next !== selected) onSelect(next);
  }, [onSelect, selected]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ambientScene = ambientScene;
  }, [ambientScene]);

  useEffect(() => () => { stopAmbient(); lumiAudioRef.current?.pause(); if (emotionTransitionTimerRef.current) window.clearTimeout(emotionTransitionTimerRef.current); if (playbackTickerRef.current) window.cancelAnimationFrame(playbackTickerRef.current); }, []);
  useEffect(() => {
    const tick = () => {
      const voice = lumiAudioRef.current && !lumiAudioRef.current.paused ? lumiAudioRef.current : null;
      const environment = ambientTrackRef.current && !ambientTrackRef.current.paused ? ambientTrackRef.current : null;
      if (voice) setPlaybackStatus((current) => ({ ...current, voice: { ...current.voice, currentTime: voice.currentTime, duration: Number.isFinite(voice.duration) ? voice.duration : current.voice.duration, volume: Math.round(voice.volume * 100), muted: voice.muted } }));
      if (environment) setPlaybackStatus((current) => ({ ...current, environment: { ...current.environment, currentTime: environment.currentTime, duration: Number.isFinite(environment.duration) ? environment.duration : current.environment.duration, volume: Math.round(environment.volume * 100), muted: environment.muted } }));
      playbackTickerRef.current = window.requestAnimationFrame(tick);
    };
    playbackTickerRef.current = window.requestAnimationFrame(tick);
    return () => { if (playbackTickerRef.current) window.cancelAnimationFrame(playbackTickerRef.current); };
  }, []);
  useEffect(() => {
    try { setAmbientMuted(window.localStorage.getItem("study-empire:ambient-muted") === "true"); } catch { /* localStorage có thể bị chặn trong private mode. */ }
  }, []);
  useEffect(() => {
    if (!attentionPreferences.soundEnabled) {
      stopAmbient();
      lumiAudioRef.current?.pause();
    }
  }, [attentionPreferences.soundEnabled]);
  useEffect(() => {
    try { window.localStorage.setItem("study-empire:ambient-muted", String(ambientMuted)); } catch { /* không làm gián đoạn phát audio nếu storage bị chặn. */ }
    const track = ambientTrackRef.current;
    if (track) track.volume = ambientMuted ? 0 : Math.max(0, Math.min(1, audioChannelVolumes.environment / 100));
  }, [ambientMuted, audioChannelVolumes.environment]);

  function setScene(next: AmbientScene) {
    setAmbientScene(next);
    document.documentElement.dataset.ambientScene = next;
  }

  function saveFavoriteScene() {
    setFavoriteScene(ambientScene);
    if (profile) onProfile?.({ ...profile, defaultAmbientScene: ambientScene });
    setMessage(`${sceneOptions.find((item) => item.id === ambientScene)?.label} sẽ là cảnh mặc định khi Ong mở web.`);
  }

  function updateAmbientVolume(scene: AmbientScene, level: number) {
    const next = { ...ambientVolumes, [scene]: level };
    setAmbientVolumes(next);
    if (ambientPlaying && ambientScene === scene && ambientMasterRef.current) {
      const context = audioContextRef.current;
      const target = ambientMuted ? 0 : Math.min(.32, Math.max(.008, level / 100 * .32));
      if (context?.state === "running") {
        ambientMasterRef.current.gain.cancelScheduledValues(context.currentTime);
        ambientMasterRef.current.gain.linearRampToValueAtTime(target, context.currentTime + .12);
      }
    }
    if (profile) onProfile?.({ ...profile, audioMixer: { ...(profile.audioMixer ?? { ambientSceneVolumes: defaultAmbientVolumes, pomodoroLayers: {}, pomodoroBackground: 40, pomodoroBell: 70, environment: 35, music: 30, uiEffects: 28, lumi: 75, ong: 75, memberVoice: 75 }), ambientSceneVolumes: next } });
  }

  function updateAudioChannelVolume(channel: AudioChannel, level: number) {
    if (!profile) return;
    const safeLevel = Math.max(0, Math.min(100, level));
    onProfile?.({ ...profile, audioMixer: { ...(profile.audioMixer ?? { ambientSceneVolumes: defaultAmbientVolumes, pomodoroLayers: {}, pomodoroBackground: 40, pomodoroBell: 70, environment: 35, music: 30, uiEffects: 28, lumi: 75, ong: 75, memberVoice: 75 }), [channel]: safeLevel } });
    if (channel === "lumi" && lumiAudioRef.current) lumiAudioRef.current.volume = safeLevel / 100;
    if (channel === "environment" && ambientTrackRef.current) { ambientTrackRef.current.volume = ambientMuted ? 0 : safeLevel / 100; setPlaybackStatus((current) => current.environment.active ? { ...current, environment: { ...current.environment, volume: ambientMuted ? 0 : safeLevel, muted: ambientMuted } } : current); }
  }
  function updateLumiVolume(level: number) { updateAudioChannelVolume("lumi", level); }

  function setChannelPlaying(channel: PlaybackChannel, active: boolean, label = "", url?: string, volume = 0, muted = false) { setPlaybackStatus((current) => ({ ...current, [channel]: { active, label, url: active ? url : undefined, currentTime: active ? current[channel].currentTime ?? 0 : 0, duration: active ? current[channel].duration : undefined, volume: active ? Math.round(Math.max(0, Math.min(100, volume))) : 0, muted: active ? muted : false } })); }
  function seekPlayback(seconds: number) {
    const channel: PlaybackChannel = lumiAudioRef.current && !lumiAudioRef.current.paused ? "voice" : "environment";
    const audio = channel === "voice" ? lumiAudioRef.current : ambientTrackRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, seconds));
    setPlaybackStatus((current) => ({ ...current, [channel]: { ...current[channel], currentTime: audio.currentTime } }));
  }
  function stopVoicePlayback() { lumiAudioRef.current?.pause(); lumiAudioRef.current = null; setChannelPlaying("voice", false); }

  function stopAmbient() {
    ambientGenerationRef.current += 1;
    const context = audioContextRef.current;
    const master = ambientMasterRef.current;
    if (master && context?.state === "running") {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setValueAtTime(Math.max(0.001, master.gain.value), context.currentTime);
      master.gain.linearRampToValueAtTime(0.001, context.currentTime + 0.22);
    }
    ambientStopRef.current?.();
    ambientStopRef.current = null;
    ambientMasterRef.current = null;
    const track = ambientTrackRef.current;
    ambientTrackRef.current = null;
    if (track) {
      const startVolume = track.volume;
      const startedAt = performance.now();
      const fade = () => {
        const progress = Math.min(1, (performance.now() - startedAt) / 220);
        track.volume = Math.max(0, startVolume * (1 - progress));
        if (progress < 1) window.requestAnimationFrame(fade);
        else { track.pause(); track.removeAttribute("src"); track.load(); }
      };
      window.requestAnimationFrame(fade);
    }
    setAmbientPlaying(false);
    setChannelPlaying("environment", false);
  }

  async function toggleAmbient(scene = ambientScene) {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung. Hãy bật Âm thanh trước."); return; }
    setScene(scene);
    if (ambientPlaying && scene === ambientScene) { stopAmbient(); return; }
    stopAmbient();
    const selectedPreset = profile?.personalStudyPresets?.find((preset) => preset.id === profile.activePersonalStudyPresetId);
    const permittedAssetIds = selectedPreset?.audioAssetIds ?? [];
    const ambientAssets = (profile?.personalAudioAssets ?? [])
      .filter((asset) => asset.enabled && Boolean(asset.url) && (asset.category === "season" || asset.category === "weather" || asset.category === "background"));
    const permittedAmbientAssets = permittedAssetIds.length > 0 ? ambientAssets.filter((asset) => permittedAssetIds.includes(asset.id)) : ambientAssets;
    const sceneAmbientAssets = permittedAmbientAssets.filter((asset) => [scene, "general"].includes(asset.target.trim().toLocaleLowerCase("vi-VN")));
    const personalAmbientAudio = [...sceneAmbientAssets, ...permittedAmbientAssets.filter((asset) => !sceneAmbientAssets.includes(asset))]
      .sort((left, right) => Number(right.isDefault) - Number(left.isDefault) || right.updatedAt.localeCompare(left.updatedAt))[0];
    const selectedAmbientAudio = personalAmbientAudio ?? (scene === "rain" ? DEFAULT_AMBIENT_ASSET : undefined);
    if (selectedAmbientAudio) {
      setAmbientError(null);
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = resolveMediaUrl(selectedAmbientAudio.url);
      audio.loop = true;
      const targetVolume = ambientMuted ? 0 : Math.max(0, Math.min(1, ambientVolumes[scene] / 100 * audioChannelVolumes.environment / 100));
      audio.volume = 0;
      ambientTrackRef.current = audio;
      audio.onerror = () => {
        if (ambientTrackRef.current === audio) {
          ambientTrackRef.current = null;
          setAmbientPlaying(false);
          setChannelPlaying("environment", false);
          setAmbientError(`Không tải được “${selectedAmbientAudio.name}”. Hãy kiểm tra URL HTTPS hoặc thử lại.`);
          setMessage("Âm nền chưa tải được. Bạn có thể nhấn Thử lại sau khi kiểm tra tệp.");
        }
      };
      void audio.play().then(() => {
        if (ambientTrackRef.current !== audio) return;
        const startedAt = performance.now();
        const fadeIn = () => {
          const progress = Math.min(1, (performance.now() - startedAt) / 320);
          audio.volume = targetVolume * progress;
          if (progress < 1 && ambientTrackRef.current === audio) window.requestAnimationFrame(fadeIn);
        };
        window.requestAnimationFrame(fadeIn);
        setAmbientPlaying(true);
        setChannelPlaying("environment", true, selectedAmbientAudio.name, resolveMediaUrl(selectedAmbientAudio.url), ambientMuted ? 0 : ambientVolumes[scene] / 100 * audioChannelVolumes.environment, ambientMuted);
        setMessage(selectedAmbientAudio.source === "built_in" ? `Đang phát âm nền mặc định “${selectedAmbientAudio.name}”.` : `Đang phát âm nền cá nhân “${selectedAmbientAudio.name}”.`);
      }).catch(() => {
        if (ambientTrackRef.current === audio) {
          ambientTrackRef.current = null;
          setAmbientPlaying(false);
          setChannelPlaying("environment", false);
          setAmbientError("Trình duyệt đang chặn phát tự động hoặc tệp không hợp lệ. Hãy nhấn Thử lại.");
          setMessage("Âm nền chưa phát được. Hãy nhấn Thử lại sau một thao tác chạm.");
        }
      });
      return;
    }
    setAmbientPlaying(false);
    setChannelPlaying("environment", false);
    setAmbientError(`Chưa có tệp âm nền hợp lệ cho cảnh ${sceneOptions.find((item) => item.id === scene)?.label.toLowerCase()}.`);
    setMessage("Chưa có bản thu âm nền hợp lệ cho cảnh này. Bạn có thể chọn Mưa để nghe bản mặc định hoặc tải tệp riêng trong Audio Center.");
  }

  useEffect(() => {
    if (!attentionPreferences.soundEnabled) return;
    let disposed = false;
    const tryStartAmbient = () => {
      if (disposed || ambientTrackRef.current || ambientPlaying) return;
      void toggleAmbient();
    };
    tryStartAmbient();
    const resumeAfterGesture = () => {
      tryStartAmbient();
      if (ambientTrackRef.current) {
        window.removeEventListener("pointerdown", resumeAfterGesture);
        window.removeEventListener("keydown", resumeAfterGesture);
        window.removeEventListener("touchstart", resumeAfterGesture);
      }
    };
    window.addEventListener("pointerdown", resumeAfterGesture, { passive: true });
    window.addEventListener("keydown", resumeAfterGesture);
    window.addEventListener("touchstart", resumeAfterGesture, { passive: true });
    return () => {
      disposed = true;
      window.removeEventListener("pointerdown", resumeAfterGesture);
      window.removeEventListener("keydown", resumeAfterGesture);
      window.removeEventListener("touchstart", resumeAfterGesture);
    };
  }, []);

  async function playEmotionTransitionSound(id: EmotionId) {
    if (!attentionPreferences.soundEnabled || lumiVolume <= 0) return;
    try {
      const context = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = context;
      if (context.state !== "running") await context.resume();
      if (context.state !== "running") return;
      const master = context.createGain();
      master.gain.value = Math.min(.16, lumiVolume / 1000);
      master.connect(context.destination);
      const notes = id === "stressed" || id === "overwhelmed" ? [261.63, 329.63] : id === "happy" || id === "excited" || id === "proud" ? [523.25, 659.25] : [392, 493.88];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator(); const gain = context.createGain(); const startAt = context.currentTime + index * .11;
        oscillator.type = "sine"; oscillator.frequency.setValueAtTime(frequency, startAt); gain.gain.setValueAtTime(.001, startAt); gain.gain.exponentialRampToValueAtTime(1, startAt + .025); gain.gain.exponentialRampToValueAtTime(.001, startAt + .22); oscillator.connect(gain).connect(master); oscillator.start(startAt); oscillator.stop(startAt + .25);
      });
      window.setTimeout(() => master.disconnect(), 520);
    } catch { /* Hiệu ứng là bổ trợ; đổi cảm xúc vẫn luôn hoạt động khi thiết bị không phát âm thanh. */ }
  }

  function selectEmotion(id: EmotionId) {
    const next = emotionThemes.find((item) => item.id === id) ?? emotionThemes[0];
    if (next.id === selected) { setMessage(`${next.emoji} ${profile?.lumiCongratulationMessages?.[next.id]?.[0]?.text || next.encouragement}`); return; }
    onSelect(next.id);
    window.dispatchEvent(new CustomEvent<EmotionId>("study-empire:emotion-change", { detail: next.id }));
    if (attentionPreferences.animationsEnabled) {
      setTransitioningEmotion(next.id);
      if (emotionTransitionTimerRef.current) window.clearTimeout(emotionTransitionTimerRef.current);
      emotionTransitionTimerRef.current = window.setTimeout(() => setTransitioningEmotion(null), 460);
    }
    void playEmotionTransitionSound(next.id);
    setMessage(`${next.emoji} ${profile?.lumiCongratulationMessages?.[next.id]?.[0]?.text || next.encouragement}`);
  }

  function playLumiVoice() {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung."); return; }
    const voiceUrl = preferredCompanionAudio("lumi")?.url || preferredPersonalVoice?.url || companionMedia?.lumiVoiceUrl || matchingVoiceLine?.audioUrl;
    if (voiceUrl) {
      stopVoicePlayback(); const audio = new Audio(voiceUrl); audio.volume = 0; audio.onended = () => { if (lumiAudioRef.current === audio) { lumiAudioRef.current = null; setChannelPlaying("voice", false); } }; lumiAudioRef.current = audio; void audio.play().then(() => { setChannelPlaying("voice", true, "Lumi · lời động viên"); const startedAt = performance.now(); const fadeIn = () => { const progress = Math.min(1, (performance.now() - startedAt) / 220); audio.volume = lumiVolume / 100 * progress; if (progress < 1 && lumiAudioRef.current === audio) window.requestAnimationFrame(fadeIn); }; window.requestAnimationFrame(fadeIn); }).catch(() => setMessage("Không thể phát bản thu này. Lumi vẫn để lại lời nhắn ở bên cạnh.")); return;
    }
    setMessage("Chưa có bản thu Lumi cho lời nhắn này. Ong có thể thêm bản thu trong thư viện rồi chủ động nhấn nghe.");
  }

  function playOngVoice() {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung."); return; }
    const voiceUrl = preferredCompanionAudio("ong")?.url;
    if (!voiceUrl) { setMessage("Chưa có bản thu Ong cho cảm xúc này. Ong có thể thêm loại “Lời Ong” trong thư viện âm thanh cá nhân."); return; }
    stopVoicePlayback(); const audio = new Audio(voiceUrl); audio.volume = 0; audio.onended = () => { if (lumiAudioRef.current === audio) { lumiAudioRef.current = null; setChannelPlaying("voice", false); } }; lumiAudioRef.current = audio; void audio.play().then(() => { setChannelPlaying("voice", true, "Ong · lời động lực"); const startedAt = performance.now(); const fadeIn = () => { const progress = Math.min(1, (performance.now() - startedAt) / 220); audio.volume = audioChannelVolumes.ong / 100 * progress; if (progress < 1 && lumiAudioRef.current === audio) window.requestAnimationFrame(fadeIn); }; window.requestAnimationFrame(fadeIn); }).catch(() => setMessage("Không thể phát bản thu Ong này."));
  }

  function playMemberVoice() {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung."); return; }
    if (!preferredMemberVoice?.url) { setMessage("Chưa có bản ghi của thành viên cho cảm xúc này. Hãy thêm bản ghi loại “Thành viên” trong Audio Center."); return; }
    stopVoicePlayback();
    const audio = new Audio(preferredMemberVoice.url);
    audio.volume = 0;
    audio.onended = () => { if (lumiAudioRef.current === audio) { lumiAudioRef.current = null; setChannelPlaying("voice", false); } };
    lumiAudioRef.current = audio;
    void audio.play().then(() => {
      setChannelPlaying("voice", true, `Thành viên · ${preferredMemberVoice.name}`);
      const startedAt = performance.now();
      const fadeIn = () => { const progress = Math.min(1, (performance.now() - startedAt) / 220); audio.volume = audioChannelVolumes.memberVoice / 100 * progress; if (progress < 1 && lumiAudioRef.current === audio) window.requestAnimationFrame(fadeIn); };
      window.requestAnimationFrame(fadeIn);
      setMessage(`Đang phát bản ghi của thành viên: “${preferredMemberVoice.name}”.`);
    }).catch(() => setMessage("Không thể phát bản ghi của thành viên này."));
  }

  function toggleAmbientMute() {
    setAmbientMuted((muted) => !muted);
    setMessage(ambientMuted ? "Đã bật lại âm nền." : "Đã tắt tiếng âm nền; các kênh thoại vẫn giữ nguyên.");
  }

  function playCleanAmbientAsset(url: string, label: string) {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung."); return; }
    ambientTrackRef.current?.pause();
    const audio = new Audio(resolveMediaUrl(url));
    audio.volume = 0;
    audio.onended = () => { if (ambientTrackRef.current === audio) ambientTrackRef.current = null; };
    ambientTrackRef.current = audio;
    void audio.play().then(() => {
      const startedAt = performance.now();
      const fadeIn = () => { const progress = Math.min(1, (performance.now() - startedAt) / 220); audio.volume = ambientMuted ? 0 : audioChannelVolumes.environment / 100 * progress; if (progress < 1 && ambientTrackRef.current === audio) window.requestAnimationFrame(fadeIn); };
      window.requestAnimationFrame(fadeIn);
      setChannelPlaying("environment", true, label);
      setMessage(`Đang nghe thử âm thanh sạch: ${label}.`);
    }).catch(() => { if (ambientTrackRef.current === audio) ambientTrackRef.current = null; setMessage(`Không thể phát ${label}. Hãy kiểm tra bản thu hoặc URL HTTPS.`); });
  }

  function chooseSpeechGroup(group: SpeechGroup) {
    setSpeechGroup(group); const event = group === "comfort" ? "mistake" : group === "encouragement" || group === "understanding" ? "start" : "procrastination"; const context = event === "mistake" ? "mistake" : event === "start" ? "start" : "procrastination"; const custom = activeContentFor({ customContent }, "antiProcrastination", context, recentContentIds);
    if (custom) { setSpeech({ id: custom.id, group, event, text: custom.text, action: custom.kind === "microTask" ? "Mở nhiệm vụ nhỏ" : undefined }); setRecentContentIds((ids) => [...ids.filter((id) => id !== custom.id), custom.id].slice(-5)); }
    else setSpeech(speechForEvent(event, group));
  }
  function chooseAntiProcrastination(id: "five" | "review" | "lumi") { if (id === "five") onStartTwoMinutes?.(); if (id === "review") setSpeech({ ...speechForEvent("ineffective", "understanding"), text: "Lumi chọn cho Ong: mở lại một phần bài cũ trong 5 phút thôi nhé." }); if (id === "lumi") { setSpeech(randomAntiProcrastinationSpeech()); setMicroTask(randomMicroTask()); setReminder(gentleReminders[Math.floor(Math.random() * gentleReminders.length)] ?? gentleReminders[0]); } setMessage(id === "five" ? "Lumi ở đây. Mình bắt đầu thật nhẹ nhé." : "Lumi đã chọn một nhiệm vụ nhỏ cho Ong."); }
  function chooseLazy(level: "mild" | "very" | "none") { if (lazyLevel === level) { setLazyLevel(null); setMessage("Đã bỏ chọn Chế độ lười."); return; } setLazyLevel(level); setMessage("Không ép buộc. Ong chỉ cần một bước nhỏ khi sẵn sàng."); }

  return <section className="panel emotion-studio relative overflow-hidden border-2 border-[#c62828]/15 bg-[linear-gradient(135deg,#fff7f2_0%,#f5fff5_100%)] p-5 sm:p-6" aria-labelledby="emotion-studio-title">
    <div className={`ambient-scene ambient-scene-${ambientScene}`} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#c62828]">Không gian cảm xúc của Lumi</p><h2 id="emotion-studio-title" className="mt-2 font-display text-2xl font-black text-[#7f1d1d]">Hôm nay Ong đang cảm thấy thế nào?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#3f513f]">Chọn cảm xúc để đổi màu toàn ứng dụng và nhận lời đồng hành phù hợp. Âm nền chỉ phát khi Ong chủ động nhấn nút.</p></div><div className="flex items-center gap-3 rounded-2xl border border-[#2e7d32]/20 bg-white/85 px-3 py-3 shadow-sm">{profile?.showLumi !== false ? configuredLumiImage ? <img key={theme.id} src={configuredLumiImage} alt={`Lumi khi ${theme.label}`} className={`h-20 w-16 rounded-2xl object-cover object-top ${transitioningEmotion === theme.id ? "lumi-emotion-transition" : ""}`} /> : <div className="flex h-20 w-16 items-center justify-center rounded-2xl border border-dashed border-[#c62828]/30 bg-[#fff7ed] text-center text-[10px] font-bold text-[#9a3412]">Chưa có ảnh</div> : null}<div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Bạn đồng hành</p><p className="mt-1 text-sm font-black text-[#7f1d1d]">Lumi</p><span className="text-xs text-[#35523a]">{profile?.showLumi === false ? "Ảnh Lumi đang ẩn" : `Đang ở bên Ong · ${theme.label}`}</span></div>{profile?.showMascot !== false ? <OngLearnerAvatar size="sm" label imageUrl={configuredMascotImage} emotion={theme.id} /> : null}</div></div>
    <AttentionControls preferences={attentionPreferences} onToggle={(key) => profile && onProfile?.({ ...profile, [key]: !attentionPreferences[key] })} />
    {profile && onProfile ? <PersonalStudySpaceControls profile={profile} emotion={theme.id} onEmotion={onSelect} onProfile={onProfile} /> : null}
    {profile && onProfile ? <LumiCongratulationControls profile={profile} emotion={theme.id} emotionLabel={theme.label} onProfile={onProfile} /> : null}
    <div className="relative z-10 mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{emotionThemes.map((item) => <div key={item.id} className={`relative rounded-2xl border ${item.id === selected ? "border-[var(--emotion-primary)] bg-[var(--emotion-soft)] shadow-md" : "border-[#2e7d32]/15 bg-white/75"}`}><button type="button" aria-pressed={item.id === selected} onClick={() => selectEmotion(item.id)} className="w-full p-3 pr-10 text-left text-[var(--emotion-ink)]"><span className="text-xl" aria-hidden="true">{item.emoji}</span><b className="mt-1 block text-sm">{item.label}</b><small className="mt-1 block text-[11px] leading-4 opacity-75">{item.description}</small></button><button type="button" aria-label={`Phát âm nền cho cảm xúc ${item.label}`} onClick={() => toggleAmbient(item.id === "sad" || item.id === "tired" ? "rain" : item.id === "happy" || item.id === "proud" ? "morning" : item.id === "stressed" ? "storm" : "leaves")} className="absolute bottom-2 right-2 rounded-lg border border-[#c62828]/20 bg-white/95 p-1.5 text-[#c62828] shadow-sm"><Volume2 className="h-3.5 w-3.5" /></button></div>)}</div>
    <PersistentCollapsible storageKey="experience-ambient-audio" eyebrow="Không gian cảm xúc" title="Âm thanh và cảnh nền" className="relative z-10 mt-4 border-[#2e7d32]/20 bg-white/85">
    <section className="rounded-2xl" aria-label="Âm thanh và cảnh nền">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Âm thanh và cảnh nền</p><p className="mt-1 text-xs text-[#35523a]">Cảnh nền sẽ tự phát nếu trình duyệt cho phép. Nếu autoplay bị chặn, hãy nhấn nút <b>Phát thử âm nền</b> để chủ động kích hoạt.</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" aria-pressed={ambientMuted} onClick={toggleAmbientMute} className="rounded-xl border border-[#c62828]/25 bg-white px-3 py-2 text-xs font-black text-[#c62828]">{ambientMuted ? <><VolumeX className="mr-1 inline h-3.5 w-3.5" />Bật tiếng âm nền</> : <><Volume2 className="mr-1 inline h-3.5 w-3.5" />Mute âm nền</>}</button><button type="button" onClick={() => toggleAmbient()} className="rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white shadow-sm ring-2 ring-[#c62828]/20 ring-offset-1">{ambientPlaying ? <><Pause className="mr-1 inline h-3.5 w-3.5" />Dừng âm nền</> : <><Play className="mr-1 inline h-3.5 w-3.5" />Phát thử âm nền</>}</button></div></div>
      {ambientError ? <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#c62828]/25 bg-[#fff0eb] px-3 py-2 text-xs font-bold text-[#7f1d1d]" role="alert"><span>{ambientError}</span><button type="button" onClick={() => { setAmbientError(null); void toggleAmbient(); }} className="rounded-lg bg-[#c62828] px-3 py-1.5 font-black text-white">Thử lại âm nền</button></div> : null}
      <div className="mt-3 rounded-xl border border-[#c62828]/15 bg-[#fff8f5] px-3 py-2"><label className="block text-xs font-black text-[#7f1d1d]">Âm lượng âm nền <span className="float-right">{audioChannelVolumes.environment}%</span><input type="range" min="0" max="100" value={audioChannelVolumes.environment} onChange={(event) => updateAudioChannelVolume("environment", Number(event.target.value))} className="mt-2 w-full accent-[#c62828]" aria-label="Âm lượng âm nền" /></label></div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{sceneOptions.map((scene) => { const Icon = scene.icon; return <button key={scene.id} type="button" aria-pressed={ambientScene === scene.id} onClick={() => setScene(scene.id)} className={`rounded-xl border p-2 text-left text-xs ${ambientScene === scene.id ? "border-[#c62828] bg-[#fff0eb] text-[#7f1d1d]" : "border-[#2e7d32]/15 bg-white text-[#35523a]"}`}><Icon className="h-4 w-4" /><b className="mt-1 block">{scene.label}</b><span className="text-[10px] opacity-75">{scene.detail}</span></button>; })}</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#eff9ef] p-2"><p className="text-xs font-bold text-[#35523a]">Mặc định hiện tại: <b>{sceneOptions.find((item) => item.id === favoriteScene)?.label}</b></p><button type="button" onClick={saveFavoriteScene} className="rounded-lg border border-[#2e7d32]/30 bg-white px-2.5 py-1.5 text-xs font-black text-[#2e7d32]">Lưu cảnh này làm mặc định</button></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2" aria-label="Mixer âm lượng cảnh nền">
        {sceneOptions.map((scene) => <label key={`${scene.id}-volume`} className="rounded-xl border border-[#2e7d32]/15 bg-white px-3 py-2 text-xs text-[#35523a]"><span className="flex items-center justify-between font-bold"><span>{scene.label}</span><span>{ambientVolumes[scene.id]}%</span></span><input type="range" min="0" max="100" value={ambientVolumes[scene.id]} onChange={(event) => updateAmbientVolume(scene.id, Number(event.target.value))} className="mt-2 w-full accent-[#c62828]" aria-label={`Âm lượng ${scene.label}`} /></label>)}
        <label className="rounded-xl border border-[#c62828]/15 bg-white px-3 py-2 text-xs text-[#6f2424]"><span className="flex items-center justify-between font-bold"><span>Giọng Lumi</span><span>{lumiVolume}%</span></span><input type="range" min="0" max="100" value={lumiVolume} onChange={(event) => updateLumiVolume(Number(event.target.value))} className="mt-2 w-full accent-[#c62828]" aria-label="Âm lượng giọng Lumi" /></label>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2" aria-label="Mixer âm lượng theo nguồn">
        {(Object.entries({ environment: "Môi trường", music: "Nhạc nền", uiEffects: "Hiệu ứng", lumi: "Giọng Lumi", ong: "Giọng Ong", memberVoice: "Bản ghi thành viên" }) as [keyof AudioChannelVolumes, string][]).map(([channel, label]) => <label key={channel} className="rounded-xl border border-[#2e7d32]/15 bg-white px-3 py-2 text-xs text-[#35523a]"><span className="flex items-center justify-between font-bold"><span>{label}</span><span>{audioChannelVolumes[channel]}%</span></span><input type="range" min="0" max="100" value={audioChannelVolumes[channel]} onChange={(event) => updateAudioChannelVolume(channel, Number(event.target.value))} className="mt-2 w-full accent-[#2e7d32]" aria-label={`Âm lượng ${label}`} /></label>)}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2" aria-label="Âm thanh nền sạch">
        {[{ id: "rain", label: "Mưa rơi", detail: "Chỉ dùng bản thu thật đã thêm vào thư viện" }, { id: "book", label: "Lật sách", detail: "Hiệu ứng ngắn, phát khi Ong chủ động nhấn" }].map((effect) => { const asset = (profile?.personalAudioAssets ?? []).find((item) => item.enabled && item.category === "background" && item.target.toLocaleLowerCase("vi-VN") === effect.id); return <button key={effect.id} type="button" onClick={() => asset ? playCleanAmbientAsset(asset.url, effect.label) : setMessage(`Chưa có asset sạch cho ${effect.label}. Hãy thêm bản thu environment với target “${effect.id}”.`)} className="rounded-xl border border-[#2e7d32]/15 bg-[#f5fff5] p-3 text-left text-xs text-[#35523a]"><span className="block font-black">{effect.label}</span><span className="mt-1 block opacity-75">{asset ? "Có bản thu · nghe thử" : "Chưa có bản thu · không phát âm giả"}</span></button>; })}
      </div>
    </section>
    </PersistentCollapsible>
    <PersistentCollapsible storageKey="experience-emotion-command" eyebrow="Tùy chỉnh cảm xúc" title="Câu lệnh đổi giao diện" className="relative z-10 mt-4 border-[#c62828]/15 bg-white/85"><div><label htmlFor="emotion-command" className="text-sm font-black text-[#7f1d1d]">Nhập cảm xúc hoặc câu lệnh</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="emotion-command" value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") selectEmotion(emotionFromCommand(command).id); }} placeholder={safeCommandHint} className="field flex-1 border-[#2e7d32]/25 bg-white" /><button type="button" onClick={() => selectEmotion(emotionFromCommand(command).id)} className="primary-button justify-center bg-[#c62828] hover:bg-[#a91f1f]">Áp dụng</button></div>{message ? <p className="mt-2 text-xs font-bold text-[#2e7d32]" role="status">{message}</p> : null}</div></PersistentCollapsible>
    <PersistentCollapsible storageKey="experience-lumi-speech-library" eyebrow="Đồng hành cùng Lumi" title="Lời an ủi và động viên" className="relative z-10 mt-5 border-2 border-[#2e7d32]/15 bg-[#f5fff5]/95"><section aria-labelledby="speech-library-title"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Lời an ủi và động viên từ Lumi</p><h3 id="speech-library-title" className="mt-1 text-lg font-black text-[#7f1d1d]">Lumi ở đây để đồng hành cùng Ong</h3></div><span className="rounded-full bg-[#c62828] px-3 py-1 text-xs font-black text-white">{speechGroupLabels[speechGroup]}</span></div><div className="mt-3 flex flex-wrap gap-2">{(Object.entries(speechGroupLabels) as [SpeechGroup, string][]).map(([group, label]) => <button key={group} type="button" onClick={() => chooseSpeechGroup(group)} className={`rounded-xl px-3 py-2 text-xs font-black ${speechGroup === group ? "bg-[#c62828] text-white" : "bg-white text-[#2e7d32]"}`}>{label}</button>)}</div><div className="mt-3 flex gap-3 rounded-2xl bg-[#fff0eb] p-4">{profile?.companionEmotionMedia?.[selected]?.lumiImageUrl ? <img src={resolveMediaUrl(profile.companionEmotionMedia[selected].lumiImageUrl)} alt="Lumi đang động viên Ong" className="h-20 w-16 rounded-xl object-cover object-top" /> : <div className="flex h-20 w-16 items-center justify-center rounded-xl border border-dashed border-[#c62828]/30 bg-white text-center text-[10px] font-black text-[#8e1b1b]">Chưa có ảnh</div>}<div className="min-w-0 flex-1"><p className="text-[11px] font-black uppercase tracking-wider text-[#2e7d32]">Thư viện Lumi · {weekdayLumi.label}</p><p className="mt-1 text-sm font-bold leading-6 text-[#6f2424]">{lumiVoiceText}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={playLumiVoice} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white"><Volume2 className="mr-1 inline h-3.5 w-3.5" />Nghe bản thu Lumi</button>{profile?.companionMode === "ong" || profile?.companionMode === "both" || !profile?.companionMode ? <button type="button" onClick={playOngVoice} className="rounded-xl border border-[#c62828]/25 bg-white px-3 py-2 text-xs font-black text-[#c62828]"><Volume2 className="mr-1 inline h-3.5 w-3.5" />Nghe bản thu Ong</button> : null}{preferredMemberVoice ? <button type="button" onClick={playMemberVoice} className="rounded-xl border border-[#7f1d1d]/20 bg-white px-3 py-2 text-xs font-black text-[#7f1d1d]"><Volume2 className="mr-1 inline h-3.5 w-3.5" />Nghe bản ghi thành viên</button> : null}</div>{matchingVoiceLine?.audioUrl ? <span className="mt-2 block text-[11px] font-bold text-[#2e7d32]">Dùng bản thu đã lưu</span> : <span className="mt-2 block text-[11px] text-[#6f5a53]">Chưa có bản thu; Ong có thể tự thêm trong thư viện.</span>}</div></div><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#2e7d32]/20 bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">🫠 Chống trì hoãn</p><div className="mt-2 flex flex-wrap gap-2">{antiProcrastinationChoices.map((choice) => <button key={choice.id} type="button" onClick={() => chooseAntiProcrastination(choice.id)} className="rounded-xl border border-[#2e7d32]/20 bg-[#eff9ef] px-3 py-2 text-left text-xs font-black text-[#2e7d32]"><span className="block">{choice.label}</span><small className="mt-1 block font-medium text-[#35523a]">{choice.description}</small></button>)}</div></div><div className="rounded-2xl border border-[#c62828]/15 bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">🎯 Nhiệm vụ siêu nhỏ</p><p className="mt-2 text-sm font-black text-[#35523a]">{microTask}</p><button type="button" onClick={() => setMicroTask(randomMicroTask())} className="mt-3 rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white">Đổi nhiệm vụ</button></div></div></section></PersistentCollapsible>
    {profile && onProfile ? <AudioCenterEnhancements profile={profile} onProfile={onProfile} voiceLines={voiceLines} playbackStatus={playbackStatus} onPlayAsset={(url: string, channel: PlaybackChannel, label: string, volume?: number, playbackRate?: number) => { if (channel === "voice") stopVoicePlayback(); if (channel === "environment") stopAmbient(); const audio = new Audio(resolveMediaUrl(url)); audio.volume = 0; audio.playbackRate = playbackRate ?? 1; audio.onended = () => setChannelPlaying(channel, false); if (channel === "voice") lumiAudioRef.current = audio; else ambientTrackRef.current = audio; void audio.play().then(() => { setChannelPlaying(channel, true, label, url, volume ?? (channel === "voice" ? lumiVolume : audioChannelVolumes.environment), false); const target = Math.max(0, Math.min(1, (volume ?? (channel === "voice" ? lumiVolume : audioChannelVolumes.environment)) / 100)); const startedAt = performance.now(); const fadeIn = () => { const progress = Math.min(1, (performance.now() - startedAt) / 220); audio.volume = target * progress; if (progress < 1 && !audio.paused) window.requestAnimationFrame(fadeIn); }; window.requestAnimationFrame(fadeIn); }).catch(() => setMessage(`Không thể phát ${label}.`)); }} onStopPlayback={(channel) => { if (!channel || channel === "voice") stopVoicePlayback(); if (!channel || channel === "environment") stopAmbient(); }} onSeekPlayback={seekPlayback} /> : null}
    <aside className={`relative z-10 mt-4 rounded-2xl border p-3 text-sm ${matchingVoiceLine?.audioUrl ? "border-[#2e7d32]/25 bg-[#eff9ef] text-[#25582c]" : "border-amber-200 bg-amber-50 text-amber-900"}`} aria-live="polite"><b className="block text-xs uppercase tracking-wider">Giọng Lumi theo cảm xúc</b><span className="mt-1 block">{voiceMatchLabel}{matchingVoiceLine?.audioUrl ? " — nhấn “Nghe bản thu Lumi” để phát." : " — chưa có bản thu; Lumi vẫn hiển thị lời nhắn bên cạnh."}</span></aside>
    <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-[#fff0eb]/95 p-4">
        <div className="flex items-start gap-3">{voiceLinkedLumiImage ? <img key={`message-${theme.id}`} src={voiceLinkedLumiImage} alt="Ảnh Lumi gắn với giọng đang chọn" className={`h-14 w-12 rounded-xl object-cover object-top ${transitioningEmotion === theme.id ? "lumi-emotion-transition" : ""}`} /> : <div className="flex h-14 w-12 items-center justify-center rounded-xl border border-dashed border-[#c62828]/30 bg-[#fff7ed] text-center text-[9px] font-bold text-[#9a3412]">Chưa có ảnh</div>}<div><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">Lời chúc của Lumi</p><p className="mt-2 text-sm font-bold leading-6 text-[#6f2424]">{lumiCongratulationText}</p></div></div>
        <p className="mt-3 text-xs text-[#6f5a53]">{customCongratulation ? "Đây là lời chúc riêng do Ong đã lưu cho cảm xúc này." : "Lumi đang ở đây cùng Ong — không phán xét, chỉ cùng mình đi tiếp."}</p>
        <button type="button" onClick={playLumiVoice} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white shadow-sm"><Volume2 className="h-3.5 w-3.5" />{matchingVoiceLine?.audioUrl ? "Nghe lời thoại Lumi" : "Thêm hoặc nghe bản thu Lumi"}</button>
      </div>
      <div className="rounded-2xl bg-[#eff9ef]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Chế độ lười</p><p className="mt-2 text-sm leading-6 text-[#35523a]">Không ép buộc. Chọn mức năng lượng hiện tại:</p><div className="mt-3 flex flex-wrap gap-2">{([ ["mild", "😌 Hơi lười"], ["very", "🥱 Rất lười"], ["none", "🫠 Không muốn làm gì"] ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={lazyLevel === value} onClick={() => chooseLazy(value)} className={`rounded-xl px-2.5 py-2 text-xs font-black ${lazyLevel === value ? "bg-[#2e7d32] text-white" : "bg-white text-[#2e7d32]"}`}>{label}</button>)}</div><button type="button" onClick={onStartTwoMinutes} className="mt-3 rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white">⏱ Thử 2 phút</button></div>
      <div className="rounded-2xl bg-[#fff9e8]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#9a5b00]">Boss Trì hoãn</p><p className="mt-2 text-sm font-bold text-[#6b4a1f]">👾 HP 100% · Mỗi phiên hoàn thành: −20 HP</p><div className="mt-3 h-2 rounded-full bg-[#ead9b3]"><div className="h-full w-full rounded-full bg-[#c62828]" /></div><p className="mt-2 text-xs text-[#6b4a1f]">Metaphor vui, không phải bảng phạt.</p></div>
      <div className="rounded-2xl bg-[#f5fff5]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Ong vs Trì hoãn</p><div className="mt-3 flex items-center justify-between text-center"><div><div className="text-2xl">🐝</div><b className="text-xs text-[#2e7d32]">Ong +1</b></div><span className="text-xs font-black text-[#c62828]">VS</span><div><div className="text-2xl">🫠</div><b className="text-xs text-[#9a5b00]">Trì hoãn</b></div></div><p className="mt-3 text-xs leading-5 text-[#35523a]">Mỗi lần bắt đầu là Ong đang thắng một chút.</p></div>
    </div>
  </section>;
}

function AttentionControls({ preferences, onToggle }: { preferences: AttentionPreferences; onToggle: (key: keyof AttentionPreferences) => void }) {
  const items: Array<{ key: keyof AttentionPreferences; label: string; detail: string }> = [
    { key: "animationsEnabled", label: "Hoạt ảnh", detail: "Hiệu ứng chuyển động và cảnh nền" },
    { key: "popupsEnabled", label: "Popup", detail: "Thông báo nổi không thiết yếu" },
    { key: "soundEnabled", label: "Âm thanh", detail: "Lời Lumi, âm nền và chuông" },
  ];
  return <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-3">{items.map((item) => <button key={item.key} type="button" aria-pressed={preferences[item.key]} onClick={() => onToggle(item.key)} className={`rounded-xl border p-3 text-left ${preferences[item.key] ? "border-[#2e7d32]/25 bg-[#eff9ef] text-[#25582c]" : "border-slate-200 bg-white/80 text-slate-500"}`}><span className="text-sm font-black">{item.label}</span><small className="mt-1 block text-[11px] font-medium opacity-75">{preferences[item.key] ? item.detail : `${item.detail} · đang tạm dừng`}</small></button>)}</div>;
}
