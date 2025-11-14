import { getCachedEvents } from "@/lib/cache";
import { Prisma } from "@/lib/generated/prisma";

/**
 * Get all published events (cached version)
 * Uses cache with 1 hour TTL
 */
export async function getEvents() {
    try {
      // Use cached version for better performance
      const events = await getCachedEvents();
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  export type EventsType = Prisma.PromiseReturnType<typeof getEvents>;