export const EASTER_EGG_STORAGE_KEY = "easter_egg_message";
export const DEFAULT_EASTER_EGG_MESSAGE = "Chúc bạn một ngày tốt lành! 🍀";

export function readEasterEggMessage(): string {
  if (typeof window === "undefined") return DEFAULT_EASTER_EGG_MESSAGE;
  try {
    const saved = window.localStorage.getItem(EASTER_EGG_STORAGE_KEY)?.trim();
    return saved || DEFAULT_EASTER_EGG_MESSAGE;
  } catch {
    return DEFAULT_EASTER_EGG_MESSAGE;
  }
}

export function saveEasterEggMessage(message: string): string {
  const normalized = message.trim() || DEFAULT_EASTER_EGG_MESSAGE;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(EASTER_EGG_STORAGE_KEY, normalized);
    } catch {
      // Private browsing or blocked storage should not break account settings.
    }
  }
  return normalized;
}

export function clearEasterEggMessage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(EASTER_EGG_STORAGE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}
