// app/events/page.tsx
import EventRegistration from '@/components/EventRegistration';
import { prisma } from '@/lib/db';
import { getEvents } from './events.query';



export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main>
      <EventRegistration events={events} />
    </main>
  );
}