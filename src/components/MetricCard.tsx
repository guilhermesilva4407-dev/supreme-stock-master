import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? "border-primary/40" : undefined}>
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={
            "flex h-10 w-10 items-center justify-center rounded-md " +
            (accent ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground")
          }
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="truncate font-display text-2xl text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
