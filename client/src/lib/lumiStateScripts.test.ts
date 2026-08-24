import { describe, expect, it } from "vitest";
import { DEFAULT_LUMI_STATE_SCRIPTS, normalizeLumiStateScripts, pickLumiStateScript, readLumiStateScripts, saveLumiStateScripts } from "./lumiStateScripts";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

describe("Lumi state scripts", () => {
  it("có kịch bản tiếng Việt cho đón học và chúc mừng", () => {
    expect(DEFAULT_LUMI_STATE_SCRIPTS.welcome.length).toBeGreaterThan(1);
    expect(DEFAULT_LUMI_STATE_SCRIPTS.celebration.length).toBeGreaterThan(1);
    expect(DEFAULT_LUMI_STATE_SCRIPTS.welcome.every((line) => line.trim())).toBe(true);
    expect(DEFAULT_LUMI_STATE_SCRIPTS.celebration.every((line) => line.trim())).toBe(true);
  });

  it("lưu và đọc lại nội dung đã chỉnh sửa, giữ fallback khi dữ liệu rỗng", () => {
    const storage = memoryStorage();
    const saved = saveLumiStateScripts({ welcome: ["Câu đón học riêng"], celebration: ["Câu chúc mừng riêng"] }, storage);
    expect(readLumiStateScripts(storage)).toEqual(saved);
    expect(normalizeLumiStateScripts({ welcome: [], celebration: ["  "] })).toEqual(DEFAULT_LUMI_STATE_SCRIPTS);
  });

  it("không phát lại ngay cùng một câu trong cùng trạng thái khi có câu thay thế", () => {
    const scripts = { welcome: ["Một", "Hai"], celebration: ["Chúc mừng"] };
    expect(pickLumiStateScript(scripts, "welcome", () => 0)).toBe("Một");
    expect(pickLumiStateScript(scripts, "welcome", () => 0)).toBe("Hai");
    expect(pickLumiStateScript(scripts, "celebration", () => 0)).toBe("Chúc mừng");
  });
});
