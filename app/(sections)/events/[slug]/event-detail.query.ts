import { getCachedEventBySlug, getCachedRelatedEvents } from "@/lib/cache";
import { Prisma } from "@/lib/generated/prisma";

/**
 * Get event by slug (cached version)
 * Uses cache with 1 hour TTL
 */
export async function getEventBySlug(slug: string) {
  try {
    // Use cached version for better performance
    const event = await getCachedEventBySlug(slug);
    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Get related events (cached version)
 * Uses cache with 1 hour TTL
 */
export async function getRelatedEvents(currentEventId: number, eventType: string, limit = 3) {
  try {
    // Use cached version for better performance
    const events = await getCachedRelatedEvents(currentEventId, eventType, limit);
    return events;
  } catch (error) {
    console.error('Error fetching related events:', error);
    return [];
  }
}

export type EventDetailType = Prisma.PromiseReturnType<typeof getEventBySlug>;
export type RelatedEventsType = Prisma.PromiseReturnType<typeof getRelatedEvents>;
