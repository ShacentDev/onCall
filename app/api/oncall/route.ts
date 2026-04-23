import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAdmin();

    const oncalls = await prisma.onCall.findMany({
      where: {
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });


    return NextResponse.json(oncalls);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const body = await request.json();

    const {
      doctorName,
      specialization,
      room,
      startTime,
      endTime,
      notes,
    } = body;

    if (new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json(
        { message: "Start time harus sebelum end time" },
        { status: 400 }
      );
    }

    await prisma.onCall.create({
      data: {
        doctorName,
        specialization,
        room,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        createdById: user.id,
      },
    });

    return NextResponse.json({
      message: "OnCall berhasil ditambahkan.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "ID wajib diisi." },
        { status: 400 },
      );
    }

    const existing = await prisma.onCall.findUnique({
      where: { id: body.id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data tidak ditemukan." },
        { status: 404 },
      );
    }

    if (existing.createdById !== user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      );
    }

    const {
      doctorName,
      specialization ,
      room,
      startTime,
      endTime,
      notes,
    } = body;

    if (new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json(
        { message: "Waktu tidak valid." },
        { status: 400 },
      );
    }

    await prisma.onCall.update({
      where: { id: body.id },
      data: {
        doctorName,
        specialization ,
        room,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "OnCall berhasil diperbarui.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const { id } = await request.json();

    if (typeof id !== "string") {
      return NextResponse.json(
        { message: "ID tidak valid." },
        { status: 400 },
      );
    }

    const existing = await prisma.onCall.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Data tidak ditemukan." },
        { status: 404 },
      );
    }

    if (existing.createdById !== user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      );
    }

    await prisma.onCall.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "OnCall berhasil dihapus.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}