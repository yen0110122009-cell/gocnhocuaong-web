import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const source = (path: string) => readFileSync(resolve(root, path), "utf8");
const home = () => source("client/src/pages/Home.tsx");
const pomodoro = () => source("client/src/pages/Pomodoro.tsx");
const lumi = () => source("client/src/components/ExperienceStudio.tsx");
const mediaControls = () => source("client/src/components/EmotionCompanionMediaControls.tsx");

describe("Lumi và Pomodoro sau tái cấu trúc", () => {
  it("đưa Kế hoạch, Pomodoro, Lumi và AI hợp nhất vào luồng Home", () => {
    expect(home()).toContain("StudyPlanDashboard");
    expect(home()).toContain("Bạn đồng hành Lumi");
    expect(home()).toContain("AIDataImport");
  });

  it("giữ Pomodoro có ngữ cảnh học và hỗ trợ Lumi trực tiếp", () => {
    expect(pomodoro()).toContain("checkedPlanItemIds");
    expect(pomodoro()).toContain("notes");
    expect(pomodoro()).toContain("Cần an ủi");
    expect(pomodoro()).toContain("Cần động viên");
    expect(pomodoro()).toContain("Đã hoàn thành phiên.");
  });

  it("không để Pomodoro gọi lại chuỗi thưởng XP hoặc cơ chế trì hoãn cũ", () => {
    expect(pomodoro()).not.toContain("applyStudyActivityRewards(");
    expect(pomodoro()).not.toContain("TASK_COMBOS");
    expect(pomodoro()).not.toContain("chooseMicroTask");
    expect(pomodoro()).not.toContain("startTwoMinutes");
  });

  it("giữ Lumi tập trung vào Kaomoji và lời khích lệ, không chứa preset hay Boss", () => {
    expect(lumi()).toContain("Module Kaomoji Lumi bạn đồng hành");
    expect(lumi()).toContain("Chọn cảm xúc nhanh");
    expect(lumi()).toContain("Hỏi thăm cảm xúc");
    expect(lumi()).not.toContain("Trạng thái của hôm nay");
    expect(lumi()).not.toContain("Một lời nhắc nhẹ");
    expect(lumi()).not.toContain("AudioCenterEnhancements");
    expect(lumi()).not.toContain("Boss Trì Hoãn");
  });

  it("giữ thư viện ghi âm Lumi ở thành phần dành riêng và không dùng ảnh linh vật cũ", () => {
    expect(mediaControls()).toContain("Nhấn để nghe");
    expect(mediaControls()).toContain("MediaRecorder");
    expect(mediaControls()).not.toContain("Chưa có ảnh");
  });
});
