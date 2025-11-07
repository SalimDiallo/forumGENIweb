// app/events/page.tsx
import { getEvents } from './events.query';
import EventsList from '@/components/EventsList';



export default async function EventsPage() {
  const events = await getEvents();
  

  return (
    <main>
      <EventsList events={events} />
    </main>
  );
}