import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/errors";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { cellDates: false });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<{ kode: string; nama: string }>(
      sheet,
      { defval: "" },
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "File excel kosong." },
        { status: 400 },
      );
    }

    const headers = Object.keys(rows[0]);
    if (!headers.includes("kode") || !headers.includes("nama")) {
      return NextResponse.json(
        { message: 'Header "kode" dan "nama" harus ada di file.' },
        { status: 400 },
      );
    }

    const parsed = rows
      .map((row) => ({
        kode: row.kode?.toString().trim(),
        nama: row.nama?.toString().trim(),
      }))
      .filter((row) => row.kode && row.nama);

    return NextResponse.json({ persons: parsed });
  } catch (err) {
    return handleApiError(err);
  }
}