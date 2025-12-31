/**
 * Video-Course Matching Service
 * Matches YouTube flyover videos with course records using fuzzy string matching
 */

import { db } from "@/lib/db";

/**
 * Calculate similarity between two strings (0-1, higher is more similar)
 * Uses Levenshtein distance normalized
 */
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) {
    return 1.0;
  }

  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}

/**
 * Normalize course/video name for matching
 * Removes common prefixes, suffixes, and special characters
 */
function normalizeName(name: string): string {
  let normalized = name.toLowerCase();

  // Remove common prefixes
  normalized = normalized.replace(/^(gspro\s+|flyover\s+|virtual\s+)/i, "");

  // Remove common suffixes and metadata
  normalized = normalized.replace(/(\s+flyover|\s+gspro|\s+golf\s+course|\s+golf\s+club|\s+cc|\s+g\.?c\.?|\s+\d{4}|\s+\(.*?\)|\s+\[.*?\])$/gi, "");

  // Remove special characters but keep spaces
  normalized = normalized.replace(/[^\w\s]/g, " ");

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * Extract potential course names from video title
 * Enhanced to parse "GSPro Course Flyover - [CourseName] - Designed by [Designer]" pattern
 */
function extractCourseName(videoTitle: string): string[] {
  const possibilities: string[] = [];

  // Parse the standard flyover title pattern
  // "GSPro Course Flyover - [Course Name] - Designed by [Designer] - ..."
  const flyoverPattern = /GSPro Course Flyover\s*-\s*([^-]+)\s*-\s*Designed by\s+([^-]+)/i;
  const match = videoTitle.match(flyoverPattern);

  if (match) {
    const courseName = match[1].trim();
    possibilities.push(normalizeName(courseName));
    // Also add the raw course name without normalization for exact matching
    possibilities.push(courseName.trim());
  }

  // Try the full normalized title
  possibilities.push(normalizeName(videoTitle));

  // Try splitting on common delimiters
  const delimiters = [" - ", " | ", ": ", " at "];
  for (const delimiter of delimiters) {
    if (videoTitle.includes(delimiter)) {
      const parts = videoTitle.split(delimiter);
      possibilities.push(...parts.map(normalizeName));
    }
  }

  // Remove empty strings and duplicates
  return Array.from(new Set(possibilities.filter((p) => p.length > 0)));
}

/**
 * Extract designer name from video title
 */
function extractDesigner(videoTitle: string): string | null {
  const flyoverPattern = /Designed by\s+([^-]+)/i;
  const match = videoTitle.match(flyoverPattern);

  if (match) {
    return match[1].trim();
  }

  return null;
}

/**
 * Find best matching course for a video title
 */
async function findMatchingCourse(
  videoTitle: string,
  courses: Array<{ id: string; name: string; location: string | null; designer: string | null }>
): Promise<{ courseId: string; confidence: number } | null> {
  const possibleNames = extractCourseName(videoTitle);
  const videoDesigner = extractDesigner(videoTitle);
  let bestMatch: { courseId: string; confidence: number } | null = null;

  for (const courseName of possibleNames) {
    for (const course of courses) {
      const normalizedCourseName = normalizeName(course.name);
      const sim = similarity(courseName, normalizedCourseName);

      // Also check if location is mentioned in video title (boosts confidence)
      let locationBoost = 0;
      if (course.location) {
        const normalizedLocation = normalizeName(course.location);
        if (videoTitle.toLowerCase().includes(normalizedLocation)) {
          locationBoost = 0.1;
        }
      }

      // Check if designer matches (big confidence boost!)
      let designerBoost = 0;
      if (videoDesigner && course.designer) {
        const normalizedVideoDesigner = normalizeName(videoDesigner);
        const normalizedCourseDesigner = normalizeName(course.designer);
        const designerSim = similarity(normalizedVideoDesigner, normalizedCourseDesigner);

        // If designer similarity is high, give substantial boost
        if (designerSim >= 0.8) {
          designerBoost = 0.3;
        } else if (designerSim >= 0.6) {
          designerBoost = 0.15;
        }
      }

      const confidence = Math.min(sim + locationBoost + designerBoost, 1.0);

      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = { courseId: course.id, confidence };
      }
    }
  }

  // Lower threshold to 0.6 since we have designer matching now
  if (bestMatch && bestMatch.confidence >= 0.6) {
    return bestMatch;
  }

  return null;
}

/**
 * Match all flyover videos with courses
 */
export async function matchVideosWithCourses(): Promise<{
  matched: number;
  unmatched: number;
  updated: number;
}> {
  console.log("Starting video-course matching...");

  // Fetch all courses (we need name, location, and designer for matching)
  const courses = await db.course.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      designer: true,
    },
  });

  console.log(`Loaded ${courses.length} courses for matching`);

  // Fetch all flyover videos
  const videos = await db.youTubeVideo.findMany({
    where: {
      playlistType: "flyovers",
    },
  });

  console.log(`Found ${videos.length} flyover videos`);

  let matched = 0;
  let unmatched = 0;
  let updated = 0;

  for (const video of videos) {
    const match = await findMatchingCourse(video.title, courses);

    if (match) {
      // Check if this video is already linked to this course
      if (video.courseId !== match.courseId) {
        const matchedCourse = courses.find((c) => c.id === match.courseId);
        await db.youTubeVideo.update({
          where: { id: video.id },
          data: { courseId: match.courseId },
        });
        console.log(
          `✓ Matched "${video.title}"\n  -> "${matchedCourse?.name}" by ${matchedCourse?.designer || "Unknown"} (confidence: ${(match.confidence * 100).toFixed(0)}%)`
        );
        updated++;
      }
      matched++;
    } else {
      // Unlink if previously matched but confidence is now too low
      if (video.courseId) {
        await db.youTubeVideo.update({
          where: { id: video.id },
          data: { courseId: null },
        });
        updated++;
      }
      console.log(`✗ No match found for "${video.title}"`);
      unmatched++;
    }
  }

  console.log(`Matching complete: ${matched} matched, ${unmatched} unmatched, ${updated} updated`);

  return { matched, unmatched, updated };
}
