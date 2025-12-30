import { NextRequest, NextResponse } from "next/server";
import { fetchPlaylistVideos } from "@/lib/youtube/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "flyovers";
    const page = searchParams.get("page") || "1";
    const pageToken = searchParams.get("pageToken") || undefined;

    // Get playlist ID based on type
    const playlistId =
      type === "flyovers"
        ? process.env.YOUTUBE_FLYOVERS_PLAYLIST_ID
        : process.env.YOUTUBE_GOLF_PLAYLIST_ID;

    if (!playlistId) {
      return NextResponse.json(
        { error: `Playlist ID not configured for type: ${type}` },
        { status: 500 }
      );
    }

    // Fetch videos from YouTube
    const result = await fetchPlaylistVideos(playlistId, 24, pageToken);

    return NextResponse.json({
      videos: result.videos,
      pagination: {
        page: parseInt(page),
        nextPageToken: result.nextPageToken,
        totalResults: result.totalResults,
      },
    });
  } catch (error) {
    console.error("Error in videos API:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
