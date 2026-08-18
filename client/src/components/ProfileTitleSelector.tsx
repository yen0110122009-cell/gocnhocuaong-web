import { Award, Check } from "lucide-react";
import { allAchievementsWithProgress, selectEarnedTitle, type AppConfig, type ProfileState } from "../../../shared/study";

type ProfileTitleSelectorProps = {
  profile: ProfileState;
  config: AppConfig;
  onProfile: (profile: ProfileState, message?: string) => void;
};

export default function ProfileTitleSelector({ profile, config, onProfile }: ProfileTitleSelectorProps) {
  const earnedTitles = allAchievementsWithProgress(profile, config)
    .filter((achievement) => achievement.title && profile.unlockedAchievementIds.includes(achievement.id) && achievement.enabled !== false)
    .map((achievement) => ({ id: achievement.id, title: achievement.title as string, description: achievement.description }))
    .filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index);
  const active = earnedTitles.find((item) => item.id === profile.activeTitle);

  const chooseTitle = (titleId: string) => {
    const result = selectEarnedTitle(profile, config, titleId);
    if (result.selected) onProfile(result.profile, `Đã chọn Danh hiệu “${result.selected.title}” hiển thị trên hồ sơ.`);
  };

  return (
    <section className="panel mt-5 p-5" aria-labelledby="profile-title-selector">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200"><Award className="h-5 w-5" /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-red-700 dark:text-red-300">Danh hiệu hồ sơ</p>
          <h2 id="profile-title-selector" className="mt-1 font-display text-xl font-bold">Chọn dấu mốc muốn giới thiệu</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Chỉ Danh hiệu đã đạt mới xuất hiện trong danh sách. Ong có thể thay đổi lựa chọn bất kỳ lúc nào.</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/60 p-4 dark:border-red-400/15 dark:bg-red-500/[.05]">
        <p className="text-xs font-bold uppercase tracking-widest text-red-700 dark:text-red-300">Đang hiển thị</p>
        <p className="mt-1 font-display text-lg font-bold">{active ? `📜 ${active.title}` : "Chưa chọn Danh hiệu"}</p>
      </div>
      {earnedTitles.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-white/15">Hãy tiếp tục học tập để mở khóa Danh hiệu đầu tiên.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {earnedTitles.map((item) => (
            <button key={item.id} type="button" onClick={() => chooseTitle(item.id)} className={`rounded-2xl border p-4 text-left transition ${active?.id === item.id ? "border-red-400 bg-red-50 dark:border-red-300/60 dark:bg-red-500/10" : "border-slate-200 hover:border-red-300 dark:border-white/10 dark:hover:border-red-300/50"}`}>
              <span className="flex items-start justify-between gap-3"><span><span className="block font-bold">📜 {item.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span></span>{active?.id === item.id && <Check className="h-4 w-4 shrink-0 text-red-700 dark:text-red-200" />}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export { ProfileTitleSelector };
