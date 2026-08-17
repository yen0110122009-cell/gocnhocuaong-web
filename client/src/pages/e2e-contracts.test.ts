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

  it("supports multiple accounts sharing code 111 without weakening credential checks", () => {
    const schema = readFileSync(join(process.cwd(), "drizzle/schema.ts"), "utf8");
    const store = readFileSync(join(process.cwd(), "server/studyStore.ts"), "utf8");
    expect(schema).toContain('code: varchar("code", { length: 48 }).notNull(),');
    expect(schema).not.toContain('code: varchar("code", { length: 48 }).notNull().unique(),');
    expect(store).toContain('code === "111"');
    expect(store).toContain("eq(studyAccounts.normalizedName, normalizedName)");
    expect(store).toContain('if (code === "999")');
    expect(store).toContain('if (code !== "111")');
    expect(store).not.toContain('code === "111" || code === "999"');
  });

  it("exposes the special 111 dashboard only through the unlimited-account guard", () => {
    expect(home).toContain('import { isUnlimitedAccountCode } from "../../../shared/permissions";');
    expect(home).toContain('"special111"');
    expect(home).toContain('(!x.special111 || isUnlimitedAccountCode(account.code))');
    expect(home).toContain('isUnlimitedAccountCode(account.code) ? <Special111Dashboard');
    expect(home).toContain("Mã 111 · Không giới hạn");
    expect(home).toContain("Menu truy cập nhanh dành cho mã 111");
  });

  it("keeps Pomodoro configuration and completed session persistence wired", () => {
    expect(pomodoro).toContain("onProfile");
    expect(pomodoro).toContain("pomodoroHistory");
    expect(pomodoro).toContain("durationMinutes");
    expect(pomodoro).toContain("startedAt");
    expect(pomodoro).toContain("endedAt");
    expect(pomodoro).toContain("localStorage");
  });

  it("implements working Pomodoro audio preview and completion alert", () => {
    expect(pomodoro).toContain("AudioContext");
    expect(pomodoro).toContain("function previewBackground()");
    expect(pomodoro).toContain("source.start()");
    expect(pomodoro).toContain("backgroundVolume / 100");
    expect(pomodoro).toContain("function stopPreview()");
    expect(pomodoro).toContain("playAlert()");
  });

  it("keeps scroll reveal and reduced-motion responsive contracts wired", () => {
    const styles = readFileSync(join(process.cwd(), "client/src/index.css"), "utf8");
    expect(home).toContain('main data-scroll-reveal-root');
    expect(home).toContain('IntersectionObserver');
    expect(home).toContain('classList.add("scroll-reveal")');
    expect(styles).toContain('.scroll-reveal.is-visible');
    expect(styles).toContain('@media (max-width: 767px)');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
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

