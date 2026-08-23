import { describe, expect, it } from "vitest";
import { dueFlashcards, isFlashcardDue, reviewFlashcard } from "./flashcardSpacedRepetition";
import type { Flashcard } from "../../../shared/study";

const card: Flashcard = { id: "card-1", front: "Câu hỏi", back: "Đáp án", status: "new", starred: false };
const now = new Date("2026-08-23T00:00:00.000Z");

describe("flashcard spaced repetition", () => {
  it("migrates a new card into a dated review schedule", () => {
    const reviewed = reviewFlashcard(card, "good", now);
    expect(reviewed.status).toBe("known");
    expect(reviewed.spacedRepetition?.intervalDays).toBe(1);
    expect(isFlashcardDue(reviewed, new Date("2026-08-23T12:00:00.000Z"))).toBe(false);
    expect(isFlashcardDue(reviewed, new Date("2026-08-24T00:00:00.000Z"))).toBe(true);
  });

  it("puts an again card back into learning and the due queue", () => {
    const reviewed = reviewFlashcard(card, "again", now);
    expect(reviewed.status).toBe("learning");
    expect(reviewed.spacedRepetition?.lapses).toBe(1);
    expect(dueFlashcards([reviewed], new Date("2026-08-23T00:09:00.000Z"))).toHaveLength(0);
    expect(dueFlashcards([reviewed], new Date("2026-08-23T00:10:00.000Z"))).toHaveLength(1);
  });
});
