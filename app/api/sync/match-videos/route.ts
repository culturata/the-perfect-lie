import { NextResponse } from "next/server";
import { matchVideosWithCourses } from "@/lib/services/video-course-matcher";

export async function POST() {
  try {
    console.log("Starting video-course matching...");
    const results = await matchVideosWithCourses();

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("Error matching videos with courses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to match videos with courses",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Allow GET for easy testing
  return POST();
}
