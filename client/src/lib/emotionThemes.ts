export type EmotionId = "calm" | "happy" | "tired" | "sad" | "stressed" | "lazy" | "proud" | "focused" | "hopeful" | "overwhelmed" | "sleepy" | "excited" | "lonely" | "confident" | "curious" | "comeback";

export type EmotionTheme = {
  id: EmotionId;
  label: string;
  emoji: string;
  command: string;
  description: string;
  encouragement: string;
  mascot: "lumi" | "ong";
  colors: { primary: string; secondary: string; soft: string; ink: string; glow: string };
};

export const emotionThemes: EmotionTheme[] = [
  { id: "calm", label: "Bình tĩnh", emoji: "🌿", command: "bình tĩnh", description: "Nhịp học nhẹ và rõ ràng.", encouragement: "Lumi ở đây. Mình chỉ cần đi từng bước nhỏ, không cần vội.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#2e7d32", soft: "#fff4ed", ink: "#5b1717", glow: "#ffd7c2" } },
  { id: "happy", label: "Vui vẻ", emoji: "🌞", command: "vui vẻ", description: "Năng lượng ấm áp để bắt đầu.", encouragement: "Lumi vui cùng Ong. Niềm vui hôm nay cũng là một phần của hành trình học tập.", mascot: "lumi", colors: { primary: "#d32f2f", secondary: "#388e3c", soft: "#fff8e1", ink: "#6d1b1b", glow: "#ffe082" } },
  { id: "tired", label: "Mệt", emoji: "🥱", command: "mệt", description: "Giảm áp lực, giữ nhịp vừa đủ.", encouragement: "Lumi hiểu là Ong đang mệt. Mình thử hai phút thôi, rồi quyết định tiếp nhé.", mascot: "lumi", colors: { primary: "#b71c1c", secondary: "#558b2f", soft: "#f7f1ec", ink: "#4e2020", glow: "#e6d5c9" } },
  { id: "sad", label: "Buồn", emoji: "🌧️", command: "buồn", description: "Một góc an toàn để quay lại.", encouragement: "Lumi ở bên Ong. Ong không cần hoàn hảo hôm nay; chỉ cần ở đây là đủ rồi.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#2f7d46", soft: "#f1f8f2", ink: "#3b4d42", glow: "#c8e6c9" } },
  { id: "stressed", label: "Căng thẳng", emoji: "🌬️", command: "căng thẳng", description: "Thở chậm, chia nhỏ việc.", encouragement: "Lumi cùng Ong tạm dừng một nhịp. Việc lớn sẽ dễ hơn khi chia thành bước nhỏ.", mascot: "lumi", colors: { primary: "#b3261e", secondary: "#237a57", soft: "#fff5f2", ink: "#53201e", glow: "#ffcdd2" } },
  { id: "lazy", label: "Lười", emoji: "🫠", command: "chế độ lười", description: "Chế độ thử 2 phút, không ép buộc.", encouragement: "Lumi không ép Ong đâu. Mình chỉ mở sách trong 2 phút thôi nhé.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#6a994e", soft: "#fff9ed", ink: "#55321f", glow: "#f6d7a7" } },
  { id: "proud", label: "Tự hào", emoji: "🌟", command: "tự hào", description: "Ghi nhận từng bước đã đi.", encouragement: "Lumi nhìn thấy rồi: Ong đã làm được. Hãy ghi nhận một bước nhỏ mà mình vừa thắng.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#2e7d32", soft: "#fff3e0", ink: "#652019", glow: "#ffcc80" } },
  { id: "focused", label: "Tập trung", emoji: "🎯", command: "tập trung", description: "Một phiên, một mục tiêu.", encouragement: "Lumi sẽ giữ nhịp cùng Ong. Một phiên tập trung, rồi nghỉ thật tử tế.", mascot: "lumi", colors: { primary: "#ad1f1f", secondary: "#1b7a3a", soft: "#fff6f2", ink: "#4b1717", glow: "#ffb4a2" } },
  { id: "hopeful", label: "Hy vọng", emoji: "🌱", command: "hy vọng", description: "Nhìn về bước tiếp theo, không phán xét bước cũ.", encouragement: "Lumi tin vào bước nhỏ của Ong. Chưa cần thấy cả con đường, mình chỉ cần thấy bước kế tiếp.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#388e3c", soft: "#effaf0", ink: "#4c2020", glow: "#b9e6bd" } },
  { id: "overwhelmed", label: "Quá tải", emoji: "🫧", command: "quá tải", description: "Thu nhỏ nhiệm vụ để đầu óc có chỗ thở.", encouragement: "Lumi sẽ giúp Ong gỡ từng nút. Hôm nay chỉ chọn một việc nhỏ nhất thôi.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#2e7d32", soft: "#fff3f0", ink: "#4c2220", glow: "#ffc9c0" } },
  { id: "sleepy", label: "Buồn ngủ", emoji: "🌙", command: "buồn ngủ", description: "Nhịp chậm, ánh sáng dịu, nhiệm vụ ngắn.", encouragement: "Lumi ở đây, Ong không cần cố quá sức. Mình thử một nhiệm vụ ngắn rồi nghỉ nhé.", mascot: "lumi", colors: { primary: "#b71c1c", secondary: "#558b2f", soft: "#f3f8f2", ink: "#3f2929", glow: "#cde3c8" } },
  { id: "excited", label: "Hào hứng", emoji: "⚡", command: "hào hứng", description: "Dùng năng lượng tốt để mở một phiên học rõ mục tiêu.", encouragement: "Lumi thấy Ong đang có lửa. Mình biến năng lượng này thành một chiến thắng nhỏ nhé.", mascot: "lumi", colors: { primary: "#e53935", secondary: "#2e7d32", soft: "#fff1ed", ink: "#651414", glow: "#ffb49e" } },
  { id: "lonely", label: "Cô đơn", emoji: "🤝", command: "cần đồng hành", description: "Một góc học có Lumi ở bên.", encouragement: "Lumi đang ở đây cùng Ong. Mình học cạnh nhau, từng phút một, không phải một mình.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#43a047", soft: "#f1faf2", ink: "#3f2929", glow: "#b8e4bd" } },
  { id: "confident", label: "Tự tin", emoji: "🦁", command: "tự tin", description: "Bắt đầu bằng điều Ong đã biết và tiến thêm một bước.", encouragement: "Lumi tin Ong làm được. Hãy bắt đầu bằng một câu hỏi, một thẻ nhớ hoặc một phút tập trung.", mascot: "lumi", colors: { primary: "#d32f2f", secondary: "#2e7d32", soft: "#fff5ee", ink: "#5a1d1d", glow: "#ffc7ae" } },
  { id: "curious", label: "Tò mò", emoji: "🔎", command: "tò mò", description: "Biến câu hỏi thành động lực khám phá.", encouragement: "Lumi thích sự tò mò của Ong. Mình chọn một câu hỏi và cùng tìm câu trả lời nhé.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#388e3c", soft: "#f0faf0", ink: "#4a2424", glow: "#b8e4b8" } },
  { id: "comeback", label: "Quay lại", emoji: "🔁", command: "quay lại", description: "Không cần bắt đầu hoàn hảo, chỉ cần bắt đầu lại.", encouragement: "Lumi mừng vì Ong đã quay lại. Một bước hôm nay vẫn có giá trị, dù hôm qua chưa trọn vẹn.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#2e7d32", soft: "#fff4ef", ink: "#541b1b", glow: "#ffc5b6" } },
];

export const defaultEmotionTheme = emotionThemes[0];

export function emotionFromCommand(command: string): EmotionTheme {
  const normalized = command.trim().toLocaleLowerCase("vi-VN");
  const found = emotionThemes.find((theme) => normalized.includes(theme.id) || normalized.includes(theme.label.toLocaleLowerCase("vi-VN")) || normalized.includes(theme.emoji) || normalized.includes(theme.command));
  return found ?? defaultEmotionTheme;
}

export function comboLabel(streak: number) {
  if (streak >= 5) return { label: "Vương miện", icon: "👑" };
  if (streak >= 4) return { label: "Bốn phiên liên tiếp", icon: "🔥🔥🔥" };
  if (streak >= 3) return { label: "Ba phiên liên tiếp", icon: "🔥🔥" };
  if (streak >= 2) return { label: "Hai phiên liên tiếp", icon: "🔥" };
  return { label: "Phiên đầu tiên", icon: "🍅" };
}
