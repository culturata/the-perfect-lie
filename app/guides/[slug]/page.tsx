import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, getArticlesByCategory } from "@/app/actions/articles";
import { getCategoryLabel } from "@/lib/articles";
import { LeaderboardAd, MobileBannerAd, MediumRectangleAd } from "@/components/ads/ad-placeholder";
import { NewsletterWidget } from "@/components/newsletter/newsletter-widget";
import { getCurrentUserSubscription } from "@/app/actions/newsletter";
import { currentUser } from "@clerk/nextjs/server";
import { AddToCollectionButton } from "@/components/collections/add-to-collection-button";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get related articles from same category
  const relatedArticles = await getRelatedArticles(article.id, article.category, 5);

  // Get all articles in category for navigation
  const categoryArticles = await getArticlesByCategory(article.category);
  const currentIndex = categoryArticles.findIndex((a) => a.id === article.id);
  const previousArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;

  // Check newsletter subscription
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

      {/* Article Header */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <Link
              href="/guides"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to guides
            </Link>

            <div className="space-y-3">
              <Badge variant="secondary">{getCategoryLabel(article.category)}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {article.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {article.publishedAt && (
                  <>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <span>·</span>
                  </>
                )}
                {article.readTime && <span>{article.readTime}</span>}
              </div>
              <div className="pt-2">
                <AddToCollectionButton itemType="ARTICLE" articleId={article.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Content */}
          <article className="flex-1 min-w-0">
            <div className="max-w-3xl">
              <div
                className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Article Navigation */}
              <div className="mt-12 pt-8 border-t space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  {previousArticle ? (
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/guides/${previousArticle.slug}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground">Previous</span>
                          <span className="text-sm font-normal line-clamp-1">{previousArticle.title}</span>
                        </div>
                      </Link>
                    </Button>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {nextArticle ? (
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/guides/${nextArticle.slug}`}>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">Next</span>
                          <span className="text-sm font-normal line-clamp-1">{nextArticle.title}</span>
                        </div>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>

                <div className="text-center">
                  <Button asChild>
                    <Link href="/guides">
                      Back to All Guides
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Rectangle Ad */}
            <div className="lg:hidden flex justify-center py-8 mt-8">
              <MediumRectangleAd />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] flex-shrink-0 space-y-6">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Related Guides
                  </CardTitle>
                  <CardDescription>More from {getCategoryLabel(article.category)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <div key={relatedArticle.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <Link href={`/guides/${relatedArticle.slug}`}>
                        <h4 className="font-medium text-sm hover:text-primary transition-colors mb-1 line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        {relatedArticle.readTime && (
                          <p className="text-xs text-muted-foreground">
                            {relatedArticle.readTime}
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/guides">
                      View All Guides <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Newsletter Widget */}
            <NewsletterWidget userEmail={userEmail} isSubscribed={isSubscribed} />

            {/* Sidebar Ad */}
            <div className="hidden lg:block">
              <MediumRectangleAd />
            </div>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Build Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/resources" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Equipment Store</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/courses" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">GSPro Courses</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/flyovers" className="block py-2 hover:text-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Flyovers</span>
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
