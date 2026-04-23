import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavRoute {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "info" | "warning";
}

interface DashboardNavCardProps {
  routes: NavRoute[];
  className?: string;
}

const variantStyles: Record<
  NonNullable<NavRoute["variant"]>,
  { card: string; iconBg: string; iconColor: string; dot: string }
> = {
  default: {
    card: "hover:border-slate-300 hover:shadow-slate-100",
    iconBg: "bg-slate-100 group-hover:bg-slate-200",
    iconColor: "text-slate-600",
    dot: "bg-slate-400",
  },
  success: {
    card: "hover:border-emerald-200 hover:shadow-emerald-50",
    iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
    iconColor: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  danger: {
    card: "hover:border-red-200 hover:shadow-red-50",
    iconBg: "bg-red-50 group-hover:bg-red-100",
    iconColor: "text-red-500",
    dot: "bg-red-500",
  },
  info: {
    card: "hover:border-blue-200 hover:shadow-blue-50",
    iconBg: "bg-blue-50 group-hover:bg-blue-100",
    iconColor: "text-blue-600",
    dot: "bg-blue-500",
  },
  warning: {
    card: "hover:border-amber-200 hover:shadow-amber-50",
    iconBg: "bg-amber-50 group-hover:bg-amber-100",
    iconColor: "text-amber-600",
    dot: "bg-amber-500",
  },
};

export function DashboardNavCard({ routes, className }: DashboardNavCardProps) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {routes.map((route) => {
        const styles = variantStyles[route.variant ?? "default"];
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group relative flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4",
              "transition-all duration-200 hover:shadow-md",
              styles.card,
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                styles.iconBg,
              )}
            >
              <route.icon className={cn("h-5 w-5", styles.iconColor)} />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {route.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-400 leading-snug">
                {route.description}
              </p>
            </div>

            {/* Arrow indicator */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}