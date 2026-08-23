import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

type PersistentCollapsibleProps = {
  storageKey: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
};

function readOpenState(storageKey: string, defaultOpen: boolean) {
  try {
    const saved = window.localStorage.getItem(`gocnhocuaong:collapse:${storageKey}`);
    return saved === null ? defaultOpen : saved === "open";
  } catch {
    return defaultOpen;
  }
}

export function PersistentCollapsible({
  storageKey,
  title,
  eyebrow,
  children,
  className = "",
  defaultOpen = false,
}: PersistentCollapsibleProps) {
  const [open, setOpen] = useState(() => readOpenState(storageKey, defaultOpen));

  useEffect(() => {
    const handleOpenRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ storageKey?: string }>).detail;
      if (detail?.storageKey === storageKey) setOpen(true);
    };
    const handleGlobalRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (typeof detail?.open === "boolean") setOpen(detail.open);
    };
    window.addEventListener("gocnhocuaong:open-collapsible", handleOpenRequest);
    window.addEventListener("gocnhocuaong:collapse-all", handleGlobalRequest);
    return () => {
      window.removeEventListener("gocnhocuaong:open-collapsible", handleOpenRequest);
      window.removeEventListener("gocnhocuaong:collapse-all", handleGlobalRequest);
    };
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`gocnhocuaong:collapse:${storageKey}`, open ? "open" : "closed");
    } catch {
      // Storage can be unavailable in private browsing; the control remains usable in memory.
    }
  }, [open, storageKey]);

  return (
    <section className={`panel overflow-hidden ${className}`} data-collapsible-key={storageKey} data-collapsible-state={open ? "open" : "closed"}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-black/[.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7d32] sm:p-6 dark:hover:bg-white/[.04]"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="min-w-0">
          {eyebrow ? <span className="block text-xs font-bold uppercase tracking-[.16em] text-[#2e7d32] dark:text-[#9bd59d]">{eyebrow}</span> : null}
          <span className="mt-1 block truncate font-display text-xl font-bold sm:text-2xl">{title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-[#2e7d32] dark:text-[#9bd59d]"><span className="rounded-full bg-[#eaf5ea] px-2 py-1 text-[10px] font-bold uppercase tracking-wide dark:bg-[#2e7d32]/20">{open ? "Thu gọn" : "Mở rộng"}</span><ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" /></span>
      </button>
      {open ? <div className="border-t border-black/5 p-5 sm:p-6 dark:border-white/10">{children}</div> : null}
    </section>
  );
}

export function usePersistentDisclosure(storageKey: string, defaultOpen = false) {
  const [open, setOpen] = useState(() => readOpenState(storageKey, defaultOpen));
  useEffect(() => {
    try {
      window.localStorage.setItem(`gocnhocuaong:collapse:${storageKey}`, open ? "open" : "closed");
    } catch {
      // no-op
    }
  }, [open, storageKey]);
  return { open, setOpen, toggle: () => setOpen((value) => !value) };
}

export default PersistentCollapsible;

/* Keep React's JSX namespace inference available in projects that use the classic TS config. */
void 0;

export type { PersistentCollapsibleProps };
