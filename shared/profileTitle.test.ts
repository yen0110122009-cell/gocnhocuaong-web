import { describe, expect, it } from "vitest";
import { emptyAppConfig, emptyProfile, selectEarnedTitle } from "./study";

describe("Danh hiệu đã bị loại bỏ", () => {
  it("không cho đặt Danh hiệu từ dữ liệu legacy", () => {
    const result = selectEarnedTitle(emptyProfile(), emptyAppConfig(), "title-legacy");
    expect(result.selected).toBeNull();
    expect(result.profile.activeTitle).toBeNull();
  });
});
