/**
 * lib/date-utils.ts
 *
 * Reusable date helpers used across API routes, pages, and components.
 * All date math uses UTC to avoid browser/server timezone mismatch.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DateRange = "3d" | "7d" | "30d" | "3m" | "6m" | "1y" | "3y" | "5y";

export interface DateRangeOption {
  value: DateRange;
  label: string;
  days: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: "3d", label: "3 hari terakhir", days: 3 },
  { value: "7d", label: "7 hari terakhir", days: 7 },
  { value: "30d", label: "30 hari terakhir", days: 30 },
  { value: "3m", label: "3 bulan terakhir", days: 90 },
  { value: "6m", label: "6 bulan terakhir", days: 180 },
  { value: "1y", label: "1 tahun terakhir", days: 365 },
  { value: "3y", label: "3 tahun terakhir", days: 1095 },
  { value: "5y", label: "5 tahun terakhir", days: 1825 },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

/**
 * Format a number as Indonesian Rupiah.
 * Auto-abbreviates: jt (juta), M (miliar).
 */
export function formatRupiah(value: number): string {
  if (value >= 1_000_000_000)
    return `Rp ${(value / 1_000_000_000).toFixed(2)}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(2)}jt`;
  return `Rp ${value.toLocaleString("id-ID")}`;
}

/**
 * Format a Date as a clean "YYYY-MM-DD" string using UTC values.
 * Safe to use directly in API query params — no timezone bleed.
 */
export function formatDateParam(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ─── URL builders ─────────────────────────────────────────────────────────────

/**
 * Build a `?date=YYYY-MM-DD` query string from a Date.
 * Returns empty string when date is undefined.
 *
 * @example
 * `/api/omset${buildDateParam(selectedMonth)}`
 * // → "/api/omset?date=2026-02-28"
 */
export function buildDateParam(date: Date | undefined): string {
  if (!date) return "";
  return `?date=${formatDateParam(date)}`;
}

// ─── Range helpers ────────────────────────────────────────────────────────────

/**
 * Returns the start Date (UTC midnight) for a given DateRange relative to now.
 */
export function getRangeStartDate(range: DateRange): Date {
  const option = DATE_RANGE_OPTIONS.find((o) => o.value === range);
  const days = option?.days ?? 30;
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - days);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

/**
 * Filter an array of items with a `createdAt` string field by a DateRange.
 * Purely client-side — no network request.
 */
export function filterByDateRange<T extends { createdAt: string }>(
  items: T[],
  range: DateRange,
): T[] {
  const start = getRangeStartDate(range);
  return items.filter((item) => new Date(item.createdAt) >= start);
}

// ─── API-side parser ──────────────────────────────────────────────────────────

/**
 * Parse URLSearchParams into a Prisma `createdAt` filter object.
 *
 * Priority:
 * 1. `gte` + `lt`  — explicit ISO range (future use / flexibility)
 * 2. `date`        — filter by calendar month; accepts any parseable date string
 * 3. nothing       — no filter, return all records
 *
 * All bounds are computed in UTC to match how Prisma/PostgreSQL stores timestamps.
 *
 * @example
 * // In an API route:
 * const { searchParams } = new URL(request.url);
 * const where = { createdById: user.id, ...parseDateFilter(searchParams) };
 */

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function parseDateFilter(searchParams: URLSearchParams): {
  createdAt?: { gte: Date; lt: Date };
} {
  const gte = searchParams.get("gte");
  const lt = searchParams.get("lt");
  const date = searchParams.get("date");

  if (gte && lt) {
    return {
      createdAt: {
        gte: new Date(gte),
        lt: new Date(lt),
      },
    };
  }

  if (date) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return {};

    const year = parsed.getUTCFullYear();
    const month = parsed.getUTCMonth();

    return {
      createdAt: {
        gte: new Date(Date.UTC(year, month, 1)),
        lt: new Date(Date.UTC(year, month + 1, 1)),
      },
    };
  }

  return {};
}
