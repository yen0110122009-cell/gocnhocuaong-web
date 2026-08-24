export const LUMI_STATE_SCRIPTS_STORAGE_KEY = "lumi_state_scripts";
export const LUMI_STATE_SCRIPTS_EVENT = "lumi-state-scripts-updated";

export type LumiScriptState = "welcome" | "celebration";
export type LumiStateScripts = Record<LumiScriptState, string[]>;

export const DEFAULT_LUMI_STATE_SCRIPTS: LumiStateScripts = {
  welcome: [
    "Chào Ong, Lumi vui vì bạn đã quay lại. Mình bắt đầu thật nhẹ nhàng nhé.",
    "Không cần hoàn hảo đâu, chỉ cần bắt đầu một chút cùng Lumi.",
    "Hôm nay mình học một bước nhỏ thôi, Lumi sẽ ngồi cạnh bạn.",
    "Sẵn sàng chưa? Mình cùng mở trang sách đầu tiên nhé.",
  ],
  celebration: [
    "Tuyệt vời! Ong đã hoàn thành mục tiêu rồi, Lumi rất tự hào về bạn.",
    "Mỗi phút tập trung đều đáng giá. Hôm nay Ong đã làm rất tốt!",
    "Chúc mừng Ong! Hãy nghỉ ngơi một chút để nạp năng lượng nhé.",
    "Ong đã giữ lời hứa với chính mình. Thành quả này thật đáng tự hào!",
  ],
};

function cloneDefaults(): LumiStateScripts {
  return { welcome: [...DEFAULT_LUMI_STATE_SCRIPTS.welcome], celebration: [...DEFAULT_LUMI_STATE_SCRIPTS.celebration] };
}

function normalizeLines(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return [...fallback];
  const lines = Array.from(new Set(value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim())));
  return lines.length ? lines : [...fallback];
}

export function normalizeLumiStateScripts(value: unknown): LumiStateScripts {
  const source = value && typeof value === "object" ? value as Partial<LumiStateScripts> : {};
  return {
    welcome: normalizeLines(source.welcome, DEFAULT_LUMI_STATE_SCRIPTS.welcome),
    celebration: normalizeLines(source.celebration, DEFAULT_LUMI_STATE_SCRIPTS.celebration),
  };
}

export function readLumiStateScripts(targetStorage: Pick<Storage, "getItem"> | null = typeof window === "undefined" ? null : window.localStorage): LumiStateScripts {
  try {
    const raw = targetStorage?.getItem(LUMI_STATE_SCRIPTS_STORAGE_KEY);
    return normalizeLumiStateScripts(raw ? JSON.parse(raw) : undefined);
  } catch {
    return cloneDefaults();
  }
}

export function saveLumiStateScripts(value: unknown, targetStorage: Pick<Storage, "setItem"> | null = typeof window === "undefined" ? null : window.localStorage): LumiStateScripts {
  const scripts = normalizeLumiStateScripts(value);
  try { targetStorage?.setItem(LUMI_STATE_SCRIPTS_STORAGE_KEY, JSON.stringify(scripts)); } catch { /* storage may be unavailable */ }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent<LumiStateScripts>(LUMI_STATE_SCRIPTS_EVENT, { detail: scripts }));
  return scripts;
}

export function restoreLumiStateScripts(targetStorage: Pick<Storage, "setItem"> | null = typeof window === "undefined" ? null : window.localStorage) {
  return saveLumiStateScripts(cloneDefaults(), targetStorage);
}

const lastStateScript = new Map<LumiScriptState, string>();

export function pickLumiStateScript(scripts: LumiStateScripts, state: LumiScriptState, random = Math.random) {
  const lines = scripts[state]?.length ? scripts[state] : DEFAULT_LUMI_STATE_SCRIPTS[state];
  const previous = lastStateScript.get(state);
  const candidates = lines.length > 1 ? lines.filter((line) => line !== previous) : lines;
  const picked = candidates[Math.floor(random() * candidates.length)] ?? lines[0];
  lastStateScript.set(state, picked);
  return picked;
}
