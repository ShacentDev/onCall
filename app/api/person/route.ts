import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";
import {
  createPersonSchema,
  deletePersonSchema,
  editPersonSchema,
} from "@/lib/zod";
import { requireAdmin } from "@/lib/session";
import { PrismaClientKnownRequestError } from "@/app/generated/prisma/internal/prismaNamespace";

export async function GET() {
  try {
    await requireAdmin();

    const persons = await prisma.person.findMany({
      orderBy: { name: "asc" },
      include: { category: true },
    });

    return NextResponse.json(persons);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const result = createPersonSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.person.create({
      data: {
        name: result.data.name,
        code: result.data.code,
        categoryId: result.data.categoryId,
      },
    });

    return NextResponse.json({ message: "Person berhasil ditambahkan." });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Kode person sudah digunakan." },
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

    const result = editPersonSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.person.update({
      where: { id: result.data.id },
      data: {
        name: result.data.name,
        code: result.data.code,
        categoryId: result.data.categoryId,
      },
    });

    return NextResponse.json({ message: "Person diperbarui." });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Kode person sudah digunakan." },
        { status: 400 },
      );
    }
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const result = deletePersonSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.person.delete({
      where: { id: result.data.id },
    });

    return NextResponse.json({ message: "Person dihapus." });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          message:
            "Person tidak dapat dihapus karena masih memiliki jadwal on call.",
        },
        { status: 400 },
      );
    }
    return handleApiError(error);
  }
}
