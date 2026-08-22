import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Âm thanh, Thùng rác học liệu và ghi âm", () => {
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
  const trash = readFileSync(resolve(process.cwd(), "client/src/components/LearningMaterialTrash.tsx"), "utf8");
  const study = readFileSync(resolve(process.cwd(), "shared/study.ts"), "utf8");
  const recorder = readFileSync(resolve(process.cwd(), "client/src/components/EmotionCompanionMediaControls.tsx"), "utf8");
  const studyRouter = readFileSync(resolve(process.cwd(), "server/routers/study.ts"), "utf8");
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

  it("dùng một handler React duy nhất cho công tắc âm thanh toàn cục", () => {
    expect(home).toContain('aria-label={profile.soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"} onClick={() => persistProfile({ ...profile, soundEnabled: !profile.soundEnabled })}');
    expect(home).not.toContain("handleGlobalSoundToggle");
    expect(home).not.toContain("stopImmediatePropagation");
  });

  it("chỉ còn hiện các thẻ catalog có âm nền được cung cấp", () => {
    expect(css).toContain('[aria-label$=", chỉ giao diện"] { display: none !important; }');
  });

  it("lưu xóa mềm theo nhóm và hiện đủ thao tác khôi phục/xóa vĩnh viễn", () => {
    expect(study).toContain("export type LearningMaterialTrashEntry<T>");
    expect(study).toContain("flashcardSetTrash?: LearningMaterialTrashEntry<FlashcardSet>[];");
    expect(study).toContain("quizTrash?: LearningMaterialTrashEntry<Quiz>[];");
    expect(study).toContain("flashcardSetTrash: Array.isArray(source.flashcardSetTrash)");
    expect(trash).toContain("Thùng rác học liệu");
    expect(trash).toContain("Chọn tất cả");
    expect(trash).toContain("Khôi phục");
    expect(trash).toContain("Xóa vĩnh viễn");
    expect(home).toContain('{ id: "learning-trash", label: "Thùng rác học liệu", icon: Trash2 }');
    expect(home).toContain('else if (view === "learning-trash") { content = null; }');
    expect(home).toContain('<LearningMaterialTrash profile={profile} onProfile={onProfile} visible={view === "learning-trash"} />');
  });

  it("cho phép ghi/tải các định dạng tương thích và giải thích lỗi micro", () => {
    expect(recorder).toContain('"audio/mp4"');
    expect(recorder).toContain('"audio/x-m4a"');
    expect(recorder).toContain("25 * 1024 * 1024");
    expect(recorder).toContain('MediaRecorder.isTypeSupported(candidate)');
    expect(recorder).toContain('name === "NotAllowedError"');
    expect(recorder).toContain('name === "NotFoundError"');
    expect(studyRouter).toContain('"audio/aac"');
    expect(studyRouter).toContain('"audio/m4a"');
    expect(studyRouter).toContain("35_000_000");
    expect(studyRouter).toContain('Tệp âm thanh tối đa 25 MB.');
  });
});
