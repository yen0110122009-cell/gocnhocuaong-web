import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SOUND_EVENTS, soundEventDuration } from "@/lib/pomodoroAudio";

const quizSource = readFileSync("client/src/pages/QuizEnhanced.tsx", "utf8");
const homeSource = readFileSync("client/src/pages/Home.tsx", "utf8");

describe("Quiz Test/Review contract", () => {
  it("does not start countdown for review or unlimited quizzes", () => {
    expect(quizSource).toContain('active.mode === "review"');
    expect(quizSource).toContain('active.timerMode === "unlimited"');
    expect(quizSource).toContain('setSeconds(isReview ? 0 : quiz.durationMinutes * 60)');
  });

  it("plays the shared completion alert before submitting an expired timed test", () => {
    expect(quizSource).toContain('playSoundEvent("complete", 100)');
    expect(soundEventDuration("complete")).toBeGreaterThan(0);
    expect(SOUND_EVENTS.complete.length).toBeGreaterThan(1);
  });

  it("persists and restores review progress", () => {
    expect(quizSource).toContain("study-review:");
    expect(quizSource).toContain("localStorage.setItem(reviewKey");
    expect(quizSource).toContain("localStorage.getItem(`study-review:");
    expect(quizSource).toContain("Đã khôi phục tiến độ Ôn tập.");
  });
});

describe("Created content management contract", () => {
  it("supports confirmation deletion and editing metadata/content for quizzes", () => {
    expect(homeSource).toContain("Chỉnh sửa đề");
    expect(homeSource).toContain("Xóa đề");
    expect(homeSource).toContain("Nội dung câu hỏi JSON");
    expect(homeSource).toContain("window.confirm(`Xóa đề");
  });

  it("supports confirmation deletion and editing metadata/content for flashcards", () => {
    expect(homeSource).toContain("const editSet =");
    expect(homeSource).toContain("const deleteSet =");
    expect(homeSource).toContain("Nội dung thẻ JSON");
    expect(homeSource).toContain("window.confirm(`Xóa bộ");
  });
});
