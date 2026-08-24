import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const home = read("client/src/pages/Home.tsx");
const quiz = read("client/src/pages/QuizEnhanced.tsx");
const pomodoro = read("client/src/pages/Pomodoro.tsx");
const focusHub = read("client/src/pages/FocusHub.tsx");
const admin = read("client/src/pages/AdminWorkspace.tsx");
const activeShell = home.slice(home.indexOf("export default function Home"), home.indexOf("export function Login"));

const cleanDashboard = home.slice(home.indexOf("function CleanDashboard"), home.indexOf("function CleanLearningProgress"));
const activeViews = home.slice(home.indexOf("function Views"), home.indexOf("function LearningProgress"));

describe("legacy learning-surface removal contract", () => {
  it("keeps the main navigation and active view dispatcher on the time-goal learning flow", () => {
    expect(activeViews).toContain('view === "goals"');
    expect(activeViews).toContain('view === "pomodoro"');
    expect(activeViews).toContain('view === "lumi"');
    expect(activeViews).toContain('view === "flashcards"');
    expect(activeViews).toContain('view === "quizzes"');
    expect(activeViews).not.toMatch(/view === "(achievements|museum|wheel|account)"/);
  });

  it("does not show achievement, level, title, or XP language in active study screens", () => {
    const visibleSurfaces = [activeShell, cleanDashboard, quiz, pomodoro, focusHub, admin];
    for (const source of visibleSurfaces) {
      expect(source).not.toMatch(/Thành tích|Danh hiệu|Cấp hiện tại|\bXP\b/);
    }
    expect(activeShell).toContain("Mục tiêu thời gian");
    expect(activeShell).not.toContain("Kế hoạch hôm nay");
    expect(activeShell).not.toContain("level-status-card");
  });

  it("continues to preserve the intended study tools", () => {
    expect(cleanDashboard).toContain("Mục tiêu và thời gian học");
    expect(quiz).toContain("Đề kiểm tra");
    expect(pomodoro).toContain("Pomodoro");
    expect(focusHub).toContain("Ôn lại thông minh");
    expect(focusHub).not.toContain("Kế hoạch");
    expect(admin).toContain("Quản lý thành viên và Event");
  });
});
