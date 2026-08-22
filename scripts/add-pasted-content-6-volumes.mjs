import fs from "node:fs";
const root = "/home/ubuntu/gocnhocuaong-web";
const suffix = ", spring-blossom: 35, summer-beach: 40, autumn-leave: 35, winter-snow: 30, halloween-spooky: 35, lunar-new-year: 35, thunder-storm: 45, rainy-day: 35, sunny-day: 30, foggy-morning: 25";
for (const file of ["client/src/components/ExperienceStudio.tsx", "shared/study.ts"]) {
  const path = `${root}/${file}`;
  let text = fs.readFileSync(path, "utf8");
  if (!text.includes("spring-blossom: 35")) {
    const needle = "cyber_highschool: 35 }";
    if (!text.includes(needle)) throw new Error(`volume marker missing in ${file}`);
    text = text.replace(needle, `cyber_highschool: 35${suffix} }`);
    fs.writeFileSync(path, text);
  }
}
