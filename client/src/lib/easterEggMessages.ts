export type EasterEggPopupMessage = {
  id: string;
  message: string;
  isDefault?: boolean;
};

export const EASTER_EGG_MESSAGES_STORAGE_KEY = "easter_egg_messages";
export const EASTER_EGG_MESSAGES_UPDATED_EVENT = "gocnhocuaong:easter-egg-messages-updated";
export const DEFAULT_EASTER_EGG_MESSAGES: EasterEggPopupMessage[] = [
  { id: "default-easter-egg-1", message: "Chúc bạn một ngày tốt lành! 🍀", isDefault: true },
  { id: "default-easter-egg-2", message: "Bạn đã làm tốt hơn bạn nghĩ rồi đó. Lumi luôn tin bạn! ✨", isDefault: true },
  { id: "default-easter-egg-3", message: "Hít vào thật sâu, thở ra thật chậm. Mình cùng bước tiếp nhé! 🌿", isDefault: true },
];

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function fallbackMessages() {
  return DEFAULT_EASTER_EGG_MESSAGES.map((item) => ({ ...item }));
}

function normalize(value: unknown, index: number): EasterEggPopupMessage | null {
  if (typeof value === "string") {
    const message = value.trim();
    return message ? { id: `easter-egg-message-${index}`, message } : null;
  }
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<EasterEggPopupMessage>;
  const message = typeof candidate.message === "string" ? candidate.message.trim() : "";
  if (!message) return null;
  const id = typeof candidate.id === "string" && candidate.id.trim() ? candidate.id.trim() : `easter-egg-message-${index}`;
  return { id, message, isDefault: candidate.isDefault === true };
}

export function readEasterEggMessages(): EasterEggPopupMessage[] {
  try {
    const raw = storage()?.getItem(EASTER_EGG_MESSAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const values = parsed.flatMap((value, index) => {
          const item = normalize(value, index);
          return item ? [item] : [];
        });
        if (values.length) return values;
      }
    }
    const legacy = storage()?.getItem("easter_egg_message")?.trim();
    if (legacy) return [{ id: "legacy-easter-egg-message", message: legacy }];
  } catch {
    // localStorage may be unavailable or contain malformed legacy data.
  }
  return fallbackMessages();
}

export function saveEasterEggMessages(messages: EasterEggPopupMessage[]): EasterEggPopupMessage[] {
  const seen = new Set<string>();
  const normalized = messages.flatMap((value, index) => {
    const item = normalize(value, index);
    if (!item) return [];
    const key = item.message.toLocaleLowerCase("vi-VN");
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ ...item, isDefault: false }];
  });
  const saved = normalized.length ? normalized : fallbackMessages();
  try {
    storage()?.setItem(EASTER_EGG_MESSAGES_STORAGE_KEY, JSON.stringify(saved));
    // Keep older integrations reading the legacy key pointed at the first popup.
    storage()?.setItem("easter_egg_message", saved[0].message);
  } catch {
    // Private browsing or blocked storage should not break the popup.
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<EasterEggPopupMessage[]>(EASTER_EGG_MESSAGES_UPDATED_EVENT, { detail: saved }));
  }
  return saved;
}

export function addEasterEggMessage(messages: EasterEggPopupMessage[], message: string): EasterEggPopupMessage[] {
  const text = message.trim();
  if (!text) return messages;
  return saveEasterEggMessages([...messages, { id: `easter-egg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, message: text }]);
}

export function removeEasterEggMessage(messages: EasterEggPopupMessage[], id: string): EasterEggPopupMessage[] {
  return saveEasterEggMessages(messages.filter((item) => item.id !== id));
}

export function restoreEasterEggMessages(): EasterEggPopupMessage[] {
  return saveEasterEggMessages(fallbackMessages());
}

export function pickEasterEggMessage(messages: EasterEggPopupMessage[], current = ""): string {
  const values = messages.length ? messages : fallbackMessages();
  const candidates = values.length > 1 ? values.filter((item) => item.message !== current) : values;
  return candidates[Math.floor(Math.random() * candidates.length)]?.message ?? DEFAULT_EASTER_EGG_MESSAGES[0].message;
}
