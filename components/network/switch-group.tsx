import { SwitchRow, SwitchWithStatus } from "@/components/network/switch-card";

interface SwitchGroupProps {
  location: string;
  switches: SwitchWithStatus[];
  onPing: (ip: string) => Promise<void>;
}

export function SwitchGroup({ location, switches, onPing }: SwitchGroupProps) {
  const onlineCount = switches.filter((s) => s.status === "online").length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-sm font-semibold">{location}</h3>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          {onlineCount}/{switches.length} online
        </span>
      </div>

      <div className="flex items-center gap-3 px-3 mb-1">
        <span className="w-3.5 shrink-0" />
        <span className="text-xs text-muted-foreground w-36 shrink-0">Name</span>
        <span className="text-xs text-muted-foreground w-28 shrink-0">IP Address</span>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">Status</span>
        <span className="text-xs text-muted-foreground w-20 text-right hidden sm:block shrink-0">
          Last checked
        </span>
        <span className="w-7 shrink-0" />
      </div>

      <div className="space-y-1">
        {switches.map((sw) => (
          <SwitchRow key={sw.id} sw={sw} onPing={onPing} />
        ))}
      </div>
    </div>
  );
}