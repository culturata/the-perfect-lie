import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const designer = searchParams.get("designer") || "";
    const tourStop = searchParams.get("tourStop") === "true";
    const majorVenue = searchParams.get("majorVenue") === "true";
    const historic = searchParams.get("historic") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { designer: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (designer) {
      where.designer = { contains: designer, mode: "insensitive" };
    }

    if (tourStop) {
      where.tourStop = true;
    }

    if (majorVenue) {
      where.majorVenue = true;
    }

    if (historic) {
      where.historic = true;
    }

    // Get total count
    const total = await db.course.count({ where });

    // Get paginated courses
    const courses = await db.course.findMany({
      where,
      orderBy: { lastUpdated: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in courses API:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
