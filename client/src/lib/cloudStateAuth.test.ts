import { describe, expect, it } from "vitest";
import { emptyAppConfig } from "../../../shared/study";
import { normalizeCloudName, parseCloudStatePayload, readCloudJson } from "./cloudStateAuth";

describe("GitHub Pages cloud-state adapter", () => {
  it("normalizes Vietnamese names consistently for shared code 111", () => {
    expect(normalizeCloudName("  Lumi   Ong  ")).toBe("lumi ong");
    expect(normalizeCloudName("LÚMI ONG")).toBe("lúmi ong");
  });

  it("keeps legacy 12.html payload untouched while reading the namespaced state", () => {
    const legacy = { xp: 172, todos: [{ id: "todo-1" }], app_theme: "light" };
    const parsed = parseCloudStatePayload({ id: "global_state", payload: legacy });
    expect(parsed.accounts).toEqual([]);
    expect(parsed.config).toMatchObject({ ...emptyAppConfig(), updatedAt: expect.any(String) });
    expect(legacy.todos).toEqual([{ id: "todo-1" }]);
  });

  it("reads namespaced account and profile data when present", () => {
    const parsed = parseCloudStatePayload({ id: "global_state", payload: { __gocnhocuaong: { accounts: [{ id: "a1", name: "Lumi", code: "111", role: "Founder", locked: false, createdAt: "2026-08-17T00:00:00.000Z", normalizedName: "lumi", passwordHash: null }], profiles: { a1: { xp: 3 } }, config: { dailyFragmentCap: 12 }, updatedAt: "2026-08-17T00:00:00.000Z" } } });
    expect(parsed.accounts[0]?.id).toBe("a1");
    expect(parsed.profiles.a1).toEqual({ xp: 3 });
    expect(parsed.config.dailyFragmentCap).toBe(12);
  });

  it("reports a helpful message when an API endpoint returns HTML", async () => {
    const response = new Response("<html><head><title>Not Found</title></head></html>", { status: 200, headers: { "content-type": "text/html" } });
    await expect(readCloudJson(response, "Không thể đọc cloud-state")).rejects.toThrow("trả về HTML thay vì JSON");
  });

  it("parses valid JSON and explains malformed JSON", async () => {
    const valid = new Response(JSON.stringify([{ id: "global_state", payload: {} }]), { status: 200, headers: { "content-type": "application/json" } });
    await expect(readCloudJson(valid, "Cloud-state")).resolves.toEqual([{ id: "global_state", payload: {} }]);
    const malformed = new Response("{broken", { status: 200, headers: { "content-type": "application/json" } });
    await expect(readCloudJson(malformed, "Cloud-state")).rejects.toThrow("JSON không hợp lệ");
  });

  it("includes a concise server detail for non-OK API responses", async () => {
    const response = new Response("<h1>Bad Gateway</h1>", { status: 502, headers: { "content-type": "text/html" } });
    await expect(readCloudJson(response, "Cloud-state")).rejects.toThrow("Cloud-state (502): Bad Gateway");
  });
});
