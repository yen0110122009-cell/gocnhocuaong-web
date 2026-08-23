import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { emotionFromCommand, emotionThemes } from "../lib/emotionThemes";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Bạn đồng hành Lumi", () => {
  it("giữ catalog cảm xúc và chuyển câu lệnh an toàn", () => {
    expect(emotionThemes.length).toBeGreaterThanOrEqual(6);
    expect(emotionThemes.every((theme) => theme.encouragement.length > 20)).toBe(true);
    expect(emotionFromCommand("bật theme vui vẻ").id).toBe("happy");
    expect(emotionFromCommand("tôi đang mệt").id).toBe("tired");
    expect(emotionFromCommand("lệnh không xác định").id).toBe("calm");
  });

  it("cho phép chọn trạng thái, phát lời đã lưu và không áp đặt cảm xúc", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    expect(lumi).toContain("Lumi đang đồng hành thế nào?");
    expect(lumi).toContain("onSelect(emotion.id)");
    expect(lumi).toContain("Lumi đã cập nhật trạng thái đồng hành.");
    expect(lumi).toContain('item.kind === "comfort" || item.kind === "encouragement"');
    expect(lumi).toContain("Nghe lời Lumi");
  });

  it("gắn thư viện ghi âm tại menu Lumi riêng", () => {
    const home = source("client/src/pages/Home.tsx");
    const media = source("client/src/components/EmotionCompanionMediaControls.tsx");
    expect(home).toContain("function LumiCompanion");
    expect(home).toContain("EmotionCompanionMediaControls profile={profile}");
    expect(home).toContain('view === "lumi"');
    expect(media).toContain("Bộ sưu tập bản thu Lumi");
    expect(media).toContain("Nhấn để nghe");
  });

  it("loại Boss, combo, nhiệm vụ ngẫu nhiên và preset khỏi không gian đồng hành", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    expect(lumi).toContain("không có Boss, combo, nhiệm vụ ngẫu nhiên");
    expect(lumi).not.toContain("AudioCenterEnhancements");
    expect(lumi).not.toContain("Preset Pomodoro");
  });
});
