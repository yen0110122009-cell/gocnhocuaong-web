import fs from "node:fs";

const homePath = "client/src/pages/Home.tsx";
const experiencePath = "client/src/components/ExperienceStudio.tsx";
let home = fs.readFileSync(homePath, "utf8");
let experience = fs.readFileSync(experiencePath, "utf8");

const oldGuard = '    if (!audio) return;\n    onProfile({ ...profile, defaultAmbientScene: scene.id as ProfileState["defaultAmbientScene"] }, `Đã áp dụng ${scene.label}.`);';
const newGuard = '    onProfile({ ...profile, defaultAmbientScene: scene.id as ProfileState["defaultAmbientScene"] }, `Đã áp dụng ${scene.label}.`);\n    if (!audio) {\n      setAudioTheme(null);\n      setAudioEnabled(false);\n      return;\n    }';
if (!home.includes(oldGuard)) throw new Error("chooseAudioTheme guard not found");
home = home.replace(oldGuard, newGuard);

const oldFilter = ").filter((scene) => AUDIO_BACKED_SCENE_IDS.has(scene.id)).map((scene) => <button";
const newFilter = ").map((scene) => <button";
if (!home.includes(oldFilter)) throw new Error("AppearanceStudio catalog filter not found");
home = home.replace(oldFilter, newFilter);

const oldStatus = '{profile.defaultAmbientScene === scene.id ? "Đang dùng" : "Áp dụng"}';
const newStatus = '{profile.defaultAmbientScene === scene.id ? "Đang dùng" : AUDIO_BACKED_SCENE_AUDIO[scene.id] ? "Có âm nền · Áp dụng" : "Chỉ giao diện · chưa có âm nền"}';
if (!home.includes(oldStatus)) throw new Error("AppearanceStudio status not found");
home = home.replace(oldStatus, newStatus);

const oldFavorites = 'sceneOptions.filter((scene) => AUDIO_BACKED_SCENE_IDS.has(scene.id) && ((profile.favoriteAmbientScenes ?? []).length === 0 || (profile.favoriteAmbientScenes ?? []).includes(scene.id)))';
const newFavorites = 'sceneOptions.filter((scene) => (profile.favoriteAmbientScenes ?? []).length === 0 || (profile.favoriteAmbientScenes ?? []).includes(scene.id))';
if (!experience.includes(oldFavorites)) throw new Error("Lumi favorites audio filter not found");
experience = experience.replace(oldFavorites, newFavorites);

fs.writeFileSync(homePath, home);
fs.writeFileSync(experiencePath, experience);
console.log("Restored full theme catalog; audio remains optional and status is explicit.");
