import { RotateCcw, Trash2 } from "lucide-react";
import type { AppConfig } from "../../../shared/study";

type Props = { config: AppConfig; onConfig: (config: AppConfig, message?: string) => void };

export default function AdminTrashPanel({ config, onConfig }: Props) {
  const collectionConfig = config.collectionConfig;
  if (!collectionConfig) return null;
  const characters = config.characters.filter((item) => Boolean(item.deletedAt));
  const eventsList = collectionConfig.events ?? [];
  const events = eventsList.filter((item) => Boolean(item.deletedAt));
  const restoreCharacter = (id: string) => onConfig({ ...config, characters: config.characters.map((item) => item.id === id ? { ...item, deletedAt: undefined } : item) }, "Đã khôi phục nhân vật vào bộ sưu tập.");
  const permanentlyDeleteCharacter = (id: string) => onConfig({ ...config, characters: config.characters.filter((item) => item.id !== id) }, "Đã xóa vĩnh viễn nhân vật.");
  const restoreEvent = (id: string) => onConfig({ ...config, collectionConfig: { ...collectionConfig, events: eventsList.map((item) => item.id === id ? { ...item, deletedAt: undefined, status: "draft" as const } : item) } }, "Đã khôi phục Event về bản nháp.");
  const permanentlyDeleteEvent = (id: string) => onConfig({ ...config, collectionConfig: { ...collectionConfig, events: eventsList.filter((item) => item.id !== id) } }, "Đã xóa vĩnh viễn Event.");
  const total = characters.length + events.length;
  return <section className="panel mt-5 p-5" aria-labelledby="admin-trash-title"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200"><Trash2 className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-700 dark:text-rose-300">Quản trị dữ liệu</p><h2 id="admin-trash-title" className="mt-1 font-display text-xl font-bold">🗑️ Thùng rác</h2><p className="mt-2 text-sm leading-6 text-slate-500">Dữ liệu xóa mềm được giữ lại để khôi phục. Xóa vĩnh viễn là thao tác không thể hoàn tác.</p></div></div><p className="mt-4 text-sm font-bold">{total} mục đang ở thùng rác · {characters.length} nhân vật · {events.length} Event</p>{total === 0 ? <p className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-white/10">Thùng rác hiện trống.</p> : <div className="mt-4 grid gap-3 md:grid-cols-2">{characters.map((item) => <article key={`character-${item.id}`} className="rounded-2xl border border-rose-100 p-4 dark:border-rose-400/15"><p className="font-bold">📜 {item.name}</p><p className="mt-1 text-xs text-slate-500">Nhân vật lịch sử · xóa lúc {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : "—"}</p><div className="mt-3 flex flex-wrap gap-2"><button className="secondary-button px-3 py-2 text-xs" onClick={() => restoreCharacter(item.id)}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Khôi phục</button><button className="secondary-button px-3 py-2 text-xs text-rose-700" onClick={() => permanentlyDeleteCharacter(item.id)}>Xóa vĩnh viễn</button></div></article>)}{events.map((item) => <article key={`event-${item.id}`} className="rounded-2xl border border-rose-100 p-4 dark:border-rose-400/15"><p className="font-bold">🎪 {item.name}</p><p className="mt-1 text-xs text-slate-500">Event · xóa lúc {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : "—"}</p><div className="mt-3 flex flex-wrap gap-2"><button className="secondary-button px-3 py-2 text-xs" onClick={() => restoreEvent(item.id)}><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Khôi phục</button><button className="secondary-button px-3 py-2 text-xs text-rose-700" onClick={() => permanentlyDeleteEvent(item.id)}>Xóa vĩnh viễn</button></div></article>)}</div>}</section>;
}

export { AdminTrashPanel };

