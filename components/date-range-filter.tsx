"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DateRange =
  | "3d"
  | "7d"
  | "30d"
  | "3m"
  | "6m"
  | "1y"
  | "3y"
  | "5y";

interface DateRangeOption {
  value: DateRange;
  label: string;
  days: number;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: "3d", label: "3 hari terakhir", days: 3 },
  { value: "7d", label: "7 hari terakhir", days: 7 },
  { value: "30d", label: "30 hari terakhir", days: 30 },
  { value: "3m", label: "3 bulan terakhir", days: 90 },
  { value: "6m", label: "6 bulan terakhir", days: 180 },
  { value: "1y", label: "1 tahun terakhir", days: 365 },
  { value: "3y", label: "3 tahun terakhir", days: 1095 },
  { value: "5y", label: "5 tahun terakhir", days: 1825 },
];

/** Returns { gte, lt } as ISO date strings for use in API query params */
export function getDateRangeBounds(range: DateRange): {
  gte: string;
  lt: string;
} {
  const option = DATE_RANGE_OPTIONS.find((o) => o.value === range);
  const days = option?.days ?? 30;
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return {
    gte: start.toISOString(),
    lt: now.toISOString(),
  };
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  className?: string;
}

export function DateRangeFilter({
  value,
  onChange,
  className,
}: DateRangeFilterProps) {
  const selected = DATE_RANGE_OPTIONS.find((o) => o.value === value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRange)}>
      <SelectTrigger className={className ?? "w-[200px] rounded-lg"}>
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Pilih rentang waktu">
          {selected?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {DATE_RANGE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}