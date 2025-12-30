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

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-4 py-24 md:py-32">
        <Badge variant="secondary" className="mb-4">
          GSPro Community Hub
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-center max-w-3xl">
          The Perfect Lie
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          Discover. Play. Connect.
        </p>
        <p className="text-lg text-muted-foreground text-center max-w-2xl">
          Your ultimate hub for the GSPro golf simulator community. Browse
          thousands of courses, watch stunning flyovers, and find the best
          resources for your setup.
        </p>
        <div className="flex gap-4 mt-8">
          <Button size="lg" asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/flyovers">Watch Flyovers</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            All the resources you need to get the most out of your GSPro experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Directory</CardTitle>
              <CardDescription>
                Browse thousands of GSPro courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover and download courses from around the world. Filter by
                designer, location, difficulty, and more. Keep track of your
                favorites and write reviews.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Flyovers</CardTitle>
              <CardDescription>
                Watch stunning course previews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Enjoy high-quality video flyovers from Eagles & Birdies. Get a
                virtual tour before you play and see courses in action.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/flyovers">Watch Videos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Hub</CardTitle>
              <CardDescription>
                Find the best golf sim gear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Curated collection of launch monitors, projectors, hitting mats,
                and more. Join communities and find trusted retailers.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/resources">Browse Resources</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Create an account to save your favorite courses, write reviews, and
            connect with the GSPro community.
          </p>
          <div className="flex gap-4 mt-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">Sign Up Free</Link>
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
