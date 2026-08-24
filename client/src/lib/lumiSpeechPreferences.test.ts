import { describe, expect, it } from "vitest";
import {
  DEFAULT_LUMI_SPEECH_RATE,
  DEFAULT_LUMI_SPEECH_VOLUME,
  normalizeLumiSpeechSettings,
  readLumiSpeechSettings,
} from "./lumiPreferences";
import { splitSpeechText } from "./lumiSpeech";

describe("Lumi Web Speech settings", () => {
  it("dùng mặc định tự nhiên khi chưa có tùy chọn", () => {
    expect(normalizeLumiSpeechSettings(undefined)).toEqual({ rate: DEFAULT_LUMI_SPEECH_RATE, volume: DEFAULT_LUMI_SPEECH_VOLUME });
    expect(readLumiSpeechSettings()).toEqual({ rate: DEFAULT_LUMI_SPEECH_RATE, volume: DEFAULT_LUMI_SPEECH_VOLUME });
  });

  it("giới hạn tốc độ và âm lượng về khoảng Web Speech an toàn", () => {
    expect(normalizeLumiSpeechSettings({ rate: 9, volume: -1 })).toEqual({ rate: 1.5, volume: 0 });
    expect(normalizeLumiSpeechSettings({ rate: 0.1, volume: 2 })).toEqual({ rate: 0.6, volume: 1 });
  });

  it("giữ số lẻ hợp lệ cho slider", () => {
    expect(normalizeLumiSpeechSettings({ rate: 1.15, volume: 0.65 })).toEqual({ rate: 1.15, volume: 0.65 });
  });

  it("chia lời thoại dài theo câu và giữ nguyên nội dung", () => {
    const text = "Lumi ở đây với Ong. Mình cùng làm một bước nhỏ nhé.\n\nSau đó chúng ta nghỉ mắt một chút.";
    const chunks = splitSpeechText(text, 28);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join(" ").replace(/\s+/g, " ")).toBe(text.replace(/\s+/g, " "));
    expect(chunks.every((chunk) => chunk.length <= 28)).toBe(true);
  });
});
