import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PersistentCollapsible } from "@/components/PersistentCollapsible";
import AdminEnhanced from "./AdminEnhanced";
import type { AppConfig, CollectionEvent, ProfileState, StudyAccount } from "../../../shared/study";

type Props = { account: StudyAccount; profile?: ProfileState; config: AppConfig; onConfig: (config: AppConfig, message?: string) => void };
const uid = () => crypto.randomUUID();

export default function AdminWorkspace({ account, config, onConfig }: Props) {
  const [draft, setDraft] = useState({ name: "", objective: "", startsAt: "", endsAt: "", rewardType: "ticket" as "ticket" | "fragment", amount: "1" });
  const events = config.collectionConfig?.events ?? [];

  const saveEvents = (next: CollectionEvent[], message: string) => onConfig({
    ...config,
    collectionConfig: {
      ...(config.collectionConfig ?? { tierValues: [], ticketExchange: { fragmentValue: 10, tickets: 1, enabled: true }, shopItems: [], rewardSources: [] }),
      events: next,
    },
    updatedAt: new Date().toISOString(),
  }, message);

  const addEvent = () => {
    if (!draft.name.trim() || !draft.startsAt || !draft.endsAt) return toast.error("Nhập tên và thời gian Event.");
    const amount = Math.max(1, Number(draft.amount) || 1);
    const event: CollectionEvent = {
      id: uid(), name: draft.name.trim(), description: "Event do quản trị tạo từ Kế hoạch.",
      startsAt: new Date(draft.startsAt).toISOString(), endsAt: new Date(draft.endsAt).toISOString(),
      status: "draft", difficulty: "Dễ", objective: draft.objective.trim() || "Hoàn thành kế hoạch đã đặt.", tasks: [],
      rewards: draft.rewardType === "ticket" ? [{ type: "ticket", amount, label: `${amount} vé kế hoạch` }] : [],
      fragmentRewards: draft.rewardType === "fragment" ? [{ tier: "I", amount, label: `${amount} mảnh ghép` }] : [],
      participationConditions: [], claimLimit: 1, approvalStatus: "draft", aiDraft: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    saveEvents([...events, event], "Đã tạo Event ở dạng bản nháp.");
    setDraft({ name: "", objective: "", startsAt: "", endsAt: "", rewardType: "ticket", amount: "1" });
  };

  const updateEvent = (id: string, patch: Partial<CollectionEvent>, message: string) => saveEvents(events.map((event) => event.id === id ? { ...event, ...patch, updatedAt: new Date().toISOString() } : event), message);
  const deleteEvent = (event: CollectionEvent) => {
    if (window.confirm(`Lưu trữ Event “${event.name}”?`)) updateEvent(event.id, { status: "archived", deletedAt: new Date().toISOString() }, "Đã lưu trữ Event.");
  };
  const visibleEvents = events.filter((event) => !event.deletedAt);

  return <div className="space-y-5">
    <div>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Khu vực quản trị</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Quản lý thành viên và Event</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Theo dõi thành viên, tổ chức Event học tập và lưu các cấu hình cần thiết cho nhóm.</p>
    </div>

    <PersistentCollapsible storageKey="admin-members" eyebrow="Truy cập" title="Quản lý thành viên">
      <AdminEnhanced account={account} config={config} onConfig={onConfig} />
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="admin-events" eyebrow="Kế hoạch chung" title={`Event học tập (${visibleEvents.length})`}>
      <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={(event) => { event.preventDefault(); addEvent(); }} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
          <h2 className="font-display text-lg font-bold">Tạo Event</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-bold">Tên Event<input className="input mt-1" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label className="block text-sm font-bold">Mục tiêu<input className="input mt-1" value={draft.objective} onChange={(event) => setDraft({ ...draft, objective: event.target.value })} placeholder="Ví dụ: Hoàn thành 3 phiên học" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-bold">Bắt đầu<input className="input mt-1" type="datetime-local" value={draft.startsAt} onChange={(event) => setDraft({ ...draft, startsAt: event.target.value })} /></label>
              <label className="block text-sm font-bold">Kết thúc<input className="input mt-1" type="datetime-local" value={draft.endsAt} onChange={(event) => setDraft({ ...draft, endsAt: event.target.value })} /></label>
            </div>
            <div className="grid grid-cols-[1fr_96px] gap-3">
              <label className="block text-sm font-bold">Thưởng<select className="input mt-1" value={draft.rewardType} onChange={(event) => setDraft({ ...draft, rewardType: event.target.value as "ticket" | "fragment" })}><option value="ticket">Vé</option><option value="fragment">Mảnh ghép</option></select></label>
              <label className="block text-sm font-bold">Số lượng<input className="input mt-1" min="1" type="number" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} /></label>
            </div>
            <button className="primary-button w-full"><Plus className="h-4 w-4" />Tạo Event nháp</button>
          </div>
        </form>
        <div className="space-y-3">
          {visibleEvents.map((event) => <article key={event.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{event.status === "active" ? "Đang diễn ra" : event.status === "draft" ? "Bản nháp" : event.status}</p>
                <h2 className="mt-1 font-display text-lg font-bold">{event.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{event.objective}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{new Date(event.startsAt).toLocaleDateString("vi-VN")} – {new Date(event.endsAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="secondary-button text-xs" onClick={() => updateEvent(event.id, { status: event.status === "active" ? "draft" : "active", approvalStatus: event.status === "active" ? "draft" : "approved" }, event.status === "active" ? "Đã chuyển Event thành bản nháp." : "Đã kích hoạt Event.")}>{event.status === "active" ? "Dừng" : "Kích hoạt"}</button>
                <button type="button" className="icon-button text-rose-600" aria-label={`Lưu trữ ${event.name}`} onClick={() => deleteEvent(event)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </article>)}
          {visibleEvents.length === 0 && <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500 dark:border-white/10">Chưa có Event nào.</p>}
        </div>
      </div>
    </PersistentCollapsible>
  </div>;
}
