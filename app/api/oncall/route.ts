import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";
import {
  createPersonOnCallSchema,
  deletePersonOnCallSchema,
  editPersonOnCallSchema,
} from "@/lib/zod";
import { requireAdmin } from "@/lib/session";
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfDay,
  endOfDay,
} from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const weekOffsetParam = searchParams.get("weekOffset");

    if (weekOffsetParam === null) {
      const onCalls = await prisma.personOnCall.findMany({
        where: {
          OR: [
            { person: { name: { contains: search, mode: "insensitive" } } },
            { person: { code: { contains: search, mode: "insensitive" } } },
            {
              person: {
                category: { name: { contains: search, mode: "insensitive" } },
              },
            },
            { room: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy: [
          { person: { category: { name: "asc" } } },
          { person: { name: "asc" } },
          { startTime: "asc" },
        ],
        include: {
          person: { include: { category: true } },
        },
      });

      return NextResponse.json(onCalls);
    }

    const weekOffset = parseInt(weekOffsetParam);
    const baseDate = addWeeks(new Date(), weekOffset);
    const weekStart = startOfDay(startOfWeek(baseDate, { weekStartsOn: 1 }));
    const weekEnd = endOfDay(endOfWeek(baseDate, { weekStartsOn: 1 }));

    const onCalls = await prisma.personOnCall.findMany({
      where: {
        startTime: { gte: weekStart, lte: weekEnd },
        ...(search && {
          OR: [
            { person: { name: { contains: search, mode: "insensitive" } } },
            { person: { code: { contains: search, mode: "insensitive" } } },
            {
              person: {
                category: { name: { contains: search, mode: "insensitive" } },
              },
            },
          ],
        }),
      },
      orderBy: [
        { startTime: "asc" },
        { person: { category: { name: "asc" } } },
        { person: { name: "asc" } },
      ],
      include: {
        person: { include: { category: true } },
      },
    });

    return NextResponse.json({
      data: onCalls,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      weekOffset,
    });
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
