"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArticleCategory, BudgetTier, RoomType, CeilingHeight, BuildStyle } from "@prisma/client";
import { generateSlug, estimateReadTime } from "@/lib/articles";

export interface ArticleFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  subcategory?: string;
  metaTitle?: string;
  metaDescription?: string;
  readTime?: string;
  featured: boolean;
  published: boolean;
  order: number;
  budgetTier?: BudgetTier | null;
  roomType?: RoomType | null;
  ceilingHeight?: CeilingHeight | null;
  buildStyle?: BuildStyle | null;
}

// Get all articles (admin view)
export async function getAllArticlesAdmin() {
  return await db.article.findMany({
    orderBy: [
      { category: "asc" },
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });
}

// Get single article by ID
export async function getArticleById(id: string) {
  return await db.article.findUnique({
    where: { id },
  });
}

// Create new article
export async function createArticle(data: ArticleFormData) {
  const slug = data.slug || generateSlug(data.title);
  const readTime = data.readTime || estimateReadTime(data.content);

  await db.article.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      subcategory: data.subcategory || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      readTime,
      featured: data.featured,
      published: data.published,
      order: data.order,
      budgetTier: data.budgetTier || null,
      roomType: data.roomType || null,
      ceilingHeight: data.ceilingHeight || null,
      buildStyle: data.buildStyle || null,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/guides");
  redirect("/admin/articles");
}

// Update existing article
export async function updateArticle(id: string, data: ArticleFormData) {
  const readTime = data.readTime || estimateReadTime(data.content);

  const existing = await db.article.findUnique({
    where: { id },
    select: { publishedAt: true, published: true },
  });

  await db.article.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug || generateSlug(data.title),
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      subcategory: data.subcategory || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      readTime,
      featured: data.featured,
      published: data.published,
      order: data.order,
      budgetTier: data.budgetTier || null,
      roomType: data.roomType || null,
      ceilingHeight: data.ceilingHeight || null,
      buildStyle: data.buildStyle || null,
      publishedAt: data.published && !existing?.publishedAt ? new Date() : existing?.publishedAt,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/guides");
  revalidatePath(`/guides/${data.slug || generateSlug(data.title)}`);
  redirect("/admin/articles");
}

// Delete article
export async function deleteArticle(id: string) {
  await db.article.delete({
    where: { id },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/guides");
}

// Toggle published status
export async function toggleArticlePublished(id: string) {
  const article = await db.article.findUnique({
    where: { id },
    select: { published: true, publishedAt: true },
  });

  if (!article) return;

  await db.article.update({
    where: { id },
    data: {
      published: !article.published,
      publishedAt: !article.published && !article.publishedAt ? new Date() : article.publishedAt,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/guides");
}

// Toggle featured status
export async function toggleArticleFeatured(id: string) {
  const article = await db.article.findUnique({
    where: { id },
    select: { featured: true },
  });

  if (!article) return;

  await db.article.update({
    where: { id },
    data: {
      featured: !article.featured,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/guides");
}
