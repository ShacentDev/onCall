import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";
import {
  createPersonOnCallSchema,
  deletePersonOnCallSchema,
  editPersonOnCallSchema,
} from "@/lib/zod";
import { requireAdmin } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const onCalls = await prisma.personOnCall.findMany({
      where: {
        OR: [
          {
            person: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            person: {
              category: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            room: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: [
        {
          person: {
            category: {
              name: "asc", // 1. kategori dulu
            },
          },
        },
        {
          person: {
            name: "asc", // 2. nama dokter
          },
        },
        {
          startTime: "asc", // 3. jadwal
        },
      ],
      include: {
        person: {
          include: { category: true },
        },
      },
    });

    return NextResponse.json(onCalls);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const session = await requireAdmin();

    const result = createPersonOnCallSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.personOnCall.create({
      data: {
        personId: result.data.personId,
        room: result.data.room,
        startTime: new Date(result.data.startTime),
        endTime: new Date(result.data.endTime),
        notes: result.data.notes ?? null,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Jadwal on call berhasil ditambahkan.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const result = editPersonOnCallSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.personOnCall.update({
      where: { id: result.data.id },
      data: {
        personId: result.data.personId,
        room: result.data.room,
        startTime: new Date(result.data.startTime),
        endTime: new Date(result.data.endTime),
        notes: result.data.notes ?? null,
      },
    });

    return NextResponse.json({ message: "Jadwal on call diperbarui." });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();

    const result = deletePersonOnCallSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.personOnCall.delete({
      where: { id: result.data.id },
    });

    return NextResponse.json({ message: "Jadwal on call dihapus." });
  } catch (error) {
    return handleApiError(error);
  }
}
