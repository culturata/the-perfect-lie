import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/courses/course-card";
import { scrapePakmanCourses } from "@/lib/scrapers/pakman";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses = [];
  let error = null;
  let total = 0;

  try {
    const allCourses = await scrapePakmanCourses();
    // Sort by most recent first
    courses = allCourses
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 24); // Show first 24 courses
    total = allCourses.length;
  } catch (e) {
    console.error("Error fetching courses:", e);
    error = "Failed to load courses. Please try again later.";
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
            Downloaded directly from Pakman Studios.
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
              Loading courses from Pakman Studios...
            </p>
          </div>
        )}

        {/* Course Grid */}
        {courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard
                  key={index}
                  name={course.name}
                  designer={course.designer}
                  dateAdded={course.dateAdded.toISOString()}
                  lastUpdated={course.lastUpdated.toISOString()}
                  downloadUrl={course.downloadUrl}
                />
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Showing {courses.length} of {total} courses • Data sourced from{" "}
                <a
                  href="https://pakmanstudios.com/gspro-course-list/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Pakman Studios
                </a>
              </p>
              <p className="mt-2 text-xs">
                Course data is cached for 1 hour for better performance
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
