"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ResourceCategory } from "@prisma/client";

// Helper to check if user is admin
async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;

  // Check if user has admin role in Clerk
  const publicMetadata = user.publicMetadata as { role?: string };
  return publicMetadata.role === "admin";
}

// Get all resources (public)
export async function getResources() {
  try {
    const resources = await db.resource.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return resources;
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw new Error("Failed to fetch resources");
  }
}

// Get resources by category (public)
export async function getResourcesByCategory(category: ResourceCategory) {
  try {
    const resources = await db.resource.findMany({
      where: { category },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return resources;
  } catch (error) {
    console.error("Error fetching resources by category:", error);
    throw new Error("Failed to fetch resources");
  }
}

// Get single resource (public)
export async function getResource(id: string) {
  try {
    const resource = await db.resource.findUnique({
      where: { id },
    });
    return resource;
  } catch (error) {
    console.error("Error fetching resource:", error);
    throw new Error("Failed to fetch resource");
  }
}

// Create resource (admin only)
export async function createResource(data: {
  name: string;
  description?: string;
  url: string;
  affiliateUrl?: string;
  imageUrl?: string;
  category: ResourceCategory;
  subcategory?: string;
  price?: string;
  brand?: string;
  featured?: boolean;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  try {
    const resource = await db.resource.create({
      data: {
        name: data.name,
        description: data.description || null,
        url: data.url,
        affiliateUrl: data.affiliateUrl || null,
        imageUrl: data.imageUrl || null,
        category: data.category,
        subcategory: data.subcategory || null,
        price: data.price || null,
        brand: data.brand || null,
        featured: data.featured || false,
      },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/resources");

    return resource;
  } catch (error) {
    console.error("Error creating resource:", error);
    throw new Error("Failed to create resource");
  }
}

// Update resource (admin only)
export async function updateResource(
  id: string,
  data: {
    name?: string;
    description?: string;
    url?: string;
    affiliateUrl?: string;
    imageUrl?: string;
    category?: ResourceCategory;
    subcategory?: string;
    price?: string;
    brand?: string;
    featured?: boolean;
  }
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  try {
    const resource = await db.resource.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.affiliateUrl !== undefined && { affiliateUrl: data.affiliateUrl || null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.subcategory !== undefined && { subcategory: data.subcategory || null }),
        ...(data.price !== undefined && { price: data.price || null }),
        ...(data.brand !== undefined && { brand: data.brand || null }),
        ...(data.featured !== undefined && { featured: data.featured }),
      },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/resources");
    revalidatePath(`/admin/resources/${id}/edit`);

    return resource;
  } catch (error) {
    console.error("Error updating resource:", error);
    throw new Error("Failed to update resource");
  }
}

// Delete resource (admin only)
export async function deleteResource(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!(await isAdmin())) {
    throw new Error("Admin access required");
  }

  try {
    await db.resource.delete({
      where: { id },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/resources");

    return { success: true };
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw new Error("Failed to delete resource");
  }
}

// Get category label for display
export function getCategoryLabel(category: ResourceCategory): string {
  const labels: Record<ResourceCategory, string> = {
    LAUNCH_MONITOR: "Launch Monitors",
    RETAILER: "Retailers",
    EQUIPMENT: "Equipment",
    SOFTWARE: "Software",
    COMMUNITY: "Communities",
    ONLINE_PLAY: "Online Play",
    TOURNAMENTS: "Tournaments",
    SIMULATOR_BUILDING: "Simulator Building",
    BEST_PRACTICES: "Best Practices",
    TRAINING_AIDS: "Training Aids",
    COURSE_DESIGN: "Course Design",
    STREAMING_TOOLS: "Streaming Tools",
  };
  return labels[category];
}

// Get all category options
export function getCategoryOptions() {
  return Object.values(ResourceCategory).map((category) => ({
    value: category,
    label: getCategoryLabel(category),
  }));
}
