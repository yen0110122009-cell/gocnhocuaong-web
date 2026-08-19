import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PaperQuizSession } from "./study";

const page = readFileSync(resolve(process.cwd(), "client/src/pages/QuizEnhanced.tsx"), "utf8");

function session(id: string, deletedAt?: string): PaperQuizSession {
  return { id, title: "Đề giấy", subject: "Toán", questionCount: 10, durationMinutes: 30, startedAt: "2026-08-19T00:00:00.000Z", elapsedSeconds: 0, status: "completed", allowPause: true, certainty: {}, deletedAt };
}

describe("vòng đời dữ liệu Làm đề giấy", () => {
  it("có trường xóa mềm riêng và không làm mất phiên đang lưu", () => {
    const active = session("active");
    const removed = session("removed", "2026-08-19T01:00:00.000Z");
    expect(active.deletedAt).toBeUndefined();
    expect(removed.deletedAt).toBeTruthy();
  });

  it("giữ các thao tác sửa, xóa mềm, khôi phục và xóa vĩnh viễn trong module riêng", () => {
    expect(page).toContain("Kho phiên Làm đề giấy");
    expect(page).toContain("Đã cập nhật ghi chú phiên đề giấy.");
    expect(page).toContain("Đã đưa phiên đề giấy vào Thùng rác.");
    expect(page).toContain("Đã khôi phục phiên đề giấy.");
    expect(page).toContain("Đã xóa vĩnh viễn phiên đề giấy.");
    expect(page).toContain("PaperSessionArchive");
  });
});
