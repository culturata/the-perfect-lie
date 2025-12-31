"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(email: string, name?: string) {
  try {
    const { userId } = await auth();

    // Check if email is already subscribed
    const existingSubscription = await db.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      // If unsubscribed, reactivate
      if (!existingSubscription.isActive) {
        const updated = await db.newsletterSubscription.update({
          where: { email },
          data: {
            isActive: true,
            unsubscribedAt: null,
            userId: userId || existingSubscription.userId,
            name: name || existingSubscription.name,
          },
        });
        revalidatePath("/");
        return { success: true, message: "Welcome back! You've been resubscribed.", subscription: updated };
      }

      return { success: false, message: "This email is already subscribed." };
    }

    // Create new subscription
    const subscription = await db.newsletterSubscription.create({
      data: {
        email,
        name,
        userId: userId || null,
        isActive: true,
        isVerified: !!userId, // Auto-verify if user is logged in
      },
    });

    revalidatePath("/");
    return { success: true, message: "Successfully subscribed to the newsletter!", subscription };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, message: "Failed to subscribe. Please try again." };
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  try {
    const subscription = await db.newsletterSubscription.findUnique({
      where: { email },
    });

    if (!subscription) {
      return { success: false, message: "Subscription not found." };
    }

    await db.newsletterSubscription.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    revalidatePath("/");
    return { success: true, message: "Successfully unsubscribed from the newsletter." };
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return { success: false, message: "Failed to unsubscribe. Please try again." };
  }
}

export async function checkNewsletterSubscription(email?: string) {
  try {
    const { userId } = await auth();

    if (!email && !userId) {
      return { isSubscribed: false };
    }

    // Check by userId first (for logged-in users)
    if (userId) {
      const subscription = await db.newsletterSubscription.findUnique({
        where: { userId },
      });

      if (subscription && subscription.isActive) {
        return { isSubscribed: true, subscription };
      }
    }

    // Check by email
    if (email) {
      const subscription = await db.newsletterSubscription.findUnique({
        where: { email },
      });

      if (subscription && subscription.isActive) {
        return { isSubscribed: true, subscription };
      }
    }

    return { isSubscribed: false };
  } catch (error) {
    console.error("Check newsletter subscription error:", error);
    return { isSubscribed: false };
  }
}

export async function getCurrentUserSubscription() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const subscription = await db.newsletterSubscription.findUnique({
      where: { userId },
    });

    return subscription;
  } catch (error) {
    console.error("Get current user subscription error:", error);
    return null;
  }
}
