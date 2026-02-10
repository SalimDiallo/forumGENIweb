'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Search,
  Grid3X3,
  List,
  X,
} from 'lucide-react';
import { EventsType } from '@/app/(sections)/events/events.query';

type ViewMode = 'grid' | 'list';

const EventsList = ({ events }: { events: EventsType }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  function isEventUpcoming(event: any): boolean {
    return new Date(event.startDate) > new Date();
  }

  const upcomingEvents = useMemo(() =>
    events.map(event => {
      const isPast = !isEventUpcoming(event);
      return {
        id: event.slug,
        name: event.title,
        date: formatDate(new Date(event.startDate)),
        location: event.location || (event.isVirtual ? 'En ligne' : 'Lieu à préciser'),
        price: event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`,
        category: getEventTypeLabel(event.eventType),
        categoryId: event.eventType,
        image: event.featuredImage,
        shortDescription: event.shortDescription,
        isVirtual: event.isVirtual,
        startDate: event.startDate,
        slug: event.slug,
        isPast
      };
    }), [events]);

  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function getEventTypeLabel(eventType: string): string {
    const typeLabels: { [key: string]: string } = {
      forum: 'Forum',
      workshop: 'Atelier',
      conference: 'Conférence',
      networking: 'Réseautage',
      webinar: 'Webinaire',
      other: 'Autre'
    };
    return typeLabels[eventType] || 'Événement';
  }

  const categories = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {};
    upcomingEvents.forEach(event => {
      categoryCounts[event.categoryId] = (categoryCounts[event.categoryId] || 0) + 1;
    });

    const categoryList = [
      { id: 'all', name: 'Tout', count: upcomingEvents.length }
    ];

    Object.entries(categoryCounts).forEach(([id, count]) => {
      categoryList.push({
        id,
        name: getEventTypeLabel(id),
        count
      });
    });

    return categoryList;
  }, [upcomingEvents]);

  const filteredEvents = useMemo(() => {
    let filtered = upcomingEvents;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(event => event.categoryId === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [upcomingEvents, activeCategory, search]);

  const GridEventCard = ({ event }: { event: typeof upcomingEvents[0] }) => {
    const isPast = event.isPast;
    return (
      <div className="h-full">
        <Link href={`/events/${event.slug}`} className="block group h-full">
          <div className="relative bg-white rounded-xl overflow-hidden border border-neutral-200 h-full flex flex-col transition-all duration-200 hover:border-emerald-600">
            <div className="relative h-56 md:h-64 overflow-hidden bg-neutral-100">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                  <Calendar className="w-12 h-12 text-neutral-400" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 bg-neutral-100 text-emerald-700 text-xs font-medium rounded">{event.category}</span>
              </div>
              {isPast && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-neutral-50 text-neutral-500 text-xs rounded">Passé</span>
              )}
            </div>
            <div className="flex-1 flex flex-col px-4 py-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">{event.name}</h3>
              <div className="flex flex-wrap items-center gap-4 text-neutral-600 text-sm mb-2">
                <div className="flex items-center gap-1">
                  <Calendar size={15} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={15} />
                  <span>{event.location}</span>
                </div>
                {event.isVirtual && <span className="ml-2 text-xs text-blue-600 border border-blue-100 rounded px-1">En ligne</span>}
              </div>
              {event.shortDescription && (
                <p className="text-neutral-500 text-sm line-clamp-2">{event.shortDescription}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="text-base font-medium text-emerald-600">{event.price}</span>
                <span className="text-sm text-emerald-700 underline group-hover:font-semibold transition-colors">{isPast ? 'Détails' : "S'inscrire"}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const ListEventCard = ({ event }: { event: typeof upcomingEvents[0] }) => {
    const isPast = event.isPast;
    return (
      <div>
        <Link href={`/events/${event.slug}`} className="block group">
          <div className="relative bg-white rounded-xl border border-neutral-200 flex flex-col md:flex-row overflow-hidden hover:border-emerald-600 transition">
            <div className="relative w-full md:w-64 h-40 md:h-auto flex-shrink-0 bg-neutral-100">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-neutral-400" />
                </div>
              )}
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-neutral-100 text-emerald-700 rounded text-xs">{event.category}</span>
                  {isPast && (
                    <span className="text-xs text-neutral-500">• Passé</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">{event.name}</h3>
                <div className="flex flex-wrap items-center gap-4 text-neutral-600 text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                  {event.isVirtual && <span className="ml-2 text-xs text-blue-600 border border-blue-100 rounded px-1">En ligne</span>}
                </div>
                {event.shortDescription && (
                  <p className="text-neutral-500 text-sm line-clamp-2">{event.shortDescription}</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-base font-medium text-emerald-600">{event.price}</span>
                <span className="text-sm text-emerald-700 underline group-hover:font-semibold transition-colors">{isPast ? 'Détails' : "S'inscrire"}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-16">
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex bg-white rounded-md border border-gray-200 p-1 mx-auto lg:mx-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-emerald-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Vue grille"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-emerald-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Vue liste"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 sm:px-4 py-1 text-xs font-medium rounded border transition-colors ${
                    activeCategory === category.id
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Calendar className="w-14 h-14 mb-4" />
            <p className="text-xl font-semibold mb-2 text-gray-600">Aucun événement disponible</p>
            <p className="text-base text-gray-500">Revenez bientôt pour découvrir nos événements</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Aucun événement trouvé</h3>
            <p className="text-gray-500 mb-4 px-4 text-sm">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {filteredEvents.map((event) => (
                  <GridEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {filteredEvents.map((event) => (
                  <ListEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventsList;
