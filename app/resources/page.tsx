import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResourcesPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Resource Hub</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Golf Sim Resources
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Find the best launch monitors, projectors, hitting mats, and
            everything you need for your golf simulator setup. Discover trusted
            retailers and join vibrant communities.
          </p>
        </div>

        {/* Categories Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Launch Monitors</CardTitle>
              <CardDescription>
                TrackMan, GCQuad, Mevo+, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Compare features, prices, and reviews of the top launch monitors
                for golf simulators.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retailers</CardTitle>
              <CardDescription>
                Trusted golf sim equipment stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Find authorized dealers and online stores for all your golf
                simulation needs.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
              <CardDescription>
                Projectors, screens, mats, and nets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse hitting mats, impact screens, projectors, and enclosures
                for your setup.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Software</CardTitle>
              <CardDescription>
                GSPro add-ons and utilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover software tools, plugins, and utilities to enhance your
                GSPro experience.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communities</CardTitle>
              <CardDescription>
                Forums, Discord, and social groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect with fellow golf sim enthusiasts, share tips, and get
                support.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>More Coming</CardTitle>
              <CardDescription>
                Additional categories in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We're constantly adding new resource categories to help you build
                the perfect golf simulator.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Resource Hub Status</CardTitle>
            <CardDescription>
              Currently under construction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✅ Category structure designed</p>
              <p>✅ Database schema complete</p>
              <p>🚧 Curating initial resources</p>
              <p>🚧 Admin management interface in development</p>
              <p>🚧 User reviews and ratings coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
