import { describe, expect, it } from "vitest";
import { lumiDailyQuotes, lumiQuoteForDate } from "./lumiDailyQuotes";

describe("Lumi daily quote library", () => {
  it("provides a distinct entry for every day and multiple quotes per entry", () => {
    expect(lumiDailyQuotes).toHaveLength(7);
    expect(lumiDailyQuotes.every((entry) => entry.quotes.length >= 3)).toBe(true);
    expect(new Set(lumiDailyQuotes.map((entry) => entry.label)).size).toBe(7);
  });

  it("selects a visible weekday label and a non-empty rotating quote", () => {
    const monday = lumiQuoteForDate(new Date(2026, 7, 17, 9));
    expect(monday.label).toBe("Thứ Hai");
    expect(monday.text.length).toBeGreaterThan(20);
  });
});
