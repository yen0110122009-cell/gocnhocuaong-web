import fs from "node:fs";

const root = "/home/ubuntu/gocnhocuaong-web";
const edit = (file, replacements) => {
  const path = `${root}/${file}`;
  let text = fs.readFileSync(path, "utf8");
  for (const [from, to] of replacements) {
    if (!text.includes(from)) throw new Error(`Missing marker in ${file}: ${from.slice(0, 80)}`);
    text = text.replace(from, to);
  }
  fs.writeFileSync(path, text);
};

edit("client/src/lib/defaultAmbient.ts", [[
'  coffee: { id: "provided-theme-coffee", name: "Quán Cà Phê · Lofi Jazz", description: "Lofi Jazz & coffee shop rain", url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", target: "coffee", source: "provided" },\n',
'  coffee: { id: "provided-theme-coffee", name: "Quán Cà Phê · Lofi Jazz", description: "Lofi Jazz & coffee shop rain", url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", target: "coffee", source: "provided" },\n  sweet_strawberry: { id: "provided-theme-sweet-strawberry", name: "Nữ sinh Dâu Tây · Music Box", description: "Acoustic Guitar vui tươi & music box", url: "https://actions.google.com/sounds/v1/music/upbeat_playful_acoustic.ogg", target: "sweet_strawberry", source: "provided" },\n  black_ribbon: { id: "provided-theme-black-ribbon", name: "Nữ sinh Cool Girl · Lo-Fi Synth", description: "Lo-Fi Synth trầm & bass sâu", url: "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg", target: "black_ribbon", source: "provided" },\n  library_chill: { id: "provided-theme-library-chill", name: "Nữ sinh Thư viện · Library Chill", description: "Mưa ngoài cửa sổ & piano chậm", url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", target: "library_chill", source: "provided" },\n  after_school: { id: "provided-theme-after-school", name: "Nữ sinh Tan trường · 8-bit", description: "Nhịp phách tươi vui kiểu arcade", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "after_school", source: "provided" },\n  classic_academy: { id: "provided-theme-classic-academy", name: "Nữ sinh Nghệ thuật · Cổ điển", description: "Hòa tấu violin & piano", url: "https://actions.google.com/sounds/v1/music/guzheng_flute_chill.ogg", target: "classic_academy", source: "provided" },\n  cyber_highschool: { id: "provided-theme-cyber-highschool", name: "Nữ sinh Y2K Cyber · Synthwave", description: "Pop Y2K Synthwave sôi động", url: "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg", target: "cyber_highschool", source: "provided" },\n'
]]);

edit("client/src/pages/Home.tsx", [[
'const AUDIO_BACKED_SCENE_IDS = new Set(["morning", "rain", "storm", "tet", "space", "rainy_season", "stormy_season", "morning_chill", "coffee"]);',
'const AUDIO_BACKED_SCENE_IDS = new Set(["morning", "rain", "storm", "tet", "space", "rainy_season", "stormy_season", "morning_chill", "coffee", "sweet_strawberry", "black_ribbon", "library_chill", "after_school", "classic_academy", "cyber_highschool"]);'
], [
'coffee: { label: PROVIDED_THEME_AMBIENT_ASSETS.coffee.name, url: PROVIDED_THEME_AMBIENT_ASSETS.coffee.url } };',
'coffee: { label: PROVIDED_THEME_AMBIENT_ASSETS.coffee.name, url: PROVIDED_THEME_AMBIENT_ASSETS.coffee.url }, sweet_strawberry: { label: PROVIDED_THEME_AMBIENT_ASSETS.sweet_strawberry.name, url: PROVIDED_THEME_AMBIENT_ASSETS.sweet_strawberry.url }, black_ribbon: { label: PROVIDED_THEME_AMBIENT_ASSETS.black_ribbon.name, url: PROVIDED_THEME_AMBIENT_ASSETS.black_ribbon.url }, library_chill: { label: PROVIDED_THEME_AMBIENT_ASSETS.library_chill.name, url: PROVIDED_THEME_AMBIENT_ASSETS.library_chill.url }, after_school: { label: PROVIDED_THEME_AMBIENT_ASSETS.after_school.name, url: PROVIDED_THEME_AMBIENT_ASSETS.after_school.url }, classic_academy: { label: PROVIDED_THEME_AMBIENT_ASSETS.classic_academy.name, url: PROVIDED_THEME_AMBIENT_ASSETS.classic_academy.url }, cyber_highschool: { label: PROVIDED_THEME_AMBIENT_ASSETS.cyber_highschool.name, url: PROVIDED_THEME_AMBIENT_ASSETS.cyber_highschool.url } };'
], [
'{ id: "desert", label: "Sa mạc", detail:',
'{ id: "sweet_strawberry", label: "Nữ sinh Dâu Tây", detail: "Hồng kem, dâu tây và music box vui tươi.", preview: "from-[#fff0f5] via-[#f9a8d4] to-[#9d174d]", icon: "🍓" }, { id: "black_ribbon", label: "Nữ sinh Cool Girl", detail: "Đen khói, tím neon và synth trầm.", preview: "from-[#f3f4f6] via-[#a78bfa] to-[#09090b]", icon: "🖤" }, { id: "library_chill", label: "Nữ sinh Thư viện", detail: "Sách cũ, tách trà và mưa ngoài cửa sổ.", preview: "from-[#fdfbf7] via-[#d6c6a8] to-[#44403c]", icon: "📖" }, { id: "after_school", label: "Nữ sinh Tan trường", detail: "Màu chanh pastel và nhịp arcade vui nhộn.", preview: "from-[#fef9c3] via-[#facc15] to-[#312e81]", icon: "🎒" }, { id: "classic_academy", label: "Nữ sinh Nghệ thuật", detail: "Học viện xanh ngọc và giai điệu cổ điển.", preview: "from-[#f0fdf4] via-[#6ee7b7] to-[#022c22]", icon: "🎻" }, { id: "cyber_highschool", label: "Nữ sinh Y2K Cyber", detail: "Hologram xanh tím và synthwave.", preview: "from-[#eef2ff] via-[#22d3ee] to-[#1e1b4b]", icon: "💿" }, { id: "desert", label: "Sa mạc", detail:'
]]);

edit("shared/study.ts", [
  ['"tropical" | "rainy_season"', '"tropical" | "sweet_strawberry" | "black_ribbon" | "library_chill" | "after_school" | "classic_academy" | "cyber_highschool" | "rainy_season"'],
  ['"tropical"].includes(String(candidate.scene)', '"tropical", "sweet_strawberry", "black_ribbon", "library_chill", "after_school", "classic_academy", "cyber_highschool"].includes(String(candidate.scene)'],
  ['"tropical"] as AmbientScenePreference[]).map', '"tropical", "sweet_strawberry", "black_ribbon", "library_chill", "after_school", "classic_academy", "cyber_highschool"] as AmbientScenePreference[]).map'],
  ['favoriteAmbientScenes: Array.isArray(source.favoriteAmbientScenes)\n      ? (source.favoriteAmbientScenes.filter((scene, index, list) => typeof scene === "string" && list.indexOf(scene) === index) as AmbientScenePreference[])\n      : [base.defaultAmbientScene ?? "morning"],', 'favoriteAmbientScenes: Array.isArray(source.favoriteAmbientScenes)\n      ? (source.favoriteAmbientScenes.filter((scene, index, list) => typeof scene === "string" && list.indexOf(scene) === index) as AmbientScenePreference[])\n      : [base.defaultAmbientScene ?? "morning"],']
]);

fs.appendFileSync(`${root}/client/src/index.css`, `\n/* Overlay accessibility guard: decorations stay visible but never wash out text or controls. */\n:root[data-ambient-scene] #root > div.min-h-screen::before { opacity: .14 !important; pointer-events: none !important; }\n:root[data-ambient-scene] #root > div.min-h-screen::after { opacity: .24 !important; pointer-events: none !important; mix-blend-mode: normal !important; }\n:root[data-ambient-scene] #root > div.min-h-screen > * { position: relative; z-index: 1; }\n`);

console.log("Theme audio, six new scenes, and overlay guard applied.");
