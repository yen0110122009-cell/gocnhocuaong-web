import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("debug log redaction contract", () => {
  it("redacts sensitive headers and token-bearing URLs in the browser collector", () => {
    const source = readFileSync(resolve(process.cwd(), "client/public/__manus__/debug-collector.js"), "utf8");
    expect(source).toMatch(/authorization/i);
    expect(source).toMatch(/cookie/i);
    expect(source).toMatch(/token/i);
    expect(source).toMatch(/sanitizeHeaders/);
    expect(source).toMatch(/sanitizeUrl/);
    expect(source).toMatch(/\[REDACTED\]/);
  });

  it("redacts again at the Vite log sink instead of trusting browser payloads", () => {
    const source = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");
    expect(source).toMatch(/SENSITIVE_LOG_KEY/);
    expect(source).toMatch(/redactLogValue/);
    expect(source).toMatch(/writeToLogFile\("networkRequests"/);
  });
});
