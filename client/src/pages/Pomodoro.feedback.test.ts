import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Pomodoro feedback contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");

  it("giữ điều khiển âm báo Web Audio theo bốn sự kiện trong Pomodoro", () => {
    expect(source).toContain("Âm báo và chuyển phiên");
    expect(source).toContain("POMODORO_ALERT_EVENT_IDS.map");
    expect(source).toContain("Âm lượng chung");
    expect(source).toContain('max="200"');
    expect(source).toContain("Nghe thử");
  });

  it("lưu ngữ cảnh học gồm môn, nội dung và ghi chú", () => {
    expect(source).toContain("Môn học");
    expect(source).toContain("Nội dung");
    expect(source).toContain("Ghi chú phiên học");
    expect(source).toContain("checkedPlanItemIds");
  });

  it("giữ hỗ trợ chống trì hoãn và Lumi không chặn thao tác", () => {
    expect(source).toContain("Hỗ trợ chống trì hoãn");
    expect(source).toContain("Cần an ủi");
    expect(source).toContain("Cần động viên");
    expect(source).toContain('role="status"');
  });
});
