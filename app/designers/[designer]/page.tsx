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
    <div className="container py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-8">
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center transition-colors"
            >
              ← Back to courses
            </Link>

            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{designerName}</h1>
                <p className="text-base md:text-lg text-muted-foreground">Course Designer</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {courses.length} {courses.length === 1 ? "Course" : "Courses"}
              </Badge>
              {tourStops > 0 && (
                <Badge variant="default" className="text-sm px-3 py-1">
                  {tourStops} Tour {tourStops === 1 ? "Stop" : "Stops"}
                </Badge>
              )}
              {majorVenues > 0 && (
                <Badge variant="default" className="text-sm px-3 py-1">
                  {majorVenues} Major {majorVenues === 1 ? "Venue" : "Venues"}
                </Badge>
              )}
              {historicCourses > 0 && (
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {historicCourses} Historic
                </Badge>
              )}
            </div>
          </div>

          {/* Courses Table */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold">Courses</h2>
            <CourseTable courses={courses} />
          </div>
        </div>
      </div>
    </div>
  );
}
