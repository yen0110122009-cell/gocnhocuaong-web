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

  it("keeps nine levels of one hundred and public topic metadata", () => {
    const achievements = achievementCatalogRows();
    expect(new Set(achievements.map((item) => item.level))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    for (let level = 1; level <= 9; level += 1) expect(achievements.filter((item) => item.level === level)).toHaveLength(100);
    expect(new Set(achievements.map((item) => item.topic)).size).toBe(9);
    expect(achievements.every((item) => item.tags.length > 0 && item.name && item.description && item.threshold > 0)).toBe(true);
    expect(achievements.every((item) => !/hidden|secret|mystery|\?\?\?/i.test(`${item.name} ${item.description}`))).toBe(true);
  });

  it("keeps title references one-to-one with special achievements", () => {
    const achievements = achievementCatalogRows();
    const titles = titleCatalogRows();
    const special = achievements.filter((item) => item.titleId);
    expect(special).toHaveLength(400);
    expect(new Set(titles.map((item) => item.achievementId)).size).toBe(400);
    expect(titles.every((item) => special.some((achievement) => achievement.id === item.achievementId))).toBe(true);
  });

  it("keeps eight public title groups of fifty with traceable sources and scaling rewards", () => {
    const achievements = achievementCatalogRows().filter((item) => item.titleId);
    const titles = titleCatalogRows();
    expect(new Set(titles.map((item) => item.titleGroup))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8]));
    for (let group = 1; group <= 8; group += 1) expect(titles.filter((item) => item.titleGroup === group)).toHaveLength(50);
    expect(titles.every((item) => item.name && item.meaning && item.titleGroupLabel && item.source_type && item.source_text && item.source_note && item.enabled)).toBe(true);
    for (let group = 2; group <= 8; group += 1) {
      const current = achievements.filter((item) => item.titleGroup === group);
      const previous = achievements.filter((item) => item.titleGroup === group - 1);
      expect(Math.min(...current.map((item) => item.rewardXp))).toBeGreaterThan(Math.min(...previous.map((item) => item.rewardXp)));
      expect(Math.min(...current.map((item) => item.rewardFragments))).toBeGreaterThan(Math.min(...previous.map((item) => item.rewardFragments)));
    }
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
