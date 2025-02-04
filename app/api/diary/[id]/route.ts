import { updateFormSchema } from "@/types/schema";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const diary = await prisma.siteDiary.findUnique({
      where: { id: parseInt(id) },
    });

    if (!diary) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Diary entry not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: diary,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch diary" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    const { id } = await params;
    const parsedBody = await updateFormSchema.parseAsync(body);

    const updatedDiary = await prisma.siteDiary.update({
      where: { id: parseInt(id) },
      data: { ...parsedBody },
    });

    return NextResponse.json({
      data: updatedDiary,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "INTERNAL_SERVER_ERROR", error: "Failed to update diary" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.siteDiary.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({
      data: {
        message: "Diary entry deleted successfully",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete diary" }, { status: 500 });
  }
}
