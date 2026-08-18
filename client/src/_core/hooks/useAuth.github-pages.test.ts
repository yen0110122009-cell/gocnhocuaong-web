import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("useAuth GitHub Pages guard", () => {
  it("disables the tRPC auth.me query on github.io", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/_core/hooks/useAuth.ts"), "utf8");
    expect(source).toContain('import { isGitHubPages } from "@/lib/runtime";');
    expect(source).toMatch(/trpc\.auth\.me\.useQuery\(undefined,\s*\{[\s\S]*enabled:\s*!isGitHubPages/);
    expect(source).toContain("loading: (!isGitHubPages && meQuery.isLoading)");
  });

  it("blocks relative tRPC requests on the static host with JSON instead of index.html", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/main.tsx"), "utf8");
    expect(source).toContain('import { isGitHubPages } from "@/lib/runtime";');
    expect(source).toContain('if (isGitHubPages && typeof input === "string" && input.includes("/api/trpc"))');
    expect(source).toContain('headers: { "content-type": "application/json" }');
    expect(source).toContain('JSON.stringify([{ result: { data: { json: null } } }])');
    expect(source).toContain('status: 200');
  });
});

// This contract prevents a relative /api/trpc request from being sent to GitHub Pages,
// where the static host returns index.html and the client would otherwise report HTML-as-JSON.
