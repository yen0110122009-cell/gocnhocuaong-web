import { describe, expect, it } from "vitest";

describe("Supabase frontend configuration", () => {
  it("accepts the configured project URL and publishable key", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    expect(url).toMatch(/^https:\/\/[^/]+\.supabase\.co$/);
    expect(key).toMatch(/^sb_publishable_/);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(`${url}/auth/v1/settings`, {
        headers: {
          apikey: key!,
          Authorization: `Bearer ${key}`,
        },
        signal: controller.signal,
      });
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    } finally {
      clearTimeout(timeout);
    }
  }, 15_000);
});

function unusedTypeGuard(): never {
  throw new Error("unreachable");
}
void unusedTypeGuard;
