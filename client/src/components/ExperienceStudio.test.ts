import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { emotionFromCommand, emotionThemes } from "../lib/emotionThemes";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Bạn đồng hành Lumi · Kaomoji", () => {
  it("giữ catalog cảm xúc và chuyển câu lệnh an toàn", () => {
    expect(emotionThemes.length).toBeGreaterThanOrEqual(6);
    expect(emotionThemes.every((theme) => theme.encouragement.length > 20)).toBe(true);
    expect(emotionFromCommand("bật theme vui vẻ").id).toBe("happy");
    expect(emotionFromCommand("tôi đang mệt").id).toBe("tired");
    expect(emotionFromCommand("lệnh không xác định").id).toBe("calm");
  });

  it("thay khu vực trạng thái cũ bằng Kaomoji interactive", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    const presets = source("client/src/lib/lumiPresets.ts");
    expect(lumi).toContain("Module Kaomoji Lumi bạn đồng hành");
    expect(lumi).toContain("Chọn cảm xúc nhanh");
    expect(lumi).toContain("Hỏi thăm cảm xúc");
    expect(lumi).toContain("LUMI_CHECKIN_OPTIONS");
    for (const label of ["Mệt mỏi", "Thiếu động lực", "Cần cái ôm", "Sẵn sàng học", "Tập trung", "Đau lòng", "Lo lắng", "Bình tĩnh", "Vui vẻ"]) expect(presets).toContain(label);
    expect(lumi).toContain("Lumi đang ở đây với Ong");
    expect(lumi).toContain("LUMI_WELCOME");
    expect(lumi).toContain("lumiKaomojiForEmotion");
    expect(lumi).not.toContain("Trạng thái của hôm nay");
    expect(lumi).not.toContain("Một lời nhắc nhẹ");
  });

  it("có TTS tiếng Việt và công tắc AI đọc thoại", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    const speech = source("client/src/lib/lumiSpeech.ts");
    expect(lumi).toContain("AI đọc thoại");
    expect(lumi).toContain("speakLumiVietnamese");
    expect(speech).toContain('utterance.lang = "vi-VN"');
    expect(speech).toContain("LUMI_SPEECH_UNAVAILABLE_EVENT");
    expect(speech).toContain('return "pending"');
    expect(speech).toContain('notifySpeechUnavailable()');
    expect(lumi).toContain("LUMI_SPEECH_UNAVAILABLE_EVENT");
    expect(lumi).toContain("Nghe thử giọng đọc AI");
  });

  it("có CRUD lời thoại theo đủ 5 nhóm và khóa LocalStorage mới", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    const helper = source("client/src/lib/lumiCustomDialogues.ts");
    expect(helper).toContain('"lumi_custom_dialogues"');
    expect(helper).toContain('"comfort"');
    expect(helper).toContain('"encouragement"');
    expect(helper).toContain('"hug"');
    expect(helper).toContain('"companionship"');
    expect(helper).toContain('"water"');
    expect(helper).toContain("Đừng lo nhé");
    expect(helper).toContain("Cùng tập trung học thật tốt nhé");
    expect(helper).toContain("Đã đến giờ uống một ngụm nước ấm");
    expect(lumi).toContain("Thêm, sửa và nghe thử câu nói");
    expect(lumi).toContain("Chỉnh sửa");
    expect(lumi).toContain("Xóa");
    expect(lumi).toContain("LUMI_CUSTOM_DIALOGUES_EVENT");
    expect(lumi).toContain("lumi_multi_dialogues_data");
    expect(lumi).toContain("Quản lý nhiều câu thoại theo từng biểu tượng");
    expect(lumi).toContain("Thêm câu thoại mới");
    expect(lumi).toContain("Khôi phục bộ câu gốc");
    expect(lumi).toContain("phát luân phiên ngẫu nhiên");
    expect(lumi).toContain("LUMI_MULTI_DIALOGUES_EVENT");
    expect(lumi).toContain("Từ khóa phát hiện cảm xúc");
    expect(lumi).toContain("lumi_custom_keywords");
    expect(lumi).toContain("Thêm từ khóa mới");
    expect(lumi).toContain("Kích hoạt Lumi");
  });

  it("cho phép tùy chỉnh mô tả và câu thoại từng Kaomoji", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    const helper = source("client/src/lib/lumiMultiDialogues.ts");
    const pomodoro = source("client/src/pages/Pomodoro.tsx");
    expect(helper).toContain('"lumi_custom_kaomoji_data"');
    expect(helper).toContain("LumiCustomKaomojiData");
    expect(helper).toContain("saveLumiCustomKaomojiItem");
    expect(helper).toContain("restoreLumiCustomKaomojiItem");
    expect(lumi).toContain("Tên mô tả hành động");
    expect(lumi).toContain("Câu thoại phát ra");
    expect(lumi).toContain("Lưu thay đổi");
    expect(lumi).toContain("Khôi phục mặc định");
    expect(lumi).toContain("saveLumiCustomKaomojiItem");
    expect(pomodoro).toContain("lumiKaomojiDescription");
    expect(pomodoro).toContain("lumiDialogResponse?.description");
  });

  it("không còn gắn recorder cũ vào menu Lumi", () => {
    const home = source("client/src/pages/Home.tsx");
    expect(home).toContain('view === "lumi"');
    expect(home).toContain("ExperienceStudioDeferred");
    expect(home).not.toContain("<EmotionCompanionMediaControls profile={profile} emotion={selected}");
  });
});
