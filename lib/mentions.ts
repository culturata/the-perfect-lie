import { db } from "@/lib/db";

export interface ParsedMention {
  type: "user" | "course";
  id?: string;
  username?: string;
  courseName?: string;
}

/**
 * Parse mentions from text content
 * Supports:
 * - @username for user mentions
 * - @[Course Name](course:id) for course mentions
 */
export function parseMentions(content: string): ParsedMention[] {
  const mentions: ParsedMention[] = [];

  // Match course mentions: @[Course Name](course:id)
  const courseMentionRegex = /@\[([^\]]+)\]\(course:([^)]+)\)/g;
  let match;

  while ((match = courseMentionRegex.exec(content)) !== null) {
    mentions.push({
      type: "course",
      courseName: match[1],
      id: match[2],
    });
  }

  // Match user mentions: @username (but not the course mention format)
  // This regex looks for @ followed by alphanumeric/underscore, but not followed by [
  const userMentionRegex = /@(\w+)(?!\[)/g;

  while ((match = userMentionRegex.exec(content)) !== null) {
    mentions.push({
      type: "user",
      username: match[1],
    });
  }

  return mentions;
}

/**
 * Get user IDs from parsed mentions
 */
export async function getUserIdsFromMentions(
  mentions: ParsedMention[]
): Promise<string[]> {
  const userMentions = mentions.filter((m) => m.type === "user");

  if (userMentions.length === 0) {
    return [];
  }

  const usernames = userMentions
    .map((m) => m.username)
    .filter((u): u is string => !!u);

  const users = await db.user.findMany({
    where: {
      username: {
        in: usernames,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  return users.map((u) => u.id);
}

/**
 * Convert mentions to clickable links for display
 */
export function renderMentions(content: string): string {
  // Convert course mentions to links
  let rendered = content.replace(
    /@\[([^\]]+)\]\(course:([^)]+)\)/g,
    (match, courseName, courseId) => {
      const slug = encodeURIComponent(courseName.toLowerCase().replace(/\s+/g, "-"));
      return `<a href="/courses/${slug}" class="mention mention-course" data-course-id="${courseId}">@${courseName}</a>`;
    }
  );

  // Convert user mentions to links
  rendered = rendered.replace(
    /@(\w+)(?!\[)/g,
    (match, username) => {
      return `<span class="mention mention-user" data-username="${username}">@${username}</span>`;
    }
  );

  return rendered;
}
