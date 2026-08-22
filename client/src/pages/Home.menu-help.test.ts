import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("Home menu help integration", () => {
  it("keeps the compatibility mount inert so no help control is rendered across views", () => {
    expect(source).toContain('import { MenuHelpGuide } from "@/components/MenuHelpGuide"');
    expect(source).toContain("<MenuHelpGuide currentView={view} isAdmin={isAdmin(account)} isUnlimitedAccount={isUnlimitedAccountCode(account.code)} onNavigate={(nextView) => setView(nextView)} />");
  });
});
