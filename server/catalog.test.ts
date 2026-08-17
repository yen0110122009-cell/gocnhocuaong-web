import { describe, expect, it } from "vitest";
import { achievementCatalogRows, titleCatalogRows, validateMasterCatalog } from "../shared/masterBuild";

describe("master catalog", () => {
  it("contains 900 achievements and 400 titles with valid references", () => {
    const achievements = achievementCatalogRows();
    const titles = titleCatalogRows();
    const result = validateMasterCatalog(achievements, titles);

    expect(achievements).toHaveLength(900);
    expect(titles).toHaveLength(400);
    expect(result).toEqual({ valid: true, errors: [] });
  });
});
