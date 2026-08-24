import type { ProfileState } from "../../../shared/study";

export type PendingProfileSync = { accountId: string; profile: ProfileState; queuedAt: string };
const STORAGE_KEY = "gocnhocuaong_pending_profile_sync_v1";

function readQueue(): PendingProfileSync[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is PendingProfileSync => Boolean(item && typeof item === "object" && typeof (item as PendingProfileSync).accountId === "string" && (item as PendingProfileSync).profile && typeof (item as PendingProfileSync).profile === "object"));
  } catch { return []; }
}

function writeQueue(queue: PendingProfileSync[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.slice(-10))); } catch { /* localStorage có thể bị chặn hoặc đầy. */ }
}

export function queueProfileSync(accountId: string, profile: ProfileState, queuedAt = new Date().toISOString()) {
  if (!accountId || typeof window === "undefined") return;
  const queue = readQueue().filter((item) => item.accountId !== accountId);
  queue.push({ accountId, profile, queuedAt });
  writeQueue(queue);
}

export function pendingProfileSyncCount(accountId?: string) {
  if (typeof window === "undefined") return 0;
  const queue = readQueue();
  return accountId ? queue.filter((item) => item.accountId === accountId).length : queue.length;
}

export function pendingProfileSync(accountId: string) {
  if (typeof window === "undefined") return undefined;
  return readQueue().find((item) => item.accountId === accountId);
}

export function clearPendingProfileSync(accountId: string) {
  if (typeof window === "undefined") return;
  writeQueue(readQueue().filter((item) => item.accountId !== accountId));
}

export function pendingProfileSyncStorageKey() { return STORAGE_KEY; }
