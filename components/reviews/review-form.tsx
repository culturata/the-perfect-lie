"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MentionTextarea } from "@/components/ui/mention-textarea";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/ui/star-rating";
import { createReview, updateReview } from "@/app/actions/reviews";
import { useAuth } from "@clerk/nextjs";

interface ReviewFormProps {
  courseId: string;
  existingReview?: {
    id: string;
    rating: number;
    title?: string | null;
    content?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  courseId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [content, setContent] = useState(existingReview?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isSignedIn) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Sign in to leave a review
        </p>
        <Button onClick={() => router.push("/sign-in")}>
          Sign In
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReview) {
        await updateReview({
          reviewId: existingReview.id,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        });
      } else {
        await createReview({
          courseId,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        });
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Rating *
        </label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Review Title (optional)
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience in one line"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Your Review (optional)
        </label>
        <MentionTextarea
          value={content}
          onChange={setContent}
          placeholder="Share your thoughts about this course... (type @ to mention)"
          rows={6}
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {content.length}/2000 characters • Use @ to mention users or courses
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : existingReview
            ? "Update Review"
            : "Submit Review"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
