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
    expect(lumi).toContain("Module Kaomoji Lumi bạn đồng hành");
    expect(lumi).toContain("Chọn cảm xúc nhanh");
    expect(lumi).toContain("Hỏi thăm cảm xúc");
    expect(lumi).toContain("Mệt mỏi");
    expect(lumi).toContain("Thiếu động lực");
    expect(lumi).toContain("Cần cái ôm");
    expect(lumi).toContain("Sẵn sàng học");
    expect(lumi).toContain("Lumi đang ở đây với Ong");
    expect(lumi).not.toContain("Trạng thái của hôm nay");
    expect(lumi).not.toContain("Một lời nhắc nhẹ");
  });

  it("có TTS tiếng Việt và công tắc AI đọc thoại", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    expect(lumi).toContain("AI đọc thoại");
    expect(lumi).toContain("speechSynthesis");
    expect(lumi).toContain('utterance.lang = "vi-VN"');
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
    expect(lumi).toContain("Thêm, sửa và nghe thử câu nói");
    expect(lumi).toContain("Chỉnh sửa");
    expect(lumi).toContain("Xóa");
    expect(lumi).toContain("LUMI_CUSTOM_DIALOGUES_EVENT");
  });

  it("không còn gắn recorder cũ vào menu Lumi", () => {
    const home = source("client/src/pages/Home.tsx");
    expect(home).toContain('view === "lumi"');
    expect(home).toContain("ExperienceStudioDeferred");
    expect(home).not.toContain("<EmotionCompanionMediaControls profile={profile} emotion={selected}");
  });
});
