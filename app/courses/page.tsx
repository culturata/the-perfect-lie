import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/courses/course-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses = [];
  let error = null;
  let total = 0;

  try {
    // Fetch courses from database
    total = await db.course.count();
    courses = await db.course.findMany({
      orderBy: { lastUpdated: "desc" },
      take: 24,
    });

    if (total === 0) {
      error = "No courses found. Please sync the database by visiting /api/sync/courses-csv";
    }
  } catch (e) {
    console.error("Error fetching courses:", e);
    error = "Failed to load courses from database. Make sure DATABASE_URL is configured.";
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Course Directory</Badge>
            {total > 0 && (
              <Badge variant="outline">{total} courses</Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Browse GSPro Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover thousands of GSPro courses from designers around the world.
            Data synced daily from Pakman Studios CSV.
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

        {/* Course Grid */}
        {courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  name={course.name}
                  designer={course.designer}
                  dateAdded={course.dateAdded.toISOString()}
                  lastUpdated={course.lastUpdated.toISOString()}
                />
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Showing {courses.length} of {total} courses • Data from{" "}
                <a
                  href="https://pakgolfstudios.com/gspro-course-list/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  PakGolf Studios
                </a>
              </p>
              <p className="mt-2 text-xs">
                Course data synced daily from CSV for reliability
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
