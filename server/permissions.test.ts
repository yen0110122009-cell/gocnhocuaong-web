import { describe, expect, it } from "vitest";
import { canAssignRole, canManageMembers, canModifyAccount, isUnlimitedAccountCode } from "../shared/permissions";

describe("study permissions", () => {
  it("allows Founder and Admin to manage members", () => {
    expect(canManageMembers("Founder")).toBe(true);
    expect(canManageMembers("Admin")).toBe(true);
    expect(canManageMembers("Member")).toBe(false);
  });

  it("keeps Founder role assignment exclusive to Founder", () => {
    expect(canAssignRole("Founder", "Founder")).toBe(true);
    expect(canAssignRole("Admin", "Founder")).toBe(false);
    expect(canAssignRole("Admin", "Member")).toBe(true);
    expect(canAssignRole("Member", "Admin")).toBe(false);
  });

  it("treats member code 111 as an unrestricted account code", () => {
    expect(isUnlimitedAccountCode("111")).toBe(true);
    expect(isUnlimitedAccountCode(" 111 ")).toBe(true);
    expect(isUnlimitedAccountCode("112")).toBe(false);
  });

  it("protects Founder account mutations", () => {
    expect(canModifyAccount("Founder", "Founder", true)).toBe(true);
    expect(canModifyAccount("Founder", "Founder", false)).toBe(false);
    expect(canModifyAccount("Admin", "Founder", false)).toBe(false);
    expect(canModifyAccount("Admin", "Member")).toBe(true);
  });
});
