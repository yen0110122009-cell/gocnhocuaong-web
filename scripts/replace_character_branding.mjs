import { readFileSync, writeFileSync } from 'node:fs';

const path = 'client/src/pages/Home.tsx';
let source = readFileSync(path, 'utf8');

const lumi = `function LumiMascot({ size = "hero" }: { size?: "hero" | "compact" | "sidebar" }) { const styles = size === "hero" ? "h-56 w-48 sm:h-64 sm:w-56" : size === "sidebar" ? "h-28 w-24" : "h-20 w-16"; return <div aria-label="Lumi, bạn đồng hành của Ong" role="img" className={cn("lumi-mascot relative overflow-hidden rounded-[2.4rem] border-4 border-white bg-[#f8e7cf] shadow-[0_18px_45px_rgba(142,27,27,.2)]", styles)}><img src="/manus-storage/lumi-portrait_5dc9ca39.png" alt="Lumi đeo kính với kẹp tóc hình ngôi sao vàng" className="h-full w-full object-cover object-top" /><span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-[#2e7d32] px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-white shadow-md">Lumi</span></div>; }`;
const brand = `function Brand({ dark = false }: { dark?: boolean }) { return <div className="flex items-center gap-3"><span aria-hidden="true" className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border-2 border-white bg-[#f8e7cf] shadow-sm"><img src="/manus-storage/lumi-portrait_5dc9ca39.png" alt="" className="h-full w-full object-cover object-top" /></span><span><b className={cn("font-display block tracking-wide", dark ? "text-white" : "text-slate-950 dark:text-white")}>{BRAND.displayName}</b><small className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-700 dark:text-amber-300">Hành trình tri thức</small></span></div>; }`;

source = source.replace(/function LumiMascot[\s\S]*?\nfunction Brand/, `${lumi}\nfunction Brand`);
source = source.replace(/function Brand[\s\S]*?\nfunction Login/, `${brand}\nfunction Login`);

const dashboardMarker = '<div className="flex items-center gap-3">';
if (!source.includes('ong-portrait_00f0f800.png')) {
  source = source.replace(dashboardMarker, '<div aria-label="Ong, nhân vật học tập với kẹp tóc hình ngọn lửa" className="hidden items-center gap-2 rounded-2xl border border-[#eadfd2] bg-[#fff8ed] px-2 py-1 sm:flex"><img src="/manus-storage/ong-portrait_00f0f800.png" alt="Ong với kẹp tóc hình ngọn lửa và áo đỏ" className="h-10 w-10 rounded-xl object-cover object-top" /><span className="text-xs font-bold text-[#8e1b1b]">Ong</span></div>' + dashboardMarker);
}
writeFileSync(path, source);
