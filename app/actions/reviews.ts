"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createReview({
  courseId,
  rating,
  title,
  content,
}: {
  courseId: string;
  rating: number;
  title?: string;
  content?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to leave a review");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  try {
    const review = await db.review.create({
      data: {
        userId,
        courseId,
        rating,
        title,
        content,
      },
    });

    revalidatePath(`/courses/[slug]`);
    return { success: true, review };
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
  }
}

export async function updateReview({
  reviewId,
  rating,
  title,
  content,
}: {
  reviewId: string;
  rating: number;
  title?: string;
  content?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to update a review");
  }

  try {
    // Verify ownership
    const existing = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const review = await db.review.update({
      where: { id: reviewId },
      data: {
        rating,
        title,
        content,
      },
    });

    revalidatePath(`/courses/[slug]`);
    return { success: true, review };
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Failed to update review");
  }
}

export async function deleteReview(reviewId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to delete a review");
  }

  try {
    // Verify ownership
    const existing = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await db.review.delete({
      where: { id: reviewId },
    });

    revalidatePath(`/courses/[slug]`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
}

export async function getReviewsForCourse(courseId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { courseId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getCourseRatingStats(courseId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { courseId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    const distribution = reviews.reduce(
      (acc, r) => {
        acc[r.rating as 1 | 2 | 3 | 4 | 5]++;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>
    );

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      distribution,
    };
  } catch (error) {
    console.error("Error fetching rating stats:", error);
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
}
