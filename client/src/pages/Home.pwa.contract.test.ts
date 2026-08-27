import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("PWA installation contract", () => {
  it("registers the GitHub Pages service worker and exposes an install action", () => {
    const main = readFileSync(resolve(process.cwd(), "client/src/main.tsx"), "utf8");
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const manifest = readFileSync(resolve(process.cwd(), "client/public/manifest.webmanifest"), "utf8");
    expect(main).toContain("navigator.serviceWorker.register");
    expect(home).toContain("beforeinstallprompt");
    expect(home).toContain("Cài ứng dụng");
    expect(home).toContain("pwa-login-shell");
    expect(home).toContain("pwa-background-shell");
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(css).toContain("pwa-background-clean.webp");
    expect(css).toContain("background-position: 15% center");
    expect(manifest).toContain('"display": "standalone"');
    expect(manifest).toContain('"lang": "vi-VN"');
    expect(manifest).toContain('pwa-icon-192.png');
    expect(manifest).toContain('pwa-icon-512.png');
    expect(manifest).toContain('"theme_color": "#d99a28"');
    const html = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(html).toContain('pwa-icon-192.png');
    const sw = readFileSync(resolve(process.cwd(), "client/public/sw.js"), "utf8");
    expect(sw).toContain("gocnhocuaong-shell-v2-pwa-icon");
    expect(sw).toContain("pwa-icon-512.png");
  });
});

describe("Quiz metadata filters contract", () => {
  it("keeps subject, grade, topic and difficulty filters", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/QuizEnhanced.tsx"), "utf8");
    expect(source).toContain("quizSubject");
    expect(source).toContain("quizGrade");
    expect(source).toContain("quizTopic");
    expect(source).toContain("Lọc môn học đề kiểm tra");
    expect(source).toContain("Lọc lớp học đề kiểm tra");
    expect(source).toContain("Lọc chủ đề đề kiểm tra");
    expect(source).toContain("Lọc độ khó đề kiểm tra");
  });
});
