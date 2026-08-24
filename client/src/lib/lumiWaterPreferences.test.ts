import { describe, expect, it } from "vitest";
import { LUMI_WATER_SETTINGS_STORAGE_KEY, readLumiWaterSettings, saveLumiWaterSettings } from "./lumiPreferences";
import { DEFAULT_LUMI_WATER_SETTINGS } from "../../../shared/study";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

describe("Lumi water settings persistence", () => {
  it("lưu và đọc lại khoảng nhắc 21 phút", () => {
    const storage = memoryStorage();
    const saved = saveLumiWaterSettings({ ...DEFAULT_LUMI_WATER_SETTINGS, intervalMinutes: 21 }, storage);
    expect(saved.intervalMinutes).toBe(21);
    expect(storage.getItem(LUMI_WATER_SETTINGS_STORAGE_KEY)).toContain('"intervalMinutes":21');
    expect(readLumiWaterSettings(DEFAULT_LUMI_WATER_SETTINGS, storage).intervalMinutes).toBe(21);
  });
  it("khôi phục mặc định khi JSON bị hỏng", () => {
    const storage = { getItem: () => "{broken" };
    expect(readLumiWaterSettings({ ...DEFAULT_LUMI_WATER_SETTINGS, intervalMinutes: 21 }, storage).intervalMinutes).toBe(21);
  });
});
