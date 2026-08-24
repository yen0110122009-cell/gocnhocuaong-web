import { describe, expect, it } from "vitest";
import { DEFAULT_LUMI_DIALOGUES, LUMI_DIALOGUE_GROUPS, dialoguesForGroup, saveLumiCustomDialogues, type LumiCustomDialogue } from "../client/src/lib/lumiCustomDialogues";

describe("Lumi Kaomoji custom dialogues", () => {
  it("có bộ thoại mặc định cho đủ các nhóm hỗ trợ", () => {
    expect(LUMI_DIALOGUE_GROUPS.map((group) => group.id)).toEqual(["comfort", "encouragement", "hug", "companionship", "water", "focus", "rest", "celebration"]);
    for (const group of LUMI_DIALOGUE_GROUPS) expect(dialoguesForGroup(DEFAULT_LUMI_DIALOGUES, group.id).length).toBeGreaterThanOrEqual(1);
  });

  it("chuẩn hóa, giới hạn độ dài và loại bỏ câu trùng khi lưu", () => {
    const first: LumiCustomDialogue = { id: "a", group: "comfort", text: "  Mình cùng thở nhé.  " };
    const second: LumiCustomDialogue = { id: "b", group: "comfort", text: "MÌNH CÙNG THỞ NHÉ." };
    const saved = saveLumiCustomDialogues([first, second]);
    expect(saved).toHaveLength(1);
    expect(saved[0]?.text).toBe("Mình cùng thở nhé.");
    expect(saved[0]?.isDefault).toBe(false);
  });

  it("không để kho thoại rỗng khi người dùng xóa hết câu tùy chỉnh", () => {
    const saved = saveLumiCustomDialogues([]);
    expect(saved.length).toBe(DEFAULT_LUMI_DIALOGUES.length);
    expect(saved.some((dialogue) => dialogue.group === "water")).toBe(true);
  });
});
