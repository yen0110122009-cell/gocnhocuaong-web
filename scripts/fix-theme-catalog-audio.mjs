import fs from "node:fs";

const fairyId = "fairy-tale";
const studyPath = "shared/study.ts";
let study = fs.readFileSync(studyPath, "utf8");
const unionMarker = 'export type AmbientScenePreference = ';
const unionStart = study.indexOf(unionMarker);
const unionEnd = study.indexOf(';', unionStart);
if (!study.slice(unionStart, unionEnd).includes(`"${fairyId}"`)) study = study.slice(0, unionEnd) + ` | "${fairyId}"` + study.slice(unionEnd);
const idsStart = study.indexOf('export const AMBIENT_SCENE_IDS = ');
const idsEnd = study.indexOf(';', idsStart);
const idsChunk = study.slice(idsStart, idsEnd);
const idsClose = idsChunk.lastIndexOf("] as const");
if (!idsChunk.includes(`"${fairyId}"`)) study = study.slice(0, idsStart + idsClose) + `, "${fairyId}"` + study.slice(idsStart + idsClose);
const mixerStart = study.indexOf("audioMixer: { ambientSceneVolumes: {");
const mixerEnd = study.indexOf(" }, pomodoroLayers", mixerStart);
const mixerChunk = study.slice(mixerStart, mixerEnd);
if (!mixerChunk.includes(`"${fairyId}"`)) study = study.slice(0, mixerEnd) + `, "${fairyId}": 30` + study.slice(mixerEnd);
const presetNeedle = 'ambientScene: ([';
const presetStart = study.indexOf(presetNeedle);
const presetEnd = study.indexOf('] as AmbientScenePreference[]).includes', presetStart);
if (presetStart >= 0 && presetEnd >= 0) {
  const presetChunk = study.slice(presetStart, presetEnd);
  if (!presetChunk.includes(`"${fairyId}"`)) study = study.slice(0, presetEnd) + `, "${fairyId}"` + study.slice(presetEnd);
}
fs.writeFileSync(studyPath, study);

const expPath = "client/src/components/ExperienceStudio.tsx";
let exp = fs.readFileSync(expPath, "utf8");
const audioSetStart = exp.indexOf('const AUDIO_BACKED_SCENE_IDS = new Set<AmbientScene>([');
const audioSetEnd = exp.indexOf("]);", audioSetStart);
if (!exp.slice(audioSetStart, audioSetEnd).includes(`"${fairyId}"`)) exp = exp.slice(0, audioSetEnd) + `, "${fairyId}"` + exp.slice(audioSetEnd);
const volumeNeedle = '"lofi-rain-chill": 35 };';
if (exp.includes(volumeNeedle) && !exp.includes('"fairy-tale": 30')) exp = exp.replace(volumeNeedle, '"lofi-rain-chill": 35, "fairy-tale": 30 };');
const oldLookup = 'const providedThemeAudio = scene === "tet" ? PROVIDED_THEME_AMBIENT_ASSETS.tet : scene === "space" ? PROVIDED_THEME_AMBIENT_ASSETS.space : scene === "coffee" ? PROVIDED_THEME_AMBIENT_ASSETS.coffee : scene === "rainy_season" ? PROVIDED_THEME_AMBIENT_ASSETS.rainy_season : scene === "stormy_season" ? PROVIDED_THEME_AMBIENT_ASSETS.stormy_season : scene === "morning_chill" ? PROVIDED_THEME_AMBIENT_ASSETS.morning_chill : undefined;';
const newLookup = 'const providedThemeAudio = PROVIDED_THEME_AMBIENT_ASSETS[scene as keyof typeof PROVIDED_THEME_AMBIENT_ASSETS];';
if (!exp.includes(oldLookup)) throw new Error("old provided audio lookup not found");
exp = exp.replace(oldLookup, newLookup);
const optionMarker = '  { id: "lofi-rain-chill", label: "Đêm Mưa Chill Lo-Fi", detail: "cú đêm · trà nóng · đĩa nhạc", icon: CloudRain },';
if (exp.includes(optionMarker) && !exp.includes('id: "fairy-tale"')) exp = exp.replace(optionMarker, `${optionMarker}\n  { id: "fairy-tale", label: "Cổ Tích Xứ Sở Thần Thoại", detail: "nàng tiên · nấm sáng · bụi phép", icon: Sparkles },`);
fs.writeFileSync(expPath, exp);

const ambientPath = "client/src/lib/defaultAmbient.ts";
let ambient = fs.readFileSync(ambientPath, "utf8");
const ambientEnd = ambient.lastIndexOf("} as const;");
if (!ambient.includes('"fairy-tale":')) ambient = ambient.slice(0, ambientEnd) + '  "fairy-tale": { id: "provided-theme-fairy-tale", name: "Cổ Tích Xứ Sở Thần Thoại", description: "Chuông cổ tích theo pasted_content_9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "fairy-tale", source: "provided" },\n' + ambient.slice(ambientEnd);
fs.writeFileSync(ambientPath, ambient);
console.log("Patched fairy-tale, preset normalization and dynamic provided audio lookup.");
