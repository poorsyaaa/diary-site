import { formSchema, siteDiaryFilterSchema } from "@/types/schema";
import { Prisma, PrismaClient } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    const parsedBody = await formSchema.parseAsync(body);

    const newDiary = await prisma.siteDiary.create({
      data: {
        date: new Date(parsedBody.date),
        siteLocation: parsedBody.siteLocation,
        weather: parsedBody.weather,
        description: parsedBody.description,
        currentPhase: parsedBody.currentPhase,
        workCompleted: parsedBody.workCompleted,
        hasDelaysOrIssues: parsedBody.hasDelaysOrIssues,
        delaysOrIssues: parsedBody.delaysOrIssues,
        labor: parsedBody.labor,
        equipment: parsedBody.equipment,
        materials: parsedBody.materials,
        visitors: parsedBody.visitors,
        images: parsedBody?.images,
      },
    });

    return NextResponse.json(
      {
        data: newDiary,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json({ code: "INVALID_INPUT", message: error.issues }, { status: 400 });
    }

    return NextResponse.json({ code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const filters = siteDiaryFilterSchema.parse({
      date: searchParams.get("date") ?? undefined,
      site: searchParams.get("site") ?? undefined,
      phase: searchParams.get("phase") ?? undefined,
      hasIssues: searchParams.get("hasIssues") ? searchParams.get("hasIssues") === "true" : undefined,
      search: searchParams.get("search") ?? undefined,
      resources: searchParams.get("resources") ?? undefined,
      orderBy: searchParams.get("orderBy") ?? "createdAt",
      order: searchParams.get("order") ?? "desc",
    });

    const whereConditions: Prisma.SiteDiaryWhereInput = {};

    if (filters.site) {
      whereConditions.siteLocation = filters.site;
    }

    if (filters.search) {
      whereConditions.OR = [
        { currentPhase: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.hasIssues !== undefined) {
      whereConditions.hasDelaysOrIssues = filters.hasIssues;
    }

    if (filters.date) {
      const localDate = new Date(filters.date);
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const startLocalDay = startOfDay(localDate);
      const endLocalDay = endOfDay(localDate);

      const startUTC = toZonedTime(startLocalDay, userTimeZone);
      const endUTC = toZonedTime(endLocalDay, userTimeZone);

      whereConditions.date = {
        gte: startUTC,
        lte: endUTC,
      };
    }

    const resourceFilters: Prisma.SiteDiaryWhereInput[] = [];

    if (filters?.resources?.includes("weather")) {
      resourceFilters.push({ weather: { not: "" } }); // Ensure weather data exists
    }

    if (filters?.resources?.includes("visitors")) {
      resourceFilters.push({
        visitors: {
          isEmpty: false,
        },
      });
    }

    if (filters?.resources?.includes("labor")) {
      resourceFilters.push({ labor: { not: "" } });
    }

    if (filters?.resources?.includes("equipment")) {
      resourceFilters.push({ equipment: { not: "" } });
    }

    if (filters?.resources?.includes("materials")) {
      resourceFilters.push({ materials: { not: "" } });
    }

    if (filters?.resources?.includes("photos")) {
      resourceFilters.push({
        images: {
          isEmpty: false,
        },
      });
    }

    if (resourceFilters.length > 0) {
      whereConditions.AND = [{ OR: resourceFilters }];
    }

    const orderBy: Prisma.SiteDiaryOrderByWithRelationInput = {
      [filters.orderBy]: filters.order,
    };

    const diaries = await prisma.siteDiary.findMany({
      where: whereConditions,
      orderBy,
    });

    return NextResponse.json({ data: diaries });
  } catch (error) {
    console.error("Error fetching site diaries:", error);
    return NextResponse.json({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch diaries" }, { status: 500 });
  }
}
