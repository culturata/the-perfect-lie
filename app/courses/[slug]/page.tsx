import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { Calendar, User, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentThread } from "@/components/comments/comment-thread";
import { getCourseRatingStats } from "@/app/actions/reviews";
import { auth } from "@clerk/nextjs/server";
import { StarRating } from "@/components/ui/star-rating";

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

  // Fetch reviews and comments
  const { userId } = await auth();
  const reviews = await db.review.findMany({
    where: { courseId: course.id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch rating statistics
  const ratingStats = await getCourseRatingStats(course.id);

  // Check if user has already reviewed this course
  const userReview = reviews.find((review) => review.user.id === userId);

  // Fetch top-level comments (comments without a parent)
  const topLevelComments = await db.comment.findMany({
    where: {
      courseId: course.id,
      parentId: null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      avatarUrl: true,
                    },
                  },
                  replies: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          avatarUrl: true,
                        },
                      },
                      replies: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const updateDate = new Date(course.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-5xl mx-auto space-y-8">
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

        {/* Rating Summary */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Community Rating</CardTitle>
              <div className="flex items-center gap-3">
                {ratingStats.averageRating > 0 ? (
                  <>
                    <StarRating
                      rating={ratingStats.averageRating}
                      readonly
                      size="md"
                    />
                    <div className="text-sm">
                      <span className="font-semibold">
                        {ratingStats.averageRating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        ({ratingStats.totalReviews}{" "}
                        {ratingStats.totalReviews === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No ratings yet
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {userId && !userReview ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Write a Review</h3>
                <ReviewForm courseId={course.id} />
              </div>
            ) : userId && userReview ? (
              <p className="text-sm text-muted-foreground">
                You've already reviewed this course. See your review below.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sign in to rate this course and leave a review
              </p>
            )}
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

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                What others are saying about this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewList reviews={reviews} />
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Discussion</CardTitle>
            <CardDescription>
              Join the conversation about this course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {userId && (
              <div>
                <h3 className="font-semibold mb-4">Add a Comment</h3>
                <CommentForm courseId={course.id} />
              </div>
            )}
            {topLevelComments.length > 0 && (
              <div className={userId ? "pt-6 border-t" : ""}>
                <CommentThread comments={topLevelComments} courseId={course.id} />
              </div>
            )}
            {!userId && topLevelComments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No comments yet. Sign in to start the discussion!</p>
              </div>
            )}
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
