import { describe, expect, it } from "vitest";
import { DEFAULT_AMBIENT_ASSET, DEFAULT_AMBIENT_RAIN_URL } from "./defaultAmbient";

describe("default ambient asset", () => {
  it("provides a stable built-in rain URL for immediate preview", () => {
    expect(DEFAULT_AMBIENT_ASSET.source).toBe("built_in");
    expect(DEFAULT_AMBIENT_ASSET.category).toBe("background");
    expect(DEFAULT_AMBIENT_ASSET.target).toBe("rain");
    expect(DEFAULT_AMBIENT_RAIN_URL).toMatch(/^\/manus-storage\/ambient-rain-default_[a-z0-9]+\.wav$/);
    expect(DEFAULT_AMBIENT_ASSET.url).toBe(DEFAULT_AMBIENT_RAIN_URL);
  });

  it("starts health checking without marking a valid asset as broken", () => {
    expect(DEFAULT_AMBIENT_ASSET.healthStatus).toBe("unknown");
    expect(DEFAULT_AMBIENT_ASSET.healthMessage).toBeUndefined();
  });
});
