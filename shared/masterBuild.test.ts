import { describe, expect, it } from "vitest";
import {
  achievementCatalogRows,
  calculateLedgerDelta,
  titleCatalogRows,
  validateMasterCatalog,
} from "./masterBuild";

describe("Master Build catalog contract", () => {
  it("keeps the approved 900-achievement and 400-title counts", () => {
    const achievements = achievementCatalogRows();
    const titles = titleCatalogRows();
    expect(achievements).toHaveLength(900);
    expect(titles).toHaveLength(400);
    expect(validateMasterCatalog(achievements, titles)).toEqual({ valid: true, errors: [] });
  });

  it("keeps title references one-to-one with special achievements", () => {
    const achievements = achievementCatalogRows();
    const titles = titleCatalogRows();
    const special = achievements.filter((item) => item.titleId);
    expect(special).toHaveLength(400);
    expect(new Set(titles.map((item) => item.achievementId)).size).toBe(400);
    expect(titles.every((item) => special.some((achievement) => achievement.id === item.achievementId))).toBe(true);
  });
});

describe("Piece ledger invariants", () => {
  it("supports positive and negative deltas without allowing a negative balance", () => {
    expect(calculateLedgerDelta(3, 4)).toEqual({ previousBalance: 3, delta: 4, nextBalance: 7 });
    expect(calculateLedgerDelta(7, -4)).toEqual({ previousBalance: 7, delta: -4, nextBalance: 3 });
    expect(() => calculateLedgerDelta(0, -1)).toThrow("cannot become negative");
  });

  it("rejects zero, fractional and invalid balances", () => {
    expect(() => calculateLedgerDelta(1, 0)).toThrow("non-zero integer");
    expect(() => calculateLedgerDelta(1, 1.5)).toThrow("non-zero integer");
    expect(() => calculateLedgerDelta(-1, 1)).toThrow("non-negative integer");
  });
});
