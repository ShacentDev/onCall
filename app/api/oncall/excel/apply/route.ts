import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/errors";

type OnCallEntry = {
  personId: string | null;
  personCode: string;
  specialization: string;
  date: string;
  startTime: string;
  endTime: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();

    const { toCreate } = (await request.json()) as { toCreate: OnCallEntry[] };

    if (!toCreate || toCreate.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data untuk diimpor." },
        { status: 400 },
      );
    }

    // ── 1. Deduplicate input (same doctor, same room, same day) ──────────────
    // Guards against duplicate rows within the payload itself, in addition to
    // the dedup already done in the upload/parse step.
    const seenKeys = new Set<string>();
    const deduplicatedEntries = toCreate.filter((item) => {
      const key = `${item.personCode}|${item.date}|${item.specialization}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    // ── 2. Resolve / create categories ───────────────────────────────────────
    const uniqueSpecializations = [
      ...new Set(deduplicatedEntries.map((i) => i.specialization)),
    ];
    const uniqueCodes = [
      ...new Set(deduplicatedEntries.map((i) => i.personCode)),
    ];

    const existingCategories = await prisma.category.findMany({
      where: { name: { in: uniqueSpecializations } },
    });
    const categoryByName = new Map(
      existingCategories.map((c) => [c.name, c.id]),
    );

    const missingCategories = uniqueSpecializations.filter(
      (s) => !categoryByName.has(s),
    );

    if (missingCategories.length > 0) {
      await prisma.category.createMany({
        data: missingCategories.map((name) => ({ name })),
        skipDuplicates: true,
      });

      const newCategories = await prisma.category.findMany({
        where: { name: { in: missingCategories } },
      });
      for (const cat of newCategories) {
        categoryByName.set(cat.name, cat.id);
      }
    }

    // ── 3. Resolve / create persons ──────────────────────────────────────────
    const existingPersons = await prisma.person.findMany({
      where: { code: { in: uniqueCodes } },
    });
    const personByCode = new Map(existingPersons.map((p) => [p.code, p.id]));

    // For each unknown code, record the first specialization encountered so the
    // new person gets a sensible default category.
    const missingPersonEntries = deduplicatedEntries
      .filter((item) => !personByCode.has(item.personCode))
      .reduce(
        (acc, item) => {
          if (!acc.has(item.personCode)) {
            acc.set(item.personCode, {
              code: item.personCode,
              categoryName: item.specialization,
            });
          }
          return acc;
        },
        new Map<string, { code: string; categoryName: string }>(),
      );

    if (missingPersonEntries.size > 0) {
      await prisma.person.createMany({
        data: Array.from(missingPersonEntries.values()).map(
          ({ code, categoryName }) => ({
            name: code,
            code,
            categoryId: categoryByName.get(categoryName)!,
          }),
        ),
        skipDuplicates: true,
      });

      const newPersons = await prisma.person.findMany({
        where: { code: { in: Array.from(missingPersonEntries.keys()) } },
      });
      for (const p of newPersons) {
        personByCode.set(p.code, p.id);
      }
    }
    
    const minTime = deduplicatedEntries.reduce((min, r) => {
      const t = new Date(r.startTime).getTime();
      return t < min ? t : min;
    }, Infinity);
    const maxTime = deduplicatedEntries.reduce((max, r) => {
      const t = new Date(r.endTime).getTime();
      return t > max ? t : max;
    }, -Infinity);

    const existingOnCalls = await prisma.personOnCall.findMany({
      where: {
        startTime: { gte: new Date(minTime), lte: new Date(maxTime) },
      },
      include: { person: true },
    });

    const existingDbKeys = new Set(
      existingOnCalls.map(
        (oc) =>
          `${oc.person.code}|${oc.startTime.toISOString().split("T")[0]}|${oc.room}`,
      ),
    );

    const finalEntries = deduplicatedEntries.filter(
      (item) =>
        !existingDbKeys.has(
          `${item.personCode}|${item.date}|${item.specialization}`,
        ),
    );

    if (finalEntries.length === 0) {
      return NextResponse.json({
        message:
          "Semua data sudah ada di database (tidak ada jadwal baru yang ditambahkan).",
        inserted: 0,
      });
    }

    await prisma.personOnCall.createMany({
      data: finalEntries.map((item) => ({
        personId: personByCode.get(item.personCode)!,
        room: item.specialization,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
        createdById: session.user.id,
      })),
      skipDuplicates: true, 
    });

    const skippedCount = deduplicatedEntries.length - finalEntries.length;
    const newCategoriesCount = missingCategories.length;
    const newPersonsCount = missingPersonEntries.size;

    return NextResponse.json({
      message: [
        `Import berhasil. ${finalEntries.length} jadwal ditambahkan.`,
        skippedCount > 0
          ? `${skippedCount} jadwal dilewati karena sudah ada.`
          : "",
        newPersonsCount > 0 ? `${newPersonsCount} person baru dibuat.` : "",
        newCategoriesCount > 0
          ? `${newCategoriesCount} kategori baru dibuat.`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      inserted: finalEntries.length,
      skipped: skippedCount,
    });
  } catch (err) {
    return handleApiError(err);
  }
}