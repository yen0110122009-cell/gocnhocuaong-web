import { describe, expect, it, vi } from "vitest";
import { DEFAULT_LUMI_MULTI_DIALOGUES, LUMI_MULTI_DIALOGUES_STORAGE_KEY, pickRandomLumiDialogue, pickRandomLumiText, saveLumiMultiDialogues, type LumiKaomojiDialogueEntry } from "../client/src/lib/lumiMultiDialogues";

describe("Lumi multi-dialogues", () => {
  it("có schema theo từng Kaomoji và lưu bốn câu an ủi mẫu", () => {
    expect(LUMI_MULTI_DIALOGUES_STORAGE_KEY).toBe("lumi_multi_dialogues_data");
    const tears = DEFAULT_LUMI_MULTI_DIALOGUES.find((entry) => entry.kaomoji === "(つ_ <｡)");
    expect(tears?.dialogues).toHaveLength(4);
    expect(tears?.emotionIds).toEqual(["tired", "sad", "stressed", "overwhelmed"]);
    expect(tears?.dialogues.map((dialogue) => dialogue.text)).toEqual([
      "Đừng khóc nha, có Lumi ở đây ôm bạn nè 🍀",
      "Nín đi nha, Lumi thương bạn nhiều lắm đó!",
      "Lau nước mắt nào, mọi chuyện rồi sẽ ổn thôi!",
      "Hôm nay mệt lắm đúng không? Tựa vào Lumi nè 🤗",
    ]);
  });

  it("chuẩn hóa dữ liệu và phát event contract khi lưu", () => {
    const entry: LumiKaomojiDialogueEntry = { kaomoji: "(test)", group: "comfort", description: "Test", emotionIds: ["focused"], dialogues: [{ id: "a", text: "  Câu A  " }, { id: "b", text: "Câu B" }] };
    const saved = saveLumiMultiDialogues([entry]);
    expect(saved).toHaveLength(1);
    expect(saved[0]?.dialogues.map((dialogue) => dialogue.text)).toEqual(["Câu A", "Câu B"]);
    expect(saved[0]?.emotionIds).toEqual(["focused"]);
  });

  it("không phát lại cùng nguyên văn khi chuyển sang Kaomoji khác", () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      expect(pickRandomLumiText(["Câu dùng chung", "Câu thay thế"])).toBe("Câu dùng chung");
      expect(pickRandomLumiText(["Câu dùng chung", "Câu mới"])).toBe("Câu mới");
    } finally {
      random.mockRestore();
    }
  });

  it("không phát cùng một câu hai lần liên tiếp cho cùng Kaomoji", () => {
    const entry: LumiKaomojiDialogueEntry = { kaomoji: "(random-test)", group: "comfort", description: "Test", dialogues: [{ id: "first", text: "Câu đầu" }, { id: "second", text: "Câu sau" }] };
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      const first = pickRandomLumiDialogue(entry);
      const second = pickRandomLumiDialogue(entry);
      expect(first?.id).toBe("first");
      expect(second?.id).toBe("second");
    } finally {
      random.mockRestore();
    }
  });
});
