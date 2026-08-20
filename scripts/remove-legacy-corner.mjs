import fs from "node:fs";

const path = "client/src/pages/Home.tsx";
const source = fs.readFileSync(path, "utf8");
const start = source.indexOf('<section id="personal-learning-corner"');
const marker = "</section><ExperienceStudio selected={selectedEmotion}";
const end = source.indexOf(marker, start);
if (start < 0 || end < 0 || end <= start) throw new Error("Không tìm thấy vùng Góc học tập cũ để thay thế.");
const next = `${source.slice(0, start)}<ExperienceStudio selected={selectedEmotion}${source.slice(end + "</section><ExperienceStudio selected={selectedEmotion}".length)}`;
fs.writeFileSync(path, next);
console.log(`Đã tách vùng legacy: ${end - start} ký tự.`);
