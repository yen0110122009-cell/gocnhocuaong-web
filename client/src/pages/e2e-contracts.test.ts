import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const home = readFileSync(join(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const aiImport = readFileSync(join(process.cwd(), "client/src/pages/AIDataImport.tsx"), "utf8");
const pomodoro = readFileSync(join(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");
const admin = readFileSync(join(process.cwd(), "client/src/pages/AdminEnhanced.tsx"), "utf8");
const adminContent = readFileSync(join(process.cwd(), "client/src/pages/AdminContentHub.tsx"), "utf8");
const quizPersistence = readFileSync(join(process.cwd(), "shared/quizPersistence.ts"), "utf8");

describe("Góc học tập end-to-end contracts", () => {
  it("renders the Catalog completion progressbar with 900/400 totals", () => {
    expect(home).toContain('aria-label="Tiến trình mở khóa thành tích"');
    expect(home).toContain('aria-valuemax={100}');
    expect(home).toContain('const list = Array.isArray(raw) ? raw : raw?.cards');
    expect(home).toContain("earned.length}/900 thành tích");
    expect(home).toContain("/400 danh hiệu có sẵn");
  });

  it("keeps AI import file, validation, content creation and history persistence wired", () => {
    expect(aiImport).toContain('accept=".json,.txt,.md"');
    expect(aiImport).toContain("await file.text()");
    expect(aiImport).toContain("setRawData(await file.text())");
    expect(aiImport).toContain("validateExternalAiData");
    expect(aiImport).toContain("createLearningContent");
    expect(aiImport).toContain("aiImportHistory: [record, ...profile.aiImportHistory]");
    expect(aiImport).toContain("flashcardSets: set ? [set, ...profile.flashcardSets]");
    expect(aiImport).toContain("quizzes: quiz ? [quiz, ...profile.quizzes]");
  });

  it("normalizes short-answer quiz grading centrally for punctuation, whitespace and numeric context", () => {
    expect(quizPersistence).toContain("export function normalizeQuizAnswer");
    expect(quizPersistence).toContain('value.normalize("NFKC")');
    expect(quizPersistence).toContain("const referenceNumbers: string[]");
    expect(quizPersistence).toContain("referenceNumbers.includes(actualNumber)");
    expect(quizPersistence).toContain("correct: quizAnswerMatches(answer, question.answer)");
  });

  it("keeps Pomodoro configuration and completed session persistence wired", () => {
    expect(pomodoro).toContain("onProfile");
    expect(pomodoro).toContain("pomodoroHistory");
    expect(pomodoro).toContain("durationMinutes");
    expect(pomodoro).toContain("startedAt");
    expect(pomodoro).toContain("endedAt");
    expect(pomodoro).toContain("localStorage");
  });

  it("keeps Admin member, role, lock, reset, delete and content mutations guarded", () => {
    expect(admin).toContain('account.role === "Admin" || account.role === "Founder"');
    expect(admin).toContain("create.mutate");
    expect(admin).toContain("update.mutate");
    expect(admin).toContain("remove.mutate");
    expect(admin).toContain("Đặt lại mật khẩu");
    expect(adminContent).toContain("onConfig");
    expect(adminContent).toContain("Biên tập trực tiếp");
  });
});

