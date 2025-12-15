// components/Hero.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Users, Award, Building, Sparkles, Briefcase, GraduationCap, Rocket } from 'lucide-react';

// Configuration des 3 slides du Hero
const heroSlides = [
  {
    id: 1,
    badge: "Forum INSEA 2025",
    title: "FORUM",
    subtitle: "GENI × INSEA",
    year: "2025",
    description: "Le plus grand événement de rencontre entreprises-étudiants de l'INSEA.",
    highlight: "Conférences, ateliers et networking avec les leaders du marché",
    primaryCta: { text: "Découvrir le Forum 2025", href: "/events", icon: Calendar },
    secondaryCta: { text: "Voir tous les événements", href: "/events" },
    backgroundImage: "/insea-building.jpg",
    stats: [
      { icon: Calendar, title: "3-5 Mai 2025", subtitle: "Forum Annuel", color: "from-emerald-600 to-teal-500" },
      { icon: Users, title: "500+ Participants", subtitle: "Chaque année", color: "from-cyan-600 to-blue-500" },
      { icon: Building, title: "50+ Entreprises", subtitle: "Partenaires", color: "from-amber-600 to-orange-500" },
      { icon: Award, title: "Depuis 2002", subtitle: "Excellence", color: "from-purple-600 to-pink-500" },
    ]
  },
  {
    id: 2,
    badge: "Opportunités Carrière",
    title: "CARRIÈRES",
    subtitle: "Emplois & Stages",
    year: "2025",
    description: "Accédez aux meilleures opportunités professionnelles du Maroc.",
    highlight: "Stages, CDI et offres exclusives de nos entreprises partenaires",
    primaryCta: { text: "Explorer les offres", href: "/careers", icon: Briefcase },
    secondaryCta: { text: "Déposer votre candidature", href: "/careers" },
    backgroundImage: "/event.jpg",
    stats: [
      { icon: Briefcase, title: "100+ Offres", subtitle: "Disponibles", color: "from-emerald-600 to-teal-500" },
      { icon: Building, title: "50+ Entreprises", subtitle: "Recrutent", color: "from-cyan-600 to-blue-500" },
      { icon: Users, title: "Stages & CDI", subtitle: "Tous profils", color: "from-amber-600 to-orange-500" },
      { icon: Award, title: "Top Recruteurs", subtitle: "Maroc", color: "from-purple-600 to-pink-500" },
    ]
  },
  {
    id: 3,
    badge: "Actualités & Insights",
    title: "BLOG",
    subtitle: "Restez Informés",
    year: "2025",
    description: "Découvrez les dernières actualités, conseils carrière et tendances du marché.",
    highlight: "Articles, interviews et analyses par nos experts",
    primaryCta: { text: "Lire nos articles", href: "/blog", icon: Rocket },
    secondaryCta: { text: "Voir toutes les actualités", href: "/blog" },
    backgroundImage: "/insea-building.jpg",
    stats: [
      { icon: Rocket, title: "Nouveautés", subtitle: "Chaque semaine", color: "from-emerald-600 to-teal-500" },
      { icon: GraduationCap, title: "Conseils", subtitle: "Carrière", color: "from-cyan-600 to-blue-500" },
      { icon: Users, title: "Interviews", subtitle: "Exclusives", color: "from-amber-600 to-orange-500" },
      { icon: Award, title: "Tendances", subtitle: "Marché", color: "from-purple-600 to-pink-500" },
    ]
  }
];

// Couleurs toujours en vert (emerald)
const accentClasses = {
  gradient: "from-emerald-600 to-emerald-500",
  text: "text-emerald-400",
  border: "border-emerald-500/30",
  shadow: "shadow-emerald-500/20",
  bg: "from-emerald-900/20"
};

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Navigation entre les slides
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Autoplay du carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Change toutes les 6 secondes

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    setIsMounted(true);

    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative flex flex-col justify-end min-h-screen items-center overflow-hidden bg-black pt-24">
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
          className="absolute inset-0 w-full h-full object-cover"
          poster="/insea-building.jpg"
        >
          Utilisation d'une vidéo en ligne (par exemple, fichier sur CDN public)
          <source src="https://www.pexels.com/fr-fr/download/video/6774633/" />
          <source src="https://www.w3schools.com/html/mov_bbb.ogv" type="video/ogg" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-emerald-900/20" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      </motion.div>

      {/* Particles d'arrière-plan animées */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-500/30 "
              initial={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
              }}
              animate={{
                y: [null, Math.random() * windowSize.height],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="container mx-auto px-2 sm:px-4 md:px-6 z-10 relative"
        style={{ opacity }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Contenu principal avec animation de transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-4 sm:mb-8 md:mb-12"
            >
              {/* Badge moderne avec glow effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center mb-4 sm:mb-6"
              >
                <div className="relative group">
                  <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${accentClasses.bg} to-transparent backdrop-blur-2xl border ${accentClasses.border} shadow-2xl ${accentClasses.shadow}`}>
                    <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${accentClasses.text} animate-pulse`} />
                    <span className="text-white font-semibold text-sm sm:text-base tracking-wide">{currentHero.badge}</span>
                    <div className={`w-2 h-2 bg-gradient-to-r ${accentClasses.gradient} animate-pulse shadow-lg`}></div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${accentClasses.gradient} blur-2xl group-hover:blur-3xl transition-all duration-500 -z-10 opacity-30`}></div>
                </div>
              </motion.div>

              {/* Logo avec effet 3D et glassmorphisme */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 sm:mb-8 flex justify-center"
              >
                <div className="relative group">
                  <div className={`p-3 sm:p-4 bg-white/90 backdrop-blur-3xl border-2 border-white/30 rounded-3xl shadow-2xl hover:${accentClasses.shadow} transition-all duration-500 hover:scale-105`}>
                    <Image
                      src="/logo 4.png"
                      alt="Forum GENI Entreprises"
                      width={80}
                      height={80}
                      className="h-12 w-auto sm:h-16 md:h-20"
                      priority
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${accentClasses.gradient} rounded-3xl blur-3xl group-hover:blur-[40px] transition-all duration-500 -z-10 opacity-20`}></div>
                </div>
              </motion.div>

              {/* Titre avec typographie premium */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-4 sm:mb-6"
              >
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-2 sm:mb-4 tracking-tight leading-none">
                  <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                    {currentHero.title}
                  </span>
                  <span className={`block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light bg-gradient-to-r ${accentClasses.gradient} bg-clip-text text-transparent mt-1 sm:mt-2`}>
                    {currentHero.subtitle}
                  </span>
                </h1>
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                  <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent w-12 sm:w-20 md:w-24 ${accentClasses.text}`}></div>
                  <span className="text-sm sm:text-lg md:text-xl text-white/90 font-semibold tracking-widest">
                    {currentHero.year}
                  </span>
                  <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent w-12 sm:w-20 md:w-24 ${accentClasses.text}`}></div>
                </div>
              </motion.div>

              {/* Description améliorée */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-sm sm:text-base md:text-lg text-white/90 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed"
              >
                <span className="font-medium">{currentHero.description}</span>
                <br className="hidden sm:block" />
                <span className={`${accentClasses.text} font-light`}>{currentHero.highlight}</span>
              </motion.p>

              {/* Boutons CTA premium */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 md:mb-16"
              >
                <Link href={currentHero.primaryCta.href} prefetch={true}>
                  <motion.button
                    className={`group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${accentClasses.gradient} text-white font-bold overflow-hidden shadow-2xl ${accentClasses.shadow} hover:shadow-lg transition-all duration-500 text-sm sm:text-base`}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${accentClasses.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                    <div className="relative flex items-center gap-2 sm:gap-3">
                      <currentHero.primaryCta.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{currentHero.primaryCta.text}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </motion.button>
                </Link>

                <Link href={currentHero.secondaryCta.href} prefetch={true}>
                  <motion.button
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-500 shadow-2xl text-sm sm:text-base"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center gap-2">
                      {currentHero.secondaryCta.text}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Cards statistiques dynamiques */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`stats-${currentSlide}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            >
              {currentHero.stats.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className="group relative"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative p-4 sm:p-5 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300">
                    {/* Icon simple */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 mb-3 bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/30 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>

                    {/* Contenu */}
                    <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/50 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>



      {/* Indicateurs de slide (dots) */}
      <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => { goToSlide(index); setIsAutoPlaying(false); }}
            className={`relative h-2 sm:h-2.5 rounded-full transition-all duration-300 ${currentSlide === index
              ? 'w-8 sm:w-10 bg-white'
              : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/60'
              }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {currentSlide === index && (
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${accentClasses.gradient}`}
                layoutId="activeSlide"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Barre de progression autoplay */}
      {isAutoPlaying && (
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 w-32 sm:w-40 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            key={currentSlide}
            className={`h-full bg-gradient-to-r ${accentClasses.gradient}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </div>
      )}

      {/* Indicateur de scroll élégant */}
      <motion.div
        className="flex flex-col items-center justify-end w-full mt-6 sm:mt-8 mb-4 sm:mb-6 grow z-10"
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-xs sm:text-sm font-light tracking-wider">Scroll</span>
          <div className={`w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/40 flex justify-center relative group hover:${accentClasses.border} transition-colors duration-300`}>
            <motion.div
              className={`w-1 h-2 bg-white mt-2 group-hover:${accentClasses.text.replace('text-', 'bg-')} transition-colors duration-300`}
              animate={{ y: [0, 12, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;