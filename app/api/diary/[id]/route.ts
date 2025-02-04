import { updateFormSchema } from "@/types/schema";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const diary = await prisma.siteDiary.findUnique({
      where: { id: parseInt(params.id) },
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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }
    const parsedBody = await updateFormSchema.parseAsync(body);

    const updatedDiary = await prisma.siteDiary.update({
      where: { id: parseInt(params.id) },
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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.siteDiary.delete({ where: { id: parseInt(params.id) } });

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
