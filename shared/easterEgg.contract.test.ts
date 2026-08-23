import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_EASTER_EGG_MESSAGE, EASTER_EGG_STORAGE_KEY, EASTER_EGG_UPDATED_EVENT } from "../client/src/lib/easterEgg";

const component = readFileSync(resolve(process.cwd(), "client/src/components/EasterEgg.tsx"), "utf8");
const adminPanel = readFileSync(resolve(process.cwd(), "client/src/components/EasterEggAdminPanel.tsx"), "utf8");
const adminWorkspace = readFileSync(resolve(process.cwd(), "client/src/pages/AdminWorkspace.tsx"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Easter Egg 🍀 contract", () => {
  it("keeps the default message and exact LocalStorage key", () => {
    expect(EASTER_EGG_STORAGE_KEY).toBe("easter_egg_message");
    expect(DEFAULT_EASTER_EGG_MESSAGE).toBe("Chúc bạn một ngày tốt lành! 🍀");
    expect(EASTER_EGG_UPDATED_EVENT).toBe("gocnhocuaong:easter-egg-message-updated");
    expect(component).toContain("readEasterEggMessage");
    expect(component).toContain("window.addEventListener(EASTER_EGG_UPDATED_EVENT, syncMessage)");
    expect(component).toContain("window.addEventListener(\"storage\", syncMessage)");
  });

  it("renders a fixed top-right trigger with the requested visual states", () => {
    expect(component).toContain("fixed top-5 right-5 z-[999]");
    expect(component).toContain("text-[32px]");
    expect(component).toContain("opacity-60");
    expect(component).toContain("hover:scale-110");
    expect(component).toContain("hover:opacity-100");
    expect(component).toContain("aria-label=\"Mở lời nhắn Easter Egg\"");
    expect(component).toContain("easter-egg-fireworks");
    expect(component).toContain("playCelebrationTone(soundEnabled)");
    expect(component).toContain("soundEnabled?: boolean");
    expect(component).toContain("window.AudioContext");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".easter-egg-fireworks span");
  });

  it("keeps the popup to one message and a close action", () => {
    expect(component).toContain('role="dialog"');
    expect(component).toContain('aria-modal="true"');
    expect(component).toContain("Lời nhắn từ bạn 🍀");
    expect(component).toContain("{message || DEFAULT_EASTER_EGG_MESSAGE}");
    expect(component).toContain(">Đóng</button>");
    expect(component).toContain("event.key === \"Escape\"");
  });

  it("renders the modal through document.body and keeps it fixed to the viewport", () => {
    expect(component).toContain("createPortal");
    expect(component).toContain("createPortal(modal, document.body)");
    expect(component).toContain("easter-egg-modal-backdrop");
    expect(component).toContain("easter-egg-modal-card");
    expect(css).toContain(".easter-egg-modal-backdrop");
    expect(css).toContain("position: fixed !important");
    expect(css).toContain("inset: 0 !important");
    expect(css).toContain("min-height: 100dvh");
    expect(css).toContain("z-index: 1000 !important");
  });

  it("provides an admin editor for the Easter Egg popup message", () => {
    expect(adminWorkspace).toContain('import { EasterEggAdminPanel } from "@/components/EasterEggAdminPanel";');
    expect(adminWorkspace).toContain('storageKey="admin-easter-egg"');
    expect(adminWorkspace).toContain("<EasterEggAdminPanel />");
    expect(adminPanel).toContain("Chỉnh sửa pop-up cỏ bốn lá");
    expect(adminPanel).toContain('id="admin-easter-egg-message"');
    expect(adminPanel).toContain("saveEasterEggMessage(draft)");
    expect(adminPanel).toContain("Khôi phục mặc định");
    expect(adminPanel).toContain("Xem trước pop-up cỏ bốn lá");
  });

  it("mounts the Easter Egg globally and provides the Account setting", () => {
    expect(home).toContain('import { EasterEgg } from "@/components/EasterEgg";');
    expect(home).toContain("<EasterEgg soundEnabled={profile.soundEnabled} />");
    expect(home).toContain("Câu lệnh / Thông điệp Easter Egg 🍀");
    expect(home).toContain('id="easter-egg-message"');
    expect(home).toContain("saveEasterEggMessage(easterEggMessage)");
    expect(home).toContain(">Lưu thay đổi</button>");
  });
});
