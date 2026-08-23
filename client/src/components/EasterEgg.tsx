import { useEffect, useState } from "react";
import { DEFAULT_EASTER_EGG_MESSAGE, readEasterEggMessage } from "@/lib/easterEgg";

type EasterEggProps = { soundEnabled?: boolean };

function playCelebrationTone(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    const context = new AudioContextCtor();
    const start = context.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.07, start + index * 0.08 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.08 + 0.22);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start + index * 0.08);
      oscillator.stop(start + index * 0.08 + 0.24);
    });
    window.setTimeout(() => void context.close(), 550);
  } catch {
    // Web Audio may be unavailable or blocked; the visual celebration still works.
  }
}

export function EasterEgg({ soundEnabled = true }: EasterEggProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_EASTER_EGG_MESSAGE);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const syncMessage = () => setMessage(readEasterEggMessage());
    syncMessage();
    window.addEventListener("storage", syncMessage);
    return () => window.removeEventListener("storage", syncMessage);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const openMessage = () => {
    setMessage(readEasterEggMessage());
    setOpen(true);
    setCelebrating(true);
    playCelebrationTone(soundEnabled);
    window.setTimeout(() => setCelebrating(false), 1400);
  };

  return <>
    <button
      type="button"
      aria-label="Mở lời nhắn Easter Egg"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={openMessage}
      className="easter-egg-trigger fixed top-5 right-5 z-[999] grid h-10 w-10 place-items-center rounded-full border border-emerald-200/70 bg-white/85 text-[32px] leading-none shadow-lg shadow-emerald-950/15 backdrop-blur-sm opacity-60 transition duration-200 hover:scale-110 hover:opacity-100 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-300/30 dark:bg-slate-900/85 dark:hover:bg-slate-800"
    >
      <span aria-hidden="true">🍀</span>
    </button>

    {open ? <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      {celebrating ? <div className="easter-egg-fireworks" aria-hidden="true">{["🎉", "✨", "🎊", "✨", "🎉", "🌟", "🎊", "✨", "🎉", "🌟", "🎊", "✨"].map((emoji, index) => <span key={`${emoji}-${index}`}>{emoji}</span>)}</div> : null}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="easter-egg-title"
        className="w-full max-w-sm rounded-3xl border border-emerald-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-emerald-300/25 dark:bg-slate-900 dark:text-slate-100"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Lời nhắn từ bạn 🍀</p>
        <h2 id="easter-egg-title" className="sr-only">Lời nhắn từ bạn</h2>
        <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center text-base font-bold leading-7 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-950/30 dark:text-emerald-50">{message || DEFAULT_EASTER_EGG_MESSAGE}</p>
        <button type="button" onClick={() => setOpen(false)} className="primary-button mt-5 w-full justify-center">Đóng</button>
      </section>
    </div> : null}
  </>;
}
