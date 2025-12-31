import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Eye, Star, DollarSign } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { BudgetTier, BuildStyle, RoomType } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

export const metadata = {
  title: "Setup Showcase | GSPro Community",
  description: "Browse real golf simulator setups from the community. Get inspired by builds across all budgets and room sizes.",
};

async function getSetups() {
  const setups = await db.setupShowcase.findMany({
    where: { approved: true },
    orderBy: [
      { featured: "desc" },
      { likeCount: "desc" },
      { createdAt: "desc" },
    ],
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
      _count: {
        select: {
          comments: true,
          likes: true,
          ratings: true,
        },
      },
    },
    take: 50, // Limit initial load
  });

  // Calculate average ratings
  const setupsWithRatings = await Promise.all(
    setups.map(async (setup) => {
      const avgRating = await db.setupRating.aggregate({
        where: { setupId: setup.id },
        _avg: { rating: true },
      });

      return {
        ...setup,
        averageRating: avgRating._avg.rating || 0,
      };
    })
  );

  return setupsWithRatings;
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

export default async function SetupsPage() {
  const setups = await getSetups();
  const user = await currentUser();

  // Group setups by budget
  const setupsByBudget = setups.reduce((acc, setup) => {
    if (!acc[setup.budgetTier]) {
      acc[setup.budgetTier] = [];
    }
    acc[setup.budgetTier].push(setup);
    return acc;
  }, {} as Record<BudgetTier, typeof setups>);

  const featuredSetups = setups.filter((s) => s.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="mb-2">Setup Showcase</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Real Golf Simulator Setups from the Community
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Get inspired by builds across all budgets, room sizes, and experience levels
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {user ? (
                <Button size="lg" asChild>
                  <Link href="/setups/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Share Your Setup
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/sign-in">
                    <Plus className="mr-2 h-4 w-4" />
                    Share Your Setup
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link href="#all-setups">Browse All Setups</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="border-b bg-background">
        <div className="container px-4 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">All Setups</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Starter ($5k-$10k)</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Mid-Range ($10k-$25k)</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Premium ($25k+)</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">DIY</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Turnkey</Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Featured Setups */}
          {featuredSetups.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Featured Setups</h2>
                <p className="text-muted-foreground text-lg">
                  Handpicked examples of exceptional simulator builds
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSetups.map((setup) => (
                  <Card key={setup.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {setup.thumbnailUrl ? (
                        <img
                          src={setup.thumbnailUrl}
                          alt={setup.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {getBudgetLabel(setup.budgetTier)}
                        </Badge>
                        {setup.buildStyle && (
                          <Badge variant="outline">
                            {getBuildStyleLabel(setup.buildStyle)}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        <Link href={`/setups/${setup.id}`} className="hover:text-primary transition-colors">
                          {setup.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        by {setup.user.username || setup.user.firstName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {setup.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {setup.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {setup.viewCount}
                        </span>
                        {setup._count.ratings > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {setup.averageRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href={`/setups/${setup.id}`}>
                          View Setup
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* All Setups by Budget */}
          <section id="all-setups" className="space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">All Setups</h2>
              <p className="text-muted-foreground text-lg">
                Browse setups organized by budget tier
              </p>
            </div>

            {/* Starter Builds */}
            {setupsByBudget["STARTER"] && setupsByBudget["STARTER"].length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <h3 className="text-2xl font-bold">Starter Builds ($5k-$10k)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {setupsByBudget["STARTER"].map((setup) => (
                    <Card key={setup.id} className="hover:shadow-md transition-shadow overflow-hidden">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {setup.thumbnailUrl ? (
                          <img
                            src={setup.thumbnailUrl}
                            alt={setup.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base leading-tight">
                          <Link href={`/setups/${setup.id}`} className="hover:text-primary transition-colors">
                            {setup.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          by {setup.user.username || setup.user.firstName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {setup.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {setup.viewCount}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Mid-Range Builds */}
            {setupsByBudget["MID"] && setupsByBudget["MID"].length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-2xl font-bold">Mid-Range Builds ($10k-$25k)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {setupsByBudget["MID"].map((setup) => (
                    <Card key={setup.id} className="hover:shadow-md transition-shadow overflow-hidden">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {setup.thumbnailUrl ? (
                          <img
                            src={setup.thumbnailUrl}
                            alt={setup.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base leading-tight">
                          <Link href={`/setups/${setup.id}`} className="hover:text-primary transition-colors">
                            {setup.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          by {setup.user.username || setup.user.firstName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {setup.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {setup.viewCount}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Builds */}
            {setupsByBudget["PREMIUM"] && setupsByBudget["PREMIUM"].length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                  <h3 className="text-2xl font-bold">Premium Builds ($25k+)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {setupsByBudget["PREMIUM"].map((setup) => (
                    <Card key={setup.id} className="hover:shadow-md transition-shadow overflow-hidden">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {setup.thumbnailUrl ? (
                          <img
                            src={setup.thumbnailUrl}
                            alt={setup.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base leading-tight">
                          <Link href={`/setups/${setup.id}`} className="hover:text-primary transition-colors">
                            {setup.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          by {setup.user.username || setup.user.firstName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {setup.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {setup.viewCount}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {setups.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <p className="text-muted-foreground text-lg mb-4">
                  No setups have been shared yet.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Be the first to showcase your golf simulator build!
                </p>
                {user ? (
                  <Button asChild>
                    <Link href="/setups/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Share Your Setup
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/sign-in">Sign In to Share</Link>
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
