import { describe, expect, it } from "vitest";
import { DEFAULT_AMBIENT_ASSET, DEFAULT_AMBIENT_ASSETS, DEFAULT_AMBIENT_MORNING_ASSET, DEFAULT_AMBIENT_RAIN_URL, DEFAULT_AMBIENT_STORM_ASSET } from "./defaultAmbient";

describe("default ambient asset", () => {
  it("provides a stable built-in rain URL for immediate preview", () => {
    expect(DEFAULT_AMBIENT_ASSET.source).toBe("built_in");
    expect(DEFAULT_AMBIENT_ASSET.category).toBe("background");
    expect(DEFAULT_AMBIENT_ASSET.target).toBe("rain");
    expect(DEFAULT_AMBIENT_RAIN_URL).toMatch(/^https:\/\/[^/]+\/manus-storage\/ambient-rain-default_[a-z0-9]+\.wav$/);
    expect(DEFAULT_AMBIENT_ASSET.url).toBe(DEFAULT_AMBIENT_RAIN_URL);
  });

  it("provides morning and light-storm defaults for the ambient library", () => {
    expect(DEFAULT_AMBIENT_ASSETS).toHaveLength(4);
    expect(DEFAULT_AMBIENT_MORNING_ASSET.target).toBe("morning");
    expect(DEFAULT_AMBIENT_MORNING_ASSET.name).toBe("Buổi sáng");
    expect(DEFAULT_AMBIENT_MORNING_ASSET.url).toMatch(/^https:\/\/[^/]+\/manus-storage\/ambient-morning-default_[a-z0-9]+\.mp3$/);
    expect(DEFAULT_AMBIENT_STORM_ASSET.target).toBe("storm");
    expect(DEFAULT_AMBIENT_STORM_ASSET.name).toBe("Bão nhẹ");
    expect(DEFAULT_AMBIENT_STORM_ASSET.url).toMatch(/^https:\/\/[^/]+\/manus-storage\/ambient-storm-default_[a-z0-9]+\.mp3$/);
  });

  it("starts health checking without marking a valid asset as broken", () => {
    expect(DEFAULT_AMBIENT_ASSET.healthStatus).toBe("unknown");
    expect(DEFAULT_AMBIENT_ASSET.healthMessage).toBeUndefined();
  });
});
