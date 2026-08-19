import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("Home menu help integration", () => {
  it("mounts the help guide outside the routed main content so it remains available across views", () => {
    expect(source).toContain('import { MenuHelpGuide } from "@/components/MenuHelpGuide"');
    expect(source).toContain("<MenuHelpGuide currentView={view} isAdmin={isAdmin(account)} isUnlimitedAccount={isUnlimitedAccountCode(account.code)} onNavigate={(nextView) => setView(nextView)} />");
  });
});
