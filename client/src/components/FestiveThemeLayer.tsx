import React, { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { FESTIVE_THEME_DECORATIONS, festiveThemeFor, type FestiveClickEffect, type FestiveEffectConfig, type FestiveThemeConfig } from "@/lib/festiveThemes";

type Point = { x: number; y: number };
type Particle = { id: number; x: number; y: number; emoji: string; offsetX: number; offsetY: number };
type Ripple = { id: number; x: number; y: number; size: number };
type ReleasePhysics = "ground" | "float";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const pixels = (value: string) => Number.parseFloat(value) || 24;
function readableInk(color: string) {
  const hex = color.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return "#172033";
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const luminance = channels.map((channel) => channel <= .03928 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4)).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > .34 ? "#172033" : "#f8fafc";
}
const pointFor = (position: { top: string; left: string }, size: number): Point => ({
  x: clamp(window.innerWidth * (Number.parseFloat(position.left) / 100), 8, Math.max(8, window.innerWidth - size - 8)),
  y: clamp(window.innerHeight * (Number.parseFloat(position.top) / 100), 8, Math.max(8, window.innerHeight - size - 8)),
});

function useDraggable(initial: Point, size: number, enabled: boolean, onTap: (point: Point) => void, physics: ReleasePhysics = "float") {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; offsetX: number; offsetY: number; moved: boolean; lastX: number; lastY: number; lastAt: number; velocityX: number; velocityY: number } | null>(null);
  useEffect(() => setPosition(initial), [initial.x, initial.y]);
  const move = (clientX: number, clientY: number, offsetX: number, offsetY: number) => setPosition({
    x: clamp(clientX - offsetX, 6, Math.max(6, window.innerWidth - size - 6)),
    y: clamp(clientY - offsetY, 6, Math.max(6, window.innerHeight - size - 6)),
  });
  return {
    position, dragging,
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      drag.current = { id: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false, lastX: event.clientX, lastY: event.clientY, lastAt: performance.now(), velocityX: 0, velocityY: 0 };
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      active.moved = true;
      const now = performance.now();
      const elapsed = Math.max(1, now - active.lastAt);
      active.velocityX = (event.clientX - active.lastX) / elapsed;
      active.velocityY = (event.clientY - active.lastY) / elapsed;
      active.lastX = event.clientX;
      active.lastY = event.clientY;
      active.lastAt = now;
      move(event.clientX, event.clientY, active.offsetX, active.offsetY);
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* pointer already released */ }
      drag.current = null;
      setDragging(false);
      if (!active.moved) onTap({ x: event.clientX, y: event.clientY });
      if (active.moved) setPosition((current) => {
        const maxX = Math.max(6, window.innerWidth - size - 6);
        const maxY = Math.max(6, window.innerHeight - size - 6);
        const inertialX = clamp(current.x + active.velocityX * 80, 6, maxX);
        const inertialY = clamp(current.y + active.velocityY * 54, 6, maxY);
        return physics === "ground" ? { x: inertialX, y: maxY } : { x: inertialX, y: inertialY };
      });
    },
    onPointerCancel: (event: React.PointerEvent<HTMLElement>) => {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* pointer already released */ }
      drag.current = null;
      setDragging(false);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      const distance = event.shiftKey ? 24 : 12;
      const directions: Record<string, Point> = { ArrowLeft: { x: -distance, y: 0 }, ArrowRight: { x: distance, y: 0 }, ArrowUp: { x: 0, y: -distance }, ArrowDown: { x: 0, y: distance } };
      if (!directions[event.key]) return;
      event.preventDefault();
      const direction = directions[event.key];
      setPosition((current) => ({ x: clamp(current.x + direction.x, 6, Math.max(6, window.innerWidth - size - 6)), y: clamp(current.y + direction.y, 6, Math.max(6, window.innerHeight - size - 6)) }));
    },
    reset: () => setPosition(initial),
  };
}

function visualClass(effect?: FestiveEffectConfig) {
  return effect ? `festive-effect-${effect.type}` : "";
}

export function FestiveThemeLayer({ scene, soundEnabled = true }: { scene?: string; soundEnabled?: boolean }) {
  const theme = festiveThemeFor(scene);
  const [effect, setEffect] = useState<{ id: number; config: FestiveEffectConfig } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const effectTimeout = useRef<number | undefined>(undefined);
  const config = theme;
  const mascotSize = config ? pixels(config.mascot.size) : 0;
  const initialMascotPosition = useMemo(() => config ? pointFor(config.mascot.initialPosition, mascotSize) : { x: 0, y: 0 }, [config?.id, mascotSize]);
  const triggerEffect = (clickEffect: FestiveEffectConfig | undefined, point: Point, emoji: string, allowRipple = false) => {
    if (!clickEffect) return;
    window.clearTimeout(effectTimeout.current);
    setEffect({ id: Date.now(), config: clickEffect });
    if (clickEffect.type === "particle-burst") {
      const now = Date.now();
      const offsets = [{ x: 0, y: -44 }, { x: 38, y: -16 }, { x: 30, y: 35 }, { x: -30, y: 35 }, { x: -38, y: -16 }];
      setParticles(offsets.map((offset, index) => ({ id: now + index, x: point.x, y: point.y, emoji, offsetX: offset.x, offsetY: offset.y })));
      window.setTimeout(() => setParticles([]), clickEffect.durationMs);
    }
    if (clickEffect.type === "ripple-wave" || allowRipple) {
      const now = Date.now();
      setRipples((items) => [...items, { id: now, x: point.x, y: point.y, size: 76 * clickEffect.intensity }]);
      window.setTimeout(() => setRipples((items) => items.filter((item) => item.id !== now)), clickEffect.durationMs);
    }
    effectTimeout.current = window.setTimeout(() => setEffect(null), clickEffect.durationMs);
  };
  useEffect(() => () => window.clearTimeout(effectTimeout.current), []);
  useEffect(() => {
    // Âm nền được Home quản lý bằng phần tử audio duy nhất; không tắt mọi audio
    // để không làm gián đoạn âm báo hoặc bản ghi Lumi/Pomodoro.
    void soundEnabled;
  }, [soundEnabled]);
  useEffect(() => {
    const root = document.documentElement;
    if (!config) { delete root.dataset.festiveTheme; return; }
    root.dataset.festiveTheme = config.id;
    const palette = config.colors.light;
    root.style.setProperty("--festive-bg", palette.bg);
    root.style.setProperty("--festive-primary", palette.primary);
    root.style.setProperty("--festive-accent", palette.accent);
    root.style.setProperty("--festive-ink", readableInk(palette.bg));
    root.style.setProperty("--festive-panel", palette.bg);
    root.style.setProperty("--festive-light-bg", config.colors.light.bg);
    root.style.setProperty("--festive-light-primary", config.colors.light.primary);
    root.style.setProperty("--festive-light-accent", config.colors.light.accent);
    root.style.setProperty("--festive-light-text", readableInk(config.colors.light.bg));
    root.style.setProperty("--festive-dark-bg", config.colors.dark.bg);
    root.style.setProperty("--festive-dark-primary", config.colors.dark.primary);
    root.style.setProperty("--festive-dark-accent", config.colors.dark.accent);
    root.style.setProperty("--festive-dark-text", readableInk(config.colors.dark.bg));
    return () => {
      delete root.dataset.festiveTheme;
      ["--festive-bg", "--festive-primary", "--festive-accent", "--festive-ink", "--festive-panel"].forEach((name) => root.style.removeProperty(name));
    };
  }, [config?.id]);
  if (!config) return null;
  return <FestiveThemeContent theme={config} mascotSize={mascotSize} initialMascotPosition={initialMascotPosition} triggerEffect={triggerEffect} effect={effect} particles={particles} ripples={ripples} />;
}

function FestiveThemeContent({ theme, mascotSize, initialMascotPosition, triggerEffect, effect, particles, ripples }: { theme: FestiveThemeConfig; mascotSize: number; initialMascotPosition: Point; triggerEffect: (effect: FestiveEffectConfig | undefined, point: Point, emoji: string, ripple?: boolean) => void; effect: { id: number; config: FestiveEffectConfig } | null; particles: Particle[]; ripples: Ripple[] }) {
  const mascot = useDraggable(initialMascotPosition, mascotSize, theme.mascot.draggable, (point) => triggerEffect(theme.mascot.clickEffect, point, theme.mascot.emoji), "float");
  const groundItems = useMemo(() => {
    const totalDensity = theme.groundContainer.items.reduce((sum, item) => sum + item.density, 0) || 1;
    const counts = theme.groundContainer.items.map((item) => Math.max(1, Math.round((item.density / totalDensity) * 28)));
    const difference = 28 - counts.reduce((sum, count) => sum + count, 0);
    counts[counts.length - 1] = Math.max(1, counts[counts.length - 1] + difference);
    return theme.groundContainer.items.flatMap((item, itemIndex) => Array.from({ length: counts[itemIndex] }, (_, index) => ({
      ...item,
      id: `${itemIndex}-${index}`,
      left: `${((itemIndex * 17 + index * (100 / counts[itemIndex]) + 2) % 100)}%`,
      bottomGap: (itemIndex * 11 + index * 17) % 41,
    })));
  }, [theme.id]);
  const ambientDecorations = useMemo(() => (FESTIVE_THEME_DECORATIONS[theme.id] ?? []).flatMap((decoration, groupIndex) => Array.from({ length: decoration.count }, (_, index) => ({
    ...decoration,
    id: `${theme.id}-${groupIndex}-${index}`,
    left: `${(groupIndex * 19 + index * 37 + 7) % 96}%`,
    top: decoration.motion === "rest" ? `${84 + ((index * 7) % 12)}%` : `${(groupIndex * 23 + index * 17 + 4) % 78}%`,
    delay: `${-((groupIndex * 0.9 + index * 0.41) % 5.8)}s`,
  }))), [theme.id]);
  return <>
    <div className="festive-ambient-decorations" aria-hidden="true">{ambientDecorations.map((decoration) => <span key={decoration.id} className={`festive-ambient-decoration festive-ambient-${decoration.motion}`} style={{ left: decoration.left, top: decoration.top, fontSize: decoration.size, animationDelay: decoration.delay }}>{decoration.emoji}</span>)}</div>
    <button type="button" className="festive-mascot" aria-label={`Linh vật ${theme.displayName}; kéo thả hoặc dùng phím mũi tên để di chuyển`} title="Kéo thả linh vật · mũi tên để di chuyển" style={{ width: mascotSize, height: mascotSize, left: mascot.position.x, top: mascot.position.y, zIndex: 60, touchAction: "none" }} onPointerDown={mascot.onPointerDown} onPointerMove={mascot.onPointerMove} onPointerUp={mascot.onPointerUp} onPointerCancel={mascot.onPointerCancel} onKeyDown={mascot.onKeyDown}>
      <span key={effect?.id} className={`festive-mascot-emoji ${mascot.dragging ? "is-dragging" : ""} ${theme.mascot.animation ? `festive-auto-${theme.mascot.animation}` : ""} ${effect ? visualClass(effect.config) : ""}`} style={{ "--festive-intensity": effect?.config.intensity ?? 1.12, "--festive-duration": `${effect?.config.durationMs ?? 400}ms` } as React.CSSProperties}>{theme.mascot.emoji}</span>
    </button>
    <button type="button" className="festive-mascot-reset" aria-label="Đặt lại vị trí linh vật lễ hội" title="Đặt lại vị trí linh vật" style={{ left: mascot.position.x + mascotSize - 18, top: mascot.position.y - 12, zIndex: 61 }} onClick={mascot.reset}><RotateCcw aria-hidden="true" size={14} /></button>
    <div className="festive-ground" style={{ height: theme.groundContainer.height, bottom: theme.groundContainer.bottom, zIndex: 55 }}>
      {groundItems.map((item) => <GroundItem key={item.id} item={item} left={item.left} bottomGap={item.bottomGap} onTrigger={(point) => triggerEffect(item.clickEffect, point, item.emoji, theme.groundContainer.rippleEffect === true)} />)}
    </div>
    <div className="festive-visual-effects" aria-hidden="true">{particles.map((particle) => <span key={particle.id} className="festive-particle" style={{ left: particle.x, top: particle.y, "--particle-x": `${particle.offsetX}px`, "--particle-y": `${particle.offsetY}px` } as React.CSSProperties}>{particle.emoji}</span>)}{ripples.map((ripple) => <span key={ripple.id} className="festive-ripple" style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }} />)}</div>
  </>;
}

function GroundItem({ item, left, bottomGap, onTrigger }: { item: FestiveThemeConfig["groundContainer"]["items"][number] & { id: string }; left: string; bottomGap: number; onTrigger: (point: Point) => void }) {
  const size = pixels(item.size);
  const displaySize = clamp(Math.max(80, size * 2), 80, 140);
  const interactiveSize = displaySize + 12;
  const initial = useMemo(() => ({ x: clamp(window.innerWidth * (Number.parseFloat(left) / 100), 6, Math.max(6, window.innerWidth - interactiveSize - 6)), y: clamp(window.innerHeight - interactiveSize - bottomGap, 6, Math.max(6, window.innerHeight - interactiveSize - 6)) }), [bottomGap, interactiveSize, left]);
  const draggable = useDraggable(initial, interactiveSize, item.draggable, (point) => onTrigger(point), "ground");
  return <button type="button" className="festive-ground-item" tabIndex={0} aria-label={`Đồ vật lễ hội ${item.emoji}; có thể kéo thả`} style={{ left: draggable.position.x, top: draggable.position.y, width: interactiveSize, height: interactiveSize, fontSize: displaySize, touchAction: "none" }} onPointerDown={draggable.onPointerDown} onPointerMove={draggable.onPointerMove} onPointerUp={draggable.onPointerUp} onPointerCancel={draggable.onPointerCancel} onKeyDown={draggable.onKeyDown}>{item.emoji}</button>;
}
