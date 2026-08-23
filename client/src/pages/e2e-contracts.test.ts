import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const home = source("client/src/pages/Home.tsx");
const aiImport = source("client/src/pages/AIDataImport.tsx");
const pomodoro = source("client/src/pages/Pomodoro.tsx");
const workspace = source("client/src/pages/AdminWorkspace.tsx");
const quizPersistence = source("shared/quizPersistence.ts");

describe("Góc học tập end-to-end contracts", () => {
  it("giữ luồng nhập AI, xác thực và tạo học liệu có lịch sử", () => {
    expect(aiImport).toContain('accept=".json,.txt,.md"');
    expect(aiImport).toContain("validateExternalAiData");
    expect(aiImport).toContain("createLearningContent");
    expect(aiImport).toContain("aiImportHistory: [record, ...profile.aiImportHistory]");
    expect(aiImport).toContain("educationLevel");
    expect(aiImport).toContain("course");
  });

  it("chuẩn hóa chấm câu trả lời ngắn của đề ở một nơi", () => {
    expect(quizPersistence).toContain("export function normalizeQuizAnswer");
    expect(quizPersistence).toContain('value.normalize("NFKC")');
    expect(quizPersistence).toContain("referenceNumbers.includes(actualNumber)");
  });

  it("không để lộ điều hướng tài khoản đặc biệt theo mã", () => {
    expect(home).not.toContain('"special111"');
    expect(home).not.toContain("Khu vực đặc biệt · Mã 111");
    expect(home).not.toContain("Trung tâm điều khiển của Ong");
  });

  it("giữ Pomodoro lưu phiên, ngữ cảnh học và liên kết Kế hoạch", () => {
    expect(pomodoro).toContain("onProfile");
    expect(pomodoro).toContain("pomodoroHistory");
    expect(pomodoro).toContain("durationMinutes");
    expect(pomodoro).toContain("startedAt");
    expect(pomodoro).toContain("endedAt");
    expect(pomodoro).toContain("checkedPlanItemIds");
    expect(pomodoro).toContain("notes");
  });

  it("cung cấp Lumi không chặn thao tác khi người học cần hỗ trợ", () => {
    expect(pomodoro).toContain("pomodoroLumiSupportMode");
    expect(pomodoro).toContain("Cần an ủi");
    expect(pomodoro).toContain("Cần động viên");
    expect(pomodoro).toContain("Nghe lời Lumi");
    expect(pomodoro).toContain('role="status"');
  });

  it("chỉ dùng âm báo phiên và không khởi chạy âm nền Pomodoro", () => {
    expect(pomodoro).toContain("AudioContext");
    expect(pomodoro).toContain("triggerAlert(\"endFocus\")");
    expect(pomodoro).toContain("playPomodoroAlert");
    expect(pomodoro).not.toContain("startBackground");
    expect(pomodoro).not.toContain("backgroundVolume");
  });

  it("giữ hiệu ứng cuộn và reduced-motion ở shell chính", () => {
    const styles = source("client/src/index.css");
    expect(home).toContain("IntersectionObserver");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain("scroll-behavior: auto");
  });

  it("bảo vệ quản lý thành viên và Event trong các khối quản trị thu gọn", () => {
    expect(workspace).toContain("PersistentCollapsible");
    expect(workspace).toContain("Quản lý thành viên");
    expect(workspace).toContain("Event học tập");
    expect(workspace).toContain("Tạo Event nháp");
    expect(workspace).not.toContain("AchievementCatalogAdmin");
  });
});
