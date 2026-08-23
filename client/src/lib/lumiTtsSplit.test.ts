import { describe, expect, it } from "vitest";
import { splitLongVietnameseText, textByteLength } from "../../../supabase/functions/lumi-tts/splitText";

describe("splitLongVietnameseText", () => {
  it("giữ nguyên văn bản ngắn và không tạo đoạn rỗng", () => {
    const text = "Lumi ở đây với Ong.";
    expect(splitLongVietnameseText(text)).toEqual([text]);
  });

  it("ưu tiên chia theo câu và giữ nguyên toàn bộ nội dung tiếng Việt", () => {
    const text = "Câu đầu tiên rất dài. Câu thứ hai cũng cần được đọc.\n\nĐoạn tiếp theo bắt đầu ở đây.";
    const chunks = splitLongVietnameseText(text, 32);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join(" ").replace(/\s+/g, " ")).toBe(text.replace(/\s+/g, " "));
    expect(chunks.every((chunk) => textByteLength(chunk) <= 32)).toBe(true);
  });

  it("chia một từ cực dài theo code point mà không làm hỏng emoji hoặc dấu tiếng Việt", () => {
    const text = "ạ😀".repeat(80);
    const chunks = splitLongVietnameseText(text, 20);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toBe(text);
    expect(chunks.every((chunk) => textByteLength(chunk) <= 20)).toBe(true);
  });
});
