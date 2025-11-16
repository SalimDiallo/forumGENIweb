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

  // Composant carte en mode grille
  const GridEventCard = ({ event, index }: { event: typeof upcomingEvents[0], index: number }) => {
    const isPast = event.isPast;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link href={`/events/${event.slug}`} className="block group">
          <div className="bg-white  overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-emerald-600 opacity-50" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <div className="bg-emerald-700 text-white px-3 py-1  text-xs font-semibold">
                  {event.category}
                </div>
                {isPast && (
                  <div className="bg-gray-600 text-white px-3 py-1  text-xs font-semibold">
                    Passé
                  </div>
                )}
              </div>

              {/* Badge prix */}
              <div className="absolute top-3 right-3 bg-white/95 text-emerald-800 px-3 py-1  text-xs font-bold">
                {event.price}
              </div>
            </div>

            {/* Contenu */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {event.name}
              </h3>

              {event.shortDescription && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.shortDescription}
                </p>
              )}

              <div className="space-y-2 mt-auto">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Calendar size={16} className="text-emerald-600 flex-shrink-0" />
                  <span className="line-clamp-1">{event.date}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <MapPin size={16} className="text-emerald-600 flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                 
                  <span className="text-emerald-700 font-semibold text-sm hover:text-emerald-800 transition-colors">
                    {isPast ? 'Voir détails →' : 'S\'inscrire →'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  // Composant carte en mode liste
  const ListEventCard = ({ event, index }: { event: typeof upcomingEvents[0], index: number }) => {
    const isPast = event.isPast;
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link href={`/events/${event.slug}`} className="block group">
          <div className="bg-white  overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-64 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-emerald-600 opacity-50" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  <div className="bg-emerald-700 text-white px-2 py-1  text-xs font-semibold">
                    {event.category}
                  </div>
                  {isPast && (
                    <div className="bg-gray-600 text-white px-2 py-1  text-xs font-semibold">
                      Passé
                    </div>
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {event.name}
                    </h3>

                    {event.shortDescription && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-lg text-center">
                      <div className="text-lg font-bold">{event.price}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Calendar size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <MapPin size={16} className="text-emerald-600 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                 
                  <span className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-semibold text-sm">
                    {isPast ? 'Voir détails' : 'S\'inscrire'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* En-tête */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Événements
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Découvrez nos événements passés et à venir, réservez votre place en quelques clics
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white  shadow-sm border border-gray-200 text-gray-700 text-sm font-medium mt-4">
            <Calendar className="w-4 h-4 text-emerald-600" />
            {upcomingEvents.length} événement(s) • {upcomingEvents.filter(e => !e.isPast).length} à venir • {upcomingEvents.filter(e => e.isPast).length} passé(s)
          </div>
        </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredEvents.map((event, index) => (
                  <GridEventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
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
