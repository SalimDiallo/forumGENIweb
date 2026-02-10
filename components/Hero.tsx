// components/Hero.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Configuration des slides du Hero - simplifié et professionnel
const heroSlides = [
  {
    id: 1,
    badge: "21ème Édition",
    title: "FORUM GENI",
    subtitle: "Entreprises",
    tagline: "Le rendez-vous annuel de l'excellence",
    description: "Connecter les talents de demain aux opportunités d'aujourd'hui. Le plus grand événement de rencontre entreprises-étudiants organisé par l'INSEA.",
    cta: { text: "Découvrir le Forum 2025", href: "/events" },
    backgroundImage: "/insea-building.jpg",
  },
  {
    id: 2,
    badge: "Opportunités",
    title: "CARRIÈRES",
    subtitle: "& Emplois",
    tagline: "Votre avenir commence ici",
    description: "Accédez aux meilleures opportunités professionnelles. Stages, CDI et offres exclusives de nos entreprises partenaires.",
    cta: { text: "Explorer les offres", href: "/careers" },
    backgroundImage: "/insea-building.jpg",
  },
  {
    id: 3,
    badge: "Actualités",
    title: "INSIGHTS",
    subtitle: "& Tendances",
    tagline: "Restez informés",
    description: "Découvrez les dernières actualités, conseils carrière et analyses du marché par nos experts.",
    cta: { text: "Lire nos articles", href: "/blog" },
    backgroundImage: "/insea-building.jpg",
  }
];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.1]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Vidéo très lente pour effet cinématique
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-neutral-950 pt-32 sm:pt-32">
      {/* Background avec vidéo/image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
          poster={currentHero.backgroundImage}
          onPlay={() => setIsVideoPlaying(true)}
          onError={() => setIsVideoPlaying(false)}
          onStalled={() => setIsVideoPlaying(false)}
        >
          <source src="/hero.mp4" />
        </video>

        {/* Fallback image when video is not playing */}
        {!isVideoPlaying && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentHero.backgroundImage})` }}
          />
        )}

        {/* Overlays professionnels - tons neutres */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/60 to-neutral-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/40 via-transparent to-neutral-950/40" />
        
        {/* Texture subtile */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </motion.div>

      {/* Contenu principal */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 z-10 relative"
        style={{ opacity }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Badge minimaliste */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-white/60">
                  <span className="w-8 h-px bg-white/40" />
                  {currentHero.badge}
                  <span className="w-8 h-px bg-white/40" />
                </span>
              </motion.div>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-10 flex justify-center"
              >
                <div className="p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
                  <Image
                    src="/logo 4.png"
                    alt="Forum GENI Entreprises"
                    width={100}
                    height={100}
                    className="h-16 w-auto sm:h-20"
                    priority
                  />
                </div>
              </motion.div>

              {/* Titre principal - typographie élégante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none">
                  {currentHero.title}
                </h1>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-light text-white/80 mt-2">
                  {currentHero.subtitle}
                </span>
              </motion.div>

              {/* GENI × INSEA en vert avec effet lumineux */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="mb-6"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide">
                  <span className="text-emerald-400">
                    GENI
                  </span>
                  <span className="text-white/60 mx-3">×</span>
                  <span className="text-emerald-400">
                    INSEA
                  </span>
                </span>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-white font-bold tracking-wide mb-4"
              >
                {currentHero.tagline}
              </motion.p>


              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg text-white max-w-2xl mx-auto mb-8 leading-relaxed font-light"
              >
                {currentHero.description}
              </motion.p>

              {/* CTA Buttons - style minimal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href={currentHero.cta.href}>
                  <motion.button
                    className="group px-6 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* <Calendar className="w-5 h-5" /> */}
                    <span>{currentHero.cta.text}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <Link href="/about">
                  <motion.button
                    className="group px-6 py-3 bg-transparent border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      
   

    </section>
  );
};

export default Hero;