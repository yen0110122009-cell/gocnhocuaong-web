import { describe, expect, it } from "vitest";
import { DEFAULT_LUMI_DIALOGUES } from "../client/src/lib/lumiCustomDialogues";
import { LUMI_CHECKIN_RESPONSES, LUMI_FOCUS_MESSAGE, LUMI_POSITIVE_KAOMOJI, LUMI_REST_MESSAGE, LUMI_WATER_MESSAGE, LUMI_WATER_PRAISE, LUMI_WELCOME, lumiKaomojiForPomodoro, lumiRoutineGroup, lumiRoutineMessage } from "../client/src/lib/lumiPresets";

describe("Lumi normalized positive presets", () => {
  it("giữ đủ nhóm Kaomoji tích cực và không có nhóm cảm xúc tiêu cực riêng", () => {
    expect(Object.keys(LUMI_POSITIVE_KAOMOJI).sort()).toEqual(["comfort", "companionship", "encouragement", "hug", "rest", "water"]);
    expect(LUMI_POSITIVE_KAOMOJI.comfort[0]).toBe("(つ_ <｡)");
    expect(LUMI_POSITIVE_KAOMOJI.hug[0]).toBe("(つ≧▽≦)つ");
    expect(LUMI_POSITIVE_KAOMOJI.companionship[0]).toBe("(*^o^)人(^o^*)");
    expect(LUMI_POSITIVE_KAOMOJI.encouragement[0]).toBe("٩(ˊᗜˋ*)و");
    expect(LUMI_POSITIVE_KAOMOJI.water[0]).toBe("(´ー`)旦~~");
    expect(LUMI_POSITIVE_KAOMOJI.rest[0]).toBe("[(－－)]..zzZ");
  });

  it("giữ đúng flow chào hỏi và bốn phản hồi check-in", () => {
    expect(LUMI_WELCOME.kaomoji).toBe("٩(◕‿◕｡)۶");
    expect(LUMI_WELCOME.text).toContain("Hôm nay bạn cảm thấy thế nào?");
    expect(Object.keys(LUMI_CHECKIN_RESPONSES)).toEqual(["tired", "motivation", "hug", "ready"]);
    expect(LUMI_CHECKIN_RESPONSES.tired.text).toContain("Đừng lo nhé");
    expect(LUMI_CHECKIN_RESPONSES.motivation.text).toContain("Cố lên nào");
    expect(LUMI_CHECKIN_RESPONSES.hug.text).toContain("cái ôm");
    expect(LUMI_CHECKIN_RESPONSES.ready.text).toContain("phiên học");
  });

  it("đổi routine theo focus, nghỉ và xác nhận uống nước", () => {
    expect(lumiKaomojiForPomodoro("focus", true)).toBe("٩(ˊᗜˋ*)و");
    expect(lumiKaomojiForPomodoro("focus", false)).toBe("[(－－)]..zzZ");
    expect(lumiKaomojiForPomodoro("shortBreak", false)).toBe("(´ー`)旦~~");
    expect(lumiRoutineGroup("focus", true)).toBe("encouragement");
    expect(lumiRoutineGroup("focus", false)).toBe("water");
    expect(lumiRoutineMessage("focus", true)).toBe(LUMI_FOCUS_MESSAGE);
    expect(lumiRoutineMessage("shortBreak", false)).toBe(LUMI_REST_MESSAGE);
    expect(LUMI_WATER_MESSAGE).toContain("uống một ngụm nước ấm");
    expect(LUMI_WATER_PRAISE).toContain("Ngoan lắm");
    expect(DEFAULT_LUMI_DIALOGUES.some((dialogue) => dialogue.text === LUMI_WATER_MESSAGE)).toBe(true);
  });
});
