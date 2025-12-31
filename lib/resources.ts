import { ResourceCategory } from "@prisma/client";

// Get category label for display
export function getCategoryLabel(category: ResourceCategory): string {
  const labels: Record<ResourceCategory, string> = {
    LAUNCH_MONITOR: "Launch Monitors",
    RETAILER: "Retailers",
    EQUIPMENT: "Equipment",
    SOFTWARE: "Software",
    COMMUNITY: "Communities",
    ONLINE_PLAY: "Online Play",
    TOURNAMENTS: "Tournaments",
    SIMULATOR_BUILDING: "Simulator Building",
    BEST_PRACTICES: "Best Practices",
    TRAINING_AIDS: "Training Aids",
    COURSE_DESIGN: "Course Design",
    STREAMING_TOOLS: "Streaming Tools",
  };
  return labels[category];
}

// Get all category options
export function getCategoryOptions() {
  return Object.values(ResourceCategory).map((category) => ({
    value: category,
    label: getCategoryLabel(category),
  }));
}
