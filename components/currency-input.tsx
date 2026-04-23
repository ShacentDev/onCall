"use client";

import { Input } from "@/components/ui/input";
import {
  formatRupiahInput,
  parseRupiahInput,
} from "@/lib/format-currency";

export function CurrencyInput({
  value,
  onChange,
  placeholder,
}: {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        Rp
      </span>

      <Input
        className="pl-9"
        value={formatRupiahInput(value)}
        placeholder={placeholder ?? "0"}
        inputMode="numeric"
        onChange={(e) => onChange(parseRupiahInput(e.target.value))}
      />
    </div>
  );
}