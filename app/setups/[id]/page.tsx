import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Eye, Star, DollarSign, Home, Ruler } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { BudgetTier, BuildStyle, RoomType } from "@prisma/client";

export const dynamic = "force-dynamic";

interface SetupPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getSetup(id: string) {
  const setup = await db.setupShowcase.findUnique({
    where: { id },
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
      likes: true,
    },
  });

  if (!setup) return null;

  // Calculate average rating
  const avgRating = setup.ratings.reduce((sum, r) => sum + r.rating, 0) /
    (setup.ratings.length || 1);

  return {
    ...setup,
    averageRating: avgRating,
    ratingCount: setup.ratings.length,
  };
}

function getBudgetLabel(tier: BudgetTier): string {
  const labels = {
    STARTER: "$5k-$10k",
    MID: "$10k-$25k",
    PREMIUM: "$25k+",
  };
  return labels[tier];
}

function getBuildStyleLabel(style: BuildStyle): string {
  const labels = {
    DIY: "DIY",
    HYBRID: "Hybrid",
    TURNKEY: "Turnkey",
  };
  return labels[style];
}

function getRoomTypeLabel(type: RoomType): string {
  const labels = {
    GARAGE: "Garage",
    BASEMENT: "Basement",
    SPARE_ROOM: "Spare Room",
    SHED: "Shed",
  };
  return labels[type];
}

export default async function SetupPage({ params }: SetupPageProps) {
  const { id } = await params;
  const setup = await getSetup(id);

  if (!setup || !setup.approved) {
    notFound();
  }

  const user = await currentUser();
  const isOwner = user && user.id === setup.userId;
  const userLiked = user ? setup.likes.some(like => like.userId === user.id) : false;

  return (
    <div className="min-h-screen">
      {/* Setup Header */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <Link
              href="/setups"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to setups
            </Link>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {getBudgetLabel(setup.budgetTier)}
                </Badge>
                {setup.buildStyle && (
                  <Badge variant="outline">
                    {getBuildStyleLabel(setup.buildStyle)}
                  </Badge>
                )}
                {setup.roomType && (
                  <Badge variant="outline">
                    {getRoomTypeLabel(setup.roomType)}
                  </Badge>
                )}
                {setup.featured && (
                  <Badge className="bg-primary">Featured</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {setup.title}
              </h1>
              <div className="flex items-center gap-4">
                <img
                  src={setup.user.avatarUrl || "/placeholder-avatar.png"}
                  alt={setup.user.username || "User"}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {setup.user.username || setup.user.firstName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(setup.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {setup.viewCount} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className={`h-4 w-4 ${userLiked ? "fill-red-500 text-red-500" : ""}`} />
                  {setup.likeCount} likes
                </span>
                {setup.ratingCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {setup.averageRating.toFixed(1)} ({setup.ratingCount} ratings)
                  </span>
                )}
              </div>
              {user && !isOwner && (
                <Button variant="outline">
                  <Heart className={`mr-2 h-4 w-4 ${userLiked ? "fill-red-500" : ""}`} />
                  {userLiked ? "Unlike" : "Like"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {setup.thumbnailUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={setup.thumbnailUrl}
                      alt={setup.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {setup.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {setup.images.map((image, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={image}
                          alt={`Setup image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About This Build</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {setup.description}
                </p>
              </div>

              {/* Additional Notes */}
              {setup.other && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Additional Notes</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {setup.other}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">
                  Comments ({setup.comments.length})
                </h2>
                {user ? (
                  <div className="space-y-6">
                    {setup.comments.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    ) : (
                      setup.comments.map((comment) => (
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget & Space */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget & Space
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {setup.totalBudget && (
                    <div>
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                      <p className="font-semibold">${setup.totalBudget.toLocaleString()}</p>
                    </div>
                  )}
                  {(setup.roomWidth || setup.roomDepth || setup.ceilingHeight) && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Room Dimensions</p>
                      {setup.roomWidth && (
                        <p className="text-sm">Width: {setup.roomWidth} ft</p>
                      )}
                      {setup.roomDepth && (
                        <p className="text-sm">Depth: {setup.roomDepth} ft</p>
                      )}
                      {setup.ceilingHeight && (
                        <p className="text-sm">Ceiling: {setup.ceilingHeight} ft</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Components */}
              <Card>
                <CardHeader>
                  <CardTitle>Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {setup.launchMonitor && (
                    <div>
                      <p className="text-sm text-muted-foreground">Launch Monitor</p>
                      <p className="font-medium">{setup.launchMonitor}</p>
                    </div>
                  )}
                  {setup.projector && (
                    <div>
                      <p className="text-sm text-muted-foreground">Projector</p>
                      <p className="font-medium">{setup.projector}</p>
                    </div>
                  )}
                  {setup.screen && (
                    <div>
                      <p className="text-sm text-muted-foreground">Screen</p>
                      <p className="font-medium">{setup.screen}</p>
                    </div>
                  )}
                  {setup.hitting && (
                    <div>
                      <p className="text-sm text-muted-foreground">Hitting Area</p>
                      <p className="font-medium">{setup.hitting}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PC Specs */}
              {setup.pcSpecs && (
                <Card>
                  <CardHeader>
                    <CardTitle>PC Specs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{setup.pcSpecs}</p>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {setup.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {setup.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
