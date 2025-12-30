/**
 * Pakman Studios Course List Scraper
 * Scrapes course data from https://pakmanstudios.com/gspro-course-list/
 */

import * as cheerio from "cheerio";

export interface ScrapedCourse {
  name: string;
  designer: string | null;
  dateAdded: Date;
  lastUpdated: Date;
  downloadUrl: string;
  sourceUrl: string;
}

const PAKMAN_URL = "https://pakmanstudios.com/gspro-course-list/";

/**
 * Scrape courses from Pakman Studios
 */
export async function scrapePakmanCourses(): Promise<ScrapedCourse[]> {
  try {
    console.log("Fetching Pakman Studios course list...");

    const response = await fetch(PAKMAN_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const courses: ScrapedCourse[] = [];

    // Find the table containing courses
    // Pakman Studios uses a table with course data
    $("table tbody tr").each((index, element) => {
      try {
        const $row = $(element);
        const cells = $row.find("td");

        if (cells.length >= 3) {
          // Extract course name (usually first column)
          const courseName = $(cells[0]).text().trim();

          // Extract designer (usually second column)
          const designer = $(cells[1]).text().trim() || null;

          // Extract date (usually third column)
          const dateText = $(cells[2]).text().trim();
          const date = parseDateString(dateText);

          // Extract download link
          const downloadLink = $row.find("a[href*='drive.google']").attr("href") ||
                             $row.find("a[href*='download']").attr("href") ||
                             $row.find("a").first().attr("href") ||
                             "";

          if (courseName && downloadLink) {
            courses.push({
              name: courseName,
              designer: designer,
              dateAdded: date,
              lastUpdated: date,
              downloadUrl: downloadLink,
              sourceUrl: PAKMAN_URL,
            });
          }
        }
      } catch (error) {
        console.error("Error parsing row:", error);
      }
    });

    console.log(`Scraped ${courses.length} courses from Pakman Studios`);
    return courses;
  } catch (error) {
    console.error("Error scraping Pakman Studios:", error);
    throw error;
  }
}

/**
 * Parse various date formats
 */
function parseDateString(dateStr: string): Date {
  // Remove any extra whitespace
  const cleaned = dateStr.trim();

  // Try parsing common date formats
  const formats = [
    // MM/DD/YYYY
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    // YYYY-MM-DD
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    // DD-MM-YYYY
    /(\d{1,2})-(\d{1,2})-(\d{4})/,
  ];

  for (const format of formats) {
    const match = cleaned.match(format);
    if (match) {
      const date = new Date(cleaned);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  // If parsing fails, return current date
  return new Date();
}

/**
 * Extract course metadata from description or name
 */
export function extractCourseMetadata(courseName: string) {
  const metadata: {
    holes?: number;
    location?: string;
  } = {};

  // Extract number of holes
  if (courseName.match(/18\s*hole/i)) {
    metadata.holes = 18;
  } else if (courseName.match(/9\s*hole/i)) {
    metadata.holes = 9;
  }

  // Extract location (simple heuristic - look for patterns like "Country Club - City, State")
  const locationMatch = courseName.match(/[-–]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/);
  if (locationMatch) {
    metadata.location = locationMatch[1];
  }

  return metadata;
}
