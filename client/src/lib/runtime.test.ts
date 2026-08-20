import { describe, expect, it } from "vitest";
import { resolveMediaUrl } from "./runtime";

describe("media runtime URL resolution", () => {
  it("keeps data URLs intact for GitHub Pages cloud-state media", () => {
    const dataUrl = "data:image/png;base64,AAAA";
    expect(resolveMediaUrl(dataUrl)).toBe(dataUrl);
  });

  it("keeps absolute URLs intact", () => {
    expect(resolveMediaUrl("https://cdn.example.test/lumi.webp")).toBe("https://cdn.example.test/lumi.webp");
  });

  it("keeps relative storage paths unchanged in the non-browser test runtime", () => {
    expect(resolveMediaUrl("/manus-storage/study-historia/lumi.webm")).toBe("/manus-storage/study-historia/lumi.webm");
  });
});
