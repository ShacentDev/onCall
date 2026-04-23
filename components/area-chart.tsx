"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format-currency";

interface OmsetBelanjaan {
  totalPrice: number | bigint;
  createdAt: Date | string;
}

interface RevenueAreaChartProps {
  omset: OmsetBelanjaan[];
  belanjaan: OmsetBelanjaan[];
}

const chartConfig = {
  omset: {
    label: "Omset",
    color: "hsl(142, 71%, 45%)",
  },
  belanjaan: {
    label: "Belanjaan",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig;

function buildDailyData(omset: OmsetBelanjaan[], belanjaan: OmsetBelanjaan[]) {
  const map = new Map<string, { omset: number; belanjaan: number }>();

  const addEntries = (items: OmsetBelanjaan[], key: "omset" | "belanjaan") => {
    for (const item of items) {
      const date = new Date(item.createdAt).toISOString().slice(0, 10);
      const existing = map.get(date) ?? { omset: 0, belanjaan: 0 };
      existing[key] += Number(item.totalPrice);
      map.set(date, existing);
    }
  };

  addEntries(omset, "omset");
  addEntries(belanjaan, "belanjaan");

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));
}

export function RevenueAreaChart({ omset, belanjaan }: RevenueAreaChartProps) {
  const chartData = buildDailyData(omset, belanjaan);

  if (chartData.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Grafik Omset vs Belanjaan</CardTitle>
          <CardDescription>Perbandingan harian bulan ini</CardDescription>
        </CardHeader>
        <CardContent className="flex h-62.5 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Belum ada data untuk periode ini
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Grafik Omset vs Belanjaan</CardTitle>
        <CardDescription>Perbandingan harian bulan ini</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-65 w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillOmset" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-omset)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-omset)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillBelanjaan" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-belanjaan)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-belanjaan)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={52}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={formatCurrency}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })
                  }
                  formatter={(value, name) => [
                    `Rp ${Number(value).toLocaleString("id-ID")}`,
                    name === "omset" ? " Omset" : " Belanjaan",
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="omset"
              type="monotone"
              fill="url(#fillOmset)"
              stroke="var(--color-omset)"
              strokeWidth={2}
            />
            <Area
              dataKey="belanjaan"
              type="monotone"
              fill="url(#fillBelanjaan)"
              stroke="var(--color-belanjaan)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}