import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import QuizEnhanced from "./QuizEnhanced";
import { emptyAppConfig, emptyProfile, type ProfileState } from "../../../shared/study";

describe("QuizEnhanced render integration", () => {
  it("renders quiz selection and persisted attempt history from the profile contract", () => {
    const profile: ProfileState = {
      ...emptyProfile(),
      quizzes: [{
        id: "quiz-render-1",
        title: "Quiz phục hồi render",
        subject: "Lịch sử Việt Nam",
        topic: "Nhà Lý",
        difficulty: "Cơ bản",
        durationMinutes: 5,
        createdAt: "2026-08-16T00:00:00.000Z",
        questions: [{ id: "q-render-1", type: "multiple", prompt: "Kinh đô đầu tiên của nhà Lý là gì?", options: ["Hoa Lư", "Thăng Long"], answer: "Thăng Long", explanation: "Lý Công Uẩn dời đô ra Thăng Long." }],
      }],
      attempts: [{
        id: "attempt-render-1",
        quizId: "quiz-render-1",
        completedAt: "2026-08-16T00:00:00.000Z",
        answers: [{ questionId: "q-render-1", answer: "Thăng Long", correct: true, flagged: false }],
        correct: 1,
        total: 1,
        accuracy: 100,
        durationSeconds: 42,
      }],
    };
    const html = renderToStaticMarkup(React.createElement(QuizEnhanced, { profile, config: emptyAppConfig(), onProfile: vi.fn() }));
    expect(html).toContain("Quiz phục hồi render");
    expect(html).toContain("Lịch sử làm bài");
    expect(html).toContain("Bắt đầu làm đề nhanh Quiz phục hồi render");
    expect(html).toContain("Tìm đề kiểm tra");
    expect(html).toContain("quiz-history-title");
  });

  it("renders the empty state when no quiz is available", () => {
    const html = renderToStaticMarkup(React.createElement(QuizEnhanced, { profile: emptyProfile(), config: emptyAppConfig(), onProfile: vi.fn() }));
    expect(html).toContain("Chưa có đề kiểm tra cho tài khoản này.");
    expect(html).toContain("Tạo đề trong AI Studio");
  });
});
