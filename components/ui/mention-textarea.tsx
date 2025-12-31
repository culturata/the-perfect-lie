"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

interface Course {
  id: string;
  name: string;
  designer: string | null;
}

interface MentionSuggestion {
  type: "user" | "course";
  id: string;
  display: string;
  username?: string;
  avatarUrl?: string | null;
  subtitle?: string;
}

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export function MentionTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
}: MentionTextareaProps) {
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Search for mentions
  useEffect(() => {
    if (!mentionQuery || mentionQuery.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchMentions = async () => {
      try {
        const response = await fetch(
          `/api/search/mentions?q=${encodeURIComponent(mentionQuery)}`
        );
        const data = await response.json();

        const userSuggestions: MentionSuggestion[] = data.users.map(
          (user: User) => ({
            type: "user" as const,
            id: user.id,
            display: user.username || `${user.firstName} ${user.lastName}`,
            username: user.username,
            avatarUrl: user.avatarUrl,
            subtitle: user.firstName
              ? `${user.firstName} ${user.lastName || ""}`
              : undefined,
          })
        );

        const courseSuggestions: MentionSuggestion[] = data.courses.map(
          (course: Course) => ({
            type: "course" as const,
            id: course.id,
            display: course.name,
            subtitle: course.designer ? `by ${course.designer}` : undefined,
          })
        );

        setSuggestions([...userSuggestions, ...courseSuggestions]);
        setShowSuggestions(true);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Error fetching mentions:", error);
      }
    };

    const debounce = setTimeout(searchMentions, 200);
    return () => clearTimeout(debounce);
  }, [mentionQuery]);

  // Handle text change and detect @ mentions
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check if we're in a mention context
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
    } else {
      setMentionQuery("");
      setShowSuggestions(false);
    }
  };

  // Insert mention into text
  const insertMention = (suggestion: MentionSuggestion) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);

    // Remove the @ and partial query
    const textBeforeMention = textBeforeCursor.replace(/@\w*$/, "");

    // Format mention based on type
    let mentionText: string;
    if (suggestion.type === "user") {
      mentionText = `@${suggestion.username || suggestion.display}`;
    } else {
      // For courses, use the course name
      mentionText = `@[${suggestion.display}](course:${suggestion.id})`;
    }

    const newValue = textBeforeMention + mentionText + " " + textAfterCursor;
    const newCursorPos = (textBeforeMention + mentionText + " ").length;

    onChange(newValue);
    setShowSuggestions(false);
    setMentionQuery("");

    // Reset cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && showSuggestions) {
      e.preventDefault();
      insertMention(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              type="button"
              onClick={() => insertMention(suggestion)}
              className={cn(
                "w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-3 transition-colors",
                index === selectedIndex && "bg-accent"
              )}
            >
              {suggestion.type === "user" && suggestion.avatarUrl && (
                <img
                  src={suggestion.avatarUrl}
                  alt={suggestion.display}
                  className="w-6 h-6 rounded-full"
                />
              )}
              {suggestion.type === "user" && !suggestion.avatarUrl && (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                  {suggestion.display[0]?.toUpperCase()}
                </div>
              )}
              {suggestion.type === "course" && (
                <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center text-xs">
                  ⛳
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {suggestion.display}
                </div>
                {suggestion.subtitle && (
                  <div className="text-xs text-muted-foreground truncate">
                    {suggestion.subtitle}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {suggestion.type === "user" ? "User" : "Course"}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
