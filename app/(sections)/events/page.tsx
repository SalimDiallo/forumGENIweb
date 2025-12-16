// app/events/page.tsx
import { getEvents } from './events.query';
import EventsList from '@/components/EventsList';
import PageHero from '@/components/PageHero';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className=''>
      <PageHero
        title="Événements"
        subtitle="Découvrez nos forums, conférences et événements de networking"
        image="/event.jpg"
        badge="Forum & Événements"
      />
      <EventsList events={events} />
    </main>
  );
}