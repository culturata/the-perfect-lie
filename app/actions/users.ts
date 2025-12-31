"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper to check if user is admin
async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;

  const publicMetadata = user.publicMetadata as { role?: string };
  return publicMetadata.role === "admin";
}

// Get all users (admin only)
export async function getAllUsers() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            reviews: true,
            comments: true,
          },
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

// Get user by ID
export async function getUser(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            reviews: true,
            comments: true,
            favorites: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

// Mark user as bozo (admin only)
export async function markAsBozo(userId: string) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("Unauthorized");
  }

  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { isBozo: true },
    });

    revalidatePath("/admin/users");
    revalidatePath("/courses");

    return user;
  } catch (error) {
    console.error("Error marking user as bozo:", error);
    throw new Error("Failed to mark user as bozo");
  }
}

// Unmark user as bozo (admin only)
export async function unmarkAsBozo(userId: string) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("Unauthorized");
  }

  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { isBozo: false },
    });

    revalidatePath("/admin/users");
    revalidatePath("/courses");

    return user;
  } catch (error) {
    console.error("Error unmarking user as bozo:", error);
    throw new Error("Failed to unmark user as bozo");
  }
}

// Toggle bozo status (admin only)
export async function toggleBozoStatus(userId: string) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("Unauthorized");
  }

  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isBozo: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isBozo: !user.isBozo },
    });

    revalidatePath("/admin/users");
    revalidatePath("/courses");

    return updatedUser;
  } catch (error) {
    console.error("Error toggling bozo status:", error);
    throw new Error("Failed to toggle bozo status");
  }
}
