import { describe, expect, it } from "vitest";
import { buildExternalAiPrompt, convertImportToFlashcards, convertImportToQuiz, validateExternalAiData } from "./aiDataImport";

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

  it("creates a multiline math quiz sample without flattening formulas", () => {
    const validation = validateExternalAiData(JSON.stringify({
      metadata: { title: "Đề mẫu Toán 9 – Hàm số", subject: "Toán", purpose: "Kiểm tra công thức", grade: "Lớp 9", topic: "Hàm số bậc nhất", difficulty: "Nâng cao" },
      questions: [{
        type: "multiple",
        question: "Cho hàm số y = 2x + 1.\nTính y khi x = 3.",
        options: ["A. y = 5", "B. y = 7\nVì y = 2 × 3 + 1", "C. y = 8", "D. y = 9"],
        answer: "B. y = 7\nVì y = 2 × 3 + 1",
        explanation: "Thay x = 3 vào công thức:\ny = 2 × 3 + 1 = 7.\nVậy đáp án đúng là B.",
        deepExplanation: { formula: "y = ax + b\nVới a = 2, b = 1", solutionSteps: ["Bước 1: Thay x = 3.", "Bước 2: Tính y = 2 × 3 + 1 = 7."] },
      }],
    }));
    expect(validation.valid).toBe(true);
    const quiz = convertImportToQuiz(validation, { ...validation.metadata, title: "Đề mẫu Toán 9 – Hàm số", subject: "Toán", topic: "Hàm số bậc nhất" });
    expect(quiz.questions[0]?.prompt).toContain("\nTính y khi x = 3.");
    expect(quiz.questions[0]?.options?.[1]).toContain("\nVì y = 2 × 3 + 1");
    expect(quiz.questions[0]?.answer).toContain("\nVì y = 2 × 3 + 1");
    expect(quiz.questions[0]?.explanation).toContain("\ny = 2 × 3 + 1 = 7.");
    expect(quiz.questions[0]?.deepExplanation?.formula).toContain("\nVới a = 2, b = 1");
  });

  it("creates a multiline quiz sample without flattening options or explanations", () => {
    const validation = validateExternalAiData(JSON.stringify({
      metadata: { title: "Đề mẫu Sinh học 10", subject: "Sinh học", purpose: "Ôn tập", grade: "Lớp 10", topic: "Tế bào", difficulty: "Cơ bản" },
      questions: [{
        type: "multiple",
        question: "Bào quan nào là nơi diễn ra hô hấp tế bào?\nNêu lý do.",
        options: ["A. Nhân tế bào", "B. Ti thể\n— bào quan tạo năng lượng", "C. Ribosome", "D. Không bào"],
        answer: "B. Ti thể\n— bào quan tạo năng lượng",
        explanation: "Ti thể thực hiện hô hấp tế bào.\nQuá trình này tạo năng lượng cho hoạt động của tế bào.",
      }],
    }));
    expect(validation.valid).toBe(true);
    const quiz = convertImportToQuiz(validation, { ...validation.metadata, title: "Đề mẫu Sinh học 10", subject: "Sinh học", topic: "Tế bào" });
    expect(quiz.questions[0]?.prompt).toContain("\nNêu lý do.");
    expect(quiz.questions[0]?.options?.[1]).toContain("\n— bào quan tạo năng lượng");
    expect(quiz.questions[0]?.answer).toContain("\n— bào quan tạo năng lượng");
    expect(quiz.questions[0]?.explanation).toContain("\nQuá trình này tạo năng lượng");
  });
});
