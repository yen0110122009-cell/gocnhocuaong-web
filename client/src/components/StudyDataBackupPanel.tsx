import { Download, FileUp, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { ProfileState } from "../../../shared/study";
import { createStudyBackup, restoreStudyBackup } from "../../../shared/studyBackup";
import { PersistentCollapsible } from "./PersistentCollapsible";

type Props = {
  profile: ProfileState;
  onProfile: (profile: ProfileState, message?: string) => void;
  isGuest?: boolean;
};

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function StudyDataBackupPanel({ profile, onProfile, isGuest = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const exportBackup = () => {
    if (isGuest) {
      toast.info("Chế độ khách không có tiến trình được lưu để sao lưu.");
      return;
    }
    const date = new Date();
    const stamp = date.toISOString().replaceAll(/[:.]/g, "-");
    downloadTextFile(`gocnhocuaong-backup-${stamp}.json`, createStudyBackup(profile));
    toast.success("Đã xuất file backup JSON.");
  };

  const importBackup = async (file: File) => {
    setBusy(true);
    try {
      const restored = restoreStudyBackup(await file.text());
      const planCount = restored.studyPlanItems?.length ?? 0;
      const claimCount = restored.dailyPhoneRewardClaims?.length ?? 0;
      const accepted = window.confirm(`File hợp lệ và sẽ thay thế dữ liệu hiện tại bằng bản backup này.\n\nKhôi phục ${planCount} mục Kế hoạch và ${claimCount} biên nhận thưởng thời gian?`);
      if (!accepted) return;
      onProfile(restored, "Đã khôi phục tiến độ học tập và phần thưởng thời gian từ backup JSON.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đọc file backup.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return <PersistentCollapsible storageKey="plans-data-backup" title="Sao lưu và khôi phục dữ liệu" eyebrow="File JSON cá nhân"><section className="rounded-3xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-300/20 dark:bg-indigo-950/20" aria-label="Sao lưu và khôi phục dữ liệu học tập"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-indigo-700 shadow-sm dark:bg-slate-950/40 dark:text-indigo-300"><ShieldCheck className="h-5 w-5" /></span><div><h2 className="font-display text-xl font-bold">Giữ lại hành trình học của bạn</h2><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">File JSON chứa tiến độ học tập, kế hoạch ngày–tuần, lịch sử hoạt động, cài đặt phần thưởng và các biên nhận thời gian chơi điện thoại. File chỉ được tải xuống hoặc đọc trên thiết bị của bạn.</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button type="button" className="primary-button" onClick={exportBackup} disabled={isGuest}><Download className="h-4 w-4" />Xuất backup JSON</button><button type="button" className="secondary-button" onClick={() => inputRef.current?.click()} disabled={isGuest || busy}><FileUp className="h-4 w-4" />{busy ? "Đang đọc file…" : "Nhập / khôi phục JSON"}</button><input ref={inputRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Chọn file backup JSON" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importBackup(file); }} /></div>{isGuest ? <p className="mt-3 text-sm font-semibold text-amber-800 dark:text-amber-200">Hãy đăng nhập tài khoản để sao lưu hoặc khôi phục tiến trình.</p> : <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">Khôi phục sẽ thay thế toàn bộ hồ sơ hiện tại sau khi bạn xác nhận. Hãy xuất một bản backup mới trước nếu muốn giữ dữ liệu hiện tại.</p>}</section></PersistentCollapsible>;
}
