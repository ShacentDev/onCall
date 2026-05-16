import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/errors";

type PersonEntry = {
  kode: string;
  nama: string;
};

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const { persons } = (await req.json()) as { persons: PersonEntry[] };

    if (!persons || persons.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data untuk diimpor." },
        { status: 400 },
      );
    }

    const codes = persons.map((p) => p.kode);

    const existing = await prisma.person.findMany({
      where: { code: { in: codes } },
      select: { id: true, code: true, name: true },
    });

    const existingByCode = new Map(existing.map((p) => [p.code, p]));

    const toUpdate = persons.filter((p) => {
      const found = existingByCode.get(p.kode);
      return found && found.name !== p.nama;
    });

    const notFound = persons
      .filter((p) => !existingByCode.has(p.kode))
      .map((p) => p.kode);

    await Promise.all(
      toUpdate.map((p) =>
        prisma.person.update({
          where: { code: p.kode },
          data: { name: p.nama },
        }),
      ),
    );

    return NextResponse.json({
      message: [
        `${toUpdate.length} nama person diperbarui.`,
        notFound.length > 0
          ? `${notFound.length} kode tidak ditemukan di database: ${notFound.slice(0, 10).join(", ")}${notFound.length > 10 ? "..." : ""}`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      updated: toUpdate.length,
      notFound,
    });
  } catch (err) {
    return handleApiError(err);
  }
}