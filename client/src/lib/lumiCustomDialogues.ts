export type LumiDialogueGroup = "comfort" | "encouragement" | "hug" | "companionship" | "water";

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
];

export const DEFAULT_LUMI_DIALOGUES: LumiCustomDialogue[] = [
  { id: "default-comfort-1", group: "comfort", text: "Không sao nếu hôm nay Ong đi chậm. Mình cùng thở một nhịp rồi làm một việc thật nhỏ nhé.", isDefault: true },
  { id: "default-comfort-2", group: "comfort", text: "Lumi ở đây với Ong. Nghỉ một chút cũng là cách chăm sóc hành trình học tập.", isDefault: true },
  { id: "default-encouragement-1", group: "encouragement", text: "Lumi tin Ong làm được. Mình bắt đầu bằng năm phút thôi nhé!", isDefault: true },
  { id: "default-encouragement-2", group: "encouragement", text: "Từng bước nhỏ đều có ý nghĩa. Ong đã bắt đầu rồi, mình đi tiếp cùng nhau.", isDefault: true },
  { id: "default-hug-1", group: "hug", text: "Gửi Ong một cái ôm thật ấm. Ong không cần hoàn hảo để được yêu thương đâu.", isDefault: true },
  { id: "default-hug-2", group: "hug", text: "(っ´▽`)っ Lumi ôm Ong một cái rồi mình cùng nhẹ nhàng quay lại nhé.", isDefault: true },
  { id: "default-companionship-1", group: "companionship", text: "Lumi sẵn sàng ngồi cạnh Ong. Một phiên, một mục tiêu, mình cùng làm nhé!", isDefault: true },
  { id: "default-companionship-2", group: "companionship", text: "Ong không học một mình đâu. Lumi vẫn ở đây, cùng Ong đi từng phút.", isDefault: true },
  { id: "default-water-1", group: "water", text: "Ong ơi, uống một ngụm nước rồi mình học tiếp thật dịu dàng nhé.", isDefault: true },
  { id: "default-water-2", group: "water", text: "Một ngụm nước nhỏ cho cơ thể thêm năng lượng. Cảm ơn Ong đã chăm sóc mình!", isDefault: true },
];

const GROUP_IDS = new Set<LumiDialogueGroup>(LUMI_DIALOGUE_GROUPS.map((group) => group.id));
const MAX_DIALOGUES = 100;

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function normalizedDialogue(value: unknown, index: number): LumiCustomDialogue | null {
  if (typeof value === "string") {
    const text = value.trim().slice(0, 280);
    return text ? { id: `legacy-dialogue-${index}`, group: "companionship", text } : null;
  }
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<LumiCustomDialogue>;
  const text = typeof candidate.text === "string" ? candidate.text.trim().slice(0, 280) : "";
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
  if (["tired", "sad", "stressed", "overwhelmed", "sleepy"].includes(emotion)) return "comfort";
  if (["lazy", "focused", "hopeful", "proud", "confident", "excited", "comeback"].includes(emotion)) return "encouragement";
  if (emotion === "lonely") return "companionship";
  return "companionship";
}

export function dialoguesForGroup(dialogues: LumiCustomDialogue[], group: LumiDialogueGroup) {
  const values = dialogues.filter((dialogue) => dialogue.group === group);
  return values.length ? values : DEFAULT_LUMI_DIALOGUES.filter((dialogue) => dialogue.group === group);
}
