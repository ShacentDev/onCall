import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";
import {
  createCategorySchema,
  deleteCategorySchema,
  editCategorySchema,
} from "@/lib/zod";
import { requireAdmin } from "@/lib/session";
import { PrismaClientKnownRequestError } from "@/app/generated/prisma/internal/prismaNamespace";

export async function GET() {
  try {
    await requireAdmin();

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const result = createCategorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.category.create({
      data: {
        name: result.data.name,
      },
    });

    return NextResponse.json({ message: "Kategori berhasil ditambahkan." });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Lokasi dengan nama yang sama sudah ada." },
        { status: 400 },
      );
    }
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const result = editCategorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.category.update({
      where: {
        id: result.data.id,
      },
      data: { name: result.data.name },
    });

    return NextResponse.json({ message: "Kategori diperbarui." });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const result = deleteCategorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.category.delete({
      where: { id: result.data.id },
    });

    return NextResponse.json({ message: "Kategori dihapus." });
  } catch (error) {
    return handleApiError(error);
  }
}
