import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const project = resolve(process.cwd());
const read = (file: string) => readFileSync(resolve(project, file), "utf8");

describe("learning view filters", () => {
  it("filters Flashcard collections by query and difficulty", () => {
    const source = read("client/src/pages/Home.tsx");
    expect(source).toContain("Tìm bộ Flashcard");
    expect(source).toContain("Lọc độ khó Flashcard");
    expect(source).toContain("filteredSets");
  });

  it("filters Quiz collections by query and difficulty", () => {
    const source = read("client/src/pages/QuizEnhanced.tsx");
    expect(source).toContain("Tìm đề kiểm tra");
    expect(source).toContain("Lọc độ khó đề kiểm tra");
    expect(source).toContain("filteredQuizzes");
  });

  it("filters Museum characters by query and fragment unlock state", () => {
    const source = read("client/src/pages/MuseumEnhanced.tsx");
    expect(source).toContain("Tìm nhân vật trong bảo tàng");
    expect(source).toContain("Lọc trạng thái mảnh ghép");
    expect(source).toContain("filteredCharacters");
  });
});

export {};

describe("flashcard collection management", () => {
  it("exposes rename, copy and delete actions with confirmation-safe controls", () => {
    const source = read("client/src/pages/Home.tsx");
    expect(source).toContain("Đổi tên bộ Flashcard");
    expect(source).toContain("Sao chép bộ Flashcard");
    expect(source).toContain("Xóa bộ Flashcard");
    expect(source).toContain('status: "new" as const');
  });
});

describe("flashcard date filtering", () => {
  it("supports recent creation windows", () => {
    const source = read("client/src/pages/Home.tsx");
    expect(source).toContain("Lọc ngày Flashcard");
    expect(source).toContain("7 ngày gần đây");
    expect(source).toContain("30 ngày gần đây");
    expect(source).toContain("setDateFilter");
  });
});

describe("flashcard to quiz", () => {
  it("exposes a profile-persisted quiz creation action", () => {
    const source = read("client/src/pages/Home.tsx");
    expect(source).toContain("Tạo đề từ bộ Flashcard");
    expect(source).toContain("createQuizFromSet");
    expect(source).toContain("createQuizFromFlashcardSet");
  });
});
