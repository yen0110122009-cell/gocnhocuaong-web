const base = String(process.env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
const key = String(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "");
if (!base || !key) throw new Error("Thiếu cấu hình Supabase trong môi trường QA.");
const response = await fetch(`${base}/rest/v1/app_state?id=eq.global_state&select=id,payload`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!response.ok) throw new Error(`Cloud-state trả về HTTP ${response.status}`);
const rows = await response.json();
const scoped = rows?.[0]?.payload?.__gocnhocuaong ?? {};
const accounts = Array.isArray(scoped.accounts) ? scoped.accounts : [];
const account = accounts.find((item) => item?.code === "111");
const profile = account ? scoped.profiles?.[account.id] ?? null : null;
console.log(JSON.stringify({
  accountFound: Boolean(account),
  account: account ? { id: account.id, name: account.name, code: account.code, role: account.role, locked: account.locked } : null,
  profileFound: Boolean(profile),
  profileKeys: profile && typeof profile === "object" ? Object.keys(profile).sort() : [],
  hasCompanionMedia: Boolean(profile?.companionEmotionMedia),
  hasAudioMixer: Boolean(profile?.audioMixer),
}, null, 2));
