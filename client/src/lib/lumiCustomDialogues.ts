export type LumiDialogueGroup = "comfort" | "encouragement" | "hug" | "companionship" | "water" | "focus" | "rest" | "celebration";

export type LumiCustomDialogue = {
  id: string;
  group: LumiDialogueGroup;
  text: string;
  isDefault?: boolean;
};

export const LUMI_CUSTOM_DIALOGUES_STORAGE_KEY = "lumi_custom_dialogues";
export const LUMI_CUSTOM_DIALOGUES_EVENT = "gocnhocuaong:lumi-custom-dialogues-updated";

export const LUMI_DIALOGUE_GROUPS: Array<{ id: LumiDialogueGroup; label: string; emoji: string; description: string }> = [
  { id: "comfort", label: "An ủi", emoji: "🤍", description: "Nhẹ nhàng khi Ong mệt hoặc quá tải." },
  { id: "encouragement", label: "Động viên", emoji: "🌟", description: "Tiếp thêm lực cho một bước nhỏ." },
  { id: "hug", label: "Ôm ấp", emoji: "🫂", description: "Một cái ôm ấm áp, không phán xét." },
  { id: "companionship", label: "Đồng hành", emoji: "🤝", description: "Lumi ngồi cạnh Ong trong lúc học." },
  { id: "water", label: "Nhắc uống nước", emoji: "💧", description: "Nhắc chăm sóc cơ thể giữa các phiên." },
  { id: "focus", label: "Tập trung", emoji: "🎯", description: "Giúp Ong quay lại một việc nhỏ trước mắt." },
  { id: "rest", label: "Nghỉ ngơi", emoji: "☕", description: "Nhắc nghỉ đúng lúc để học bền hơn." },
  { id: "celebration", label: "Chúc mừng", emoji: "🎉", description: "Ghi nhận nỗ lực và những bước tiến của Ong." },
];

export const DEFAULT_LUMI_DIALOGUES: LumiCustomDialogue[] = [
  { id: "default-comfort-1", group: "comfort", text: "Đừng lo nhé, mọi chuyện rồi sẽ ổn thôi. Lumi ở đây bên bạn nè 💖", isDefault: true },
  { id: "default-comfort-2", group: "comfort", text: "Lumi ở đây với bạn. Mình cùng thở một nhịp rồi làm một việc thật nhỏ nhé.", isDefault: true },
  { id: "default-encouragement-1", group: "encouragement", text: "Cố lên nào! Bạn mạnh mẽ và giỏi giang hơn bạn nghĩ nhiều đó ✨", isDefault: true },
  { id: "default-encouragement-2", group: "encouragement", text: "Cùng tập trung học thật tốt nhé! Lumi luôn đồng hành cùng bạn 🍀", isDefault: true },
  { id: "default-hug-1", group: "hug", text: "Gửi bạn một cái ôm thật chặt và ấm áp này! 🤗", isDefault: true },
  { id: "default-hug-2", group: "hug", text: "Lumi ôm bạn một cái rồi mình cùng nhẹ nhàng quay lại nhé.", isDefault: true },
  { id: "default-companionship-1", group: "companionship", text: "Cùng nhau bắt đầu một phiên học thật tốt nhé! 🍀", isDefault: true },
  { id: "default-companionship-2", group: "companionship", text: "Lumi sẵn sàng ngồi cạnh bạn. Một phiên, một mục tiêu, mình cùng làm nhé.", isDefault: true },
  { id: "default-water-1", group: "water", text: "Đã đến giờ uống một ngụm nước ấm rồi nè bạn ơi! ☕💧", isDefault: true },
  { id: "default-water-2", group: "water", text: "Ngoan lắm! Tiếp tục thôi nào ✨", isDefault: true },
  { id: "default-focus-1", group: "focus", text: "Mình chọn đúng một việc trong năm phút tới nhé. Lumi ngồi cạnh Ong đây 🎯", isDefault: true },
  { id: "default-focus-2", group: "focus", text: "Tắt bớt xao nhãng nào. Một bước rõ ràng là đủ để bắt đầu.", isDefault: true },
  { id: "default-rest-1", group: "rest", text: "Ong đã cố gắng rồi. Mình nghỉ mắt và thả lỏng vai một chút nhé ☕", isDefault: true },
  { id: "default-rest-2", group: "rest", text: "Nghỉ ngắn không làm mất nhịp học; nó giúp Ong quay lại nhẹ nhàng hơn.", isDefault: true },
  { id: "default-celebration-1", group: "celebration", text: "Chúc mừng Ong! Từng bước nhỏ hôm nay đều rất đáng tự hào 🎉", isDefault: true },
  { id: "default-celebration-2", group: "celebration", text: "Ong đã làm được rồi! Hãy lưu lại niềm vui này trước khi chọn bước tiếp theo ✨", isDefault: true },
];

const GROUP_IDS = new Set<LumiDialogueGroup>(LUMI_DIALOGUE_GROUPS.map((group) => group.id));
const MAX_DIALOGUES = 100;

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function normalizedDialogue(value: unknown, index: number): LumiCustomDialogue | null {
  if (typeof value === "string") {
    const text = value.trim();
    return text ? { id: `legacy-dialogue-${index}`, group: "companionship", text } : null;
  }
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<LumiCustomDialogue>;
  const text = typeof candidate.text === "string" ? candidate.text.trim() : "";
  const group = typeof candidate.group === "string" && GROUP_IDS.has(candidate.group as LumiDialogueGroup) ? candidate.group as LumiDialogueGroup : null;
  if (!text || !group) return null;
  return { id: typeof candidate.id === "string" && candidate.id.trim() ? candidate.id.trim().slice(0, 100) : `lumi-dialogue-${index}`, group, text };
}

export function readLumiCustomDialogues(): LumiCustomDialogue[] {
  try {
    const raw = storage()?.getItem(LUMI_CUSTOM_DIALOGUES_STORAGE_KEY);
    if (!raw) return DEFAULT_LUMI_DIALOGUES.map((dialogue) => ({ ...dialogue }));
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_LUMI_DIALOGUES.map((dialogue) => ({ ...dialogue }));
    const values = parsed.flatMap((value, index) => { const item = normalizedDialogue(value, index); return item ? [item] : []; });
    return values.length ? values.slice(0, MAX_DIALOGUES) : DEFAULT_LUMI_DIALOGUES.map((dialogue) => ({ ...dialogue }));
  } catch {
    return DEFAULT_LUMI_DIALOGUES.map((dialogue) => ({ ...dialogue }));
  }
}

export function saveLumiCustomDialogues(dialogues: LumiCustomDialogue[]) {
  const seen = new Set<string>();
  const values = dialogues.flatMap((dialogue, index) => {
    const item = normalizedDialogue(dialogue, index);
    if (!item) return [];
    const key = `${item.group}:${item.text.toLocaleLowerCase("vi-VN")}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ ...item, isDefault: false }];
  }).slice(0, MAX_DIALOGUES);
  const saved = values.length ? values : DEFAULT_LUMI_DIALOGUES.map((dialogue) => ({ ...dialogue }));
  try { storage()?.setItem(LUMI_CUSTOM_DIALOGUES_STORAGE_KEY, JSON.stringify(saved)); } catch { /* localStorage may be unavailable */ }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<LumiCustomDialogue[]>(LUMI_CUSTOM_DIALOGUES_EVENT, { detail: saved }));
  return saved;
}

export function dialogueGroupForEmotion(emotion: string): LumiDialogueGroup {
  if (["tired", "sad", "stressed", "overwhelmed"].includes(emotion)) return "comfort";
  if (emotion === "sleepy") return "rest";
  if (emotion === "focused") return "focus";
  if (["proud", "excited"].includes(emotion)) return "celebration";
  if (["lazy", "hopeful", "confident", "comeback"].includes(emotion)) return "encouragement";
  if (emotion === "lonely") return "companionship";
  return "companionship";
}

export function dialoguesForGroup(dialogues: LumiCustomDialogue[], group: LumiDialogueGroup) {
  const values = dialogues.filter((dialogue) => dialogue.group === group);
  return values.length ? values : DEFAULT_LUMI_DIALOGUES.filter((dialogue) => dialogue.group === group);
}
