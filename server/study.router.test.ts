import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("study router core", () => {
  it("serves the validated 900/400 master catalog through appRouter", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.study.master.catalog();

    expect(result.counts).toEqual({ achievements: 900, titles: 400 });
    expect(result.achievements[0]).toHaveProperty("id");
    expect(result.titles[0]).toHaveProperty("id");
  });

  it("rejects AI Studio requests with an invalid session token before invoking AI", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.study.ai.generateFromDocument({
        token: "too-short",
        mode: "cards",
        prompt: "Hãy tạo bộ flashcard lịch sử Việt Nam.",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

