import { NextResponse } from "next/server";
import { fetchAllPlaylistVideos } from "@/lib/youtube/api";
import { db } from "@/lib/db";

export async function POST() {
  try {
    console.log("Starting YouTube playlist sync...");

    const flyoversPlaylistId = process.env.YOUTUBE_FLYOVERS_PLAYLIST_ID;
    const golfPlaylistId = process.env.YOUTUBE_GOLF_PLAYLIST_ID;

    if (!flyoversPlaylistId && !golfPlaylistId) {
      return NextResponse.json(
        { error: "No playlist IDs configured" },
        { status: 500 }
      );
    }

    let flyoversProcessed = 0;
    let golfProcessed = 0;
    let flyoversCreated = 0;
    let flyoversUpdated = 0;
    let golfCreated = 0;
    let golfUpdated = 0;

    // Sync flyovers playlist
    if (flyoversPlaylistId) {
      console.log("\n📺 Syncing flyovers playlist...");
      const flyoverVideos = await fetchAllPlaylistVideos(flyoversPlaylistId);
      flyoversProcessed = flyoverVideos.length;

      for (const video of flyoverVideos) {
        const existing = await db.youTubeVideo.findUnique({
          where: { videoId: video.videoId },
        });

        if (existing) {
          // Update existing video
          await db.youTubeVideo.update({
            where: { videoId: video.videoId },
            data: {
              title: video.title,
              description: video.description,
              thumbnailUrl: video.thumbnailUrl,
              publishedAt: new Date(video.publishedAt),
              channelTitle: video.channelTitle,
              playlistType: "flyovers",
            },
          });
          flyoversUpdated++;
        } else {
          // Create new video
          await db.youTubeVideo.create({
            data: {
              videoId: video.videoId,
              title: video.title,
              description: video.description,
              thumbnailUrl: video.thumbnailUrl,
              publishedAt: new Date(video.publishedAt),
              channelTitle: video.channelTitle,
              playlistType: "flyovers",
            },
          });
          flyoversCreated++;
        }
      }

      console.log(
        `✓ Flyovers: ${flyoversCreated} created, ${flyoversUpdated} updated`
      );
    }

    // Sync golf playlist
    if (golfPlaylistId) {
      console.log("\n⛳ Syncing golf playlist...");
      const golfVideos = await fetchAllPlaylistVideos(golfPlaylistId);
      golfProcessed = golfVideos.length;

      for (const video of golfVideos) {
        const existing = await db.youTubeVideo.findUnique({
          where: { videoId: video.videoId },
        });

        if (existing) {
          // Update existing video
          await db.youTubeVideo.update({
            where: { videoId: video.videoId },
            data: {
              title: video.title,
              description: video.description,
              thumbnailUrl: video.thumbnailUrl,
              publishedAt: new Date(video.publishedAt),
              channelTitle: video.channelTitle,
              playlistType: "golf",
            },
          });
          golfUpdated++;
        } else {
          // Create new video
          await db.youTubeVideo.create({
            data: {
              videoId: video.videoId,
              title: video.title,
              description: video.description,
              thumbnailUrl: video.thumbnailUrl,
              publishedAt: new Date(video.publishedAt),
              channelTitle: video.channelTitle,
              playlistType: "golf",
            },
          });
          golfCreated++;
        }
      }

      console.log(
        `✓ Golf: ${golfCreated} created, ${golfUpdated} updated`
      );
    }

    const summary = {
      success: true,
      flyovers: {
        processed: flyoversProcessed,
        created: flyoversCreated,
        updated: flyoversUpdated,
      },
      golf: {
        processed: golfProcessed,
        created: golfCreated,
        updated: golfUpdated,
      },
      total: {
        processed: flyoversProcessed + golfProcessed,
        created: flyoversCreated + golfCreated,
        updated: flyoversUpdated + golfUpdated,
      },
    };

    console.log("\n✅ YouTube sync complete:");
    console.log(JSON.stringify(summary, null, 2));

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error syncing YouTube videos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync YouTube videos",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Allow GET for easy testing
  return POST();
}
