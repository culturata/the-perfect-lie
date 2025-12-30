/**
 * YouTube Data API v3 Integration
 * Fetches playlist videos and metadata
 */

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
}

export interface PlaylistVideosResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

/**
 * Fetch videos from a YouTube playlist
 */
export async function fetchPlaylistVideos(
  playlistId: string,
  maxResults: number = 50,
  pageToken?: string
): Promise<PlaylistVideosResponse> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YouTube API key is not configured");
  }

  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId,
    maxResults: maxResults.toString(),
    key: apiKey,
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?${params}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      id: item.id,
      videoId: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description || "",
      thumbnailUrl:
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
    }));

    return {
      videos,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo.totalResults,
    };
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    throw error;
  }
}

/**
 * Fetch video details including statistics
 */
export async function fetchVideoDetails(videoIds: string[]) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YouTube API key is not configured");
  }

  const params = new URLSearchParams({
    part: "contentDetails,statistics",
    id: videoIds.join(","),
    key: apiKey,
  });

  const url = `https://www.googleapis.com/youtube/v3/videos?${params}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      videoId: item.id,
      duration: item.contentDetails.duration,
      viewCount: parseInt(item.statistics.viewCount || "0"),
      likeCount: parseInt(item.statistics.likeCount || "0"),
    }));
  } catch (error) {
    console.error("Error fetching video details:", error);
    throw error;
  }
}

/**
 * Format ISO 8601 duration to human-readable format
 */
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
