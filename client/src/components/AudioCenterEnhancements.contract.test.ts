import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("ranh giới âm thanh sau tái cấu trúc", () => {
  it("giữ lời Lumi là văn bản TTS và chỉ đọc sau thao tác người dùng", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    const speech = source("client/src/lib/lumiSpeech.ts");
    expect(lumi).toContain("Nghe thử giọng đọc AI");
    expect(lumi).toContain("speakLumiVietnamese");
    expect(speech).toContain('utterance.lang = "vi-VN"');
    expect(lumi).not.toContain("new Audio(currentVoice.audioUrl)");
  });

  it("đặt điều khiển giao diện yêu thích ở trang Giao diện thay vì trong Lumi", () => {
    const home = source("client/src/pages/Home.tsx");
    expect(home).toContain("Mở Giao diện yêu thích");
    expect(home).toContain('onView("appearance")');
    expect(home).toContain("Lumi");
  });

  it("không đưa Audio Center, preset hay âm nền Pomodoro vào Lumi", () => {
    const lumi = source("client/src/components/ExperienceStudio.tsx");
    expect(lumi).not.toContain("AudioCenterEnhancements");
    expect(lumi).not.toContain("Preset Pomodoro");
    expect(lumi).not.toContain("ambientTrackRef");
    expect(lumi).not.toContain("Boss Trì hoãn");
  });
});
