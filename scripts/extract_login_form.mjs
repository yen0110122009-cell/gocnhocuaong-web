import fs from "node:fs";
const source = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const start = source.indexOf('<main className="min-h-screen');
console.log(source.slice(start, start + 2600));
