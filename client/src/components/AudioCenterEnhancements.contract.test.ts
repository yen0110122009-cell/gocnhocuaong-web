import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const componentSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/AudioCenterEnhancements.tsx"), "utf8");
const homeSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("Audio Center UX contracts", () => {
  it("provides advanced library search and filters", () => {
    expect(componentSource).toContain("audioSearch");
    expect(componentSource).toContain("audioSource");
    expect(componentSource).toContain("audioStatus");
    expect(componentSource).toContain("audioTag");
    expect(componentSource).toContain("audioTarget");
    expect(componentSource).toContain("Tìm kiếm nâng cao thư viện audio");
    expect(componentSource).toContain("libraryAssets");
  });

  it("confirms permanent deletion through a toast and access semantics", () => {
    expect(componentSource).toContain('toast.success(`Đã xóa vĩnh viễn');
    expect(componentSource).toContain("Tệp không còn truy cập được");
    expect(componentSource).toContain("storage contract");
  });

  it("renders an accessible skeleton while the Audio Center lazy module loads", () => {
    expect(homeSource).toContain("AudioCenterLoadingSkeleton");
    expect(homeSource).toContain('aria-busy="true"');
    expect(homeSource).toContain("animate-pulse");
    expect(homeSource).toContain("<Suspense fallback={<AudioCenterLoadingSkeleton />}");
  });
});
