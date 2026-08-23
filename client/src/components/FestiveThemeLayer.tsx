import React, { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { FESTIVE_THEME_DECORATIONS, festiveThemeFor, type FestiveEffectConfig, type FestiveThemeConfig } from "@/lib/festiveThemes";

type Point = { x: number; y: number };
type Particle = { id: number; x: number; y: number; emoji: string; offsetX: number; offsetY: number };
type Ripple = { id: number; x: number; y: number; size: number };
type ReleasePhysics = "gravity-heavy" | "float-feather" | "sticker-pin" | "bounce-elastic" | "vanish-ghost";

const RELEASE_PHYSICS: readonly ReleasePhysics[] = ["gravity-heavy", "float-feather", "sticker-pin", "bounce-elastic", "vanish-ghost"];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const pixels = (value: string) => Number.parseFloat(value) || 24;
const stableHash = (value: string) => Array.from(value).reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 7);
function readableInk(color: string) {
  const hex = color.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return "#172033";
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const luminance = channels.map((channel) => channel <= .03928 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4)).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > .34 ? "#172033" : "#f8fafc";
}
const viewportValue = (value: string, viewport: number) => {
  const normalized = value.trim();
  if (normalized.startsWith("calc(")) {
    const match = normalized.match(/^calc\(100(?:vw|vh)\s*-\s*([\d.]+)px\)$/);
    if (match) return viewport - (Number.parseFloat(match[1]) || 0);
  }
  if (normalized.endsWith("px")) return Number.parseFloat(normalized) || 0;
  if (normalized.endsWith("vw") || normalized.endsWith("vh")) return viewport * ((Number.parseFloat(normalized) || 0) / 100);
  return viewport * ((Number.parseFloat(normalized) || 0) / 100);
};
const pointFor = (position: { top: string; left: string }, size: number): Point => ({
  x: clamp(viewportValue(position.left, window.innerWidth), 8, Math.max(8, window.innerWidth - size - 8)),
  y: clamp(viewportValue(position.top, window.innerHeight), 8, Math.max(8, window.innerHeight - size - 8)),
});

type WanderPattern = "random" | "edge-vertical" | "circular" | "small-orbit" | "horizontal" | "diagonal" | "wave";

function useDraggable(initial: Point, size: number, enabled: boolean, onTap: (point: Point) => void, physics: ReleasePhysics = "float-feather") {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const [releasedPhysics, setReleasedPhysics] = useState<ReleasePhysics | null>(null);
  const drag = useRef<{ id: number; offsetX: number; offsetY: number; moved: boolean; lastX: number; lastY: number; lastAt: number; velocityX: number; velocityY: number } | null>(null);
  const releaseTimeout = useRef<number | undefined>(undefined);
  useEffect(() => setPosition(initial), [initial.x, initial.y]);
  useEffect(() => () => window.clearTimeout(releaseTimeout.current), []);
  const move = (clientX: number, clientY: number, offsetX: number, offsetY: number) => setPosition({
    x: clamp(clientX - offsetX, 6, Math.max(6, window.innerWidth - size - 6)),
    y: clamp(clientY - offsetY, 6, Math.max(6, window.innerHeight - size - 6)),
  });
  return {
    position, dragging,
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      window.clearTimeout(releaseTimeout.current);
      setReleasedPhysics(null);
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
      if (active.moved) {
        setReleasedPhysics(physics);
        setPosition((current) => {
        const maxX = Math.max(6, window.innerWidth - size - 6);
        const maxY = Math.max(6, window.innerHeight - size - 6);
        const inertialX = clamp(current.x + active.velocityX * 80, 6, maxX);
        const inertialY = clamp(current.y + active.velocityY * 54, 6, maxY);
        if (physics === "gravity-heavy" || physics === "bounce-elastic") return { x: inertialX, y: maxY };
        if (physics === "vanish-ghost") {
          releaseTimeout.current = window.setTimeout(() => { setPosition(initial); setReleasedPhysics(null); }, 1500);
          return { x: inertialX, y: inertialY };
        }
        return { x: inertialX, y: inertialY };
      });
      }
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
    reset: () => { window.clearTimeout(releaseTimeout.current); setReleasedPhysics(null); setPosition(initial); },
    wander: (pattern: WanderPattern = "random") => setPosition((current) => {
      const maxX = Math.max(8, window.innerWidth - size - 8);
      const maxY = Math.max(8, window.innerHeight - size - 8);
      const phase = Date.now() / 1000;
      if (pattern === "edge-vertical") {
        const x = Math.round(phase / 5) % 2 === 0 ? 12 : maxX - 12;
        return { x: clamp(x, 8, maxX), y: clamp(90 + ((Math.sin(phase / 5) + 1) / 2) * Math.max(0, maxY - 90), 8, maxY) };
      }
      if (pattern === "circular" || pattern === "small-orbit") {
        const radius = pattern === "small-orbit" ? 80 : Math.min(150, Math.max(90, window.innerWidth * .16));
        const centerX = maxX / 2;
        const centerY = Math.max(100, maxY * .36);
        return { x: clamp(centerX + Math.cos(phase / (pattern === "small-orbit" ? 2.5 : 4)) * radius, 8, maxX), y: clamp(centerY + Math.sin(phase / (pattern === "small-orbit" ? 2.5 : 4)) * radius, 8, maxY) };
      }
      if (pattern === "horizontal") {
        return { x: clamp(((Math.sin(phase / 6) + 1) / 2) * maxX, 8, maxX), y: clamp(current.y, 8, maxY) };
      }
      if (pattern === "diagonal") {
        const progress = (Math.sin(phase / 3) + 1) / 2;
        return { x: clamp(progress * maxX, 8, maxX), y: clamp((1 - progress) * maxY, 8, maxY) };
      }
      if (pattern === "wave") {
        const progress = (Math.sin(phase / 4) + 1) / 2;
        return { x: clamp(progress * maxX, 8, maxX), y: clamp(maxY * .26 + Math.sin(phase / 2) * Math.min(110, maxY * .18), 8, maxY) };
      }
      return { x: clamp(Math.random() * maxX, 8, maxX), y: clamp(Math.random() * maxY, 8, maxY) };
    }),
    releasedPhysics,
  };
}

function bindMascotDrag(handlers: Pick<ReturnType<typeof useDraggable>, "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel" | "onKeyDown">) { return handlers; }

function visualClass(effect?: FestiveEffectConfig) {
  return effect ? `festive-effect-${effect.type}` : "";
}

export function FestiveThemeLayer({ scene, soundEnabled = true, toneEnabled = true, vfxEnabled = true, children }: { scene?: string; soundEnabled?: boolean; toneEnabled?: boolean; vfxEnabled?: boolean; children?: React.ReactNode }) {
  const theme = festiveThemeFor(scene);
  const [shellOptions, setShellOptions] = useState(() => ({ toneEnabled: document.documentElement.dataset.festiveTone !== "false", vfxEnabled: document.documentElement.dataset.festiveVfx !== "false" }));
  const [effect, setEffect] = useState<{ id: number; config: FestiveEffectConfig } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const effectTimeout = useRef<number | undefined>(undefined);
  const config = theme;
  const resolvedToneEnabled = toneEnabled && shellOptions.toneEnabled;
  const resolvedVfxEnabled = vfxEnabled && shellOptions.vfxEnabled;
  const mascotSize = config ? 130 : 0;
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
    const handleOptions = (event: Event) => {
      const options = (event as CustomEvent<{ toneEnabled?: boolean; vfxEnabled?: boolean }>).detail;
      if (options) setShellOptions({ toneEnabled: options.toneEnabled !== false, vfxEnabled: options.vfxEnabled !== false });
    };
    window.addEventListener("study:festive-options", handleOptions);
    return () => window.removeEventListener("study:festive-options", handleOptions);
  }, []);
  useEffect(() => {
    // Âm nền được Home quản lý bằng phần tử audio duy nhất; không tắt mọi audio
    // để không làm gián đoạn âm báo hoặc bản ghi Lumi/Pomodoro.
    void soundEnabled;
  }, [soundEnabled]);
  useEffect(() => {
    const root = document.documentElement;
    if (!config || !resolvedToneEnabled) { delete root.dataset.festiveTheme; return; }
    root.dataset.festiveTheme = config.id;
    const palette = config.colors.light;
    root.style.setProperty("--festive-bg", palette.bg);
    root.style.setProperty("--festive-primary", palette.primary);
    root.style.setProperty("--festive-primary-ink", readableInk(palette.primary));
    root.style.setProperty("--festive-accent", palette.accent);
    root.style.setProperty("--festive-ink", palette.textPrimary ?? readableInk(palette.bg));
    root.style.setProperty("--festive-secondary-ink", palette.textSecondary ?? palette.textPrimary ?? readableInk(palette.bg));
    root.style.setProperty("--festive-panel", palette.panel ?? (palette.bg.startsWith("#") ? palette.bg : "#ffffff"));
    root.style.setProperty("--festive-light-bg", config.colors.light.bg);
    root.style.setProperty("--festive-light-primary", config.colors.light.primary);
    root.style.setProperty("--festive-light-accent", config.colors.light.accent);
    root.style.setProperty("--festive-light-text", config.colors.light.textPrimary ?? readableInk(config.colors.light.bg));
    root.style.setProperty("--festive-light-secondary-text", config.colors.light.textSecondary ?? config.colors.light.textPrimary ?? readableInk(config.colors.light.bg));
    root.style.setProperty("--festive-dark-bg", config.colors.dark.bg);
    root.style.setProperty("--festive-dark-primary", config.colors.dark.primary);
    root.style.setProperty("--festive-dark-primary-ink", readableInk(config.colors.dark.primary));
    root.style.setProperty("--festive-dark-accent", config.colors.dark.accent);
    root.style.setProperty("--festive-dark-text", config.colors.dark.textPrimary ?? readableInk(config.colors.dark.bg));
    root.style.setProperty("--festive-dark-secondary-text", config.colors.dark.textSecondary ?? config.colors.dark.textPrimary ?? readableInk(config.colors.dark.bg));
    return () => {
      delete root.dataset.festiveTheme;
      ["--festive-bg", "--festive-primary", "--festive-primary-ink", "--festive-accent", "--festive-ink", "--festive-secondary-ink", "--festive-panel", "--festive-dark-primary-ink", "--festive-light-secondary-text", "--festive-dark-secondary-text"].forEach((name) => root.style.removeProperty(name));
    };
  }, [config?.id, resolvedToneEnabled]);
  if (!config || !resolvedVfxEnabled) return children ? <div id="vfx-stage" className="vfx-stage-personal" aria-label="Linh vật cá nhân tương tác">{children}</div> : null;
  return <FestiveThemeContent theme={config} mascotSize={mascotSize} initialMascotPosition={initialMascotPosition} triggerEffect={triggerEffect} effect={effect} particles={particles} ripples={ripples} personalMascot={children} />;
}

function FestiveThemeContent({ theme, mascotSize, initialMascotPosition, triggerEffect, effect, particles, ripples, personalMascot }: { theme: FestiveThemeConfig; mascotSize: number; initialMascotPosition: Point; triggerEffect: (effect: FestiveEffectConfig | undefined, point: Point, emoji: string, ripple?: boolean) => void; effect: { id: number; config: FestiveEffectConfig } | null; particles: Particle[]; ripples: Ripple[]; personalMascot?: React.ReactNode }) {
  const mascot = useDraggable(initialMascotPosition, mascotSize, theme.mascot.draggable, (point) => triggerEffect(theme.mascot.clickEffect, point, theme.mascot.emoji), "float-feather");
  const groundItems = useMemo(() => {
    const targetCount = theme.groundContainer.itemCount ?? 28;
    const totalDensity = theme.groundContainer.items.reduce((sum, item) => sum + item.density, 0) || 1;
    const counts = theme.groundContainer.items.map((item) => Math.max(1, Math.round((item.density / totalDensity) * targetCount)));
    const difference = targetCount - counts.reduce((sum, count) => sum + count, 0);
    counts[counts.length - 1] = Math.max(1, counts[counts.length - 1] + difference);
    const candidates = theme.groundContainer.items.flatMap((item, itemIndex) => Array.from({ length: counts[itemIndex] }, (_, index) => ({
      ...item,
      id: `${itemIndex}-${index}`,
      bottomGap: (itemIndex * 11 + index * 17) % 41,
    })));
    const shuffled = [...candidates].sort((left, right) => stableHash(`${theme.id}:${left.id}`) - stableHash(`${theme.id}:${right.id}`));
    return shuffled.map((item, index) => ({
      ...item,
      left: `${((index * (100 / targetCount)) + (stableHash(`${theme.id}:${item.id}:x`) % 3)) % 100}%`,
      physics: RELEASE_PHYSICS[index % RELEASE_PHYSICS.length],
    }));
  }, [theme.id]);
  const ambientDecorations = useMemo(() => (FESTIVE_THEME_DECORATIONS[theme.id] ?? []).flatMap((decoration, decorationIndex) => Array.from({ length: decoration.count }, (_, index) => {
    const seed = stableHash(`${theme.id}:ambient:${decorationIndex}:${index}`);
    const durationMs = decoration.durationMs ?? (decoration.motion === "rise" ? 9600 : 8800);
    return { ...decoration, id: `${decorationIndex}-${index}`, left: `${8 + (seed % 84)}%`, top: `${(seed * 17) % 96}%`, animationDelay: `${-((index * (decoration.staggerMs ?? 420)) % durationMs)}ms`, animationDuration: `${durationMs}ms` };
  })), [theme.id]);
  useEffect(() => {
    if (!theme.mascot.draggable || theme.mascot.wanderEnabled === false || mascot.dragging) return;
    const interval = window.setInterval(() => mascot.wander(theme.mascot.wanderPattern ?? "random"), theme.mascot.wanderIntervalMs ?? 4500);
    return () => window.clearInterval(interval);
  }, [theme.id, theme.mascot.draggable, theme.mascot.wanderEnabled, theme.mascot.wanderIntervalMs, mascot.dragging]);
  const mascotDragBindings = bindMascotDrag(mascot);
  return <div id="vfx-stage" aria-label="Hiệu ứng lễ hội tương tác">
    <button type="button" className="festive-mascot mascot" aria-label={`Linh vật ${theme.displayName}; kéo thả hoặc dùng phím mũi tên để di chuyển`} title="Kéo thả linh vật · mũi tên để di chuyển" style={{ width: 130, height: 130, fontSize: 130, left: mascot.position.x, top: mascot.position.y, zIndex: 60, touchAction: "none" }} {...mascotDragBindings}>
      <span key={effect?.id} className={`festive-mascot-emoji ${mascot.dragging ? "is-dragging" : ""} ${theme.mascot.animation ? `festive-auto-${theme.mascot.animation}` : ""} ${effect ? visualClass(effect.config) : ""}`} style={{ "--festive-intensity": effect?.config.intensity ?? 1.12, "--festive-duration": `${effect?.config.durationMs ?? 400}ms` } as React.CSSProperties}>{theme.mascot.emoji}</span>
    </button>
    <button type="button" className="festive-mascot-reset" aria-label="Đặt lại vị trí linh vật lễ hội" title="Đặt lại vị trí linh vật" style={{ left: mascot.position.x + mascotSize - 18, top: mascot.position.y - 12, zIndex: 61 }} onClick={mascot.reset}><RotateCcw aria-hidden="true" size={14} /></button>
    <div className="festive-ground" style={{ height: theme.groundContainer.height, bottom: theme.groundContainer.bottom, zIndex: 55 }}>
      {groundItems.map((item) => <GroundItem key={item.id} item={item} left={item.left} bottomGap={item.bottomGap} physics={item.physics} exactSize={theme.groundContainer.exactSize === true} onTrigger={(point) => triggerEffect(item.clickEffect, point, item.emoji, theme.groundContainer.rippleEffect === true)} />)}
    </div>
    <div className="festive-visual-effects" aria-hidden="true"><div className="festive-ambient-decorations">{ambientDecorations.map((decoration) => <span key={decoration.id} className={`festive-ambient-decoration festive-ambient-${decoration.motion}`} style={{ left: decoration.left, top: decoration.top, fontSize: decoration.size, animationDelay: decoration.animationDelay, animationDuration: decoration.animationDuration }}>{decoration.emoji}</span>)}</div>{particles.map((particle) => <span key={particle.id} className="festive-particle" style={{ left: particle.x, top: particle.y, "--particle-x": `${particle.offsetX}px`, "--particle-y": `${particle.offsetY}px` } as React.CSSProperties}>{particle.emoji}</span>)}{ripples.map((ripple) => <span key={ripple.id} className="festive-ripple" style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }} />)}</div>
    {personalMascot}
  </div>;
}

function GroundItem({ item, left, bottomGap, physics, exactSize = false, onTrigger }: { item: FestiveThemeConfig["groundContainer"]["items"][number] & { id: string }; left: string; bottomGap: number; physics: ReleasePhysics; exactSize?: boolean; onTrigger: (point: Point) => void }) {
  const size = pixels(item.size);
  const displaySize = exactSize ? size : clamp(Math.max(100, size * 2), 100, 140);
  const interactiveSize = displaySize + 12;
  const initial = useMemo(() => ({ x: clamp(window.innerWidth * (Number.parseFloat(left) / 100), 6, Math.max(6, window.innerWidth - interactiveSize - 6)), y: clamp(window.innerHeight - interactiveSize - bottomGap, 6, Math.max(6, window.innerHeight - interactiveSize - 6)) }), [bottomGap, interactiveSize, left]);
  const draggable = useDraggable(initial, interactiveSize, item.draggable, (point) => onTrigger(point), physics);
  return <button type="button" className={`festive-ground-item festive-physics-${physics} ${draggable.releasedPhysics === physics ? "is-released" : ""} ${draggable.dragging ? "is-dragging" : ""}`} data-physics={physics} tabIndex={0} aria-label={`Đồ vật lễ hội ${item.emoji}; có thể kéo thả`} style={{ left: draggable.position.x, top: draggable.position.y, width: interactiveSize, height: interactiveSize, fontSize: displaySize, touchAction: "none" }} onPointerDown={draggable.onPointerDown} onPointerMove={draggable.onPointerMove} onPointerUp={draggable.onPointerUp} onPointerCancel={draggable.onPointerCancel} onKeyDown={draggable.onKeyDown}>{item.emoji}</button>;
}
