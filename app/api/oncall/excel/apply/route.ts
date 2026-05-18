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

    const { toCreate } = (await request.json()) as {
      toCreate: OnCallEntry[];
    };

    if (!toCreate || toCreate.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data untuk diimport." },
        { status: 400 },
      );
    }

    const seen = new Set<string>();
    const deduplicatedEntries = toCreate.filter((item) => {
      const key = `${item.personCode}|${item.date}|${item.specialization}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

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

    const existingPersons = await prisma.person.findMany({
      where: { code: { in: uniqueCodes } },
    });
    const personByCode = new Map(existingPersons.map((p) => [p.code, p]));

    const missingPersonCodes = uniqueCodes.filter(
      (code) => !personByCode.has(code),
    );

    if (missingPersonCodes.length > 0) {
      const newPersonData = missingPersonCodes.map((code) => {
        const entry = deduplicatedEntries.find((e) => e.personCode === code)!;
        return {
          name: code,
          code,
          categoryId: categoryByName.get(entry.specialization)!,
        };
      });

      await prisma.person.createMany({
        data: newPersonData,
        skipDuplicates: true,
      });

      const newPersons = await prisma.person.findMany({
        where: { code: { in: missingPersonCodes } },
      });
      for (const p of newPersons) {
        personByCode.set(p.code, p);
      }
    }

    const minTime = deduplicatedEntries.reduce((min, item) => {
      const t = new Date(item.startTime).getTime();
      return t < min ? t : min;
    }, Infinity);

    const maxTime = deduplicatedEntries.reduce((max, item) => {
      const t = new Date(item.endTime).getTime();
      return t > max ? t : max;
    }, -Infinity);

    const existingOnCalls = await prisma.personOnCall.findMany({
      where: {
        startTime: { gte: new Date(minTime), lte: new Date(maxTime) },
      },
      include: { person: true },
    });

    const existingKeys = new Set(
      existingOnCalls.map((oc) => `${oc.person.code}|${oc.date}|${oc.room}`),
    );

    const finalEntries = deduplicatedEntries.filter(
      (item) =>
        !existingKeys.has(
          `${item.personCode}|${item.date}|${item.specialization}`,
        ),
    );

    if (finalEntries.length > 0) {
      await prisma.personOnCall.createMany({
        data: finalEntries.map((item) => ({
          personId: personByCode.get(item.personCode)!.id,
          room: item.specialization,
          date: item.date,
          startTime: new Date(item.startTime),
          endTime: new Date(item.endTime),
          createdById: session.user.id,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      message: `Import berhasil. ${finalEntries.length} jadwal ditambahkan.`,
      inserted: finalEntries.length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}