import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Eye, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { TutorialDifficulty } from "@prisma/client";

export const dynamic = "force-dynamic";

interface TutorialPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getTutorial(slug: string) {
  const tutorial = await db.tutorial.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { parentId: null },
        include: {
          user: {
            select: {
              id: true,
              username: true,
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
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      ratings: true,
    },
  });

  if (!tutorial) return null;

  // Calculate average rating
  const avgRating = tutorial.ratings.reduce((sum, r) => sum + r.rating, 0) /
    (tutorial.ratings.length || 1);

  return {
    ...tutorial,
    averageRating: avgRating,
    ratingCount: tutorial.ratings.length,
  };
}

function getDifficultyLabel(difficulty: TutorialDifficulty): string {
  const labels = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };
  return labels[difficulty];
}

function getDifficultyColor(difficulty: TutorialDifficulty): string {
  const colors = {
    BEGINNER: "bg-green-100 text-green-800 border-green-300",
    INTERMEDIATE: "bg-yellow-100 text-yellow-800 border-yellow-300",
    ADVANCED: "bg-red-100 text-red-800 border-red-300",
  };
  return colors[difficulty];
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params;
  const tutorial = await getTutorial(slug);

  if (!tutorial) {
    notFound();
  }

  // Check if user is authenticated
  const user = await currentUser();

  return (
    <div className="min-h-screen">
      {/* Tutorial Header */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <Link
              href="/tutorials"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to tutorials
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(tutorial.difficulty)}>
                  {getDifficultyLabel(tutorial.difficulty)}
                </Badge>
                {tutorial.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {tutorial.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {tutorial.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {tutorial.estimatedTime && (
                  <span>⏱️ {tutorial.estimatedTime}</span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {tutorial.viewCount} views
                </span>
                {tutorial.ratingCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {tutorial.averageRating.toFixed(1)} ({tutorial.ratingCount} ratings)
                  </span>
                )}
                {tutorial.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Video Embed (if available) */}
            {tutorial.videoUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {tutorial.videoUrl.includes("youtube.com") || tutorial.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={tutorial.videoUrl.replace("watch?v=", "embed/")}
                    title={tutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video src={tutorial.videoUrl} controls className="w-full h-full" />
                )}
              </div>
            )}

            {/* Tutorial Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Software Required */}
              {tutorial.softwareRequired.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Software Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {tutorial.softwareRequired.map((software, i) => (
                        <li key={i} className="text-sm">• {software}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tools Required */}
              {tutorial.toolsRequired.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tools Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {tutorial.toolsRequired.map((tool, i) => (
                        <li key={i} className="text-sm">• {tool}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {tutorial.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tutorial.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tutorial Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: tutorial.content }} />
            </div>

            {/* Additional Images */}
            {tutorial.images.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Tutorial Images</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutorial.images.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={`Tutorial step ${i + 1}`}
                      className="rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">
                Comments ({tutorial.comments.length})
              </h2>
              {user ? (
                <div className="space-y-6">
                  {tutorial.comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    tutorial.comments.map((comment) => (
                      <div key={comment.id} className="space-y-4">
                        <div className="flex gap-4">
                          <img
                            src={comment.user.avatarUrl || "/placeholder-avatar.png"}
                            alt={comment.user.username || "User"}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">
                                {comment.user.username || comment.user.firstName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-12 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-4">
                                <img
                                  src={reply.user.avatarUrl || "/placeholder-avatar.png"}
                                  alt={reply.user.username || "User"}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">
                                      {reply.user.username || reply.user.firstName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground mb-4">
                    Please sign in to view and post comments
                  </p>
                  <Button asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
