import type { StudyAccount, StudySession } from "../../../shared/study";
import { supabase } from "./supabase";

export type SupabaseAuthInput = { email: string; password: string };
export type SupabaseRegistrationInput = SupabaseAuthInput & { name: string; code: string };

function requireClient() {
  if (!supabase) throw new Error("Supabase chưa được cấu hình cho bản GitHub Pages.");
  return supabase;
}

export function mapSupabaseAccount(row: { user_id: string; display_name: string; account_code: string; role: string; locked: boolean; created_at: string }): StudyAccount {
  return {
    id: row.user_id,
    name: row.display_name,
    code: row.account_code,
    role: row.role as StudyAccount["role"],
    locked: row.locked,
    createdAt: row.created_at,
  };
}

async function loadAccount(userId: string) {
  const client = requireClient();
  const { data, error } = await client.from("study_accounts").select("user_id,display_name,account_code,role,locked,created_at").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSupabaseAccount(data) : null;
}

export async function ensureSupabaseAccount(user: { id: string; user_metadata?: Record<string, unknown> }, values?: { name?: string; code?: string }) {
  const existing = await loadAccount(user.id);
  if (existing) return existing;
  const name = String(values?.name ?? user.user_metadata?.display_name ?? "").trim();
  const code = String(values?.code ?? user.user_metadata?.account_code ?? "").trim().toUpperCase();
  if (!name || !code) throw new Error("Hồ sơ Supabase thiếu tên hoặc mã thành viên.");
  const client = requireClient();
  const { error } = await client.from("study_accounts").insert({ user_id: user.id, display_name: name, account_code: code, role: "Member", locked: false });
  if (error) throw new Error(error.message);
  const created = await loadAccount(user.id);
  if (!created) throw new Error("Không thể tạo hồ sơ thành viên Supabase.");
  return created;
}

export async function signInSupabase(input: SupabaseAuthInput): Promise<StudySession> {
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({ email: input.email.trim(), password: input.password });
  if (error || !data.user || !data.session) throw new Error(error?.message ?? "Không thể đăng nhập Supabase.");
  const account = await ensureSupabaseAccount(data.user);
  if (account.locked && account.code !== "111") throw new Error("Tài khoản đang bị khóa.");
  return { token: data.session.access_token, expiresAt: new Date(data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600_000).toISOString(), account };
}

export async function signUpSupabase(input: SupabaseRegistrationInput) {
  const client = requireClient();
  const { data, error } = await client.auth.signUp({ email: input.email.trim(), password: input.password, options: { data: { display_name: input.name.trim(), account_code: input.code.trim().toUpperCase() } } });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Supabase không trả về tài khoản mới.");
  if (!data.session) return { needsEmailConfirmation: true as const };
  const account = await ensureSupabaseAccount(data.user, { name: input.name, code: input.code });
  return { needsEmailConfirmation: false as const, session: { token: data.session.access_token, expiresAt: new Date(data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600_000).toISOString(), account } };
}

export async function restoreSupabaseSession(): Promise<StudySession | null> {
  const client = requireClient();
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.user) return null;
  const account = await ensureSupabaseAccount(data.session.user);
  if (account.locked && account.code !== "111") throw new Error("Tài khoản đang bị khóa.");
  return { token: data.session.access_token, expiresAt: new Date(data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600_000).toISOString(), account };
}

export async function updateSupabasePassword(password: string) {
  const client = requireClient();
  const { error } = await client.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

export async function sendSupabasePasswordReset(email: string) {
  const client = requireClient();
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  if (error) throw new Error(error.message);
}

export async function signOutSupabase() {
  if (supabase) await supabase.auth.signOut();
}
