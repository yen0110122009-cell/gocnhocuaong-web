import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Flag, BrainCircuit, FileText, Target, Pause, Play, RotateCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { applyStudyActivityRewards, type AppConfig, type FlashcardSet, type PaperQuizSession, type ProfileState, type Quiz, type QuizQuestion } from "../../../shared/study";
import { buildWrongAnswerDeepPrompt, parseWrongAnswerDeepData } from "../../../shared/aiDataImport";
import type { WrongAnswerReview } from "../../../shared/study";
import { buildQuizAttempt } from "../../../shared/quizPersistence";
import { cn } from "@/lib/utils";

type QuizMode = "quick" | "deep" | "paper";

type Props = { profile: ProfileState; config: AppConfig; onProfile: (p: ProfileState, message?: string) => void };

export default function QuizEnhanced({ profile, config, onProfile }: Props) {
  const [mode, setMode] = useState<QuizMode>("quick");
  const [active, setActive] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [thoughts, setThoughts] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [lastAttemptId, setLastAttemptId] = useState("");
  const [deepOpen, setDeepOpen] = useState<Record<string, boolean>>({});
  const [paper, setPaper] = useState<PaperQuizSession | null>(null);
  const [paperResults, setPaperResults] = useState<Record<string, "correct" | "wrong" | "unsure" | "blank">>({});
  const [paperNotes, setPaperNotes] = useState("");
  const [quizQuery, setQuizQuery] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("all");
  const [paperGoal, setPaperGoal] = useState("");
  const [paperAllowPause, setPaperAllowPause] = useState(true);
  const filteredQuizzes = useMemo(() => profile.quizzes.filter((quiz) => (!quizQuery || `${quiz.title} ${quiz.subject} ${quiz.topic}`.toLowerCase().includes(quizQuery.toLowerCase())) && (quizDifficulty === "all" || quiz.difficulty === quizDifficulty)), [profile.quizzes, quizQuery, quizDifficulty]);

  useEffect(() => {
    if (!active || result !== null || seconds <= 0 || mode === "paper") return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [active, result, seconds, mode]);

  useEffect(() => {
    if (active && seconds === 0 && result === null && mode !== "paper") finishOnline();
  }, [seconds]);

  useEffect(() => {
    if (!paper || paper.status !== "running") return;
    const timer = window.setInterval(() => setPaper((value) => value ? { ...value, elapsedSeconds: value.elapsedSeconds + 1 } : value), 1000);
    return () => window.clearInterval(timer);
  }, [paper?.status]);

  const startOnline = (quiz: Quiz, selectedMode: "quick" | "deep") => {
    setMode(selectedMode); setActive(quiz); setAnswers({}); setThoughts({}); setFlags([]); setIndex(0); setResult(null); setDeepOpen({}); setSeconds(quiz.durationMinutes * 60);
  };

  const startPaper = (quiz: Quiz) => {
    const now = new Date().toISOString();
    setMode("paper"); setActive(quiz); setPaper({ id: crypto.randomUUID(), quizId: quiz.id, title: quiz.title, subject: quiz.subject, questionCount: quiz.questions.length, durationMinutes: quiz.durationMinutes, startedAt: now, elapsedSeconds: 0, goal: paperGoal, status: "running", allowPause: paperAllowPause, certainty: {} });
    setPaperResults({}); setPaperNotes("");
  };

  const finishOnline = () => {
    if (!active || result !== null) return;
    const durationSeconds = active.durationMinutes * 60 - seconds;
    const attempt = buildQuizAttempt({ quiz: active, answers, flagged: flags, durationSeconds, id: crypto.randomUUID() });
    const enriched = { ...attempt, mode, thoughts };
    const xp = 20 + attempt.correct * 8;
    const reward = applyStudyActivityRewards({ ...profile, attempts: [enriched, ...profile.attempts] }, { id: `quiz-${attempt.id}`, occurredAt: attempt.completedAt, kind: "quiz", quantity: attempt.total, durationSeconds, xpEarned: xp, correct: attempt.correct, total: attempt.total }, config);
    setLastAttemptId(attempt.id); setResult(attempt.correct); onProfile(reward.profile, `Đã lưu kết quả · +${xp} XP${reward.newlyUnlocked.length ? ` · Mở khóa ${reward.newlyUnlocked.length} thành tích` : ""}.`);
  };

  const finishPaper = () => {
    if (!paper || !active) return;
    const endedAt = new Date().toISOString();
    const completed: PaperQuizSession = { ...paper, endedAt, status: "completed", results: paperResults, notes: paperNotes };
    const sessions = [completed, ...(profile.paperQuizSessions ?? [])].slice(0, 50);
    onProfile({ ...profile, paperQuizSessions: sessions }, "Đã lưu phiên Tự làm đề–Tập trung. Bạn có thể nhập kết quả và phân tích sau.");
    setPaper(completed);
  };

  const reset = () => { setActive(null); setPaper(null); setResult(null); setLastAttemptId(""); setAnswers({}); setThoughts({}); setFlags([]); };
  const mins = String(Math.floor((paper ? Math.max(0, paper.durationMinutes * 60 - paper.elapsedSeconds) : seconds) / 60)).padStart(2, "0");
  const secs = String((paper ? Math.max(0, paper.durationMinutes * 60 - paper.elapsedSeconds) : seconds) % 60).padStart(2, "0");

  if (!profile.quizzes.length && !active) return <Empty />;
  if (!active) return <>
    <Heading title="Làm đề — chọn đúng cách học" text="Ba chế độ độc lập: làm nhanh trên web, hiểu tận gốc từng câu hoặc dùng website như đồng hồ khi làm đề giấy." />
    <ModePicker mode={mode} setMode={setMode} />
    <div className="panel mb-5 grid gap-3 p-4 sm:grid-cols-3"><input aria-label="Tìm đề kiểm tra" value={quizQuery} onChange={(e) => setQuizQuery(e.target.value)} placeholder="Tìm theo tên, môn, chủ đề" className="input mt-0 sm:col-span-2" /><select aria-label="Lọc độ khó đề kiểm tra" value={quizDifficulty} onChange={(e) => setQuizDifficulty(e.target.value)} className="input mt-0"><option value="all">Mọi độ khó</option><option>Cơ bản</option><option>Trung bình</option><option>Nâng cao</option></select></div>
    {mode === "paper" && <section className="panel mb-5 grid gap-4 p-5 sm:grid-cols-3"><label className="text-sm font-bold">Mục tiêu điểm<input value={paperGoal} onChange={(e) => setPaperGoal(e.target.value)} className="input mt-2" placeholder="Ví dụ: 8/10" /></label><label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={paperAllowPause} onChange={(e) => setPaperAllowPause(e.target.checked)} />Cho phép tạm dừng</label><p className="text-sm leading-6 text-slate-500">Website không hiển thị câu hỏi. Ong làm bài bằng giấy, còn website giữ timer, trạng thái tập trung và lịch sử phiên.</p></section>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredQuizzes.map((q) => <article className="panel p-5" key={q.id}><Clock3 className="h-6 w-6 text-amber-700" /><p className="mt-5 text-xs font-bold uppercase tracking-widest text-amber-700">{q.subject} · {q.difficulty}</p><h2 className="mt-2 font-display text-xl font-bold">{q.title}</h2><p className="mt-3 text-xs text-slate-500">{q.questions.length} câu · {q.durationMinutes} phút</p><div className="mt-5 grid gap-2">{mode === "paper" ? <button aria-label={`Bắt đầu làm đề giấy ${q.title}`} onClick={() => startPaper(q)} className="primary-button"><FileText className="h-4 w-4" />Tự làm đề–Tập trung</button> : <><button aria-label={`Bắt đầu làm đề nhanh ${q.title}`} onClick={() => startOnline(q, "quick")} className="primary-button"><Target className="h-4 w-4" />Làm đề nhanh</button><button aria-label={`Bắt đầu hiểu tận gốc ${q.title}`} onClick={() => startOnline(q, "deep")} className="secondary-button"><BrainCircuit className="h-4 w-4" />Hiểu tận gốc</button></>}</div></article>)}</div>
    <HistoryList profile={profile} config={config} />
  </>;

  if (mode === "paper" && paper) return <PaperFocus paper={paper} active={active} mins={mins} secs={secs} results={paperResults} setResults={setPaperResults} notes={paperNotes} setNotes={setPaperNotes} onPause={() => paper.allowPause && setPaper({ ...paper, status: paper.status === "paused" ? "running" : "paused" })} onFinish={finishPaper} onReset={reset} />;
  if (result !== null && active) return <ResultView active={active} result={result} answers={answers} mode={mode} attemptId={lastAttemptId} profile={profile} onProfile={onProfile} deepOpen={deepOpen} setDeepOpen={setDeepOpen} onReset={reset} />;
  const question = active.questions[index];
  return <><Heading title={active.title} text={`${mode === "deep" ? "Hiểu tận gốc · " : "Làm đề nhanh · "}${active.questions.length} câu · đồng hồ sẽ tự nộp bài khi hết thời gian.`} /><div className="grid gap-5 xl:grid-cols-[1fr_260px]"><section className="panel p-6"><div className="flex items-center justify-between"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">Câu {index + 1}/{active.questions.length}</span><span className={cn("flex items-center gap-2 font-mono text-lg font-bold", seconds < 60 && "text-rose-600")}><Clock3 className="h-4 w-4" />{mins}:{secs}</span></div><h2 className="mt-10 font-display text-2xl font-bold leading-relaxed">{question.prompt}</h2><Answer question={question} value={answers[question.id] ?? ""} set={(value) => setAnswers({ ...answers, [question.id]: value })} /><label className="mt-6 block text-sm font-bold">Cách tôi suy nghĩ <textarea aria-label={`Cách tôi suy nghĩ câu ${index + 1}`} value={thoughts[question.id] ?? ""} onChange={(e) => setThoughts({ ...thoughts, [question.id]: e.target.value })} rows={3} className="textarea mt-2" placeholder="Tôi chọn đáp án này vì…" /></label><div className="mt-8 flex justify-between"><button aria-label="Câu trước" onClick={() => setIndex(Math.max(0, index - 1))} className="secondary-button"><ChevronLeft className="h-4 w-4" />Trước</button>{index === active.questions.length - 1 ? <button aria-label="Nộp bài kiểm tra" onClick={finishOnline} className="primary-button"><CheckCircle2 className="h-4 w-4" />Nộp bài</button> : <button aria-label="Câu tiếp theo" onClick={() => setIndex(index + 1)} className="primary-button">Tiếp<ChevronRight className="h-4 w-4" /></button>}</div></section><aside className="panel p-4"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Điều hướng</p><div className="mt-4 grid grid-cols-5 gap-2">{active.questions.map((q, i) => <button aria-label={`Chuyển đến câu ${i + 1}${flags.includes(q.id) ? ", đã đánh dấu" : ""}`} aria-current={i === index ? "step" : undefined} onClick={() => setIndex(i)} className={cn("relative grid h-9 place-items-center rounded-lg text-sm font-bold", i === index ? "bg-amber-600 text-white" : answers[q.id] ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-500 dark:bg-white/5")} key={q.id}>{i + 1}{flags.includes(q.id) && <Flag className="absolute -right-1 -top-1 h-3 w-3 text-amber-500" />}</button>)}</div><button aria-pressed={flags.includes(question.id)} aria-label={flags.includes(question.id) ? "Bỏ đánh dấu câu hiện tại" : "Đánh dấu câu hiện tại"} onClick={() => setFlags(flags.includes(question.id) ? flags.filter((id) => id !== question.id) : [...flags, question.id])} className={cn("mt-5 inline-flex items-center gap-2 text-xs font-bold", flags.includes(question.id) ? "text-amber-600" : "text-slate-500")}><Flag className="h-4 w-4" />{flags.includes(question.id) ? "Bỏ đánh dấu" : "Đánh dấu câu"}</button></aside></div></>;
}

function ModePicker({ mode, setMode }: { mode: QuizMode; setMode: (mode: QuizMode) => void }) { const items: Array<[QuizMode, string, string, typeof Target]> = [["quick", "Làm đề nhanh", "Trả lời, chấm điểm và xem thống kê ngay.", Target], ["deep", "Hiểu tận gốc", "Mỗi câu có suy nghĩ, giải thích sâu và đào bản chất.", BrainCircuit], ["paper", "Tự làm đề–Tập trung", "Làm bằng giấy; web chỉ giữ timer và lịch sử.", FileText]]; return <div className="mb-6 grid gap-3 md:grid-cols-3">{items.map(([value, title, text, Icon]) => <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)} className={cn("study-card p-4 text-left transition", mode === value && "border-amber-400 bg-amber-50/70 dark:bg-amber-400/10")}><Icon className="h-5 w-5 text-amber-700" /><b className="mt-3 block">{title}</b><span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span></button>)}</div>; }

function PaperFocus({ paper, active, mins, secs, results, setResults, notes, setNotes, onPause, onFinish, onReset }: { paper: PaperQuizSession; active: Quiz; mins: string; secs: string; results: Record<string, "correct" | "wrong" | "unsure" | "blank">; setResults: (value: Record<string, "correct" | "wrong" | "unsure" | "blank">) => void; notes: string; setNotes: (value: string) => void; onPause: () => void; onFinish: () => void; onReset: () => void }) { const finished = paper.status === "completed"; return <section className="mx-auto max-w-3xl space-y-5"><div className="panel p-8 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">Tự làm đề–Tập trung</p><h1 className="mt-3 font-display text-3xl font-bold">{paper.title}</h1><p className="mt-2 text-sm text-slate-500">{paper.subject} · {paper.questionCount} câu · mục tiêu {paper.goal || "tùy chọn"}</p><div className="my-8 font-mono text-6xl font-bold tracking-tight text-slate-950 dark:text-white">{mins}:{secs}</div><p className="text-sm text-slate-500">{finished ? "Phiên đã dừng. Nhập kết quả bên dưới nếu muốn." : paper.status === "paused" ? "Đang tạm dừng" : "Đang làm bài trên giấy — website không hiển thị câu hỏi."}</p><div className="mt-6 flex justify-center gap-3">{!finished && <button className="secondary-button" onClick={onPause} disabled={!paper.allowPause}>{paper.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paper.status === "paused" ? "Tiếp tục" : "Tạm dừng"}</button>}{!finished && <button className="primary-button" onClick={onFinish}><CheckCircle2 className="h-4 w-4" />Tôi đã làm xong</button>}<button className="secondary-button" onClick={onReset}><RotateCcw className="h-4 w-4" />Thoát</button></div></div>{finished && <div className="panel p-6"><h2 className="font-display text-2xl font-bold">Nhập kết quả sau phiên giấy</h2><p className="mt-2 text-sm text-slate-500">Đánh dấu từng câu để tạo bản đồ lỗi. Câu đúng nhưng không chắc vẫn được đưa vào danh sách củng cố.</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{active.questions.map((question, index) => <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm dark:border-white/10" key={question.id}><span>Câu {index + 1}</span><select aria-label={`Kết quả câu ${index + 1}`} value={results[question.id] ?? "blank"} onChange={(e) => setResults({ ...results, [question.id]: e.target.value as "correct" | "wrong" | "unsure" | "blank" })} className="input mt-0 w-auto"><option value="correct">Đúng · chắc chắn</option><option value="unsure">Đúng · không chắc</option><option value="wrong">Sai</option><option value="blank">Bỏ trống</option></select></label>)}</div><label className="mt-5 block text-sm font-bold">Ghi chú sau phiên<textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="textarea mt-2" rows={4} placeholder="Tôi đã vướng ở…" /></label><button className="primary-button mt-5" onClick={() => toast.success("Đã ghi nhận kết quả và bản đồ lỗi của phiên giấy.")}><Target className="h-4 w-4" />Lưu bản đồ lỗi</button></div>}</section>; }

function ResultView({ active, result, answers, mode, attemptId, profile, onProfile, deepOpen, setDeepOpen, onReset }: { active: Quiz; result: number; answers: Record<string, string>; mode: QuizMode; attemptId: string; profile: ProfileState; onProfile: (profile: ProfileState, message?: string) => void; deepOpen: Record<string, boolean>; setDeepOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; onReset: () => void }) {
  const wrongQuestions = active.questions.filter((question) => answers[question.id]?.trim().toLowerCase() !== question.answer.trim().toLowerCase());
  const [reviewJson, setReviewJson] = useState("");
  const savedReviews = profile.wrongAnswerReviews.filter((review) => review.attemptId === attemptId);
  const saveWrongReviews = () => {
    const parsed = parseWrongAnswerDeepData(reviewJson);
    const valid = parsed.filter((item) => wrongQuestions.some((question) => question.id === item.questionId));
    if (!valid.length) { toast.error("Chưa tìm thấy JSON giải thích hợp lệ cho các câu sai của attempt này."); return; }
    const createdAt = new Date().toISOString();
    const reviews: WrongAnswerReview[] = valid.map((item) => { const question = wrongQuestions.find((candidate) => candidate.id === item.questionId)!; return { ...item, id: crypto.randomUUID(), attemptId, questionId: question.id, question: question.prompt, learnerAnswer: answers[question.id] ?? "", correctAnswer: question.answer, createdAt }; });
    onProfile({ ...profile, wrongAnswerReviews: [...reviews, ...profile.wrongAnswerReviews.filter((review) => !(review.attemptId === attemptId && valid.some((item) => item.questionId === review.questionId)))] }, `Đã lưu ${reviews.length} giải thích sâu từ câu sai.`);
    setReviewJson("");
  };
  const createFlashcardsFromReviews = () => {
    if (!savedReviews.length) { toast.error("Hãy lưu giải thích sâu trước khi tạo Flashcard."); return; }
    const cards = savedReviews.map((review) => ({ id: crypto.randomUUID(), front: review.question, back: `Đáp án đúng: ${review.correctAnswer}\n\nVì sao tôi sai: ${review.whyWrong}\n\nKhoảng trống kiến thức: ${review.knowledgeGap}\n\nCách nghĩ đúng: ${review.correctThinking.join(" · ")}\n\nLỗi thường gặp: ${review.commonMistake}`, status: "new" as const, starred: true }));
    const set: FlashcardSet = { id: crypto.randomUUID(), title: `Ôn lại câu sai · ${active.title}`, subject: active.subject, topic: active.topic, difficulty: "Trung bình", createdAt: new Date().toISOString(), studyCount: 0, cards };
    onProfile({ ...profile, flashcardSets: [set, ...profile.flashcardSets] }, `Đã tạo ${cards.length} Flashcard từ giải thích sâu câu sai.`);
  };
  const copyWrongPrompt = async () => {
    const prompt = buildWrongAnswerDeepPrompt(wrongQuestions.map((question) => ({ questionId: question.id, question: question.prompt, answer: question.answer, userAnswer: answers[question.id], explanation: question.explanation })), { subject: active.subject, topic: active.topic });
    try { await navigator.clipboard.writeText(prompt); toast.success(`Đã sao chép prompt giải thích ${wrongQuestions.length} câu sai cho AI bên ngoài.`); } catch { toast.error("Không thể sao chép tự động. Hãy kiểm tra quyền clipboard của trình duyệt."); }
  };
  return <><Heading title={`${Math.round(result / active.questions.length * 100)}% chính xác`} text={`Bạn trả lời đúng ${result}/${active.questions.length} câu. ${mode === "deep" ? "Mở Hiểu tận gốc ở từng câu để học từ lỗi và đào sâu bản chất." : "Kết quả đã được lưu vào lịch sử học tập."}`} /><div className="mb-5 flex flex-wrap gap-3">{wrongQuestions.length > 0 && <button aria-label="Tạo prompt AI từ các câu sai" onClick={copyWrongPrompt} className="secondary-button"><BrainCircuit className="h-4 w-4" />Tạo giải thích sâu từ {wrongQuestions.length} câu sai</button>}<button aria-label="Làm lại đề" onClick={onReset} className="secondary-button"><RotateCcw className="h-4 w-4" />Làm lại hoặc chọn đề khác</button></div>{wrongQuestions.length > 0 && <section className="panel mb-5 p-5" aria-labelledby="wrong-answer-ai-title"><h2 id="wrong-answer-ai-title" className="font-display text-xl font-bold">Giải thích sâu từ câu sai</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sao chép prompt sang AI bên ngoài, dán JSON trả về vào đây rồi lưu. Chỉ các questionId thuộc attempt này mới được nhận.</p><textarea aria-label="JSON giải thích sâu từ AI" value={reviewJson} onChange={(event) => setReviewJson(event.target.value)} rows={6} className="textarea mt-4 font-mono text-xs" placeholder='{"reviews":[{"questionId":"...","whyWrong":"..."}]}' /><button className="primary-button mt-3" onClick={saveWrongReviews}><CheckCircle2 className="h-4 w-4" />Lưu giải thích AI</button>{savedReviews.length > 0 && <><p className="mt-3 text-xs font-semibold text-emerald-700">Đã lưu {savedReviews.length} giải thích cho attempt này.</p><button className="secondary-button mt-3" onClick={createFlashcardsFromReviews}><BookOpen className="h-4 w-4" />Tạo Flashcard từ giải thích sâu</button></>}</section>}<div className="space-y-3">{active.questions.map((q, i) => { const correct = answers[q.id]?.trim().toLowerCase() === q.answer.trim().toLowerCase(); const open = deepOpen[q.id]; return <article className={cn("panel p-4", correct ? "border-emerald-200" : "border-rose-200")} key={q.id}><b>{i + 1}. {q.prompt}</b><p className="mt-2 text-sm text-slate-500">{correct ? "Đúng" : "Chưa chính xác"} · Đáp án: <b>{q.answer}</b>{q.explanation ? ` · ${q.explanation}` : ""}</p>{mode === "deep" && <><button className="secondary-button mt-4" onClick={() => setDeepOpen((value) => ({ ...value, [q.id]: !open }))}><BrainCircuit className="h-4 w-4" />{open ? "Thu gọn" : "Hiểu tận gốc"}</button>{open && <DeepExplanation question={q} />}</>}</article>; })}</div><button aria-label="Quay lại danh sách đề" onClick={onReset} className="secondary-button mt-5">Danh sách đề</button></>; }

function DeepExplanation({ question }: { question: QuizQuestion }) { const deep = question.deepExplanation; if (!deep) return <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">Chưa có dữ liệu Hiểu tận gốc cho câu này. Hãy bổ sung qua AI Data Import; nếu thiếu căn cứ, câu phải được xác minh trước khi dùng.</div>; return <div className="mt-4 space-y-3 rounded-2xl bg-amber-50/70 p-4 text-sm dark:bg-amber-400/10"><p><b>Kiến thức:</b> {deep.knowledge || "Chưa có"}</p><p><b>Dữ kiện:</b> {deep.givenData || "Chưa có"}</p><p><b>Công thức:</b> {deep.formula || "Không sử dụng công thức."}</p>{deep.solutionSteps?.length ? <div><b>Lời giải từng bước:</b><ol className="mt-2 list-decimal space-y-1 pl-5">{deep.solutionSteps.map((step) => <li key={step}>{step}</li>)}</ol></div> : null}<p><b>Vì sao:</b> {deep.whyThisMethod || "Chưa có"}</p>{deep.commonMistakes?.length ? <p><b>Lỗi thường gặp:</b> {deep.commonMistakes.join(" · ")}</p> : null}<p><b>Cách khác:</b> {deep.alternativeSolution || "Không có phương pháp thay thế đáng tin cậy."}</p>{deep.deepQuestions?.length ? <div><b>Câu hỏi đào sâu:</b>{deep.deepQuestions.map((item) => <p className="mt-2" key={item.question}>{item.question}{item.answer ? ` — ${item.answer}` : ""}</p>)}</div> : null}{deep.needsVerification && <p className="font-bold text-rose-700">Cần xác minh nguồn trước khi coi là kiến thức chắc chắn.</p>}</div>; }

function HistoryList({ profile, config }: { profile: ProfileState; config: AppConfig }) { return profile.attempts.length > 0 ? <section className="panel mt-6 p-5" aria-labelledby="quiz-history-title"><h2 id="quiz-history-title" className="font-display text-xl font-bold">Lịch sử làm bài</h2><div className="mt-4 space-y-3">{profile.attempts.slice(0, 10).map((attempt) => <details className="rounded-xl border border-slate-200 p-3 dark:border-white/10" key={attempt.id}><summary className="cursor-pointer text-sm font-bold">{profile.quizzes.find((quiz) => quiz.id === attempt.quizId)?.title ?? "Đề đã đồng bộ"} · {attempt.accuracy}% · {new Date(attempt.completedAt).toLocaleString("vi-VN")}</summary><p className="mt-2 text-xs text-slate-500">Chế độ {attempt.mode === "deep" ? "Hiểu tận gốc" : attempt.mode === "paper" ? "Đề giấy" : "Làm đề nhanh"} · Đúng {attempt.correct}/{attempt.total} · {attempt.durationSeconds} giây</p>{config.encouragements.find((entry) => entry.enabled && entry.type === (attempt.accuracy >= 70 ? "correct" : "incorrect")) && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">{config.encouragements.find((entry) => entry.enabled && entry.type === (attempt.accuracy >= 70 ? "correct" : "incorrect"))?.text}</p>}</details>)}</div></section> : null; }

function Answer({ question, value, set }: { question: QuizQuestion; value: string; set: (value: string) => void }) { if (question.type === "short") return <textarea aria-label="Câu trả lời ngắn" value={value} onChange={(e) => set(e.target.value)} rows={4} className="textarea mt-6" placeholder="Nhập câu trả lời…" />; const options = question.type === "boolean" ? ["Đúng", "Sai"] : question.options ?? []; return <div className="mt-6 grid gap-3">{options.map((option) => <button aria-pressed={value === option} aria-label={`Chọn đáp án ${option}`} onClick={() => set(option)} className={cn("rounded-xl border p-4 text-left text-sm font-bold", value === option ? "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100" : "border-slate-200 dark:border-white/10")} key={option}>{option}</button>)}</div>; }
function Heading({ title, text }: { title: string; text: string }) { return <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700 dark:text-amber-300">Đề kiểm tra</p><h1 className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>; }
function Empty() { return <><Heading title="Tự đánh giá sau mỗi chặng học" text="Tạo đề trong AI Studio, sau đó quay lại để luyện tập và nhận XP." /><div className="panel grid min-h-52 place-items-center p-8 text-center"><p className="text-sm text-slate-500">Chưa có đề kiểm tra cho tài khoản này.</p></div></>; }
