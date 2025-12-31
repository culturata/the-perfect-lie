import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { LeaderboardAd, LargeSkyscraperAd, MediumRectangleAd, MobileBannerAd } from "@/components/ads/ad-placeholder";
import { NewsletterWidget } from "@/components/newsletter/newsletter-widget";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentUserSubscription } from "@/app/actions/newsletter";

// Mock article data - replace with actual CMS
const featuredArticle = {
  id: 1,
  title: "The Ultimate Guide to Building Your First Golf Simulator",
  excerpt: "Everything you need to know about choosing the right equipment, finding the perfect space, and getting started with your home golf simulator setup.",
  date: "2024-01-15",
  category: "Guides",
  readTime: "8 min read",
};

const recentArticles = [
  {
    id: 2,
    title: "Top 10 Must-Play GSPro Courses in 2024",
    excerpt: "Discover the most popular and challenging courses that every GSPro player should experience this year.",
    date: "2024-01-12",
    category: "Featured",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "Interview: Course Designer Thegolfboy on Creating Authentic Experiences",
    excerpt: "We sit down with one of GSPro's most prolific designers to discuss the art and craft of course creation.",
    date: "2024-01-10",
    category: "Interviews",
    readTime: "12 min read",
  },
  {
    id: 4,
    title: "Launch Monitor Buying Guide 2024",
    excerpt: "Comparing the top launch monitors for golf simulators - features, accuracy, and value for money.",
    date: "2024-01-08",
    category: "Reviews",
    readTime: "10 min read",
  },
  {
    id: 5,
    title: "GSPro Update 1.5: Everything You Need to Know",
    excerpt: "The latest update brings enhanced graphics, improved physics, and exciting new features to the platform.",
    date: "2024-01-06",
    category: "Updates",
    readTime: "6 min read",
  },
];

export default async function HomePage() {
  // Get recent courses
  const recentCourses = await db.course.findMany({
    take: 5,
    orderBy: { lastUpdated: "desc" },
    select: {
      id: true,
      name: true,
      designer: true,
      server: true,
      lastUpdated: true,
    },
  });

  // Get course count
  const courseCount = await db.course.count();

  // Check newsletter subscription status
  const user = await currentUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || null;
  const subscription = await getCurrentUserSubscription();
  const isSubscribed = !!subscription && subscription.isActive;

  return (
    <div className="min-h-screen">
      {/* Header Ad */}
      <div className="border-b bg-background">
        <div className="container px-4 py-4 flex justify-center">
          <LeaderboardAd className="hidden md:flex" />
          <MobileBannerAd className="md:hidden" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <Badge className="mb-4">{featuredArticle.category}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {featuredArticle.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(featuredArticle.date).toLocaleDateString()}
              </span>
              <span>·</span>
              <span>{featuredArticle.readTime}</span>
            </div>
            <Button size="lg">
              Read Article <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
      {/* Header Ad */}
      <div className="border-b bg-background">
        <div className="container px-4 py-4 flex justify-center">
          <LeaderboardAd className="hidden md:flex" />
          <MobileBannerAd className="md:hidden" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Recent Articles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Articles</h2>
                <Button variant="ghost" asChild>
                  <Link href="/news">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-6">
                {recentArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">{article.readTime}</span>
                      </div>
                      <CardTitle className="text-2xl leading-tight">
                        <Link href={`/news/${article.id}`} className="hover:text-primary transition-colors">
                          {article.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-base">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/news/${article.id}`}>
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mobile Rectangle Ad */}
            <div className="lg:hidden flex justify-center py-4">
              <MediumRectangleAd />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] flex-shrink-0 space-y-6">
            {/* Desktop Skyscraper Ad */}
            <div className="hidden lg:block">
              <LargeSkyscraperAd className="mb-6" />
            </div>

            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recently Updated
                  </CardTitle>
                  <Badge variant="outline">{courseCount.toLocaleString()}</Badge>
                </div>
                <CardDescription>Latest course additions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <Link href={`/courses/${encodeURIComponent(course.name.toLowerCase().replace(/\s+/g, "-"))}`}>
                      <h4 className="font-medium text-sm hover:text-primary transition-colors mb-1">
                        {course.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {course.designer && <span>{course.designer}</span>}
                        {course.designer && course.server && <span>·</span>}
                        {course.server && <Badge variant="secondary" className="text-xs">{course.server}</Badge>}
                      </div>
                    </Link>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/courses">
                    Browse All Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Newsletter Widget */}
            <NewsletterWidget userEmail={userEmail} isSubscribed={isSubscribed} />

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/resources" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Launch Monitors</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/resources" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Equipment Guide</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/resources" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sim Building</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/resources" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Community</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
