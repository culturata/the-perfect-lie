import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Eye, Star, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = {
  title: "Setup Showcase | GSPro Community",
  description: "Browse real golf simulator setups from the community. Get inspired by builds across all budgets and room sizes.",
};

export default async function SetupsPage() {
  const user = await currentUser();

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
                <Button size="lg" disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your Setup (Coming Soon)
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/sign-in">
                    <Plus className="mr-2 h-4 w-4" />
                    Sign In to Share
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="border-b bg-background">
        <div className="container px-4 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline">All Setups</Badge>
            <Badge variant="outline">Starter ($5k-$10k)</Badge>
            <Badge variant="outline">Mid-Range ($10k-$25k)</Badge>
            <Badge variant="outline">Premium ($25k+)</Badge>
            <Badge variant="outline">DIY</Badge>
            <Badge variant="outline">Turnkey</Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Coming Soon Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Coming Soon!</AlertTitle>
            <AlertDescription>
              Setup Showcase is currently being set up. Soon you'll be able to browse and share real golf simulator builds from the community.
              <br /><br />
              What you'll find here:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Detailed photos and specs of real simulator builds</li>
                <li>Budget breakdowns and component lists</li>
                <li>Room dimension and space requirements</li>
                <li>DIY tips and professional installation insights</li>
                <li>Community ratings and feedback</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Preview Section */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Browse by Budget</h2>
              <p className="text-muted-foreground text-lg">
                Find setups that match your budget and space
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter Builds */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <Badge variant="outline" className="text-green-600">$5k-$10k</Badge>
                  </div>
                  <CardTitle>Starter Builds</CardTitle>
                  <CardDescription>
                    Great entry-level setups that deliver excellent value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Budget launch monitors (MLM2PRO, Garmin)</li>
                    <li>• Projector or TV display options</li>
                    <li>• DIY screen and enclosure builds</li>
                    <li>• Compact space solutions</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Mid-Range Builds */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <Badge variant="outline" className="text-yellow-600">$10k-$25k</Badge>
                  </div>
                  <CardTitle>Mid-Range Builds</CardTitle>
                  <CardDescription>
                    Well-balanced setups with quality components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Uneekor, SkyTrak+, or Bushnell LMs</li>
                    <li>• Quality projectors (Optoma, BenQ)</li>
                    <li>• Professional-grade screens</li>
                    <li>• Dedicated simulator space</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Premium Builds */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <Badge variant="outline" className="text-purple-600">$25k+</Badge>
                  </div>
                  <CardTitle>Premium Builds</CardTitle>
                  <CardDescription>
                    Top-tier setups with the best equipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• TrackMan, GC Quad, or Foresight</li>
                    <li>• 4K laser projectors</li>
                    <li>• Custom enclosures and flooring</li>
                    <li>• Complete room builds</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="border-t pt-12">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Want to Share Your Build?</CardTitle>
                <CardDescription className="text-base">
                  Help others by showcasing your golf simulator setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Once this feature launches, you'll be able to share your setup with detailed photos,
                  component lists, budget information, and build tips. Your build could inspire and help
                  others planning their own simulators!
                </p>
                {!user && (
                  <Button asChild>
                    <Link href="/sign-in">Sign In to Get Ready</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
