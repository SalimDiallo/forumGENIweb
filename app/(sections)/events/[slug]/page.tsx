import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getEventBySlug, getRelatedEvents } from './event-detail.query';
import EventDetailClient from './EventDetailClient';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch event first (we need its data to get related events)
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Fetch related events in parallel with rendering
  const relatedEvents = await getRelatedEvents(event.id, event.eventType);

  return <EventDetailClient event={event} relatedEvents={relatedEvents} />;
}
