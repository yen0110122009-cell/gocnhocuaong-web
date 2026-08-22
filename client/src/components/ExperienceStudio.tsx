import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bird, Building2, Cloud, CloudRain, CloudSun, Coffee, Eye, EyeOff, Flower2, Ghost, Heart, Leaf, Mic, Moon, PartyPopper, Pause, Play, Snowflake, Sparkles, Star, Sun, Trash2, Upload, Volume2, VolumeX, Zap } from "lucide-react";
import { emotionFromCommand, emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { lumiQuoteForDate } from "../lib/lumiDailyQuotes";
import { activeContentFor, antiProcrastinationChoices, gentleReminders, randomAntiProcrastinationSpeech, randomMicroTask, speechForEvent, speechGroupLabels, type SpeechGroup } from "../lib/speechLibrary";
import type { AmbientScenePreference, AppConfig, ProfileState, SceneEffectPreferences } from "../../../shared/study";
import { LumiCongratulationControls } from "./LumiCongratulationControls";
import { PersistentCollapsible } from "./PersistentCollapsible";
import { trpc } from "@/lib/trpc";
import { resolveMediaUrl } from "../lib/runtime";
import { DEFAULT_AMBIENT_ASSET, DEFAULT_AMBIENT_BOOK_PAGES_ASSET, DEFAULT_AMBIENT_MORNING_ASSET, DEFAULT_AMBIENT_STORM_ASSET, DEFAULT_POMODORO_AMBIENT_PRESET, PROVIDED_THEME_AMBIENT_ASSETS } from "../lib/defaultAmbient";
import { FESTIVE_THEME_CONFIGS } from "../lib/festiveThemes";
import { festiveAmbientFor } from "../lib/festiveAmbient";
import { AudioCenterEnhancements, type AudioChannel as PlaybackChannel, type PlaybackStatus as AudioPlaybackStatus } from "./AudioCenterEnhancements";
import { resolveAutomatedScene } from "../lib/sceneAutomation";

type AttentionPreferences = { animationsEnabled: boolean; popupsEnabled: boolean; soundEnabled: boolean };
type AmbientScene = AmbientScenePreference;
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

const AUDIO_BACKED_SCENE_IDS = new Set<AmbientScene>(["morning", "rain", "storm", "tet", "space", "rainy_season", "stormy_season", "morning_chill", "coffee", "spring-blossom", "summer-beach", "autumn-leave", "winter-snow", "halloween-spooky", "lunar-new-year", "thunder-storm", "rainy-day", "sunny-day", "foggy-morning", "summer-ocean", "autumn-maple", "tet-vietnam", "halloween-night", "ghost-month", "xmas-holiday", "teachers-day", "vietnam-heroes", "rainy-ripple", "windy-dust", "fire-element", "girly-pastel", "hung-kings-festival", "youth-volunteers", "dien-bien-phu-victory", "liberation-day", "vpa-day", "mid-autumn", "water-element", "air-wind-element", "earth-element", "masculine-cyber", "oriental-wuxia", "mekong-delta", "hanoi-old-quarter", "mini-hologram-cosmos", "aurora-borealis", "arcade-retro", "magic-chess", "lofi-rain-chill", "fairy-tale", ...FESTIVE_THEME_CONFIGS.map((theme) => theme.id as AmbientScene)]);
const sceneOptions: Array<{ id: AmbientScene; label: string; detail: string; icon: typeof Bird }> = [
  { id: "spring-blossom", label: "Mùa Xuân Thanh Tân", detail: "chim én · hoa đào · hoa mai", icon: Flower2 },
  { id: "morning", label: "Buổi sáng", detail: "chim hót · nắng nhẹ", icon: Bird },
  { id: "rain", label: "Mưa", detail: "mưa rơi · thư giãn", icon: CloudRain },
  { id: "snow", label: "Tuyết", detail: "tĩnh lặng · dịu mắt", icon: Snowflake },
  { id: "leaves", label: "Lá rơi", detail: "gió nhẹ · mùa thu", icon: Leaf },
  { id: "storm", label: "Sấm chớp", detail: "mưa xa · tập trung", icon: Zap },
  { id: "summer", label: "Mùa hè", detail: "nắng vàng · bướm bay", icon: Sun },
  { id: "spring", label: "Mùa xuân", detail: "hoa rơi · mầm xanh", icon: Flower2 },
  { id: "tet", label: "Tết", detail: "đèn lồng · pháo hoa", icon: PartyPopper },
  { id: "halloween", label: "Halloween", detail: "dơi bay · bí ẩn", icon: Ghost },
  { id: "desert", label: "Sa mạc", detail: "cát vàng · xương rồng", icon: Sun },
  { id: "night", label: "Cảnh đêm", detail: "đèn vàng · sương nhẹ", icon: Moon },
  { id: "naturepark", label: "Công viên", detail: "cây xanh · gió dịu", icon: Leaf },
  { id: "sunrise", label: "Bình minh", detail: "nắng hồng · chim bay", icon: Sun },
  { id: "mountainsunset", label: "Núi hoàng hôn", detail: "đồi xa · mây cam", icon: Sun },
  { id: "meteorice", label: "Sao băng & băng", detail: "trời lạnh · sao lướt", icon: Snowflake },
  { id: "galaxy", label: "Dải Ngân Hà", detail: "tinh vân · sao sáng", icon: Moon },
  { id: "cityday", label: "Đô thị ngày", detail: "phố sáng · nhịp sống", icon: Building2 },
  { id: "citysunset", label: "Hoàng hôn thành phố", detail: "skyline · nắng cam", icon: Sun },
  { id: "citydusk", label: "Chiều tà đô thị", detail: "mây tím · đèn lên", icon: CloudSun },
  { id: "citynight", label: "Thành phố đêm", detail: "neon · cửa sổ sáng", icon: Building2 },
  { id: "bridgefog", label: "Cầu đêm sương mờ", detail: "cầu xa · sương nhẹ", icon: Moon },
  { id: "urbanfog", label: "Sương mờ đô thị", detail: "phố mờ · yên tĩnh", icon: Cloud },
  { id: "sparklers", label: "Pháo hoa que", detail: "tia sáng · lung linh", icon: Sparkles },
  { id: "fireworks", label: "Pháo hoa rực rỡ", detail: "bầu trời lễ hội", icon: PartyPopper },
  { id: "forest", label: "Rừng xanh", detail: "tán cây · gió rừng", icon: Leaf },
  { id: "sunset", label: "Hoàng hôn", detail: "nắng mật · mây xa", icon: Sun },
  { id: "space", label: "Không gian", detail: "tinh vân · quỹ đạo", icon: Moon },
  { id: "crescentmoon", label: "Trăng non", detail: "trăng khuyết · sao nhỏ", icon: Moon },
  { id: "ocean", label: "Biển", detail: "sóng êm · chân trời", icon: Cloud },
  { id: "neon", label: "Neon", detail: "ánh sáng · nhịp đêm", icon: Sparkles },
  { id: "sakura", label: "Sakura", detail: "cánh đào · nắng hồng", icon: Flower2 },
  { id: "autumn", label: "Thu", detail: "cam đất · lá thưa", icon: Leaf },
  { id: "festival", label: "Lễ hội", detail: "cờ hoa · đèn sáng", icon: PartyPopper },
  { id: "volcano", label: "Núi lửa", detail: "than đỏ · tia lửa nhẹ", icon: Zap },
  { id: "deepocean", label: "Đại dương sâu", detail: "cá voi · bọt biển", icon: Cloud },
  { id: "magicforest", label: "Rừng phép thuật", detail: "nấm sáng · bướm đêm", icon: Sparkles },
  { id: "spacestation", label: "Trạm vũ trụ", detail: "quỹ đạo · tia quét", icon: Moon },
  { id: "flowerfield", label: "Cánh đồng hoa", detail: "hoa vàng · ong bay", icon: Flower2 },
  { id: "fairytale", label: "Lâu đài cổ tích", detail: "phép màu · lâu đài", icon: Sparkles },
  { id: "circus", label: "Gánh xiếc", detail: "ảo thuật · đèn màu", icon: PartyPopper },
  { id: "prehistoric", label: "Thời tiền sử", detail: "khủng long · rừng cổ", icon: Leaf },
  { id: "cyberrace", label: "Đường đua Cyberpunk", detail: "neon · tốc độ", icon: Zap },
  { id: "foodfestival", label: "Lễ hội ẩm thực", detail: "hương vị · sắc màu", icon: Flower2 },
  { id: "diamondmine", label: "Mỏ Kim Cương", detail: "pha lê · ánh sáng xanh", icon: Sparkles },
  { id: "f1race", label: "Đua xe F1", detail: "đường đua · tốc độ", icon: Zap },
  { id: "candykingdom", label: "Vương quốc Bánh kẹo", detail: "kẹo ngọt · sắc màu", icon: Sparkles },
  { id: "travel", label: "Du lịch", detail: "bản đồ · hành trình", icon: Building2 },
  { id: "tropical", label: "Biển nhiệt đới", detail: "cây dừa · sóng xanh", icon: CloudSun },
  { id: "rainy_season", label: "Mưa phủ phàng", detail: "ô lớn · giọt mưa", icon: CloudRain },
  { id: "stormy_season", label: "Bão giật", detail: "lốc xoáy · sấm chớp", icon: Zap },
  { id: "morning_chill", label: "Nắng ban mai", detail: "cà phê · chim sớm", icon: Sun },
  { id: "pixel", label: "Game Pixel Retro", detail: "8-bit · arcade", icon: Sparkles },
  { id: "pirate", label: "Đảo Cướp Biển", detail: "hải đồ · đại dương", icon: CloudSun },
  { id: "sports", label: "Sân Cỏ Thể Thao", detail: "sân vận động · năng lượng", icon: Zap },
  { id: "disco", label: "Vũ Trường Disco", detail: "đèn màu · nhịp điệu", icon: Sparkles },
  { id: "laboratory", label: "Phòng Thí Nghiệm", detail: "hóa chất · điện tử", icon: Sparkles },
  { id: "egypt", label: "Ai Cập Cổ Đại", detail: "sa mạc · chữ tượng hình", icon: Sun },
  { id: "steampunk", label: "Bánh Răng Steampunk", detail: "đồng thau · hơi nước", icon: Building2 },
  { id: "art", label: "Xưởng Nghệ Thuật", detail: "màu vẽ · cọ sáng tạo", icon: Flower2 },
  { id: "ninja", label: "Võ Sĩ Ninja", detail: "trăng đêm · kiếm đạo", icon: Moon },
  { id: "coffee", label: "Quán Cà Phê", detail: "lofi jazz · mưa cửa kính", icon: Coffee },
  { id: "ai", label: "Trí Tuệ Nhân Tạo", detail: "dữ liệu · neon cyan", icon: Sparkles },
  { id: "teddy", label: "Thế Giới Gấu Bông", detail: "hộp nhạc · dịu êm", icon: Heart },
  { id: "summer-ocean", label: "Mùa Hạ Nắng Vàng & Biển Biếc", detail: "hải âu · cát vàng · sóng biển", icon: CloudSun },
  { id: "autumn-maple", label: "Mùa Thu Lá Phủ Rừng", detail: "sóc con · lá phong · gió thu", icon: Leaf },
  { id: "tet-vietnam", label: "Mùa Tết Nguyên Đán", detail: "múa lân · bánh chưng · hoa mai", icon: PartyPopper },
  { id: "halloween-night", label: "Halloween Đêm Ma Thuật", detail: "ma vui vẻ · dơi · bí ngô", icon: Ghost },
  { id: "ghost-month", label: "Tháng Cô Hồn / Lễ Vu Lan", detail: "hoa đăng · hoa sen · sóng đêm", icon: Moon },
  { id: "xmas-holiday", label: "Noel Giáng Sinh", detail: "ông già Noel · tuần lộc · quà", icon: Sparkles },
  { id: "teachers-day", label: "Ngày Nhà Giáo Việt Nam 20/11", detail: "sách mở · hoa · điểm 10", icon: Flower2 },
  { id: "vietnam-heroes", label: "Ngày Anh Hùng Dân Tộc / Quốc Khánh", detail: "cờ đỏ sao vàng · chim Lạc", icon: Star },
  { id: "rainy-ripple", label: "Trời Mưa Rào & Sóng Xoáy", detail: "ếch con · ô vàng · vòng sóng", icon: CloudRain },
  { id: "windy-dust", label: "Trời Dông Giật & Mây Bụi", detail: "diều giấy · gió xoáy · bụi sáng", icon: Cloud },
  { id: "fire-element", label: "Nguyên Tố Lửa Bùng Cháy", detail: "phượng hoàng · than hồng · tàn lửa", icon: Zap },
  { id: "girly-pastel", label: "Nữ Tính Sweet Pastel", detail: "thỏ bông · trái tim · nơ hồng", icon: Heart },
  { id: "hung-kings-festival", label: "Giỗ Tổ Hùng Vương", detail: "Chim Lạc · trống đồng · bánh chưng", icon: Star },
  { id: "youth-volunteers", label: "Thanh Niên Tình Nguyện 26/3", detail: "áo xanh · sách · ngôi sao", icon: Heart },
  { id: "dien-bien-phu-victory", label: "Chiến Thắng Điện Biên Phủ 7/5", detail: "cờ quyết thắng · hoa ban", icon: Star },
  { id: "liberation-day", label: "Ngày Thống Nhất 30/4", detail: "bồ câu · Dinh Độc Lập · pháo hoa", icon: Star },
  { id: "vpa-day", label: "Ngày Quân Đội Nhân Dân 22/12", detail: "bộ đội · rừng tre · balo", icon: Star },
  { id: "mid-autumn", label: "Tết Trung Thu", detail: "thỏ ngọc · đèn ông sao · bánh nướng", icon: Moon },
  { id: "water-element", label: "Nguyên Tố Nước", detail: "cá voi băng · san hô · bọt khí", icon: Cloud },
  { id: "air-wind-element", label: "Nguyên Tố Khí / Gió", detail: "rồng mây · lụa mây · bụi sao", icon: Cloud },
  { id: "earth-element", label: "Nguyên Tố Đất / Mẹ Thiên Nhiên", detail: "hươu rừng · nấm · mầm cây", icon: Leaf },
  { id: "masculine-cyber", label: "Nam Tính / Công Nghệ Cyberpunk", detail: "robot chiến binh · vi mạch · neon", icon: Zap },
  { id: "oriental-wuxia", label: "Cổ Trang Tiên Hiệp", detail: "hạc tiên · trúc xanh · chén trà", icon: Bird },
  { id: "mekong-delta", label: "Miền Tây Sông Nước", detail: "cá chép · xuồng ba lá · bông súng", icon: Cloud },
  { id: "hanoi-old-quarter", label: "Hà Nội 36 Phố Phường Mùa Thu", detail: "mèo vàng · mái ngói · cà phê trứng", icon: Coffee },
  { id: "mini-hologram-cosmos", label: "Tiểu Vũ Trụ Hologram", detail: "phi hành gia · vệ tinh · hành tinh", icon: Moon },
  { id: "aurora-borealis", label: "Cực Quang Băng Tuyết", detail: "cáo băng · tinh thể · cực quang", icon: Snowflake },
  { id: "arcade-retro", label: "Trò Chơi Điện Tử 8-Bit", detail: "ma Pacman · tay cầm · nấm điểm", icon: Sparkles },
  { id: "magic-chess", label: "Bàn Cờ Ma Thuật", detail: "quân mã · Tarot · gậy phép", icon: Sparkles },
  { id: "lofi-rain-chill", label: "Đêm Mưa Chill Lo-Fi", detail: "cú đêm · trà nóng · đĩa nhạc", icon: CloudRain },
  { id: "fairy-tale", label: "Cổ Tích Xứ Sở Thần Thoại", detail: "nàng tiên · nấm sáng · bụi phép", icon: Sparkles },
  ...FESTIVE_THEME_CONFIGS.map((theme) => ({ id: theme.id as AmbientScene, label: theme.displayName, detail: "Ngày lễ Việt Nam · có âm nền", icon: PartyPopper })),
];
const defaultAmbientVolumes: AmbientVolumes = { morning: 45, rain: 42, snow: 32, leaves: 36, storm: 38, summer: 36, spring: 34, tet: 38, halloween: 30, desert: 28, night: 30, naturepark: 35, sunrise: 36, mountainsunset: 32, meteorice: 28, galaxy: 28, cityday: 34, citysunset: 32, citydusk: 30, citynight: 29, bridgefog: 26, urbanfog: 26, sparklers: 34, fireworks: 38, forest: 34, sunset: 31, space: 28, crescentmoon: 27, ocean: 36, neon: 30, sakura: 34, autumn: 32, festival: 38, volcano: 34, deepocean: 32, magicforest: 31, spacestation: 29, flowerfield: 35, fairytale: 32, circus: 38, prehistoric: 31, cyberrace: 36, foodfestival: 34, diamondmine: 34, f1race: 38, candykingdom: 34, travel: 36, tropical: 38, rainy_season: 42, stormy_season: 38, morning_chill: 40, pixel: 34, pirate: 36, sports: 36, disco: 34, laboratory: 30, egypt: 30, steampunk: 32, art: 34, ninja: 30, coffee: 36, ai: 30, teddy: 32, sweet_strawberry: 35, black_ribbon: 30, library_chill: 34, after_school: 40, classic_academy: 30, cyber_highschool: 35, "spring-blossom": 35, "summer-beach": 40, "autumn-leave": 35, "winter-snow": 30, "halloween-spooky": 35, "lunar-new-year": 35, "thunder-storm": 45, "rainy-day": 35, "sunny-day": 30, "foggy-morning": 25, "summer-ocean": 35, "autumn-maple": 35, "tet-vietnam": 35, "halloween-night": 35, "ghost-month": 30, "xmas-holiday": 35, "teachers-day": 30, "vietnam-heroes": 35, "rainy-ripple": 40, "windy-dust": 40, "fire-element": 35, "girly-pastel": 30, "hung-kings-festival": 35, "youth-volunteers": 35, "dien-bien-phu-victory": 40, "liberation-day": 35, "vpa-day": 35, "mid-autumn": 35, "water-element": 35, "air-wind-element": 40, "earth-element": 35, "masculine-cyber": 35, "oriental-wuxia": 35, "mekong-delta": 35, "hanoi-old-quarter": 30, "mini-hologram-cosmos": 35, "aurora-borealis": 30, "arcade-retro": 35, "magic-chess": 30, "lofi-rain-chill": 35, "fairy-tale": 30, "tet-nguyen-dan": 35, "gio-to-hung-vuong": 35, "ngay-thanh-nien-26-3": 35, "giai-phong-30-4": 35, "thuong-binh-liet-si-27-7": 30, "cach-mang-19-8": 35, "quoc-khanh-2-9": 35, "tet-trung-thu": 35, "nha-giao-viet-nam-20-11": 35, "quoc-te-phu-nu-8-3": 35, "tet-doan-ngo-5-5": 35, "vu-lan-bao-hieu": 30, "phu-nu-viet-nam-20-10": 35, "quan-doi-nhan-dan-22-12": 35 };
const emotionVoiceStates: Record<EmotionId, string[]> = {
  calm: ["comeback", "streak_recovered"], happy: ["achievement_unlocked"], tired: ["failed", "comeback"], sad: ["failed", "comeback"], stressed: ["failed", "streak_recovered"], lazy: ["failed", "comeback"], proud: ["achievement_unlocked"], focused: ["almost_unlocked"], hopeful: ["almost_unlocked", "comeback"], overwhelmed: ["failed", "comeback"], sleepy: ["failed", "comeback"], excited: ["achievement_unlocked"], lonely: ["failed", "comeback"], confident: ["achievement_unlocked", "almost_unlocked"], curious: ["almost_unlocked"], comeback: ["comeback", "streak_recovered"],
};
export function ExperienceStudio({ selected, onSelect, profile, onProfile, onStartTwoMinutes, customContent = [], mascotStates = [], voiceLines = [] }: Props) {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
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
  const [snowmanPosition, setSnowmanPosition] = useState(() => ({ x: profile?.sceneEffectPreferences?.snowmanX ?? 88, y: profile?.sceneEffectPreferences?.snowmanY ?? 5 }));
  const [ambientError, setAmbientError] = useState<string | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<AudioPlaybackStatus>({ environment: { active: false, label: "", volume: 0, muted: false }, music: { active: false, label: "", volume: 0, muted: false }, voice: { active: false, label: "", volume: 0, muted: false } });
  const attentionPreferences: AttentionPreferences = { animationsEnabled: profile?.animationsEnabled !== false, popupsEnabled: profile?.popupsEnabled !== false, soundEnabled: profile?.soundEnabled !== false };
  const restoredEmotionRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientStopRef = useRef<(() => void) | null>(null);
  const ambientMasterRef = useRef<GainNode | null>(null);
  const ambientGenerationRef = useRef(0);
  const ambientTrackRef = useRef<HTMLAudioElement | null>(null);
  const ambientAdditionalTracksRef = useRef<HTMLAudioElement[]>([]);
  const lumiAudioRef = useRef<HTMLAudioElement | null>(null);
  const emotionTransitionTimerRef = useRef<number | null>(null);
  const playbackTickerRef = useRef<number | null>(null);
  const lastPlaybackUpdateRef = useRef(0);
  const automatedSceneRef = useRef<AmbientScene | null>(null);
  const theme = emotionThemes.find((item) => item.id === selected) ?? emotionThemes[0];
  const companionMedia = profile?.companionEmotionMedia?.[theme.id];
  const preferredPersonalVoice = companionMedia?.lumiVoiceRecordings?.find((recording) => recording.id === companionMedia.favoriteLumiVoiceId) ?? companionMedia?.lumiVoiceRecordings?.[0];
  const selectedPreset = profile?.personalStudyPresets?.find((preset) => preset.id === profile.activePersonalStudyPresetId);
  const selectedPersonalAudioIds = selectedPreset?.audioAssetIds ?? [];
  const preferredCompanionAudio = (kind: "lumi" | "ong") => (profile?.personalAudioAssets ?? [])
    .filter((asset) => asset.enabled && asset.category === kind)
    .filter((asset) => selectedPersonalAudioIds.length === 0 || selectedPersonalAudioIds.includes(asset.id))
    .filter((asset) => [theme.id, "general"].includes(asset.target.trim().toLocaleLowerCase("vi-VN")))
    .sort((left, right) => Number(right.isDefault) - Number(left.isDefault) || right.updatedAt.localeCompare(left.updatedAt))[0];
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
  const sceneEffects: SceneEffectPreferences = profile?.sceneEffectPreferences ?? { leaves: 28, snow: 62, puddles: 64, snowmanX: 88, snowmanY: 5 };
  const showMascot = profile?.showMascot !== false;
  const showLumi = profile?.showLumi !== false;
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
    const savedScene = profile?.defaultAmbientScene;
    if (!savedScene) return;
    setAmbientScene(savedScene);
    setFavoriteScene(savedScene);
  }, [profile?.defaultAmbientScene]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--scene-leaf-density", String(sceneEffects.leaves));
    root.style.setProperty("--scene-snow-density", String(sceneEffects.snow));
    root.style.setProperty("--scene-puddle-density", String(sceneEffects.puddles));
    root.style.setProperty("--snowman-x", String(snowmanPosition.x));
    root.style.setProperty("--snowman-y", String(snowmanPosition.y));
  }, [sceneEffects.leaves, sceneEffects.puddles, sceneEffects.snow, snowmanPosition.x, snowmanPosition.y]);

  useEffect(() => {
    const settings = profile?.sceneAutomation;
    if (!settings?.enabled) { automatedSceneRef.current = null; return; }
    const applySchedule = () => {
      const next = resolveAutomatedScene(settings) as AmbientScene | null;
      if (!next || next === automatedSceneRef.current) return;
      automatedSceneRef.current = next;
      setScene(next);
      setMessage(`Lịch cá nhân đã đổi cảnh sang ${sceneOptions.find((item) => item.id === next)?.label}.`);
    };
    applySchedule();
    const timer = window.setInterval(applySchedule, 60_000);
    return () => window.clearInterval(timer);
  }, [profile?.sceneAutomation, profile?.defaultAmbientScene]);

  useEffect(() => () => { stopAmbient(); lumiAudioRef.current?.pause(); if (emotionTransitionTimerRef.current) window.clearTimeout(emotionTransitionTimerRef.current); if (playbackTickerRef.current) window.cancelAnimationFrame(playbackTickerRef.current); }, []);
  useEffect(() => {
    const tick = () => {
      const voice = lumiAudioRef.current && !lumiAudioRef.current.paused ? lumiAudioRef.current : null;
      const environment = ambientTrackRef.current && !ambientTrackRef.current.paused ? ambientTrackRef.current : null;
      const now = performance.now();
      if ((voice || environment) && now - lastPlaybackUpdateRef.current >= 250) {
        lastPlaybackUpdateRef.current = now;
        setPlaybackStatus((current) => {
          let next = current;
          if (voice) next = { ...next, voice: { ...next.voice, currentTime: voice.currentTime, duration: Number.isFinite(voice.duration) ? voice.duration : next.voice.duration, volume: Math.round(voice.volume * 100), muted: voice.muted } };
          if (environment) next = { ...next, environment: { ...next.environment, currentTime: environment.currentTime, duration: Number.isFinite(environment.duration) ? environment.duration : next.environment.duration, volume: Math.round(environment.volume * 100), muted: environment.muted } };
          return next;
        });
      }
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

  async function unlockAudio() {
    try {
      const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) { setAudioUnlocked(true); return true; }
      const context = audioContextRef.current ?? new AudioContextCtor();
      audioContextRef.current = context;
      if (context.state !== "running") await context.resume();
      const unlocked = context.state === "running";
      setAudioUnlocked(unlocked);
      if (unlocked) setMessage("Đã mở khóa âm thanh trên thiết bị này.");
      return unlocked;
    } catch {
      setAudioUnlocked(false);
      setMessage("Thiết bị chưa cho phép âm thanh. Hãy thử chạm lại nút mở khóa.");
      return false;
    }
  }

  function setScene(next: AmbientScene) {
    setAmbientScene(next);
    if (profile && onProfile && profile.defaultAmbientScene !== next) onProfile({ ...profile, defaultAmbientScene: next });
  }

  function saveFavoriteScene() {
    setFavoriteScene(ambientScene);
    if (profile) onProfile?.({ ...profile, defaultAmbientScene: ambientScene });
    setMessage(`${sceneOptions.find((item) => item.id === ambientScene)?.label} sẽ là cảnh mặc định khi Ong mở web.`);
  }

  function toggleFavoriteAmbientScene(scene: AmbientScene) {
    if (!profile || !onProfile) return;
    const favorites = profile.favoriteAmbientScenes ?? [];
    const isFavorite = favorites.includes(scene);
    const next = isFavorite ? favorites.filter((item) => item !== scene) : [...favorites, scene];
    onProfile({ ...profile, favoriteAmbientScenes: next }, isFavorite ? "Đã bỏ theme khỏi Giao diện yêu thích." : "Đã thêm theme vào Giao diện yêu thích.");
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

  function updateSceneEffect<K extends keyof Pick<SceneEffectPreferences, "leaves" | "snow" | "puddles">>(key: K, value: number) {
    if (!profile) return;
    const next = { ...sceneEffects, [key]: Math.max(0, Math.min(100, value)) };
    onProfile?.({ ...profile, sceneEffectPreferences: next });
  }

  function persistSnowmanPosition(position: { x: number; y: number }) {
    const next = { x: Math.max(4, Math.min(96, Math.round(position.x))), y: Math.max(2, Math.min(35, Math.round(position.y))) };
    setSnowmanPosition(next);
    if (profile) onProfile?.({ ...profile, sceneEffectPreferences: { ...sceneEffects, snowmanX: next.x, snowmanY: next.y } });
  }

  function updateSceneAutomation(update: Partial<NonNullable<ProfileState["sceneAutomation"]>>) {
    if (!profile) return;
    onProfile?.({ ...profile, sceneAutomation: { ...(profile.sceneAutomation ?? { enabled: false, applyFixedHolidays: true, timeRules: [] }), ...update } });
  }

  function setChannelPlaying(channel: PlaybackChannel, active: boolean, label = "", url?: string, volume = 0, muted = false) { setPlaybackStatus((current) => ({ ...current, [channel]: { active, label, url: active ? url : undefined, currentTime: active ? current[channel].currentTime ?? 0 : 0, duration: active ? current[channel].duration : undefined, volume: active ? Math.round(Math.max(0, Math.min(100, volume))) : 0, muted: active ? muted : false } })); }
  function seekPlayback(seconds: number) {
    const channel: PlaybackChannel = lumiAudioRef.current && !lumiAudioRef.current.paused ? "voice" : "environment";
    const audio = channel === "voice" ? lumiAudioRef.current : ambientTrackRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, seconds));
    setPlaybackStatus((current) => ({ ...current, [channel]: { ...current[channel], currentTime: audio.currentTime } }));
  }
  function stopVoicePlayback() { lumiAudioRef.current?.pause(); lumiAudioRef.current = null; setChannelPlaying("voice", false); }

  function playAudioPreview(url: string, channel: PlaybackChannel, label: string, volume?: number, playbackRate?: number) {
    const activeAudio = channel === "voice" ? lumiAudioRef.current : ambientTrackRef.current;
    if (activeAudio && !activeAudio.paused && playbackStatus[channel].url === url) {
      if (channel === "voice") stopVoicePlayback(); else stopAmbient();
      return;
    }
    if (channel === "voice") stopVoicePlayback();
    if (channel === "environment") stopAmbient();
    const audio = new Audio(resolveMediaUrl(url));
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    audio.volume = 0;
    audio.playbackRate = playbackRate ?? 1;
    audio.onended = () => {
      const isCurrent = channel === "voice" ? lumiAudioRef.current === audio : ambientTrackRef.current === audio;
      if (isCurrent) setChannelPlaying(channel, false);
    };
    if (channel === "voice") lumiAudioRef.current = audio; else ambientTrackRef.current = audio;
    void audio.play().then(() => {
      setChannelPlaying(channel, true, label, url, volume ?? (channel === "voice" ? lumiVolume : audioChannelVolumes.environment), false);
      const target = Math.max(0, Math.min(1, (volume ?? (channel === "voice" ? lumiVolume : audioChannelVolumes.environment)) / 100));
      const startedAt = performance.now();
      const fadeIn = () => {
        const progress = Math.min(1, (performance.now() - startedAt) / 220);
        audio.volume = target * progress;
        if (progress < 1 && !audio.paused) window.requestAnimationFrame(fadeIn);
      };
      window.requestAnimationFrame(fadeIn);
    }).catch(() => {
      if (channel === "voice" && lumiAudioRef.current === audio) lumiAudioRef.current = null;
      if (channel === "environment" && ambientTrackRef.current === audio) ambientTrackRef.current = null;
      setChannelPlaying(channel, false);
      setMessage(`Không thể phát ${label}.`);
    });
  }

  function stopAudioPreview(channel?: PlaybackChannel) {
    if (!channel || channel === "voice") stopVoicePlayback();
    if (!channel || channel === "environment") stopAmbient();
  }

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
    const additionalTracks = ambientAdditionalTracksRef.current;
    ambientAdditionalTracksRef.current = [];
    additionalTracks.forEach((track) => { track.pause(); track.removeAttribute("src"); track.load(); });
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
    const festiveThemeAudio = festiveAmbientFor(scene);
    const providedThemeAudio = festiveThemeAudio ?? PROVIDED_THEME_AMBIENT_ASSETS[scene as keyof typeof PROVIDED_THEME_AMBIENT_ASSETS];
    const isPomodoroAmbientPreset = selectedPreset?.id === DEFAULT_POMODORO_AMBIENT_PRESET.id && permittedAssetIds.includes(DEFAULT_AMBIENT_MORNING_ASSET.id) && permittedAssetIds.includes(DEFAULT_AMBIENT_STORM_ASSET.id);
    const selectedAmbientAudios = isPomodoroAmbientPreset
      ? [DEFAULT_AMBIENT_MORNING_ASSET, DEFAULT_AMBIENT_STORM_ASSET]
      : [personalAmbientAudio ?? providedThemeAudio ?? (
        scene === "morning" || scene === "summer" || scene === "spring" || scene === "tet" || scene === "desert" ? DEFAULT_AMBIENT_MORNING_ASSET
          : scene === "rain" ? DEFAULT_AMBIENT_ASSET
            : scene === "leaves" ? DEFAULT_AMBIENT_BOOK_PAGES_ASSET
              : scene === "storm" || scene === "halloween" || scene === "night" ? DEFAULT_AMBIENT_STORM_ASSET
                : DEFAULT_AMBIENT_ASSET
      )].filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));
    const selectedAmbientAudio = selectedAmbientAudios[0];
    if (selectedAmbientAudio) {
      setAmbientError(null);
      const audio = new Audio();
      audio.preload = "auto";
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audio.src = resolveMediaUrl(selectedAmbientAudio.url);
      audio.loop = true;
      audio.load();
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
        if (selectedAmbientAudios.length > 1) {
          const secondaryTracks = selectedAmbientAudios.slice(1).map((asset) => {
            const secondary = new Audio();
            secondary.preload = "auto";
            secondary.setAttribute("playsinline", "true");
            secondary.setAttribute("webkit-playsinline", "true");
            secondary.src = resolveMediaUrl(asset.url);
            secondary.loop = true;
            secondary.load();
            secondary.volume = 0;
            return secondary;
          });
          ambientAdditionalTracksRef.current = secondaryTracks;
          secondaryTracks.forEach((secondary) => {
            void secondary.play().then(() => {
              const secondaryStartedAt = performance.now();
              const secondaryFadeIn = () => {
                const progress = Math.min(1, (performance.now() - secondaryStartedAt) / 420);
                secondary.volume = targetVolume * 0.72 * progress;
                if (progress < 1 && ambientAdditionalTracksRef.current.includes(secondary)) window.requestAnimationFrame(secondaryFadeIn);
              };
              window.requestAnimationFrame(secondaryFadeIn);
            }).catch(() => { secondary.pause(); });
          });
        }
        setAmbientPlaying(true);
        setChannelPlaying("environment", true, selectedAmbientAudio.name, resolveMediaUrl(selectedAmbientAudio.url), ambientMuted ? 0 : ambientVolumes[scene] / 100 * audioChannelVolumes.environment, ambientMuted);
        setMessage(selectedAmbientAudio.source === "built_in" ? `Đang phát âm nền mặc định “${selectedAmbientAudio.name}”.` : festiveThemeAudio?.url === selectedAmbientAudio.url ? `Đang phát âm nền giao diện “${selectedAmbientAudio.name}”.` : `Đang phát âm nền cá nhân “${selectedAmbientAudio.name}”.`);
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
    const unlockAfterGesture = () => { void unlockAudio(); };
    window.addEventListener("pointerdown", unlockAfterGesture, { passive: true, once: true });
    window.addEventListener("keydown", unlockAfterGesture, { once: true });
    window.addEventListener("touchstart", unlockAfterGesture, { passive: true, once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAfterGesture);
      window.removeEventListener("keydown", unlockAfterGesture);
      window.removeEventListener("touchstart", unlockAfterGesture);
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
    const voiceUrl = customCongratulation?.audioUrl || preferredCompanionAudio("lumi")?.url || preferredPersonalVoice?.url || companionMedia?.lumiVoiceUrl || matchingVoiceLine?.audioUrl;
    if (voiceUrl) {
      stopVoicePlayback(); const audio = new Audio(resolveMediaUrl(voiceUrl)); audio.volume = 0; audio.onended = () => { if (lumiAudioRef.current === audio) { lumiAudioRef.current = null; setChannelPlaying("voice", false); } }; lumiAudioRef.current = audio; void audio.play().then(() => { setChannelPlaying("voice", true, "Lumi · lời động viên"); const startedAt = performance.now(); const fadeIn = () => { const progress = Math.min(1, (performance.now() - startedAt) / 220); audio.volume = lumiVolume / 100 * progress; if (progress < 1 && lumiAudioRef.current === audio) window.requestAnimationFrame(fadeIn); }; window.requestAnimationFrame(fadeIn); }).catch(() => setMessage("Không thể phát bản thu này. Lumi vẫn để lại lời nhắn ở bên cạnh.")); return;
    }
    setMessage("Chưa có bản thu Lumi cho lời nhắn này. Ong có thể thêm bản thu trong thư viện rồi chủ động nhấn nghe.");
  }
  function openLumiRecording() {
    window.dispatchEvent(new CustomEvent("gocnhocuaong:open-collapsible", { detail: { storageKey: `lumi-congratulations-${theme.id}` } }));
    window.setTimeout(() => document.getElementById(`lumi-congratulations-${theme.id}`)?.focus(), 80);
    setMessage("Đã mở phần Lời chúc của Lumi. Hãy nhập lời nhắn, nhấn Ghi âm trực tiếp và lưu lại khi hoàn tất.");
  }

  function playOngVoice() {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung."); return; }
    const voiceUrl = preferredCompanionAudio("ong")?.url;
    if (!voiceUrl) { setMessage("Chưa có bản thu Ong cho cảm xúc này. Ong có thể thêm loại “Lời Ong” trong thư viện âm thanh cá nhân."); return; }
    stopVoicePlayback(); const audio = new Audio(resolveMediaUrl(voiceUrl)); audio.volume = 0; audio.onended = () => { if (lumiAudioRef.current === audio) { lumiAudioRef.current = null; setChannelPlaying("voice", false); } }; lumiAudioRef.current = audio; void audio.play().then(() => { setChannelPlaying("voice", true, "Ong · lời động lực"); const startedAt = performance.now(); const fadeIn = () => { const progress = Math.min(1, (performance.now() - startedAt) / 220); audio.volume = audioChannelVolumes.ong / 100 * progress; if (progress < 1 && lumiAudioRef.current === audio) window.requestAnimationFrame(fadeIn); }; window.requestAnimationFrame(fadeIn); }).catch(() => setMessage("Không thể phát bản thu Ong này."));
  }

  function playMemberVoice() {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung."); return; }
    if (!preferredMemberVoice?.url) { setMessage("Chưa có bản ghi của thành viên cho cảm xúc này. Hãy thêm bản ghi loại “Thành viên” trong Audio Center."); return; }
    stopVoicePlayback();
    const audio = new Audio(resolveMediaUrl(preferredMemberVoice.url));
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
  return <PersistentCollapsible storageKey="experience-lumi-emotion-space" eyebrow="Không gian cá nhân" title="Không gian cảm xúc của Lumi" defaultOpen className="relative z-10 border-2 border-[#c62828]/15 bg-[linear-gradient(135deg,#fff7f2_0%,#f5fff5_100%)]"><section className="emotion-studio relative overflow-hidden" aria-labelledby="emotion-studio-title">
    <div className={`ambient-scene ambient-scene-${ambientScene}`} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#c62828]">Không gian cảm xúc của Lumi</p><h2 id="emotion-studio-title" className="mt-2 font-display text-2xl font-black text-[#7f1d1d]">Hôm nay Ong đang cảm thấy thế nào?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#3f513f]">Chọn cảm xúc để đổi màu toàn ứng dụng và nhận lời đồng hành phù hợp. Âm nền chỉ phát khi Ong chủ động nhấn nút.</p></div><div className="flex items-center gap-3 rounded-2xl border border-[#2e7d32]/20 bg-white/85 px-3 py-3 shadow-sm">{showMascot && showLumi ? <div className={`flex h-20 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#c62828]/20 bg-[#fff7ed] text-center text-[10px] font-bold text-[#9a3412] ${transitioningEmotion === theme.id ? "lumi-emotion-transition" : ""}`}>Audio<br />Lumi</div> : null}<div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Bạn đồng hành</p><p className="mt-1 text-sm font-black text-[#7f1d1d]">Lumi</p><span className="text-xs text-[#35523a]">{!showLumi ? "Lumi chỉ phát âm thanh khi Ong chọn nghe" : `Đang ở bên Ong · ${theme.label}`}</span></div><span className="rounded-full border border-[#2e7d32]/20 bg-white px-2 py-1 text-[10px] font-black text-[#2e7d32]">Audio-only</span></div></div>
    <AttentionControls preferences={attentionPreferences} onToggle={(key) => profile && onProfile?.({ ...profile, [key]: !attentionPreferences[key] })} />
    {profile && onProfile ? <LumiCongratulationControls profile={profile} emotion={theme.id} emotionLabel={theme.label} onProfile={onProfile} /> : null}
    <div className="relative z-10 mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{emotionThemes.map((item) => <div key={item.id} className={`relative rounded-2xl border ${item.id === selected ? "border-[var(--emotion-primary)] bg-[var(--emotion-soft)] shadow-md" : "border-[#2e7d32]/15 bg-white/75"}`}><button type="button" aria-pressed={item.id === selected} onClick={() => selectEmotion(item.id)} className="w-full p-3 pr-10 text-left text-[var(--emotion-ink)]"><span className="text-xl" aria-hidden="true">{item.emoji}</span><b className="mt-1 block text-sm">{item.label}</b><small className="mt-1 block text-[11px] leading-4 opacity-75">{item.description}</small></button></div>)}</div>

    {profile && onProfile ? <PersistentCollapsible storageKey="experience-lumi-favorite-scenes" eyebrow="Giao diện của Lumi" title="Giao diện yêu thích" className="relative z-10 mt-4 border-amber-200 bg-amber-50/80"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-amber-800">Giao diện yêu thích</p><p className="mt-1 text-xs text-amber-900/75">Danh sách không giới hạn. Nhấn một theme để áp dụng, bấm sao để thêm hoặc bỏ.</p></div><Star className="h-5 w-5 fill-amber-400 text-amber-500" aria-hidden="true" /></div>{(profile.favoriteAmbientScenes ?? []).length === 0 ? <p className="mt-3 rounded-xl border border-dashed border-amber-300 bg-white/70 px-3 py-3 text-xs font-bold text-amber-900">Chưa có theme yêu thích. Hãy bấm sao ở một theme bên dưới để lưu vào đây.</p> : null}<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{sceneOptions.filter((scene) => (profile.favoriteAmbientScenes ?? []).length === 0 || (profile.favoriteAmbientScenes ?? []).includes(scene.id)).map((scene) => { const isFavorite = (profile.favoriteAmbientScenes ?? []).includes(scene.id); return <div key={scene.id} className={`rounded-xl border p-2 transition ${ambientScene === scene.id ? "border-amber-500 bg-white shadow-sm" : "border-amber-200 bg-white/70"}`}><div className="flex items-center justify-between gap-1"><button type="button" aria-pressed={ambientScene === scene.id} onClick={() => setScene(scene.id)} className="min-w-0 flex-1 truncate text-left text-xs font-black text-amber-950">{scene.label}</button><button type="button" aria-label={`${isFavorite ? "Bỏ" : "Thêm"} yêu thích ${scene.label}`} onClick={() => toggleFavoriteAmbientScene(scene.id)} className="rounded-md p-1 hover:bg-amber-100"><Star className={`h-3.5 w-3.5 ${isFavorite ? "fill-amber-400 text-amber-500" : "text-amber-400"}`} /></button></div><p className="mt-1 text-[10px] text-amber-900/70">{isFavorite ? "Đã yêu thích" : "Bấm sao để lưu"}</p></div>; })}</div></PersistentCollapsible> : null}
    <PersistentCollapsible storageKey="experience-emotion-command" eyebrow="Tùy chỉnh cảm xúc" title="Câu lệnh đổi giao diện" className="relative z-10 mt-4 border-[#c62828]/15 bg-white/85"><div><label htmlFor="emotion-command" className="text-sm font-black text-[#7f1d1d]">Nhập cảm xúc hoặc câu lệnh</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="emotion-command" value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") selectEmotion(emotionFromCommand(command).id); }} placeholder={safeCommandHint} className="field flex-1 border-[#2e7d32]/25 bg-white" /><button type="button" onClick={() => selectEmotion(emotionFromCommand(command).id)} className="primary-button justify-center bg-[#c62828] hover:bg-[#a91f1f]">Áp dụng</button></div>{message ? <p className="mt-2 text-xs font-bold text-[#2e7d32]" role="status">{message}</p> : null}</div></PersistentCollapsible>
    <PersistentCollapsible storageKey="experience-lumi-speech-library" eyebrow="Đồng hành cùng Lumi" title="Lời an ủi và động viên" className="relative z-10 mt-5 border-2 border-[#2e7d32]/15 bg-[#f5fff5]/95"><section aria-labelledby="speech-library-title"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Lời an ủi và động viên từ Lumi</p><h3 id="speech-library-title" className="mt-1 text-lg font-black text-[#7f1d1d]">Lumi ở đây để đồng hành cùng Ong</h3></div><span className="rounded-full bg-[#c62828] px-3 py-1 text-xs font-black text-white">{speechGroupLabels[speechGroup]}</span></div><div className="mt-3 flex flex-wrap gap-2">{(Object.entries(speechGroupLabels) as [SpeechGroup, string][]).map(([group, label]) => <button key={group} type="button" onClick={() => chooseSpeechGroup(group)} className={`rounded-xl px-3 py-2 text-xs font-black ${speechGroup === group ? "bg-[#c62828] text-white" : "bg-white text-[#2e7d32]"}`}>{label}</button>)}</div><div className="mt-3 flex gap-3 rounded-2xl bg-[#fff0eb] p-4"><div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl border border-[#c62828]/20 bg-white text-center text-[10px] font-black text-[#8e1b1b]">Audio<br />Lumi</div><div className="min-w-0 flex-1"><p className="text-[11px] font-black uppercase tracking-wider text-[#2e7d32]">Thư viện Lumi · {weekdayLumi.label}</p><p className="mt-1 text-sm font-bold leading-6 text-[#6f2424]">{lumiVoiceText}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={playLumiVoice} className="rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white"><Volume2 className="mr-1 inline h-3.5 w-3.5" />Nghe bản thu Lumi</button>{profile?.companionMode === "ong" || profile?.companionMode === "both" || !profile?.companionMode ? <button type="button" onClick={playOngVoice} className="rounded-xl border border-[#c62828]/25 bg-white px-3 py-2 text-xs font-black text-[#c62828]"><Volume2 className="mr-1 inline h-3.5 w-3.5" />Nghe bản thu Ong</button> : null}{preferredMemberVoice ? <button type="button" onClick={playMemberVoice} className="rounded-xl border border-[#7f1d1d]/20 bg-white px-3 py-2 text-xs font-black text-[#7f1d1d]"><Volume2 className="mr-1 inline h-3.5 w-3.5" />Nghe bản ghi thành viên</button> : null}</div>{matchingVoiceLine?.audioUrl ? <span className="mt-2 block text-[11px] font-bold text-[#2e7d32]">Dùng bản thu đã lưu</span> : <span className="mt-2 block text-[11px] text-[#6f5a53]">Chưa có bản thu; Ong có thể tự thêm trong thư viện.</span>}</div></div><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#2e7d32]/20 bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">🫠 Chống trì hoãn</p><div className="mt-2 flex flex-wrap gap-2">{antiProcrastinationChoices.map((choice) => <button key={choice.id} type="button" onClick={() => chooseAntiProcrastination(choice.id)} className="rounded-xl border border-[#2e7d32]/20 bg-[#eff9ef] px-3 py-2 text-left text-xs font-black text-[#2e7d32]"><span className="block">{choice.label}</span><small className="mt-1 block font-medium text-[#35523a]">{choice.description}</small></button>)}</div></div><div className="rounded-2xl border border-[#c62828]/15 bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">🎯 Nhiệm vụ siêu nhỏ</p><p className="mt-2 text-sm font-black text-[#35523a]">{microTask}</p><button type="button" onClick={() => setMicroTask(randomMicroTask())} className="mt-3 rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white">Đổi nhiệm vụ</button></div></div></section></PersistentCollapsible>
    {profile && onProfile ? <AudioCenterEnhancements profile={profile} onProfile={onProfile} voiceLines={voiceLines} playbackStatus={playbackStatus} onPlayAsset={playAudioPreview} onStopPlayback={stopAudioPreview} onSeekPlayback={seekPlayback} /> : null}
    <aside className={`relative z-10 mt-4 rounded-2xl border p-3 text-sm ${matchingVoiceLine?.audioUrl ? "border-[#2e7d32]/25 bg-[#eff9ef] text-[#25582c]" : "border-amber-200 bg-amber-50 text-amber-900"}`} aria-live="polite"><b className="block text-xs uppercase tracking-wider">Giọng Lumi theo cảm xúc</b><span className="mt-1 block">{voiceMatchLabel}{matchingVoiceLine?.audioUrl ? " — nhấn “Nghe bản thu Lumi” để phát." : " — chưa có bản thu; Lumi vẫn hiển thị lời nhắn bên cạnh."}</span></aside>
    <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-[#fff0eb]/95 p-4">
        <div className="flex items-start gap-3"><div className={`flex h-14 w-12 items-center justify-center rounded-xl border border-[#c62828]/20 bg-[#fff7ed] text-[#c62828] ${transitioningEmotion === theme.id ? "lumi-emotion-transition" : ""}`} aria-label="Lumi audio-only"><Volume2 className="h-5 w-5" /></div><div><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">Lời chúc của Lumi</p><p className="mt-2 text-sm font-bold leading-6 text-[#6f2424]">{lumiCongratulationText}</p></div></div>
        <p className="mt-3 text-xs text-[#6f5a53]">{customCongratulation ? "Đây là lời chúc riêng do Ong đã lưu cho cảm xúc này." : "Lumi đang ở đây cùng Ong — không phán xét, chỉ cùng mình đi tiếp."}</p>
        <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={playLumiVoice} className="inline-flex items-center gap-2 rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white shadow-sm"><Volume2 className="h-3.5 w-3.5" />Nghe lời thoại Lumi</button><button type="button" onClick={openLumiRecording} className="inline-flex items-center gap-2 rounded-xl border border-[#2e7d32]/30 bg-white px-3 py-2 text-xs font-black text-[#2e7d32] shadow-sm dark:bg-slate-950"><Mic className="h-3.5 w-3.5" />Ghi hoặc quản lý bản thu</button></div>
      </div>
      <div className="rounded-2xl bg-[#fff9e8]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#9a5b00]">Boss Trì hoãn</p><p className="mt-2 text-sm font-bold text-[#6b4a1f]">👾 HP 100% · Mỗi phiên hoàn thành: −20 HP</p><div className="mt-3 h-2 rounded-full bg-[#ead9b3]"><div className="h-full w-full rounded-full bg-[#c62828]" /></div><p className="mt-2 text-xs text-[#6b4a1f]">Metaphor vui, không phải bảng phạt.</p></div>
      <div className="rounded-2xl bg-[#f5fff5]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Ong vs Trì hoãn</p><div className="mt-3 flex items-center justify-between text-center"><div><div className="text-2xl">🐝</div><b className="text-xs text-[#2e7d32]">Ong +1</b></div><span className="text-xs font-black text-[#c62828]">VS</span><div><div className="text-2xl">🫠</div><b className="text-xs text-[#9a5b00]">Trì hoãn</b></div></div><p className="mt-3 text-xs leading-5 text-[#35523a]">Mỗi lần bắt đầu là Ong đang thắng một chút.</p></div>
    </div>
  </section></PersistentCollapsible>;
}

function AttentionControls({ preferences, onToggle }: { preferences: AttentionPreferences; onToggle: (key: keyof AttentionPreferences) => void }) {
  const items: Array<{ key: keyof AttentionPreferences; label: string; detail: string }> = [
    { key: "animationsEnabled", label: "Hoạt ảnh", detail: "Hiệu ứng chuyển động và cảnh nền" },
    { key: "popupsEnabled", label: "Popup", detail: "Thông báo nổi không thiết yếu" },
    { key: "soundEnabled", label: "Âm thanh", detail: "Lời Lumi, âm nền và chuông" },
  ];
  return <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-3">{items.map((item) => <button key={item.key} type="button" aria-pressed={preferences[item.key]} onClick={() => onToggle(item.key)} className={`rounded-xl border p-3 text-left ${preferences[item.key] ? "border-[#2e7d32]/25 bg-[#eff9ef] text-[#25582c]" : "border-slate-200 bg-white/80 text-slate-500"}`}><span className="text-sm font-black">{item.label}</span><small className="mt-1 block text-[11px] font-medium opacity-75">{preferences[item.key] ? item.detail : `${item.detail} · đang tạm dừng`}</small></button>)}</div>;
}
