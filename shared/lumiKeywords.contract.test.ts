import { describe, expect, it } from "vitest";
import { DEFAULT_LUMI_KEYWORDS, findLumiKeywordRule, LUMI_KEYWORDS_STORAGE_KEY, saveLumiKeywords } from "../client/src/lib/lumiKeywords";

describe("Lumi keyword detection", () => {
  it("có bộ từ khóa mặc định nối với Kaomoji và lời thoại", () => {
    expect(LUMI_KEYWORDS_STORAGE_KEY).toBe("lumi_custom_keywords");
    expect(DEFAULT_LUMI_KEYWORDS.length).toBeGreaterThanOrEqual(4);
    expect(findLumiKeywordRule(DEFAULT_LUMI_KEYWORDS, "Hôm nay mình hơi KIỆT SỨC").kaomoji).toBe("(つ_ <｡)");
    expect(findLumiKeywordRule(DEFAULT_LUMI_KEYWORDS, "mình cần ôm").dialogue).toContain("ôm");
  });

  it("chuẩn hóa và loại bỏ keyword trùng khi lưu", () => {
    const saved = saveLumiKeywords([
      { id: "a", keyword: " Mệt, đuối ", kaomoji: "(つ_ <｡)", dialogue: " Câu an ủi " },
      { id: "b", keyword: "mỆt, đuối", kaomoji: "(つ_ <｡)", dialogue: "Câu khác" },
    ]);
    expect(saved).toHaveLength(1);
    expect(saved[0]?.keyword).toBe("Mệt, đuối");
    expect(saved[0]?.dialogue).toBe("Câu an ủi");
  });
});
