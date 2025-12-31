import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const tag = searchParams.get("tag") || "";
    const featured = searchParams.get("featured") === "true";
    const published = searchParams.get("published") !== "false"; // Default to true
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build where clause
    const where: any = { published };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (featured) {
      where.featured = true;
    }

    // Get total count
    const total = await db.tutorial.count({ where });

    // Get paginated tutorials
    const tutorials = await db.tutorial.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        estimatedTime: true,
        thumbnailUrl: true,
        tags: true,
        featured: true,
        published: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
            ratings: true,
          },
        },
      },
    });

    // Calculate average rating for each tutorial
    const tutorialsWithRatings = await Promise.all(
      tutorials.map(async (tutorial) => {
        const avgRating = await db.tutorialRating.aggregate({
          where: { tutorialId: tutorial.id },
          _avg: { rating: true },
        });

        return {
          ...tutorial,
          averageRating: avgRating._avg.rating || 0,
          commentCount: tutorial._count.comments,
          ratingCount: tutorial._count.ratings,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      tutorials: tutorialsWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in tutorials API:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutorials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you'll need to implement this check)
    // For now, we'll allow any authenticated user
    const body = await request.json();

    const tutorial = await db.tutorial.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        difficulty: body.difficulty,
        softwareRequired: body.softwareRequired || [],
        toolsRequired: body.toolsRequired || [],
        estimatedTime: body.estimatedTime,
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl,
        images: body.images || [],
        prerequisites: body.prerequisites || [],
        tags: body.tags || [],
        published: body.published || false,
        featured: body.featured || false,
        order: body.order || 0,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });

    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error("Error creating tutorial:", error);
    return NextResponse.json(
      { error: "Failed to create tutorial" },
      { status: 500 }
    );
  }
}
