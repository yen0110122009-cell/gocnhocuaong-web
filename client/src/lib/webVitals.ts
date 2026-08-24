type VitalName = "LCP" | "CLS" | "INP" | "FCP";

type VitalDetail = {
  name: VitalName;
  value: number;
  route: string;
  measuredAt: string;
};

type LayoutShiftEntry = PerformanceEntry & { value?: number; hadRecentInput?: boolean };
type EventTimingEntry = PerformanceEntry & { duration?: number; interactionId?: number };

let started = false;

function emitVital(name: VitalName, value: number) {
  if (!Number.isFinite(value) || typeof window === "undefined") return;
  const detail: VitalDetail = {
    name,
    value: Math.round(value * 100) / 100,
    route: `${window.location.pathname}${window.location.search}`,
    measuredAt: new Date().toISOString(),
  };
  window.dispatchEvent(new CustomEvent("gocnhocuaong:web-vitals", { detail }));
  if (import.meta.env.DEV) console.debug(`[Web Vital] ${name}: ${detail.value}`, detail.route);
}

export function startWebVitals() {
  if (started || typeof window === "undefined" || typeof PerformanceObserver === "undefined") return;
  started = true;
  const observers: PerformanceObserver[] = [];
  let latestLcp = 0;
  let cls = 0;
  let inp = 0;
  let reported = false;

  const observe = (type: string, callback: (entries: PerformanceObserverEntryList) => void) => {
    try {
      const observer = new PerformanceObserver((list) => callback(list));
      observer.observe({ type, buffered: true } as PerformanceObserverInit);
      observers.push(observer);
    } catch {
      // Trình duyệt không hỗ trợ loại PerformanceEntry này.
    }
  };

  observe("largest-contentful-paint", (list) => {
    const last = list.getEntries().at(-1);
    if (last) latestLcp = last.startTime;
  });
  observe("layout-shift", (list) => {
    list.getEntries().forEach((entry) => {
      const shift = entry as LayoutShiftEntry;
      if (!shift.hadRecentInput) cls += shift.value ?? 0;
    });
  });
  observe("event", (list) => {
    list.getEntries().forEach((entry) => {
      const timing = entry as EventTimingEntry;
      if ((timing.interactionId ?? 0) > 0) inp = Math.max(inp, timing.duration ?? 0);
    });
  });

  const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0];
  if (fcpEntry) emitVital("FCP", fcpEntry.startTime);

  const report = () => {
    if (reported) return;
    reported = true;
    if (latestLcp) emitVital("LCP", latestLcp);
    emitVital("CLS", cls);
    if (inp) emitVital("INP", inp);
    observers.forEach((observer) => observer.disconnect());
    window.removeEventListener("visibilitychange", report);
  };
  window.addEventListener("visibilitychange", report);
}
