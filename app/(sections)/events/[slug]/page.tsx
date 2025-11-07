import { notFound } from 'next/navigation';
import { getEventBySlug, getRelatedEvents } from './event-detail.query';
import EventDetailClient from './EventDetailClient';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getRelatedEvents(event.id, event.eventType);

  return <EventDetailClient event={event} relatedEvents={relatedEvents} />;
}
