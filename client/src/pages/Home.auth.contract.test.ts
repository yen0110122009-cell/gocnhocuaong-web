import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("Home session restoration", () => {
  it("only clears a saved session when the server explicitly rejects its token", () => {
    expect(homeSource).toContain("const tokenRejected");
    expect(homeSource).toContain('trpcCode === "UNAUTHORIZED"');
    expect(homeSource).toContain('trpcCode === "FORBIDDEN"');
    expect(homeSource).toContain("if (tokenRejected)");
    expect(homeSource).toContain("Không đăng xuất người dùng chỉ vì lỗi mạng");
  });
});
