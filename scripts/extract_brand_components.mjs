import { readFileSync } from 'node:fs';
const source = readFileSync('client/src/pages/Home.tsx', 'utf8');
for (const marker of ['function LumiMascot', 'function Brand', 'function Login']) {
  const start = source.indexOf(marker);
  const next = source.indexOf('\nfunction ', start + marker.length);
  console.log(`--- ${marker} ---`);
  console.log(source.slice(start, next > start ? next : start + 12000));
}
