'use client';

import React, { useState, useRef } from 'react';
import { Play, Quote, Users, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/services/youtube';

type TestimonialData = {
  id: number;
  name: string;
  position: string | null;
  company: string | null;
  graduationYear: number | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  quote: string | null;
  fullTranscript: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

type VideoTestimonialsProps = {
  testimonials: TestimonialData[];
};

const VideoTestimonials = ({ testimonials }: VideoTestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Transform database testimonials to display format
  const displayTestimonials = testimonials.map(testimonial => {
    const embedUrl = getYouTubeEmbedUrl(testimonial.videoUrl);
    const thumbnail = testimonial.thumbnailUrl || getYouTubeThumbnailUrl(testimonial.videoUrl, 'hqdefault');

    return {
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.position || 'Membre',
      company: testimonial.company || '',
      video: testimonial.videoUrl,
      embedUrl: embedUrl,
      thumbnail: thumbnail || '/testimonials/default-thumb.jpg',
      quote: testimonial.quote || 'Une expérience formidable avec l\'association GENI.',
      year: testimonial.graduationYear ? `Promo ${testimonial.graduationYear}` : '',
      achievement: testimonial.isFeatured ? 'Témoignage vedette' : 'Membre actif',
    };
  });

  const nextTestimonial = () => {
    setCurrentIndex((prev) => 
      prev < displayTestimonials.length - 1 ? prev + 1 : 0
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => 
      prev > 0 ? prev - 1 : displayTestimonials.length - 1
    );
  };

  // Calculate visible items (show 3 at a time on desktop)
  const getVisibleTestimonials = () => {
    const result = [];
    const total = displayTestimonials.length;
    
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + total) % total;
      result.push({
        ...displayTestimonials[index],
        position: i, // -1: left, 0: center, 1: right
      });
    }
    return result;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-600 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Users className="text-emerald-400" size={20} />
            <span className="text-white font-medium">Témoignages</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Ce que disent nos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600"> Membres & Partenaires</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Découvrez les témoignages de ceux qui ont vécu l'expérience GENI
          </p>
        </div>
      </div>

      {/* Carousel Container - Full Width (outside container) */}
      <div className="relative w-full">
        {/* Blur Overlay Left */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 lg:w-48 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-20 pointer-events-none" />
        
        {/* Blur Overlay Right */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 lg:w-48 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-20 pointer-events-none" />

        {/* Navigation Arrow Left */}
        <motion.button
          onClick={prevTestimonial}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full p-3 md:p-4 transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="text-white w-5 h-5 md:w-6 md:h-6 group-hover:text-emerald-400 transition-colors" />
        </motion.button>

        {/* Navigation Arrow Right */}
        <motion.button
          onClick={nextTestimonial}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full p-3 md:p-4 transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="text-white w-5 h-5 md:w-6 md:h-6 group-hover:text-emerald-400 transition-colors" />
        </motion.button>

          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="flex items-center justify-center gap-4 md:gap-6 py-8 px-16 md:px-24"
          >
            <AnimatePresence mode="popLayout">
              {visibleTestimonials.map((testimonial, idx) => {
                const isCenter = testimonial.position === 0;
                
                return (
                  <motion.div
                    key={`${testimonial.id}-${testimonial.position}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isCenter ? 1 : 0.5,
                      scale: isCenter ? 1 : 0.85,
                      zIndex: isCenter ? 10 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`flex-shrink-0 w-72 md:w-80 lg:w-96 ${
                      isCenter ? 'cursor-pointer' : 'cursor-default pointer-events-none md:pointer-events-auto'
                    }`}
                    onClick={() => isCenter && setPlayingVideo(testimonial.id)}
                  >
                  <div className={`bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isCenter 
                      ? 'border-emerald-500/30 shadow-lg' 
                      : 'border-white/5'
                  }`}>
                      {/* Video Thumbnail */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative">
                          <img
                            src={testimonial.thumbnail}
                            alt={testimonial.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          {/* Play overlay */}
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
                            isCenter ? 'group-hover:bg-black/50' : ''
                          }`}>
                            <motion.div 
                              className={`bg-white/20 backdrop-blur-sm rounded-full p-4 ${
                                isCenter ? 'hover:bg-white/30 hover:scale-110' : ''
                              } transition-all duration-300`}
                              whileHover={isCenter ? { scale: 1.1 } : {}}
                            >
                              <Play className="text-white w-6 h-6 md:w-8 md:h-8" fill="white" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Achievement Badge */}
                        {isCenter && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {testimonial.achievement}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <Quote className="text-emerald-500 flex-shrink-0 mt-1 w-4 h-4" />
                          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                            "{testimonial.quote}"
                          </p>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                          <h3 className="text-white font-bold text-lg">{testimonial.name}</h3>
                          {testimonial.role && (
                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                          )}
                          {testimonial.company && (
                            <p className="text-emerald-400 text-sm font-medium">{testimonial.company}</p>
                          )}
                          {testimonial.year && (
                            <span className="inline-block mt-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                              {testimonial.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-emerald-500'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

      {/* Video Modal */}
      <AnimatePresence>
        {playingVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setPlayingVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl"
            >
              {/* Close button */}
              <button
                onClick={() => setPlayingVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors"
              >
                <X size={32} />
              </button>

              {/* Video iframe */}
              <div
                className="relative aspect-video bg-black rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {displayTestimonials.find(t => t.id === playingVideo)?.embedUrl && (
                  <iframe
                    src={displayTestimonials.find(t => t.id === playingVideo)?.embedUrl || ''}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video info */}
              <div className="mt-4 text-white">
                <h3 className="text-xl font-bold">
                  {displayTestimonials.find(t => t.id === playingVideo)?.name}
                </h3>
                {(displayTestimonials.find(t => t.id === playingVideo)?.role ||
                  displayTestimonials.find(t => t.id === playingVideo)?.company) && (
                    <p className="text-gray-400">
                      {[
                        displayTestimonials.find(t => t.id === playingVideo)?.role,
                        displayTestimonials.find(t => t.id === playingVideo)?.company
                      ].filter(Boolean).join(' • ')}
                    </p>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoTestimonials;