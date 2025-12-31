import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code, Palette, Video, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = {
  title: "Course Design Tutorials | GSPro Community",
  description: "Learn how to create stunning golf courses for GSPro. Step-by-step tutorials covering photogrammetry, 3D modeling, terrain editing, and more.",
};

export default async function TutorialsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="mb-2">Course Design</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Create Stunning Golf Courses for GSPro
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Master the art of course design with step-by-step tutorials from beginner to advanced
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="border-b bg-background">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <BookOpen className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Beginner</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Code className="h-6 w-6 text-yellow-600" />
              <span className="text-sm font-medium">Intermediate</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Palette className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium">Advanced</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
              <Video className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Featured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Coming Soon Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Coming Soon!</AlertTitle>
            <AlertDescription>
              Course Design Tutorials are currently being set up. Check back soon for comprehensive guides on creating amazing golf courses for GSPro.
              <br /><br />
              Planned tutorials will cover:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Getting started with GSPro Course Designer</li>
                <li>Photogrammetry basics for course scanning</li>
                <li>3D terrain modeling and editing</li>
                <li>Texture creation and mapping</li>
                <li>Advanced lighting and atmosphere</li>
                <li>Course testing and optimization</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Preview Cards */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">What You'll Learn</h2>
              <p className="text-muted-foreground text-lg">
                Our tutorials will cover everything you need to create professional-quality courses
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Badge className="bg-green-100 text-green-800 border-green-300 w-fit">
                    Beginner
                  </Badge>
                  <CardTitle className="text-lg mt-2">Getting Started</CardTitle>
                  <CardDescription>
                    Learn the fundamentals of course design and the GSPro tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Interface overview</li>
                    <li>• Basic terrain tools</li>
                    <li>• Creating your first hole</li>
                    <li>• Simple texture application</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 w-fit">
                    Intermediate
                  </Badge>
                  <CardTitle className="text-lg mt-2">Advanced Techniques</CardTitle>
                  <CardDescription>
                    Take your courses to the next level with professional methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Photogrammetry workflows</li>
                    <li>• Custom texture creation</li>
                    <li>• Realistic water features</li>
                    <li>• Environmental effects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Badge className="bg-red-100 text-red-800 border-red-300 w-fit">
                    Advanced
                  </Badge>
                  <CardTitle className="text-lg mt-2">Master Class</CardTitle>
                  <CardDescription>
                    Create tour-quality courses with cutting-edge techniques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Advanced 3D modeling</li>
                    <li>• Performance optimization</li>
                    <li>• Dynamic lighting systems</li>
                    <li>• Publishing & distribution</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
