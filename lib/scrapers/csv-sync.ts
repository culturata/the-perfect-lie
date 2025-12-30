/**
 * PakGolf Studios CSV Course Sync
 * Downloads and parses course data from CSV file
 * (formerly Pakman Studios)
 *
 * Supports both local and remote CSV files:
 * - Local: Place CSV in /public/data/gspro-course-list.csv
 * - Remote: Set COURSE_CSV_URL env variable
 */

import { db } from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";

// CSV URL - can be local file or remote URL
// Set COURSE_CSV_URL env variable to override
const CSV_URL = process.env.COURSE_CSV_URL || "https://pakgolfstudios.com/wp-content/uploads/gspro-course-list.csv";
const USE_LOCAL_FILE = CSV_URL.startsWith("/") || CSV_URL.startsWith("./");

export interface CSVCourse {
  server: string;
  name: string;
  location: string;
  designer: string;
  version: string;
  updated: string;
  tourStop: string;
  majorVenue: string;
  historic: string;
  downloadUrl?: string;
}

/**
 * Download and parse CSV from PakGolf Studios or local file
 */
export async function downloadCoursesCSV(): Promise<CSVCourse[]> {
  try {
    let csvText: string;

    if (USE_LOCAL_FILE) {
      // Read from local file
      console.log(`Reading courses CSV from local file: ${CSV_URL}`);
      const filePath = path.join(process.cwd(), "public", CSV_URL);
      csvText = await readFile(filePath, "utf-8");
      console.log("Successfully read local CSV file");
    } else {
      // Fetch from remote URL
      console.log(`Downloading courses CSV from: ${CSV_URL}`);
      const response = await fetch(CSV_URL, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 0 }, // Don't cache
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      csvText = await response.text();
      console.log("Successfully downloaded remote CSV");
    }

    const courses = parseCSV(csvText);
    console.log(`Parsed ${courses.length} courses from CSV`);
    return courses;
  } catch (error) {
    console.error("Error loading CSV:", error);
    throw error;
  }
}

/**
 * Parse CSV text into course objects
 */
function parseCSV(csvText: string): CSVCourse[] {
  const lines = csvText.split("\n");
  const courses: CSVCourse[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle quoted fields)
    const fields = parseCSVLine(line);

    if (fields.length >= 9) {
      courses.push({
        server: fields[0] || "",
        name: fields[1] || "",
        location: fields[2] || "",
        designer: fields[3] || "",
        version: fields[4] || "",
        updated: fields[5] || "",
        tourStop: fields[6] || "",
        majorVenue: fields[7] || "",
        historic: fields[8] || "",
        // Download URL would need to be constructed or scraped separately
        downloadUrl: "",
      });
    }
  }

  return courses;
}

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  fields.push(current.trim());

  return fields;
}

/**
 * Sync courses from CSV to database
 * Only updates courses that have changed
 */
export async function syncCoursesFromCSV(): Promise<{
  added: number;
  updated: number;
  unchanged: number;
}> {
  const courses = await downloadCoursesCSV();

  let added = 0;
  let updated = 0;
  let unchanged = 0;

  for (const csvCourse of courses) {
    try {
      // Check if course exists (match by name and designer)
      const existing = await db.course.findFirst({
        where: {
          name: csvCourse.name,
          designer: csvCourse.designer || null,
        },
      });

      const updatedDate = parseDate(csvCourse.updated);
      const tourStop = csvCourse.tourStop.toLowerCase() === "yes";
      const majorVenue = csvCourse.majorVenue.toLowerCase() === "yes";
      const historic = csvCourse.historic.toLowerCase() === "yes";

      if (!existing) {
        // Add new course
        await db.course.create({
          data: {
            name: csvCourse.name,
            designer: csvCourse.designer || null,
            server: csvCourse.server || null,
            location: csvCourse.location || null,
            version: csvCourse.version || null,
            dateAdded: updatedDate,
            lastUpdated: updatedDate,
            tourStop,
            majorVenue,
            historic,
            downloadUrl: csvCourse.downloadUrl || "",
            sourceUrl: CSV_URL,
          },
        });
        added++;
      } else {
        // Check if course has changed
        const hasChanged =
          existing.version !== csvCourse.version ||
          existing.lastUpdated.getTime() !== updatedDate.getTime() ||
          existing.tourStop !== tourStop ||
          existing.majorVenue !== majorVenue ||
          existing.historic !== historic;

        if (hasChanged) {
          // Update existing course
          await db.course.update({
            where: { id: existing.id },
            data: {
              version: csvCourse.version || null,
              lastUpdated: updatedDate,
              server: csvCourse.server || null,
              location: csvCourse.location || null,
              tourStop,
              majorVenue,
              historic,
            },
          });
          updated++;
        } else {
          unchanged++;
        }
      }
    } catch (error) {
      console.error(`Error syncing course ${csvCourse.name}:`, error);
    }
  }

  console.log(
    `Sync complete: ${added} added, ${updated} updated, ${unchanged} unchanged`
  );

  return { added, updated, unchanged };
}

/**
 * Parse date string from CSV
 */
function parseDate(dateStr: string): Date {
  // Try parsing MM/DD/YYYY format
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const month = parseInt(parts[0]) - 1; // Month is 0-indexed
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }

  // Fallback to Date constructor
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
}
