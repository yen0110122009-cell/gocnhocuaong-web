import type { ProfileState } from "../../../shared/study";
import { supabase } from "./supabase";

export async function hasSupabaseSession() {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

async function currentUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function loadSupabaseProfile(): Promise<ProfileState | null> {
  const user = await currentUser();
  if (!user || !supabase) return null;
  const { data, error } = await supabase.from("study_profiles").select("data").eq("user_id", user.id).maybeSingle();
  if (error || !data?.data) return null;
  return data.data as ProfileState;
}

export async function saveSupabaseProfile(profile: ProfileState, displayName = "") {
  const user = await currentUser();
  if (!user || !supabase) return false;
  const { error } = await supabase.from("study_profiles").upsert({
    user_id: user.id,
    display_name: displayName,
    xp: profile.xp,
    level: profile.level,
    data: profile,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

export async function listSupabaseDecks() {
  const user = await currentUser();
  if (!user || !supabase) return [];
  const { data, error } = await supabase.from("flashcard_decks").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
  return error ? [] : data ?? [];
}

export async function saveSupabaseDeck(input: { title: string; subject?: string; description?: string; cards: unknown[] }) {
  const user = await currentUser();
  if (!user || !supabase) return null;
  const { data, error } = await supabase.from("flashcard_decks").insert({
    user_id: user.id,
    title: input.title,
    subject: input.subject ?? "",
    description: input.description ?? "",
    cards: input.cards,
  }).select().single();
  return error ? null : data;
}

export async function listSupabaseQuizAttempts() {
  const user = await currentUser();
  if (!user || !supabase) return [];
  const { data, error } = await supabase.from("quiz_attempts").select("id,title,subject,score,total_questions,duration_seconds,answers,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  return error ? [] : data ?? [];
}

export async function saveSupabaseQuizAttempt(input: { title: string; subject?: string; score: number; totalQuestions: number; durationSeconds: number; answers: unknown[] }) {
  const user = await currentUser();
  if (!user || !supabase) return null;
  const { data, error } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    title: input.title,
    subject: input.subject ?? "",
    score: input.score,
    total_questions: input.totalQuestions,
    duration_seconds: input.durationSeconds,
    answers: input.answers,
  }).select().single();
  return error ? null : data;
}
