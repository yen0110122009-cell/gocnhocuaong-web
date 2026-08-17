import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("knowledge map", () => {
  it("groups topics and exposes learning destinations", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/KnowledgeMap.tsx"), "utf8");
    expect(source).toContain("Chắc");
    expect(source).toContain("Cần ôn");
    expect(source).toContain("Chưa chắc");
    expect(source).toContain("Chưa học");
    expect(source).toContain("onView(\"flashcards\")");
    expect(source).toContain("onView(\"quizzes\")");
  });
});
