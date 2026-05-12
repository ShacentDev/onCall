import { CheckCircle2, XCircle, HelpCircle, Network } from "lucide-react";
import { SwitchWithStatus } from "./switch-card";

interface SummaryBarProps {
  switches: SwitchWithStatus[];
}

export function SummaryBar({ switches }: SummaryBarProps) {
  const online = switches.filter((s) => s.status === "online").length;
  const offline = switches.filter((s) => s.status === "offline").length;
  const unknown = switches.filter((s) => s.status === "unknown").length;
  const total = switches.length;

  const items = [
    {
      label: "Total Switches",
      value: total,
      icon: <Network className="h-4 w-4 text-muted-foreground" />,
      className: "",
    },
    {
      label: "Online",
      value: online,
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      className: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Offline",
      value: offline,
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      className: "text-red-600 dark:text-red-400",
    },
    {
      label: "Unknown",
      value: unknown,
      icon: <HelpCircle className="h-4 w-4 text-muted-foreground" />,
      className: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-lg border bg-card p-4"
        >
          {item.icon}
          <div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`text-2xl font-bold leading-none mt-0.5 ${item.className}`}>
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}