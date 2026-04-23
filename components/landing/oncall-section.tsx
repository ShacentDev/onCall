"use client";

import useSWR from "swr";
import { OnCallCard } from "../oncall-card";
import { getActiveOnCalls } from "@/lib/on-call-utils";
import { Skeleton } from "@/components/ui/skeleton";

export function OnCallPublic() {
  const { data, isLoading } = useSWR("/api/oncall");

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const active = getActiveOnCalls(data || []);

  if (active.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Tidak ada dokter yang sedang on-call saat ini
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold">
          Dokter Sedang Bertugas
        </h2>
        <p className="text-muted-foreground text-sm">
          Jadwal real-time dokter jaga saat ini
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {active.map((item: any) => (
          <OnCallCard key={item.id} data={item} />
        ))}
      </div>

    </div>
  );
}