"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  createResource,
  updateResource,
  getCategoryOptions,
} from "@/app/actions/resources";
import { toast } from "sonner";
import { ResourceCategory } from "@prisma/client";

interface Resource {
  id: string;
  name: string;
  description: string | null;
  url: string;
  affiliateUrl: string | null;
  imageUrl: string | null;
  category: ResourceCategory;
  subcategory: string | null;
  price: string | null;
  brand: string | null;
  featured: boolean;
}

interface ResourceFormProps {
  resource?: Resource;
}

export function ResourceForm({ resource }: ResourceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: resource?.name || "",
    description: resource?.description || "",
    url: resource?.url || "",
    affiliateUrl: resource?.affiliateUrl || "",
    imageUrl: resource?.imageUrl || "",
    category: resource?.category || ("" as ResourceCategory),
    subcategory: resource?.subcategory || "",
    price: resource?.price || "",
    brand: resource?.brand || "",
    featured: resource?.featured || false,
  });

  const categoryOptions = getCategoryOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Name is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.url.trim()) {
        toast.error("URL is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.category) {
        toast.error("Category is required");
        setIsSubmitting(false);
        return;
      }

      if (resource) {
        // Update existing resource
        await updateResource(resource.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          url: formData.url.trim(),
          affiliateUrl: formData.affiliateUrl.trim() || undefined,
          imageUrl: formData.imageUrl.trim() || undefined,
          category: formData.category,
          subcategory: formData.subcategory.trim() || undefined,
          price: formData.price.trim() || undefined,
          brand: formData.brand.trim() || undefined,
          featured: formData.featured,
        });
        toast.success("Resource updated successfully");
      } else {
        // Create new resource
        await createResource({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          url: formData.url.trim(),
          affiliateUrl: formData.affiliateUrl.trim() || undefined,
          imageUrl: formData.imageUrl.trim() || undefined,
          category: formData.category,
          subcategory: formData.subcategory.trim() || undefined,
          price: formData.price.trim() || undefined,
          brand: formData.brand.trim() || undefined,
          featured: formData.featured,
        });
        toast.success("Resource created successfully");
      }

      router.push("/admin/resources");
      router.refresh();
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Launch Monitor Pro"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="A brief description of this resource..."
              rows={4}
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Affiliate URL */}
          <div className="space-y-2">
            <Label htmlFor="affiliateUrl">Affiliate URL (Optional)</Label>
            <Input
              id="affiliateUrl"
              type="url"
              value={formData.affiliateUrl}
              onChange={(e) =>
                setFormData({ ...formData, affiliateUrl: e.target.value })
              }
              placeholder="https://affiliate.example.com"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value as ResourceCategory })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory (Optional)</Label>
            <Input
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) =>
                setFormData({ ...formData, subcategory: e.target.value })
              }
              placeholder="e.g., Radar-based, Camera-based"
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand (Optional)</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder="e.g., Trackman, Foresight"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (Optional)</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="e.g., $199, Free, Starting at $99"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked === true })
              }
            />
            <Label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Featured resource
            </Label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? resource
                  ? "Updating..."
                  : "Creating..."
                : resource
                  ? "Update Resource"
                  : "Create Resource"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/resources")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
