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
import { WeekGrid, WeekResponse } from "@/components/oncall/day-card-grid";

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