import fs from "node:fs";
const path = "client/src/components/ExperienceStudio.tsx";
let s = fs.readFileSync(path, "utf8");
const pattern = /<button type="button" aria-label=\{`Phát âm nền cho cảm xúc \$\{item\.label\}`\} onClick=\{\(\) => toggleAmbient\([^)]*\)\} className="absolute bottom-2 right-2 rounded-lg border border-\[#c62828\]\/20 bg-white\/95 p-1\.5 text-\[#c62828\] shadow-sm"><Volume2 className="h-3\.5 w-3\.5" \/><\/button>/g;
const before = s;
s = s.replace(pattern, "");
if (s === before) throw new Error("Không tìm thấy nút âm nền cảm xúc để loại bỏ");
fs.writeFileSync(path, s);
