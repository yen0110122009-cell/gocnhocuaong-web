import fs from "node:fs";
const source = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
for (const marker of ["function Login", "function Brand", "<main className=\"min-h-screen", "<main className=\"relative"]) {
  const index = source.indexOf(marker);
  console.log(`--- ${marker} @ ${index} ---`);
  if (index >= 0) console.log(source.slice(Math.max(0, index - 260), index + 900));
}
