import { describe, expect, it } from "vitest";
import { emotionFromCommand, emotionThemes } from "./emotionThemes";

describe("emotion theme studio", () => {
  it("cung cấp nhiều trạng thái với lời động viên và mascot mapping", () => {
    expect(emotionThemes.length).toBeGreaterThanOrEqual(8);
    expect(emotionThemes.every((theme) => theme.encouragement.length > 20)).toBe(true);
    expect(emotionThemes.every((theme) => theme.mascot === "lumi")).toBe(true);
    expect(emotionThemes.every((theme) => /Lumi/i.test(theme.encouragement))).toBe(true);
    expect(emotionThemes.some((theme) => theme.id === "lazy")).toBe(true);
    expect(emotionThemes.some((theme) => theme.id === "stressed")).toBe(true);
  });

  it("chỉ ánh xạ câu lệnh vào catalog cảm xúc cho phép", () => {
    expect(emotionFromCommand("bật theme vui vẻ").id).toBe("happy");
    expect(emotionFromCommand("tôi đang rất lười").id).toBe("lazy");
    expect(emotionFromCommand("câu lệnh không hợp lệ").id).toBe("calm");
  });

  it("dùng nhãn cảm xúc trực tiếp, không hiển thị chữ bật thừa", () => {
    expect(emotionThemes).toHaveLength(16);
    expect(emotionThemes.every((theme) => !theme.command.toLocaleLowerCase("vi-VN").includes("bật"))).toBe(true);
    expect(emotionFromCommand("cần đồng hành").id).toBe("lonely");
  });
});
