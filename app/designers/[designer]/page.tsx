import { Badge } from "@/components/ui/badge";
import { CourseTable } from "@/components/courses/course-table";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";

interface DesignerPageProps {
  params: Promise<{
    designer: string;
  }>;
}

export default async function DesignerPage({ params }: DesignerPageProps) {
  const { designer } = await params;
  const designerName = decodeURIComponent(designer);

  // Fetch courses by this designer
  const courses = await db.course.findMany({
    where: {
      designer: {
        contains: designerName,
        mode: "insensitive",
      },
    },
    orderBy: { lastUpdated: "desc" },
  });

  if (courses.length === 0) {
    notFound();
  }

  // Calculate stats
  const tourStops = courses.filter((c) => c.tourStop).length;
  const majorVenues = courses.filter((c) => c.majorVenue).length;
  const historicCourses = courses.filter((c) => c.historic).length;

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <Link
            href="/courses"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
          >
            ← Back to courses
          </Link>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{designerName}</h1>
              <p className="text-muted-foreground mt-1">Course Designer</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {courses.length} {courses.length === 1 ? "Course" : "Courses"}
            </Badge>
            {tourStops > 0 && (
              <Badge variant="default">
                {tourStops} Tour {tourStops === 1 ? "Stop" : "Stops"}
              </Badge>
            )}
            {majorVenues > 0 && (
              <Badge variant="default">
                {majorVenues} Major {majorVenues === 1 ? "Venue" : "Venues"}
              </Badge>
            )}
            {historicCourses > 0 && (
              <Badge variant="secondary">
                {historicCourses} Historic
              </Badge>
            )}
          </div>
        </div>

        {/* Courses Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Courses</h2>
          <CourseTable courses={courses} />
        </div>
      </div>
    </div>
  );
}
