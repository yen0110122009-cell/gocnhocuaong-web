import type { FlashcardSet, Quiz, QuizAttempt, QuizQuestion } from "./study";

export function createQuizFromFlashcardSet(set: FlashcardSet, now = new Date().toISOString(), options: Partial<Pick<Quiz, "mode" | "timerMode" | "durationMinutes">> = {}): Quiz {
  const questions: QuizQuestion[] = set.cards.map((card, index) => ({
    id: `${set.id}-q-${index + 1}`,
    type: "short",
    prompt: card.front,
    answer: card.back,
    explanation: `Đáp án tham chiếu từ thẻ ${index + 1}.`,
  }));
  const mode = options.mode ?? "review";
  return {
    id: `quiz-${set.id}-${Date.parse(now)}`,
    title: `${mode === "test" ? "Đề kiểm tra" : "Ôn tập"}: ${set.title}`,
    subject: set.subject,
    topic: set.topic,
    difficulty: set.difficulty,
    durationMinutes: options.durationMinutes ?? Math.max(5, Math.ceil(questions.length * 1.5)),
    createdAt: now,
    questions,
    mode,
    timerMode: options.timerMode ?? (mode === "review" ? "unlimited" : "timed"),
  };
}

export function normalizeQuizAnswer(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/[“”"'`´]/g, "").replace(/[.,!?;:，。！？；：]/g, " ").replace(/\s+/g, " ").trim();
}

function quizAnswerMatches(answer: string, expected: string): boolean {
  const actual = normalizeQuizAnswer(answer);
  const reference = normalizeQuizAnswer(expected);
  if (!actual || !reference) return actual === reference;
  if (actual === reference) return true;
  const actualNumber = actual.match(/^\d+(?:[.,]\d+)?$/)?.[0];
  const referenceNumbers: string[] = reference.match(/\d+(?:[.,]\d+)?/g) ?? [];
  return Boolean(actualNumber && referenceNumbers.includes(actualNumber));
}

export function buildQuizAttempt(input: {
  quiz: Quiz;
  answers: Record<string, string>;
  flagged: string[];
  durationSeconds: number;
  now?: string;
  id?: string;
}): QuizAttempt {
  const { quiz, answers, flagged, durationSeconds } = input;
  const completedAt = input.now ?? new Date().toISOString();
  const answerItems = quiz.questions.map((question) => {
    const answer = answers[question.id] ?? "";
    return {
      questionId: question.id,
      answer,
      flagged: flagged.includes(question.id),
      correct: quizAnswerMatches(answer, question.answer),
    };
  });
  const correct = answerItems.filter((item) => item.correct).length;
  return {
    id: input.id ?? `attempt-${Date.parse(completedAt)}`,
    quizId: quiz.id,
    completedAt,
    correct,
    total: quiz.questions.length,
    accuracy: quiz.questions.length ? Math.round((correct / quiz.questions.length) * 100) : 0,
    durationSeconds,
    answers: answerItems,
  };
}
