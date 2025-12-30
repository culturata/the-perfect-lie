"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment, updateComment } from "@/app/actions/comments";
import { useAuth } from "@clerk/nextjs";

interface CommentFormProps {
  courseId: string;
  parentId?: string;
  existingComment?: {
    id: string;
    content: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentForm({
  courseId,
  parentId,
  existingComment,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState(existingComment?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isSignedIn) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Sign in to leave a comment
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

    if (!content.trim()) {
      setError("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingComment) {
        await updateComment({
          commentId: existingComment.id,
          content: content.trim(),
        });
      } else {
        await createComment({
          courseId,
          content: content.trim(),
          parentId,
        });
      }

      setContent("");
      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? "Write a reply..." : "Share your thoughts about this course..."}
          rows={parentId ? 3 : 5}
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {content.length}/2000 characters
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : existingComment
            ? "Update Comment"
            : parentId
            ? "Post Reply"
            : "Post Comment"}
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
