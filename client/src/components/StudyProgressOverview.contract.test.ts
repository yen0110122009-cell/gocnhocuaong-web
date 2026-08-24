import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Study progress overview dashboard contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/components/StudyProgressOverview.tsx"), "utf8");
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

  it("hiển thị KPI, phiên học gần đây, phân bổ môn và nhịp học tuần", () => {
    expect(source).toContain("Tổng giờ học");
    expect(source).toContain("Phiên học gần đây");
    expect(source).toContain("Buổi học theo môn");
    expect(source).toContain("Tiến độ theo ngày");
    expect(source).toContain("recentSessions");
    expect(source).toContain("subjectRows");
    expect(source).toContain("weekCells");
  });

  it("không thêm Chiêm tinh/Phân tích AI và dùng token theme", () => {
    expect(source).not.toContain("Chiêm tinh");
    expect(source).not.toContain("AI phân tích");
    expect(source).toContain("var(--scene-accent)");
    expect(css).toContain(".study-progress-overview");
    expect(css).toContain(".study-kpi-grid");
    expect(css).toContain(".study-donut");
    expect(css).toContain(".study-heatmap-grid");
  });
});
