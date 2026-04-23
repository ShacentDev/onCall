import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
}

const variantStyles: Record<
  NonNullable<StatsCardProps["variant"]>,
  {
    gradient: string;
    iconBg: string;
    iconColor: string;
    trendUp: string;
    trendDown: string;
    badge: string;
  }
> = {
  default: {
    gradient: "from-slate-50 via-white to-slate-50/60",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trendUp: "text-emerald-600 bg-emerald-50",
    trendDown: "text-red-500 bg-red-50",
    badge: "bg-slate-100 text-slate-600",
  },
  success: {
    gradient: "from-emerald-50 via-white to-emerald-50/40",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    trendUp: "text-emerald-600 bg-emerald-50",
    trendDown: "text-red-500 bg-red-50",
    badge: "bg-emerald-100 text-emerald-700",
  },
  danger: {
    gradient: "from-red-50 via-white to-red-50/40",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    trendUp: "text-emerald-600 bg-emerald-50",
    trendDown: "text-red-500 bg-red-50",
    badge: "bg-red-100 text-red-600",
  },
  warning: {
    gradient: "from-amber-50 via-white to-amber-50/40",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    trendUp: "text-emerald-600 bg-emerald-50",
    trendDown: "text-red-500 bg-red-50",
    badge: "bg-amber-100 text-amber-700",
  },
  info: {
    gradient: "from-blue-50 via-white to-blue-50/40",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    trendUp: "text-emerald-600 bg-emerald-50",
    trendDown: "text-red-500 bg-red-50",
    badge: "bg-blue-100 text-blue-700",
  },
};

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  variant = "default",
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-md",
        styles.gradient,
        className,
      )}
    >
      {/* Decorative background blob */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-current opacity-[0.04]" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
            styles.iconBg,
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconColor)} />
        </div>
      </div>

      {(trend || description) && (
        <div className="mt-3 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                isPositive ? styles.trendUp : styles.trendDown,
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? "+" : ""}
              {trend.value.toFixed(1)}%
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-400 truncate">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}