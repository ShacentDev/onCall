import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface SwitchCardProps {
  sw: SwitchWithStatus;
  onPing: (ip: string) => Promise<void>;
}

const typeIcon: Record<string, React.ReactNode> = {
  core: <Server className="h-3.5 w-3.5" />,
  distribution: <Server className="h-3.5 w-3.5" />,
  ubiquiti: <Wifi className="h-3.5 w-3.5" />,
  access: <Server className="h-3.5 w-3.5" />,
  wireless: <Wifi className="h-3.5 w-3.5" />,
};

export function SwitchCard({ sw, onPing }: SwitchCardProps) {
  const [isPinging, setIsPinging] = useState(false);

  async function handlePing() {
    setIsPinging(true);
    await onPing(sw.ip);
    setIsPinging(false);
  }

  return (
    <Card
      className={cn(
        "transition-colors",
        sw.status === "offline" && "border-red-200 dark:border-red-900",
      )}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-muted-foreground">
              {typeIcon[sw.type ?? "access"]}
            </span>
            <span className="font-semibold text-sm truncate">{sw.name}</span>
          </div>
          <StatusBadge status={sw.status} latency={sw.latency} />
        </div>

        <div className="text-xs text-muted-foreground font-mono">{sw.ip}</div>

        <div className="flex items-center justify-between">
          {sw.lastChecked ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground cursor-default">
                    {formatDistanceToNow(new Date(sw.lastChecked), {
                      addSuffix: true,
                    })}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {new Date(sw.lastChecked).toLocaleString()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-xs text-muted-foreground">Never checked</span>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePing}
            disabled={isPinging}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isPinging && "animate-spin")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}