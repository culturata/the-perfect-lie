"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CollectionItemType } from "@prisma/client";

export async function getUserCollections() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const collections = await db.collection.findMany({
    where: { userId },
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return collections;
}

export async function getCollection(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const collection = await db.collection.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          course: {
            select: {
              id: true,
              name: true,
              designer: true,
              location: true,
            },
          },
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              category: true,
            },
          },
        },
        orderBy: { addedAt: "desc" },
      },
    },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  // Check ownership
  if (collection.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return collection;
}

export async function createCollection(data: {
  name: string;
  description?: string;
  isPublic?: boolean;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const collection = await db.collection.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic ?? false,
    },
  });

  revalidatePath("/collections");
  return collection;
}

export async function updateCollection(
  id: string,
  data: {
    name?: string;
    description?: string;
    isPublic?: boolean;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check ownership
  const existing = await db.collection.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const collection = await db.collection.update({
    where: { id },
    data,
  });

  revalidatePath("/collections");
  revalidatePath(`/collections/${id}`);
  return collection;
}

export async function deleteCollection(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check ownership
  const existing = await db.collection.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db.collection.delete({
    where: { id },
  });

  revalidatePath("/collections");
  redirect("/collections");
}

export async function addToCollection(data: {
  collectionId: string;
  itemType: CollectionItemType;
  courseId?: string;
  articleId?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Validate that we have the correct ID based on itemType
  if (data.itemType === "COURSE" && !data.courseId) {
    throw new Error("Course ID required");
  }
  if (data.itemType === "ARTICLE" && !data.articleId) {
    throw new Error("Article ID required");
  }

  // Check collection ownership
  const collection = await db.collection.findUnique({
    where: { id: data.collectionId },
    select: { userId: true },
  });

  if (!collection || collection.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Check if item already exists in collection
  const existing = await db.collectionItem.findFirst({
    where: {
      collectionId: data.collectionId,
      itemType: data.itemType,
      ...(data.courseId ? { courseId: data.courseId } : {}),
      ...(data.articleId ? { articleId: data.articleId } : {}),
    },
  });

  if (existing) {
    return { success: true, message: "Item already in collection" };
  }

  await db.collectionItem.create({
    data: {
      collectionId: data.collectionId,
      itemType: data.itemType,
      courseId: data.courseId,
      articleId: data.articleId,
    },
  });

  revalidatePath("/collections");
  revalidatePath(`/collections/${data.collectionId}`);

  return { success: true, message: "Added to collection" };
}

export async function removeFromCollection(itemId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check ownership through collection
  const item = await db.collectionItem.findUnique({
    where: { id: itemId },
    include: {
      collection: {
        select: { userId: true, id: true },
      },
    },
  });

  if (!item || item.collection.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db.collectionItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/collections");
  revalidatePath(`/collections/${item.collection.id}`);

  return { success: true };
}

export async function checkItemInCollections(data: {
  itemType: CollectionItemType;
  courseId?: string;
  articleId?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const collectionIds = await db.collectionItem.findMany({
    where: {
      itemType: data.itemType,
      ...(data.courseId ? { courseId: data.courseId } : {}),
      ...(data.articleId ? { articleId: data.articleId } : {}),
      collection: {
        userId,
      },
    },
    select: {
      collectionId: true,
    },
  });

  return collectionIds.map((item) => item.collectionId);
}
