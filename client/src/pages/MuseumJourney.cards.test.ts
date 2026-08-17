import { describe, expect, it } from "vitest";
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
