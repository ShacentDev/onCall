"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, Search, RefreshCw, Loader2, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { SwitchStatus } from "@/lib/switches";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SwitchWithStatus } from "@/components/network/switch-card";
import { SwitchGroup } from "@/components/network/switch-group";
import { SummaryBar } from "@/components/network/summary-bar";
import { PingResult } from "@/lib/ping";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch switch list.");
  return res.json();
}

export default function NetworkMonitorPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SwitchStatus | "all">("all");
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [pingResults, setPingResults] = useState<Record<string, PingResult>>({});

  const { data: switchList, isLoading } = useSWR<SwitchWithStatus[]>(
    "/api/network",
    fetcher,
    { revalidateOnFocus: false },
  );

  const mergedSwitches: SwitchWithStatus[] = (switchList ?? []).map((sw) => {
    const result = pingResults[sw.ip];
    if (!result) return sw;
    return {
      ...sw,
      status: result.status,
      latency: result.latency,
      lastChecked: result.checkedAt,
    };
  });

  const filtered = mergedSwitches.filter((sw) => {
    if (statusFilter !== "all" && sw.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      sw.name.toLowerCase().includes(q) ||
      sw.ip.includes(q) ||
      sw.location.toLowerCase().includes(q)
    );
  });

  const grouped = filtered.reduce<Record<string, SwitchWithStatus[]>>(
    (acc, sw) => {
      if (!acc[sw.location]) acc[sw.location] = [];
      acc[sw.location].push(sw);
      return acc;
    },
    {},
  );

  const handlePingSingle = useCallback(async (ip: string) => {
    try {
      const res = await fetch("/api/network/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });

      if (!res.ok) throw new Error();

      const result: PingResult = await res.json();
      setPingResults((prev) => ({ ...prev, [ip]: result }));

      if (result.status === "online") {
        toast.success(`${ip} is reachable`, {
          description: result.latency ? `${result.latency}ms` : undefined,
        });
      } else {
        toast.error(`${ip} is unreachable`);
      }
    } catch {
      toast.error("Ping request failed.");
    }
  }, []);

  async function handlePingAll() {
    setIsPingingAll(true);
    try {
      const res = await fetch("/api/network/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });

      if (!res.ok) throw new Error();

      const results: PingResult[] = await res.json();
      const map = results.reduce<Record<string, PingResult>>((acc, r) => {
        acc[r.ip] = r;
        return acc;
      }, {});

      setPingResults(map);

      const online = results.filter((r) => r.status === "online").length;
      const offline = results.filter((r) => r.status === "offline").length;
      toast.success("Ping complete", {
        description: `${online} online · ${offline} offline`,
      });
    } catch {
      toast.error("Failed to ping all switches.");
    } finally {
      setIsPingingAll(false);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-8 w-8" />
          Network Monitor
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time connectivity status for all network switches.
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <SummaryBar switches={mergedSwitches} />

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={handlePingAll}
                disabled={isPingingAll}
                className="w-full sm:w-auto"
              >
                {isPingingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Pinging all...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Ping All
                  </>
                )}
              </Button>

              <ToggleGroup
                type="single"
                value={statusFilter}
                onValueChange={(val) =>
                  setStatusFilter((val as SwitchStatus | "all") || "all")
                }
                className="border rounded-md p-0.5"
              >
                <ToggleGroupItem value="all" className="text-xs h-8 px-3 gap-1.5">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="online" className="text-xs h-8 px-3 gap-1.5 data-[state=on]:text-emerald-600 data-[state=on]:bg-emerald-50 dark:data-[state=on]:bg-emerald-950 dark:data-[state=on]:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Online
                </ToggleGroupItem>
                <ToggleGroupItem value="offline" className="text-xs h-8 px-3 gap-1.5 data-[state=on]:text-red-600 data-[state=on]:bg-red-50 dark:data-[state=on]:bg-red-950 dark:data-[state=on]:text-red-400">
                  <XCircle className="h-3.5 w-3.5" />
                  Offline
                </ToggleGroupItem>
                <ToggleGroupItem value="unknown" className="text-xs h-8 px-3 gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Unknown
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, IP, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(grouped).map(([location, switches]) => (
              <SwitchGroup
                key={location}
                location={location}
                switches={switches}
                onPing={handlePingSingle}
              />
            ))}

            {Object.keys(grouped).length === 0 && (
              <p className="text-center text-muted-foreground py-20">
                No switches match your search.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}