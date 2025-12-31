import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, Palette, Video } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { TutorialDifficulty } from "@prisma/client";

export const metadata = {
  title: "Course Design Tutorials | GSPro Community",
  description: "Learn how to create stunning golf courses for GSPro. Step-by-step tutorials covering photogrammetry, 3D modeling, terrain editing, and more.",
};

async function getTutorials() {
  const tutorials = await db.tutorial.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          comments: true,
          ratings: true,
        },
      },
    },
  });

  // Calculate average ratings
  const tutorialsWithRatings = await Promise.all(
    tutorials.map(async (tutorial) => {
      const avgRating = await db.tutorialRating.aggregate({
        where: { tutorialId: tutorial.id },
        _avg: { rating: true },
      });

      return {
        ...tutorial,
        averageRating: avgRating._avg.rating || 0,
        commentCount: tutorial._count.comments,
        ratingCount: tutorial._count.ratings,
      };
    })
  );

  return tutorialsWithRatings;
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

export default async function TutorialsPage() {
  const tutorials = await getTutorials();

  // Group tutorials by difficulty
  const tutorialsByDifficulty = tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.difficulty]) {
      acc[tutorial.difficulty] = [];
    }
    acc[tutorial.difficulty].push(tutorial);
    return acc;
  }, {} as Record<TutorialDifficulty, typeof tutorials>);

  const beginnerTutorials = tutorialsByDifficulty["BEGINNER"] || [];
  const intermediateTutorials = tutorialsByDifficulty["INTERMEDIATE"] || [];
  const advancedTutorials = tutorialsByDifficulty["ADVANCED"] || [];
  const featuredTutorials = tutorials.filter((t) => t.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="mb-2">Course Design</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Create Stunning Golf Courses for GSPro
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Master the art of course design with step-by-step tutorials from beginner to advanced
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="#beginner">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#all-tutorials">Browse All Tutorials</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="border-b bg-background">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="#beginner" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <BookOpen className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Beginner</span>
            </Link>
            <Link href="#intermediate" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <Code className="h-6 w-6 text-yellow-600" />
              <span className="text-sm font-medium">Intermediate</span>
            </Link>
            <Link href="#advanced" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <Palette className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium">Advanced</span>
            </Link>
            <Link href="#featured" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <Video className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Featured</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Featured Tutorials */}
          {featuredTutorials.length > 0 && (
            <section id="featured" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Featured Tutorials</h2>
                <p className="text-muted-foreground text-lg">
                  Our most popular and recommended tutorials
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                    {tutorial.thumbnailUrl && (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={tutorial.thumbnailUrl}
                          alt={tutorial.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {getDifficultyLabel(tutorial.difficulty)}
                        </Badge>
                        {tutorial.estimatedTime && (
                          <span className="text-sm text-muted-foreground">{tutorial.estimatedTime}</span>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        <Link href={`/tutorials/${tutorial.slug}`} className="hover:text-primary transition-colors">
                          {tutorial.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{tutorial.viewCount} views</span>
                        {tutorial.ratingCount > 0 && (
                          <span>⭐ {tutorial.averageRating.toFixed(1)} ({tutorial.ratingCount})</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href={`/tutorials/${tutorial.slug}`}>
                          Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Beginner Tutorials */}
          {beginnerTutorials.length > 0 && (
            <section id="beginner" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Beginner Tutorials</h2>
                <p className="text-muted-foreground text-lg">
                  Perfect for those just getting started with course design
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beginnerTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {getDifficultyLabel(tutorial.difficulty)}
                        </Badge>
                        {tutorial.estimatedTime && (
                          <span className="text-sm text-muted-foreground">{tutorial.estimatedTime}</span>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        <Link href={`/tutorials/${tutorial.slug}`} className="hover:text-primary transition-colors">
                          {tutorial.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tutorials/${tutorial.slug}`}>
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Intermediate Tutorials */}
          {intermediateTutorials.length > 0 && (
            <section id="intermediate" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Intermediate Tutorials</h2>
                <p className="text-muted-foreground text-lg">
                  Take your skills to the next level
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intermediateTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {getDifficultyLabel(tutorial.difficulty)}
                        </Badge>
                        {tutorial.estimatedTime && (
                          <span className="text-sm text-muted-foreground">{tutorial.estimatedTime}</span>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        <Link href={`/tutorials/${tutorial.slug}`} className="hover:text-primary transition-colors">
                          {tutorial.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tutorials/${tutorial.slug}`}>
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Advanced Tutorials */}
          {advancedTutorials.length > 0 && (
            <section id="advanced" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Advanced Tutorials</h2>
                <p className="text-muted-foreground text-lg">
                  Master techniques for professional-quality courses
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {getDifficultyLabel(tutorial.difficulty)}
                        </Badge>
                        {tutorial.estimatedTime && (
                          <span className="text-sm text-muted-foreground">{tutorial.estimatedTime}</span>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        <Link href={`/tutorials/${tutorial.slug}`} className="hover:text-primary transition-colors">
                          {tutorial.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tutorials/${tutorial.slug}`}>
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {tutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Tutorials coming soon! Check back later for comprehensive course design guides.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
