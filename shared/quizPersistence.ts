import type { FlashcardSet, Quiz, QuizAttempt, QuizQuestion } from "./study";

export function createQuizFromFlashcardSet(set: FlashcardSet, now = new Date().toISOString()): Quiz {
  const questions: QuizQuestion[] = set.cards.map((card, index) => ({
    id: `${set.id}-q-${index + 1}`,
    type: "short",
    prompt: card.front,
    answer: card.back,
    explanation: `Đáp án tham chiếu từ thẻ ${index + 1}.`,
  }));
  return {
    id: `quiz-${set.id}-${Date.parse(now)}`,
    title: `Ôn tập: ${set.title}`,
    subject: set.subject,
    topic: set.topic,
    difficulty: set.difficulty,
    durationMinutes: Math.max(5, Math.ceil(questions.length * 1.5)),
    createdAt: now,
    questions,
  };
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
      correct: answer.trim().toLocaleLowerCase() === question.answer.trim().toLocaleLowerCase(),
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
