import { describe, expect, it } from "vitest";
import { mapSupabaseAccount } from "./supabaseAuth";

describe("Supabase Auth account mapping", () => {
  it("maps the protected Supabase profile fields to StudyAccount", () => {
    expect(mapSupabaseAccount({
      user_id: "auth-user-1",
      display_name: "Lumi",
      account_code: "111",
      role: "Member",
      locked: false,
      created_at: "2026-08-17T00:00:00.000Z",
    })).toEqual({
      id: "auth-user-1",
      name: "Lumi",
      code: "111",
      role: "Member",
      locked: false,
      createdAt: "2026-08-17T00:00:00.000Z",
    });
  });
});
