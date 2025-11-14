"use server";

import { actionClient } from "@/lib/safe-action";
import { getCachedUpcomingEvents, getCachedFeaturedTestimonials, getCachedActiveTestimonials } from "@/lib/cache";

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

/**
 * Get featured video testimonials for home page
 * Uses cached version for better performance
 */
export const getFeaturedTestimonials = actionClient
  .metadata({ actionName: "get-featured-testimonials" })
  .action(async () => {
    // Use cached version
    return await getCachedFeaturedTestimonials(3);
  });

/**
 * Get all active video testimonials for home page
 * Uses cached version for better performance
 */
export const getActiveTestimonials = actionClient
  .metadata({ actionName: "get-active-testimonials" })
  .action(async () => {
    // Use cached version
    return await getCachedActiveTestimonials(6);
  });
