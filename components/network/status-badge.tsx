import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SwitchStatus } from "@/lib/switches";

interface StatusBadgeProps {
  status: SwitchStatus;
  latency?: number | null;
}

const statusConfig: Record<
  SwitchStatus,
  { label: string; dot: string; badge: string }
> = {
  online: {
    label: "Online",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  },
  offline: {
    label: "Offline",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  },
  unknown: {
    label: "Unknown",
    dot: "bg-muted-foreground/40",
    badge: "bg-muted text-muted-foreground border-border",
  },
};

export function StatusBadge({ status, latency }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", config.badge)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
      {status === "online" && latency !== null && latency !== undefined && (
        <span className="font-normal opacity-70">{latency}ms</span>
      )}
    </Badge>
  );
}