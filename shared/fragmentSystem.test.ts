import { describe, expect, it } from "vitest";
import { assembleCharacter, collectionValueBalance, collectNextCharacterPiece, exchangeCollectionTickets, getCharacterProgress, grantFragmentSourceReward, purchaseCollectionItem, unlockCharacterProfileLevel, validateHistoricalCharacterDraft } from "./fragmentSystem";
import { emptyProfile } from "./study";

const character = {
  id: "nguyen-thi-binh",
  name: "Nguyễn Thị Bình",
  aliases: "",
  birthYear: "1927",
  deathYear: "",
  hometown: "",
  role: "Nhà ngoại giao",
  categories: ["Ngoại giao"],
  summary: "",
  biography: "Nội dung có nguồn.",
  sourceName: "Nguồn tư liệu",
  sourceUrl: "https://example.com/history",
  imageUrl: "https://example.com/image.webp",
  imageSource: "Wikimedia Commons",
  fragmentTotal: 3,
  timeline: [],
  updatedAt: new Date(0).toISOString(),
  verificationStatus: "verified" as const,
};

describe("fragment character lifecycle", () => {
  it("moves from owned pieces to ready, then assembles and unlocks one character only", () => {
    let profile = emptyProfile();
    expect(getCharacterProgress(profile, character).status).toBe("locked");
    profile = collectNextCharacterPiece(profile, character, "2026-01-01T00:00:00.000Z").profile;
    profile = collectNextCharacterPiece(profile, character, "2026-01-02T00:00:00.000Z").profile;
    profile = collectNextCharacterPiece(profile, character, "2026-01-03T00:00:00.000Z").profile;
    expect(getCharacterProgress(profile, character).status).toBe("ready");
    const assembled = assembleCharacter(profile, character, "2026-01-04T00:00:00.000Z");
    expect(assembled.assembled).toBe(true);
    expect(assembled.progress.status).toBe("unlocked");
    expect(assembled.progress.usedPieceIds).toHaveLength(3);
    expect(assembleCharacter(assembled.profile, character).assembled).toBe(false);
  });

  it("uses configured tier values and spends the same ledger for profile upgrades, tickets, and shop items", () => {
    const configuredCharacter = { ...character, profileLevels: [{ id: "bio", label: "Tiểu sử mở rộng", requiredValue: 3, description: "Mở phần tiểu sử có nguồn." }] };
    const config = { characters: [configuredCharacter], collectionConfig: { tierValues: [{ tier: "I", label: "Phổ thông", value: 2, rarity: "common", enabled: true }, { tier: "III", label: "Hiếm", value: 8, rarity: "rare", enabled: true }], ticketExchange: { fragmentValue: 4, tickets: 1, enabled: true }, shopItems: [{ id: "frame", name: "Khung lịch sử", description: "Khung hồ sơ", kind: "profileFrame", price: 1, currency: "collectionTicket", rarity: "common", stock: 2, enabled: true }] } } as any;
    let profile = emptyProfile();
    for (let index = 0; index < 3; index += 1) profile = collectNextCharacterPiece(profile, configuredCharacter).profile;
    expect(collectionValueBalance(config, profile)).toBe(12);
    profile = { ...assembleCharacter(profile, configuredCharacter).profile };
    const upgraded = unlockCharacterProfileLevel(config, profile, configuredCharacter, "bio");
    expect(upgraded.unlocked).toBe(true);
    expect(collectionValueBalance(config, upgraded.profile)).toBe(9);
    const exchanged = exchangeCollectionTickets(config, upgraded.profile, 4);
    expect(exchanged.exchanged).toBe(true);
    expect(exchanged.profile.collectionTickets).toBe(1);
    const purchased = purchaseCollectionItem(config, exchanged.profile, config.collectionConfig.shopItems[0]);
    expect(purchased.purchased).toBe(true);
    expect(purchased.profile.collectionInventory).toContain("frame");
  });

  it("enforces source daily caps and idempotent claim keys", () => {
    const config = { collectionConfig: { tierValues: [{ tier: "I", label: "Phổ thông", value: 1, rarity: "common", enabled: true }], rewardSources: [{ id: "session", kind: "studySession", label: "Phiên học", description: "Một phiên học hoàn thành", enabled: true, dailyCap: 2, claimLimit: 2, rewards: [{ tier: "I", amount: 1 }] }] } } as any;
    const rule = config.collectionConfig.rewardSources[0];
    let profile = emptyProfile();
    const first = grantFragmentSourceReward(config, profile, rule, "activity-1", "2026-08-19T08:00:00.000Z");
    expect(first.granted).toBe(true);
    profile = first.profile;
    expect(grantFragmentSourceReward(config, profile, rule, "activity-1", "2026-08-19T08:01:00.000Z").reason).toBe("already_claimed");
    const second = grantFragmentSourceReward(config, profile, rule, "activity-2", "2026-08-19T08:02:00.000Z");
    expect(second.granted).toBe(true);
    profile = second.profile;
    expect(grantFragmentSourceReward(config, profile, rule, "activity-3", "2026-08-19T08:03:00.000Z").reason).toBe("limit_reached");
    expect(profile.fragmentLedger?.I).toBe(2);
  });

  it("keeps an existing member's progress isolated and validates source completeness", () => {
    const otherCharacter = { ...character, id: "vo-thi-sau", name: "Võ Thị Sáu" };
    let profile = emptyProfile();
    profile = collectNextCharacterPiece(profile, character).profile;
    expect(profile.fragments[character.id]).toBe(1);
    expect(profile.fragments[otherCharacter.id]).toBeUndefined();
    const invalid = validateHistoricalCharacterDraft({ ...character, id: "Bad ID", sourceUrl: "", imageSource: "" });
    expect(invalid.valid).toBe(false);
    expect(invalid.warnings.join(" ")).toContain("nguồn");
  });
});
