import type { LumiDialogueGroup } from "./lumiCustomDialogues";

export type LumiKaomojiDialogue = {
  id: string;
  text: string;
};

export type LumiKaomojiDialogueEntry = {
  kaomoji: string;
  group: LumiDialogueGroup | "joy" | "rest";
  description: string;
  dialogues: LumiKaomojiDialogue[];
};

export type LumiCustomKaomojiData = {
  kaomoji: string;
  description: string;
  dialogue: string;
};

export const LUMI_MULTI_DIALOGUES_STORAGE_KEY = "lumi_multi_dialogues_data";
export const LUMI_MULTI_DIALOGUES_EVENT = "gocnhocuaong:lumi-multi-dialogues-updated";
export const LUMI_CUSTOM_KAOMOJI_STORAGE_KEY = "lumi_custom_kaomoji_data";
export const LUMI_CUSTOM_KAOMOJI_EVENT = "gocnhocuaong:lumi-custom-kaomoji-updated";
export const MAX_LUMI_MULTI_DIALOGUES = 100;

export const DEFAULT_LUMI_MULTI_DIALOGUES: LumiKaomojiDialogueEntry[] = [
  { kaomoji: "(つ_ <｡)", group: "comfort", description: "Lau nước mắt dịu dàng", dialogues: [
    { id: "comfort-tears-1", text: "Đừng khóc nha, có Lumi ở đây ôm bạn nè 🍀" },
    { id: "comfort-tears-2", text: "Nín đi nha, Lumi thương bạn nhiều lắm đó!" },
    { id: "comfort-tears-3", text: "Lau nước mắt nào, mọi chuyện rồi sẽ ổn thôi!" },
    { id: "comfort-tears-4", text: "Hôm nay mệt lắm đúng không? Tựa vào Lumi nè 🤗" },
  ] },
  { kaomoji: "(⊃｡•́‿•̀｡)⊃", group: "comfort", description: "Sẵn sàng giơ tay vỗ về", dialogues: [{ id: "comfort-pat-1", text: "Lại đây với Lumi nào, mọi chuyện rồi sẽ ổn thôi!" }] },
  { kaomoji: "(´-ω-`( _ _ )", group: "comfort", description: "Tựa đầu đồng cảm", dialogues: [{ id: "comfort-rest-1", text: "Hôm nay bạn vất vả rồi, nghỉ tay một chút nhé." }] },
  { kaomoji: "(っ´ω`)`(´ω`*)", group: "comfort", description: "Xoa đầu an ủi", dialogues: [{ id: "comfort-head-1", text: "Xoa đầu nè, bạn đã làm rất tốt rồi đó!" }] },
  { kaomoji: "(o・_・)ノ(ノ_<。)", group: "comfort", description: "Vỗ đầu nhẹ nhàng", dialogues: [{ id: "comfort-gentle-1", text: "Ngoan nào, Lumi luôn ở bên cạnh lắng nghe bạn." }] },
  { kaomoji: "(,,´•ω•)(´•ω•｀,,)", group: "comfort", description: "Ngồi sát bên cạnh sẻ chia", dialogues: [{ id: "comfort-sit-1", text: "Không sao đâu, Lumi cùng ngồi đây với bạn." }] },
  { kaomoji: "(つ≧▽≦)つ", group: "hug", description: "Lao đến ôm thật chặt", dialogues: [{ id: "hug-tight-1", text: "Cho bạn một cái ôm thật chặt nè 💖!" }] },
  { kaomoji: "(づ￣ ³￣)づ", group: "hug", description: "Trao cái ôm ấm áp", dialogues: [{ id: "hug-warm-1", text: "Gửi tới bạn một cái ôm ấm áp cho ngày hôm nay!" }] },
  { kaomoji: "(っ˘з(˘⌣˘) ♡", group: "hug", description: "Ôm má thương yêu", dialogues: [{ id: "hug-love-1", text: "Yêu thương gửi tới bạn, cố lên nha!" }] },
  { kaomoji: "⊂(´• ω •`⊂)", group: "hug", description: "Bò đến xin ôm", dialogues: [{ id: "hug-crawl-1", text: "Lumi lao đến ôm bạn một cái thật lâu nè!" }] },
  { kaomoji: "(つ✧ω✧)つ", group: "hug", description: "Ôm lấp lánh hạnh phúc", dialogues: [{ id: "hug-sparkle-1", text: "Nhận lấy cái ôm tràn đầy năng lượng này nào!" }] },
  { kaomoji: "(*^o^)人(^o^*)", group: "companionship", description: "Đập tay high-five", dialogues: [{ id: "friend-highfive-1", text: "High-five nào! Chúng mình cùng cố gắng hôm nay nha 🤝" }] },
  { kaomoji: "(・__・)人(・_・)", group: "companionship", description: "Nắm tay đồng hành", dialogues: [{ id: "friend-hands-1", text: "Lumi sẽ luôn nắm tay đồng hành cùng bạn!" }] },
  { kaomoji: "٩( 🩵‿🩵 )۶", group: "companionship", description: "Sẵn sàng đồng hành", dialogues: [{ id: "friend-ready-1", text: "Lumi đã sẵn sàng học và làm việc cùng bạn rồi đây 🍀" }] },
  { kaomoji: "(*・ω・)ﾉ", group: "companionship", description: "Vẫy tay chào bạn thân", dialogues: [{ id: "friend-wave-1", text: "Chào bạn nha, chúc bạn một phiên làm việc hiệu quả!" }] },
  { kaomoji: "٩(ˊᗜˋ*)و", group: "encouragement", description: "Giơ tay quyết tâm lớn", dialogues: [{ id: "encourage-focus-1", text: "Tập trung cao độ nào, bạn chắc chắn làm được!" }] },
  { kaomoji: "(ง’̀-‘́)ง", group: "encouragement", description: "Giơ nắm đấm cố lên", dialogues: [{ id: "encourage-fist-1", text: "Quyết tâm không nản lòng nha, tiến lên phía trước!" }] },
  { kaomoji: "(๑•̀ㅂ•́)و", group: "encouragement", description: "Quyết tâm 100%", dialogues: [{ id: "encourage-power-1", text: "Sạc đầy 100% năng lượng để hoàn thành mục tiêu thôi!" }] },
  { kaomoji: "(*•̀ᴗ•́*)و ̑̑", group: "encouragement", description: "Cố lên, bạn làm được", dialogues: [{ id: "encourage-step-1", text: "Cố lên một chút nữa thôi, kết quả tốt đang chờ bạn!" }] },
  { kaomoji: "(* ^ ω ^)", group: "joy", description: "Mỉm cười tít mắt", dialogues: [{ id: "joy-smile-1", text: "Thật là một ngày tuyệt vời đúng không nào!" }] },
  { kaomoji: "٩(◕‿◕｡)۶", group: "joy", description: "Vui mừng nhún nhảy", dialogues: [{ id: "joy-happy-1", text: "Hoàn thành xuất sắc rồi! Tuyệt vời quá đi 🥳" }] },
  { kaomoji: "☆*: .｡. o(≧▽≦)o .｡.:*☆", group: "joy", description: "Pháo hoa sung sướng", dialogues: [{ id: "joy-fireworks-1", text: "Chúc mừng bạn! Bạn giỏi quá chừng luôn!" }] },
  { kaomoji: "(´ー`)旦~~", group: "water", description: "Thưởng thức ly trà/nước", dialogues: [{ id: "water-tea-1", text: "Nghỉ tay uống ngụm nước mát cho đỡ mệt nha 🥛" }] },
  { kaomoji: "(っ🥛˘ڡ˘ς)", group: "water", description: "Uống ngụm nước mát", dialogues: [{ id: "water-drink-1", text: "Đã đến giờ tiếp nước rồi, uống một ngụm nhé!" }] },
  { kaomoji: "[(－－)]..zzZ", group: "rest", description: "Nhắm mắt nghỉ ngơi xíu", dialogues: [{ id: "rest-sleep-1", text: "Chợp mắt xíu cho khỏe mắt rồi học tiếp nha!" }] },
];

const validGroups = new Set<LumiKaomojiDialogueEntry["group"]>(["comfort", "hug", "companionship", "encouragement", "joy", "water", "rest"]);

function cloneDefaults() {
  return DEFAULT_LUMI_MULTI_DIALOGUES.map((entry) => ({ ...entry, dialogues: entry.dialogues.map((dialogue) => ({ ...dialogue })) }));
}

function normalizeCustomData(value: unknown, index: number): LumiCustomKaomojiData | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { kaomoji?: unknown; description?: unknown; dialogue?: unknown };
  const kaomoji = typeof candidate.kaomoji === "string" ? candidate.kaomoji.trim().slice(0, 80) : "";
  const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
  const dialogue = typeof candidate.dialogue === "string" ? candidate.dialogue.trim() : "";
  if (!kaomoji || (!description && !dialogue)) return null;
  return { kaomoji, description, dialogue: dialogue || `lumi-custom-${index}` };
}

function readCustomKaomojiData(): LumiCustomKaomojiData[] {
  try {
    const raw = typeof window === "undefined" ? null : window.localStorage.getItem(LUMI_CUSTOM_KAOMOJI_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.flatMap((value, index) => { const item = normalizeCustomData(value, index); return item ? [item] : []; }) : [];
  } catch {
    return [];
  }
}

function mergeCustomKaomojiData(entries: LumiKaomojiDialogueEntry[], customData: LumiCustomKaomojiData[]) {
  const byKaomoji = new Map(customData.map((item) => [item.kaomoji, item]));
  return entries.map((entry) => {
    const custom = byKaomoji.get(entry.kaomoji);
    if (!custom) return entry;
    const dialogues = entry.dialogues.map((dialogue) => ({ ...dialogue }));
    if (custom.dialogue && !custom.dialogue.startsWith("lumi-custom-")) {
      if (dialogues[0]) dialogues[0] = { ...dialogues[0], text: custom.dialogue };
      else dialogues.push({ id: `custom-${entry.kaomoji}`, text: custom.dialogue });
    }
    return { ...entry, description: custom.description || entry.description, dialogues };
  });
}

function normalizeEntry(value: unknown, index: number): LumiKaomojiDialogueEntry | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { kaomoji?: unknown; group?: unknown; description?: unknown; dialogues?: unknown };
  const kaomoji = typeof candidate.kaomoji === "string" ? candidate.kaomoji.trim().slice(0, 80) : "";
  const group = typeof candidate.group === "string" && validGroups.has(candidate.group as LumiKaomojiDialogueEntry["group"]) ? candidate.group as LumiKaomojiDialogueEntry["group"] : null;
  const description = typeof candidate.description === "string" ? candidate.description.trim() : "Lumi đồng hành";
  if (!kaomoji || !group) return null;
  const dialogues = Array.isArray(candidate.dialogues) ? candidate.dialogues.flatMap((item, dialogueIndex) => {
    if (typeof item === "string") {
      const text = item.trim();
      return text ? [{ id: `lumi-multi-${index}-${dialogueIndex}`, text }] : [];
    }
    if (!item || typeof item !== "object") return [];
    const text = typeof item.text === "string" ? item.text.trim() : "";
    return text ? [{ id: typeof item.id === "string" && item.id.trim() ? item.id.trim().slice(0, 100) : `lumi-multi-${index}-${dialogueIndex}`, text }] : [];
  }) : [];
  return { kaomoji, group, description, dialogues: dialogues.slice(0, MAX_LUMI_MULTI_DIALOGUES) };
}

export function readLumiMultiDialogues(): LumiKaomojiDialogueEntry[] {
  try {
    const raw = typeof window === "undefined" ? null : window.localStorage.getItem(LUMI_MULTI_DIALOGUES_STORAGE_KEY);
    if (!raw) return mergeCustomKaomojiData(cloneDefaults(), readCustomKaomojiData());
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return mergeCustomKaomojiData(cloneDefaults(), readCustomKaomojiData());
    const values = parsed.flatMap((value, index) => { const item = normalizeEntry(value, index); return item ? [item] : []; });
    return mergeCustomKaomojiData(values.length ? values : cloneDefaults(), readCustomKaomojiData());
  } catch {
    return mergeCustomKaomojiData(cloneDefaults(), readCustomKaomojiData());
  }
}

export function saveLumiCustomKaomojiData(data: LumiCustomKaomojiData[]) {
  const seen = new Set<string>();
  const saved = data.flatMap((value, index) => {
    const item = normalizeCustomData(value, index);
    if (!item || seen.has(item.kaomoji)) return [];
    seen.add(item.kaomoji);
    return [item];
  });
  try { if (typeof window !== "undefined") window.localStorage.setItem(LUMI_CUSTOM_KAOMOJI_STORAGE_KEY, JSON.stringify(saved)); } catch { /* localStorage may be unavailable */ }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<LumiCustomKaomojiData[]>(LUMI_CUSTOM_KAOMOJI_EVENT, { detail: saved }));
    window.dispatchEvent(new CustomEvent<LumiKaomojiDialogueEntry[]>(LUMI_MULTI_DIALOGUES_EVENT, { detail: readLumiMultiDialogues() }));
  }
  return saved;
}

export function saveLumiCustomKaomojiItem(item: LumiCustomKaomojiData) {
  const existing = readCustomKaomojiData().filter((value) => value.kaomoji !== item.kaomoji);
  saveLumiCustomKaomojiData([...existing, item]);
  return readLumiMultiDialogues();
}

export function restoreLumiCustomKaomojiItem(kaomoji: string) {
  saveLumiCustomKaomojiData(readCustomKaomojiData().filter((value) => value.kaomoji !== kaomoji));
  const defaults = DEFAULT_LUMI_MULTI_DIALOGUES.find((entry) => entry.kaomoji === kaomoji);
  const current = readLumiMultiDialogues();
  const restored = defaults ? current.map((entry) => entry.kaomoji === kaomoji ? { ...entry, description: defaults.description, dialogues: entry.dialogues.length ? [{ ...defaults.dialogues[0] }, ...entry.dialogues.slice(1)] : [{ ...defaults.dialogues[0] }] } : entry) : current;
  return saveLumiMultiDialogues(restored);
}

export function restoreLumiCustomKaomojiData() {
  try { if (typeof window !== "undefined") window.localStorage.removeItem(LUMI_CUSTOM_KAOMOJI_STORAGE_KEY); } catch { /* localStorage may be unavailable */ }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<LumiCustomKaomojiData[]>(LUMI_CUSTOM_KAOMOJI_EVENT, { detail: [] }));
}

export function saveLumiMultiDialogues(entries: LumiKaomojiDialogueEntry[]) {
  const seen = new Set<string>();
  const values = entries.flatMap((entry, index) => {
    const item = normalizeEntry(entry, index);
    if (!item || seen.has(item.kaomoji)) return [];
    seen.add(item.kaomoji);
    return [item];
  });
  const saved = values.length ? values : cloneDefaults();
  try { if (typeof window !== "undefined") window.localStorage.setItem(LUMI_MULTI_DIALOGUES_STORAGE_KEY, JSON.stringify(saved)); } catch { /* localStorage may be unavailable */ }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<LumiKaomojiDialogueEntry[]>(LUMI_MULTI_DIALOGUES_EVENT, { detail: saved }));
  return saved;
}

export function restoreLumiMultiDialogues() {
  restoreLumiCustomKaomojiData();
  return saveLumiMultiDialogues(cloneDefaults());
}

const lastDialogueByKaomoji = new Map<string, string>();

export function pickRandomLumiDialogue(entry: LumiKaomojiDialogueEntry): LumiKaomojiDialogue | null {
  if (!entry.dialogues.length) return null;
  const previousId = lastDialogueByKaomoji.get(entry.kaomoji);
  const candidates = entry.dialogues.length > 1 ? entry.dialogues.filter((dialogue) => dialogue.id !== previousId) : entry.dialogues;
  const picked = candidates[Math.floor(Math.random() * candidates.length)] ?? entry.dialogues[0];
  lastDialogueByKaomoji.set(entry.kaomoji, picked.id);
  return picked;
}

export function findLumiKaomojiDialogue(entries: LumiKaomojiDialogueEntry[], kaomoji: string) {
  return entries.find((entry) => entry.kaomoji === kaomoji) ?? null;
}
