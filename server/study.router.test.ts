import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("study router core", () => {
  it("phục vụ catalog Thành tích/Danh hiệu trống", async () => {
    const result = await appRouter.createCaller(createContext()).study.master.catalog();
    expect(result.counts).toEqual({ achievements: 0, titles: 0 });
    expect(result.achievements).toEqual([]);
    expect(result.titles).toEqual([]);
  });

  it("từ chối yêu cầu AI Studio có token phiên không hợp lệ", async () => {
    await expect(appRouter.createCaller(createContext()).study.ai.generateFromDocument({ token: "too-short", mode: "cards", prompt: "Hãy tạo bộ flashcard lịch sử Việt Nam." })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
