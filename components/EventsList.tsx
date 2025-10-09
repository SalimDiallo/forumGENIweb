'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationEventForm';
import { EventsType } from '@/app/(sections)/events/events.query';

const EventsList = ({ events }: { events: EventsType }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [search, setSearch] = useState('');

  // Filtrer les événements à venir
  const upcomingEvents = events
    .filter(event => new Date(event.startDate) > new Date())
    .map(event => ({
      id: event.slug,
      name: event.title,
      date: formatDate(new Date(event.startDate)),
      location: event.location || (event.isVirtual ? 'En ligne' : 'Lieu à préciser'),
      price: event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`,
      attendees: `${event.currentParticipants}${event.maxParticipants ? `/${event.maxParticipants}` : '+'}`,
      category: getEventTypeLabel(event.eventType),
      originalEvent: event
    }));

  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function getEventTypeLabel(eventType: string): string {
    const typeLabels: { [key: string]: string } = {
      forum: 'Forum',
      workshop: 'Workshop',
      conference: 'Conférence',
      networking: 'Networking',
      webinar: 'Webinaire',
      other: 'Autre'
    };
    return typeLabels[eventType] || 'Événement';
  }

  const filteredEvents = upcomingEvents.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase()) ||
    event.category.toLowerCase().includes(search.toLowerCase())
  );

  const selectedEventData = upcomingEvents.find(event => event.id === selectedEvent);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-0">
      {/* Hero Header */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-4 tracking-tight">
          Inscrivez-vous à un événement GENI
        </h1>
        <p className="text-lg md:text-xl text-emerald-800 mb-6 max-w-2xl">
          Découvrez nos événements à venir et réservez votre place en quelques clics.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow border border-emerald-100 text-emerald-700 text-sm font-medium">
          <Calendar className="w-4 h-4 mr-1" />
          {upcomingEvents.length} événement(s) à venir
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Event Selection */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-12 border border-emerald-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-1">
                Choisissez votre événement
              </h2>
              <p className="text-emerald-700 text-sm">Filtrez et sélectionnez un événement pour vous inscrire</p>
            </div>
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-72 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
            />
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-emerald-400">
              <Calendar className="w-20 h-20 mb-4" />
              <p className="text-xl font-semibold mb-2">Aucun événement à venir</p>
              <p className="text-base">Revenez bientôt pour découvrir nos prochains événements.</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-emerald-400">
              <p className="text-base">Aucun événement trouvé avec ces critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className={`group cursor-pointer border-2 rounded-xl p-5 transition-all duration-200 ${
                    selectedEvent === event.id
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-lg'
                      : 'border-emerald-100 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-semibold">{event.category}</span>
                    {selectedEvent === event.id && (
                      <CheckCircle size={20} className="text-emerald-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 group-hover:underline">{event.name}</h3>
                  <div className="flex items-center gap-2 text-emerald-700 text-sm mt-1">
                    <Calendar size={16} />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 text-sm">
                    <MapPin size={16} />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500 text-xs mt-2">
                    <Users size={14} />
                    {event.attendees} participants
                  </div>
                  <div className="mt-2 text-emerald-800 font-bold">{event.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulaire d'inscription */}
        {selectedEvent && (
          <div className="bg-white/95 rounded-2xl shadow-xl border border-emerald-100 mb-12">
            {/* Event Summary Header */}
            <div className="p-6 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-1 text-emerald-900">
                  Inscription - {selectedEventData?.name}
                </h3>
                <div className="flex items-center gap-6 text-emerald-700 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {selectedEventData?.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {selectedEventData?.location}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-700">{selectedEventData?.price}</div>
                <div className="text-emerald-500 text-xs">{selectedEventData?.attendees} participants</div>
              </div>
            </div>

            {/* Le formulaire d'inscription est maintenant entièrement géré dans RegistrationEventForm */}
            <div className="p-8">
              <RegistrationForm eventSlug={selectedEvent} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsList;