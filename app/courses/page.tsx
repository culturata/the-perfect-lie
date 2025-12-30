import { Badge } from "@/components/ui/badge";
import { CourseTable } from "@/components/courses/course-table";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses = [];
  let error = null;
  let total = 0;

  try {
    // Fetch all courses from database
    total = await db.course.count();
    courses = await db.course.findMany({
      orderBy: { lastUpdated: "desc" },
    });

    if (total === 0) {
      error = "No courses found. Please sync the database by visiting /api/sync/courses-csv";
    }
  } catch (e) {
    console.error("Error fetching courses:", e);
    error = "Failed to load courses from database. Make sure DATABASE_URL is configured.";
  }

  return (
    <div className="container py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">Course Directory</Badge>
              {total > 0 && (
                <Badge variant="outline" className="text-sm">{total} courses</Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Browse GSPro Courses
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Discover thousands of GSPro courses from designers around the world.
              Search, filter, and sort to find the perfect course for your golf simulator.
            </p>
          </div>

        {/* Error Message */}
        {error && (
          <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive leading-relaxed">{error}</p>
          </div>
        )}

        {/* Loading message */}
        {!error && courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Loading courses from database...
            </p>
          </div>
        )}

        {/* Course Table */}
        {courses.length > 0 && (
          <>
            <CourseTable courses={courses} />

            <div className="text-center text-sm text-muted-foreground pt-8">
              <p className="leading-relaxed">
                Data from{" "}
                <a
                  href="https://pakgolfstudios.com/gspro-course-list/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  PakGolf Studios
                </a>
                {" "}• Course data synced daily from CSV for reliability
              </p>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
