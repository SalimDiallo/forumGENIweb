'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  ChevronRight,
  Tag,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Video,
  Award,
  Star,
  Sparkles,
  ExternalLink,
  Share2,
  X
} from 'lucide-react';
import { EventDetailType, RelatedEventsType } from './event-detail.query';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButton from '@/components/ui/ShareButton';
import SponsorsGrid from '@/components/SponsorsGrid';
import EventGallerySection from './EventGallerySection';

interface Props {
  event: NonNullable<EventDetailType>;
  relatedEvents: RelatedEventsType;
}

const EventDetailClient = ({ event, relatedEvents }: Props) => {
  // States
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  // Calculs
  const isPast = new Date(event.endDate) < new Date();
  const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
  const isFull = event.maxParticipants ? event.currentParticipants >= event.maxParticipants : false;

  // Countdown effect
  useEffect(() => {
    if (isPast) return;

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(event.startDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event.startDate, isPast]);

  // Scroll effect for sticky CTA
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse sponsors
  const sponsors = React.useMemo(() => {
    if (!event.sponsors) return [];
    try {
      const parsed = JSON.parse(event.sponsors);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [event.sponsors]);

  // Helpers
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
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
      workshop: 'Atelier',
      conference: 'Conférence',
      networking: 'Networking',
      webinar: 'Webinaire',
      other: 'Événement'
    };
    return typeLabels[eventType] || 'Événement';
  };

  // Get main image
  const mainImage = event.images?.find(img => img.isCover)?.url || event.images?.[0]?.url || event.featuredImage;

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION - Full Width with Overlay */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-end pt-24 pb-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          {mainImage ? (
            <img
              src={mainImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-950" />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/events"
                className="flex items-center gap-2 text-white/90 hover:text-white font-medium group backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full transition-all hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Retour</span>
              </Link>

              <ShareButton
                title={event.title}
                description={event.shortDescription || ''}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-5 py-2 bg-emerald-500 text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-lg">
                {getEventTypeLabel(event.eventType)}
              </span>
              {isPast && (
                <span className="px-5 py-2 bg-gray-600 text-white text-sm font-bold uppercase tracking-wider rounded-full">
                  Terminé
                </span>
              )}
              {isOngoing && (
                <span className="px-5 py-2 bg-orange-500 text-white text-sm font-bold uppercase tracking-wider rounded-full animate-pulse">
                  En cours
                </span>
              )}
              {event.isFeatured && (
                <span className="px-5 py-2 bg-amber-500 text-white text-sm font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" /> À la une
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              {event.title}
            </h1>

            {/* Short Description */}
            {event.shortDescription && (
              <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed max-w-3xl">
                {event.shortDescription}
              </p>
            )}

            {/* Key Info Pills */}
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">{formatTime(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl">
                {event.isVirtual ? (
                  <>
                    <Video className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium">En ligne</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium">{event.location || 'Lieu à confirmer'}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl">
                <Tag className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">{event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronRight className="w-8 h-8 rotate-90" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* COUNTDOWN SECTION - For Upcoming Events */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {!isPast && !isOngoing && (
        <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <h3 className="text-white text-xl font-semibold">L'événement commence dans :</h3>
              <div className="flex gap-4">
                {[
                  { value: countdown.days, label: 'Jours' },
                  { value: countdown.hours, label: 'Heures' },
                  { value: countdown.minutes, label: 'Minutes' },
                  { value: countdown.seconds, label: 'Secondes' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px] text-center">
                    <div className="text-3xl md:text-4xl font-black text-white">{item.value.toString().padStart(2, '0')}</div>
                    <div className="text-white/80 text-xs uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-16">

                {/* Description */}
                {event.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-1 h-8 bg-emerald-500 rounded-full" />
                      À propos de l'événement
                    </h2>
                    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed">
                      <MarkdownRenderer content={event.description} />
                    </div>
                  </motion.div>
                )}

                {/* Programme */}
                {event.agenda && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-1 h-8 bg-emerald-500 rounded-full" />
                      Programme
                    </h2>
                    <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-8">
                      <MarkdownRenderer content={event.agenda} />
                    </div>
                  </motion.div>
                )}

                {/* Intervenants */}
                {event.speakers && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-1 h-8 bg-emerald-500 rounded-full" />
                      Intervenants
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <MarkdownRenderer content={event.speakers} />
                    </div>
                  </motion.div>
                )}

                {/* Infos pratiques */}
                {(event.requirements || event.whatToBring) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-1 h-8 bg-emerald-500 rounded-full" />
                      Informations pratiques
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {event.requirements && (
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Prérequis
                          </h3>
                          <div className="prose prose-sm max-w-none text-gray-700">
                            <MarkdownRenderer content={event.requirements} />
                          </div>
                        </div>
                      )}
                      {event.whatToBring && (
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-emerald-500" />
                            À apporter
                          </h3>
                          <div className="prose prose-sm max-w-none text-gray-700">
                            <MarkdownRenderer content={event.whatToBring} />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Images Gallery */}
                {event.images && event.images.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="w-1 h-8 bg-emerald-500 rounded-full" />
                      Galerie photos
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.images.map((img, index) => (
                        <div
                          key={img.id}
                          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                          onClick={() => setLightboxImage(img.url)}
                        >
                          <img
                            src={img.url}
                            alt={`${event.title} - ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-white font-medium">Agrandir</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Video Gallery */}
                {(event.videos && event.videos.length > 0) || (event.photos && event.photos.length > 0) ? (
                  <EventGallerySection
                    videos={event.videos || []}
                    photos={event.photos || []}
                    eventTitle={event.title}
                  />
                ) : null}
              </div>

              {/* Right Column - Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">

                  {/* Registration Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {isPast ? 'Événement terminé' : 'Inscription'}
                    </h3>

                    {isPast ? (
                      <div className="bg-gray-100 rounded-xl p-4 text-center">
                        <p className="text-gray-600">Cet événement est terminé.</p>
                      </div>
                    ) : isFull ? (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                        <p className="text-red-700 font-semibold">Complet</p>
                        <p className="text-red-600 text-sm">{event.maxParticipants} participants max</p>
                      </div>
                    ) : event?.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <span className="flex items-center justify-center gap-2">
                          S'inscrire maintenant
                          <ExternalLink className="w-5 h-5" />
                        </span>
                      </a>
                    ) : (
                      <div className="bg-gray-100 rounded-xl p-4 text-center">
                        <p className="text-gray-600 text-sm">Inscription bientôt disponible</p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Prix</span>
                        <span className="text-2xl font-black text-emerald-600">
                          {event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Organizer */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">Organisateur</h4>
                    <p className="text-lg font-bold text-gray-900">{event.organizerName}</p>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(event.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-500">Horaire</p>
                        <p className="font-semibold text-gray-900">{formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-500">Lieu</p>
                        <p className="font-semibold text-gray-900">
                          {event.isVirtual ? 'En ligne' : event.location || 'À confirmer'}
                        </p>
                      </div>
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-sm text-gray-500">Places</p>
                          <p className="font-semibold text-gray-900">
                            {event.currentParticipants}/{event.maxParticipants}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SPONSORS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {sponsors.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 mb-4">
                  <Award className="w-8 h-8 text-emerald-600" />
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos Partenaires</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Un grand merci à nos partenaires qui rendent cet événement possible
                </p>
              </motion.div>
            </div>
            <SponsorsGrid sponsors={sponsors} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RELATED EVENTS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {relatedEvents.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Événements similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedEvents.map((related) => (
                <Link
                  key={related.id}
                  href={`/events/${related.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    {related.featuredImage ? (
                      <img
                        src={related.featuredImage}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-emerald-600 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold uppercase rounded-full">
                        {getEventTypeLabel(related.eventType)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(related.startDate)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FLOATING CTA (Mobile) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isScrolled && !isPast && event?.registrationLink && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 p-4 shadow-2xl"
          >
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-center"
            >
              S'inscrire maintenant
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LIGHTBOX MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-10 h-10" />
            </button>

            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={lightboxImage}
              alt={event.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {event.images && event.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {event.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setLightboxImage(img.url); }}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${lightboxImage === img.url
                      ? 'border-emerald-500 scale-110'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetailClient;
