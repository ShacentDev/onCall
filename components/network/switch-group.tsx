import { SwitchCard, SwitchWithStatus } from "@/components/network/switch-card";

interface SwitchGroupProps {
  location: string;
  switches: SwitchWithStatus[];
  onPing: (ip: string) => Promise<void>;
}

export function SwitchGroup({ location, switches, onPing }: SwitchGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-foreground">{location}</h3>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          {switches.filter((s) => s.status === "online").length}/
          {switches.length} online
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {switches.map((sw) => (
          <SwitchCard key={sw.id} sw={sw} onPing={onPing} />
        ))}
      </div>
    </div>
  );
}