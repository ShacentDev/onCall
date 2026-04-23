"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, endOfMonth } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MonthYearFilterProps {
  value?: Date;
  onChange?: (date: Date) => void;
  fromYear?: number;
  toYear?: number;
}

export function MonthYearFilter({
  value,
  onChange,
  fromYear = 2025,
  toYear = 2050,
}: MonthYearFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState(
    value?.getFullYear() ?? new Date().getFullYear()
  );
  const [selected, setSelected] = React.useState<Date>(value ?? new Date());

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const handleSelect = (monthIndex: number) => {
    const newDate = endOfMonth(new Date(year, monthIndex));
    setSelected(newDate);
    onChange?.(newDate);
    setOpen(false);
  };

  const handlePrevYear = () => setYear((prev) => Math.max(fromYear, prev - 1));
  const handleNextYear = () => setYear((prev) => Math.min(toYear, prev + 1));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between w-full"
          role="combobox"
          aria-expanded={open}
        >
          {selected
            ? format(selected, "MMMM yyyy", { locale: id })
            : "Pilih bulan"}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-4" align="start">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePrevYear}
            disabled={year <= fromYear}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">{year}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextYear}
            disabled={year >= toYear}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {months.map((month, i) => {
            const isSelected =
              selected.getMonth() === i && selected.getFullYear() === year;
            return (
              <Button
                key={month}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "text-sm py-2",
                  isSelected && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleSelect(i)}
              >
                {month.slice(0, 3)}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
