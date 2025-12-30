// Note: Import Prisma types when client is generated
// import { Course, YouTubeVideo, Resource, User, Review } from "@prisma/client";

// Base types (will be replaced by Prisma generated types)
export type Course = {
  id: string;
  name: string;
  designer?: string | null;
  dateAdded: Date;
  lastUpdated: Date;
  downloadUrl: string;
  sourceUrl?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  courseType?: string | null;
  holes?: number | null;
  difficulty?: number | null;
  fileSize?: string | null;
  version?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseWithRelations = Course & {
  reviews?: Review[];
  _count?: {
    favorites: number;
    reviews: number;
  };
  averageRating?: number;
};

export type CourseFilters = {
  search?: string;
  designer?: string;
  courseType?: string;
  location?: string;
  sortBy?: "dateAdded" | "name" | "rating";
  sortOrder?: "asc" | "desc";
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type VideoFilters = {
  playlistType?: "flyovers" | "golf";
  search?: string;
};

export type ResourceFilters = {
  category?: string;
  featured?: boolean;
};
