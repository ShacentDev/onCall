"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Network,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Timer,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SwitchStatus } from "@/lib/switches";
import { SwitchWithStatus } from "@/components/network/switch-card";
import { SwitchGroup } from "@/components/network/switch-group";
import { SummaryBar } from "@/components/network/summary-bar";
import { PingResult } from "@/lib/ping";
import { apiRequest } from "@/lib/api-client";

const REFRESH_INTERVAL = 60;

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch switch list.");
  return res.json();
}

export default function NetworkMonitorPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SwitchStatus | "all">("offline");
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [isInitialPing, setIsInitialPing] = useState(false);
  const [pingResults, setPingResults] = useState<Record<string, PingResult>>({});
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const pingAllRef = useRef<() => Promise<void>>(null!);
  const hasPingedOnMount = useRef(false);

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

  const activeFilter = isInitialPing ? "all" : statusFilter;

  const filtered = mergedSwitches.filter((sw) => {
    if (activeFilter !== "all" && sw.status !== activeFilter) return false;
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
    const result = await apiRequest<PingResult>({
      url: "/api/network/ping",
      method: "POST",
      data: { ip },
    });

    if (!result) return;

    setPingResults((prev) => ({ ...prev, [ip]: result }));

    if (result.status === "online") {
      toast.success(`${ip} is reachable`, {
        description: result.latency ? `${result.latency}ms` : undefined,
      });
    } else {
      toast.error(`${ip} is unreachable`);
    }
  }, []);

  async function handlePingAll() {
    if (isPingingAll) return;
    setIsPingingAll(true);
    setCountdown(REFRESH_INTERVAL);

    const results = await apiRequest<PingResult[]>({
      url: "/api/network/ping",
      method: "POST",
      data: { all: true },
    });

    if (results) {
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
    }

    setIsPingingAll(false);
  }

  pingAllRef.current = handlePingAll;

  useEffect(() => {
    if (!isLoading && switchList && !hasPingedOnMount.current) {
      hasPingedOnMount.current = true;
      setIsInitialPing(true);
      pingAllRef.current().finally(() => setIsInitialPing(false));
    }
  }, [isLoading, switchList]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          pingAllRef.current();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

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
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <SummaryBar switches={mergedSwitches} />

          {isInitialPing && (
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              <span>
                Running initial ping on all switches, this may take a few seconds…
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="h-3.5 w-3.5" />
                <span>
                  Auto-refresh in{" "}
                  <span className="font-medium tabular-nums text-foreground">
                    {countdown}s
                  </span>
                </span>
              </div>

              <ToggleGroup
                type="single"
                value={activeFilter}
                onValueChange={(val) =>
                  setStatusFilter((val as SwitchStatus | "all") || "all")
                }
                className="border rounded-md p-0.5"
                disabled={isInitialPing}
              >
                <ToggleGroupItem value="all" className="text-xs h-8 px-3 gap-1.5">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="online"
                  className="text-xs h-8 px-3 gap-1.5 data-[state=on]:text-emerald-600 data-[state=on]:bg-emerald-50 dark:data-[state=on]:bg-emerald-950 dark:data-[state=on]:text-emerald-400"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Online
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="offline"
                  className="text-xs h-8 px-3 gap-1.5 data-[state=on]:text-red-600 data-[state=on]:bg-red-50 dark:data-[state=on]:bg-red-950 dark:data-[state=on]:text-red-400"
                >
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
            {isInitialPing && Object.keys(grouped).length === 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-4 w-40" />
                  <div className="h-px flex-1 bg-border" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}