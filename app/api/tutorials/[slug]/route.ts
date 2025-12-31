import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tutorial = await db.tutorial.findUnique({
      where: { slug },
      include: {
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
      },
    });

    if (!tutorial) {
      return NextResponse.json(
        { error: "Tutorial not found" },
        { status: 404 }
      );
    }

    // If not published, only allow admins to view
    if (!tutorial.published) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Add admin check here
    }

    // Increment view count
    await db.tutorial.update({
      where: { id: tutorial.id },
      data: { viewCount: { increment: 1 } },
    });

    // Calculate average rating
    const avgRating = tutorial.ratings.reduce((sum, r) => sum + r.rating, 0) /
      (tutorial.ratings.length || 1);

    return NextResponse.json({
      ...tutorial,
      averageRating: avgRating,
      ratingCount: tutorial.ratings.length,
    });
  } catch (error) {
    console.error("Error fetching tutorial:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutorial" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    // Add admin check here

    const { slug } = await params;
    const body = await request.json();

    const tutorial = await db.tutorial.update({
      where: { slug },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        difficulty: body.difficulty,
        softwareRequired: body.softwareRequired,
        toolsRequired: body.toolsRequired,
        estimatedTime: body.estimatedTime,
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl,
        images: body.images,
        prerequisites: body.prerequisites,
        tags: body.tags,
        published: body.published,
        featured: body.featured,
        order: body.order,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("Error updating tutorial:", error);
    return NextResponse.json(
      { error: "Failed to update tutorial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    // Add admin check here

    const { slug } = await params;

    await db.tutorial.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    return NextResponse.json(
      { error: "Failed to delete tutorial" },
      { status: 500 }
    );
  }
}
