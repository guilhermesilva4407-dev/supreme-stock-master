import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  suffix,
  progress,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
  suffix?: string;
  progress?: number;
}) {
  if (accent) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-[oklch(0.82_0.13_82)] p-5 text-primary-foreground shadow-[0_0_40px_-12px_oklch(0.74_0.13_78/0.5)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div className="relative flex items-start justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
            {label}
          </span>
          <Icon className="h-5 w-5 opacity-80" />
        </div>
        <div className="relative mt-6 flex items-baseline gap-1.5">
          <span className="font-display text-3xl italic leading-none">{value}</span>
          {suffix && <span className="text-xs font-bold opacity-70">{suffix}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="hud-card group p-5 transition-colors hover:border-primary/40">
      <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-gradient-to-bl from-primary/10 to-transparent" />
      <div className="relative flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
          {label}
        </span>
        <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
      </div>
      <div className="relative mt-4 flex items-baseline gap-1.5">
        <span className="font-display text-3xl text-foreground leading-none">{value}</span>
        {suffix && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            {suffix}
          </span>
        )}
      </div>
      {typeof progress === "number" && (
        <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-primary/10">
          <div
            className="h-full bg-gradient-to-r from-primary to-[oklch(0.88_0.13_85)]"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
