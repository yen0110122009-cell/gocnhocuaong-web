import type { Flashcard, FlashcardSet, Quiz, QuizQuestion } from "./study";

export type ImportTarget = "quiz" | "flashcards" | "both" | "practice";
export type ImportQuestionType = "multiple" | "boolean" | "short" | "mixed";

export type AiImportOptions = {
  target: ImportTarget;
  questionType: ImportQuestionType;
  quantity: "auto" | 10 | 20 | 30 | "custom";
  customQuantity?: number;
  title?: string;
  subject?: string;
  topic?: string;
  extraRequest?: string;
};

export type DeepImportExplanation = {
  knowledge?: string;
  formula?: string;
  givenData?: string;
  solutionSteps?: string[];
  whyThisMethod?: string;
  commonMistakes?: string[];
  alternativeSolution?: string;
  deepQuestions?: Array<{ question: string; answer?: string; explanation?: string }>;
  variationExplanation?: string;
  needsVerification?: boolean;
};

export type NormalizedImportQuestion = {
  id: string;
  type: Exclude<ImportQuestionType, "mixed">;
  prompt: string;
  options?: string[];
  answer: string;
  explanation?: string;
  source?: string;
  deepExplanation?: DeepImportExplanation;
};

export type ImportValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  questions: NormalizedImportQuestion[];
};

const clean = (value: unknown) => String(value ?? "").trim();
const normalizeType = (value: unknown): NormalizedImportQuestion["type"] | null => {
  const type = clean(value).toLowerCase().replace(/[-\s]/g, "_");
  if (["multiple", "multiple_choice", "mcq", "trắc_nghiệm"].includes(type)) return "multiple";
  if (["boolean", "true_false", "đúng_sai"].includes(type)) return "boolean";
  if (["short", "short_answer", "trả_lời_ngắn"].includes(type)) return "short";
  return null;
};

export function buildExternalAiPrompt(options: AiImportOptions): string {
  const quantity = options.quantity === "custom" ? Math.max(1, Math.min(200, options.customQuantity ?? 10)) : options.quantity === "auto" ? "tự động" : options.quantity;
  const target = { quiz: "đề kiểm tra", flashcards: "Flashcard", both: "đề kiểm tra và Flashcard", practice: "bộ câu hỏi ôn tập" }[options.target];
  const type = options.questionType === "mixed" ? "kết hợp trắc nghiệm, đúng/sai và trả lời ngắn" : { multiple: "trắc nghiệm", boolean: "đúng/sai", short: "trả lời ngắn" }[options.questionType];
  return [
    "Bạn là AI phân tích tài liệu. Hãy đọc toàn bộ tài liệu được cung cấp và chỉ sử dụng thông tin có trong tài liệu.",
    "Xác định nội dung kiến thức, câu hỏi, đáp án, giải thích và nguồn. Nếu tài liệu có đáp án sẵn, đối chiếu từng câu với đáp án tương ứng, giữ nguyên đáp án, không tự ý sửa; nếu có mâu thuẫn, thêm cảnh báo.",
    "Mỗi câu bắt buộc có explanation và deepExplanation gồm knowledge, formula (hoặc Không sử dụng công thức.), givenData, solutionSteps theo từng bước, whyThisMethod, commonMistakes, alternativeSolution, deepQuestions có đáp án/giải thích, variationExplanation và needsVerification.",
    "Nếu tài liệu không đủ căn cứ để xác định đáp án hoặc lời giải, đặt needsVerification=true và ghi rõ cần xác minh; tuyệt đối không tự bịa.",
    "Không tự tạo thêm thông tin ngoài tài liệu nếu không được yêu cầu. Sau khi phân tích, hãy xuất dữ liệu theo JSON hợp lệ mà website có thể kiểm tra.",
    `Mục tiêu: ${target}. Loại câu: ${type}. Số lượng: ${quantity}.`,
    `Chủ đề: ${clean(options.topic) || "theo tài liệu"}. Môn: ${clean(options.subject) || "theo tài liệu"}.`,
    clean(options.title) ? `Tên nguồn/tài liệu: ${clean(options.title)}.` : "",
    clean(options.extraRequest) ? `Yêu cầu bổ sung: ${clean(options.extraRequest)}.` : "",
    "Schema bắt buộc: {\"questions\":[{\"type\":\"multiple|boolean|short\",\"question\":\"...\",\"options\":[\"...\"],\"answer\":\"...\",\"explanation\":\"...\",\"source\":\"...\",\"deepExplanation\":{\"knowledge\":\"...\",\"formula\":\"...\",\"givenData\":\"...\",\"solutionSteps\":[\"Bước 1...\"],\"whyThisMethod\":\"...\",\"commonMistakes\":[\"...\"],\"alternativeSolution\":\"...\",\"deepQuestions\":[{\"question\":\"...\",\"answer\":\"...\",\"explanation\":\"...\"}],\"variationExplanation\":\"...\",\"needsVerification\":false}}]}. Với multiple phải có options và answer khớp một lựa chọn; boolean dùng answer Đúng hoặc Sai; short dùng answer ngắn gọn.",
    "Chỉ trả về JSON, không bọc bằng Markdown và không thêm lời bình ngoài JSON.",
  ].filter(Boolean).join("\n\n");
}

export type WrongAnswerDeepResult = {
  questionId: string;
  whyWrong: string;
  knowledgeGap: string;
  correctThinking: string[];
  commonMistake: string;
  retryQuestion: string;
  retryAnswer: string;
  source: string;
  needsVerification: boolean;
};

export type WrongAnswerReviewInput = {
  questionId: string;
  question: string;
  answer: string;
  userAnswer?: string;
  explanation?: string;
  source?: string;
};

export function buildWrongAnswerDeepPrompt(items: WrongAnswerReviewInput[], context?: { subject?: string; topic?: string }): string {
  const payload = items.map((item) => ({
    questionId: item.questionId,
    question: item.question,
    correctAnswer: item.answer,
    learnerAnswer: item.userAnswer ?? "Không có đáp án",
    existingExplanation: item.explanation ?? "",
    source: item.source ?? "Chưa cung cấp",
  }));
  return [
    "Bạn là AI hỗ trợ sửa lỗi học tập. Chỉ phân tích các câu sai được cung cấp, không tự thêm câu hỏi và không thay đổi đáp án chuẩn.",
    "Với mỗi questionId, hãy giải thích vì sao đáp án của người học chưa đúng, chỉ ra lỗi suy luận, kiến thức nền còn thiếu, cách suy nghĩ đúng theo từng bước và một câu hỏi biến thể để kiểm tra lại.",
    "Giữ nguyên correctAnswer. Nếu không đủ nguồn hoặc có khả năng tranh luận, đặt needsVerification=true và ghi rõ phần cần xác minh; tuyệt đối không bịa dữ kiện lịch sử.",
    "Chỉ trả về JSON hợp lệ theo schema {\"reviews\":[{\"questionId\":\"...\",\"whyWrong\":\"...\",\"knowledgeGap\":\"...\",\"correctThinking\":[\"...\"],\"commonMistake\":\"...\",\"retryQuestion\":\"...\",\"retryAnswer\":\"...\",\"source\":\"...\",\"needsVerification\":false}]}.",
    `Môn: ${context?.subject?.trim() || "theo câu hỏi"}. Chủ đề: ${context?.topic?.trim() || "theo câu hỏi"}.`,
    JSON.stringify(payload, null, 2),
  ].join("\n\n");
}

export function parseWrongAnswerDeepData(raw: string): WrongAnswerDeepResult[] {
  const parsed = parseJsonCandidate(raw);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as { reviews?: unknown }).reviews : parsed;
  if (!Array.isArray(source)) return [];
  return source.flatMap((value) => {
    if (!value || typeof value !== "object") return [];
    const item = value as Record<string, unknown>;
    const questionId = String(item.questionId ?? "").trim();
    if (!questionId) return [];
    return [{ questionId, whyWrong: String(item.whyWrong ?? ""), knowledgeGap: String(item.knowledgeGap ?? ""), correctThinking: Array.isArray(item.correctThinking) ? item.correctThinking.map(String) : [], commonMistake: String(item.commonMistake ?? ""), retryQuestion: String(item.retryQuestion ?? ""), retryAnswer: String(item.retryAnswer ?? ""), source: String(item.source ?? "Chưa cung cấp"), needsVerification: item.needsVerification === true }];
  });
}

function parseJsonCandidate(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try { return JSON.parse(trimmed); } catch { /* try the first JSON object/array below */ }
  const start = Math.min(...[trimmed.indexOf("{"), trimmed.indexOf("[")].filter((index) => index >= 0));
  if (!Number.isFinite(start)) return null;
  const endObject = trimmed.lastIndexOf("}");
  const endArray = trimmed.lastIndexOf("]");
  const end = Math.max(endObject, endArray);
  if (end < start) return null;
  try { return JSON.parse(trimmed.slice(start, end + 1)); } catch { return null; }
}

function parseQuestionBlocks(raw: string): unknown[] {
  return Array.from(raw.matchAll(/\[QUESTION\]([\s\S]*?)\[\/QUESTION\]/gi)).map((match: RegExpMatchArray) => {
    const block = match[1];
    const get = (key: string) => block.match(new RegExp(`^${key}\\s*:\\s*(.*)$`, "im"))?.[1]?.trim();
    const optionsText = block.match(/^options\s*:\s*([\s\S]*?)(?=^answer\s*:|^explanation\s*:|^source\s*:|$)/im)?.[1] ?? "";
    const options = optionsText.split("\n").map((line: string) => line.replace(/^\s*(?:[A-H][.)]|[-*])\s*/, "").trim()).filter(Boolean);
    return { type: get("type"), question: get("question") ?? get("prompt"), options, answer: get("answer"), explanation: get("explanation"), source: get("source") };
  });
}

export function parseExternalAiData(raw: string): unknown[] {
  const parsed = parseJsonCandidate(raw);
  if (parsed) {
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "object" && parsed !== null && Array.isArray((parsed as { questions?: unknown[] }).questions)) return (parsed as { questions: unknown[] }).questions;
  }
  return parseQuestionBlocks(raw);
}

export function validateExternalAiData(raw: string, maxFlashcards = 27): ImportValidation {
  const source = parseExternalAiData(raw);
  const errors: string[] = [];
  const warnings: string[] = [];
  const questions: NormalizedImportQuestion[] = [];
  if (!source.length) errors.push("Không tìm thấy câu hỏi hợp lệ. Hãy dán JSON hoặc các khối [QUESTION]...[/QUESTION].");
  const seen = new Set<string>();
  source.forEach((candidate, index) => {
    const item = (candidate && typeof candidate === "object" ? candidate : {}) as Record<string, unknown>;
    const label = `Câu ${index + 1}`;
    const prompt = clean(item.question ?? item.prompt);
    const type = normalizeType(item.type);
    const answer = clean(item.answer ?? item.correctAnswer);
    const explanation = clean(item.explanation) || undefined;
    const rawDeep = item.deepExplanation && typeof item.deepExplanation === "object" ? item.deepExplanation as Record<string, unknown> : {};
    const deepExplanation: DeepImportExplanation = {
      knowledge: clean(rawDeep.knowledge) || undefined,
      formula: clean(rawDeep.formula) || undefined,
      givenData: clean(rawDeep.givenData) || undefined,
      solutionSteps: Array.isArray(rawDeep.solutionSteps) ? rawDeep.solutionSteps.map(clean).filter(Boolean) : undefined,
      whyThisMethod: clean(rawDeep.whyThisMethod) || undefined,
      commonMistakes: Array.isArray(rawDeep.commonMistakes) ? rawDeep.commonMistakes.map(clean).filter(Boolean) : undefined,
      alternativeSolution: clean(rawDeep.alternativeSolution) || undefined,
      deepQuestions: Array.isArray(rawDeep.deepQuestions) ? rawDeep.deepQuestions.map((entry) => { const q = entry && typeof entry === "object" ? entry as Record<string, unknown> : {}; return { question: clean(q.question), answer: clean(q.answer) || undefined, explanation: clean(q.explanation) || undefined }; }).filter((entry) => entry.question) : undefined,
      variationExplanation: clean(rawDeep.variationExplanation) || undefined,
      needsVerification: rawDeep.needsVerification === true,
    };
    const hasDeepData = Object.entries(deepExplanation).some(([key, value]) => key !== "needsVerification" && (Array.isArray(value) ? value.length > 0 : Boolean(value)));
    const sourceName = clean(item.source) || undefined;
    const options = Array.isArray(item.options) ? item.options.map(clean).filter(Boolean) : [];
    if (!prompt) errors.push(`${label} thiếu câu hỏi.`);
    if (!type) errors.push(`${label} thiếu hoặc sai loại câu hỏi.`);
    if (!answer) errors.push(`${label} thiếu đáp án.`);
    if (type === "multiple" && options.length < 2) errors.push(`${label} trắc nghiệm phải có ít nhất 2 lựa chọn.`);
    if (type === "multiple" && answer && options.length && !options.includes(answer)) errors.push(`${label} có đáp án không nằm trong lựa chọn.`);
    if (type === "boolean" && !["đúng", "sai", "true", "false"].includes(answer.toLowerCase())) errors.push(`${label} đúng/sai phải có đáp án Đúng hoặc Sai.`);
    const duplicateKey = prompt.toLocaleLowerCase();
    if (seen.has(duplicateKey)) errors.push(`${label} bị trùng nội dung câu hỏi.`);
    seen.add(duplicateKey);
    if (!explanation) warnings.push(`${label} chưa có giải thích.`);
    if (!hasDeepData) warnings.push(`${label} chưa có dữ liệu Hiểu tận gốc.`);
    if (deepExplanation.needsVerification) warnings.push(`${label} được đánh dấu cần xác minh.`);
    if (!sourceName) warnings.push(`${label} chưa có nguồn tham khảo.`);
    if (type) questions.push({ id: `import-${index + 1}`, type, prompt, options: type === "multiple" ? options : undefined, answer, explanation, source: sourceName, deepExplanation: hasDeepData ? deepExplanation : undefined });
  });
  if (questions.length > maxFlashcards) warnings.push(`Có ${questions.length} câu; khi tạo Flashcard mỗi lần import chỉ dùng tối đa ${maxFlashcards} thẻ.`);
  return { valid: errors.length === 0, errors, warnings, questions };
}

export function convertImportToFlashcards(validation: ImportValidation, metadata: { title: string; subject: string; topic: string; difficulty?: FlashcardSet["difficulty"] }, now = new Date().toISOString()): FlashcardSet {
  const cards: Flashcard[] = validation.questions.slice(0, 27).map((question) => ({ id: `${metadata.title}-${question.id}`, front: question.prompt, back: [question.answer, question.explanation].filter(Boolean).join("\n\n"), status: "new", starred: false }));
  return { id: `set-${Date.parse(now) || Date.now()}`, title: metadata.title, subject: metadata.subject, topic: metadata.topic, difficulty: metadata.difficulty ?? "Trung bình", createdAt: now, studyCount: 0, cards };
}

export function convertImportToQuiz(validation: ImportValidation, metadata: { title: string; subject: string; topic: string; difficulty?: Quiz["difficulty"]; durationMinutes?: number }, now = new Date().toISOString()): Quiz {
  const questions: QuizQuestion[] = validation.questions.map((question) => ({ id: question.id, type: question.type, prompt: question.prompt, options: question.options, answer: question.answer, explanation: question.explanation, deepExplanation: question.deepExplanation }));
  return { id: `quiz-${Date.parse(now) || Date.now()}`, title: metadata.title, subject: metadata.subject, topic: metadata.topic, difficulty: metadata.difficulty ?? "Trung bình", durationMinutes: metadata.durationMinutes ?? 30, createdAt: now, questions };
}
