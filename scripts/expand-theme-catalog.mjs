import fs from "node:fs";

const project = "/home/ubuntu/gocnhocuaong-web";
const newScenes = ["rainy_season", "stormy_season", "morning_chill", "pixel", "pirate", "sports", "disco", "laboratory", "egypt", "steampunk", "art", "ninja", "coffee", "ai", "teddy"];
const sceneLiteral = '"morning" | "rain" | "snow" | "leaves" | "storm" | "summer" | "spring" | "tet" | "halloween" | "desert" | "night" | "naturepark" | "sunrise" | "mountainsunset" | "meteorice" | "galaxy" | "cityday" | "citysunset" | "citydusk" | "citynight" | "bridgefog" | "urbanfog" | "sparklers" | "fireworks" | "forest" | "sunset" | "space" | "crescentmoon" | "ocean" | "neon" | "sakura" | "autumn" | "festival" | "volcano" | "deepocean" | "magicforest" | "spacestation" | "flowerfield" | "fairytale" | "circus" | "prehistoric" | "cyberrace" | "foodfestival" | "diamondmine" | "f1race" | "candykingdom" | "travel" | "tropical"';
const extendedLiteral = `${sceneLiteral} | ${newScenes.map((s) => `"${s}"`).join(" | ")}`;

const studyPath = `${project}/shared/study.ts`;
let study = fs.readFileSync(studyPath, "utf8");
study = study.replaceAll(sceneLiteral, extendedLiteral);
const volumeTail = 'diamondmine: 34, f1race: 38, candykingdom: 34, travel: 36, tropical: 38';
study = study.replaceAll(volumeTail, `${volumeTail}, rainy_season: 42, stormy_season: 38, morning_chill: 40, pixel: 34, pirate: 36, sports: 36, disco: 34, laboratory: 30, egypt: 30, steampunk: 32, art: 34, ninja: 30, coffee: 36, ai: 30, teddy: 32`);
fs.writeFileSync(studyPath, study);

const studioPath = `${project}/client/src/components/ExperienceStudio.tsx`;
let studio = fs.readFileSync(studioPath, "utf8");
studio = studio.replace(
  '  { id: "tropical", label: "Biển nhiệt đới", detail: "cây dừa · sóng xanh", icon: CloudSun },\n];',
  `  { id: "tropical", label: "Biển nhiệt đới", detail: "cây dừa · sóng xanh", icon: CloudSun },
  { id: "rainy_season", label: "Mưa phủ phàng", detail: "ô lớn · giọt mưa", icon: CloudRain },
  { id: "stormy_season", label: "Bão giật", detail: "lốc xoáy · sấm chớp", icon: Zap },
  { id: "morning_chill", label: "Nắng ban mai", detail: "cà phê · chim sớm", icon: Sun },
  { id: "pixel", label: "Game Pixel Retro", detail: "8-bit · arcade", icon: Sparkles },
  { id: "pirate", label: "Đảo Cướp Biển", detail: "hải đồ · đại dương", icon: CloudSun },
  { id: "sports", label: "Sân Cỏ Thể Thao", detail: "sân vận động · năng lượng", icon: Zap },
  { id: "disco", label: "Vũ Trường Disco", detail: "đèn màu · nhịp điệu", icon: Sparkles },
  { id: "laboratory", label: "Phòng Thí Nghiệm", detail: "hóa chất · điện tử", icon: Sparkles },
  { id: "egypt", label: "Ai Cập Cổ Đại", detail: "sa mạc · chữ tượng hình", icon: Sun },
  { id: "steampunk", label: "Bánh Răng Steampunk", detail: "đồng thau · hơi nước", icon: Building2 },
  { id: "art", label: "Xưởng Nghệ Thuật", detail: "màu vẽ · cọ sáng tạo", icon: Flower2 },
  { id: "ninja", label: "Võ Sĩ Ninja", detail: "trăng đêm · kiếm đạo", icon: Moon },
  { id: "coffee", label: "Quán Cà Phê", detail: "lofi jazz · mưa cửa kính", icon: Coffee },
  { id: "ai", label: "Trí Tuệ Nhân Tạo", detail: "dữ liệu · neon cyan", icon: Sparkles },
  { id: "teddy", label: "Thế Giới Gấu Bông", detail: "hộp nhạc · dịu êm", icon: Heart },
];`);
studio = studio.replace('Bird, Building2, Cloud, CloudRain, CloudSun, Eye', 'Bird, Building2, Cloud, CloudRain, CloudSun, Coffee, Eye');
studio = studio.replace('Ghost, Leaf, Mic, Moon, PartyPopper', 'Ghost, Heart, Leaf, Mic, Moon, PartyPopper');
studio = studio.replace(
  'diamondmine: 34, f1race: 38, candykingdom: 34, travel: 36, tropical: 38',
  'diamondmine: 34, f1race: 38, candykingdom: 34, travel: 36, tropical: 38, rainy_season: 42, stormy_season: 38, morning_chill: 40, pixel: 34, pirate: 36, sports: 36, disco: 34, laboratory: 30, egypt: 30, steampunk: 32, art: 34, ninja: 30, coffee: 36, ai: 30, teddy: 32');
studio = studio.replace(
  'const providedThemeAudio = scene === "tet" ? PROVIDED_THEME_AMBIENT_ASSETS.tet : scene === "space" ? PROVIDED_THEME_AMBIENT_ASSETS.space : undefined;',
  'const providedThemeAudio = scene === "tet" ? PROVIDED_THEME_AMBIENT_ASSETS.tet : scene === "space" ? PROVIDED_THEME_AMBIENT_ASSETS.space : scene === "coffee" ? PROVIDED_THEME_AMBIENT_ASSETS.coffee : scene === "rainy_season" ? PROVIDED_THEME_AMBIENT_ASSETS.rainy_season : scene === "stormy_season" ? PROVIDED_THEME_AMBIENT_ASSETS.stormy_season : scene === "morning_chill" ? PROVIDED_THEME_AMBIENT_ASSETS.morning_chill : undefined;');
fs.writeFileSync(studioPath, studio);

const ambientPath = `${project}/client/src/lib/defaultAmbient.ts`;
let ambient = fs.readFileSync(ambientPath, "utf8");
ambient = ambient.replace(
  '  space: {\n    id: "provided-theme-space",\n    name: "Không gian · Ambient vũ trụ",\n    description: "Cosmic Sci-Fi Ambient",\n    url: "https://actions.google.com/sounds/v1/science_fiction/space_synth_pad.ogg",\n    target: "space",\n    source: "provided",\n  },',
  `  space: {
    id: "provided-theme-space",
    name: "Không gian · Ambient vũ trụ",
    description: "Cosmic Sci-Fi Ambient",
    url: "https://actions.google.com/sounds/v1/science_fiction/space_synth_pad.ogg",
    target: "space",
    source: "provided",
  },
  rainy_season: { id: "provided-theme-rainy-season", name: "Mưa phủ phàng · Mưa mái tôn", description: "Lofi Chill & heavy rain", url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg", target: "rainy_season", source: "provided" },
  stormy_season: { id: "provided-theme-stormy-season", name: "Bão giật · Gió và sấm", description: "Dark Ambient Synth & storm wind", url: "https://actions.google.com/sounds/v1/weather/heavy_wind_storm.ogg", target: "stormy_season", source: "provided" },
  morning_chill: { id: "provided-theme-morning-chill", name: "Nắng ban mai · Chim sớm", description: "Acoustic Guitar & morning birds", url: "https://actions.google.com/sounds/v1/nature/morning_birds_acoustic.ogg", target: "morning_chill", source: "provided" },
  coffee: { id: "provided-theme-coffee", name: "Quán Cà Phê · Lofi Jazz", description: "Lofi Jazz & coffee shop rain", url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", target: "coffee", source: "provided" },`);
fs.writeFileSync(ambientPath, ambient);

console.log("Theme catalog expanded:", newScenes.join(", "));
