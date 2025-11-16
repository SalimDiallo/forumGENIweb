'use client';

import React, { useRef, useEffect, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const BookHistory = () => {
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const pages = [
    {
      year: "2002",
      title: "L'Étincelle",
      subtitle: "Le Commencement",
      content: "Tout a commencé avec une vision audacieuse : créer un pont entre l'excellence académique de l'INSEA et le monde professionnel. Des étudiants passionnés ont osé rêver grand, convaincus que l'union de la théorie et de la pratique pourrait transformer des carrières et créer un impact durable.",
      highlight: "50 participants",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
      decoration: "✨",
      bgColor: "from-amber-50/20 to-orange-50/20"
    },
    {
      year: "2007",
      title: "L'Expansion",
      subtitle: "Croissance Régionale",
      content: "Le Forum grandit et s'ouvre aux entreprises régionales. Les premières partnerships stratégiques se forment, créant un réseau solide d'opportunités. Cette période marque un tournant décisif dans notre développement, avec une reconnaissance croissante de notre impact.",
      highlight: "200+ participants",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      decoration: "🌱",
      bgColor: "from-emerald-50/20 to-green-50/20"
    },
    {
      year: "2012",
      title: "International",
      subtitle: "Rayonnement Mondial",
      content: "Une nouvelle ère commence avec l'accueil de speakers internationaux de renom. Le Forum GENI INSEA devient une référence au niveau mondial, attirant l'attention de leaders d'opinion et d'entreprises internationales qui voient en nous un modèle d'excellence.",
      highlight: "500+ participants",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      decoration: "🌍",
      bgColor: "from-blue-50/20 to-indigo-50/20"
    },
    {
      year: "2018",
      title: "Excellence",
      subtitle: "Reconnaissance Officielle",
      content: "La reconnaissance officielle arrive : Prix d'Excellence en Innovation décerné par le Ministère de l'Enseignement Supérieur. Un tournant historique qui valide notre approche innovante et notre contribution significative au développement du capital humain marocain.",
      highlight: "800+ participants",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      decoration: "🏆",
      bgColor: "from-yellow-50/20 to-amber-50/20"
    },
    {
      year: "2023",
      title: "Digital",
      subtitle: "Transformation Numérique",
      content: "Adoption du format hybride et lancement d'une plateforme digitale révolutionnaire. Le Forum embrasse pleinement l'ère numérique, permettant une portée sans précédent et une expérience enrichie pour tous les participants, qu'ils soient présents physiquement ou virtuellement.",
      highlight: "1200+ participants",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
      decoration: "💻",
      bgColor: "from-purple-50/20 to-pink-50/20"
    },
    {
      year: "2025",
      title: "Le Futur",
      subtitle: "Intelligence & Innovation",
      content: "23ème édition axée sur l'Intelligence Artificielle et les technologies émergentes du futur. Le Forum continue d'innover et de façonner les leaders de demain, en restant à l'avant-garde des tendances qui transformeront le monde du travail et de l'entreprise.",
      highlight: "1500+ participants",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
      decoration: "🚀",
      bgColor: "from-cyan-50/20 to-sky-50/20"
    }
  ];

  // Advanced parallax effect with smooth easing
  useEffect(() => {
    let animationFrameId: number;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!parallaxContainerRef.current) return;
        
        const container = parallaxContainerRef.current;
        const elements = Array.from(container.querySelectorAll('[data-parallax]')) as HTMLElement[];
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const parallaxAttr = el.getAttribute('data-parallax');
          const parallaxSpeed = parallaxAttr ? parseFloat(parallaxAttr) : 0.5;
          const rotateAttr = el.getAttribute('data-rotate');
          const scaleAttr = el.getAttribute('data-scale');
          
          // Calculate position relative to viewport center
          const centerY = window.innerHeight / 2;
          const elementCenterY = rect.top + rect.height / 2;
          const distanceFromCenter = (elementCenterY - centerY) / window.innerHeight;
          
          // Smooth parallax translation
          const translateY = distanceFromCenter * parallaxSpeed * 100;
          
          // Optional rotation effect
          const rotate = rotateAttr ? distanceFromCenter * parseFloat(rotateAttr) : 0;
          
          // Optional scale effect
          const scale = scaleAttr ? 1 + (Math.abs(distanceFromCenter) * parseFloat(scaleAttr)) : 1;
          
          // Apply smooth transform with perspective
          el.style.transform = `
            perspective(1000px)
            translateY(${translateY}px)
            translateZ(${Math.abs(parallaxSpeed) * 50}px)
            rotateX(${rotate}deg)
            scale(${scale})
          `;
          
          // Add opacity fade based on distance
          const opacity = Math.max(0.3, 1 - Math.abs(distanceFromCenter) * 0.5);
          el.style.opacity = opacity.toString();
        });
        
        lastScrollY = scrollY;
      });
    };

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial call
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-100 to-neutral-200"
      style={{ minHeight: '100vh' }}
    >
      {/* Animated background layers */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)`,
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-neutral-300/20 rounded-full"
            style={{
              left: `${Math.random() * 98}%`,
              top: `${Math.random() * 98}%`
            }}
          />
        ))}
      </div>

      {/* Mouse-following gradient */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0,0,0,0.1), transparent)`,
          transition: 'background 0.3s ease-out',
        }}
      />

      {/* Main content */}
      <div
        ref={parallaxContainerRef}
        className="min-h-screen w-full pt-24 pb-48 relative z-10"
      >
        {/* Static header */}
        <div
          className="text-center mb-20"
          data-parallax="0.3"
        >
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md border-2 border-neutral-200 rounded-full mb-6 shadow"
          >
            <BookOpen className="w-5 h-5 text-black" />
            <span className="text-black font-bold text-sm tracking-wider">2002 - 2025 • 23 ANS D'EXCELLENCE</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black mb-4 font-serif">
            <span className="inline-block" data-parallax="0.2">Notre</span>{' '}
            <span className="inline-block" data-parallax="0.4">Histoire</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-neutral-600 italic max-w-2xl mx-auto">
            Un voyage à travers le temps, une histoire d'innovation et d'excellence
          </p>
        </div>

        {/* Timeline with 3D book effect, sans animation de bloc */}
        <div className="w-full flex flex-col gap-32 md:gap-48 px-4 md:px-8">
          {pages.map((page, idx) => (
            <div
              key={idx}
              className="relative max-w-7xl mx-auto w-full"
            >
              {/* Background accent */}
              <div 
                className={`absolute -inset-20 bg-gradient-to-br ${page.bgColor} rounded-3xl blur-3xl opacity-50`}
                data-parallax={0.1 * (idx + 1)}
              />
              
              {/* Book container with perspective (static) */}
              <div 
                className="relative flex flex-col lg:flex-row items-stretch shadow-md bg-transparent group perspective-1000"
                style={{
                  transform: `rotateY(${mousePosition.x * 0.1}deg) rotateX(${-mousePosition.y * 0.1}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s ease-out',
                }}
              >
                {/* Left page */}
                <div
                  className="relative bg-gradient-to-br from-white to-neutral-50 lg:rounded-l-3xl rounded-t-3xl lg:rounded-tr-none shadow-md border border-neutral-200 min-h-[400px] md:min-h-[500px] xl:min-h-[650px] p-8 md:p-12 lg:p-16 flex-1 flex flex-col justify-between overflow-hidden"
                  style={{
                    transform: 'translateZ(20px)',
                    backgroundImage: `
                      linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 45%, transparent 50%),
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 30px,
                        rgba(0,0,0,0.03) 30px,
                        rgba(0,0,0,0.03) 31px
                      )
                    `,
                  }}
                  data-parallax={0.3 + 0.1 * (idx % 3)}
                  data-rotate="2"
                >
                  {/* Floating decoration */}
                  <div 
                    className="absolute top-8 right-8 text-6xl opacity-10"
                  >
                    {page.decoration}
                  </div>
                  
                  {/* Year with 3D effect */}
                  <div className="text-center mb-8" data-parallax="0.5">
                    <div 
                      className="inline-block relative"
                    >
                      <span className="text-8xl md:text-9xl font-bold text-neutral-200 font-serif select-none absolute -z-10 blur-sm">
                        {page.year}
                      </span>
                      <span className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-neutral-800 via-neutral-600 to-neutral-900 bg-clip-text text-transparent font-serif relative z-10">
                        {page.year}
                      </span>
                    </div>
                  </div>
                  
                  {/* Image */}
                  <div 
                    className="mb-8 rounded-xl overflow-hidden shadow"
                    data-parallax="0.4"
                  >
                    <img
                      src={page.image}
                      alt={page.title}
                      className="w-full h-56 md:h-72 object-cover"
                    />
                  </div>
                  
                  {/* Badge */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 border border-neutral-300 rounded-full shadow relative overflow-hidden group-hover:shadow-md transition-shadow">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <Sparkles className="w-5 h-5 text-neutral-700" />
                      <span className="text-neutral-800 font-bold text-base relative z-10">
                        {page.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Book spine with 3D effect */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 z-30 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 shadow-[inset_0_0_8px_rgba(0,0,0,0.25),0_0_12px_rgba(0,0,0,0.1)]"
                     style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                </div>

                {/* Right page */}
                <div
                  className="relative bg-gradient-to-bl from-white to-neutral-50 lg:rounded-r-3xl rounded-b-3xl lg:rounded-bl-none shadow-md border border-neutral-200 min-h-[400px] md:min-h-[500px] xl:min-h-[650px] p-8 md:p-12 lg:p-16 flex-1 flex flex-col justify-between overflow-hidden"
                  style={{
                    transform: 'translateZ(20px)',
                    backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 30px,
                        rgba(0,0,0,0.025) 30px,
                        rgba(0,0,0,0.025) 31px
                      )
                    `,
                  }}
                >
                  {/* Title section */}
                  <div className="mb-10" data-parallax="0.3">
                    <h3 
                      className="text-4xl md:text-6xl font-bold text-black mb-3 font-serif"
                    >
                      {page.title}
                    </h3>
                    <p 
                      className="text-2xl md:text-3xl text-neutral-600 italic font-serif"
                    >
                      {page.subtitle}
                    </p>
                    <div className="w-full h-px bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 mt-6" />
                  </div>
                  
                  {/* Content with elegant typography */}
                  <div className="flex-1 flex items-center" data-parallax="0.2">
                    <p 
                      className="text-lg md:text-xl lg:text-2xl text-neutral-800 leading-relaxed font-serif text-justify"
                    >
                      <span className="text-7xl font-bold float-left mr-4 mt-2 leading-none bg-gradient-to-br from-neutral-700 to-neutral-900 bg-clip-text text-transparent">
                        {page.content.charAt(0)}
                      </span>
                      {page.content.substring(1)}
                    </p>
                  </div>
                  
                  {/* Decorative footer */}
                  <div className="mt-8 text-center">
                    <div className="inline-flex gap-2 text-neutral-400 text-3xl">
                      <span className="animate-pulse">✦</span>
                      <span className="animate-pulse animation-delay-200">✦</span>
                      <span className="animate-pulse animation-delay-400">✦</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* End section */}
        <div 
          className="text-center mt-32"
          data-parallax="0.5"
        >
          <p className="text-2xl md:text-3xl text-neutral-600 italic font-serif">
            L'histoire continue...
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookHistory;