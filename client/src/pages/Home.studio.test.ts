import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("AI Studio prompt contract", () => {
  const source = readFileSync(join(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("supports both outputs and preserves the learning purpose in the prompt", () => {
    expect(source).toContain('useState<"cards" | "quiz" | "both">');
    expect(source).toContain('mode: tab');
    expect(source).toContain('label="Mục đích học"');
    expect(source).toContain("purpose || \"[mục đích học]\"");
  });

  it("allows direct prompt editing and regeneration", () => {
    expect(source).toContain('aria-label="Prompt AI có thể chỉnh sửa"');
    expect(source).toContain("setPromptDraft");
    expect(source).toContain("Đã tạo lại prompt từ biểu mẫu.");
  });
});


describe("learning persistence wiring", () => {
  const source = readFileSync(join(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("persists generated cards, quizzes and flashcard-derived quizzes through the profile callback", () => {
    expect(source).toContain("flashcardSets: [set, ...profile.flashcardSets]");
    expect(source).toContain("quizzes: [quiz, ...profile.quizzes]");
    expect(source).toContain("createQuizFromSet");
    expect(source).toContain("onProfile(next");
  });
});

describe("quiz attempt persistence wiring", () => {
  const quizSource = readFileSync(join(process.cwd(), "client/src/pages/QuizEnhanced.tsx"), "utf8");

  it("keeps the completed attempt payload on the profile-save path", () => {
    expect(quizSource).toContain("const finish");
    expect(quizSource).toContain("answers");
    expect(quizSource).toContain("onProfile");
    expect(quizSource).toContain("flagged");
    expect(quizSource).toContain("completedAt");
  });
});
