"use client";

import { useSession } from "@/lib/client-session";
import {
  ShoppingCart,
  CircleDollarSign,
  Wallet,
  TrendingUp,
  Package,
  Receipt,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/loading";
import { DashboardFilter, type TimeRange } from "@/components/dashboard-filter";
import { StatsCard } from "@/components/stats-card";
import { RevenueAreaChart } from "@/components/area-chart";
import {
  formatRupiah,
  calcMarginRate,
  sumTotalPrice,
  sumTotalItems,
} from "@/lib/format-currency";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { endOfMonth } from "date-fns";

interface DashboardData {
  omset: OmsetEntry[];
  belanjaan: BelanjaanEntry[];
}

function buildDashboardUrl(range: TimeRange, selectedMonth: Date): string {
  const params = new URLSearchParams({ range });
  if (range === "month") {
    params.set("month", selectedMonth.toISOString());
  }
  return `/api/dashboard?${params.toString()}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isSessionLoading } = useSession();

  const [range, setRange] = useState<TimeRange>("month");
  const [selectedMonth, setSelectedMonth] = useState<Date>(endOfMonth(new Date()));

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isSessionLoading && !user) {
      toast.error("Anda harus login untuk mengakses dashboard.");
      router.replace("/login");
    }
  }, [user, isSessionLoading, router]);

  const { data, isLoading: isLoadingData } = useSWR<DashboardData>(
    isAdmin ? buildDashboardUrl(range, selectedMonth) : null,
  );

  const omset = data?.omset ?? [];
  const belanjaan = data?.belanjaan ?? [];

  const totalOmset = sumTotalPrice(omset);
  const totalBelanjaan = sumTotalPrice(belanjaan);
  const totalIncome = totalOmset - totalBelanjaan;
  const totalOmsetItems = sumTotalItems(omset);
  const totalBelanjaanItems = sumTotalItems(belanjaan);
  const totalTransaksiOmset = omset.length;
  const totalTransaksiBelanjaan = belanjaan.length;
  const marginRate = calcMarginRate(totalOmset, totalIncome);

  if (isSessionLoading || isLoadingData) {
    return <Loading />;
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Selamat datang kembali,{" "}
            <span className="font-medium text-slate-700">{user.name}</span>.
          </p>
        </div>
      </div>

      <Separator />

      {!isAdmin ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
          <p className="text-base font-medium text-slate-600">Akses terbatas</p>
          <p className="mt-1 text-sm text-slate-400">
            Halaman ini hanya tersedia untuk admin.
          </p>
        </div>
      ) : (
        <>
          <DashboardFilter
            range={range}
            selectedMonth={selectedMonth}
            onRangeChange={setRange}
            onMonthChange={setSelectedMonth}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <StatsCard
                title="Total Omset"
                value={formatRupiah(totalOmset)}
                description={`${totalTransaksiOmset} transaksi`}
                icon={CircleDollarSign}
                variant="success"
                className="h-full"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <StatsCard
                title="Total Belanjaan"
                value={formatRupiah(totalBelanjaan)}
                description={`${totalTransaksiBelanjaan} transaksi`}
                icon={ShoppingCart}
                variant="danger"
                className="h-full"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <StatsCard
                title="Keuntungan Bersih"
                value={formatRupiah(totalIncome)}
                description={`Margin ${marginRate}%`}
                icon={Wallet}
                variant={totalIncome >= 0 ? "info" : "warning"}
                className="h-full"
              />
            </div>
            <div className="xl:col-span-2">
              <StatsCard
                title="Item Terjual"
                value={totalOmsetItems.toLocaleString("id-ID")}
                description="Total item omset"
                icon={Package}
                variant="default"
                className="h-full"
              />
            </div>
            <div className="xl:col-span-2">
              <StatsCard
                title="Item Belanjaan"
                value={totalBelanjaanItems.toLocaleString("id-ID")}
                description="Total item pengeluaran"
                icon={Receipt}
                variant="default"
                className="h-full"
              />
            </div>
            <div className="xl:col-span-2">
              <StatsCard
                title="Margin Rate"
                value={`${marginRate}%`}
                description="Dari total omset"
                icon={TrendingUp}
                variant={Number(marginRate) >= 30 ? "success" : "warning"}
                className="h-full"
              />
            </div>
          </div>

          <div className="grid gap-4">
            <RevenueAreaChart omset={omset} belanjaan={belanjaan} />
          </div>
        </>
      )}
    </div>
  );
}