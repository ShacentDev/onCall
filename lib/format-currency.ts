// lib/format.ts

/**
 * Format angka ke singkatan mata uang (tanpa prefix "Rp")
 * Digunakan untuk label axis chart
 * Contoh: 1500000 → "1.5jt", 1500 → "2rb"
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000)
    return `${(value / 1_000_000_000).toFixed(2)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return value.toString();
}

/**
 * Format angka ke format Rupiah lengkap (dengan prefix "Rp")
 * Digunakan untuk display stats card dan summary
 * Contoh: 1500000 → "Rp 1.50jt", 500 → "Rp 500"
 */
export function formatRupiah(value: number): string {
  if (value >= 1_000_000_000)
    return `Rp ${(value / 1_000_000_000).toFixed(2)}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(2)}jt`;
  return `Rp ${value.toLocaleString("id-ID")}`;
}

/**
 * Hitung margin rate dari omset dan income
 * Contoh: omset 1000, income 300 → "30.0"
 */
export function calcMarginRate(omset: number, income: number): string {
  return omset > 0 ? ((income / omset) * 100).toFixed(1) : "0";
}

/**
 * Reduce array of entries ke total harga
 */
export function sumTotalPrice<T extends { totalPrice: number | bigint }>(
  entries: T[] | undefined,
): number {
  return Array.isArray(entries)
    ? entries.reduce((sum, e) => sum + Number(e.totalPrice), 0)
    : 0;
}

/**
 * Reduce array of entries ke total jumlah items
 */
export function sumTotalItems<T extends { items: unknown[] }>(
  entries: T[] | undefined,
): number {
  return Array.isArray(entries)
    ? entries.reduce((sum, e) => sum + e.items.length, 0)
    : 0;
}

export function formatRupiahInput(value: string | number): string {
  const val = typeof value === "number" ? String(value) : value;
  const numeric = val.replace(/\D/g, "");
  if (!numeric) return "";
  return Number(numeric).toLocaleString("id-ID");
}

export function parseRupiahInput(value: string): string {
  return value.replace(/\./g, "").replace(/\D/g, "");
}