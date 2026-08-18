import React, { useState } from "react";

export const ONG_MASCOT_ASSETS = { human: "/manus-storage/ong-human_8377d607.png", hoodie: "/manus-storage/ong-hoodie_8025fa4d.png", chibi: "/manus-storage/ong-chibi_d25033af.png" } as const;
export type OngMascotVariant = keyof typeof ONG_MASCOT_ASSETS;

type Props = { className?: string; imageUrl?: string; variant?: OngMascotVariant; size?: "sm" | "md" | "lg"; label?: boolean };

export function OngLearnerAvatar({ className = "", imageUrl, variant = "hoodie", size = "md", label = false }: Props) {
  const selectedImage = imageUrl ?? ONG_MASCOT_ASSETS[variant];
  const mascotAlt = variant === "hoodie" ? "Ong mặc hoodie, mascot người học" : variant === "chibi" ? "Ong chibi, biến thể mascot" : "Ong phong cách người, avatar thay thế";
  const [failed, setFailed] = useState(false);
  const sizeClass = size === "lg" ? "h-32 w-28" : size === "sm" ? "h-12 w-10" : "h-20 w-16";
  return <span className={`ong-learner-avatar inline-flex flex-col items-center gap-1 ${className}`}>
    <span className={`${sizeClass} relative overflow-hidden rounded-2xl border-2 border-[#f4b942] bg-[#fff7e8] shadow-md`}>
      {!failed ? <img src={selectedImage} alt={mascotAlt} className="h-full w-full object-cover object-top" onError={() => setFailed(true)} /> : <svg viewBox="0 0 120 140" role="img" aria-label="Ong, avatar người học" className="h-full w-full p-2">
        <ellipse cx="60" cy="74" rx="38" ry="43" fill="#f4b942" stroke="#7f1d1d" strokeWidth="5" /><path d="M28 62h64M24 82h72" stroke="#7f1d1d" strokeWidth="10" /><ellipse cx="39" cy="42" rx="22" ry="15" fill="#fff" opacity=".75" /><ellipse cx="81" cy="42" rx="22" ry="15" fill="#fff" opacity=".75" /><circle cx="47" cy="70" r="5" fill="#241b16" /><circle cx="73" cy="70" r="5" fill="#241b16" /><path d="M48 91q12 10 24 0" fill="none" stroke="#7f1d1d" strokeWidth="4" strokeLinecap="round" /><path d="M45 112l-12 18M75 112l12 18" stroke="#2e7d32" strokeWidth="6" strokeLinecap="round" /></svg>}
    </span>
    {label ? <span className="text-[10px] font-black uppercase tracking-wide text-[#7f1d1d]">Ong · người học · hoodie</span> : null}
  </span>;
}
