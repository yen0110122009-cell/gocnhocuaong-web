import { emptyAppConfig, emptyProfile, normalizeProfile, type AppConfig, type ProfileState, type StudyAccount, type StudySession } from "../../../shared/study";

const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
const SUPABASE_KEY = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "");
const REST_URL = `${SUPABASE_URL}/rest/v1/app_state`;
const CLOUD_SESSION_KEY = "gocnhocuaong_cloud_session_v1";
const STATE_KEY = "__gocnhocuaong";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type CloudAccount = StudyAccount & { normalizedName: string; passwordHash: string | null };
type CloudPayload = { accounts: CloudAccount[]; profiles: Record<string, ProfileState>; config: AppConfig; updatedAt: string };
type AppStateRow = { id: string; payload: Record<string, unknown> | null };

function assertConfigured() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("GitHub Pages chưa được cấu hình Supabase cloud-state.");
}
function headers(extra?: HeadersInit): HeadersInit { return { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", ...extra }; }

export async function readCloudJson<T>(response: Response, operation: string): Promise<T> {
  const body = await response.text();
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!response.ok) {
    const detail = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
    throw new Error(`${operation} (${response.status})${detail ? `: ${detail}` : "."}`);
  }
  if (!body.trim()) return undefined as T;
  if (!contentType.includes("json") && !/^[\[{]/.test(body.trim())) {
    throw new Error(`${operation} trả về HTML thay vì JSON. Hãy tải lại đúng bản GitHub Pages mới hoặc kiểm tra cấu hình Supabase cloud-state.`);
  }
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(`${operation} trả về dữ liệu JSON không hợp lệ. Vui lòng tải lại trang và thử lại.`);
  }
}

export function normalizeCloudName(value: string) { return value.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, " "); }
const normalizeName = normalizeCloudName;
function makeId() { return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function blankPayload(): CloudPayload { return { accounts: [], profiles: {}, config: emptyAppConfig(), updatedAt: new Date().toISOString() }; }
export function parseCloudStatePayload(row: AppStateRow | null): CloudPayload {
  const raw = row?.payload && typeof row.payload === "object" ? row.payload : {};
  const scoped = raw[STATE_KEY] && typeof raw[STATE_KEY] === "object" ? raw[STATE_KEY] as Partial<CloudPayload> : {};
  return {
    accounts: Array.isArray(scoped.accounts) ? scoped.accounts as CloudAccount[] : [],
    profiles: scoped.profiles && typeof scoped.profiles === "object" ? scoped.profiles as Record<string, ProfileState> : {},
    config: scoped.config && typeof scoped.config === "object" ? scoped.config as AppConfig : emptyAppConfig(),
    updatedAt: typeof scoped.updatedAt === "string" ? scoped.updatedAt : new Date().toISOString(),
  };
}
async function loadRow(): Promise<AppStateRow | null> {
  assertConfigured();
  const response = await fetch(`${REST_URL}?id=eq.global_state&select=id,payload`, { headers: headers(), cache: "no-store" });
  if (!response.ok) throw new Error(`Không thể đọc cloud-state (${response.status}).`);
  const rows = await readCloudJson<AppStateRow[]>(response, "Không thể đọc cloud-state");
  return rows[0] ?? null;
}
async function savePayload(currentRow: AppStateRow | null, payload: CloudPayload) {
  assertConfigured();
  const current = currentRow?.payload && typeof currentRow.payload === "object" ? currentRow.payload : {};
  const next = { ...current, [STATE_KEY]: payload };
  const options = { headers: headers({ Prefer: "return=minimal" }), body: JSON.stringify({ id: "global_state", payload: next }) };
  const response = currentRow ? await fetch(`${REST_URL}?id=eq.global_state`, { ...options, method: "PATCH" }) : await fetch(REST_URL, { ...options, method: "POST" });
  if (!response.ok) throw new Error(`Không thể ghi cloud-state (${response.status}). Kiểm tra RLS app_state.`);
}
function sessionFor(account: StudyAccount): StudySession { return { token: `cloud:${account.id}:${makeId()}`, expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(), account }; }
function storedCloudSession(): StudySession | null { try { const raw = sessionStorage.getItem(CLOUD_SESSION_KEY); if (!raw) return null; const session = JSON.parse(raw) as StudySession; return new Date(session.expiresAt).getTime() > Date.now() ? session : null; } catch { return null; } }
function saveCloudSession(session: StudySession) { sessionStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(session)); }

export async function cloudLogin(input: { name: string; password: string; code: string }): Promise<StudySession> {
  const name = input.name.trim(); const normalizedName = normalizeName(name); const code = input.code.trim().toUpperCase();
  if (!name || !input.password || !code) throw new Error("Vui lòng nhập đủ tên, mật khẩu và mã tài khoản.");
  if (input.password.length < 6) throw new Error("Mật khẩu cần có ít nhất 6 ký tự.");
  const row = await loadRow(); const payload = parseCloudStatePayload(row); let account = code === "111" ? payload.accounts.find((item) => item.code === code && item.normalizedName === normalizedName) : payload.accounts.find((item) => item.code === code);
  if (!account && code === "111") {
    account = { id: makeId(), name, normalizedName, code, role: "Founder", locked: false, createdAt: new Date().toISOString(), passwordHash: null };
    payload.accounts.push(account); payload.profiles[account.id] = emptyProfile();
  }
  if (!account) throw new Error("Mã tài khoản không tồn tại. Hãy liên hệ Admin hoặc Founder để được cấp mã.");
  if (account.normalizedName !== normalizedName) throw new Error("Tên đăng nhập không khớp với mã tài khoản.");
  if (account.locked && account.code !== "111") throw new Error("Tài khoản đang bị khóa. Hãy liên hệ quản trị viên.");
  const passwordHash = await hashPassword(input.password);
  if (account.passwordHash && account.passwordHash !== passwordHash) throw new Error("Mật khẩu không đúng.");
  if (!account.passwordHash) account.passwordHash = passwordHash;
  await savePayload(row, { ...payload, updatedAt: new Date().toISOString() });
  const session = sessionFor(account); saveCloudSession(session); return session;
}

export async function cloudRestoreSession(): Promise<StudySession | null> {
  const session = storedCloudSession(); if (!session) return null;
  try { const row = await loadRow(); const account = parseCloudStatePayload(row).accounts.find((item) => item.id === session.account.id); if (!account || (account.locked && account.code !== "111")) return null; const restored = { ...session, account }; saveCloudSession(restored); return restored; } catch { return session; }
}
export function cloudSignOut() { sessionStorage.removeItem(CLOUD_SESSION_KEY); }
export async function cloudLoadProfile(accountId: string): Promise<ProfileState> { const payload = parseCloudStatePayload(await loadRow()); return normalizeProfile(payload.profiles[accountId] ?? emptyProfile()); }
export async function cloudSaveProfile(accountId: string, profile: ProfileState) { const row = await loadRow(); const payload = parseCloudStatePayload(row); payload.profiles[accountId] = normalizeProfile(profile); payload.updatedAt = new Date().toISOString(); await savePayload(row, payload); }
export async function cloudLoadConfig(): Promise<AppConfig> { return parseCloudStatePayload(await loadRow()).config; }
export async function cloudSaveConfig(config: AppConfig) { const row = await loadRow(); const payload = parseCloudStatePayload(row); payload.config = config; payload.updatedAt = new Date().toISOString(); await savePayload(row, payload); }
export const cloudStateWarning = "GitHub Pages dùng cloud-state demo qua Supabase với quyền anon; không lưu dữ liệu nhạy cảm hoặc mật khẩu quan trọng. Bản cập nhật 220a095.";
