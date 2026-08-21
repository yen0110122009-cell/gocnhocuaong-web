import { cn } from "@/lib/utils";

export function SnowBuddy({ compact = false, roaming = false }: { compact?: boolean; roaming?: boolean }) {
  return <span className={cn("snow-buddy", compact ? "snow-buddy--compact" : "", roaming ? "snow-buddy--roaming" : "")} aria-hidden="true">
    <span className="snow-buddy__hat" />
    <span className="snow-buddy__head"><i /><i /><b /></span>
    <span className="snow-buddy__body"><i /><i /><i /></span>
    <span className="snow-buddy__scarf" />
    <span className="snow-buddy__arms" />
  </span>;
}
