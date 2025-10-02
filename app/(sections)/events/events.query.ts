import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";


export async function getEvents() {
    try {
      const events = await prisma.event.findMany({
        // where: {
        //   status: 'published'
        // },
        orderBy: {
          startDate: 'asc'
        }
      });
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  export type EventsType = Prisma.PromiseReturnType<typeof getEvents>;