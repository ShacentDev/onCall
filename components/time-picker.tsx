"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal & jam",
}: Props) {
  const parsed = value ? new Date(value) : undefined;
  const isValid = parsed && !isNaN(parsed.getTime());

  const currentHour = isValid ? format(parsed, "HH") : "00";
  const currentMinute = isValid ? format(parsed, "mm") : "00";
  const dateStr = isValid ? format(parsed, "yyyy-MM-dd") : "";

  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  const scrollToSelected = React.useCallback(() => {
    if (hourRef.current) {
      const el = hourRef.current.querySelector(
        `[data-value="${currentHour}"]`,
      ) as HTMLElement;
      if (el) el.scrollIntoView({ block: "center" });
    }
    if (minuteRef.current) {
      const el = minuteRef.current.querySelector(
        `[data-value="${currentMinute}"]`,
      ) as HTMLElement;
      if (el) el.scrollIntoView({ block: "center" });
    }
  }, [currentHour, currentMinute]);

  const handleDateSelect = (d?: Date) => {
    if (!d) return;
    const newDate = new Date(
      `${format(d, "yyyy-MM-dd")}T${currentHour}:${currentMinute}:00`,
    );
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (type: "hour" | "minute", val: string) => {
    const base = dateStr || format(new Date(), "yyyy-MM-dd");
    const h = type === "hour" ? val : currentHour;
    const m = type === "minute" ? val : currentMinute;
    onChange(new Date(`${base}T${h}:${m}:00`).toISOString());
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !isValid && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {isValid
              ? format(parsed, "dd MMM yyyy", { locale: id })
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={isValid ? parsed : undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover
        onOpenChange={(open) => open && setTimeout(scrollToSelected, 50)}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-24 justify-center font-mono"
          >
            <Clock className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            {currentHour}:{currentMinute}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            <div
              ref={hourRef}
              className="h-48 w-16 overflow-y-auto scroll-smooth border-r"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="py-16">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    data-value={h}
                    onClick={() => handleTimeChange("hour", h)}
                    className={cn(
                      "w-full py-1.5 text-center text-sm transition-colors hover:bg-accent",
                      h === currentHour
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={minuteRef}
              className="h-48 w-16 overflow-y-auto scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="py-16">
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    data-value={m}
                    onClick={() => handleTimeChange("minute", m)}
                    className={cn(
                      "w-full py-1.5 text-center text-sm transition-colors hover:bg-accent",
                      m === currentMinute
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
