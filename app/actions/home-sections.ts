"use server";

import { actionClient } from "@/lib/safe-action";
import { getCachedUpcomingEvents} from "@/lib/cache";

/**
 * Get upcoming featured events for home page
 * Uses cached version for better performance
 */
export const getUpcomingEvents = actionClient
  .metadata({ actionName: "get-upcoming-events" })
  .action(async () => {
    // Use cached version
    return await getCachedUpcomingEvents(2);
  });
