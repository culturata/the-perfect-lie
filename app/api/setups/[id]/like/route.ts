import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: setupId } = await params;

    // Check if already liked
    const existingLike = await db.setupLike.findUnique({
      where: {
        setupId_userId: {
          setupId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await db.setupLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      await db.setupShowcase.update({
        where: { id: setupId },
        data: { likeCount: { decrement: 1 } },
      });

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await db.setupLike.create({
        data: {
          setupId,
          userId,
        },
      });

      await db.setupShowcase.update({
        where: { id: setupId },
        data: { likeCount: { increment: 1 } },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling setup like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
