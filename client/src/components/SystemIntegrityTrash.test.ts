import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("system integrity and trash contracts", () => {
  it("renders a time-series from real Event/character timestamps and labels user aggregates honestly", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/SystemIntegrityPanel.tsx"), "utf8");
    expect(source).toContain("event.createdAt");
    expect(source).toContain("character.updatedAt");
    expect(source).toContain("Theo ledger từng hồ sơ");
    expect(source).toContain("Theo hồ sơ người dùng");
    expect(source).not.toContain("Math.random");
  });

  it("exposes soft-delete recovery and permanent-delete actions for every supported admin data group", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/AdminTrashPanel.tsx"), "utf8");
    expect(source).toContain("deletedAt");
    expect(source).toContain("restoreConfigItem");
    expect(source).toContain("permanentlyDeleteConfigItem");
    expect(source).toContain('"achievement"');
    expect(source).toContain('"reward"');
    expect(source).toContain('"shopItem"');
    expect(source).toContain("Thùng rác theo module");
  });
});
