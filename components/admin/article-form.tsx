"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createArticle, updateArticle, type ArticleFormData } from "@/app/actions/admin/articles";
import { Article, ArticleCategory, BudgetTier, RoomType, CeilingHeight, BuildStyle } from "@prisma/client";
import { articleCategoryLabels, budgetTierLabels, roomTypeLabels, ceilingHeightLabels, buildStyleLabels } from "@/lib/articles";

interface ArticleFormProps {
  article?: Article;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data: ArticleFormData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string || undefined,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as ArticleCategory,
      subcategory: formData.get("subcategory") as string || undefined,
      metaTitle: formData.get("metaTitle") as string || undefined,
      metaDescription: formData.get("metaDescription") as string || undefined,
      readTime: formData.get("readTime") as string || undefined,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      order: parseInt(formData.get("order") as string) || 0,
      budgetTier: (formData.get("budgetTier") as BudgetTier) || null,
      roomType: (formData.get("roomType") as RoomType) || null,
      ceilingHeight: (formData.get("ceilingHeight") as CeilingHeight) || null,
      buildStyle: (formData.get("buildStyle") as BuildStyle) || null,
    };

    try {
      if (article) {
        await updateArticle(article.id, data);
      } else {
        await createArticle(data);
      }
    } catch (error) {
      console.error("Failed to save article:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Essential article details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={article?.title}
              placeholder="e.g., Golf Simulator Basics: The Components"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={article?.slug}
              placeholder="Auto-generated from title if left blank"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version (e.g., golf-simulator-basics-components)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={article?.excerpt}
              placeholder="Brief description for cards and SEO (2-3 sentences)"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={article?.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(articleCategoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue={article?.order || 0}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Display order within category (lower = first)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="readTime">Read Time</Label>
            <Input
              id="readTime"
              name="readTime"
              defaultValue={article?.readTime || ""}
              placeholder="e.g., 8 min read (auto-calculated if blank)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Article HTML content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Article Content (HTML) *</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={article?.content}
              placeholder="<h2>Section Title</h2><p>Your content here...</p>"
              rows={20}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use HTML formatting (h2, h3, p, ul, li, strong, etc.)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Tags</CardTitle>
          <CardDescription>Optional filtering attributes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetTier">Budget Tier</Label>
              <Select name="budgetTier" defaultValue={article?.budgetTier || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(budgetTierLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select name="roomType" defaultValue={article?.roomType || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(roomTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ceilingHeight">Ceiling Height</Label>
              <Select name="ceilingHeight" defaultValue={article?.ceilingHeight || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(ceilingHeightLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildStyle">Build Style</Label>
              <Select name="buildStyle" defaultValue={article?.buildStyle || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.entries(buildStyleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              name="subcategory"
              defaultValue={article?.subcategory || ""}
              placeholder="Optional subcategory tag"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Meta</CardTitle>
          <CardDescription>Search engine optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={article?.metaTitle || ""}
              placeholder="Auto-generated from title if blank"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              defaultValue={article?.metaDescription || ""}
              placeholder="SEO description (155 characters max)"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Visibility</CardTitle>
          <CardDescription>Control article visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="published">Published</Label>
              <p className="text-sm text-muted-foreground">
                Make this article visible on the site
              </p>
            </div>
            <Switch
              id="published"
              name="published"
              defaultChecked={article?.published}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Featured</Label>
              <p className="text-sm text-muted-foreground">
                Show this article in featured sections
              </p>
            </div>
            <Switch
              id="featured"
              name="featured"
              defaultChecked={article?.featured}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : article ? "Update Article" : "Create Article"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
