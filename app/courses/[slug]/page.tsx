import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Calendar, User, MapPin, Star } from "lucide-react";
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
  let videos = [];

  try {
    // Get all courses and find the one that matches the slug
    const courses = await db.course.findMany({
      include: {
        videos: true, // Include linked flyover videos
      },
    });

    // Find course by slug (URL-encoded name)
    course = courses.find(
      (c) => encodeURIComponent(c.name.toLowerCase().replace(/\s+/g, "-")) === slug
    );

    if (!course) {
      notFound();
    }

    videos = course.videos || [];
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
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
            >
              ← Back to courses
            </Link>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {course.name}
              </h1>
              {course.designer && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>
                    Designed by{" "}
                    <Link
                      href={`/designers/${encodeURIComponent(course.designer)}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {course.designer}
                    </Link>
                  </span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{course.name}</span>
                </div>
                {course.designer && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Designer</span>
                    <Link
                      href={`/designers/${encodeURIComponent(course.designer)}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {course.designer}
                    </Link>
                  </div>
                )}
                {course.location && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium">{course.location}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">{updateDate}</span>
                </div>
                {course.version && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm font-medium">{course.version}</span>
                  </div>
                )}
                {course.server && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Server</span>
                    <span className="text-sm font-medium">{course.server}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {course.tourStop && (
                <Badge variant="default">Tour Stop</Badge>
              )}
              {course.majorVenue && (
                <Badge variant="default">Major Venue</Badge>
              )}
              {course.historic && (
                <Badge variant="secondary">Historic</Badge>
              )}
            </div>
          </CardContent>
        </Card>

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
              <p className="text-muted-foreground mb-2">
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
            <CardTitle>Flyover Videos</CardTitle>
            <CardDescription>
              {videos.length > 0
                ? "Watch video tours of this course"
                : "No flyover videos available yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg overflow-hidden border hover:border-primary transition-colors"
                  >
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-card">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.channelTitle}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No flyover videos have been linked to this course yet. Check the{" "}
                <Link href="/flyovers" className="text-primary hover:underline">
                  Flyovers
                </Link>{" "}
                page to see all available videos.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
