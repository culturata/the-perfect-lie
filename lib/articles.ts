import { ArticleCategory, BudgetTier, RoomType, CeilingHeight, BuildStyle } from "@prisma/client";

// Category labels for display
export const articleCategoryLabels: Record<ArticleCategory, string> = {
  START_HERE: "Start Here",
  LAUNCH_MONITORS: "Launch Monitors & Accuracy",
  PROJECTORS: "Projectors & Visuals",
  PC_SOFTWARE: "PC & Software",
  SCREENS_ENCLOSURES: "Screens & Enclosures",
  FLOORING_TURF: "Flooring & Turf",
  LIGHTING_POWER: "Lighting & Power",
  DIY_BUILDS: "DIY Build Guides",
  TUNING_MAINTENANCE: "Tuning & Maintenance",
  EXAMPLE_BUILDS: "Example Builds",
};

// Category descriptions
export const articleCategoryDescriptions: Record<ArticleCategory, string> = {
  START_HERE: "Essential foundation knowledge for building your golf simulator",
  LAUNCH_MONITORS: "Understanding launch monitor technology and setup for accurate shot tracking",
  PROJECTORS: "Choosing and configuring projectors for immersive visuals",
  PC_SOFTWARE: "Computer specifications and software setup for GSPro and simulator platforms",
  SCREENS_ENCLOSURES: "Impact screens, enclosures, and safety considerations",
  FLOORING_TURF: "Hitting mats, putting surfaces, and flooring solutions",
  LIGHTING_POWER: "Lighting design, power planning, and audio setup",
  DIY_BUILDS: "Step-by-step guides for building your own simulator components",
  TUNING_MAINTENANCE: "Optimization, troubleshooting, and ongoing maintenance",
  EXAMPLE_BUILDS: "Complete build examples and upgrade roadmaps",
};

// Filter labels
export const budgetTierLabels: Record<BudgetTier, string> = {
  STARTER: "Starter Budget",
  MID: "Mid-Range",
  PREMIUM: "Premium",
};

export const roomTypeLabels: Record<RoomType, string> = {
  GARAGE: "Garage",
  BASEMENT: "Basement",
  SPARE_ROOM: "Spare Room",
  SHED: "Dedicated Shed",
};

export const ceilingHeightLabels: Record<CeilingHeight, string> = {
  UNDER_9: "Under 9 ft",
  NINE_TO_TEN: "9-10 ft",
  OVER_10: "Over 10 ft",
};

export const buildStyleLabels: Record<BuildStyle, string> = {
  DIY: "DIY",
  HYBRID: "Hybrid (Part DIY)",
  TURNKEY: "Turnkey/Prefab",
};

// Get category label
export function getCategoryLabel(category: ArticleCategory): string {
  return articleCategoryLabels[category] || category;
}

// Get category description
export function getCategoryDescription(category: ArticleCategory): string {
  return articleCategoryDescriptions[category] || "";
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Estimate read time from content length
export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Get article category from post number (based on the blueprint)
export function getCategoryFromPostNumber(postNumber: number): ArticleCategory {
  if (postNumber >= 1 && postNumber <= 5) return "START_HERE";
  if (postNumber >= 6 && postNumber <= 10) return "LAUNCH_MONITORS";
  if (postNumber >= 11 && postNumber <= 15) return "PROJECTORS";
  if (postNumber >= 16 && postNumber <= 20) return "PC_SOFTWARE";
  if (postNumber >= 21 && postNumber <= 26) return "SCREENS_ENCLOSURES";
  if (postNumber >= 27 && postNumber <= 32) return "FLOORING_TURF";
  if (postNumber >= 33 && postNumber <= 38) return "EXAMPLE_BUILDS";
  return "START_HERE";
}
