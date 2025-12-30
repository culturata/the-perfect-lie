import { NextRequest, NextResponse } from "next/server";
import { scrapePakmanCourses } from "@/lib/scrapers/pakman";

// Cache courses in memory for 1 hour
let coursesCache: {
  data: any[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const designer = searchParams.get("designer") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");

    // Check if cache is valid
    const now = Date.now();
    if (
      !coursesCache ||
      now - coursesCache.timestamp > CACHE_DURATION
    ) {
      console.log("Cache miss or expired, scraping fresh data...");
      const courses = await scrapePakmanCourses();
      coursesCache = {
        data: courses,
        timestamp: now,
      };
    } else {
      console.log("Using cached course data");
    }

    let filteredCourses = [...coursesCache.data];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchLower) ||
          course.designer?.toLowerCase().includes(searchLower)
      );
    }

    // Apply designer filter
    if (designer) {
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.designer?.toLowerCase() === designer.toLowerCase()
      );
    }

    // Sort by date (newest first)
    filteredCourses.sort((a, b) => {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });

    // Calculate pagination
    const total = filteredCourses.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return NextResponse.json({
      courses: paginatedCourses,
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
