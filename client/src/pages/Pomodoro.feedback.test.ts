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
    expect(source).toContain("pomodoroSessionStorageKey");
    expect(source).toContain("accountId");
    expect(source).toContain("focusCompletionTransition");
    expect(source).toContain("pendingTransition !== null");
    expect(home).toContain("key={`pomodoro-${account.id}`}");
    expect(home).toContain("const onOnline = () =>");
    expect(home).toContain("window.removeEventListener(\"online\", onOnline)");
    expect(home).toContain("window.requestAnimationFrame");
    expect(source).toContain("Đóng cửa sổ");
  });

  it("nút Khôi phục phiên nạp lại đúng session theo tài khoản và trạng thái chờ", () => {
    expect(source).toContain("function restore()");
    expect(source).toContain("readPersistedPomodoro(undefined, pomodoroStorageKey)");
    expect(source).toContain("const recovered = recoverRunningSeconds(saved)");
    expect(source).toContain("setSeconds(recovered)");
    expect(source).toContain("setPendingTransition(pendingTransitionForSavedPomodoro(saved))");
    expect(source).toContain("setRunning(saved.running && recovered > 0)");
    expect(source).toContain("setGoalCompletedSessions(saved.goalCompletedSessions ?? 0)");
    expect(source).toContain("Đã khôi phục phiên Pomodoro");
  });

  it("lưu ngữ cảnh học gồm môn, nội dung và ghi chú", () => {
    expect(source).toContain("Môn học");
    expect(source).toContain("Nội dung");
    expect(source).toContain("Ghi chú phiên học");
    expect(source).toContain("subject");
    expect(source).toContain("topic");
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
    expect(css).toContain(".lumi-quick-feelings-grid");
    expect(css).toContain(".deep-focus-shell");
    expect(css).toContain("safe-area-inset-bottom");
    expect(css).toContain("min-height: calc(100dvh - 2rem)");
    expect(source).toContain("modal-backdrop");
    expect(source).toContain("lumi-popup-modal");
    expect(source).not.toContain("lumi-timer-badge");
    expect(source).toContain("lumi-popup-timer-card");
    expect(source).toContain("lumi-pomodoro-status-chip");
    expect(source).toContain("Lumi đang học cùng bạn");
    expect(source).toContain("Lumi đang nghỉ cùng bạn");
    expect(source).toContain("Đã xong phiên học · chờ nghỉ");
    expect(source).toContain("Lumi đang đếm ngược ${display}");
    expect(source).toContain('role="timer"');
    expect(source).not.toContain("pomodoro_lumi_timer_badge_visible");
    expect(source).not.toContain("const lumiTimerBadge = showLumiDialog ?");
    expect(source).toContain("showLumiDialog ? null : <aside");
    expect(source).toContain("setShowLumiDialog(true)");
    expect(source).toContain("Hãy chọn môn học của ngày hôm nay.");
    expect(source).toContain("Hãy chọn môn học của phiên này.");
    expect(source).toContain("notifyFocusSessionStart");
    expect(source).toContain("subjectConfirmationOpen");
    expect(source).toContain("Xác nhận và bắt đầu");
    expect(source).toContain("Hãy chọn hoặc nhập môn học trước khi bắt đầu.");
    expect(source).toContain("deepFocusMode");
    expect(source).toContain("Chế độ tập trung sâu");
    expect(source).toContain("aria-label={`Thời gian còn lại ${display}`}");
    expect(source).toContain("sessionSummary");
    expect(source).toContain("Tổng kết phiên học");
    expect(source).toContain("Nội dung phiên học");
    expect(source).toContain("Thời lượng theo nhịp Pomodoro đang chọn");
    expect(source).toContain("setGoalCompletedSessions(0); setSeconds(focus * 60)");
    expect(source).toContain("setFocus(value.focus); setShortBreak(value.short); setLongBreak(value.long)");
    expect(source).toContain("Chọn phiên mới");
    expect(source).toContain("Dùng phiên gần nhất");
    expect(source).toContain("Lưu nhịp hiện tại");
    expect(source).toContain("pomodoro_personal_presets");
    expect(source).toContain("Mở phần chọn môn");
    expect(source).toContain("openSubjectPickerArea");
    expect(source).toContain("pomodoro-subject-picker");
    expect(source).toContain("onPointerDown={startLumiPopupDrag}");
    expect(source).toContain("lumiPopupPosition");
    expect(css).toContain(".pomodoro-pinned-widget");
    expect(css).toContain("z-index: 9999 !important");
    expect(css).toContain("min-height: 100dvh");
    expect(css).toContain("subject-confirmation-modal");
    expect(css).toContain(".modal-backdrop");
    expect(css).toContain("z-index: 9000 !important");
    expect(css).toContain(".lumi-popup-modal");
    expect(css).toContain("z-index: 9500 !important");
    expect(css).toContain(".lumi-pomodoro-status-chip");
    expect(css).toContain(".lumi-popup-timer-card");
    expect(css).not.toContain(".lumi-timer-badge");
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
    expect(speech).toContain('voice.lang.replace("_", "-").toLocaleLowerCase().startsWith("vi")');
    expect(speech).toContain("isNatural");
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
    expect(source).toContain("updateDailyWaterTime(index, event.target.value)");
    expect(source).toContain("key={`water-time-${index}`}");
    expect(source).toContain("removeDailyWaterTime");
    expect(source).toContain("Bạn có thể đặt nhiều mốc");
    expect(source).toContain("Nghe thử âm báo nhắc nước");
    expect(presets).toContain("Đã đến giờ uống một ngụm nước ấm rồi nè bạn ơi! ☕💧");
  });
});
