import { readFileSync, writeFileSync } from 'node:fs';
const path = 'client/src/pages/Home.tsx';
let source = readFileSync(path, 'utf8');
const misplaced = '<div aria-label="Ong, nhân vật học tập với kẹp tóc hình ngọn lửa" className="hidden items-center gap-2 rounded-2xl border border-[#eadfd2] bg-[#fff8ed] px-2 py-1 sm:flex"><img src="/manus-storage/ong-portrait_00f0f800.png" alt="Ong với kẹp tóc hình ngọn lửa và áo đỏ" className="h-10 w-10 rounded-xl object-cover object-top" /><span className="text-xs font-bold text-[#8e1b1b]">Ong</span></div>';
source = source.replace(`${misplaced}<div className="flex items-center gap-3">`, '<div className="flex items-center gap-3">');
const ong = `function OngMascot({ size = "compact" }: { size?: "compact" | "sidebar" }) { const styles = size === "sidebar" ? "h-28 w-24" : "h-20 w-16"; return <div aria-label="Ong, nhân vật học tập với kẹp tóc hình ngọn lửa" role="img" className={cn("ong-mascot relative overflow-hidden rounded-[2.2rem] border-4 border-white bg-[#f8e7cf] shadow-[0_14px_32px_rgba(142,27,27,.18)]", styles)}><img src="/manus-storage/ong-portrait_00f0f800.png" alt="Ong với kẹp tóc hình ngọn lửa và áo đỏ" className="h-full w-full object-cover object-top" /><span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-[#c62828] px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-white shadow-md">Ong</span></div>; }`;
source = source.replace('\nfunction Brand', `\n${ong}\nfunction Brand`);
source = source.replace('<LumiMascot /></div></section><form', '<div className="flex items-end gap-3"><LumiMascot /><OngMascot /></div></div></section><form');
writeFileSync(path, source);
