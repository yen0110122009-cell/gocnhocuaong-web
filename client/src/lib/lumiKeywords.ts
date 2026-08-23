export type LumiKeywordRule = {
  id: string;
  keyword: string;
  kaomoji: string;
  dialogue: string;
};

export const LUMI_KEYWORDS_STORAGE_KEY = "lumi_custom_keywords";
export const LUMI_KEYWORDS_EVENT = "gocnhocuaong:lumi-keywords-updated";
export const DEFAULT_LUMI_KEYWORDS: LumiKeywordRule[] = [
  { id: "keyword-tired", keyword: "mệt, đuối, kiệt sức", kaomoji: "(つ_ <｡)", dialogue: "Đừng khóc nha, có Lumi ở đây ôm bạn nè 🍀" },
  { id: "keyword-hug", keyword: "cần ôm, ôm mình, cô đơn", kaomoji: "(つ≧▽≦)つ", dialogue: "Cho bạn một cái ôm thật chặt nè 💖!" },
  { id: "keyword-focus", keyword: "sẵn sàng, tập trung, bắt đầu", kaomoji: "٩(ˊᗜˋ*)و", dialogue: "Tập trung cao độ nào, bạn chắc chắn làm được!" },
  { id: "keyword-water", keyword: "khát, uống nước, tiếp nước", kaomoji: "(´ー`)旦~~", dialogue: "Đã đến giờ tiếp nước rồi, uống một ngụm nhé!" },
  { id: "keyword-joy", keyword: "vui, hạnh phúc, hoàn thành", kaomoji: "٩(◕‿◕｡)۶", dialogue: "Hoàn thành xuất sắc rồi! Tuyệt vời quá đi 🥳" },
];

function cloneDefaults() {
  return DEFAULT_LUMI_KEYWORDS.map((rule) => ({ ...rule }));
}

function normalizeRule(value: unknown, index: number): LumiKeywordRule | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { id?: unknown; keyword?: unknown; kaomoji?: unknown; dialogue?: unknown };
  const keyword = typeof candidate.keyword === "string" ? candidate.keyword.trim().slice(0, 180) : "";
  const kaomoji = typeof candidate.kaomoji === "string" ? candidate.kaomoji.trim().slice(0, 80) : "";
  const dialogue = typeof candidate.dialogue === "string" ? candidate.dialogue.trim() : "";
  if (!keyword || !kaomoji || !dialogue) return null;
  return { id: typeof candidate.id === "string" && candidate.id.trim() ? candidate.id.trim().slice(0, 100) : `lumi-keyword-${index}`, keyword, kaomoji, dialogue };
}

export function readLumiKeywords(): LumiKeywordRule[] {
  try {
    const raw = typeof window === "undefined" ? null : window.localStorage.getItem(LUMI_KEYWORDS_STORAGE_KEY);
    if (!raw) return cloneDefaults();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return cloneDefaults();
    const values = parsed.flatMap((value, index) => { const rule = normalizeRule(value, index); return rule ? [rule] : []; });
    return values.length ? values.slice(0, 100) : cloneDefaults();
  } catch {
    return cloneDefaults();
  }
}

export function saveLumiKeywords(rules: LumiKeywordRule[]) {
  const seen = new Set<string>();
  const values = rules.flatMap((rule, index) => {
    const normalized = normalizeRule(rule, index);
    if (!normalized) return [];
    const key = normalized.keyword.toLocaleLowerCase("vi-VN");
    if (seen.has(key)) return [];
    seen.add(key);
    return [normalized];
  }).slice(0, 100);
  const saved = values.length ? values : cloneDefaults();
  try { if (typeof window !== "undefined") window.localStorage.setItem(LUMI_KEYWORDS_STORAGE_KEY, JSON.stringify(saved)); } catch { /* localStorage may be unavailable */ }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<LumiKeywordRule[]>(LUMI_KEYWORDS_EVENT, { detail: saved }));
  return saved;
}

export function findLumiKeywordRule(rules: LumiKeywordRule[], status: string) {
  const normalizedStatus = status.toLocaleLowerCase("vi-VN").trim();
  return rules.find((rule) => rule.keyword.split(",").some((keyword) => keyword.trim() && normalizedStatus.includes(keyword.trim().toLocaleLowerCase("vi-VN")))) ?? null;
}
