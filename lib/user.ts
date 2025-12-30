import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  try {
    // Upsert user in our database
    const user = await db.user.upsert({
      where: { id: clerkUser.id },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        username: clerkUser.username,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        avatarUrl: clerkUser.imageUrl,
      },
      create: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        username: clerkUser.username,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        avatarUrl: clerkUser.imageUrl,
      },
    });

    return user;
  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}
