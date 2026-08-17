import { useMemo, useState } from "react";
import { Printer, SlidersHorizontal } from "lucide-react";
import type { ProfileState } from "../../../shared/study";
import { BRAND } from "@/branding";

type Props = { profile: ProfileState };
type Mode = "all" | "quick" | "deep" | "paper";
type Range = "7" | "30" | "90" | "all";

const modeLabel = (mode: Mode) => mode === "quick" ? "Làm đề nhanh" : mode === "deep" ? "Hiểu tận gốc" : mode === "paper" ? "Tự làm đề–Tập trung" : "Tất cả chế độ";

function safe(value: string) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char] ?? char)); }

export default function ProgressReports({ profile }: Props) {
  const [range, setRange] = useState<Range>("30");
  const [subject, setSubject] = useState("all");
  const [mode, setMode] = useState<Mode>("all");
  const quizzes = useMemo(() => new Map(profile.quizzes.map((quiz) => [quiz.id, quiz])), [profile.quizzes]);
  const subjects = useMemo(() => Array.from(new Set(profile.attempts.map((attempt) => quizzes.get(attempt.quizId)?.subject).filter(Boolean) as string[])).sort(), [profile.attempts, quizzes]);
  const filtered = useMemo(() => {
    const cutoff = range === "all" ? 0 : Date.now() - Number(range) * 86400000;
    return profile.attempts.filter((attempt) => {
      const quiz = quizzes.get(attempt.quizId);
      return new Date(attempt.completedAt).getTime() >= cutoff && (subject === "all" || quiz?.subject === subject) && (mode === "all" || (attempt.mode ?? "quick") === mode);
    });
  }, [profile.attempts, quizzes, range, subject, mode]);
  const totalCorrect = filtered.reduce((sum, item) => sum + item.correct, 0);
  const totalQuestions = filtered.reduce((sum, item) => sum + item.total, 0);
  const accuracy = totalQuestions ? Math.round(totalCorrect / totalQuestions * 100) : 0;
  const modeRows = (["quick", "deep", "paper"] as const).map((value) => { const rows = filtered.filter((item) => (item.mode ?? "quick") === value); const correct = rows.reduce((sum, item) => sum + item.correct, 0); const total = rows.reduce((sum, item) => sum + item.total, 0); return { value, count: rows.length, accuracy: total ? Math.round(correct / total * 100) : 0 }; });
  const topicRows = useMemo(() => { const map = new Map<string, { label: string; correct: number; total: number; count: number }>(); filtered.forEach((attempt) => { const quiz = quizzes.get(attempt.quizId); const label = `${quiz?.subject || "Chưa phân loại"} · ${quiz?.topic || quiz?.title || "Chưa có chủ đề"}`; const row = map.get(label) ?? { label, correct: 0, total: 0, count: 0 }; row.correct += attempt.correct; row.total += attempt.total; row.count += 1; map.set(label, row); }); return Array.from(map.values()).sort((a, b) => b.correct / Math.max(1, b.total) - a.correct / Math.max(1, a.total)).slice(0, 8).map((row) => ({ ...row, accuracy: Math.round(row.correct / Math.max(1, row.total) * 100) })); }, [filtered, quizzes]);
  const printReport = () => {
    const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=760");
    if (!popup) { window.print(); return; }
    const rows = filtered.map((attempt) => { const quiz = quizzes.get(attempt.quizId); return `<tr><td>${safe(new Date(attempt.completedAt).toLocaleString("vi-VN"))}</td><td>${safe(quiz?.title || "Đề đã đồng bộ")}</td><td>${safe(modeLabel((attempt.mode ?? "quick") as Mode))}</td><td>${attempt.correct}/${attempt.total}</td><td>${attempt.accuracy}%</td></tr>`; }).join("");
    popup.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo tiến bộ · ${BRAND.naturalName}</title><style>body{font-family:Arial,sans-serif;color:#2d211a;padding:32px;line-height:1.5}h1{color:#9a5b12}table{border-collapse:collapse;width:100%;margin-top:20px}th,td{border:1px solid #d8c8b4;padding:8px;text-align:left}th{background:#f7e8c8}.summary{display:flex;gap:24px;margin:18px 0}.summary b{font-size:22px}small{color:#75685d}@media print{button{display:none}}</style></head><body><h1>${BRAND.naturalName} · Báo cáo tiến bộ</h1><p><small>Bộ lọc: ${safe(range === "all" ? "Tất cả thời gian" : `${range} ngày gần đây`)} · ${safe(subject === "all" ? "Tất cả môn học" : subject)} · ${safe(modeLabel(mode))}</small></p><div class="summary"><div><b>${filtered.length}</b><br>phiên làm đề</div><div><b>${accuracy}%</b><br>độ chính xác</div><div><b>${totalCorrect}/${totalQuestions}</b><br>câu đúng</div></div><table><thead><tr><th>Thời gian</th><th>Đề</th><th>Chế độ</th><th>Đúng</th><th>Độ chính xác</th></tr></thead><tbody>${rows || '<tr><td colspan="5">Chưa có dữ liệu phù hợp.</td></tr>'}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
    popup.document.close();
  };
  return <section className="mt-5 space-y-5" aria-labelledby="progress-report-title"><div className="panel p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700 dark:text-amber-300">Bộ lọc báo cáo</p><h2 id="progress-report-title" className="mt-2 font-display text-2xl font-bold">Tiến bộ theo đúng phạm vi bạn chọn</h2></div><button className="primary-button" onClick={printReport}><Printer className="h-4 w-4" />In / lưu PDF</button></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><label className="text-sm font-bold">Khoảng thời gian<select aria-label="Lọc khoảng thời gian tiến bộ" value={range} onChange={(event) => setRange(event.target.value as Range)} className="input mt-2"><option value="7">7 ngày gần đây</option><option value="30">30 ngày gần đây</option><option value="90">90 ngày gần đây</option><option value="all">Toàn bộ lịch sử</option></select></label><label className="text-sm font-bold">Môn học<select aria-label="Lọc môn học tiến bộ" value={subject} onChange={(event) => setSubject(event.target.value)} className="input mt-2"><option value="all">Tất cả môn học</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-bold">Chế độ làm đề<select aria-label="Lọc chế độ làm đề tiến bộ" value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="input mt-2"><option value="all">Tất cả chế độ</option><option value="quick">Làm đề nhanh</option><option value="deep">Hiểu tận gốc</option><option value="paper">Tự làm đề–Tập trung</option></select></label></div></div><div className="grid gap-4 sm:grid-cols-3"><div className="study-card p-5"><SlidersHorizontal className="h-5 w-5 text-amber-700" /><b className="mt-4 block text-3xl">{filtered.length}</b><span className="text-sm text-slate-500">Phiên phù hợp</span></div><div className="study-card p-5"><b className="block text-3xl text-emerald-700">{accuracy}%</b><span className="text-sm text-slate-500">Độ chính xác</span></div><div className="study-card p-5"><b className="block text-3xl">{totalCorrect}/{totalQuestions}</b><span className="text-sm text-slate-500">Câu đúng</span></div></div><div className="grid gap-5 xl:grid-cols-2"><section className="panel p-6"><h3 className="font-display text-xl font-bold">Theo chế độ</h3><div className="mt-5 space-y-4">{modeRows.map((row) => <div key={row.value}><div className="flex justify-between text-sm"><b>{modeLabel(row.value)}</b><span className="text-slate-500">{row.count} phiên · {row.accuracy}%</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300" style={{ width: `${row.count ? Math.max(8, row.accuracy) : 0}%` }} /></div></div>)}</div></section><section className="panel p-6"><h3 className="font-display text-xl font-bold">Theo chủ đề / môn học</h3>{topicRows.length ? <div className="mt-5 space-y-3">{topicRows.map((row) => <div key={row.label}><div className="flex justify-between gap-3 text-sm"><b className="truncate">{row.label}</b><span className="text-slate-500">{row.accuracy}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.accuracy}%` }} /></div></div>)}</div> : <p className="mt-5 text-sm text-slate-500">Chưa có dữ liệu phù hợp với bộ lọc.</p>}</section></div></section>;
}

export { modeLabel };
