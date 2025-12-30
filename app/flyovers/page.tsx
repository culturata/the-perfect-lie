import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FlyoversPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Video Flyovers</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Course Flyovers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Watch stunning video flyovers from Eagles & Birdies. Get a virtual
            tour of courses before you play and see them in action.
          </p>
        </div>

        {/* Coming Soon Message */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              YouTube integration in progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We're integrating with the YouTube Data API to bring you the
              latest flyover videos from Eagles & Birdies. Videos will be
              automatically synced and displayed in a beautiful grid.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>✅ YouTube playlist ID configured</p>
              <p>✅ Video player components ready</p>
              <p>🚧 YouTube API integration in development</p>
              <p>🚧 Video grid and filtering in development</p>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Playlist Info:</p>
              <p className="text-sm text-muted-foreground mt-1">
                Eagles & Birdies GSPro Flyovers
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Playlist ID: PLEKTcA5lfrkyDvi4zRCO1CKDFzXIL8xd0
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
