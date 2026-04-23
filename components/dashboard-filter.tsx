"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type TimeRange = "1d" | "3d" | "7d" | "30d" | "3m" | "6m" | "12m" | "3y" | "5y" | "month";

const RANGE_OPTIONS: { label: string; value: Exclude<TimeRange, "month"> }[] = [
  { label: "1 Hari", value: "1d" },
  { label: "3 Hari", value: "3d" },
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "3 Bulan", value: "3m" },
  { label: "6 Bulan", value: "6m" },
  { label: "12 Bulan", value: "12m" },
  { label: "3 Tahun", value: "3y" },
  { label: "5 Tahun", value: "5y" },
];

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

interface DashboardFilterProps {
  range: TimeRange;
  selectedMonth: Date;
  onRangeChange: (range: TimeRange) => void;
  onMonthChange: (date: Date) => void;
  fromYear?: number;
  toYear?: number;
}

export function DashboardFilter({
  range,
  selectedMonth,
  onRangeChange,
  onMonthChange,
  fromYear = 2025,
  toYear = 2050,
}: DashboardFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState(selectedMonth.getFullYear());

  const isMonthMode = range === "month";

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = endOfMonth(new Date(year, monthIndex));
    onMonthChange(newDate);
    onRangeChange("month");
    setOpen(false);
  };

  const handleRangeSelect = (value: Exclude<TimeRange, "month">) => {
    onRangeChange(value);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={isMonthMode ? "default" : "outline"}
            className="gap-2"
            size="sm"
          >
            <CalendarIcon className="h-4 w-4" />
            {isMonthMode
              ? format(selectedMonth, "MMMM yyyy", { locale: id })
              : "Pilih Bulan"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-4" align="start">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setYear((prev) => Math.max(fromYear, prev - 1))}
              disabled={year <= fromYear}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-sm">{year}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setYear((prev) => Math.min(toYear, prev + 1))}
              disabled={year >= toYear}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, i) => {
              const isSelected =
                isMonthMode &&
                selectedMonth.getMonth() === i &&
                selectedMonth.getFullYear() === year;
              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "text-sm py-2",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleMonthSelect(i)}
                >
                  {month.slice(0, 3)}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-1">
        {RANGE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={range === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleRangeSelect(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}