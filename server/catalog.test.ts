import { describe, expect, it } from "vitest";
import { achievementCatalogRows, titleCatalogRows } from "../shared/masterBuild";

describe("catalog legacy", () => {
  it("không còn phát hành dữ liệu Thành tích hoặc Danh hiệu", () => {
    expect(achievementCatalogRows()).toEqual([]);
    expect(titleCatalogRows()).toEqual([]);
  });
});
