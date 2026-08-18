export type EmotionId = "calm" | "happy" | "tired" | "sad" | "stressed" | "lazy" | "proud" | "focused";

export type EmotionTheme = {
  id: EmotionId;
  label: string;
  emoji: string;
  description: string;
  encouragement: string;
  mascot: "lumi" | "ong";
  colors: { primary: string; secondary: string; soft: string; ink: string; glow: string };
};

export const emotionThemes: EmotionTheme[] = [
  { id: "calm", label: "Bình tĩnh", emoji: "🌿", description: "Nhịp học nhẹ và rõ ràng.", encouragement: "Lumi ở đây. Mình chỉ cần đi từng bước nhỏ, không cần vội.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#2e7d32", soft: "#fff4ed", ink: "#5b1717", glow: "#ffd7c2" } },
  { id: "happy", label: "Vui vẻ", emoji: "🌞", description: "Năng lượng ấm áp để bắt đầu.", encouragement: "Ong ơi, niềm vui hôm nay cũng là một phần của hành trình học tập.", mascot: "ong", colors: { primary: "#d32f2f", secondary: "#388e3c", soft: "#fff8e1", ink: "#6d1b1b", glow: "#ffe082" } },
  { id: "tired", label: "Mệt", emoji: "🥱", description: "Giảm áp lực, giữ nhịp vừa đủ.", encouragement: "Mệt cũng không sao. Mình thử hai phút thôi, rồi quyết định tiếp nhé.", mascot: "lumi", colors: { primary: "#b71c1c", secondary: "#558b2f", soft: "#f7f1ec", ink: "#4e2020", glow: "#e6d5c9" } },
  { id: "sad", label: "Buồn", emoji: "🌧️", description: "Một góc an toàn để quay lại.", encouragement: "Ong không cần phải hoàn hảo hôm nay. Chỉ cần ở đây cùng Lumi là đủ rồi.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#2f7d46", soft: "#f1f8f2", ink: "#3b4d42", glow: "#c8e6c9" } },
  { id: "stressed", label: "Căng thẳng", emoji: "🌬️", description: "Thở chậm, chia nhỏ việc.", encouragement: "Mình tạm dừng một nhịp. Việc lớn sẽ dễ hơn khi chia thành bước nhỏ.", mascot: "ong", colors: { primary: "#b3261e", secondary: "#237a57", soft: "#fff5f2", ink: "#53201e", glow: "#ffcdd2" } },
  { id: "lazy", label: "Lười", emoji: "🫠", description: "Chế độ thử 2 phút, không ép buộc.", encouragement: "Không muốn làm gì cũng được. Mình chỉ mở sách trong 2 phút thôi nhé.", mascot: "lumi", colors: { primary: "#c62828", secondary: "#6a994e", soft: "#fff9ed", ink: "#55321f", glow: "#f6d7a7" } },
  { id: "proud", label: "Tự hào", emoji: "🌟", description: "Ghi nhận từng bước đã đi.", encouragement: "Ong đã làm được rồi. Hãy nhìn lại một bước nhỏ mà mình vừa thắng.", mascot: "ong", colors: { primary: "#c62828", secondary: "#2e7d32", soft: "#fff3e0", ink: "#652019", glow: "#ffcc80" } },
  { id: "focused", label: "Tập trung", emoji: "🎯", description: "Một phiên, một mục tiêu.", encouragement: "Lumi sẽ giữ nhịp cùng Ong. Một phiên tập trung, rồi nghỉ thật tử tế.", mascot: "lumi", colors: { primary: "#ad1f1f", secondary: "#1b7a3a", soft: "#fff6f2", ink: "#4b1717", glow: "#ffb4a2" } },
];

export const defaultEmotionTheme = emotionThemes[0];

export function emotionFromCommand(command: string): EmotionTheme {
  const normalized = command.trim().toLocaleLowerCase("vi-VN");
  const found = emotionThemes.find((theme) => normalized.includes(theme.id) || normalized.includes(theme.label.toLocaleLowerCase("vi-VN")) || normalized.includes(theme.emoji));
  return found ?? defaultEmotionTheme;
}

export function comboLabel(streak: number) {
  if (streak >= 5) return { label: "Vương miện", icon: "👑" };
  if (streak >= 4) return { label: "Bốn phiên liên tiếp", icon: "🔥🔥🔥" };
  if (streak >= 3) return { label: "Ba phiên liên tiếp", icon: "🔥🔥" };
  if (streak >= 2) return { label: "Hai phiên liên tiếp", icon: "🔥" };
  return { label: "Phiên đầu tiên", icon: "🍅" };
}
