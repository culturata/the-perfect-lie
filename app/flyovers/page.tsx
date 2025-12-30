import { Badge } from "@/components/ui/badge";
import { VideoCard } from "@/components/videos/video-card";
import { fetchPlaylistVideos } from "@/lib/youtube/api";

export const dynamic = "force-dynamic";

export default async function FlyoversPage() {
  let videos = [];
  let error = null;

  try {
    const playlistId = process.env.YOUTUBE_FLYOVERS_PLAYLIST_ID;
    if (playlistId) {
      const result = await fetchPlaylistVideos(playlistId, 24);
      videos = result.videos;
    } else {
      error = "YouTube playlist ID not configured";
    }
  } catch (e) {
    console.error("Error fetching videos:", e);
    error = "Failed to load videos. Please check your API configuration.";
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Video Flyovers</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Course Flyovers
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Watch stunning video flyovers from Eagles & Birdies. Get a virtual
            tour of courses before you play and see them in action.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Make sure you've set YOUTUBE_API_KEY and YOUTUBE_FLYOVERS_PLAYLIST_ID
              in your .env.local file.
            </p>
          </div>
        )}

        {/* Video Grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.videoId}
                videoId={video.videoId}
                title={video.title}
                description={video.description}
                thumbnailUrl={video.thumbnailUrl}
                publishedAt={video.publishedAt}
                channelTitle={video.channelTitle}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No videos found. Configure your YouTube API key to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
