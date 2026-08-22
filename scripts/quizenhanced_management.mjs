import { readFileSync, writeFileSync } from "node:fs";
const path = "client/src/pages/QuizEnhanced.tsx";
let s = readFileSync(path, "utf8");
const marker = "  if (!profile.quizzes.length && !active) return <Empty />;";
const handlers = `  const editQuiz = (quiz: Quiz) => { const title = window.prompt("Tên đề", quiz.title)?.trim(); if (!title) return; const subject = window.prompt("Môn học", quiz.subject)?.trim() || quiz.subject; const topic = window.prompt("Chủ đề", quiz.topic)?.trim() || quiz.topic; const duration = window.prompt("Thời gian làm (phút)", String(quiz.durationMinutes)); const nextDuration = duration === null ? quiz.durationMinutes : Math.max(1, Number(duration) || 1); const rawQuestions = window.prompt("Nội dung câu hỏi JSON (prompt/type/answer/options), để trống để giữ nguyên", JSON.stringify(quiz.questions)); let questions = quiz.questions; if (rawQuestions !== null && rawQuestions.trim()) { try { const parsed = JSON.parse(rawQuestions); if (!Array.isArray(parsed) || !parsed.length || parsed.some((item) => !item.prompt?.trim() || !item.answer?.trim())) throw new Error(); questions = parsed.map((item, index) => ({ ...quiz.questions[index], ...item, id: quiz.questions[index]?.id ?? crypto.randomUUID() })); } catch { toast.error("Nội dung câu hỏi JSON chưa đúng. Đề chưa được lưu."); return; } } onProfile({ ...profile, quizzes: profile.quizzes.map((item) => item.id === quiz.id ? { ...item, title, subject, topic, durationMinutes: nextDuration, questions } : item) }, "Đã cập nhật đề kiểm tra."); };\n  const deleteQuiz = (quiz: Quiz) => { if (!window.confirm(\`Xóa đề “\${quiz.title}”?\`)) return; onProfile({ ...profile, quizzes: profile.quizzes.filter((item) => item.id !== quiz.id) }, "Đã xóa đề kiểm tra."); };\n`;
if (!s.includes("const editQuiz = (quiz: Quiz)")) s = s.replace(marker, handlers + marker);
const cardNeedle = `</p><div className="mt-5 grid gap-2">`;
const cardControls = `</p><div className="mt-5 grid gap-2">`;
// Add management row immediately before the article closes for the list card.
const listStart = s.indexOf("{filteredQuizzes.map");
const articleEnd = s.indexOf("</article>", listStart);
if (listStart >= 0 && articleEnd >= 0 && !s.slice(listStart, articleEnd).includes("aria-label={\`Chỉnh sửa đề")) {
  const controls = `<div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-white/10"><button aria-label={\`Chỉnh sửa đề \${q.title}\`} className="secondary-button !px-3 !py-2 text-xs" onClick={() => editQuiz(q)}><Pencil className="h-3.5 w-3.5" />Chỉnh sửa</button><button aria-label={\`Xóa đề \${q.title}\`} className="secondary-button !px-3 !py-2 text-xs text-rose-700" onClick={() => deleteQuiz(q)}><Trash2 className="h-3.5 w-3.5" />Xóa</button></div>`;
  s = s.slice(0, articleEnd) + controls + s.slice(articleEnd);
}
writeFileSync(path, s);
console.log("quiz management added");
