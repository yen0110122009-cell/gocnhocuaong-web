import fs from "node:fs";

const homePath = "client/src/pages/Home.tsx";
const cssPath = "client/src/index.css";
let home = fs.readFileSync(homePath, "utf8");
let css = fs.readFileSync(cssPath, "utf8");

const oldScene = '{ id: "festival", label: "Lễ hội", icon: "🏮", preview: "from-[#fff4df] via-[#d83c42] to-[#5d1725]" }';
const newScene = `${oldScene}, { id: "coffee", label: "Góc Ong · Đêm ấm", icon: "☕", preview: "from-[#241613] via-[#6f3023] to-[#a84f2f]" }`;
if (!home.includes('{ id: "coffee", label: "Góc Ong · Đêm ấm"')) {
  if (!home.includes(oldScene)) throw new Error("Không tìm thấy scene festival để chèn preset Coffee");
  home = home.replace(oldScene, newScene);
}

const oldPetPreview = '<div className="relative mt-4 h-32 overflow-hidden rounded-3xl border border-emerald-200 bg-[linear-gradient(180deg,#bcecff_0%,#f7f6d8_63%,#8fd37d_64%,#65ad59_100%)] dark:border-emerald-400/30"><span className="absolute left-6 top-5 text-3xl opacity-80" aria-hidden="true">☀️</span><span className="absolute right-8 top-6 text-2xl opacity-70" aria-hidden="true">☁️</span><span className="absolute inset-x-0 bottom-0 h-8 bg-emerald-700/25" aria-hidden="true" />';
const newPetPreview = '<div className="mascot-preview-stage relative mt-4 h-32 overflow-hidden rounded-3xl border border-emerald-200 dark:border-emerald-400/30"><span className="absolute inset-x-6 top-5 h-px bg-white/30" aria-hidden="true" /><span className="absolute inset-x-0 bottom-0 h-8 bg-black/10 dark:bg-black/20" aria-hidden="true" />';
if (home.includes(oldPetPreview)) home = home.replace(oldPetPreview, newPetPreview);

const cssAnchor = ':root[data-ambient-scene="coffee"] { --scene-page:#291713;';
if (!css.includes('/* Góc Ong dark ember reference */')) {
  const block = `\n/* Góc Ong dark ember reference: visual treatment inspired by the supplied shell, without opaque overlays. */\n:root[data-ambient-scene="coffee"] {\n  --scene-page:#211512; --scene-page-alt:#3b201a; --scene-side:#2b1916; --scene-header:#321c18;\n  --scene-card:#45251d; --scene-text:#fff7ed; --scene-muted:#f2d3bc; --scene-border:#b87955;\n  --scene-accent:#f08a4b; --scene-accent-alt:#d8b36a; --scene-button-text:#25130d; --scene-shadow:rgba(240,138,75,.18);\n}\n:root[data-ambient-scene="coffee"] .mascot-preview-stage {\n  background:radial-gradient(circle at 76% 24%,rgba(240,138,75,.22),transparent 18%),\n    linear-gradient(135deg,#241613 0%,#4b251c 55%,#8d4029 100%);\n}\n:root[data-ambient-scene="coffee"] .mascot-preview-stage::after {\n  content:"☕  ✦  🐝"; position:absolute; right:1rem; bottom:.55rem; color:#f7c98e;\n  font-size:1.35rem; letter-spacing:.32rem; opacity:.78; pointer-events:none;\n}\n`; 
  if (!css.includes(cssAnchor)) throw new Error("Không tìm thấy token coffee để neo CSS");
  css = css.replace(cssAnchor, block + cssAnchor);
}

fs.writeFileSync(homePath, home);
fs.writeFileSync(cssPath, css);
console.log("Refined Coffee/Góc Ong theme and mascot preview");
