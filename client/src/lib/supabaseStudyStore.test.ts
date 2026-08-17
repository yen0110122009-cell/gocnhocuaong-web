import { describe, expect, it } from "vitest";
import { hasSupabaseSession, listSupabaseDecks, saveSupabaseDeck, saveSupabaseQuizAttempt } from "./supabaseStudyStore";

describe("supabaseStudyStore unauthenticated behavior", () => {
  it("reports no Supabase session when the user has not connected Supabase Auth", async () => {
    await expect(hasSupabaseSession()).resolves.toBe(false);
  });

  it("returns an empty deck list without an authenticated Supabase session", async () => {
    await expect(listSupabaseDecks()).resolves.toEqual([]);
  });

  it("does not write a deck without an authenticated Supabase session", async () => {
    await expect(saveSupabaseDeck({ title: "Test", subject: "History", cards: [] })).resolves.toBeNull();
  });

  it("does not write a quiz attempt without an authenticated Supabase session", async () => {
    await expect(saveSupabaseQuizAttempt({ title: "Test", subject: "History", score: 1, totalQuestions: 1, durationSeconds: 10, answers: [] })).resolves.toBeNull();
  });
});

