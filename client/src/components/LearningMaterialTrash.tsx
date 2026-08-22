import { Check, ChevronDown, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { FlashcardSet, LearningMaterialTrashEntry, ProfileState, Quiz } from "../../../shared/study";

type MaterialKind = "flashcards" | "quizzes";

type Props = {
  profile: ProfileState;
  onProfile: (profile: ProfileState, message?: string) => void;
  visible: boolean;
};

const labelFor = (kind: MaterialKind) => kind === "flashcards" ? "Flashcard" : "Đề kiểm tra";
const countLabel = (count: number) => count === 0 ? "Không có mục" : `${count} mục đã xóa`;

function mergeRestored<T extends { id: string }>(active: T[], entries: LearningMaterialTrashEntry<T>[]) {
  return entries.slice().sort((a, b) => a.originalIndex - b.originalIndex).reduce<T[]>((current, entry) => {
    if (current.some((item) => item.id === entry.item.id)) return current;
    const next = [...current];
    next.splice(Math.min(Math.max(0, entry.originalIndex), next.length), 0, entry.item);
    return next;
  }, active);
}

export function LearningMaterialTrash({ profile, onProfile, visible }: Props) {
  const [open, setOpen] = useState<MaterialKind | null>(null);
  const [selected, setSelected] = useState<Record<MaterialKind, string[]>>({ flashcards: [], quizzes: [] });
  const groups = useMemo(() => ({
    flashcards: profile.flashcardSetTrash ?? [],
    quizzes: profile.quizTrash ?? [],
  }), [profile.flashcardSetTrash, profile.quizTrash]);

  useEffect(() => {
    let locked = false;
    const interceptDelete = (event: MouseEvent) => {
      const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button[aria-label^="Xóa bộ Flashcard"], button[aria-label^="Xóa đề "]') : null;
      if (!button || locked) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      locked = true;
      try {
        if (button.getAttribute("aria-label")?.startsWith("Xóa đề ")) {
          const title = button.getAttribute("aria-label")!.replace("Xóa đề ", "");
          const item = profile.quizzes.find((quiz) => quiz.title === title);
          if (!item || !window.confirm(`Chuyển đề “${item.title}” vào Thùng rác học liệu?`)) return;
          const originalIndex = profile.quizzes.findIndex((quiz) => quiz.id === item.id);
          onProfile({ ...profile, quizzes: profile.quizzes.filter((quiz) => quiz.id !== item.id), quizTrash: [{ item, originalIndex, deletedAt: new Date().toISOString() }, ...(profile.quizTrash ?? [])] }, "Đã chuyển đề kiểm tra vào Thùng rác.");
          return;
        }
        const scopeText = button.closest("aside")?.textContent ?? "";
        const item = profile.flashcardSets.find((set) => scopeText.includes(set.title)) ?? profile.flashcardSets[0];
        if (!item || !window.confirm(`Chuyển bộ “${item.title}” vào Thùng rác học liệu?`)) return;
        const originalIndex = profile.flashcardSets.findIndex((set) => set.id === item.id);
        onProfile({ ...profile, flashcardSets: profile.flashcardSets.filter((set) => set.id !== item.id), flashcardSetTrash: [{ item, originalIndex, deletedAt: new Date().toISOString() }, ...(profile.flashcardSetTrash ?? [])] }, "Đã chuyển bộ Flashcard vào Thùng rác.");
      } finally {
        window.setTimeout(() => { locked = false; }, 200);
      }
    };
    document.addEventListener("click", interceptDelete, true);
    return () => document.removeEventListener("click", interceptDelete, true);
  }, [onProfile, profile, visible]);

  if (!visible) return null;

  const toggleSelection = (kind: MaterialKind, id: string) => setSelected((current) => ({ ...current, [kind]: current[kind].includes(id) ? current[kind].filter((key) => key !== id) : [...current[kind], id] }));
  const toggleAll = (kind: MaterialKind) => setSelected((current) => ({ ...current, [kind]: current[kind].length === groups[kind].length ? [] : groups[kind].map((entry) => entry.item.id) }));
  const restore = (kind: MaterialKind) => {
    const keys = selected[kind];
    const entries = groups[kind].filter((entry) => keys.includes(entry.item.id));
    if (!entries.length) return;
    if (kind === "flashcards") onProfile({ ...profile, flashcardSets: mergeRestored(profile.flashcardSets, entries as LearningMaterialTrashEntry<FlashcardSet>[]), flashcardSetTrash: groups.flashcards.filter((entry) => !keys.includes(entry.item.id)) }, `Đã khôi phục ${entries.length} bộ Flashcard.`);
    else onProfile({ ...profile, quizzes: mergeRestored(profile.quizzes, entries as LearningMaterialTrashEntry<Quiz>[]), quizTrash: groups.quizzes.filter((entry) => !keys.includes(entry.item.id)) }, `Đã khôi phục ${entries.length} đề kiểm tra.`);
    setSelected((current) => ({ ...current, [kind]: [] }));
  };
  const permanentlyDelete = (kind: MaterialKind) => {
    const keys = selected[kind];
    if (!keys.length || !window.confirm(`Xóa vĩnh viễn ${keys.length} ${labelFor(kind)} đã chọn? Hành động này không thể hoàn tác.`)) return;
    if (kind === "flashcards") onProfile({ ...profile, flashcardSetTrash: groups.flashcards.filter((entry) => !keys.includes(entry.item.id)) }, `Đã xóa vĩnh viễn ${keys.length} bộ Flashcard.`);
    else onProfile({ ...profile, quizTrash: groups.quizzes.filter((entry) => !keys.includes(entry.item.id)) }, `Đã xóa vĩnh viễn ${keys.length} đề kiểm tra.`);
    setSelected((current) => ({ ...current, [kind]: [] }));
  };

  return <section className="panel mt-6 p-5 sm:p-6" aria-labelledby="learning-material-trash-title">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-rose-700 dark:text-rose-300">Học liệu đã xóa</p><h2 id="learning-material-trash-title" className="mt-1 font-display text-2xl font-bold">Thùng rác học liệu</h2><p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Các bộ Flashcard và đề kiểm tra được chuyển vào đây trước khi xóa vĩnh viễn. Dữ liệu chỉ được khôi phục trong đúng nhóm học liệu.</p></div><Trash2 className="h-8 w-8 text-rose-600" aria-hidden="true" /></div>
    <div className="mt-5 grid gap-3 md:grid-cols-2">{(["flashcards", "quizzes"] as MaterialKind[]).map((kind) => { const entries = groups[kind]; const isOpen = open === kind; const keys = selected[kind]; return <article key={kind} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/[.035]"><button type="button" className="flex w-full items-center justify-between gap-3 p-4 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : kind)}><span><b className="block text-base">{labelFor(kind)}</b><span className="mt-1 block text-xs text-slate-500 dark:text-slate-300">{countLabel(entries.length)}</span></span><ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" /></button>{isOpen && <div className="border-t border-slate-200 p-4 dark:border-white/10">{entries.length === 0 ? <p className="text-sm text-slate-500">Không có mục nào trong nhóm này.</p> : <><div className="mb-3 flex flex-wrap items-center gap-2"><button type="button" onClick={() => toggleAll(kind)} className="secondary-button !px-3 !py-2 text-xs"><Check className="h-3.5 w-3.5" />{keys.length === entries.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}</button><button type="button" disabled={!keys.length} onClick={() => restore(kind)} className="secondary-button !px-3 !py-2 text-xs disabled:opacity-50"><RotateCcw className="h-3.5 w-3.5" />Khôi phục</button><button type="button" disabled={!keys.length} onClick={() => permanentlyDelete(kind)} className="secondary-button !px-3 !py-2 text-xs text-rose-700 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Xóa vĩnh viễn</button></div><ul className="space-y-2">{entries.map((entry) => <li key={entry.item.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-black/10"><input aria-label={`Chọn ${entry.item.title}`} type="checkbox" checked={keys.includes(entry.item.id)} onChange={() => toggleSelection(kind, entry.item.id)} className="mt-1 h-4 w-4 accent-rose-600" /><span className="min-w-0 flex-1"><b className="block truncate text-sm">{entry.item.title}</b><span className="mt-1 block text-xs text-slate-500">Đã xóa {new Date(entry.deletedAt).toLocaleString("vi-VN")}</span></span></li>)}</ul></>}</div>}</article>; })}</div>
  </section>;
}
