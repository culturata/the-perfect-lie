import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Download, Calendar, User, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Generate static params for common courses
export async function generateStaticParams() {
  return []; // Dynamic for now, can add static generation later
}

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  // Fetch course from database by matching the slug
  let course = null;
  try {
    // Get all courses and find the one that matches the slug
    const courses = await db.course.findMany();

    // Find course by slug (URL-encoded name)
    course = courses.find(
      (c) => encodeURIComponent(c.name.toLowerCase().replace(/\s+/g, "-")) === slug
    );

    if (!course) {
      notFound();
    }
  } catch (error) {
    console.error("Error loading course:", error);
    notFound();
  }

  const updateDate = new Date(course.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/courses"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
          >
            ← Back to courses
          </Link>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {course.name}
                </h1>
                {course.designer && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Designed by {course.designer}</span>
                  </div>
                )}
              </div>

              <Button size="lg" asChild>
                <a
                  href={course.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {updateDate}</span>
              </div>
              <Badge variant="secondary">GSPro Compatible</Badge>
            </div>
          </div>
        </div>

        {/* Rating Summary - Coming Soon */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Community Rating</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (Coming Soon)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sign in to rate this course and leave a review
            </p>
          </CardContent>
        </Card>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{course.name}</span>
                </div>
                {course.designer && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Designer</span>
                    <span className="text-sm font-medium">{course.designer}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">{updateDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This course is hosted on Google Drive. Click the download button to
                access the course files.
              </p>
              <Button className="w-full" asChild>
                <a
                  href={course.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Course
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section - Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews & Comments</CardTitle>
            <CardDescription>
              Share your experience with this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Reviews and comments are coming soon!
              </p>
              <p className="text-sm text-muted-foreground">
                Sign in to be the first to review this course
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Videos */}
        <Card>
          <CardHeader>
            <CardTitle>Related Flyover Videos</CardTitle>
            <CardDescription>
              Watch video tours of this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Check the{" "}
              <Link href="/flyovers" className="text-primary hover:underline">
                Flyovers
              </Link>{" "}
              page to see if there's a video tour available
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
