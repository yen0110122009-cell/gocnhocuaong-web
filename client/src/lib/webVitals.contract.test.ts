import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Web Vitals instrumentation", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/lib/webVitals.ts"), "utf8");
  const entry = readFileSync(resolve(process.cwd(), "client/src/main.tsx"), "utf8");

  it("đo LCP, CLS, INP và FCP bằng PerformanceObserver", () => {
    expect(source).toContain('observe("largest-contentful-paint"');
    expect(source).toContain('observe("layout-shift"');
    expect(source).toContain('observe("event"');
    expect(source).toContain('"first-contentful-paint"');
  });

  it("chỉ khởi động một lần tại entry point và chỉ phát event nội bộ", () => {
    expect(source).toContain("if (started || typeof window === \"undefined\"");
    expect(source).toContain('gocnhocuaong:web-vitals');
    expect(entry).toContain("startWebVitals();");
    expect(source).not.toContain("fetch(");
  });
});
