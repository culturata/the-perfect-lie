import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@example.com";

export async function sendCommentReplyEmail({
  to,
  userName,
  replierName,
  courseName,
  commentContent,
  replyContent,
  courseUrl,
}: {
  to: string;
  userName: string;
  replierName: string;
  courseName: string;
  commentContent: string;
  replyContent: string;
  courseUrl: string;
}) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: `${replierName} replied to your comment on ${courseName}`,
      html: `
        <h2>New Reply to Your Comment</h2>
        <p>Hi ${userName},</p>
        <p><strong>${replierName}</strong> replied to your comment on <strong>${courseName}</strong>:</p>

        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p><strong>Your comment:</strong></p>
          <p>${commentContent}</p>
        </div>

        <div style="background: #f0f9ff; padding: 15px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p><strong>Reply:</strong></p>
          <p>${replyContent}</p>
        </div>

        <p><a href="${courseUrl}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Conversation</a></p>

        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">
          You're receiving this because you're participating in this thread.
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications">Manage your notification preferences</a>
        </p>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw - email failures shouldn't break the app
  }
}
