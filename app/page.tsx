import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Play, Package, ArrowRight, Star, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary">
            <Users className="w-3 h-3 mr-1" />
            GSPro Community Hub
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-4xl">
            The Perfect Lie
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-medium">
            Discover. Play. Connect.
          </p>
          <p className="text-muted-foreground max-w-2xl">
            Your ultimate hub for the GSPro golf simulator community. Browse
            thousands of courses, watch stunning flyovers, and find the best
            resources for your setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button size="lg" className="group" asChild>
              <Link href="/courses">
                <MapPin className="w-4 h-4 mr-2" />
                Browse Courses
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/flyovers">
                <Play className="w-4 h-4 mr-2" />
                Watch Flyovers
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t w-full max-w-2xl">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Flyovers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All the tools and resources to enhance your GSPro experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Course Directory</CardTitle>
              <CardDescription>
                Browse thousands of GSPro courses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Discover and download courses from around the world. Filter by
                designer, location, and more. Rate courses and read reviews from
                the community.
              </p>
              <Button className="w-full group" variant="outline" asChild>
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Video Flyovers</CardTitle>
              <CardDescription>
                Watch stunning course previews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enjoy high-quality video flyovers from Eagles & Birdies. Get a
                virtual tour before you play, rate courses, and share your
                experiences.
              </p>
              <Button className="w-full group" variant="outline" asChild>
                <Link href="/flyovers">
                  Watch Videos
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Resource Hub</CardTitle>
              <CardDescription>
                Find the best golf sim gear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Curated collection of launch monitors, projectors, hitting mats,
                and more. Join communities and find trusted retailers.
              </p>
              <Button className="w-full group" variant="outline" asChild>
                <Link href="/resources">
                  Browse Resources
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="flex flex-col items-center gap-4 text-center max-w-2xl mx-auto">
          <Badge variant="secondary">
            <Star className="w-3 h-3 mr-1" />
            Join the Community
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground">
            Create an account to save your favorite courses, write reviews, and
            connect with the GSPro community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Sign Up Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
