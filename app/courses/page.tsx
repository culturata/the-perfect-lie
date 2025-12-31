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
    <div className="container px-4 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Course Directory</Badge>
            {total > 0 && (
              <Badge variant="outline">{total.toLocaleString()} courses</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Browse GSPro Courses
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Discover thousands of GSPro courses from designers around the world.
            Search, filter, and sort to find the perfect course for your golf simulator.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Loading message */}
        {!error && courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Loading courses from database...
            </p>
          </div>
        )}

        {/* Course Table */}
        {courses.length > 0 && (
          <>
            <CourseTable courses={courses} />

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Data from{" "}
                <a
                  href="https://pakgolfstudios.com/gspro-course-list/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
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
  );
}
