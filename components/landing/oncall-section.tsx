"use client";

import useSWR from "swr";
import { OnCallCard } from "../oncall-card";
import { groupOnCalls } from "@/lib/on-call-utils";
import { Skeleton } from "@/components/ui/skeleton";

export function OnCallPublic() {
  const { data, isLoading } = useSWR("/api/oncall");

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const { active, standby } = groupOnCalls(data || []);

  if (active.length === 0 && standby.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Tidak ada jadwal dokter
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col gap-12 px-4 md:px-6 lg:px-8">

      {/* ================= ACTIVE ================= */}
      <section className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-green-600">
            🟢 Sedang Bertugas
          </h2>
          <p className="text-muted-foreground text-sm">
            Dokter yang sedang on-call saat ini
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-green-600">
            🟢 Sedang Bertugas
          </h2>
          <p className="text-muted-foreground text-sm">
            Dokter yang sedang on-call saat ini
          </p>
        </div>

        {active.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((item: any) => (
              <OnCallCard key={item.id} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada dokter yang sedang bertugas
          </p>
        )}
      </section>

      {/* ================= STANDBY ================= */}
      <section className="space-y-4 border-t pt-6">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500">
            🟡 Standby
          </h2>
          <p className="text-muted-foreground text-sm">
            Dokter yang akan bertugas
          </p>
        </div>

        {standby.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standby.map((item: any) => (
              <OnCallCard key={item.id} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada dokter standby
          </p>
        )}
      </section>

      {/* 🔥 SPACER WAJIB (INI YANG BIKIN GA NABRAK) */}
      <div className="h-20" />

    </div>
  );
}