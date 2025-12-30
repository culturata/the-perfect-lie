import { Course, YouTubeVideo, Resource, User, Review } from "@prisma/client";

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

export { Course, YouTubeVideo, Resource, User, Review };
