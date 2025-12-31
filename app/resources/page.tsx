import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import { getResources, getCategoryLabel } from "@/app/actions/resources";
import { ResourceCategory } from "@prisma/client";
import Link from "next/link";

// Category descriptions
const categoryDescriptions: Record<ResourceCategory, string> = {
  LAUNCH_MONITOR: "Track your shots with precision launch monitors",
  RETAILER: "Trusted stores for golf simulator equipment",
  EQUIPMENT: "Projectors, screens, mats, and enclosures",
  SOFTWARE: "GSPro add-ons and simulation software",
  COMMUNITY: "Forums, Discord servers, and social groups",
  ONLINE_PLAY: "Play golf online with others around the world",
  TOURNAMENTS: "Competitive tournaments and leagues",
  SIMULATOR_BUILDING: "Guides and resources for building your simulator",
  BEST_PRACTICES: "Tips, tricks, and best practices from the community",
  TRAINING_AIDS: "Practice tools and training equipment",
  COURSE_DESIGN: "Tools and resources for creating custom courses",
  STREAMING_TOOLS: "Software and hardware for streaming your golf sim",
};

export default async function ResourcesPage() {
  const resources = await getResources();

  // Group resources by category
  const resourcesByCategory = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<ResourceCategory, typeof resources>);

  // Get all categories that have resources
  const categoriesWithResources = Object.keys(resourcesByCategory) as ResourceCategory[];

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Resource Hub</Badge>
            {resources.length > 0 && (
              <Badge variant="outline">{resources.length} resources</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Golf Sim Resources
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Find the best launch monitors, equipment, online play platforms,
            tournaments, and everything you need for your golf simulator setup.
            Discover trusted retailers and join vibrant communities.
          </p>
        </div>

        {/* Resources by Category */}
        {categoriesWithResources.length > 0 ? (
          <div className="space-y-12">
            {categoriesWithResources.map((category) => (
              <div key={category} id={category.toLowerCase()} className="space-y-4">
                {/* Category Header */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {getCategoryLabel(category)}
                  </h2>
                  <p className="text-muted-foreground">
                    {categoryDescriptions[category]}
                  </p>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {resourcesByCategory[category].map((resource) => (
                    <Card key={resource.id} className="relative">
                      {resource.featured && (
                        <div className="absolute top-3 right-3">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{resource.name}</CardTitle>
                            {resource.brand && (
                              <CardDescription className="mt-1">
                                {resource.brand}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {resource.description && (
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        )}

                        {resource.subcategory && (
                          <Badge variant="outline" className="text-xs">
                            {resource.subcategory}
                          </Badge>
                        )}

                        {resource.price && (
                          <div className="text-sm font-medium">
                            {resource.price}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <a
                            href={resource.affiliateUrl || resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button className="w-full" size="sm">
                              Visit
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No Resources Yet</CardTitle>
              <CardDescription>
                Resources are being curated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We're currently building our resource library. Check back soon for
                curated recommendations on launch monitors, equipment, software,
                communities, and more!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
