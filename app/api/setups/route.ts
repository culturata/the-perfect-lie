import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const budgetTier = searchParams.get("budgetTier") || "";
    const roomType = searchParams.get("roomType") || "";
    const buildStyle = searchParams.get("buildStyle") || "";
    const featured = searchParams.get("featured") === "true";
    const userId = searchParams.get("userId") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build where clause - only show approved setups by default
    const where: any = { approved: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (budgetTier) {
      where.budgetTier = budgetTier;
    }

    if (roomType) {
      where.roomType = roomType;
    }

    if (buildStyle) {
      where.buildStyle = buildStyle;
    }

    if (featured) {
      where.featured = true;
    }

    if (userId) {
      where.userId = userId;
      // If filtering by userId, show all (including unapproved)
      delete where.approved;
    }

    // Get total count
    const total = await db.setupShowcase.count({ where });

    // Get paginated setups
    const setups = await db.setupShowcase.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { likeCount: "desc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
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
        _count: {
          select: {
            comments: true,
            likes: true,
            ratings: true,
          },
        },
      },
    });

    // Calculate average rating for each setup
    const setupsWithRatings = await Promise.all(
      setups.map(async (setup) => {
        const avgRating = await db.setupRating.aggregate({
          where: { setupId: setup.id },
          _avg: { rating: true },
        });

        return {
          ...setup,
          averageRating: avgRating._avg.rating || 0,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      setups: setupsWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error in setups API:", error);
    return NextResponse.json(
      { error: "Failed to fetch setups" },
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

    const body = await request.json();

    const setup = await db.setupShowcase.create({
      data: {
        userId,
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
        images: body.images || [],
        thumbnailUrl: body.thumbnailUrl,
        buildStyle: body.buildStyle,
        tags: body.tags || [],
        approved: false, // Requires admin approval
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

    return NextResponse.json(setup, { status: 201 });
  } catch (error) {
    console.error("Error creating setup:", error);
    return NextResponse.json(
      { error: "Failed to create setup" },
      { status: 500 }
    );
  }
}
