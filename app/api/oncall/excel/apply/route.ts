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

    const uniqueSpecializations = [
      ...new Set(toCreate.map((i) => i.specialization)),
    ];
    const uniqueCodes = [...new Set(toCreate.map((i) => i.personCode))];

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
    const personByCode = new Map(existingPersons.map((p) => [p.code, p.id]));

    const missingPersonEntries = toCreate
      .filter((item) => !personByCode.has(item.personCode))
      .reduce((acc, item) => {
        if (!acc.has(item.personCode)) {
          acc.set(item.personCode, {
            code: item.personCode,
            categoryName: item.specialization,
          });
        }
        return acc;
      }, new Map<string, { code: string; categoryName: string }>());

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

    await prisma.personOnCall.createMany({
      data: toCreate.map((item) => ({
        personId: personByCode.get(item.personCode)!,
        room: item.specialization,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
        createdById: session.user.id,
      })),
      skipDuplicates: true,
    });

    const newCategoriesCount = missingCategories.length;
    const newPersonsCount = missingPersonEntries.size;

    return NextResponse.json({
      message: `Import berhasil. ${toCreate.length} jadwal ditambahkan.${
        newPersonsCount > 0 ? ` ${newPersonsCount} person baru dibuat.` : ""
      }${
        newCategoriesCount > 0
          ? ` ${newCategoriesCount} kategori baru dibuat.`
          : ""
      }`,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
