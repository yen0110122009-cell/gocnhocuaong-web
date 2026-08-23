import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Pomodoro feedback contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");
  const presets = readFileSync(resolve(process.cwd(), "client/src/lib/lumiPresets.ts"), "utf8");
  const speech = readFileSync(resolve(process.cwd(), "client/src/lib/lumiSpeech.ts"), "utf8");
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("giữ quy định no-BGM với âm báo nước, bốn âm báo Pomodoro và TTS Lumi", () => {
    expect(source).toContain("Cài đặt Lumi và Pomodoro");
    expect(source).toContain("Nhắc uống nước");
    expect(source).toContain("LUMI_WATER_ALERT_SOUNDS");
    expect(source).toContain("POMODORO_ALERT_EVENT_IDS.map");
    expect(source).toContain("playPomodoroAlert");
    expect(source).toContain("window.speechSynthesis");
    expect(source).not.toContain("new Audio(");
  });

  it("mở Pomodoro thành cửa sổ nổi độc lập và đồng bộ lease", () => {
    expect(home).toContain("window.open");
    expect(home).toContain("pomodoro-detached");
    expect(source).toContain("Ghim ra màn hình");
    expect(source).toContain("DETACHED_POMODORO_ACTIVE_KEY");
    expect(source).toContain("DETACHED_POMODORO_LEASE_MS");
    expect(source).toContain("POMODORO_SESSION_KEY");
    expect(source).toContain("Đóng cửa sổ");
  });

  it("lưu ngữ cảnh học gồm môn, nội dung và ghi chú", () => {
    expect(source).toContain("Môn học");
    expect(source).toContain("Nội dung");
    expect(source).toContain("Ghi chú phiên học");
    expect(source).toContain("checkedPlanItemIds");
  });

  it("giữ hỗ trợ chống trì hoãn và Lumi không chặn thao tác", () => {
    expect(source).toContain("Hỗ trợ chống trì hoãn");
    expect(source).toContain("Cần an ủi");
    expect(source).toContain("Cần động viên");
    expect(source).toContain('role="status"');
  });

  it("giữ Kaomoji trong avatar riêng và widget nổi trên modal", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(source).toContain("lumi-widget-header");
    expect(source).toContain("lumi-avatar-box");
    expect(source).toContain("lumi-kaomoji-text");
    expect(source).toContain("lumi-kaomoji-text--long");
    expect(source).toContain("lumi-quick-feelings-grid");
    expect(source).toContain("modal-backdrop");
    expect(source).toContain("lumi-popup-modal");
    expect(source).toContain("lumi-timer-badge");
    expect(source).toContain("lumi-popup-timer-card");
    expect(source).toContain("Thời gian Pomodoro ${display}");
    expect(source).toContain('role="timer"');
    expect(source).toContain("pomodoro_lumi_timer_badge_visible");
    expect(source).toContain("const lumiTimerBadge = showLumiDialog ?");
    expect(source).toContain("return <>{showLumiDialog ? lumiTimerBadge");
    expect(source).toContain("setShowLumiDialog(true)");
    expect(source).toContain("onPointerDown={startLumiPopupDrag}");
    expect(source).toContain("lumiPopupPosition");
    expect(css).toContain(".pomodoro-pinned-widget");
    expect(css).toContain("z-index: 9999 !important");
    expect(css).toContain(".modal-backdrop");
    expect(css).toContain("z-index: 9000 !important");
    expect(css).toContain(".lumi-popup-modal");
    expect(css).toContain("z-index: 9500 !important");
    expect(css).toContain(".lumi-popup-timer-card");
    expect(css).toContain(".lumi-timer-badge");
    expect(css).toContain("position: fixed !important");
    expect(css).toContain("top: max(64px");
    expect(css).toContain("z-index: 99999 !important");
    expect(css).toContain("min-width: 110px");
    expect(css).toContain("border-radius: 20px");
    expect(css).toContain(".lumi-avatar-box");
    expect(css).toContain(".lumi-kaomoji-text--long");
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
  });

  it("có nhiều lựa chọn cảm xúc check-in và giữ các lựa chọn cũ", () => {
    for (const label of ["Mệt mỏi", "Thiếu động lực", "Cần cái ôm", "Sẵn sàng học", "Tập trung", "Đau lòng", "Lo lắng", "Bình tĩnh", "Vui vẻ"]) expect(presets).toContain(label);
    expect(source).toContain("LUMI_CHECKIN_OPTIONS.map");
    expect(presets).toContain("LUMI_CHECKIN_OPTIONS");
  });

  it("ưu tiên voice vi-VN và vẫn nói khi browser chưa tải voices ngay lập tức", () => {
    expect(source).toContain("speakLumiVietnamese");
    expect(speech).toContain('utterance.lang = "vi-VN"');
    expect(speech).toContain('voice.lang.toLocaleLowerCase() === "vi-vn"');
    expect(speech).toContain("voiceschanged");
    expect(speech).toContain("synthesis.cancel()");
  });

  it("đồng bộ routine Kaomoji Lumi với focus, nghỉ và nhắc nước", () => {
    expect(source).toContain("lumiKaomojiForPomodoro");
    expect(source).toContain("lumiRoutineMessage");
    expect(source).toContain("LUMI_WELCOME");
    expect(source).toContain("LUMI_MULTI_DIALOGUES_EVENT");
    expect(source).toContain("pickRandomLumiDialogue");
    expect(source).toContain("lumi_multi_dialogues_data");
    expect(source).toContain("waterReminderVisible ? \"(´ー`)旦~~\"");
    expect(source).toContain("Ngoan lắm! Tiếp tục thôi nào ✨");
    expect(source).toContain("LUMI_WATER_MESSAGE");
    expect(source).toContain("scheduleMode");
    expect(source).toContain("dailyTime");
    expect(source).toContain("dailyTimes");
    expect(source).toContain("addDailyWaterTime");
    expect(source).toContain("removeDailyWaterTime");
    expect(source).toContain("Bạn có thể đặt nhiều mốc");
    expect(source).toContain("Nghe thử âm báo nhắc nước");
    expect(presets).toContain("Đã đến giờ uống một ngụm nước ấm rồi nè bạn ơi! ☕💧");
  });
});
