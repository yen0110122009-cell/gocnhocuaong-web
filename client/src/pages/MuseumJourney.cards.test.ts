import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { emptyAppConfig } from "../../../shared/study";
import { getFragmentWays } from "./MuseumJourney";

describe("MuseumJourney learning challenge cards", () => {
  it("derives wheel and special-achievement states from AppConfig", () => {
    const config = emptyAppConfig();
    const ways = getFragmentWays(config);
    const byTitle = (title: string) => ways.find((way) => way.title === title)!;

    expect(byTitle("Thử thách học tập đặc biệt").status).toBe("planned");
    expect(byTitle("Hoàn thành chương học").status).toBe("planned");
    expect(byTitle("Phần thưởng sự kiện").status).toBe("planned");
    expect(byTitle("Vòng quay phần thưởng").status).toBe("active");
    expect(byTitle("Vòng quay phần thưởng").milestone).toContain("phần thưởng đang bật");
    expect(byTitle("Thành tích đặc biệt").status).toBe("configured");
  });

  it("keeps celebration and progress feedback in the MuseumJourney contract", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(source).toContain("celebration-overlay");
    expect(source).toContain('OngLearnerAvatar variant="hoodie"');
    expect(source).toContain("study-empire-celebrations");
    expect(source).toContain("Mảnh ghép đã thu thập");
    expect(source).toContain("Danh hiệu đã mở khóa");
    expect(css).toContain(".progress-track");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("celebration-card-in");
  });

  it("marks the wheel pending when every reward is disabled", () => {
    const config = emptyAppConfig();
    config.wheelRewards = config.wheelRewards.map((reward) => ({ ...reward, enabled: false }));
    const wheel = getFragmentWays(config).find((way) => way.title === "Vòng quay phần thưởng")!;

    expect(wheel.status).toBe("planned");
    expect(wheel.label).toBe("Chờ cấu hình");
    expect(wheel.milestone).toContain("Admin/Founder");
  });
});

void describe;
