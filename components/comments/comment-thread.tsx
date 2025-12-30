"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommentForm } from "./comment-form";
import { deleteComment } from "@/app/actions/comments";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  isEdited: boolean;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
  replies?: Comment[];
}

interface CommentThreadProps {
  comments: Comment[];
  courseId: string;
  depth?: number;
}

function CommentItem({
  comment,
  courseId,
  depth = 0,
}: {
  comment: Comment;
  courseId: string;
  depth?: number;
}) {
  const { userId } = useAuth();
  const router = useRouter();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
      router.refresh();
    } catch (error) {
      alert("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const maxDepth = 5;
  const isMaxDepth = depth >= maxDepth;

  return (
    <div className={depth > 0 ? "ml-6 md:ml-12 border-l-2 pl-4" : ""}>
      <Card className="p-4">
        {isEditing ? (
          <CommentForm
            courseId={courseId}
            existingComment={comment}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {comment.user.avatarUrl && (
                  <img
                    src={comment.user.avatarUrl}
                    alt={comment.user.firstName || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-sm">
                    {comment.user.firstName} {comment.user.lastName?.[0]}.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                    {comment.isEdited && " (edited)"}
                  </p>
                </div>
              </div>

              {userId === comment.user.id && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

            {!isMaxDepth && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        )}
      </Card>

      {isReplying && !isMaxDepth && (
        <div className="mt-3 ml-6 md:ml-12">
          <CommentForm
            courseId={courseId}
            parentId={comment.id}
            onSuccess={() => setIsReplying(false)}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              courseId={courseId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentThread({ comments, courseId, depth = 0 }: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          courseId={courseId}
          depth={depth}
        />
      ))}
    </div>
  );
}
