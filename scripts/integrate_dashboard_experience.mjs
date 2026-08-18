import fs from "node:fs";
const path = "client/src/pages/Home.tsx";
let source = fs.readFileSync(path, "utf8");
if (!source.includes('import { ExperienceStudio } from "@/components/ExperienceStudio";')) {
  source = source.replace('import { cn } from "@/lib/utils";', 'import { cn } from "@/lib/utils";\nimport { ExperienceStudio } from "@/components/ExperienceStudio";\nimport { type EmotionId } from "@/lib/emotionThemes";');
}
const dashboardStart = 'function Dashboard({ account, profile, config, onView }: { account: StudyAccount; profile: ProfileState; config: AppConfig; onView: (v: View) => void }) {';
if (!source.includes('const [selectedEmotion, setSelectedEmotion] = useState<EmotionId>("calm");')) {
  source = source.replace(dashboardStart, `${dashboardStart} const [selectedEmotion, setSelectedEmotion] = useState<EmotionId>("calm");`);
}
const heading = 'return <><Heading eyebrow="Góc học tập của Ong"';
const insert = '<ExperienceStudio selected={selectedEmotion} onSelect={setSelectedEmotion} onStartTwoMinutes={() => onView("pomodoro")} />';
if (!source.includes(insert)) {
  source = source.replace(heading, `${heading}`);
  const headingEnd = source.indexOf('/>', source.indexOf(heading));
  if (headingEnd < 0) throw new Error("Dashboard heading not found");
  source = source.slice(0, headingEnd + 2) + insert + source.slice(headingEnd + 2);
}
fs.writeFileSync(path, source);
