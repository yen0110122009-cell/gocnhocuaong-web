import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const dashboard = readFileSync(resolve(process.cwd(), "client/src/components/StudyPlanDashboard.tsx"), "utf8");
const router = readFileSync(resolve(process.cwd(), "server/routers/study.ts"), "utf8");

describe("AI daily-plan contract", () => {
  it("offers a copyable prompt, editable draft, and intentional generation action", () => {
    expect(dashboard).toContain("const planPrompt");
    expect(dashboard).toContain("navigator.clipboard.writeText(planPrompt)");
    expect(dashboard).toContain('aria-label="Những việc muốn hoàn thành hôm nay"');
    expect(dashboard).toContain("Tạo bản nháp bằng AI");
    expect(dashboard).toContain("Bản nháp AI");
    expect(dashboard).toContain("Thêm bản nháp vào Kế hoạch ngày");
  });

  it("blocks plan generation in guest mode and validates an authenticated request on the server", () => {
    expect(dashboard).toContain("if (isGuest)");
    expect(dashboard).toContain("dailyPlanMutation.mutate");
    expect(router).toContain("generateDailyPlan");
    expect(router).toContain("tokenInput.extend({ request: z.string().min(8).max(4000) })");
    expect(router).toContain("if (account.isGuest)");
    expect(router).toContain('response_format: { type: "json_schema"');
  });
});
