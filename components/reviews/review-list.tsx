"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "./review-form";
import { MentionContent } from "@/components/ui/mention-content";
import { deleteReview } from "@/app/actions/reviews";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  createdAt: Date;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId);
      router.refresh();
    } catch (error) {
      alert("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No reviews yet. Be the first to review this course!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          {editingId === review.id ? (
            <ReviewForm
              courseId={review.id}
              existingReview={review}
              onSuccess={() => setEditingId(null)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.user.avatarUrl && (
                    <img
                      src={review.user.avatarUrl}
                      alt={review.user.firstName || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {review.user.firstName}{" "}
                      {review.user.lastName?.[0]}.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  {userId === review.user.id && (
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(review.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {review.title && (
                <h4 className="font-semibold text-lg">{review.title}</h4>
              )}

              {review.content && (
                <MentionContent
                  content={review.content}
                  className="text-muted-foreground whitespace-pre-wrap"
                />
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
