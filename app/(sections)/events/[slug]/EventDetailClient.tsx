'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Bookmark,
  ChevronRight,
  Tag,
  Globe,
  DollarSign,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Video,
  Award,
  Star,
  Sparkles
} from 'lucide-react';
// RegistrationForm import supprimé
import { EventDetailType, RelatedEventsType } from './event-detail.query';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButton from '@/components/ui/ShareButton';
import SponsorsGrid from '@/components/SponsorsGrid';

interface Props {
  event: NonNullable<EventDetailType>;
  relatedEvents: RelatedEventsType;
}

const EventDetailClient = ({ event, relatedEvents }: Props) => {

  // Calcul si l'événement est passé
  const isPast = new Date(event.endDate) < new Date();

  // Parser les sponsors depuis le JSON
  const sponsors = React.useMemo(() => {
    if (!event.sponsors) return [];
    try {
      const parsed = JSON.parse(event.sponsors);
      // Si c'est déjà un tableau, le retourner
      if (Array.isArray(parsed)) return parsed;
      // Sinon, retourner un tableau vide
      return [];
    } catch {
      // Si ce n'est pas du JSON valide, retourner un tableau vide
      return [];
    }
  }, [event.sponsors]);
  // const isRegistrationOpen = event.registrationStart && event.registrationEnd
  //   ? new Date() >= new Date(event.registrationStart) && new Date() <= new Date(event.registrationEnd)
  //   : !isPast;
  const isRegistrationOpen = true;
  const isFull = event.maxParticipants ? event.currentParticipants >= event.maxParticipants : false;

  // Helper functions
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeLabel = (eventType: string): string => {
    const typeLabels: { [key: string]: string } = {
      forum: 'Forum',
      workshop: 'Workshop',
      conference: 'Conférence',
      networking: 'Networking',
      webinar: 'Webinaire',
      other: 'Autre'
    };
    return typeLabels[eventType] || 'Événement';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* Barre de navigation supérieure */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="pt-6 bg-white/80 backdrop-blur-lg border-b border-emerald-100/50"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/events" className="flex items-center gap-2 text-emerald-800 hover:text-emerald-900 font-semibold group">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Retour aux événements</span>
            </Link>

            <div className="flex items-center gap-3">
              <ShareButton
                title={event.title}
                description={event.shortDescription || ''}
                size="md"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-700">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/events" className="hover:text-emerald-700">Événements</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-emerald-700 font-medium">{getEventTypeLabel(event.eventType)}</span>
        </div>
      </div>

      {/* En-tête de l'événement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Statut et catégorie */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-sm font-semibold  ">
              {getEventTypeLabel(event.eventType)}
            </span>
            {isPast && (
              <span className="px-4 py-1.5 bg-gray-600 text-white text-sm font-semibold ">
                Événement passé
              </span>
            )}
            {isFull && !isPast && (
              <span className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold ">
                Complet
              </span>
            )}
            {event.isFeatured && (
              <span className="px-4 py-1.5 bg-amber-500 text-white text-sm font-semibold ">
                À la une
              </span>
            )}
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl md:text-5xl font-bold text-emerald-900 mb-4 leading-tight">
            {event.title}
          </h1>

          {/* Description courte */}
          {event.shortDescription && (
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {event.shortDescription}
            </p>
          )}

          {/* Informations clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6 border-b border-emerald-100">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg ">
              <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="font-semibold text-gray-900">{formatDate(event.startDate)}</div>
                <div className="text-sm text-gray-600">{formatTime(event.startDate)} - {formatTime(event.endDate)}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-lg ">
              <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 mb-1">Lieu</div>
                <div className="font-semibold text-gray-900">
                  {event.isVirtual ? (
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      En ligne
                    </div>
                  ) : (
                    event.location || 'À préciser'
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-lg ">
              <Tag className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-500 mb-1">Tarif</div>
                <div className="font-semibold text-gray-900">
                  {event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image principale */}
      {event.featuredImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="container mx-auto px-4 mb-12"
        >
          <div className="max-w-6xl mx-auto">
            <img
              src={event.featuredImage}
              alt={event.title}
              className="w-full h-[400px] md:h-[600px] object-cover  l"
            />
          </div>
        </motion.div>
      )}

      {/* Sponsors - Mise en avant */}
      {sponsors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="container mx-auto px-4 mb-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-2 border-emerald-200 rounded-xl p-8 md:p-12 shadow-xl overflow-hidden">
              {/* Éléments décoratifs de fond */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

              {/* Contenu */}
              <div className="relative z-10">
                {/* En-tête avec icône */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full shadow-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-3 flex items-center justify-center gap-2">
                    Nos Partenaires & Sponsors
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-gray-600 max-w-2xl mx-auto">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <p className="text-base md:text-lg">
                      Un grand merci à nos partenaires qui rendent cet événement possible
                    </p>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  {/* Ligne décorative */}
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-emerald-300"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-emerald-300"></div>
                  </div>
                </div>

                {/* Grille des sponsors avec effet hover */}
                <div>
                  <SponsorsGrid sponsors={sponsors} />
                </div>

                {/* Badge "Merci" */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full shadow-md">
                    <span className="text-emerald-800 font-semibold text-sm">Ensemble, nous créons l'excellence</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contenu principal - 2 colonnes sur desktop */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale - Description et détails */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {event.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white   p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    À propos de l'événement
                  </h2>
                  <div className="prose prose-lg max-w-none prose-headings:text-emerald-900 prose-p:text-gray-700">
                   <MarkdownRenderer content={event.description} />
                  </div>
                </motion.div>
              )}

              {/* Programme / Agenda */}
              {event.agenda && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white   p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Programme
                  </h2>
                  <div className="space-y-4">
                  <MarkdownRenderer content={event.agenda ?? ""} />
                  </div>
                </motion.div>
              )}

              {/* Intervenants */}
              {event.speakers && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white   p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                    <UserCheck className="w-6 h-6" />
                    Intervenants
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <MarkdownRenderer content={event.speakers} />
                  </div>
                </motion.div>
              )}

              {/* Prérequis et à apporter */}
              {(event.requirements || event.whatToBring) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white   p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    Informations pratiques
                  </h2>
                  <div className="space-y-4">
                    {event.requirements && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Prérequis</h3>
                        <p className="text-gray-700 whitespace-pre-line">{event.requirements}</p>
                      </div>
                    )}
                    {event.whatToBring && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">À apporter</h3>
                        <p className="text-gray-700 whitespace-pre-line">{event.whatToBring}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Colonne latérale - Lien d'inscription */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24"
              >
                <div className="bg-white   p-6">
                  <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                    {isPast ? 'Événement terminé' : 'Inscription'}
                  </h2>

                  {isPast ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 text-sm">
                          Cet événement est terminé. Les inscriptions ne sont plus disponibles.
                        </p>
                      </div>
                    </div>
                  ) : isFull ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 font-medium mb-2">Événement complet</p>
                      <p className="text-red-600 text-sm">
                        Le nombre maximum de participants ({event.maxParticipants}) a été atteint.
                      </p>
                    </div>
                  ) : !isRegistrationOpen ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-amber-700 font-medium mb-2">Inscriptions fermées</p>
                      <p className="text-amber-600 text-sm">
                        Les inscriptions ne sont pas encore ouvertes ou sont déjà closes.
                      </p>
                    </div>
                  ) : event?.registrationLink ? (
                    <a
                      href={event.registrationLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-6  transition-all duration-150 text-lg shadow-sm hover:shadow md:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      S'inscrire à l'événement
                    </a>
                  ) : (
                    <div className="border border-gray-200 bg-white rounded-lg p-4">
                      <p className="text-gray-600 text-sm text-center">
                        Aucun lien d'inscription n'est disponible pour cet événement.
                      </p>
                    </div>
                  )}
                </div>

                {/* Organisateur */}
                <div className="bg-white   p-6 mt-6">
                  <h3 className="text-lg font-bold text-emerald-900 mb-4">Organisateur</h3>
                  <p className="text-gray-700 font-medium">{event.organizerName}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Événements connexes */}
      {relatedEvents.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">Événements similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map((related, index) => (
                  <Link
                    key={related.id}
                    href={`/events/${related.slug}`}
                    className="group bg-white  overflow-hidden  hover: transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200">
                      {related.featuredImage ? (
                        <img
                          src={related.featuredImage}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-emerald-600 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-emerald-700 text-white text-xs font-semibold ">
                          {getEventTypeLabel(related.eventType)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 text-emerald-800 px-3 py-1  text-xs font-bold">
                        {related.isFree ? 'Gratuit' : `${related.price} ${related.currency}`}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-emerald-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(related.startDate)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailClient;
