import fs from "node:fs";

const studyPath = "shared/study.ts";
let study = fs.readFileSync(studyPath, "utf8");
const newIds = [
  "summer-ocean", "autumn-maple", "tet-vietnam", "halloween-night", "ghost-month", "xmas-holiday", "teachers-day", "vietnam-heroes", "rainy-ripple", "windy-dust", "fire-element", "girly-pastel", "hung-kings-festival", "youth-volunteers", "dien-bien-phu-victory", "liberation-day", "vpa-day", "mid-autumn", "water-element", "air-wind-element", "earth-element", "masculine-cyber", "oriental-wuxia", "mekong-delta", "hanoi-old-quarter", "mini-hologram-cosmos", "aurora-borealis", "arcade-retro", "magic-chess", "lofi-rain-chill"
];
const unionMarker = 'export type AmbientScenePreference = ';
const unionStart = study.indexOf(unionMarker);
const unionEnd = study.indexOf(';', unionStart);
if (unionStart < 0 || unionEnd < 0) throw new Error("AmbientScenePreference declaration not found");
const currentUnion = study.slice(unionStart, unionEnd + 1);
for (const id of newIds) if (!currentUnion.includes(`"${id}"`)) study = study.slice(0, unionEnd) + ` | "${id}"` + study.slice(unionEnd);
const idsMarker = 'export const AMBIENT_SCENE_IDS = ';
const idsStart = study.indexOf(idsMarker);
const idsEnd = study.indexOf(';', idsStart);
if (idsStart < 0 || idsEnd < 0) throw new Error("AMBIENT_SCENE_IDS declaration not found");
const idsChunk = study.slice(idsStart, idsEnd);
const insertAt = idsChunk.lastIndexOf("] as const");
if (insertAt < 0) throw new Error("AMBIENT_SCENE_IDS closing marker not found");
const additions = newIds.filter((id) => !idsChunk.includes(`"${id}"`)).map((id) => `"${id}"`).join(", ");
study = study.slice(0, idsStart + insertAt) + (additions ? `, ${additions}` : "") + study.slice(idsStart + insertAt);
const mixerMarker = "audioMixer: { ambientSceneVolumes: {";
const mixerStart = study.indexOf(mixerMarker);
const mixerEnd = study.indexOf(" }, pomodoroLayers", mixerStart);
if (mixerStart < 0 || mixerEnd < 0) throw new Error("audio mixer defaults not found");
const mixerChunk = study.slice(mixerStart, mixerEnd);
const mixerAdditions = newIds.filter((id) => !mixerChunk.includes(`${id}:`)).map((id) => `\"${id}\": 35`).join(", ");
if (mixerAdditions) study = study.slice(0, mixerEnd) + `, ${mixerAdditions}` + study.slice(mixerEnd);
fs.writeFileSync(studyPath, study);

const experiencePath = "client/src/components/ExperienceStudio.tsx";
let experience = fs.readFileSync(experiencePath, "utf8");
const audioSetNeedle = 'const AUDIO_BACKED_SCENE_IDS = new Set<AmbientScene>([';
const audioSetStart = experience.indexOf(audioSetNeedle);
const audioSetEnd = experience.indexOf("]);", audioSetStart);
if (audioSetStart < 0 || audioSetEnd < 0) throw new Error("audio scene set not found");
const audioIds = {
  "summer-ocean": "https://actions.google.com/sounds/v1/water/ocean_waves.ogg",
  "autumn-maple": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg",
  "tet-vietnam": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "halloween-night": "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg",
  "ghost-month": "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg",
  "xmas-holiday": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "teachers-day": "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg",
  "vietnam-heroes": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "rainy-ripple": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg",
  "windy-dust": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg",
  "fire-element": "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg",
  "girly-pastel": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "hung-kings-festival": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "youth-volunteers": "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg",
  "dien-bien-phu-victory": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "liberation-day": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "vpa-day": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg",
  "mid-autumn": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "water-element": "https://actions.google.com/sounds/v1/water/ocean_waves.ogg",
  "air-wind-element": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg",
  "earth-element": "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg",
  "masculine-cyber": "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg",
  "oriental-wuxia": "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg",
  "mekong-delta": "https://actions.google.com/sounds/v1/water/ocean_waves.ogg",
  "hanoi-old-quarter": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg",
  "mini-hologram-cosmos": "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg",
  "aurora-borealis": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg",
  "arcade-retro": "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg",
  "magic-chess": "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg",
  "lofi-rain-chill": "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg"
};
const existingAudioSet = experience.slice(audioSetStart, audioSetEnd);
const missingAudioSet = Object.keys(audioIds).filter((id) => !existingAudioSet.includes(`"${id}"`));
if (missingAudioSet.length) experience = experience.slice(0, audioSetEnd) + `, ${missingAudioSet.map((id) => `"${id}"`).join(", ")}` + experience.slice(audioSetEnd);
const audioConstNeedle = "const defaultAudioChannelVolumes";
const optionsEnd = experience.indexOf("\n];", experience.indexOf("const sceneOptions"));
if (optionsEnd < 0) throw new Error("sceneOptions closing marker not found");
const newOptions = [
  ["summer-ocean", "Mùa Hạ Nắng Vàng & Biển Biếc", "hải âu · cát vàng · sóng biển", "CloudSun"], ["autumn-maple", "Mùa Thu Lá Phủ Rừng", "sóc con · lá phong · gió thu", "Leaf"], ["tet-vietnam", "Mùa Tết Nguyên Đán", "múa lân · bánh chưng · hoa mai", "PartyPopper"], ["halloween-night", "Halloween Đêm Ma Thuật", "ma vui vẻ · dơi · bí ngô", "Ghost"], ["ghost-month", "Tháng Cô Hồn / Lễ Vu Lan", "hoa đăng · hoa sen · sóng đêm", "Moon"], ["xmas-holiday", "Noel Giáng Sinh", "ông già Noel · tuần lộc · quà", "Sparkles"], ["teachers-day", "Ngày Nhà Giáo Việt Nam 20/11", "sách mở · hoa · điểm 10", "Flower2"], ["vietnam-heroes", "Ngày Anh Hùng Dân Tộc / Quốc Khánh", "cờ đỏ sao vàng · chim Lạc", "Star"], ["rainy-ripple", "Trời Mưa Rào & Sóng Xoáy", "ếch con · ô vàng · vòng sóng", "CloudRain"], ["windy-dust", "Trời Dông Giật & Mây Bụi", "diều giấy · gió xoáy · bụi sáng", "Cloud"], ["fire-element", "Nguyên Tố Lửa Bùng Cháy", "phượng hoàng · than hồng · tàn lửa", "Zap"], ["girly-pastel", "Nữ Tính Sweet Pastel", "thỏ bông · trái tim · nơ hồng", "Heart"], ["hung-kings-festival", "Giỗ Tổ Hùng Vương", "Chim Lạc · trống đồng · bánh chưng", "Star"], ["youth-volunteers", "Thanh Niên Tình Nguyện 26/3", "áo xanh · sách · ngôi sao", "Heart"], ["dien-bien-phu-victory", "Chiến Thắng Điện Biên Phủ 7/5", "cờ quyết thắng · hoa ban", "Star"], ["liberation-day", "Ngày Thống Nhất 30/4", "bồ câu · Dinh Độc Lập · pháo hoa", "Star"], ["vpa-day", "Ngày Quân Đội Nhân Dân 22/12", "bộ đội · rừng tre · balo", "Star"], ["mid-autumn", "Tết Trung Thu", "thỏ ngọc · đèn ông sao · bánh nướng", "Moon"], ["water-element", "Nguyên Tố Nước", "cá voi băng · san hô · bọt khí", "Cloud"], ["air-wind-element", "Nguyên Tố Khí / Gió", "rồng mây · lụa mây · bụi sao", "Cloud"], ["earth-element", "Nguyên Tố Đất / Mẹ Thiên Nhiên", "hươu rừng · nấm · mầm cây", "Leaf"], ["masculine-cyber", "Nam Tính / Công Nghệ Cyberpunk", "robot chiến binh · vi mạch · neon", "Zap"], ["oriental-wuxia", "Cổ Trang Tiên Hiệp", "hạc tiên · trúc xanh · chén trà", "Bird"], ["mekong-delta", "Miền Tây Sông Nước", "cá chép · xuồng ba lá · bông súng", "Cloud"], ["hanoi-old-quarter", "Hà Nội 36 Phố Phường Mùa Thu", "mèo vàng · mái ngói · cà phê trứng", "Coffee"], ["mini-hologram-cosmos", "Tiểu Vũ Trụ Hologram", "phi hành gia · vệ tinh · hành tinh", "Moon"], ["aurora-borealis", "Cực Quang Băng Tuyết", "cáo băng · tinh thể · cực quang", "Snowflake"], ["arcade-retro", "Trò Chơi Điện Tử 8-Bit", "ma Pacman · tay cầm · nấm điểm", "Sparkles"], ["magic-chess", "Bàn Cờ Ma Thuật", "quân mã · Tarot · gậy phép", "Sparkles"], ["lofi-rain-chill", "Đêm Mưa Chill Lo-Fi", "cú đêm · trà nóng · đĩa nhạc", "CloudRain"]
];
const optionText = newOptions.map(([id, label, detail, icon]) => `  { id: "${id}", label: "${label}", detail: "${detail}", icon: ${icon} },`).join("\n");
const existingOptionsText = experience.slice(experience.indexOf("const sceneOptions"), optionsEnd);
const missingOptions = newOptions.filter(([id]) => !existingOptionsText.includes(`id: "${id}"`));
if (missingOptions.length) {
  const text = missingOptions.map(([id, label, detail, icon]) => `  { id: "${id}", label: "${label}", detail: "${detail}", icon: ${icon} },`).join("\n");
  experience = experience.slice(0, optionsEnd) + `\n${text}` + experience.slice(optionsEnd);
}
fs.writeFileSync(experiencePath, experience);

const ambientPath = "client/src/lib/defaultAmbient.ts";
let ambient = fs.readFileSync(ambientPath, "utf8");
const assetLines = Object.entries(audioIds).map(([id, url]) => `  "${id}": { id: "provided-theme-${id}", name: "${id}", description: "BGM từ pasted_content_7/8/9", url: "${url}", target: "${id}", source: "provided" },`).join("\n");
const ambientEnd = ambient.lastIndexOf("} as const;");
if (ambientEnd < 0) throw new Error("PROVIDED_THEME_AMBIENT_ASSETS end not found");
const absentAssets = Object.keys(audioIds).filter((id) => !ambient.includes(`"${id}"`));
if (absentAssets.length) ambient = ambient.slice(0, ambientEnd) + `\n${absentAssets.map((id) => Object.entries(audioIds).find(([key]) => key === id)).map(([id, url]) => `  "${id}": { id: "provided-theme-${id}", name: "${id}", description: "BGM từ pasted_content_7/8/9", url: "${url}", target: "${id}", source: "provided" },`).join("\n")}` + ambient.slice(ambientEnd);
fs.writeFileSync(ambientPath, ambient);
console.log(`Merged ${newIds.length} new scene IDs and ${Object.keys(audioIds).length} audio mappings.`);
