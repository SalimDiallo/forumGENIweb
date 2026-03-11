'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import SponsorsGrid from '@/components/SponsorsGrid';
import ShareButton from '@/components/ui/ShareButton';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Users,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { EventDetailType, RelatedEventsType } from './event-detail.query';
import EventGallerySection from './EventGallerySection';

interface Props {
  event: NonNullable<EventDetailType>;
  relatedEvents: RelatedEventsType;
}

const EventDetailClient = ({ event, relatedEvents }: Props) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  // Main event status
  const isPast = new Date(event.endDate) < new Date();
  const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();
  const isFull = event.maxParticipants ? event.currentParticipants >= event.maxParticipants : false;

  // Countdown logic
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

  // Sticky CTA scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sponsors
  const sponsors = React.useMemo(() => {
    if (!event.sponsors) return [];
    try {
      const parsed = JSON.parse(event.sponsors);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [event.sponsors]);

  // Formatting
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
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

  // Main image logic
  let mainImage: string | undefined = undefined;
  if (event.images && Array.isArray(event.images) && event.images.length > 0) {
    const cover = event.images.find(img => img.isCover && img.url);
    mainImage = cover?.url || event.images[0]?.url;
  }
  if (!mainImage && event.featuredImage) {
    mainImage = event.featuredImage;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative min-h-[44vh] flex items-end pt-16 pb-6">
        {/* Image */}
        <div className="absolute inset-0">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={event.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/events"
                className="flex items-center gap-2 text-white/80 hover:text-white font-medium bg-black/30 px-3 py-1.5 rounded transition"
              >
                <ArrowLeft className="w-5 h-5" />
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
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-0.5 bg-emerald-700 text-white text-xs font-medium rounded-full">
                {getEventTypeLabel(event.eventType)}
              </span>
              {isPast && (
                <span className="px-3 py-0.5 bg-gray-400 text-white text-xs rounded-full">Terminé</span>
              )}
              {isOngoing && (
                <span className="px-3 py-0.5 bg-orange-500 text-white text-xs rounded-full">En cours</span>
              )}
              {event.isFeatured && (
                <span className="px-3 py-0.5 bg-yellow-600 text-white text-xs rounded-full">À la une</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{event.title}</h1>
            {event.shortDescription && (
              <p className="text-base text-white/90 mb-3 max-w-xl">{event.shortDescription}</p>
            )}
            <div className="flex flex-wrap gap-2 text-white text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                {event.isVirtual ? (
                  <span>En ligne</span>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>{event.location || 'Lieu à confirmer'}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span>{event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown */}
      {!isPast && !isOngoing && (
        <section className="bg-gray-50 py-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-5">
              <h3 className="text-gray-800 font-medium text-base">Début dans</h3>
              <div className="flex gap-2">
                {[
                  { value: countdown.days, label: 'J' },
                  { value: countdown.hours, label: 'H' },
                  { value: countdown.minutes, label: 'Min' },
                  { value: countdown.seconds, label: 'Sec' }
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded px-3 py-2 min-w-[40px] text-center">
                    <div className="text-lg font-semibold text-gray-900">{item.value.toString().padStart(2, '0')}</div>
                    <div className="text-gray-500 text-[10px] uppercase">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Left */}
              <div className="lg:col-span-2 space-y-10">
                {event.description && (
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      À propos
                    </h2>
                    <div className="prose max-w-none prose-p:text-gray-700 text-gray-800">
                      <MarkdownRenderer content={event.description} />
                    </div>
                  </section>
                )}

                {event.agenda && (
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Programme
                    </h2>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                      <MarkdownRenderer content={event.agenda} />
                    </div>
                  </section>
                )}

                {event.speakers && (
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Intervenants
                    </h2>
                    <div className="prose max-w-none prose-p:text-gray-700 text-gray-800">
                      <MarkdownRenderer content={event.speakers} />
                    </div>
                  </section>
                )}

                {(event.requirements || event.whatToBring) && (
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Infos pratiques
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {event.requirements && (
                        <div className="bg-white border border-gray-100 rounded-lg p-3">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm">Prérequis</h3>
                          <div className="prose prose-sm max-w-none text-gray-700">
                            <MarkdownRenderer content={event.requirements} />
                          </div>
                        </div>
                      )}
                      {event.whatToBring && (
                        <div className="bg-white border border-gray-100 rounded-lg p-3">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm">À apporter</h3>
                          <div className="prose prose-sm max-w-none text-gray-700">
                            <MarkdownRenderer content={event.whatToBring} />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {event.images && event.images.length > 1 && (
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Galerie photos
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {event.images.map((img, index) => (
                        <div
                          key={img.id}
                          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => setLightboxImage(img.url)}
                        >
                          <Image
                            src={img.url}
                            alt={`${event.title} - ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-all" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(event.videos && event.videos.length > 0) || (event.photos && event.photos.length > 0) ? (
                  <EventGallerySection
                    videos={event.videos || []}
                    photos={event.photos || []}
                    eventTitle={event.title}
                  />
                ) : null}
              </div>

              {/* Right */}
              <aside className="lg:col-span-1">
                <div className="sticky top-8 space-y-5">

                  {/* Registration Card */}
                  <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      {isPast ? 'Événement terminé' : 'Inscription'}
                    </h3>
                    {isPast ? (
                      <div className="bg-gray-100 rounded p-3 text-center">
                        <p className="text-gray-600 text-sm">Cet événement est terminé.</p>
                      </div>
                    ) : isFull ? (
                      <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
                        <p className="text-red-700 font-semibold text-base">Complet</p>
                        <p className="text-red-600 text-xs">{event.maxParticipants} participants max</p>
                      </div>
                    ) : event?.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 px-4 rounded text-center transition"
                      >
                        S&apos;inscrire
                        <ExternalLink className="inline-block w-4 h-4 ml-2 align-middle" />
                      </a>
                    ) : (
                      <div className="bg-gray-100 rounded p-3 text-center">
                        <p className="text-gray-600 text-xs">Inscription bientôt disponible</p>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Prix</span>
                        <span className="text-lg font-semibold text-emerald-700">
                          {event.isFree ? 'Gratuit' : `${event.price} ${event.currency}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="bg-white border border-gray-100 rounded-lg p-4">
                    <h4 className="text-xs text-gray-500 uppercase mb-1 tracking-wide">Organisateur</h4>
                    <p className="text-base font-medium text-gray-900">{event.organizerName}</p>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-white border border-gray-100 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{formatDate(event.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="text-xs text-gray-500">Horaire</p>
                        <p className="font-medium text-gray-900">{formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="text-xs text-gray-500">Lieu</p>
                        <p className="font-medium text-gray-900">
                          {event.isVirtual ? 'En ligne' : event.location || 'À confirmer'}
                        </p>
                      </div>
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-700" />
                        <div>
                          <p className="text-xs text-gray-500">Places</p>
                          <p className="font-medium text-gray-900">
                            {event.currentParticipants}/{event.maxParticipants}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Partenaires</h2>
            </div>
            <SponsorsGrid sponsors={sponsors} />
          </div>
        </section>
      )}

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Événements similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {relatedEvents.map((related) => (
                <Link
                  key={related.id}
                  href={`/events/${related.slug}`}
                  className="group bg-white rounded-lg overflow-hidden border hover:shadow-sm transition-all"
                >
                  <div className="relative h-32 overflow-hidden">
                    {related.featuredImage ? (
                      <Image
                        src={related.featuredImage}
                        alt={related.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-emerald-500 opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-emerald-700 text-white text-[11px] rounded">
                        {getEventTypeLabel(related.eventType)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">{related.title}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(related.startDate)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating CTA (Mobile) */}
      <AnimatePresence>
        {isScrolled && !isPast && event?.registrationLink && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 p-2.5 shadow"
          >
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-emerald-700 text-white font-medium py-2.5 px-4 rounded text-center"
            >
              S&apos;inscrire
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox modal */}
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
              className="absolute top-5 right-5 text-white/80 hover:text-white transition"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={lightboxImage}
              alt={event.title}
              className="max-w-full max-h-[88vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />

            {event.images && event.images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1">
                {event.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setLightboxImage(img.url); }}
                    className={`w-12 h-9 rounded overflow-hidden border transition-all ${
                      lightboxImage === img.url
                        ? 'border-emerald-500 scale-105'
                        : 'border-white/10 opacity-60 hover:opacity-100'
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
