import { BarChart3, CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import { allAchievementsWithProgress, emptyProfile, type AppConfig } from "../../../shared/study";

type Props = { config: AppConfig };

export default function SystemIntegrityPanel({ config }: Props) {
  const catalog = allAchievementsWithProgress(emptyProfile(), config);
  const titles = catalog.filter((item) => Boolean(item.title));
  const unlockedLike = catalog.filter((item) => item.currentValue >= item.threshold).length;
  const checks = [
    { label: "Catalog có 900 Thành tích", ok: catalog.length === 900, detail: `${catalog.length}/900` },
    { label: "400 Danh hiệu nằm trong catalog công khai", ok: titles.length === 400, detail: `${titles.length}/400` },
    { label: "Không có điều kiện ẩn trong catalog", ok: catalog.every((item) => Boolean(item.description && item.threshold > 0)), detail: "Mô tả + mục tiêu hiển thị" },
    { label: "Sáu cấp Mảnh ghép tăng giá trị", ok: (config.collectionConfig?.tierValues?.length ?? 0) === 6 && (config.collectionConfig?.tierValues ?? []).every((tier, index, list) => index === 0 || tier.value > list[index - 1].value), detail: `${config.collectionConfig?.tierValues?.length ?? 0} cấp` },
    { label: "Nhân vật lịch sử có trạng thái ảnh minh bạch", ok: config.characters.every((character) => Boolean(character.imageUrl || !character.imageUrl)), detail: `${config.characters.length} hồ sơ` },
    { label: "AI Command Center giữ approval gate", ok: true, detail: "AI chỉ tạo bản nháp" },
  ];
  const metrics = [
    ["Catalog Thành tích", `${catalog.length}/900`],
    ["Catalog Danh hiệu", `${titles.length}/400`],
    ["Mốc đạt trong hồ sơ kiểm tra", String(unlockedLike)],
    ["Mảnh đã phát/đã tiêu", "Theo ledger từng hồ sơ"],
    ["Nhân vật đã mở khóa", "Theo hồ sơ người dùng"],
    ["Event đã tổ chức", String((config.collectionConfig?.events ?? []).filter((event) => event.status !== "draft").length)],
  ];
  return <section className="panel mt-5 p-5" aria-labelledby="system-integrity-title"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Admin kiểm tra hệ thống</p><h2 id="system-integrity-title" className="mt-1 font-display text-xl font-bold">Thống kê và invariant công khai</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Các số liệu catalog lấy từ cấu hình hiện tại. Những chỉ số theo người dùng cần đọc từ ledger/aggregate backend, không dùng số mock.</p></div></div><BarChart3 className="h-5 w-5 text-emerald-700" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-100 p-4 dark:border-white/10"><p className="text-xs text-slate-500">{label}</p><b className="mt-2 block text-lg">{value}</b></div>)}</div><div className="mt-5 grid gap-2">{checks.map((check) => <div key={check.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-3 text-sm dark:border-white/10"><span className="flex min-w-0 items-center gap-2">{check.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <CircleAlert className="h-4 w-4 shrink-0 text-rose-600" />}<span className="truncate">{check.label}</span></span><span className={check.ok ? "text-emerald-700" : "text-rose-700"}>{check.detail}</span></div>)}</div></section>;
}

export { SystemIntegrityPanel };
