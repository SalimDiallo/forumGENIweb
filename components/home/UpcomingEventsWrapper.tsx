// Server Component Wrapper for UpcomingEvents
import { getUpcomingEvents } from "@/app/actions/home-sections";
import UpcomingEvents from "@/components/UpcomingEvents";

export default async function UpcomingEventsWrapper() {
  const result = await getUpcomingEvents();

  // Fallback to empty array if no events found or if action failed
  const events = result?.data?.events || [];

  // Don't render section if no events available
  if (events.length === 0) {
    return null;
  }

  return <UpcomingEvents events={events} />;
}
