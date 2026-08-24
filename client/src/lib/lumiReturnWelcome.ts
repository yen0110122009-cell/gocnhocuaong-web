export const LUMI_LAST_SEEN_STORAGE_KEY = "gocnhocuaong_lumi_last_seen_at";
export const LUMI_RETURN_WELCOME = "Mừng Ong quay lại nhé. Lumi vẫn ở đây, mình bắt đầu thật nhẹ nhàng bằng một bước nhỏ thôi 🍀";
const DAY_MS = 24 * 60 * 60 * 1000;

export function shouldShowLumiReturnWelcome(lastSeen: string | null | undefined, now = Date.now(), inactiveDays = 2) {
  if (!lastSeen) return false;
  const timestamp = Date.parse(lastSeen);
  return Number.isFinite(timestamp) && now - timestamp >= Math.max(1, inactiveDays) * DAY_MS;
}
