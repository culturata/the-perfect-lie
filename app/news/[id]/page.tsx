import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { LargeSkyscraperAd, MediumRectangleAd } from "@/components/ads/ad-placeholder";

// Mock article data - replace with actual CMS/database
const articles = [
  {
    id: "1",
    title: "The Ultimate Guide to Building Your First Golf Simulator",
    excerpt: "Everything you need to know about choosing the right equipment, finding the perfect space, and getting started with your home golf simulator setup.",
    content: `
      <p>Building a home golf simulator has never been more accessible. With advancements in launch monitor technology and software like GSPro, golfers can now practice and play world-class courses from the comfort of their homes.</p>

      <h2>Choosing Your Space</h2>
      <p>The first step in building your simulator is selecting the right space. You'll need a room with adequate ceiling height (minimum 9 feet, but 10+ feet is ideal), width (at least 10 feet), and depth (12-15 feet minimum). Consider factors like:</p>
      <ul>
        <li>Ceiling height for full swing clearance</li>
        <li>Width for both right and left-handed players</li>
        <li>Adequate depth for screen distance and projector throw</li>
        <li>Electrical outlets for equipment</li>
      </ul>

      <h2>Essential Equipment</h2>
      <p>Your simulator setup will require several key components:</p>

      <h3>Launch Monitor</h3>
      <p>The heart of your simulator. Popular options include:</p>
      <ul>
        <li><strong>Budget-friendly:</strong> SkyTrak, Rapsodo MLM2PRO ($2,000-$3,000)</li>
        <li><strong>Mid-range:</strong> Bushnell Launch Pro, Foresight GC3 ($4,000-$7,000)</li>
        <li><strong>Premium:</strong> Foresight GCQuad, TrackMan ($10,000+)</li>
      </ul>

      <h3>Impact Screen</h3>
      <p>A quality impact screen is crucial for both safety and image quality. Look for screens rated for full swing shots with proper tensioning systems. Budget around $300-$800 for a good screen.</p>

      <h3>Projector</h3>
      <p>Modern short-throw projectors work best for most simulator setups. Key specs to consider:</p>
      <ul>
        <li>Brightness: 3,000+ lumens for well-lit rooms</li>
        <li>Resolution: 1080p minimum, 4K for premium setups</li>
        <li>Input lag: Low input lag for real-time ball flight</li>
      </ul>

      <h2>Software Selection</h2>
      <p>GSPro has emerged as the premier golf simulator software, offering stunning graphics, accurate ball flight physics, and thousands of courses. The software pairs seamlessly with most launch monitors and provides an incredibly realistic playing experience.</p>

      <h2>Installation Tips</h2>
      <p>When setting up your simulator:</p>
      <ul>
        <li>Use quality turf mats with realistic feedback</li>
        <li>Install proper lighting to avoid shadows</li>
        <li>Consider acoustic treatment for noise reduction</li>
        <li>Leave room for future upgrades</li>
      </ul>

      <h2>Budget Considerations</h2>
      <p>A complete simulator can range from $5,000 for a basic setup to $50,000+ for a premium installation. Start with quality basics and upgrade components over time as your budget allows.</p>

      <h2>Conclusion</h2>
      <p>Building a home golf simulator is an investment in your game that pays dividends year-round. With proper planning and the right equipment, you'll have a setup that provides endless hours of practice and entertainment.</p>
    `,
    date: "2024-01-15",
    author: "Mike Thompson",
    category: "Guides",
    readTime: "8 min read",
  },
  {
    id: "2",
    title: "Top 10 Must-Play GSPro Courses in 2024",
    excerpt: "Discover the most popular and challenging courses that every GSPro player should experience this year.",
    content: `
      <p>GSPro's massive course library can be overwhelming. We've curated a list of the absolute must-play courses that showcase the best of what the platform has to offer.</p>

      <h2>1. Pebble Beach Golf Links</h2>
      <p>No list would be complete without Pebble Beach. The iconic oceanside layout is beautifully recreated in GSPro, with stunning visuals and accurate terrain modeling.</p>

      <h2>2. St Andrews Old Course</h2>
      <p>The home of golf translated remarkably well to GSPro. The course designer captured the subtle breaks and historic features that make St Andrews special.</p>

      <h2>3. Augusta National Golf Club</h2>
      <p>Play the Masters from home. This recreation features the famous azaleas, challenging greens, and dramatic elevation changes that define Augusta.</p>

      <h2>4. Whistling Straits</h2>
      <p>The Pete Dye masterpiece offers incredible links-style golf with Lake Michigan views. One of the most challenging courses in GSPro.</p>

      <h2>5. Bandon Dunes - Pacific Dunes</h2>
      <p>Experience true links golf on the Oregon coast. The wind and coastal terrain make every round unique.</p>

      <h2>Conclusion</h2>
      <p>These courses represent the pinnacle of course design in GSPro. Each offers unique challenges and unforgettable golf experiences.</p>
    `,
    date: "2024-01-12",
    author: "Sarah Martinez",
    category: "Featured",
    readTime: "5 min read",
  },
  {
    id: "3",
    title: "Interview: Course Designer Thegolfboy on Creating Authentic Experiences",
    excerpt: "We sit down with one of GSPro's most prolific designers to discuss the art and craft of course creation.",
    content: `
      <p>Thegolfboy has created some of GSPro's most beloved courses, including the stunning McCalister Links. We caught up with him to discuss his design philosophy and creative process.</p>

      <h2>Q: What draws you to course design?</h2>
      <p>"I've always been fascinated by golf architecture. Creating courses for GSPro allows me to bring my vision to life and share it with players around the world. There's something magical about seeing people enjoy a course you've created."</p>

      <h2>Q: How do you approach a new design?</h2>
      <p>"I start by defining the character I want the course to have. Is it links-style? Parkland? Desert? Then I focus on creating memorable holes that flow together naturally. Every hole should be interesting, but not every hole needs to be a showstopper."</p>

      <h2>Q: What's your favorite course you've designed?</h2>
      <p>"McCalister Links holds a special place for me. It was one of my earlier designs, and I really tried to capture the essence of classic links golf. The feedback from the community has been incredible."</p>

      <h2>Q: Any advice for aspiring course designers?</h2>
      <p>"Study real golf courses. Understand what makes them great. Don't try to make every hole impossibly difficult - balance and playability are key. And most importantly, have fun with it!"</p>

      <h2>Looking Ahead</h2>
      <p>Thegolfboy is currently working on several new projects, including a Scottish Highland course and a desert layout inspired by Arizona golf. We can't wait to see what he creates next.</p>
    `,
    date: "2024-01-10",
    author: "John Davis",
    category: "Interviews",
    readTime: "12 min read",
  },
  {
    id: "4",
    title: "Launch Monitor Buying Guide 2024",
    excerpt: "Comparing the top launch monitors for golf simulators - features, accuracy, and value for money.",
    content: `
      <p>Choosing the right launch monitor is the most important decision when building a golf simulator. This guide breaks down the top options across different price ranges.</p>

      <h2>Budget Category ($2,000 - $3,000)</h2>

      <h3>SkyTrak+</h3>
      <p>The most popular budget launch monitor for good reason. Photometric technology provides accurate ball data:</p>
      <ul>
        <li>Ball speed, launch angle, backspin, side spin</li>
        <li>Works indoors and outdoors</li>
        <li>GSPro compatible</li>
        <li>Strong user community and support</li>
      </ul>

      <h3>Rapsodo MLM2PRO</h3>
      <p>Newer to the market but gaining traction. Radar and camera combination provides club and ball data.</p>

      <h2>Mid-Range ($4,000 - $7,000)</h2>

      <h3>Bushnell Launch Pro</h3>
      <p>Essentially a rebranded Foresight GC3. Excellent accuracy and club data measurement. Perfect for serious players wanting tour-level metrics.</p>

      <h3>Foresight GC3</h3>
      <p>Camera-based system with outstanding accuracy. Measures everything you need for effective practice.</p>

      <h2>Premium ($10,000+)</h2>

      <h3>Foresight GCQuad</h3>
      <p>Four high-speed cameras provide the most comprehensive data available. Used by tour pros for fitting and practice.</p>

      <h3>TrackMan 4</h3>
      <p>The gold standard. Dual radar system captures every detail. Unmatched outdoors performance.</p>

      <h2>Making Your Decision</h2>
      <p>Consider your budget, space (indoor vs outdoor use), and data needs. For most simulator builds, SkyTrak+ or Bushnell Launch Pro offer the best value.</p>
    `,
    date: "2024-01-08",
    author: "Tom Richardson",
    category: "Reviews",
    readTime: "10 min read",
  },
  {
    id: "5",
    title: "GSPro Update 1.5: Everything You Need to Know",
    excerpt: "The latest update brings enhanced graphics, improved physics, and exciting new features to the platform.",
    content: `
      <p>GSPro's latest 1.5 update represents the most significant release since the platform launched. Here's everything new and improved.</p>

      <h2>Graphics Enhancements</h2>
      <p>The visual improvements are immediately noticeable:</p>
      <ul>
        <li>Enhanced lighting and shadow systems</li>
        <li>Improved water reflections and effects</li>
        <li>More realistic vegetation rendering</li>
        <li>Better atmospheric effects (fog, haze, time of day)</li>
      </ul>

      <h2>Physics Updates</h2>
      <p>Ball flight modeling has been refined based on extensive real-world testing:</p>
      <ul>
        <li>More accurate spin decay</li>
        <li>Improved bounce and roll on different turf conditions</li>
        <li>Better wind interaction modeling</li>
        <li>Enhanced short game physics</li>
      </ul>

      <h2>New Features</h2>

      <h3>Driving Range Mode</h3>
      <p>Practice without playing a full round. Multiple target greens at various distances with real-time feedback.</p>

      <h3>Course Conditions</h3>
      <p>Adjust firmness, green speed, and rough length to customize difficulty and match real-world conditions.</p>

      <h3>Multiplayer Improvements</h3>
      <p>Smoother online play with reduced latency and better synchronization between players.</p>

      <h2>Performance Optimization</h2>
      <p>The update includes significant performance improvements, with many users reporting higher frame rates and smoother gameplay.</p>

      <h2>Conclusion</h2>
      <p>Update 1.5 represents GSPro's commitment to continuous improvement. The enhanced visuals and physics make the experience more realistic than ever.</p>
    `,
    date: "2024-01-06",
    author: "David Chen",
    category: "Updates",
    readTime: "6 min read",
  },
];

// Related articles data
const relatedArticles = [
  { id: "2", title: "Top 10 Must-Play GSPro Courses in 2024", category: "Featured" },
  { id: "4", title: "Launch Monitor Buying Guide 2024", category: "Reviews" },
  { id: "3", title: "Interview: Course Designer Thegolfboy", category: "Interviews" },
];

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header with back button */}
      <div className="border-b bg-background">
        <div className="container px-4 py-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container px-4 py-12">
          <div className="max-w-4xl">
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString()}
              </span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-8">
            <div className="max-w-3xl">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:mb-4 prose-p:leading-relaxed
                  prose-ul:text-muted-foreground prose-ul:mb-4
                  prose-li:mb-2
                  prose-strong:text-foreground prose-strong:font-semibold"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Mid-article ad for mobile */}
              <div className="lg:hidden my-8 flex justify-center">
                <MediumRectangleAd />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Skyscraper Ad */}
            <div className="hidden lg:block">
              <LargeSkyscraperAd />
            </div>

            {/* Related Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedArticles
                  .filter((a) => a.id !== article.id)
                  .slice(0, 3)
                  .map((related) => (
                    <div key={related.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <Link href={`/news/${related.id}`}>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {related.category}
                        </Badge>
                        <h4 className="font-medium text-sm hover:text-primary transition-colors">
                          {related.title}
                        </h4>
                      </Link>
                    </div>
                  ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/news">
                    View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/courses" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Browse Courses</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/flyovers" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Flyovers</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/resources" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resources</span>
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
