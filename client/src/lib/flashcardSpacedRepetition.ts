import type { Flashcard, FlashcardReviewState } from "../../../shared/study";

export type FlashcardReviewRating = "again" | "hard" | "good" | "easy";

const DAY_MS = 24 * 60 * 60 * 1000;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function defaultFlashcardReviewState(now = new Date().toISOString()): FlashcardReviewState {
  return { dueAt: now, intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
}

export function flashcardReviewState(card: Flashcard, now = new Date().toISOString()): FlashcardReviewState {
  const state = card.spacedRepetition;
  if (!state || !Number.isFinite(state.easeFactor) || !Number.isFinite(state.intervalDays)) return defaultFlashcardReviewState(now);
  return {
    dueAt: typeof state.dueAt === "string" && state.dueAt ? state.dueAt : now,
    intervalDays: clamp(Number(state.intervalDays) || 0, 0, 3650),
    easeFactor: clamp(Number(state.easeFactor) || 2.5, 1.3, 3.5),
    repetitions: Math.max(0, Math.floor(Number(state.repetitions) || 0)),
    lapses: Math.max(0, Math.floor(Number(state.lapses) || 0)),
    lastReviewedAt: typeof state.lastReviewedAt === "string" ? state.lastReviewedAt : undefined,
  };
}

export function reviewFlashcard(card: Flashcard, rating: FlashcardReviewRating, now = new Date()): Flashcard {
  const reviewedAt = now.toISOString();
  const previous = flashcardReviewState(card, reviewedAt);
  let intervalDays = previous.intervalDays;
  let easeFactor = previous.easeFactor;
  let repetitions = previous.repetitions;
  let lapses = previous.lapses;

  if (rating === "again") {
    intervalDays = 0;
    repetitions = 0;
    lapses += 1;
    easeFactor = clamp(easeFactor - 0.2, 1.3, 3.5);
  } else if (rating === "hard") {
    intervalDays = Math.max(1, Math.round(Math.max(1, intervalDays) * 1.2));
    repetitions += 1;
    easeFactor = clamp(easeFactor - 0.15, 1.3, 3.5);
  } else if (rating === "good") {
    intervalDays = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.max(1, Math.round(Math.max(1, intervalDays) * easeFactor));
    repetitions += 1;
  } else {
    intervalDays = repetitions === 0 ? 4 : Math.max(4, Math.round(Math.max(1, intervalDays) * easeFactor * 1.3));
    repetitions += 1;
    easeFactor = clamp(easeFactor + 0.15, 1.3, 3.5);
  }

  const dueAt = new Date(now.getTime() + (intervalDays === 0 ? 10 * 60 * 1000 : intervalDays * DAY_MS)).toISOString();
  const spacedRepetition: FlashcardReviewState = { dueAt, intervalDays, easeFactor, repetitions, lapses, lastReviewedAt: reviewedAt };
  return { ...card, status: rating === "again" || (rating === "hard" && repetitions < 2) ? "learning" : "known", spacedRepetition };
}

export function isFlashcardDue(card: Flashcard, now = new Date()): boolean {
  const dueAt = card.spacedRepetition?.dueAt;
  return !dueAt || !Number.isFinite(new Date(dueAt).getTime()) || new Date(dueAt).getTime() <= now.getTime();
}

export function dueFlashcards(cards: Flashcard[], now = new Date()): Flashcard[] {
  return cards.filter((card) => isFlashcardDue(card, now));
}

export function flashcardDueLabel(card: Flashcard, now = new Date()): string {
  if (isFlashcardDue(card, now)) return "Đến hạn ôn";
  const dueAt = new Date(card.spacedRepetition!.dueAt);
  return `Ôn lại ${dueAt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}`;
}
