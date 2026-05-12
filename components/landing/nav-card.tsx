import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem, NavItemStatus } from "./nav"

const statusLabels: Record<NavItemStatus, string> = {
  new: "New",
  beta: "Beta",
  stable: "",
};

const statusStyles: Record<NavItemStatus, string> = {
  new: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  beta: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  stable: "",
};

const iconStyles = [
  "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
  "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
  "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
];

interface NavCardProps {
  item: NavItem;
  index: number;
}

export function NavCard({ item, index }: NavCardProps) {
  const Icon = item.icon;
  const iconStyle = iconStyles[index % iconStyles.length];

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex flex-col gap-4 rounded-xl border bg-card p-5",
        "transition-colors hover:bg-accent hover:border-border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
      aria-label={`${item.title} — ${item.description}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("rounded-lg p-2 w-fit", iconStyle)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        {item.status && item.status !== "stable" && (
          <Badge
            variant="outline"
            className={cn("text-xs font-medium", statusStyles[item.status])}
          >
            {statusLabels[item.status]}
          </Badge>
        )}
      </div>

      <div className="flex-1 space-y-1">
        <p className="font-semibold text-sm leading-none">{item.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>

      <ArrowRight
        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}