import { describe, expect, it } from "vitest";
import { achievementCatalogRows, calculateLedgerDelta, titleCatalogRows } from "./masterBuild";

describe("master build sau khi bỏ Thành tích", () => {
  it("không giữ catalog Thành tích hoặc Danh hiệu trong bản dựng", () => {
    expect(achievementCatalogRows()).toEqual([]);
    expect(titleCatalogRows()).toEqual([]);
  });
});

describe("bất biến sổ mảnh ghép", () => {
  it("vẫn bảo vệ số dư không âm", () => {
    expect(calculateLedgerDelta(3, 4)).toEqual({ previousBalance: 3, delta: 4, nextBalance: 7 });
    expect(() => calculateLedgerDelta(0, -1)).toThrow("cannot become negative");
  });
});
