import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const setup = await db.setupShowcase.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        comments: {
          where: { parentId: null },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        ratings: {
          select: {
            userId: true,
            rating: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!setup) {
      return NextResponse.json({ error: "Setup not found" }, { status: 404 });
    }

    // If not approved, only allow owner and admins to view
    if (!setup.approved) {
      const { userId } = await auth();
      if (!userId || userId !== setup.userId) {
        // Add admin check here
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Increment view count
    await db.setupShowcase.update({
      where: { id: setup.id },
      data: { viewCount: { increment: 1 } },
    });

    // Calculate average rating
    const avgRating = setup.ratings.reduce((sum, r) => sum + r.rating, 0) /
      (setup.ratings.length || 1);

    // Get current user's like status
    const { userId } = await auth();
    const userLiked = userId
      ? setup.likes.some((like) => like.userId === userId)
      : false;

    return NextResponse.json({
      ...setup,
      averageRating: avgRating,
      ratingCount: setup.ratings.length,
      userLiked,
    });
  } catch (error) {
    console.error("Error fetching setup:", error);
    return NextResponse.json(
      { error: "Failed to fetch setup" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user owns this setup or is admin
    const existingSetup = await db.setupShowcase.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingSetup) {
      return NextResponse.json({ error: "Setup not found" }, { status: 404 });
    }

    if (existingSetup.userId !== userId) {
      // Add admin check here
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    const setup = await db.setupShowcase.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        totalBudget: body.totalBudget,
        budgetTier: body.budgetTier,
        roomWidth: body.roomWidth,
        roomDepth: body.roomDepth,
        ceilingHeight: body.ceilingHeight,
        roomType: body.roomType,
        launchMonitor: body.launchMonitor,
        projector: body.projector,
        screen: body.screen,
        pcSpecs: body.pcSpecs,
        hitting: body.hitting,
        other: body.other,
        images: body.images,
        thumbnailUrl: body.thumbnailUrl,
        buildStyle: body.buildStyle,
        tags: body.tags,
        // Only admins can approve/feature
        ...(body.approved !== undefined && { approved: body.approved }),
        ...(body.featured !== undefined && { featured: body.featured }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(setup);
  } catch (error) {
    console.error("Error updating setup:", error);
    return NextResponse.json(
      { error: "Failed to update setup" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user owns this setup or is admin
    const existingSetup = await db.setupShowcase.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingSetup) {
      return NextResponse.json({ error: "Setup not found" }, { status: 404 });
    }

    if (existingSetup.userId !== userId) {
      // Add admin check here
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.setupShowcase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting setup:", error);
    return NextResponse.json(
      { error: "Failed to delete setup" },
      { status: 500 }
    );
  }
}
