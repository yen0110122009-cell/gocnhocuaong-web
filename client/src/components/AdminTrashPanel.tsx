import { RotateCcw, Trash2 } from "lucide-react";
import { isSoftDeleted, permanentlyDeleteConfigItem, restoreConfigItem, type SoftDeleteKind } from "../../../shared/softDelete";
import type { AppConfig } from "../../../shared/study";

type Props = { config: AppConfig; onConfig: (config: AppConfig, message?: string) => void };
type AdminTrashKind = SoftDeleteKind | "character" | "event";
type TrashEntry = { id: string; name: string; kind: AdminTrashKind; label: string; deletedAt?: string; detail?: string };

const deleted = (config: AppConfig, kind: SoftDeleteKind, item: { id: string; deletedAt?: string }) => Boolean(item.deletedAt) || isSoftDeleted(config, kind, item.id);

export default function AdminTrashPanel({ config, onConfig }: Props) {
  const collectionConfig = config.collectionConfig;
  if (!collectionConfig) return null;
  const events = collectionConfig.events ?? [];
  const achievements: TrashEntry[] = config.customAchievements.filter((item) => deleted(config, "achievement", item)).map((item) => ({ id: item.id, name: item.name, kind: "achievement", label: item.title ? "Thành tích + Danh hiệu liên kết" : "Thành tích", deletedAt: item.deletedAt, detail: item.title ? `Danh hiệu liên kết: ${item.title}` : undefined }));
  const rewards: TrashEntry[] = (collectionConfig.adminRewards ?? []).filter((item) => deleted(config, "reward", item)).map((item) => ({ id: item.id, name: item.name, kind: "reward", label: "Phần thưởng", deletedAt: item.deletedAt }));
  const shopItems: TrashEntry[] = collectionConfig.shopItems.filter((item) => deleted(config, "shopItem", item)).map((item) => ({ id: item.id, name: item.name, kind: "shopItem", label: "Vật phẩm cửa hàng", deletedAt: item.deletedAt, detail: item.cosmeticType ? `Cosmetic: ${item.cosmeticType}` : undefined }));
  const characters: TrashEntry[] = config.characters.filter((item) => Boolean(item.deletedAt)).map((item) => ({ id: item.id, name: item.name, kind: "character", label: "Nhân vật lịch sử", deletedAt: item.deletedAt ?? undefined }));
  const eventEntries: TrashEntry[] = events.filter((item) => Boolean(item.deletedAt)).map((item) => ({ id: item.id, name: item.name, kind: "event", label: "Event", deletedAt: item.deletedAt }));
  const entries = [...achievements, ...rewards, ...shopItems, ...characters, ...eventEntries];

  const restore = (entry: TrashEntry) => {
    if (entry.kind === "character") return onConfig({ ...config, characters: config.characters.map((item) => item.id === entry.id ? { ...item, deletedAt: undefined } : item) }, "Đã khôi phục nhân vật vào bộ sưu tập.");
    if (entry.kind === "event") return onConfig({ ...config, collectionConfig: { ...collectionConfig, events: events.map((item) => item.id === entry.id ? { ...item, deletedAt: undefined, status: "draft" as const } : item) } }, "Đã khôi phục Event về bản nháp.");
    onConfig(restoreConfigItem(config, entry.kind, entry.id), `Đã khôi phục ${entry.label.toLowerCase()}.`);
  };
  const erase = (entry: TrashEntry) => {
    if (entry.kind === "character") return onConfig({ ...config, characters: config.characters.filter((item) => item.id !== entry.id) }, "Đã xóa vĩnh viễn nhân vật.");
    if (entry.kind === "event") return onConfig({ ...config, collectionConfig: { ...collectionConfig, events: events.filter((item) => item.id !== entry.id) } }, "Đã xóa vĩnh viễn Event.");
    onConfig(permanentlyDeleteConfigItem(config, entry.kind, entry.id), `Đã xóa vĩnh viễn ${entry.label.toLowerCase()}.`);
  };
  return <section className="panel mt-5 p-5" aria-labelledby="admin-trash-title"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200"><Trash2 className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-700 dark:text-rose-300">Quản trị dữ liệu</p><h2 id="admin-trash-title" className="mt-1 font-display text-xl font-bold">🗑️ Thùng rác theo module</h2><p className="mt-2 text-sm leading-6 text-slate-500">Mỗi loại dữ liệu giữ luồng khôi phục riêng. Thành tích có Danh hiệu liên kết sẽ được khôi phục cùng dữ liệu nguồn, tránh tạo Danh hiệu mồ côi.</p></div></div><p className="mt-4 text-sm font-bold">{entries.length} mục đang ở thùng rác · {achievements.length} thành tích · {rewards.length} phần thưởng · {shopItems.length} vật phẩm · {characters.length} nhân vật · {eventEntries.length} Event</p>{entries.length === 0 ? <p className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-white/10">Thùng rác hiện trống.</p> : <div className="mt-4 grid gap-3 md:grid-cols-2">{entries.map((entry) => <article key={`${entry.kind}-${entry.id}`} className="rounded-2xl border border-rose-100 p-4 dark:border-rose-400/15"><p className="font-bold">{entry.name}</p><p className="mt-1 text-xs text-slate-500">{entry.label} · xóa lúc {entry.deletedAt ? new Date(entry.deletedAt).toLocaleString() : "đã đánh dấu xóa mềm"}</p>{entry.detail && <p className="mt-1 text-xs text-slate-500">{entry.detail}</p>}<div className="mt-3 flex flex-wrap gap-2"><button className="secondary-button px-3 py-2 text-xs" onClick={() => restore(entry)}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Khôi phục</button><button className="secondary-button px-3 py-2 text-xs text-rose-700" onClick={() => erase(entry)}>Xóa vĩnh viễn</button></div></article>)}</div>}</section>;
}

export { AdminTrashPanel };
