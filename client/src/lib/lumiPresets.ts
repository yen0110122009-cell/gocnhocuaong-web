import type { LumiDialogueGroup } from "./lumiCustomDialogues";
import type { EmotionId } from "./emotionThemes";

type PomodoroMode = "focus" | "shortBreak" | "longBreak";

export const LUMI_POSITIVE_KAOMOJI: Record<LumiDialogueGroup | "rest", string[]> = {
  comfort: ["(つ_ <｡)", "(⊃｡•́‿•̀｡)⊃", "(´-ω-`( _ _ )", "(っ´ω`)`(´ω`*)", "(o・_・)ノ(ノ_<。)", "(,,´•ω•)(´•ω•｀,,)"],
  hug: ["(つ≧▽≦)つ", "(づ￣ ³￣)づ", "(っ˘з(˘⌣˘) ♡", "⊂(´• ω •`⊂)", "⊂(･ ω ･*⊂)", "(つ✧ω✧)つ"],
  companionship: ["(*^o^)人(^o^*)", "(・_・)人(・_・)", "＼(＾∀＾)メ(＾∀＾)ノ", "(๑˃̵ᴗ˂̵)━(̵⠇̵ᴗ⠇̵)"],
  encouragement: ["٩(ˊᗜˋ*)و", "(ง’̀-‘́)ง", "(๑•̀ㅂ•́)و", "٩(｡•́‿•̀｡)۶", "(ﾉ•̀ᴗ•́)ﾉ", "(*•̀ᴗ•́*)و ̑̑"],
  water: ["(´ー`)旦~~", "(˘▽˘)っ♨", "(っ˘ڡ˘ς)"],
  focus: ["(•̀ᴗ•́)و ̑̑", "(ง •̀_•́)ง", "(๑•̀ㅂ•́)و✧"],
  rest: ["[(－－)]..zzZ", "(∪｡∪)｡｡｡zzZ", "(￣o￣)zzZZ"],
  celebration: ["ヽ(>∀<☆)ノ", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "٩(◕‿◕｡)۶"],
};

export const LUMI_WELCOME = {
  kaomoji: "٩(◕‿◕｡)۶",
  text: "Xin chào bạn! Hôm nay bạn cảm thấy thế nào? Lumi sẵn sàng lắng nghe nè 🍀",
} as const;

export const LUMI_FOCUS_MESSAGE = "Cùng tập trung học thật tốt nhé! Lumi luôn đồng hành cùng bạn 🍀";
export const LUMI_REST_MESSAGE = "Đến giờ nghỉ tay rồi! Cùng chớp mắt thư giãn xíu nhé... ☕✨";
export const LUMI_WATER_MESSAGE = "Đã đến giờ uống một ngụm nước ấm rồi nè bạn ơi! ☕💧";
export const LUMI_WATER_PRAISE = "Ngoan lắm! Tiếp tục thôi nào ✨";

export type LumiCheckinOption = { id: EmotionId; label: string; emoji: string; group: LumiDialogueGroup };

export const LUMI_CHECKIN_OPTIONS: LumiCheckinOption[] = [
  { id: "tired", label: "Mệt mỏi", emoji: "🥱", group: "comfort" },
  { id: "sad", label: "Đau lòng", emoji: "💔", group: "comfort" },
  { id: "stressed", label: "Lo lắng", emoji: "🌧️", group: "comfort" },
  { id: "overwhelmed", label: "Quá tải", emoji: "🫧", group: "comfort" },
  { id: "lazy", label: "Thiếu động lực", emoji: "🫠", group: "encouragement" },
  { id: "focused", label: "Tập trung", emoji: "🎯", group: "focus" },
  { id: "confident", label: "Sẵn sàng học", emoji: "💪", group: "encouragement" },
  { id: "lonely", label: "Cần cái ôm", emoji: "🫂", group: "hug" },
  { id: "calm", label: "Bình tĩnh", emoji: "🌿", group: "companionship" },
  { id: "happy", label: "Vui vẻ", emoji: "🌞", group: "companionship" },
  { id: "hopeful", label: "Hy vọng", emoji: "🌱", group: "companionship" },
  { id: "excited", label: "Hào hứng", emoji: "⚡", group: "celebration" },
];

export const LUMI_CHECKIN_RESPONSES = {
  tired: { group: "comfort" as const, label: "An ủi & Vỗ về", kaomoji: LUMI_POSITIVE_KAOMOJI.comfort[0], text: "Đừng lo nhé, mọi chuyện rồi sẽ ổn thôi. Lumi ở đây bên bạn nè 💖" },
  motivation: { group: "encouragement" as const, label: "Cố gắng & Động viên", kaomoji: LUMI_POSITIVE_KAOMOJI.encouragement[0], text: "Cố lên nào! Bạn mạnh mẽ và giỏi giang hơn bạn nghĩ nhiều đó ✨" },
  hug: { group: "hug" as const, label: "Ôm ấp & Yêu thương", kaomoji: LUMI_POSITIVE_KAOMOJI.hug[0], text: "Gửi bạn một cái ôm thật chặt và ấm áp này! 🤗" },
  ready: { group: "companionship" as const, label: "Tình bạn & Đồng hành", kaomoji: LUMI_POSITIVE_KAOMOJI.companionship[0], text: "Cùng nhau bắt đầu một phiên học thật tốt nhé! 🍀" },
} as const;

export function lumiRoutineGroup(mode: PomodoroMode, running: boolean): LumiDialogueGroup {
  return mode === "focus" && running ? "encouragement" : "water";
}

export function lumiKaomojiForPomodoro(mode: PomodoroMode, running: boolean) {
  if (mode === "focus" && running) return LUMI_POSITIVE_KAOMOJI.encouragement[0];
  if (mode === "focus") return LUMI_POSITIVE_KAOMOJI.rest[0];
  return LUMI_POSITIVE_KAOMOJI.water[0];
}

export function lumiRoutineMessage(mode: PomodoroMode, running: boolean) {
  return mode === "focus" && running ? LUMI_FOCUS_MESSAGE : LUMI_REST_MESSAGE;
}

export function lumiKaomojiForEmotion(emotion: string) {
  if (["tired", "sad", "stressed", "overwhelmed"].includes(emotion)) return LUMI_POSITIVE_KAOMOJI.comfort[0];
  if (emotion === "lonely") return LUMI_POSITIVE_KAOMOJI.hug[0];
  if (emotion === "focused") return LUMI_POSITIVE_KAOMOJI.focus[0];
  if (emotion === "sleepy") return LUMI_POSITIVE_KAOMOJI.rest[0];
  if (["proud", "excited"].includes(emotion)) return LUMI_POSITIVE_KAOMOJI.celebration[0];
  return LUMI_POSITIVE_KAOMOJI.encouragement[0];
}
