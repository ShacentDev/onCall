"use client";

import { useState, useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { enUS as localeId } from "date-fns/locale";

type PersonOnCall = {
  id: string;
  room: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  person: {
    id: string;
    name: string;
    code: string;
    category: { id: string; name: string };
  };
};

type WeekResponse = {
  data: PersonOnCall[];
  weekStart: string;
  weekEnd: string;
  weekOffset: number;
};

const categoryColorCache = new Map<string, { bg: string; border: string; text: string }>();

const GOLDEN_ANGLE = 137.508;
const PREDEFINED_HUES: Record<string, number> = {
  "PENYAKIT DALAM": 210,
  ANAK: 130,
  OBSGYN: 340,
  "BEDAH UMUM": 25,
  ANESTESI: 270,
  "BEDAH DIGESTIF": 50,
  "BEDAH TULANG": 195,
  "BEDAH SYARAF": 240,
  PARU: 170,
  KARDIOLOGI: 0,
  NEUROLOGI: 290,
  RADIOLOGI: 160,
  THT: 75,
  MATA: 95,
  UROLOGI: 310,
  IT: 185,
  Keperawatan: 115,
  Management: 35,
  "BEDAH PLASTIK": 320,
  ENDOVASCULAR: 145,
  "MAINTENANCE MEDIS": 60,
  "CARDIAC INTERVENSI": 15,
  "ON-SITE ANAK": 110,
  "ON-SITE PENYAKIT DALAM": 220,
  "ON-SITE OBGYN": 350,
  "ON-SITE BEDAH UMUM": 40,
  "BEDAH VASKULAR": 255,
  "BEDAH ANAK": 155,
  "BEDAH ONKOLOGI": 200,
  "BEDAH THORAKS": 280,
};

function getCategoryColor(name: string) {
  if (categoryColorCache.has(name)) return categoryColorCache.get(name)!;

  let hue: number;
  if (name in PREDEFINED_HUES) {
    hue = PREDEFINED_HUES[name];
  } else {
    let hash = 5381;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 33) ^ name.charCodeAt(i);
    }
    hue = Math.abs(hash) % 360;
  }

  const color = {
    bg: `hsl(${hue}, 65%, 94%)`,
    border: `hsl(${hue}, 55%, 78%)`,
    text: `hsl(${hue}, 60%, 28%)`,
  };

  categoryColorCache.set(name, color);
  return color;
}

function toLocalDateStr(isoString: string): string {
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildDayGrid(weekStart: string, entries: PersonOnCall[]) {
  const start = new Date(weekStart);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i,
    );
    const dayStr = toLocalDateStr(day.toISOString());
    const dayEntries = entries.filter(
      (oc) => toLocalDateStr(oc.startTime) === dayStr,
    );
    const byCategory = dayEntries.reduce(
      (acc, oc) => {
        const cat = oc.person.category.name;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(oc);
        return acc;
      },
      {} as Record<string, PersonOnCall[]>,
    );
    return { day, dayStr, byCategory, total: dayEntries.length };
  });
}

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeekGrid({ week, search }: { week: WeekResponse; search: string }) {
  const days = buildDayGrid(week.weekStart, week.data);
  const today = toLocalDateStr(new Date().toISOString());
  const weekLabel = `${format(new Date(week.weekStart), "d MMM", { locale: localeId })} – ${format(new Date(week.weekEnd), "d MMM yyyy", { locale: localeId })}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          {weekLabel}
        </span>
        <span className="text-xs text-muted-foreground">
          ({week.data.length} schedules)
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {days.map(({ day, dayStr, byCategory, total }, i) => {
          const isToday = dayStr === today;
          const categories = Object.entries(byCategory).sort(([a], [b]) =>
            a.localeCompare(b),
          );
          return (
            <div
              key={dayStr}
              className={`rounded-xl border flex flex-col overflow-hidden ${
                isToday ? "border-primary ring-1 ring-primary" : "border-border"
              }`}
            >
              <div
                className={`px-3 py-2 flex items-center justify-between ${
                  isToday ? "bg-primary text-primary-foreground" : "bg-muted/50"
                }`}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {DAY_SHORT[i]}
                  </p>
                  <p className="text-sm font-bold leading-none">
                    {format(day, "d MMM", { locale: localeId })}
                  </p>
                </div>
                {total > 0 && (
                  <span
                    className={`text-xs font-bold rounded-full px-1.5 py-0.5 ${
                      isToday
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {total}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 p-2 flex-1 min-h-[80px]">
                {categories.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground text-center py-3">
                    {search ? "No results found" : "No schedule"}
                  </p>
                ) : (
                  categories.map(([catName, persons]) => {
                    const color = getCategoryColor(catName);
                    return (
                      <div
                        key={catName}
                        className="rounded-md border px-2 py-1"
                        style={{ backgroundColor: color.bg, borderColor: color.border, color: color.text }}
                      >
                        <p className="text-[9px] font-bold uppercase tracking-wide opacity-60 leading-none mb-0.5">
                          {catName}
                        </p>
                        {persons.map((oc) => (
                          <p
                            key={oc.id}
                            className="text-[11px] font-medium leading-snug"
                          >
                            {oc.person.name !== oc.person.code
                              ? oc.person.name
                              : oc.person.code}
                          </p>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OnCallViewPage() {
  const [startOffset, setStartOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const getKey = useCallback(
    (pageIndex: number) => {
      const offset = startOffset - pageIndex;
      const params = new URLSearchParams({ weekOffset: String(offset) });
      if (debouncedSearch) params.set("search", debouncedSearch);
      return `/api/oncall?${params.toString()}`;
    },
    [startOffset, debouncedSearch],
  );

  const { data, size, setSize, isValidating, isLoading } =
    useSWRInfinite<WeekResponse>(getKey, { revalidateFirstPage: false });

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CalendarClock className="h-8 w-8" />
          Weekly On Call Schedule
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualize on call schedules by week.
        </p>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartOffset((o) => o - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartOffset((o) => o + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {startOffset !== 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStartOffset(0)}
              className="text-xs text-muted-foreground"
            >
              Back to current week
            </Button>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, code, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-8">
          {(data ?? []).map((week) => (
            <WeekGrid key={week.weekOffset} week={week} search={debouncedSearch} />
          ))}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setSize(size + 1)}
              disabled={!!isLoadingMore || isValidating}
            >
              {isLoadingMore || isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load previous week"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}