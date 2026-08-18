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
});

// This contract prevents a relative /api/trpc request from being sent to GitHub Pages,
// where the static host returns index.html and the client would otherwise report HTML-as-JSON.
