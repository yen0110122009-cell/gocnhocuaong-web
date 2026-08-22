import fs from "node:fs";

const studyPath = "shared/study.ts";
let study = fs.readFileSync(studyPath, "utf8");
const additions = ' | "diamondmine" | "f1race" | "candykingdom" | "travel" | "tropical"';
study = study.replace(/(export type AmbientScenePreference = [^;]+);/, (match, body) => body.includes('"diamondmine"') ? match : `${body}${additions};`);
study = study.replaceAll('"cyberrace", "foodfestival"', '"cyberrace", "foodfestival", "diamondmine", "f1race", "candykingdom", "travel", "tropical"');
fs.writeFileSync(studyPath, study);

const cssPath = "client/src/index.css";
let css = fs.readFileSync(cssPath, "utf8");
const cssBlock = `\n/* Theme ideas: visual-only layers, no external image assets. */
:root[data-ambient-scene="diamondmine"] { --scene-page:#16202a; --scene-page-alt:#304457; --scene-side:#111923; --scene-header:#40627a; --scene-card:#223241; --scene-text:#f3fbff; --scene-muted:#c7d8e4; --scene-border:#6ea4bc; --scene-accent:#65e7ff; --scene-accent-alt:#f6d365; }
:root[data-ambient-scene="f1race"] { --scene-page:#171a22; --scene-page-alt:#343946; --scene-side:#11131a; --scene-header:#8d2431; --scene-card:#242832; --scene-text:#fff7f3; --scene-muted:#d5c9c7; --scene-border:#a96b70; --scene-accent:#ef3340; --scene-accent-alt:#f5d547; }
:root[data-ambient-scene="candykingdom"] { --scene-page:#fff1f8; --scene-page-alt:#ffd8ea; --scene-side:#7f3f75; --scene-header:#c75b91; --scene-card:#fff8fc; --scene-text:#321c35; --scene-muted:#704c70; --scene-border:#e79ac2; --scene-accent:#ef5da8; --scene-accent-alt:#7adbd4; }
:root[data-ambient-scene="travel"] { --scene-page:#eaf6f7; --scene-page-alt:#c9e8eb; --scene-side:#176b78; --scene-header:#2d9aa4; --scene-card:#f8ffff; --scene-text:#12343b; --scene-muted:#416970; --scene-border:#77b9bf; --scene-accent:#e9804c; --scene-accent-alt:#f2ca63; }
:root[data-ambient-scene="tropical"] { --scene-page:#dff7ed; --scene-page-alt:#9eddd0; --scene-side:#075b61; --scene-header:#149b8d; --scene-card:#f5fffb; --scene-text:#103c3b; --scene-muted:#356966; --scene-border:#62b8a5; --scene-accent:#ff8566; --scene-accent-alt:#ffe16a; }
:root[data-ambient-scene="diamondmine"] body::after { content:"✦  ◇  ✧  ◇  ✦"; }
:root[data-ambient-scene="f1race"] body::after { content:"🏁  ·  🏎️  ·  🏁"; }
:root[data-ambient-scene="candykingdom"] body::after { content:"🍭  ✦  🍬  ✦  🍭"; }
:root[data-ambient-scene="travel"] body::after { content:"✈  ·  🧳  ·  🗺"; }
:root[data-ambient-scene="tropical"] body::after { content:"🌴  ·  ≋  ·  🌴"; }
:root[data-ambient-scene="diamondmine"] #root > div.min-h-screen::before,
:root[data-ambient-scene="f1race"] #root > div.min-h-screen::before,
:root[data-ambient-scene="candykingdom"] #root > div.min-h-screen::before,
:root[data-ambient-scene="travel"] #root > div.min-h-screen::before,
:root[data-ambient-scene="tropical"] #root > div.min-h-screen::before { content:""; position:fixed; inset:0; z-index:54; pointer-events:none; opacity:.34; background:radial-gradient(circle at 85% 14%, color-mix(in srgb,var(--scene-accent-alt) 65%,transparent), transparent 16rem), linear-gradient(145deg, color-mix(in srgb,var(--scene-page-alt) 30%,transparent), transparent 54%); }
`;
if (!css.includes('data-ambient-scene="diamondmine"')) css += cssBlock;
fs.writeFileSync(cssPath, css);
