import fs from "node:fs";

const path = "shared/study.ts";
let source = fs.readFileSync(path, "utf8");
for (const key of ["spring-blossom", "summer-beach", "autumn-leave", "winter-snow", "halloween-spooky", "lunar-new-year", "thunder-storm", "rainy-day", "sunny-day", "foggy-morning", "cyber-highschool"]) {
  source = source.replaceAll(`${key}:`, `"${key}":`);
}
fs.writeFileSync(path, source);
