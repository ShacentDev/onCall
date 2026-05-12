"use client";

import useSWR from "swr";
import { useState, useRef } from "react";
import { OnCallCard } from "../oncall-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function OnCallPublic() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsDebouncing(true);

    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setIsDebouncing(false);
    }, 500);
  };

  const { data, isLoading } = useSWR(
    `/api/oncall?search=${debouncedSearch}`
  );

  // ================= GROUP BY CATEGORY =================
  const grouped = (data || []).reduce((acc: any, item: any) => {
    const category = item.person?.category?.name || "Lainnya";

    if (!acc[category]) acc[category] = [];
    acc[category].push(item);

    return acc;
  }, {});

  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <div className="flex flex-col gap-10">

      {/* 🔍 SEARCH (SELALU ADA) */}
      <div className="max-w-md relative">
        <Input
          placeholder="Cari dokter / kategori / ruangan..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-8"
        />

        {isDebouncing && (
          <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isEmpty && (
        <div className="text-center py-20 text-muted-foreground">
          Tidak ada hasil untuk <b>{search}</b>
        </div>
      )}

      {!isLoading && !isEmpty && (
        <>
          {Object.entries(grouped).map(([category, items]: any) => (
            <section key={category} className="space-y-4">

              <div>
                <h2 className="text-xl font-bold">
                  🏷️ {category}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Daftar petugas pada kategori ini
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item: any) => (
                  <OnCallCard key={item.id} data={item} />
                ))}
              </div>

            </section>
          ))}
        </>
      )}

      <div className="h-20" />
    </div>
  );
}