import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clipboard, Eye, FileUp, History, RefreshCw, Sparkles, Trash2, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { buildExternalAiPrompt, convertImportToFlashcards, convertImportToQuiz, validateExternalAiData, type AiImportOptions, type ImportTarget, type ImportQuestionType } from "../../../shared/aiDataImport";
import type { ProfileState } from "../../../shared/study";

type Props = { profile: ProfileState; onProfile: (profile: ProfileState, message?: string) => void; onView: (view: "flashcards" | "quizzes") => void };
const uid = () => crypto.randomUUID();
const parseQuantity = (value: string): AiImportOptions["quantity"] => value === "custom" ? "custom" : value === "auto" ? "auto" : (Number(value) as 10 | 20 | 30);

export default function AIDataImport({ profile, onProfile, onView }: Props) {
  const [target, setTarget] = useState<ImportTarget>("both");
  const [questionType, setQuestionType] = useState<ImportQuestionType>("mixed");
  const [quantity, setQuantity] = useState<AiImportOptions["quantity"]>(10);
  const [customQuantity, setCustomQuantity] = useState(20);
  const [title, setTitle] = useState("Tài liệu lịch sử mới");
  const [subject, setSubject] = useState("Lịch sử Việt Nam");
  const [topic, setTopic] = useState("");
  const [extraRequest, setExtraRequest] = useState("");
  const [rawData, setRawData] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [validated, setValidated] = useState<ReturnType<typeof validateExternalAiData> | null>(null);
  const options = useMemo<AiImportOptions>(() => ({ target, questionType, quantity, customQuantity, title, subject, topic, extraRequest }), [target, questionType, quantity, customQuantity, title, subject, topic, extraRequest]);
  const makePrompt = () => { setPrompt(buildExternalAiPrompt(options)); toast.success("Đã tạo prompt cho AI bên ngoài."); };
  const validate = () => { const result = validateExternalAiData(rawData); setValidated(result); result.valid ? toast.success(`Dữ liệu hợp lệ: ${result.questions.length} câu.`) : toast.error(`${result.errors.length} lỗi cần sửa trước khi nhập.`); };
  const copyPrompt = async () => { const value = prompt || buildExternalAiPrompt(options); setPrompt(value); await navigator.clipboard?.writeText(value); toast.success("Đã sao chép prompt."); };
  const inspectHistory = (item: ProfileState["aiImportHistory"][number]) => { setTitle(item.title); setPrompt(item.prompt); setRawData(item.rawData); setValidated(null); toast.success("Đã nạp lại dữ liệu nhập để xem hoặc tạo lại."); };
  const copyHistoryPrompt = async (item: ProfileState["aiImportHistory"][number]) => { await navigator.clipboard?.writeText(item.prompt); toast.success("Đã sao chép prompt từ lịch sử."); };
  const deleteHistory = (id: string) => { onProfile({ ...profile, aiImportHistory: profile.aiImportHistory.filter((item) => item.id !== id) }, "Đã xóa bản ghi nhập AI."); };
  const createLearningContent = () => {
    const result = validated ?? validateExternalAiData(rawData);
    setValidated(result);
    if (!result.valid || !result.questions.length) return toast.error(result.errors.join(" ") || "Chưa có dữ liệu để tạo nội dung.");
    const now = new Date().toISOString();
    const shouldCards = target === "flashcards" || target === "both" || target === "practice";
    const shouldQuiz = target === "quiz" || target === "both" || target === "practice";
    const set = shouldCards ? convertImportToFlashcards(result, { title, subject, topic }) : undefined;
    const quiz = shouldQuiz ? convertImportToQuiz(result, { title, subject, topic }) : undefined;
    const record = { id: uid(), title, createdAt: now, target, questionCount: quiz?.questions.length ?? 0, flashcardCount: set?.cards.length ?? 0, prompt, rawData, quizId: quiz?.id, flashcardSetId: set?.id };
    onProfile({ ...profile, flashcardSets: set ? [set, ...profile.flashcardSets] : profile.flashcardSets, quizzes: quiz ? [quiz, ...profile.quizzes] : profile.quizzes, aiImportHistory: [record, ...profile.aiImportHistory].slice(0, 50) }, `Đã tạo ${record.flashcardCount} Flashcard và ${record.questionCount} câu hỏi.`);
    onView(set ? "flashcards" : "quizzes");
  };
  return (
    <div className="space-y-6">
      <section className="panel p-6 sm:p-8">
        <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200"><Sparkles className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700 dark:text-amber-300">AI Data Import</p><h1 className="mt-2 font-display text-3xl font-bold">AI ngoài đọc tài liệu · Study Historia biến thành bài học</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Website chỉ sinh prompt, tiếp nhận dữ liệu chuẩn do AI bên ngoài trả về, kiểm tra và chuyển thành nội dung học. Tài liệu không được tự động gửi sang AI ngoài từ màn hình này.</p></div></div>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel p-6">
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">1. Chuẩn bị prompt</h2><button className="secondary-button" onClick={makePrompt}><WandSparkles className="h-4 w-4" />Tạo prompt</button></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Mục tiêu<select aria-label="Mục tiêu nhập AI" value={target} onChange={(e) => setTarget(e.target.value as ImportTarget)} className="select mt-2 w-full"><option value="quiz">Đề kiểm tra</option><option value="flashcards">Flashcard</option><option value="both">Đề + Flashcard</option><option value="practice">Bộ câu hỏi ôn tập</option></select></label>
            <label className="text-sm font-bold">Loại câu<select aria-label="Loại câu AI" value={questionType} onChange={(e) => setQuestionType(e.target.value as ImportQuestionType)} className="select mt-2 w-full"><option value="mixed">Kết hợp</option><option value="multiple">Trắc nghiệm</option><option value="boolean">Đúng/Sai</option><option value="short">Trả lời ngắn</option></select></label>
            <label className="text-sm font-bold">Số lượng<select aria-label="Số lượng câu AI" value={String(quantity)} onChange={(e) => setQuantity(parseQuantity(e.target.value))} className="select mt-2 w-full"><option value="auto">Tự động</option><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="custom">Tùy chỉnh</option></select></label>
            {quantity === "custom" && <label className="text-sm font-bold">Số tùy chỉnh<input aria-label="Số lượng tùy chỉnh" type="number" min={1} max={200} value={customQuantity} onChange={(e) => setCustomQuantity(Number(e.target.value))} className="input mt-2 w-full" /></label>}
            <label className="text-sm font-bold">Tên tài liệu<input aria-label="Tên tài liệu" value={title} onChange={(e) => setTitle(e.target.value)} className="input mt-2 w-full" /></label>
            <label className="text-sm font-bold">Môn học<input aria-label="Môn học AI" value={subject} onChange={(e) => setSubject(e.target.value)} className="input mt-2 w-full" /></label>
            <label className="text-sm font-bold sm:col-span-2">Chủ đề<input aria-label="Chủ đề AI" value={topic} onChange={(e) => setTopic(e.target.value)} className="input mt-2 w-full" /></label>
          </div>
          <label className="mt-4 block text-sm font-bold">Yêu cầu bổ sung<textarea aria-label="Yêu cầu bổ sung cho AI" value={extraRequest} onChange={(e) => setExtraRequest(e.target.value)} className="textarea mt-2 w-full" rows={3} placeholder="Giữ nguyên đáp án, cảnh báo mâu thuẫn nguồn…" /></label>
          {prompt && <div className="mt-4"><textarea aria-label="Prompt AI có thể chỉnh sửa" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="textarea w-full font-mono text-xs" rows={10} /><div className="mt-3 flex flex-wrap gap-2"><button className="secondary-button" onClick={copyPrompt}><Clipboard className="h-4 w-4" />Sao chép prompt</button><button className="secondary-button" onClick={makePrompt}><RefreshCw className="h-4 w-4" />Tạo lại</button></div></div>}
        </section>
        <section className="panel p-6">
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">2. Dán dữ liệu AI chuẩn</h2><span className="text-xs font-bold text-slate-500">JSON hoặc [QUESTION]</span></div>
          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4 text-sm font-bold dark:border-amber-500/30 dark:bg-amber-400/5"><FileUp className="h-5 w-5 text-amber-700" />{documentName || "Chọn tên tài liệu (không tải tự động sang AI)"}<input className="sr-only" type="file" accept=".json,.txt,.md" onChange={(e) => setDocumentName(e.target.files?.[0]?.name ?? "")} /></label>
          <textarea aria-label="Dán dữ liệu AI" value={rawData} onChange={(e) => { setRawData(e.target.value); setValidated(null); }} className="textarea mt-4 min-h-72 w-full font-mono text-xs" placeholder="Dán JSON questions hoặc các khối [QUESTION]...[/QUESTION] do AI trả về" />
          <div className="mt-4 flex flex-wrap gap-2"><button className="primary-button" onClick={validate}><CheckCircle2 className="h-4 w-4" />Kiểm tra dữ liệu</button><button className="secondary-button" onClick={createLearningContent}><WandSparkles className="h-4 w-4" />Tạo nội dung học</button></div>
          {validated && <div className="mt-5 space-y-3" aria-live="polite"><p className="text-sm font-bold">Preview: {validated.questions.length} câu · {validated.questions.filter((q) => q.type === "multiple").length} trắc nghiệm · {validated.questions.filter((q) => q.type === "boolean").length} đúng/sai · {validated.questions.filter((q) => q.type === "short").length} trả lời ngắn</p>{validated.errors.map((error) => <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-400/10 dark:text-red-200" key={error}><AlertTriangle className="mr-2 inline h-4 w-4" />{error}</p>)}{validated.warnings.map((warning) => <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-400/10 dark:text-amber-200" key={warning}><AlertTriangle className="mr-2 inline h-4 w-4" />{warning}</p>)}</div>}
        </section>
      </div>
      <section className="panel p-6"><h2 className="flex items-center gap-2 font-display text-2xl font-bold"><History className="h-5 w-5 text-amber-700" />Lịch sử nhập AI</h2>{profile.aiImportHistory.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{profile.aiImportHistory.map((item) => <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10" key={item.id}><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("vi-VN")} · {item.flashcardCount} thẻ · {item.questionCount} câu</p><div className="mt-3 flex flex-wrap gap-2"><button className="secondary-button" onClick={() => inspectHistory(item)}><Eye className="h-4 w-4" />Xem/nạp lại</button><button className="secondary-button" onClick={() => copyHistoryPrompt(item)}><Clipboard className="h-4 w-4" />Sao chép prompt</button><button className="secondary-button" onClick={() => deleteHistory(item.id)}><Trash2 className="h-4 w-4" />Xóa</button></div></div>)}</div> : <p className="mt-3 text-sm text-slate-500">Chưa có lần nhập nào. Lịch sử chỉ thuộc tài khoản hiện tại.</p>}</section>
    </div>
  );
}
