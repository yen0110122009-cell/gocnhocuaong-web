import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { emptyAppConfig, normalizeProfile } from "./study";

describe("Kế hoạch tự quản lý", () => {
  it("chuẩn hóa kế hoạch theo ngày/tuần và giữ dấu đã nhận thưởng", () => {
    const profile = normalizeProfile({
      studyPlanItems: [
        { id: "daily-1", title: "Ôn công thức", cadence: "day", completed: true, completedAt: "2026-08-23T08:00:00.000Z", reward: "fragment", rewardAmount: 2, rewardGrantedAt: "2026-08-23T08:00:01.000Z" },
        { id: "weekly-1", title: "Làm đề", cadence: "week", reward: "ticket", rewardAmount: 1 },
        { id: "daily-1", title: "Bản trùng", cadence: "day", reward: "fragment", rewardAmount: 1 },
      ],
      planFragments: 2,
      planTickets: 1,
    });

    expect(profile.studyPlanItems).toHaveLength(2);
    expect(profile.studyPlanItems.find((item) => item.id === "daily-1")).toMatchObject({ cadence: "day", completed: true, rewardGrantedAt: "2026-08-23T08:00:01.000Z" });
    expect(profile.studyPlanItems.find((item) => item.id === "weekly-1")).toMatchObject({ cadence: "week", reward: "fragment", rewardAmount: 1 });
    expect(profile.planFragments).toBe(3);
  });

  it("không cộng hoặc hiển thị Mảnh ghép trong Kế hoạch", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/StudyPlanDashboard.tsx"), "utf8");
    expect(source).not.toContain("planFragments");
    expect(source).not.toContain("Mảnh ghép");
    expect(source).not.toContain("shouldGrant");
    expect(source).toContain("Đã đánh dấu hoàn thành mục tiêu.");
  });

  it("có đúng một event mẫu, không chứa phần thưởng XP", () => {
    const events = emptyAppConfig().collectionConfig?.events ?? [];
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ id: "sample-weekly-plan-event", approvalStatus: "approved", status: "active" });
    expect(events[0].rewards.some((reward) => reward.type === "xp")).toBe(false);
    expect(events[0].fragmentRewards).toEqual([{ tier: "I", amount: 2, label: "2 mảnh ghép Cấp I" }]);
  });
});
