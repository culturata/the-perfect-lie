"use client";

import Link from "next/link";
import { useMemo } from "react";

interface MentionContentProps {
  content: string;
  className?: string;
}

export function MentionContent({ content, className }: MentionContentProps) {
  const renderedContent = useMemo(() => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Match course mentions: @[Course Name](course:id)
    const courseMentionRegex = /@\[([^\]]+)\]\(course:([^)]+)\)/g;

    // Match user mentions: @username (not followed by [)
    const userMentionRegex = /@(\w+)(?!\[)/g;

    // Create a combined regex to find all mentions in order
    const combinedRegex = new RegExp(
      `(${courseMentionRegex.source}|${userMentionRegex.source})`,
      "g"
    );

    let match;
    while ((match = combinedRegex.exec(content)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      const fullMatch = match[0];

      // Check if it's a course mention
      if (fullMatch.startsWith("@[")) {
        const courseMatch = courseMentionRegex.exec(fullMatch);
        if (courseMatch) {
          const courseName = courseMatch[1];
          const courseSlug = encodeURIComponent(
            courseName.toLowerCase().replace(/\s+/g, "-")
          );
          parts.push(
            <Link
              key={match.index}
              href={`/courses/${courseSlug}`}
              className="mention mention-course font-medium text-green-600 dark:text-green-400 hover:underline"
            >
              @{courseName}
            </Link>
          );
        }
        // Reset regex state
        courseMentionRegex.lastIndex = 0;
      } else {
        // It's a user mention
        const username = match[1];
        parts.push(
          <span
            key={match.index}
            className="mention mention-user font-medium text-blue-600 dark:text-blue-400"
          >
            @{username}
          </span>
        );
      }

      lastIndex = match.index + fullMatch.length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  }, [content]);

  return (
    <div className={className}>
      {Array.isArray(renderedContent)
        ? renderedContent.map((part, index) => (
            <span key={index}>{part}</span>
          ))
        : renderedContent}
    </div>
  );
}
