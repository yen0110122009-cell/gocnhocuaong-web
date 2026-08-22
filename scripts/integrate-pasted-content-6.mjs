import fs from "node:fs";

const root = "/home/ubuntu/gocnhocuaong-web";
const ids = ["spring-blossom", "summer-beach", "autumn-leave", "winter-snow", "halloween-spooky", "lunar-new-year", "thunder-storm", "rainy-day", "sunny-day", "foggy-morning"];
const assets = {
  "spring-blossom": ["Mùa Xuân Thanh Tân", "https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg"],
  "summer-beach": ["Mùa Hạ Biển Xanh & Nắng Vàng", "https://actions.google.com/sounds/v1/water/ocean_waves.ogg"],
  "autumn-leave": ["Mùa Thu Lá Vàng Rơi", "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg"],
  "winter-snow": ["Mùa Đông Tuyết Rơi & Người Tuyết", "https://actions.google.com/sounds/v1/ambiences/winter_wind.ogg"],
  "halloween-spooky": ["Đêm Hội Halloween", "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg"],
  "lunar-new-year": ["Tết Cổ Truyền Rực Rỡ", "https://actions.google.com/sounds/v1/festivals/fireworks_distant.ogg"],
  "thunder-storm": ["Sấm Chớp Bão Bùng", "https://actions.google.com/sounds/v1/weather/thunderclap.ogg"],
  "rainy-day": ["Mưa Rào Tình Cảm", "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg"],
  "sunny-day": ["Nắng Nhiệt Đới Rực Rỡ", "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg"],
  "foggy-morning": ["Sương Mù Mờ Áo", "https://actions.google.com/sounds/v1/ambiences/foghorn_distant.ogg"],
};

const studyPath = `${root}/shared/study.ts`;
let study = fs.readFileSync(studyPath, "utf8");
const unionNeedle = ' | "teddy";';
if (!study.includes('"spring-blossom"')) {
  if (!study.includes(unionNeedle)) throw new Error("AmbientScenePreference union marker not found");
  study = study.replace(unionNeedle, ` | "teddy" | ${ids.map((id) => `"${id}"`).join(" | ")};`);
  fs.writeFileSync(studyPath, study);
}

const ambientPath = `${root}/client/src/lib/defaultAmbient.ts`;
let ambient = fs.readFileSync(ambientPath, "utf8");
if (!ambient.includes('"spring-blossom"')) {
  const entries = ids.map((id) => {
    const [name, url] = assets[id];
    return `  "${id}": { id: "provided-theme-${id}", name: "${name}", description: "BGM từ tài liệu tham chiếu", url: "${url}", target: "${id}", source: "provided" },`;
  }).join("\n");
  ambient = ambient.replace(/\n\} as const;/, `\n${entries}\n} as const;`);
  fs.writeFileSync(ambientPath, ambient);
}

const expPath = `${root}/client/src/components/ExperienceStudio.tsx`;
let exp = fs.readFileSync(expPath, "utf8");
const expIds = ids.map((id) => `"${id}"`).join(", ");
if (!exp.includes('"spring-blossom"')) {
  exp = exp.replace('"coffee"]);', `"coffee", ${expIds}]);`);
  const sceneMarker = '  { id: "morning", label: "Buổi sáng"';
  if (!exp.includes('id: "spring-blossom"')) {
    exp = exp.replace(sceneMarker, `  { id: "spring-blossom", label: "Mùa Xuân Thanh Tân", detail: "chim én · hoa đào · hoa mai", icon: Flower2 },\n${sceneMarker}`);
  }
  fs.writeFileSync(expPath, exp);
}

const homePath = `${root}/client/src/pages/Home.tsx`;
let home = fs.readFileSync(homePath, "utf8");
const homeOptions = [
  '{ id: "spring-blossom", label: "Mùa Xuân Thanh Tân", icon: "🌸", preview: "from-[#fff0f5] via-[#f4a7bb] to-[#6f365b]", detail: "chim én · hoa đào · hoa mai" }',
  '{ id: "summer-beach", label: "Mùa Hạ Biển Xanh", icon: "🏖️", preview: "from-[#e0f7ff] via-[#58c3df] to-[#14647a]", detail: "sóng biển · nắng vàng" }',
  '{ id: "autumn-leave", label: "Mùa Thu Lá Vàng Rơi", icon: "🍁", preview: "from-[#fff0d1] via-[#d88b42] to-[#75401f]", detail: "lá phong · trà ấm" }',
  '{ id: "winter-snow", label: "Mùa Đông Người Tuyết", icon: "☃️", preview: "from-[#eefaff] via-[#9fcde3] to-[#355a82]", detail: "tuyết rơi · người tuyết" }',
  '{ id: "halloween-spooky", label: "Đêm Hội Halloween", icon: "🎃", preview: "from-[#241332] via-[#71366f] to-[#e96831]", detail: "bí ngô · dơi bay" }',
  '{ id: "lunar-new-year", label: "Tết Cổ Truyền Rực Rỡ", icon: "🧧", preview: "from-[#fff1cf] via-[#d83c42] to-[#641526]", detail: "bánh chưng · đèn lồng" }',
  '{ id: "thunder-storm", label: "Sấm Chớp Bão Bùng", icon: "⛈️", preview: "from-[#172033] via-[#4f596b] to-[#191d2e]", detail: "mây đen · tia sét" }',
  '{ id: "rainy-day", label: "Mưa Rào Tình Cảm", icon: "🌧️", preview: "from-[#dbe8ef] via-[#71899e] to-[#2f455a]", detail: "mưa · gợn nước" }',
  '{ id: "sunny-day", label: "Nắng Nhiệt Đới Rực Rỡ", icon: "🌻", preview: "from-[#fff8bf] via-[#f5bd55] to-[#4b8c62]", detail: "mặt trời · hướng dương" }',
  '{ id: "foggy-morning", label: "Sương Mù Mờ Áo", icon: "🌫️", preview: "from-[#edf2ef] via-[#a9bab7] to-[#52656d]", detail: "đèn đường · dải sương" }',
].join(", ");
if (!home.includes('id: "spring-blossom"')) {
  const marker = '{ id: "forest", label: "Rừng xanh"';
  home = home.replace(marker, `${homeOptions}, ${marker}`);
  fs.writeFileSync(homePath, home);
}

const cssPath = `${root}/client/src/index.css`;
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes('data-ambient-scene="spring-blossom"')) {
  const aliases = ids.map((id) => `::root[data-ambient-scene="${id}"]`).join(",\n");
  css += `\n/* pasted_content_6 scenes: visual aliases use light decoration only; no opaque full-screen veil. */\n${aliases} { --scene-page: #eef6f5; --scene-page-alt: #c8e6e3; --scene-side: #23605e; --scene-card: #f8fffe; --scene-text: #173638; --scene-border: #77aaa5; --scene-accent: #d97745; --scene-accent-alt: #2c8c85; --scene-shadow: rgb(23 54 56 / .16); }\n${aliases} #root > div.min-h-screen::before { opacity: .05 !important; pointer-events: none !important; }\n${aliases} #root > div.min-h-screen::after { opacity: .10 !important; pointer-events: none !important; mix-blend-mode: normal !important; }\n`;
  fs.writeFileSync(cssPath, css);
}
