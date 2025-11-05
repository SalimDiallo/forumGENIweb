"use server";

import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";

/**
 * Get upcoming featured events for home page
 */
export const getUpcomingEvents = actionClient
  .metadata({ actionName: "get-upcoming-events" })
  .action(async () => {
    const events = await prisma.event.findMany({
      where: {
        status: "published",
        isFeatured: true,
        startDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 2,
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        description: true,
        featuredImage: true,
        eventType: true,
        location: true,
        isVirtual: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        currentParticipants: true,
        isFeatured: true,
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    return { events };
  });

/**
 * Get featured video testimonials for home page
 */
export const getFeaturedTestimonials = actionClient
  .metadata({ actionName: "get-featured-testimonials" })
  .action(async () => {
    const testimonials = await prisma.videoTestimonial.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      take: 3,
    });

    return { testimonials };
  });

/**
 * Get all active video testimonials for home page
 */
export const getActiveTestimonials = actionClient
  .metadata({ actionName: "get-active-testimonials" })
  .action(async () => {
    const testimonials = await prisma.videoTestimonial.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
      ],
      take: 6,
    });

    return { testimonials };
  });
