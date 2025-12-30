"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { syncUser } from "@/lib/user";

export async function getNotifications() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  // Sync user to database if not already synced
  await syncUser();

  try {
    const notifications = await db.notification.findMany({
      where: { userId },
      include: {
        triggerer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to last 50 notifications
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify ownership
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }
}

export async function markAllNotificationsAsRead() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Failed to mark notifications as read");
  }
}

export async function getUnreadNotificationCount() {
  const { userId } = await auth();

  if (!userId) {
    return 0;
  }

  // Sync user to database if not already synced
  await syncUser();

  try {
    const count = await db.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
}

export async function getUserPreferences() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Sync user to database if not already synced
  await syncUser();

  try {
    let preferences = await db.userPreferences.findUnique({
      where: { userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await db.userPreferences.create({
        data: { userId },
      });
    }

    return preferences;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw new Error("Failed to fetch preferences");
  }
}

export async function updateUserPreferences({
  emailOnReply,
  emailOnMention,
  emailDigest,
}: {
  emailOnReply?: boolean;
  emailOnMention?: boolean;
  emailDigest?: boolean;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Sync user to database if not already synced
  await syncUser();

  try {
    // Ensure user preferences exist
    await db.userPreferences.upsert({
      where: { userId },
      update: {
        emailOnReply,
        emailOnMention,
        emailDigest,
      },
      create: {
        userId,
        emailOnReply: emailOnReply ?? true,
        emailOnMention: emailOnMention ?? true,
        emailDigest: emailDigest ?? false,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw new Error("Failed to update preferences");
  }
}
