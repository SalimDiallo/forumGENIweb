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
        image="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1920&q=80"
        badge="Forum & Événements"
      />
      <EventsList events={events} />
    </main>
  );
}