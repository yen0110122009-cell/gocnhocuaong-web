import { describe, expect, it } from "vitest";
import { buildQuizAttempt, createQuizFromFlashcardSet } from "./quizPersistence";
import type { FlashcardSet } from "./study";

const set: FlashcardSet = {
  id: "set-history-1",
  title: "Nhà Trần",
  subject: "Lịch sử",
  topic: "Kháng chiến chống Nguyên Mông",
  difficulty: "Trung bình",
  createdAt: "2026-08-16T00:00:00.000Z",
  studyCount: 2,
  cards: [
    { id: "card-1", front: "Hội nghị Diên Hồng?", back: "Năm 1284", status: "new", starred: false },
    { id: "card-2", front: "Ai chỉ huy trận Bạch Đằng 1288?", back: "Trần Hưng Đạo", status: "known", starred: true },
  ],
};

describe("quiz persistence helpers", () => {
  it("creates a quiz that preserves source metadata and question order", () => {
    const quiz = createQuizFromFlashcardSet(set, "2026-08-16T01:00:00.000Z");
    expect(quiz.subject).toBe(set.subject);
    expect(quiz.topic).toBe(set.topic);
    expect(quiz.difficulty).toBe(set.difficulty);
    expect(quiz.questions).toHaveLength(2);
    expect(quiz.questions[0]).toMatchObject({ prompt: set.cards[0].front, answer: set.cards[0].back, type: "short" });
    expect(quiz.createdAt).toBe("2026-08-16T01:00:00.000Z");
  });

  it("builds a complete attempt without dropping unanswered or flagged answers", () => {
    const quiz = createQuizFromFlashcardSet(set, "2026-08-16T01:00:00.000Z");
    const attempt = buildQuizAttempt({
      quiz,
      answers: { [quiz.questions[0].id]: "Năm 1284" },
      flagged: [quiz.questions[1].id],
      durationSeconds: 37,
      now: "2026-08-16T01:02:00.000Z",
      id: "attempt-1",
    });
    expect(attempt).toMatchObject({ id: "attempt-1", quizId: quiz.id, completedAt: "2026-08-16T01:02:00.000Z", correct: 1, total: 2, accuracy: 50, durationSeconds: 37 });
    expect(attempt.answers).toEqual([
      { questionId: quiz.questions[0].id, answer: "Năm 1284", flagged: false, correct: true },
      { questionId: quiz.questions[1].id, answer: "", flagged: true, correct: false },
    ]);
  });
});

export {};
