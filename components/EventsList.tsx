'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Grid3X3,
  List
} from 'lucide-react';
import { EventsType } from '@/app/(sections)/events/events.query';

type ViewMode = 'grid' | 'list';

const EventsList = ({ events }: { events: EventsType }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Helper to check if an event is upcoming
  function isEventUpcoming(event: any): boolean {
    return new Date(event.startDate) > new Date();
  }

  // Tous les événements (à venir et passés)
  const upcomingEvents = events
    .map(event => {
      const isPast = !isEventUpcoming(event);
      return {
        id: event.slug,
        name: event.title,
        date: formatDate(new Date(event.startDate)),
        location: event.location || (event.isVirtual ? 'En ligne' : 'Lieu à préciser'),
        price: event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`,
        category: getEventTypeLabel(event.eventType),
        categoryId: event.eventType,
        originalEvent: event,
        image: event.featuredImage,
        shortDescription: event.shortDescription,
        isVirtual: event.isVirtual,
        startDate: event.startDate,
        slug: event.slug,
        isPast
      };
    });

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

  // Catégories dynamiques basées sur les événements
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

  // Filtrage des événements
  const filteredEvents = useMemo(() => {
    let filtered = upcomingEvents;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(event => event.categoryId === activeCategory);
    }

    if (search) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [upcomingEvents, activeCategory, search]);

  // Composant carte en mode grille - Design Premium
  const GridEventCard = ({ event, index }: { event: typeof upcomingEvents[0], index: number }) => {
    const isPast = event.isPast;
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        className="h-full"
      >
        <Link href={`/events/${event.slug}`} className="block group h-full">
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-neutral-100">
            {/* Image Section - Plus grande */}
            <div className="relative h-64 md:h-72 overflow-hidden">
              {event.image ? (
                <>
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Calendar className="w-20 h-20 text-white/30" />
                </div>
              )}

              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top badges row */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {event.category}
                  </span>
                  {isPast && (
                    <span className="px-3 py-1.5 bg-neutral-800/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      Événement passé
                    </span>
                  )}
                </div>
                <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-emerald-700 text-sm font-bold rounded-full shadow-lg">
                  {event.price}
                </span>
              </div>

              {/* Bottom info on image */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                  {event.name}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Calendar size={14} className="flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 md:p-6 flex-1 flex flex-col">
              {event.shortDescription && (
                <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 flex-1">
                  {event.shortDescription}
                </p>
              )}

              {/* CTA Button */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {event.isVirtual && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
                        En ligne
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:text-emerald-700 transition-colors">
                    {isPast ? 'Voir les détails' : "S'inscrire"}
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Hover accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        </Link>
      </motion.div>
    );
  };

  // Composant carte en mode liste - Design Premium
  const ListEventCard = ({ event, index }: { event: typeof upcomingEvents[0], index: number }) => {
    const isPast = event.isPast;
    return (
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      >
        <Link href={`/events/${event.slug}`} className="block group">
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative w-full md:w-80 lg:w-96 h-56 md:h-64 flex-shrink-0 overflow-hidden">
                {event.image ? (
                  <>
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-t" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/30" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    {event.category}
                  </span>
                  {isPast && (
                    <span className="px-3 py-1.5 bg-neutral-800/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      Événement passé
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {event.name}
                    </h3>

                    {event.shortDescription && (
                      <p className="text-neutral-600 leading-relaxed mb-4 line-clamp-2">
                        {event.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <div className="px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <div className="text-xl font-bold text-emerald-700">{event.price}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Calendar size={16} className="text-emerald-600" />
                    </div>
                    <span className="font-medium">{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-600">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <MapPin size={16} className="text-emerald-600" />
                    </div>
                    <span className="font-medium line-clamp-1">{event.location}</span>
                  </div>

                  {event.isVirtual && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                      En ligne
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-neutral-400" />
                    <span className="text-sm text-neutral-500">Places disponibles</span>
                  </div>
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                    {isPast ? 'Voir les détails' : "S'inscrire maintenant"}
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Hover accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-16">

        {/* Barre de recherche et contrôles */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              />
            </div>

            {/* Mode d'affichage */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1 mx-auto lg:mx-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
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
                className={`p-2 rounded-md transition-colors ${
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

          {/* Filtres de catégories */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 sm:px-4 py-2  text-xs sm:text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Liste des événements */}
        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Calendar className="w-20 h-20 mb-4" />
            <p className="text-xl font-semibold mb-2 text-gray-600">Aucun événement disponible</p>
            <p className="text-base text-gray-500">Revenez bientôt pour découvrir nos événements</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500 mb-4 px-4">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {filteredEvents.map((event, index) => (
                  <GridEventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map((event, index) => (
                  <ListEventCard key={event.id} event={event} index={index} />
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
