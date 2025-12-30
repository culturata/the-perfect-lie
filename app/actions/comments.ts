"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendCommentReplyEmail } from "@/lib/email";

async function createNotification({
  userId,
  type,
  title,
  message,
  courseId,
  commentId,
  triggeredBy,
}: {
  userId: string;
  type: "COMMENT_REPLY" | "REVIEW_REPLY" | "MENTION" | "COURSE_UPDATE";
  title: string;
  message: string;
  courseId?: string;
  commentId?: string;
  triggeredBy: string;
}) {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        courseId,
        commentId,
        triggeredBy,
      },
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

export async function createComment({
  courseId,
  content,
  parentId,
}: {
  courseId: string;
  content: string;
  parentId?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to comment");
  }

  if (!content || content.trim().length === 0) {
    throw new Error("Comment cannot be empty");
  }

  try {
    // Create the comment
    const comment = await db.comment.create({
      data: {
        userId,
        courseId,
        content: content.trim(),
        parentId,
      },
      include: {
        user: true,
      },
    });

    // If this is a reply, create notification and maybe send email
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
        include: {
          user: {
            include: {
              preferences: true,
            },
          },
          course: true,
        },
      });

      if (parentComment && parentComment.userId !== userId) {
        // Create in-app notification
        await createNotification({
          userId: parentComment.userId,
          type: "COMMENT_REPLY",
          title: "New reply to your comment",
          message: `${comment.user.firstName || "Someone"} replied to your comment`,
          courseId,
          commentId: comment.id,
          triggeredBy: userId,
        });

        // Send email if user has it enabled (default: true)
        const emailEnabled = parentComment.user.preferences?.emailOnReply ?? true;

        if (emailEnabled && parentComment.user.email) {
          const courseSlug = encodeURIComponent(
            parentComment.course.name.toLowerCase().replace(/\s+/g, "-")
          );
          const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseSlug}#comment-${comment.id}`;

          await sendCommentReplyEmail({
            to: parentComment.user.email,
            userName: parentComment.user.firstName || "there",
            replierName: comment.user.firstName || "Someone",
            courseName: parentComment.course.name,
            commentContent: parentComment.content,
            replyContent: content,
            courseUrl,
          });
        }
      }
    }

    revalidatePath(`/courses/[slug]`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}

export async function updateComment({
  commentId,
  content,
}: {
  commentId: string;
  content: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to update a comment");
  }

  if (!content || content.trim().length === 0) {
    throw new Error("Comment cannot be empty");
  }

  try {
    // Verify ownership
    const existing = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const comment = await db.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        isEdited: true,
      },
    });

    revalidatePath(`/courses/[slug]`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment");
  }
}

export async function deleteComment(commentId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to delete a comment");
  }

  try {
    // Verify ownership
    const existing = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Delete the comment (cascades to replies)
    await db.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/courses/[slug]`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
}

export async function getCommentsForCourse(courseId: string) {
  try {
    // Get all comments for the course (including replies)
    const comments = await db.comment.findMany({
      where: {
        courseId,
        parentId: null, // Only top-level comments
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
