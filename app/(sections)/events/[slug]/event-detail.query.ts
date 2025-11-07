import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";

export async function getEventBySlug(slug: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        slug,
        status: 'published'
      }
    });
    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function getRelatedEvents(currentEventId: number, eventType: string, limit = 3) {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: 'published',
        id: { not: currentEventId },
        eventType: eventType as any
      },
      orderBy: {
        startDate: 'desc'
      },
      take: limit
    });
    return events;
  } catch (error) {
    console.error('Error fetching related events:', error);
    return [];
  }
}

export type EventDetailType = Prisma.PromiseReturnType<typeof getEventBySlug>;
export type RelatedEventsType = Prisma.PromiseReturnType<typeof getRelatedEvents>;
