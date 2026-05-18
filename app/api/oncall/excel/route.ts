import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/errors";
import * as XLSX from "xlsx";

export const SPECIALIZATION_COLUMNS = [
  "PENYAKIT DALAM",
  "ANAK",
  "OBSGYN",
  "BEDAH UMUM",
  "ANESTESI",
  "BEDAH DIGESTIF",
  "BEDAH TULANG",
  "BEDAH SYARAF",
  "PARU",
  "KARDIOLOGI",
  "NEUROLOGI",
  "RADIOLOGI",
  "THT",
  "MATA",
  "UROLOGI",
  "IT",
  "Keperawatan",
  "Management",
  "BEDAH PLASTIK",
  "ENDOVASCULAR",
  "MAINTENANCE MEDIS",
  "CARDIAC INTERVENSI",
  "ON-SITE ANAK",
  "ON-SITE PENYAKIT DALAM",
  "ON-SITE OBGYN",
  "ON-SITE BEDAH UMUM",
  "BEDAH VASKULAR",
  "BEDAH ANAK",
  "BEDAH ONKOLOGI",
  "BEDAH THORAKS",
];

export const DATE_COLUMN = "TGL (dd-mm-yyyy)";

export function parseExcelDate(raw: any): string | null {
  if (raw === null || raw === undefined || raw === "") return null;

  if (typeof raw === "number") {
    const d = XLSX.SSF.parse_date_code(raw);
    if (!d) return null;

    const yyyy = d.y.toString().padStart(4, "0");
    const mm = d.m.toString().padStart(2, "0");
    const dd = d.d.toString().padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  const str = raw.toString().trim();

  const ddmmyyyy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);

  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;

    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  const yyyymmdd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);

  if (yyyymmdd) {
    const [, yyyy, mm, dd] = yyyymmdd;

    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  return null;
}

// GET: Export template or existing data as Excel
export async function GET() {
  try {
    await requireAdmin();

    const onCalls = await prisma.personOnCall.findMany({
      include: { person: { include: { category: true } } },
      orderBy: { startTime: "asc" },
    });

    const headers = [DATE_COLUMN, ...SPECIALIZATION_COLUMNS];
    const dateMap = new Map<string, Record<string, string>>();

    for (const oc of onCalls) {
      const dateKey = oc.startTime.toISOString().split("T")[0];
      if (!dateMap.has(dateKey)) dateMap.set(dateKey, {});
      // Only keep first doctor per room per day (prevent overwrite showing duplicates)
      if (!dateMap.get(dateKey)![oc.room]) {
        dateMap.get(dateKey)![oc.room] = oc.person.code;
      }
    }

    const rows: any[][] = [headers];

    for (const [dateKey, specMap] of dateMap.entries()) {
      const [yyyy, mm, dd] = dateKey.split("-");
      const row: any[] = [`${dd}/${mm}/${yyyy}`];
      for (const col of SPECIALIZATION_COLUMNS) {
        row.push(specMap[col] ?? "");
      }
      rows.push(row);
    }

    if (rows.length === 1) {
      rows.push(["", ...SPECIALIZATION_COLUMNS.map(() => "")]);
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "On Call");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="template-oncall.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

// POST: Parse & validate uploaded Excel, return preview for confirmation
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const form = await request.formData();
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
    const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "File excel kosong." },
        { status: 400 },
      );
    }

    const actualHeaders = Object.keys(rows[0]);
    if (!actualHeaders.includes(DATE_COLUMN)) {
      return NextResponse.json(
        {
          message: `Header "${DATE_COLUMN}" tidak ditemukan. Pastikan menggunakan template yang benar.`,
        },
        { status: 400 },
      );
    }

    // Warn about any SPECIALIZATION_COLUMNS missing from the uploaded file
    const missingHeaders = SPECIALIZATION_COLUMNS.filter(
      (col) => !actualHeaders.includes(col),
    );
    if (missingHeaders.length > 0) {
      console.warn(
        `[oncall/upload] Kolom tidak ditemukan di file: ${missingHeaders.join(", ")}`,
      );
    }

    const existingPersons = await prisma.person.findMany({
      include: { category: true },
    });
    const personByCode = new Map(existingPersons.map((p) => [p.code, p]));

    const existingCategories = await prisma.category.findMany();
    const categoryByName = new Map(existingCategories.map((c) => [c.name, c]));

    const validationErrors: string[] = [];

    const toCreate: {
      personId: string | null;
      personCode: string;
      specialization: string;
      date: string;
      startTime: string;
      endTime: string;
    }[] = [];

    // Track unique entries within THIS upload to catch intra-file duplicates
    const seenInFile = new Set<string>();

    const newPersonsMap = new Map<
      string,
      { code: string; categoryName: string }
    >();
    const newCategoriesSet = new Set<string>();

    rows.forEach((row, index) => {
      const rowNum = index + 2;

      const rawDate = row[DATE_COLUMN];

      if (!rawDate) return;

      const parsedDate = parseExcelDate(rawDate);

      if (!parsedDate) {
        validationErrors.push(
          `Baris ${rowNum}: format tanggal invalid (${rawDate})`,
        );
        return;
      }

      const startTime = new Date(`${parsedDate}T00:00:00`);
      const endTime = new Date(`${parsedDate}T23:59:59`);

      for (const col of SPECIALIZATION_COLUMNS) {
        if (!actualHeaders.includes(col)) continue;

        const rawValue = row[col];

        if (!rawValue) continue;

        // SUPPORT MULTIPLE PERSON
        const codes = rawValue
          .toString()
          .split(/[\n,;]/)
          .map((v: string) => v.trim())
          .filter(Boolean);

        for (const code of codes) {
          const uniqueKey = `${code}|${parsedDate}|${col}`;

          if (seenInFile.has(uniqueKey)) continue;

          seenInFile.add(uniqueKey);

          const existingPerson = personByCode.get(code);

          if (!existingPerson && !newPersonsMap.has(code)) {
            newPersonsMap.set(code, {
              code,
              categoryName: col,
            });
          }

          if (!categoryByName.has(col)) {
            newCategoriesSet.add(col);
          }

          toCreate.push({
            personId: existingPerson?.id ?? null,
            personCode: code,
            specialization: col,
            date: parsedDate,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          });
        }
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: validationErrors.slice(0, 20).join("\n") },
        { status: 400 },
      );
    }

    // Check duplicates against DB using reduce (safe for large arrays, avoids spread stack overflow)
    let existingOnCalls: Awaited<
      ReturnType<typeof prisma.personOnCall.findMany>
    > & { person: { code: string } }[] = [] as any;

    if (toCreate.length > 0) {
      const minTime = toCreate.reduce((min, r) => {
        const t = new Date(r.startTime).getTime();
        return t < min ? t : min;
      }, Infinity);
      const maxTime = toCreate.reduce((max, r) => {
        const t = new Date(r.endTime).getTime();
        return t > max ? t : max;
      }, -Infinity);

      existingOnCalls = await prisma.personOnCall.findMany({
        where: {
          startTime: {
            gte: new Date(minTime),
            lte: new Date(maxTime),
          },
        },
        include: { person: true },
      });
    }

    const existingKeys = new Set(
      existingOnCalls.map(
        (oc: any) =>
          `${oc.person.code}|${oc.date}|${oc.room}`,
      ),
    );

    const duplicates = toCreate.filter((item) =>
      existingKeys.has(`${item.personCode}|${item.date}|${item.specialization}`),
    );

    const newEntries = toCreate.filter(
      (item) =>
        !existingKeys.has(
          `${item.personCode}|${item.date}|${item.specialization}`,
        ),
    );

    return NextResponse.json({
      toCreate: newEntries,
      duplicates: duplicates.map(
        (d) => `${d.personCode} pada ${d.date} (${d.specialization})`,
      ),
      newCategories: Array.from(newCategoriesSet),
      newPersons: Array.from(newPersonsMap.values()),
      totalRows: toCreate.length,
      missingHeaders,
    });
  } catch (err) {
    return handleApiError(err);
  }
}