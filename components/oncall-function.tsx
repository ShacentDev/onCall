import { categoryColorCache, DAY_SHORT, PREDEFINED_HUES } from "@/lib/oncall-data";

import { format } from "date-fns";
import { toLocalDateStr } from "./local-date-string";

type WeekResponse = {
  data: PersonOnCall[];
  weekStart: string;
  weekEnd: string;
  weekOffset: number;
};

export function getCategoryColor(name: string) {
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

export function buildDayGrid(weekStart: string, entries: PersonOnCall[]) {
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

export function WeekGrid({ week, search }: { week: WeekResponse; search: string }) {
  const days = buildDayGrid(week.weekStart, week.data);
  const today = toLocalDateStr(new Date().toISOString());
  const weekLabel = `${format(new Date(week.weekStart), "d MMM")} – ${format(new Date(week.weekEnd), "d MMM yyyy")}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          {weekLabel}
        </span>
        <span className="text-xs text-muted-foreground">
          ({week.data.length} jadwal)
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
                    {format(day, "d MMM")}
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
                    {search ? "Tidak ada hasil" : "Tidak ada jadwal"}
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
