import { getCategoryColor, toLocalDateStr } from "../oncall-function";
import { format } from "date-fns";
import { enUS as localeId } from "date-fns/locale";

export type WeekResponse = {
  data: PersonOnCall[];
  weekStart: string;
  weekEnd: string;
  weekOffset: number;
};

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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