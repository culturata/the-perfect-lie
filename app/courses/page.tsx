import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Course Directory</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Browse GSPro Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover thousands of GSPro courses from designers around the world.
            Search, filter, and find your next favorite course to play.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search courses..."
            className="md:max-w-sm"
          />
          <div className="flex gap-2">
            <Button variant="outline">All Courses</Button>
            <Button variant="outline">By Designer</Button>
            <Button variant="outline">By Location</Button>
          </div>
        </div>

        {/* Coming Soon Message */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Course directory is under construction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We're currently building the course scraper and database
              integration. Soon you'll be able to browse thousands of courses
              with advanced search and filtering capabilities.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>✅ Database schema complete</p>
              <p>✅ UI components ready</p>
              <p>🚧 Course scraper in development</p>
              <p>🚧 API routes in development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
