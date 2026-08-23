import { describe, expect, it } from "vitest";
import { buildExternalAiPrompt, convertImportToFlashcards, validateExternalAiData } from "./aiDataImport";

describe("AI learning-content metadata and multiline contract", () => {
  it("requires the full study metadata in the external AI prompt", () => {
    const prompt = buildExternalAiPrompt({
      target: "both",
      questionType: "mixed",
      quantity: 10,
      title: "Bộ ôn tập Toán 8",
      subject: "Toán",
      purpose: "Chuẩn bị kiểm tra giữa kỳ",
      grade: "Lớp 8",
      topic: "Hàm số bậc nhất",
      difficulty: "Nâng cao",
    });
    expect(prompt).toContain("Tên bộ nội dung");
    expect(prompt).toContain("Mục đích học");
    expect(prompt).toContain("Lớp học");
    expect(prompt).toContain('"metadata"');
    expect(prompt).toContain('"purpose"');
    expect(prompt).toContain('"grade"');
    expect(prompt).toContain('"difficulty"');
    expect(prompt).toContain("Giữ nguyên ký tự xuống dòng");
  });

  it("reads returned metadata and preserves newline in JSON question and answer", () => {
    const validation = validateExternalAiData(JSON.stringify({
      metadata: {
        title: "Bộ ôn tập Toán 8",
        subject: "Toán",
        purpose: "Chuẩn bị kiểm tra giữa kỳ",
        grade: "Lớp 8",
        topic: "Hàm số bậc nhất",
        difficulty: "Nâng cao",
      },
      questions: [{
        type: "short",
        question: "Nêu định nghĩa hàm số bậc nhất.\nViết dạng tổng quát.",
        answer: "Hàm số có dạng y = ax + b, a khác 0.\nTrong đó a, b là hằng số.",
        explanation: "Cần nhớ điều kiện a khác 0.",
      }],
    }));
    expect(validation.valid).toBe(true);
    expect(validation.metadata).toMatchObject({ title: "Bộ ôn tập Toán 8", subject: "Toán", purpose: "Chuẩn bị kiểm tra giữa kỳ", grade: "Lớp 8", topic: "Hàm số bậc nhất", difficulty: "Nâng cao" });
    expect(validation.questions[0]?.prompt).toContain("\nViết dạng tổng quát.");
    expect(validation.questions[0]?.answer).toContain("\nTrong đó a, b là hằng số.");
    const set = convertImportToFlashcards(validation, { ...validation.metadata, title: "Bộ ôn tập Toán 8", subject: "Toán", topic: "Hàm số bậc nhất" });
    expect(set.purpose).toBe("Chuẩn bị kiểm tra giữa kỳ");
    expect(set.grade).toBe("Lớp 8");
    expect(set.cards[0]?.front).toContain("\nViết dạng tổng quát.");
    expect(set.cards[0]?.back).toContain("\nTrong đó a, b là hằng số.");
  });

  it("keeps multiline fields in the line-based QUESTION format", () => {
    const validation = validateExternalAiData(`[QUESTION]\ntype: short\nquestion: Câu hỏi dòng một\nCâu hỏi dòng hai\nanswer: Đáp án dòng một\nĐáp án dòng hai\nexplanation: Giải thích dòng một\nGiải thích dòng hai\n[/QUESTION]`);
    expect(validation.valid).toBe(true);
    expect(validation.questions[0]).toMatchObject({ prompt: "Câu hỏi dòng một\nCâu hỏi dòng hai", answer: "Đáp án dòng một\nĐáp án dòng hai" });
    expect(validation.questions[0]?.explanation).toContain("\nGiải thích dòng hai");
  });
});
