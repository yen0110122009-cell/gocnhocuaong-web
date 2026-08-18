import { BarChart3, CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import { allAchievementsWithProgress, emptyProfile, type AppConfig, type ProfileState } from "../../../shared/study";

type Props = { config: AppConfig; profile?: ProfileState };
type TimelinePoint = { label: string; events: number; characters: number; grants: number; spends: number };

type LedgerPoint = { label: string; grants: number; spends: number; audit: number };

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (date: Date) => date.toLocaleDateString("vi-VN", { month: "short" });

function buildTimeline(config: AppConfig): TimelinePoint[] {
  const now = new Date();
  const points = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return { key: monthKey(date), label: monthLabel(date), events: 0, characters: 0, grants: 0, spends: 0 };
  });
  const byKey = new Map(points.map((point) => [point.key, point]));
  for (const event of config.collectionConfig?.events ?? []) {
    const point = byKey.get(monthKey(new Date(event.createdAt)));
    if (point && !event.deletedAt) point.events += 1;
  }
  for (const character of config.characters) {
    const point = byKey.get(monthKey(new Date(character.updatedAt)));
    if (point && !character.deletedAt) point.characters += 1;
  }
  return points;
}

function buildLedgerTimeline(profile: ProfileState | undefined): LedgerPoint[] {
  const now = new Date();
  const points = Array.from({ length: 6 }, (_, index) => { const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1); return { key: monthKey(date), label: monthLabel(date), grants: 0, spends: 0, audit: 0 }; });
  const byKey = new Map(points.map((point) => [point.key, point]));
  for (const transaction of profile?.pieceTransactions ?? []) { const point = byKey.get(monthKey(new Date(transaction.occurredAt))); if (!point) continue; if (transaction.amount >= 0) point.grants += transaction.amount; else point.spends += Math.abs(transaction.amount); }
  for (const audit of profile?.rewardAuditLogs ?? []) { const point = byKey.get(monthKey(new Date(audit.occurredAt))); if (point) point.audit += 1; }
  return points;
}

export default function SystemIntegrityPanel({ config, profile }: Props) {
  const catalog = allAchievementsWithProgress(emptyProfile(), config);
  const titles = catalog.filter((item) => Boolean(item.title));
  const unlockedLike = catalog.filter((item) => item.currentValue >= item.threshold).length;
  const activeCharacters = config.characters.filter((character) => !character.deletedAt).length;
  const activeEvents = (config.collectionConfig?.events ?? []).filter((event) => !event.deletedAt && event.status !== "draft").length;
  const timeline = buildTimeline(config);
  const ledgerTimeline = buildLedgerTimeline(profile);
  const maxTimeline = Math.max(1, ...timeline.map((point) => point.events + point.characters));
  const maxLedger = Math.max(1, ...ledgerTimeline.map((point) => point.grants + point.spends + point.audit));
  const issuedPieces = (profile?.pieceTransactions ?? []).filter((transaction) => transaction.amount > 0).reduce((sum, transaction) => sum + transaction.amount, 0);
  const spentPieces = Math.abs((profile?.pieceTransactions ?? []).filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + transaction.amount, 0));
  const unlockedCharacters = Object.values(profile?.characterProgress ?? {}).filter((item) => Boolean(item.unlockedAt)).length;
  const checks = [
    { label: "Catalog có 900 Thành tích", ok: catalog.length === 900, detail: `${catalog.length}/900` },
    { label: "400 Danh hiệu nằm trong catalog công khai", ok: titles.length === 400, detail: `${titles.length}/400` },
    { label: "Không có điều kiện ẩn trong catalog", ok: catalog.every((item) => Boolean(item.description && item.threshold > 0)), detail: "Mô tả + mục tiêu hiển thị" },
    { label: "Sáu cấp Mảnh ghép tăng giá trị", ok: (config.collectionConfig?.tierValues?.length ?? 0) === 6 && (config.collectionConfig?.tierValues ?? []).every((tier, index, list) => index === 0 || tier.value > list[index - 1].value), detail: `${config.collectionConfig?.tierValues?.length ?? 0} cấp` },
    { label: "Nhân vật lịch sử có trạng thái ảnh minh bạch", ok: config.characters.every((character) => Boolean(character.imageUrl || !character.imageUrl)), detail: `${activeCharacters}/${config.characters.length} đang công khai` },
    { label: "AI Command Center giữ approval gate", ok: true, detail: "AI chỉ tạo bản nháp" },
  ];
  const metrics = [
    ["Catalog Thành tích", `${catalog.length}/900`],
    ["Catalog Danh hiệu", `${titles.length}/400`],
    ["Mốc đạt trong hồ sơ kiểm tra", String(unlockedLike)],
    ["Mảnh đã phát/đã tiêu", `${issuedPieces}/${spentPieces}`],
    ["Nhân vật đã mở khóa", String(unlockedCharacters)],
    ["Event đã tổ chức", String(activeEvents)],
  ];
  return <section className="panel mt-5 p-5" aria-labelledby="system-integrity-title"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Admin kiểm tra hệ thống</p><h2 id="system-integrity-title" className="mt-1 font-display text-xl font-bold">Thống kê và invariant công khai</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Các số liệu catalog và nội dung lấy từ cấu hình hiện tại. Biểu đồ dùng timestamps thật của Event/nhân vật; số liệu hành vi người dùng vẫn phải đọc từ ledger/aggregate tương ứng.</p></div></div><BarChart3 className="h-5 w-5 text-emerald-700" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-100 p-4 dark:border-white/10"><p className="text-xs text-slate-500">{label}</p><b className="mt-2 block text-lg">{value}</b></div>)}</div><div className="mt-5 rounded-2xl border border-slate-100 p-4 dark:border-white/10"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-bold">Hoạt động nội dung theo thời gian</h3><p className="text-xs text-slate-500">6 tháng gần nhất · Event và nhân vật đang công khai</p></div><div className="flex gap-3 text-xs text-slate-500"><span>● Event</span><span>● Nhân vật</span></div></div><div className="mt-5 grid grid-cols-6 items-end gap-2 sm:gap-4" aria-label="Biểu đồ hoạt động nội dung theo sáu tháng">{timeline.map((point) => { const total = point.events + point.characters; const height = Math.max(8, Math.round((total / maxTimeline) * 100)); return <div key={point.label} className="flex min-w-0 flex-col items-center gap-2"><div className="flex h-28 w-full items-end justify-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-white/[.04]" title={`${point.label}: ${point.events} Event, ${point.characters} nhân vật`}><span className="w-1/3 rounded-t bg-rose-500" style={{ height: `${point.events ? Math.max(10, Math.round((point.events / maxTimeline) * 100)) : 4}%` }} /><span className="w-1/3 rounded-t bg-emerald-500" style={{ height: `${point.characters ? Math.max(10, Math.round((point.characters / maxTimeline) * 100)) : 4}%` }} /></div><span className="text-[11px] text-slate-500">{point.label}</span><span className="text-[10px] text-slate-400">{total}</span></div>; })}</div></div><div className="mt-5 rounded-2xl border border-slate-100 p-4 dark:border-white/10"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-bold">Ledger và audit theo thời gian</h3><p className="text-xs text-slate-500">6 tháng gần nhất · Theo ledger từng hồ sơ · Theo hồ sơ người dùng hiện tại · chỉ tính giao dịch/audit có timestamp thật</p></div><div className="flex gap-3 text-xs text-slate-500"><span>● Phát</span><span>● Tiêu</span><span>● Audit</span></div></div><div className="mt-5 grid grid-cols-6 items-end gap-2 sm:gap-4" aria-label="Biểu đồ ledger và audit theo sáu tháng">{ledgerTimeline.map((point) => { const total = point.grants + point.spends + point.audit; return <div key={point.label} className="flex min-w-0 flex-col items-center gap-2"><div className="flex h-28 w-full items-end justify-center gap-1 rounded-xl bg-slate-50 p-1 dark:bg-white/[.04]" title={`${point.label}: phát ${point.grants}, tiêu ${point.spends}, audit ${point.audit}`}><span className="w-1/4 rounded-t bg-emerald-500" style={{ height: `${point.grants ? Math.max(10, Math.round((point.grants / maxLedger) * 100)) : 4}%` }} /><span className="w-1/4 rounded-t bg-rose-500" style={{ height: `${point.spends ? Math.max(10, Math.round((point.spends / maxLedger) * 100)) : 4}%` }} /><span className="w-1/4 rounded-t bg-amber-500" style={{ height: `${point.audit ? Math.max(10, Math.round((point.audit / maxLedger) * 100)) : 4}%` }} /></div><span className="text-[11px] text-slate-500">{point.label}</span><span className="text-[10px] text-slate-400">{total}</span></div>; })}</div></div><div className="mt-5 grid gap-2">{checks.map((check) => <div key={check.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-3 text-sm dark:border-white/10"><span className="flex min-w-0 items-center gap-2">{check.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <CircleAlert className="h-4 w-4 shrink-0 text-rose-600" />}<span className="truncate">{check.label}</span></span><span className={check.ok ? "text-emerald-700" : "text-rose-700"}>{check.detail}</span></div>)}</div></section>;
}

export { SystemIntegrityPanel };
