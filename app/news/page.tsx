import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LeaderboardAd, LargeSkyscraperAd, MediumRectangleAd } from "@/components/ads/ad-placeholder";

// Mock news data - replace with actual data from your CMS/database
const featuredPost = {
  id: 1,
  title: "GSPro Update 1.5: New Features and Improvements",
  excerpt: "The latest GSPro update brings exciting new features including enhanced graphics, improved ball physics, and dozens of new courses from top designers.",
  date: "2024-01-15",
  author: "John Doe",
  category: "Updates",
  image: "https://via.placeholder.com/800x400",
};

const recentPosts = [
  {
    id: 2,
    title: "Top 10 Must-Play Courses in GSPro",
    excerpt: "Discover the most popular and challenging courses that every GSPro player should experience.",
    date: "2024-01-12",
    author: "Jane Smith",
    category: "Guides",
  },
  {
    id: 3,
    title: "Interview with Course Designer: Creating McCalister Links",
    excerpt: "We sit down with Thegolfboy to discuss the process of creating one of GSPro's most beloved courses.",
    date: "2024-01-10",
    author: "Mike Johnson",
    category: "Interviews",
  },
  {
    id: 4,
    title: "Setting Up Your First Golf Simulator: A Complete Guide",
    excerpt: "Everything you need to know about choosing the right equipment and setting up your home golf simulator.",
    date: "2024-01-08",
    author: "Sarah Williams",
    category: "Guides",
  },
];

const sidebarItems = {
  recentPosts: [
    { title: "New Course Pack Released", date: "2024-01-14" },
    { title: "GSPro Community Tournament Announced", date: "2024-01-13" },
    { title: "Launch Monitor Buying Guide", date: "2024-01-11" },
    { title: "Course Design Tutorial Series", date: "2024-01-09" },
  ],
  popularCategories: [
    { name: "Updates", count: 45 },
    { name: "Guides", count: 38 },
    { name: "Interviews", count: 22 },
    { name: "Reviews", count: 31 },
  ],
};

export default function NewsPage() {
  return (
    <div className="container px-4 py-12">
      {/* Header Ad */}
      <div className="mb-8 flex justify-center">
        <LeaderboardAd className="hidden md:flex" />
        <MediumRectangleAd className="md:hidden" />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">News & Updates</h1>
        <p className="text-muted-foreground">
          Stay up to date with the latest GSPro news, course releases, and community updates
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-8">
          {/* Featured Post */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{featuredPost.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(featuredPost.date).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-2xl">{featuredPost.title}</CardTitle>
              <CardDescription className="text-base">
                {featuredPost.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {featuredPost.author}
                </div>
                <Button>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <div className="space-y-6">
            {recentPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <Button variant="outline" size="sm">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Skyscraper Ad - Desktop Only */}
          <div className="hidden lg:block">
            <LargeSkyscraperAd className="mb-6" />
          </div>

          {/* Recent Posts Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sidebarItems.recentPosts.map((post, index) => (
                <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                  <Link href="#" className="hover:text-primary">
                    <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Categories Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sidebarItems.popularCategories.map((category) => (
                  <Link
                    key={category.name}
                    href="#"
                    className="flex items-center justify-between py-2 hover:text-primary transition-colors"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Rectangle Ad */}
          <div className="lg:hidden">
            <MediumRectangleAd />
          </div>
        </div>
      </div>
    </div>
  );
}
