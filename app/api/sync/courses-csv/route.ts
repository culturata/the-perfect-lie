import { NextResponse } from "next/server";
import { syncCoursesFromCSV } from "@/lib/scrapers/csv-sync";

export async function POST() {
  try {
    console.log("Starting CSV course sync...");

    const result = await syncCoursesFromCSV();

    return NextResponse.json({
      success: true,
      message: "Course sync completed",
      stats: result,
    });
  } catch (error) {
    console.error("Error syncing courses from CSV:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync courses",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET() {
  return POST();
}
