'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Calendar, Sparkles, ArrowRight, Star, BookOpen } from 'lucide-react';

const ParallaxHistory = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number | null>(null);

  const pages = [
    {
      year: "2002",
      title: "L'Étincelle",
      subtitle: "Le Commencement",
      content: "Tout a commencé avec une vision audacieuse : créer un pont entre l'excellence académique de l'INSEA et le monde professionnel. Des étudiants passionnés ont osé rêver grand.",
      highlight: "VISION",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      accentColor: "#f59e0b",
    },
    {
      year: "2022",
      title: "La Conférence sur la Loi de Finances",
      subtitle: "Visioconférence annuelle",
      content: "La Conférence sur la Loi de Finances, organisée par le Club Forum GENI Entreprises INSEA, est une visioconférence annuelle dédiée à l'analyse des orientations budgétaires.",
      highlight: "INSEA - 25/01/2022",
      image: "https://maroc-ingenierie.ma/wp-content/uploads/2022/01/INSEA-LDF2022.jpg",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      accentColor: "#6366f1",
    },
    {
      year: "2022",
      title: "Forum GENI Entreprise 18e Edition",
      subtitle: "Forum annuel étudiant",
      content: "Forum GENI Entreprises est un événement annuel majeur organisé conjointement par l'INSEA, l'ENSIAS et l'INPT. Ce forum crée un pont direct entre le monde académique et professionnel.",
      highlight: "ENSIAS • 23-24/03/2022",
      image: "https://ensias.um5.ac.ma/sites/ensias.um5.ac.ma/files/images/news/Forum%20GENI-%20Entreprises2022.jpg",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      accentColor: "#14b8a6",
    },
    {
      year: "2023",
      title: "Forum GENI Entreprise 19e Edition",
      subtitle: "Forum annuel étudiant",
      content: "La 19e édition a rassemblé étudiants, lauréats et entreprises. Au programme : conférences, networking, recrutement. L'un des plus grands forums étudiants au Maroc.",
      highlight: "INSEA • 18-19/10/2023",
      image: "https://insea.ac.ma/images/affiche_forum_2023.png",
      gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
      accentColor: "#ec4899",
    },
    {
      year: "2023",
      title: "Conférence sur le PLF2023",
      subtitle: "Analyse du Projet de Loi de Finances",
      content: "La Conférence PLF réunit experts, institutionnels et étudiants autour des défis actuels et futurs de l'économie nationale.",
      highlight: "INSEA • 07/12/2023",
      image: "/history/plf23.jpg",
      gradient: "from-yellow-500 via-amber-500 to-orange-500",
      accentColor: "#eab308",
    },
    {
      year: "2023",
      title: "Speed JOB dating",
      subtitle: "Recrutement express",
      content: "Le Speed Job Dating met en relation directe les étudiants et les entreprises lors d'entretiens courts et personnalisés.",
      highlight: "INSEA • 14-15/12/2023",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwr3k7cM46alRukcGl4RfHmv7cRQagQfE6bA&s",
      gradient: "from-lime-500 via-green-500 to-emerald-500",
      accentColor: "#22c55e",
    },
    {
      year: "2024",
      title: "Forum GENI Entreprise 20e Edition",
      subtitle: "Forum annuel étudiant",
      content: "L'édition 2024 s'est déroulée à l'INPT, rassemblant entreprises nationales et internationales, étudiants et lauréats.",
      highlight: "INPT • 16-17/10/2024",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTAjROsS32n61SUwTYB_IU--L67DDzYeSfw&s",
      gradient: "from-sky-500 via-blue-500 to-indigo-500",
      accentColor: "#0ea5e9",
    },
    {
      year: "2024",
      title: "Visa D'embauche",
      subtitle: "Insertion professionnelle",
      content: "Visa d'Embauche propose des ateliers pour optimiser son profil professionnel, améliorer CV et préparer les entretiens.",
      highlight: "INSEA • 20/12/2024",
      image: "/history/visaembauche2024.png",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      accentColor: "#8b5cf6",
    },
    {
      year: "2025",
      title: "Oracle CAMPUS TOUR",
      subtitle: "Découverte carrière",
      content: "Oracle Campus Tour permet aux étudiants de découvrir les opportunités offertes par Oracle, leader mondial des technologies cloud et data.",
      highlight: "INSEA • 17/04/2025",
      image: "/history/oracle.jpg",
      gradient: "from-red-500 via-rose-500 to-pink-500",
      accentColor: "#ef4444",
    },
    {
      year: "2025",
      title: "Forum GENI Entreprise 21e Edition",
      subtitle: "Forum annuel étudiant",
      content: "La 21e édition à l'ENSIAS. La plus grande plateforme de rencontre entre étudiants ingénieurs et professionnels au Maroc.",
      highlight: "ENSIAS • 15-16/10/2025",
      image: "https://drh-ma.s3.amazonaws.com/wp-content/uploads/2025/10/09120824/Forum-GENI-Entreprises-2025.jpg",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      accentColor: "#a855f7",
    },
  ];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll tracking with RAF for smoother performance
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return; // Throttle with RAF
      
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) {
          rafRef.current = null;
          return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const scrolled = -rect.top / (rect.height - window.innerHeight);
        const clampedProgress = Math.max(0, Math.min(1, scrolled));
        
        setScrollProgress(clampedProgress);
        
        const newActiveCard = Math.floor(scrolled * pages.length);
        setActiveCard(Math.max(0, Math.min(pages.length - 1, newActiveCard)));
        
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pages.length]);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: `${(pages.length + 1) * 100}vh` }}
    >
          {/* Header */}
      <div className="text-center mb-12 md:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md border border-neutral-200 shadow-lg rounded-full mb-6">
          <BookOpen className="w-5 h-5 text-neutral-700" />
          <span className="text-neutral-800 font-bold text-sm tracking-wide">
            NOTRE HISTOIRE • 2002-2025
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 font-serif mb-4">
          Notre Histoire
        </h2>
        <p className="text-lg md:text-xl text-neutral-600 italic max-w-2xl mx-auto px-4">
          Un voyage à travers le temps, une histoire d'innovation et d'excellence
        </p>
      </div>
      {/* Fixed container for cards */}
      <div className="sticky top-0 h-screen overflow-hidden w-full">
        {/* Cards Stack - Full screen immersive */}
        <div className="absolute inset-0">
          {[...pages]
            .sort((a, b) => Number(b.year) - Number(a.year))
            .map((page, idx) => {
            // Calculate how much this card should be visible based on scroll
            const cardProgress = scrollProgress * pages.length - idx;
            const isActive = cardProgress >= -1 && cardProgress < 1;
            const isPast = cardProgress >= 1;
            const isFuture = cardProgress < -1;
            
            // First card starts visible, others slide up from bottom
            // translateY: 0 = fully visible, 100 = off screen below
            let translateY = 0;
            if (idx === 0) {
              // First card is always at 0
              translateY = 0;
            } else if (isFuture) {
              // Future cards are off screen at bottom
              translateY = 100;
            } else if (isPast) {
              // Past cards stay at 0 (covered by newer cards)
              translateY = 0;
            } else {
              // Active/transitioning cards slide up based on progress
              translateY = Math.max(0, (1 - (cardProgress + 1)) * 100);
            }
            
            const opacity = isFuture ? 0 : 1;
            const zIndex = idx + 1;

            return (
              <div
                key={idx}
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: `translate3d(0, ${translateY}%, 0)`,
                  opacity,
                  zIndex,
                  willChange: 'transform',
                  transition: isMobile ? 'none' : 'transform 0.5s ease-out',
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <div 
                    className="absolute inset-0"
                    style={{
                      // Further lower zoom for desktop and mobile for better adaptation
                      // Previous: desktop: 1.02, mobile: 1.01
                      // Now: desktop: 1.005, mobile: 1.002
                      transform: isMobile
                        ? 'scale(1.002)'
                        : `scale(1.005) translate3d(0, ${isActive ? (cardProgress - 0.5) * 10 : 0}%, 0)`,
                      willChange: isMobile ? 'auto' : 'transform',
                      transition: isMobile ? 'none' : 'transform 0.7s ease-out',
                    }}
                  >
                    <img
                      src={page.image}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, ${page.accentColor}dd 0%, ${page.accentColor}99 30%, transparent 70%),
                                   linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-2xl px-8 md:px-16 lg:px-24">
                      {/* Year */}
                      <div 
                        className="mb-6 overflow-hidden"
                        style={{
                          transform: isMobile ? 'none' : `translateY(${isActive ? 0 : 50}px)`,
                          opacity: isActive || isPast ? 1 : 0,
                          transition: isMobile ? 'opacity 0.3s ease-out' : 'all 0.6s ease-out 0.1s',
                        }}
                      >
                        <span className="text-7xl md:text-9xl lg:text-[12rem] font-black text-white/20 leading-none">
                          {page.year}
                        </span>
                      </div>

                      {/* Subtitle */}
                      <div 
                        className="mb-4"
                        style={{
                          transform: isMobile ? 'none' : `translateY(${isActive ? 0 : 30}px)`,
                          opacity: isActive || isPast ? 1 : 0,
                          transition: isMobile ? 'opacity 0.3s ease-out' : 'all 0.6s ease-out 0.2s',
                        }}
                      >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                          <Sparkles className="w-4 h-4" />
                          {page.subtitle}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        style={{
                          transform: isMobile ? 'none' : `translateY(${isActive ? 0 : 40}px)`,
                          opacity: isActive || isPast ? 1 : 0,
                          transition: isMobile ? 'opacity 0.3s ease-out' : 'all 0.6s ease-out 0.3s',
                        }}
                      >
                        {page.title}
                      </h3>

                      {/* Description */}
                      <p 
                        className="text-base md:text-xl text-white/80 leading-relaxed mb-8 max-w-xl"
                        style={{
                          transform: isMobile ? 'none' : `translateY(${isActive ? 0 : 30}px)`,
                          opacity: isActive || isPast ? 1 : 0,
                          transition: isMobile ? 'opacity 0.3s ease-out' : 'all 0.6s ease-out 0.4s',
                        }}
                      >
                        {page.content}
                      </p>

                      {/* Highlight badge */}
                      <div
                        style={{
                          transform: isMobile ? 'none' : `translateY(${isActive ? 0 : 20}px)`,
                          opacity: isActive || isPast ? 1 : 0,
                          transition: isMobile ? 'opacity 0.3s ease-out' : 'all 0.6s ease-out 0.5s',
                        }}
                      >
                        <span className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-white text-neutral-900 rounded-full font-semibold shadow-xl text-sm md:text-base">
                          <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                          {page.highlight}
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Page indicator - bottom right */}
                  <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
                    <div className="flex items-end gap-2">
                      <span className="text-6xl md:text-8xl font-black text-white/30">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xl md:text-2xl text-white/50 mb-2 md:mb-4">
                        / {String(pages.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal scroll indicator - only on first card */}
        {scrollProgress < 0.05 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-white/70">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Side navigation dots - minimal */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {pages.map((page, idx) => (
            <button
              key={idx}
              onClick={() => {
                const scrollTarget = (idx / pages.length) * (containerRef.current!.offsetHeight - window.innerHeight);
                window.scrollTo({
                  top: containerRef.current!.offsetTop + scrollTarget,
                  behavior: 'smooth',
                });
              }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: idx === activeCard 
                  ? 'white' 
                  : 'rgba(255,255,255,0.3)',
                transform: idx === activeCard ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* End section - positioned after last card */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-screen flex items-center justify-center"
        style={{ zIndex: 100 }}
      >
        {/* Background gradient for visibility */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-neutral-100 via-neutral-50 to-transparent transition-opacity duration-700"
          style={{ opacity: scrollProgress > 0.9 ? 1 : 0 }}
        />
        
        <div 
          className="relative text-center px-6 transition-all duration-700"
          style={{ 
            opacity: scrollProgress > 0.92 ? 1 : 0,
            transform: `translateY(${scrollProgress > 0.92 ? 0 : 50}px)`,
          }}
        >
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6">
            L'histoire continue...
          </h3>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-xl mx-auto mb-8">
            Rejoignez-nous pour écrire le prochain chapitre
          </p>
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shadow-xl">
            <Sparkles className="w-5 h-5" />
            Découvrir nos événements
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxHistory;
