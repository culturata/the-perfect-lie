"use server";

import { db } from "@/lib/db";
import { ArticleCategory, BudgetTier, RoomType, CeilingHeight, BuildStyle } from "@prisma/client";

export interface ArticleFilters {
  category?: ArticleCategory;
  budgetTier?: BudgetTier;
  roomType?: RoomType;
  ceilingHeight?: CeilingHeight;
  buildStyle?: BuildStyle;
  featured?: boolean;
}

// Get all published articles
export async function getArticles(filters?: ArticleFilters) {
  const where: any = {
    published: true,
  };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.budgetTier) {
    where.budgetTier = filters.budgetTier;
  }

  if (filters?.roomType) {
    where.roomType = filters.roomType;
  }

  if (filters?.ceilingHeight) {
    where.ceilingHeight = filters.ceilingHeight;
  }

  if (filters?.buildStyle) {
    where.buildStyle = filters.buildStyle;
  }

  if (filters?.featured !== undefined) {
    where.featured = filters.featured;
  }

  return await db.article.findMany({
    where,
    orderBy: [
      { order: "asc" },
      { publishedAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      subcategory: true,
      readTime: true,
      featured: true,
      publishedAt: true,
      budgetTier: true,
      roomType: true,
      ceilingHeight: true,
      buildStyle: true,
    },
  });
}

// Get article by slug
export async function getArticleBySlug(slug: string) {
  return await db.article.findUnique({
    where: { slug, published: true },
  });
}

// Get related articles
export async function getRelatedArticles(articleId: string, category: ArticleCategory, limit: number = 3) {
  return await db.article.findMany({
    where: {
      published: true,
      category,
      id: { not: articleId },
    },
    take: limit,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      readTime: true,
      publishedAt: true,
    },
  });
}

// Get articles by category
export async function getArticlesByCategory(category: ArticleCategory) {
  return await db.article.findMany({
    where: {
      published: true,
      category,
    },
    orderBy: [
      { order: "asc" },
      { publishedAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      readTime: true,
      publishedAt: true,
    },
  });
}

// Get featured articles
export async function getFeaturedArticles(limit: number = 6) {
  return await db.article.findMany({
    where: {
      published: true,
      featured: true,
    },
    take: limit,
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      readTime: true,
      publishedAt: true,
    },
  });
}

// Get article count by category
export async function getArticleCountByCategory() {
  const articles = await db.article.findMany({
    where: { published: true },
    select: { category: true },
  });

  const counts: Record<string, number> = {};
  articles.forEach((article) => {
    counts[article.category] = (counts[article.category] || 0) + 1;
  });

  return counts;
}
