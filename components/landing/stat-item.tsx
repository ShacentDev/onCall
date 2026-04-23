"use client";
import { useCountUp } from "@/hooks/use-count-up";

export function StatItem({
  num,
  label,
  target,
}: {
  num: string;
  label: string;
  target: number;
}) {
  const count = useCountUp(target);
  const suffix = num.includes("+") ? "+" : "";
  const displayValue = target > 100 ? count.toLocaleString("id-ID") : count;

  return (
    <div className="min-w-0">
      <div className="font-serif text-[clamp(24px,6vw,36px)] font-bold leading-none text-red-600 whitespace-nowrap">
        {displayValue}
        {suffix}
      </div>
      <div className="text-[11px] text-stone-400 mt-1.5 tracking-wide leading-tight">
        {label}
      </div>
    </div>
  );
}
