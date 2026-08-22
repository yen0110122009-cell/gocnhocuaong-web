import React, { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { festiveThemeFor, type FestiveClickEffect, type FestiveEffectConfig, type FestiveThemeConfig } from "@/lib/festiveThemes";

type Point = { x: number; y: number };
type Particle = { id: number; x: number; y: number; emoji: string; offsetX: number; offsetY: number };
type Ripple = { id: number; x: number; y: number; size: number };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const pixels = (value: string) => Number.parseFloat(value) || 24;
const pointFor = (position: { top: string; left: string }, size: number): Point => ({
  x: clamp(window.innerWidth * (Number.parseFloat(position.left) / 100), 8, Math.max(8, window.innerWidth - size - 8)),
  y: clamp(window.innerHeight * (Number.parseFloat(position.top) / 100), 8, Math.max(8, window.innerHeight - size - 8)),
});

function useDraggable(initial: Point, size: number, enabled: boolean, onTap: (point: Point) => void) {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);
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
      drag.current = { id: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false };
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      active.moved = true;
      move(event.clientX, event.clientY, active.offsetX, active.offsetY);
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* pointer already released */ }
      drag.current = null;
      setDragging(false);
      if (!active.moved) onTap({ x: event.clientX, y: event.clientY });
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

export function FestiveThemeLayer({ scene }: { scene?: string; soundEnabled?: boolean }) {
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
    const root = document.documentElement;
    if (!config) { delete root.dataset.festiveTheme; return; }
    root.dataset.festiveTheme = config.id;
    root.style.setProperty("--festive-light-bg", config.colors.light.bg);
    root.style.setProperty("--festive-light-primary", config.colors.light.primary);
    root.style.setProperty("--festive-light-accent", config.colors.light.accent);
    root.style.setProperty("--festive-dark-bg", config.colors.dark.bg);
    root.style.setProperty("--festive-dark-primary", config.colors.dark.primary);
    root.style.setProperty("--festive-dark-accent", config.colors.dark.accent);
    return () => { delete root.dataset.festiveTheme; };
  }, [config?.id]);
  if (!config) return null;
  return <FestiveThemeContent theme={config} mascotSize={mascotSize} initialMascotPosition={initialMascotPosition} triggerEffect={triggerEffect} effect={effect} particles={particles} ripples={ripples} />;
}

function FestiveThemeContent({ theme, mascotSize, initialMascotPosition, triggerEffect, effect, particles, ripples }: { theme: FestiveThemeConfig; mascotSize: number; initialMascotPosition: Point; triggerEffect: (effect: FestiveEffectConfig | undefined, point: Point, emoji: string, ripple?: boolean) => void; effect: { id: number; config: FestiveEffectConfig } | null; particles: Particle[]; ripples: Ripple[] }) {
  const mascot = useDraggable(initialMascotPosition, mascotSize, theme.mascot.draggable, (point) => triggerEffect(theme.mascot.clickEffect, point, theme.mascot.emoji));
  const groundItems = useMemo(() => theme.groundContainer.items.flatMap((item, itemIndex) => Array.from({ length: Math.max(1, Math.round(item.density * 6)) }, (_, index) => ({ ...item, id: `${itemIndex}-${index}`, left: `${((itemIndex * 23 + index * (74 / Math.max(1, Math.round(item.density * 6))) + 6) % 92)}%` }))), [theme.id]);
  return <>
    <button type="button" className="festive-mascot" aria-label={`Linh vật ${theme.displayName}; kéo thả hoặc dùng phím mũi tên để di chuyển`} title="Kéo thả linh vật · mũi tên để di chuyển" style={{ width: mascotSize, height: mascotSize, left: mascot.position.x, top: mascot.position.y, zIndex: theme.mascot.zIndex, touchAction: "none" }} onPointerDown={mascot.onPointerDown} onPointerMove={mascot.onPointerMove} onPointerUp={mascot.onPointerUp} onKeyDown={mascot.onKeyDown}>
      <span key={effect?.id} className={`festive-mascot-emoji ${mascot.dragging ? "is-dragging" : ""} ${theme.mascot.animation ? `festive-auto-${theme.mascot.animation}` : ""} ${effect ? visualClass(effect.config) : ""}`} style={{ "--festive-intensity": effect?.config.intensity ?? 1.12, "--festive-duration": `${effect?.config.durationMs ?? 400}ms` } as React.CSSProperties}>{theme.mascot.emoji}</span>
    </button>
    <button type="button" className="festive-mascot-reset" aria-label="Đặt lại vị trí linh vật lễ hội" title="Đặt lại vị trí linh vật" style={{ left: mascot.position.x + mascotSize - 18, top: mascot.position.y - 12, zIndex: theme.mascot.zIndex + 1 }} onClick={mascot.reset}><RotateCcw aria-hidden="true" size={14} /></button>
    <div className="festive-ground" style={{ height: theme.groundContainer.height, bottom: theme.groundContainer.bottom, zIndex: theme.groundContainer.zIndex }}>
      {groundItems.map((item) => <GroundItem key={item.id} item={item} left={item.left} onTrigger={(point) => triggerEffect(item.clickEffect, point, item.emoji, theme.groundContainer.rippleEffect === true)} />)}
    </div>
    <div className="festive-visual-effects" aria-hidden="true">{particles.map((particle) => <span key={particle.id} className="festive-particle" style={{ left: particle.x, top: particle.y, "--particle-x": `${particle.offsetX}px`, "--particle-y": `${particle.offsetY}px` } as React.CSSProperties}>{particle.emoji}</span>)}{ripples.map((ripple) => <span key={ripple.id} className="festive-ripple" style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }} />)}</div>
  </>;
}

function GroundItem({ item, left, onTrigger }: { item: FestiveThemeConfig["groundContainer"]["items"][number] & { id: string }; left: string; onTrigger: (point: Point) => void }) {
  const size = pixels(item.size);
  const initial = useMemo(() => ({ x: window.innerWidth * (Number.parseFloat(left) / 100), y: window.innerHeight - size - 8 }), [left, size]);
  const draggable = useDraggable(initial, size, item.draggable, (point) => onTrigger(point));
  return <button type="button" className="festive-ground-item" tabIndex={0} aria-label={`Đồ vật lễ hội ${item.emoji}; có thể kéo thả`} style={{ left: draggable.position.x, top: draggable.position.y, width: size + 12, height: size + 12, fontSize: item.size, touchAction: "none" }} onPointerDown={draggable.onPointerDown} onPointerMove={draggable.onPointerMove} onPointerUp={draggable.onPointerUp} onKeyDown={draggable.onKeyDown}>{item.emoji}</button>;
}
