"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export function DateTimePicker({ value, onChange }: Props) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleDateChange = (d?: Date) => {
    if (!d) return;
    setDate(d);

    const time = value ? value.split("T")[1] : "00:00";
    const iso = new Date(`${format(d, "yyyy-MM-dd")}T${time}`);
    onChange(iso.toISOString());
  };

  const handleTimeChange = (t: string) => {
    if (!date) return;
    const iso = new Date(`${format(date, "yyyy-MM-dd")}T${t}`);
    onChange(iso.toISOString());
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start")}
          >
            {date ? format(date, "PPP") : "Pilih tanggal"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>

      <Input
        type="time"
        step="60"
        onChange={(e) => handleTimeChange(e.target.value)}
      />
    </div>
  );
}