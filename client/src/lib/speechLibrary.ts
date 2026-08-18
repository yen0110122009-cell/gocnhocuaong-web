import type { ContentContext, ContentModule, CustomContentItem, MascotVoiceLine } from "../../../shared/study";

export type SpeechGroup = "comfort" | "encouragement" | "understanding" | "antiProcrastination";
export type SpeechEvent = "mistake" | "lowScore" | "todoMissed" | "pomodoroAbandoned" | "streakLost" | "ineffective" | "comeback" | "start" | "complete" | "critical" | "hardTask" | "procrastination";
export type LumiSpeech = { id: string; group: SpeechGroup; event: SpeechEvent; text: string; action?: string };

export const speechGroupLabels: Record<SpeechGroup, string> = {
  comfort: "Lời an ủi",
  encouragement: "Lời động viên",
  understanding: "Gợi ý hiểu bài",
  antiProcrastination: "Chống trì hoãn",
};

export const lumiSpeechLibrary: LumiSpeech[] = [
  { id: "comfort-mistake", group: "comfort", event: "mistake", text: "Sai một câu không có nghĩa là Ong không hiểu. Nó chỉ cho mình biết chỗ nào cần nhìn lại thôi. 🐝💛" },
  { id: "comfort-score", group: "comfort", event: "lowScore", text: "Điểm thấp là một tín hiệu, không phải nhãn dán về khả năng của Ong. Lumi sẽ cùng Ong tìm đúng chỗ cần luyện." },
  { id: "comfort-todo", group: "comfort", event: "todoMissed", text: "Todo chưa xong cũng không sao. Mình chọn lại một việc nhỏ nhất, không cần tự trách mình." },
  { id: "comfort-abandoned", group: "comfort", event: "pomodoroAbandoned", text: "Bỏ dở một phiên không xóa đi thời gian Ong đã cố gắng. Lumi vẫn ghi nhận từng phút đó." },
  { id: "comfort-streak", group: "comfort", event: "streakLost", text: "Mất streak chỉ là mất một con số. Hành trình của Ong vẫn còn nguyên và mình có thể bắt đầu lại ngay hôm nay." },
  { id: "comfort-ineffective", group: "comfort", event: "ineffective", text: "Có ngày học chưa vào cũng bình thường. Lumi giúp Ong đổi cách học, chứ không phán xét Ong." },
  { id: "comfort-comeback", group: "comfort", event: "comeback", text: "Lumi mừng vì Ong đã quay lại. Một bước hôm nay vẫn có giá trị, dù hôm qua chưa trọn vẹn." },
  { id: "encourage-start", group: "encouragement", event: "start", text: "Không cần thắng cả ngày hôm nay. Chỉ cần thắng 5 phút tiếp theo thôi." },
  { id: "encourage-complete", group: "encouragement", event: "complete", text: "Ong vừa hoàn thành một phiên rồi! Lumi tự hào vì Ong đã giữ lời hứa nhỏ với chính mình." },
  { id: "encourage-critical", group: "encouragement", event: "critical", text: "Còn 5 phút cuối. Lumi ở đây, mình không cần hoàn hảo; chỉ cần ở lại thêm một chút." },
  { id: "encourage-hard", group: "encouragement", event: "hardTask", text: "Nhiệm vụ khó không cần bị giải quyết trong một lần. Chia nhỏ nó ra, Lumi sẽ giữ nhịp cùng Ong." },
  { id: "understand-explain", group: "understanding", event: "start", text: "Đừng nhìn đáp án trước. Thử nói lại xem vì sao mình chọn cách làm này." },
  { id: "understand-error", group: "understanding", event: "mistake", text: "Hãy tìm bước đầu tiên mà cách làm thay đổi hướng. Hiểu lỗi sai giúp Ong nhớ lâu hơn việc chỉ xem đáp án." },
  { id: "understand-review", group: "understanding", event: "ineffective", text: "Thử tự giải thích bài bằng lời của Ong như đang dạy Lumi. Chỗ nào nói chưa rõ chính là chỗ cần ôn thêm." },
  { id: "understand-recall", group: "understanding", event: "complete", text: "Gấp tài liệu lại và kể ba ý chính. Tự nhớ lại là cách kiểm tra xem kiến thức đã ở lại chưa." },
  { id: "anti-open", group: "antiProcrastination", event: "procrastination", text: "Không muốn học cũng được. Mình chỉ mở sách trong 2 phút thôi.", action: "Mở nhiệm vụ 2 phút" },
  { id: "anti-formula", group: "antiProcrastination", event: "procrastination", text: "Mở vở và đọc đúng một công thức. Chỉ một công thức, không cần làm nhiều hơn.", action: "Đọc một công thức" },
  { id: "anti-five", group: "antiProcrastination", event: "procrastination", text: "Chọn một góc nhỏ để bắt đầu. Năm phút đầu tiên là đủ để phá bức tường trì hoãn.", action: "🍅 Học 5 phút" },
  { id: "anti-old", group: "antiProcrastination", event: "procrastination", text: "Ôn lại một điều Ong đã từng biết. Khởi động bằng bài cũ cũng là đang tiến lên.", action: "📖 Ôn bài cũ" },
  { id: "anti-random", group: "antiProcrastination", event: "procrastination", text: "Lumi chọn nhiệm vụ nhẹ cho Ong nhé. Mình không cần quyết định quá nhiều lúc đang mệt.", action: "🎲 Lumi chọn nhiệm vụ" },
];

export const microTasks = ["Mở sách.", "Viết ngày hôm nay.", "Đọc một định nghĩa.", "Làm một câu.", "Viết lại một công thức.", "Tự giải thích một khái niệm.", "Kiểm tra một câu sai."] as const;
export const gentleReminders = ["Nếu hôm nay chưa làm được nhiều thì cũng không sao. Mình thử làm một việc nhỏ trước nhé.", "Lumi không ép Ong phải hoàn hảo. Một bước nhỏ cũng là một bước tiến.", "Mình có thể bắt đầu thật nhẹ, rồi quyết định bước tiếp theo sau."] as const;
export function randomMicroTask() { return microTasks[Math.floor(Math.random() * microTasks.length)] ?? microTasks[0]; }
export const antiProcrastinationChoices = [
  { id: "five", label: "🍅 Học 5 phút", description: "Một phiên ngắn để khởi động lại." },
  { id: "review", label: "📖 Ôn bài cũ", description: "Đọc lại một phần quen thuộc." },
  { id: "lumi", label: "🎲 Lumi chọn nhiệm vụ", description: "Nhận một nhiệm vụ nhỏ ngẫu nhiên." },
] as const;

export const contentModuleLabels: Record<ContentModule, string> = {
  pomodoro: "🍅 Pomodoro",
  quiz: "📝 Làm đề",
  deepStudy: "🧠 Hiểu tận gốc",
  achievement: "🏆 Thành tích",
  journal: "📔 Nhật ký",
  antiProcrastination: "🎯 Chống trì hoãn",
  global: "🌍 Dùng chung",
};

export function speechForEvent(event: SpeechEvent, group?: SpeechGroup) {
  const candidates = lumiSpeechLibrary.filter((item) => item.event === event && (!group || item.group === group));
  return candidates[Math.floor(Math.random() * candidates.length)] ?? lumiSpeechLibrary[0];
}

export function mascotVoiceForState(lines: MascotVoiceLine[] = [], state: string) {
  const candidates = lines
    .filter((line) => line.state === state && line.enabled && !line.deletedAt && line.text.trim())
    .slice()
    .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? "") || a.id.localeCompare(b.id));
  return candidates[0];
}

export function mascotReactionForAchievement(lines: MascotVoiceLine[] = [], state: "achievement" | "almost_unlocked" | "streak_recovered" | "mistake" = "achievement") {
  return mascotVoiceForState(lines, state) ?? mascotVoiceForState(lines, "achievement");
}

export function randomAntiProcrastinationSpeech() {
  const items = lumiSpeechLibrary.filter((item) => item.group === "antiProcrastination");
  return items[Math.floor(Math.random() * items.length)] ?? lumiSpeechLibrary[0];
}

export function activeContentFor(config: { customContent?: CustomContentItem[] }, module: ContentModule, context: ContentContext, recentIds: string[] = []) {
  const pool = (config.customContent ?? []).filter((item) => {
    const modules = item.modules?.length ? item.modules : ["global"];
    return item.enabled && !item.deletedAt && (modules.includes(module) || modules.includes("global")) && item.contexts.includes(context);
  });
  if (!pool.length) return undefined;
  const fresh = pool.filter((item) => !recentIds.includes(item.id));
  const ranked = (fresh.length ? fresh : pool).slice().sort((a, b) => (a.useCount ?? 0) - (b.useCount ?? 0) || (a.lastUsedAt ?? "").localeCompare(b.lastUsedAt ?? ""));
  const top = ranked.slice(0, Math.min(3, ranked.length));
  return top[Math.floor(Math.random() * top.length)] ?? ranked[0];
}

export function markContentUsed(items: CustomContentItem[], id: string, now = new Date().toISOString()) {
  return items.map((item) => item.id === id ? { ...item, lastUsedAt: now, useCount: (item.useCount ?? 0) + 1 } : item);
}

export function moveContentToTrash(items: CustomContentItem[], ids: string[], now = new Date().toISOString()) {
  const selected = new Set(ids);
  return items.map((item) => selected.has(item.id) ? { ...item, enabled: false, deletedAt: now } : item);
}

export function restoreContent(items: CustomContentItem[], ids: string[]) {
  const selected = new Set(ids);
  return items.map((item) => selected.has(item.id) ? { ...item, enabled: true, deletedAt: undefined } : item);
}
