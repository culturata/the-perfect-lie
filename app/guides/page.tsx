import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Lightbulb, Settings, Wrench } from "lucide-react";
import Link from "next/link";
import { getArticles, getArticleCountByCategory } from "@/app/actions/articles";
import { getCategoryLabel, getCategoryDescription, articleCategoryLabels } from "@/lib/articles";
import { ArticleCategory } from "@prisma/client";

export const metadata = {
  title: "Complete Guide to Building a Golf Simulator (2025) | GSPro Community",
  description: "The ultimate resource for planning, building, and optimizing your golf simulator setup. From launch monitors to DIY enclosures, everything you need for the perfect GSPro experience.",
};

export default async function GuidesPage() {
  const articles = await getArticles();
  const categoryCounts = await getArticleCountByCategory();

  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<ArticleCategory, typeof articles>);

  // Get featured/start here articles
  const startHereArticles = articlesByCategory["START_HERE"] || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="mb-2">Build Guide</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              The Complete Guide to Building a Golf Simulator
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Everything you need to plan, build, and optimize your perfect GSPro setup
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="#start-here">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#categories">Browse All Topics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="border-b bg-background">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="#start-here" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Start Here</span>
            </Link>
            <Link href="#components" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <Settings className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Components</span>
            </Link>
            <Link href="#diy-builds" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">DIY Guides</span>
            </Link>
            <Link href="#example-builds" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors">
              <Lightbulb className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Examples</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Start Here Section */}
          {startHereArticles.length > 0 && (
            <section id="start-here" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Start Here</h2>
                <p className="text-muted-foreground text-lg">
                  New to golf simulators? Begin with these essential guides.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startHereArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg leading-tight">
                        <Link href={`/guides/${article.slug}`} className="hover:text-primary transition-colors">
                          {article.title}
                        </Link>
                      </CardTitle>
                      {article.readTime && (
                        <CardDescription>{article.readTime}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {article.excerpt}
                      </p>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/guides/${article.slug}`}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* All Categories */}
          <section id="categories" className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Browse by Topic</h2>
              <p className="text-muted-foreground text-lg">
                Deep dive into specific aspects of your simulator build.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(articleCategoryLabels) as ArticleCategory[])
                .filter((category) => category !== "START_HERE")
                .map((category) => {
                  const count = categoryCounts[category] || 0;
                  const categoryArticles = articlesByCategory[category] || [];

                  return (
                    <Card key={category} id={category.toLowerCase()}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{getCategoryLabel(category)}</CardTitle>
                          {count > 0 && (
                            <Badge variant="outline">{count} {count === 1 ? "guide" : "guides"}</Badge>
                          )}
                        </div>
                        <CardDescription>
                          {getCategoryDescription(category)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {categoryArticles.length > 0 ? (
                          <ul className="space-y-2">
                            {categoryArticles.slice(0, 5).map((article) => (
                              <li key={article.id}>
                                <Link
                                  href={`/guides/${article.slug}`}
                                  className="text-sm hover:text-primary transition-colors flex items-center gap-2"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                  {article.title}
                                </Link>
                              </li>
                            ))}
                            {categoryArticles.length > 5 && (
                              <li>
                                <span className="text-sm text-muted-foreground">
                                  +{categoryArticles.length - 5} more
                                </span>
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Guides coming soon
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </section>

          {/* Quick Links */}
          <section className="border-t pt-12">
            <Card>
              <CardHeader>
                <CardTitle>Not sure where to start?</CardTitle>
                <CardDescription>
                  Follow our recommended path based on your situation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/guides?budget=starter" className="p-4 border rounded-lg hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-2">Budget-Conscious</h3>
                    <p className="text-sm text-muted-foreground">
                      Get started without breaking the bank
                    </p>
                  </Link>
                  <Link href="/guides?ceiling=under-9" className="p-4 border rounded-lg hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-2">Low Ceiling</h3>
                    <p className="text-sm text-muted-foreground">
                      Special considerations for tight spaces
                    </p>
                  </Link>
                  <Link href="/guides?style=diy" className="p-4 border rounded-lg hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-2">DIY Builder</h3>
                    <p className="text-sm text-muted-foreground">
                      Build it yourself and save money
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
