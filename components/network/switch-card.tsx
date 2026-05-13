import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCw, Server, Wifi } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { NetworkSwitch, SwitchStatus } from "@/lib/switches";
import { StatusBadge } from "@/components/network/status-badge";

export interface SwitchWithStatus extends NetworkSwitch {
  status: SwitchStatus;
  latency: number | null;
  lastChecked: string | null;
}

interface SwitchRowProps {
  sw: SwitchWithStatus;
  onPing: (ip: string) => Promise<void>;
}

const TypeIcon = ({ type }: { type?: string }) => {
  const cls = "h-3.5 w-3.5 shrink-0 text-muted-foreground";
  return type === "ubiquiti" || type === "wireless"
    ? <Wifi className={cls} />
    : <Server className={cls} />;
};

export function SwitchRow({ sw, onPing }: SwitchRowProps) {
  const [isPinging, setIsPinging] = useState(false);

  async function handlePing() {
    setIsPinging(true);
    await onPing(sw.ip);
    setIsPinging(false);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors",
        sw.status === "offline" && "border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/20",
      )}
    >
      <TypeIcon type={sw.type} />

      <span className="font-medium text-sm w-36 shrink-0 truncate">
        {sw.name}
      </span>

      <span className="font-mono text-xs text-muted-foreground w-28 shrink-0">
        {sw.ip}
      </span>

      <div className="flex-1" />

      <StatusBadge status={sw.status} latency={sw.latency} />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-muted-foreground w-20 text-right hidden sm:block cursor-default shrink-0">
              {sw.lastChecked
                ? formatDistanceToNow(new Date(sw.lastChecked), { addSuffix: true })
                : "Never"}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {sw.lastChecked
              ? new Date(sw.lastChecked).toLocaleString()
              : "Not yet checked"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={handlePing}
        disabled={isPinging}
        aria-label={`Ping ${sw.name}`}
      >
        <RefreshCw className={cn("h-3.5 w-3.5", isPinging && "animate-spin")} />
      </Button>
    </div>
  );
}