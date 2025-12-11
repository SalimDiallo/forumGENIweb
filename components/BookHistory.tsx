'use client';

import React, { useRef, useEffect, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const BookHistory = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set());

  const pages = [
    {
      year: "2002",
      title: "L'Étincelle",
      subtitle: "Le Commencement",
      content: "Tout a commencé avec une vision audacieuse : créer un pont entre l'excellence académique de l'INSEA et le monde professionnel. Des étudiants passionnés ont osé rêver grand, convaincus que l'union de la théorie et de la pratique pourrait transformer des carrières et créer un impact durable.",
      highlight: "50 participants",
      image: "https://media.licdn.com/dms/image/v2/D4E0BAQGEHMHyq4BVTA/company-logo_200_200/B4EZlXBs1KIkAI-/0/1758101688171/forumgenientreprises_logo?e=2147483647&v=beta&t=MpKlm0bOboORrRodJxsxK5h-vGfI2yFy3wczxaGZlG4",
      bgColor: "from-amber-50 to-orange-50"
    },
    {
      year: "2022",
      title: "La Conférence sur la Loi de Finances",
      subtitle: "Visioconférence annuelle",
      content: "La Conférence sur la Loi de Finances, organisée par le Club Forum GENI Entreprises INSEA, est une visioconférence annuelle dédiée à l'analyse des orientations budgétaires et macroéconomiques du Maroc. Elle explore les défis économiques actuels et les réponses structurelles proposées par la Loi de Finances.",
      highlight: "INSEA - 25/01/2022",
      image: "https://maroc-ingenierie.ma/wp-content/uploads/2022/01/INSEA-LDF2022.jpg",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      year: "2022",
      title: "Forum Geni Entreprise 18e Edition",
      subtitle: "Forum annuel étudiant",
      content: "Forum GENI Entreprises est un événement annuel majeur organisé conjointement par l'INSEA, l'ENSIAS et l'INPT. Ce forum crée un pont direct entre le monde académique et professionnel. L'événement réunit entreprises, étudiants et lauréats pour des conférences, stands, networking et opportunités de recrutement.",
      highlight: "ENSIAS • 23-24/03/2022",
      image: "https://ensias.um5.ac.ma/sites/ensias.um5.ac.ma/files/images/news/Forum%20GENI-%20Entreprises2022.jpg",
      bgColor: "from-emerald-50 to-green-50"
    },
    {
      year: "2023",
      title: "Forum Geni Entreprise 19e Edition",
      subtitle: "Forum annuel étudiant",
      content: "La 19e édition a rassemblé étudiants, lauréats et entreprises. Au programme : conférences, networking, recrutement. L'un des plus grands forums étudiants au Maroc, visant à informer sur les offres d'emplois et stages.",
      highlight: "INSEA • 18-19/10/2023",
      image: "https://insea.ac.ma/images/affiche_forum_2023.png",
      bgColor: "from-fuchsia-50 to-rose-50"
    },
    {
      year: "2023",
      title: "Conférence sur le PLF2023",
      subtitle: "Analyse du Projet de Loi de Finances",
      content: "La Conférence PLF réunit experts, institutionnels et étudiants autour des défis actuels et futurs de l'économie nationale. Une opportunité unique pour approfondir la compréhension des enjeux macroéconomiques.",
      highlight: "INSEA • 07/12/2023",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9QwKFR-edFAh6QHLZ-GnIZCS-Tg1fg1zpJll_jpZOe_yY-G0On6U-XCwCGwNJ3MA6QuM&usqp=CAU",
      bgColor: "from-yellow-50 to-orange-50"
    },
    {
      year: "2023",
      title: "Speed JOB dating",
      subtitle: "Recrutement express",
      content: "Le Speed Job Dating met en relation directe les étudiants et les entreprises lors d'entretiens courts et personnalisés. Un vrai tremplin de carrière pour les étudiants des grandes écoles d'ingénieurs.",
      highlight: "INSEA • 14-15/12/2023",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwr3k7cM46alRukcGl4RfHmv7cRQagQfE6bA&s",
      bgColor: "from-lime-50 to-green-50"
    },
    {
      year: "2024",
      title: "Forum Geni Entreprise 20e Edition",
      subtitle: "Forum annuel étudiant",
      content: "L'édition 2024 s'est déroulée à l'INPT, rassemblant entreprises nationales et internationales, étudiants et lauréats autour de conférences, stands, networking et recrutement.",
      highlight: "INPT • 16-17/10/2024",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTAjROsS32n61SUwTYB_IU--L67DDzYeSfw&s",
      bgColor: "from-sky-50 to-blue-50"
    },
    {
      year: "2024",
      title: "Visa D'embauche",
      subtitle: "Insertion professionnelle",
      content: "Visa d'Embauche propose des ateliers pour optimiser son profil professionnel, améliorer CV et préparer les entretiens. Un accompagnement stratégique pour se démarquer.",
      highlight: "INSEA • 20/12/2024",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV-94k-YxTYaVm3yDXP38hAreNUVbTsVpJ9OIGAUO82v0qaSWa1hjxy8XpVKOUDTzjZkg&usqp=CAU",
      bgColor: "from-violet-50 to-indigo-50"
    },
    {
      year: "2025",
      title: "Oracle CAMPUS TOUR",
      subtitle: "Découverte carrière",
      content: "Oracle Campus Tour permet aux étudiants de découvrir les opportunités offertes par Oracle, leader mondial des technologies cloud et data.",
      highlight: "INSEA • 17/04/2025",
      image: "https://www.atalayar.com/media/atalayar/images/2022/05/19/20220519103922068626.jpg",
      bgColor: "from-red-50 to-orange-50"
    },
    {
      year: "2025",
      title: "Forum Geni Entreprise 21e Edition",
      subtitle: "Forum annuel étudiant",
      content: "La 21e édition à l'ENSIAS. La plus grande plateforme de rencontre entre étudiants ingénieurs et professionnels au Maroc, favorisant l'employabilité et l'insertion réussie.",
      highlight: "ENSIAS • 15-16/10/2025",
      image: "https://drh-ma.s3.amazonaws.com/wp-content/uploads/2025/10/09120824/Forum-GENI-Entreprises-2025.jpg",
      bgColor: "from-pink-50 to-purple-50"
    },
  ];

  // Intersection observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.getAttribute('data-page-idx') || '0');
          if (entry.isIntersecting) {
            setVisiblePages((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );

    const pageElements = document.querySelectorAll('[data-page-idx]');
    pageElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative from-stone-200 via-stone-100 to-stone-200 pt-10 md:pt-10 pb-16 md:pb-24"
    >
      {/* Ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-amber-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

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

      {/* Pages */}
      <div className="relative z-10 space-y-16 md:space-y-24 px-4 md:px-8 max-w-6xl mx-auto">
        {pages.map((page, idx) => {
          const isVisible = visiblePages.has(idx);

          return (
            <div
              key={idx}
              data-page-idx={idx}
              className={`transition-all duration-700 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
                }`}
              style={{ perspective: '2000px' }}
            >
              {/* Book spread */}
              <div
                className="relative"
                style={{
                  transform: `rotateY(${mousePosition.x * 0.15}deg) rotateX(${-mousePosition.y * 0.1}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.2s ease-out',
                }}
              >
                {/* Book shadow */}
                <div className="absolute inset-x-4 -bottom-4 h-6 bg-black/15 rounded-[50%] blur-lg" />

                {/* Book base (pages stack) */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    transform: 'translateY(8px) translateZ(-10px)',
                  }}
                />

                {/* Main book spread */}
                <div className="relative flex flex-col lg:flex-row  overflow-hidden shadow-xl border border-stone-300/50">
                  {/* Left page */}
                  <div
                    className={`flex-1 bg-gradient-to-br ${page.bgColor} p-6 md:p-8 lg:p-10`}
                    style={{
                      backgroundImage: `
                        linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, transparent 50%),
                        repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.02) 28px, rgba(0,0,0,0.02) 29px)
                      `,
                    }}
                  >
                    <div className="h-full flex flex-col">
                      {/* Year */}
                      <div className="text-center mb-4">
                        <span className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-neutral-800 to-neutral-600 bg-clip-text text-transparent font-serif">
                          {page.year}
                        </span>
                      </div>

                      {/* Image */}
                      <div className="flex-1 min-h-[200px] md:min-h-[280px] lg:min-h-[320px] rounded-xl overflow-hidden shadow-xl relative mb-4">
                        <img
                          src={page.image}
                          alt={page.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Badge */}
                      <div className="text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full text-sm font-semibold text-neutral-700 shadow-lg">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          {page.highlight}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book spine */}
                  <div
                    className="hidden lg:block w-3 relative"
                    style={{
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)',
                    }}
                  />

                  {/* Right page */}
                  <div
                    className="flex-1 bg-white p-6 md:p-8 lg:p-10"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.02) 28px, rgba(0,0,0,0.02) 29px)`,
                    }}
                  >
                    <div className="h-full flex flex-col">
                      {/* Title */}
                      <div className="mb-6">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 font-serif leading-tight mb-2">
                          {page.title}
                        </h3>
                        <p className="text-lg md:text-xl text-neutral-500 italic font-serif">
                          {page.subtitle}
                        </p>
                        <div className="w-20 h-0.5 bg-neutral-300 rounded mt-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex items-center">
                        <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-serif">
                          <span className="text-4xl md:text-5xl font-bold float-left mr-3 leading-none text-neutral-800">
                            {page.content.charAt(0)}
                          </span>
                          {page.content.substring(1)}
                        </p>
                      </div>

                      {/* Page number */}
                      <div className="text-center mt-6 text-neutral-400 text-sm font-serif italic">
                        — page {idx + 1} sur {pages.length} —
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page edges (right side) */}
                <div
                  className="absolute right-0 top-2 bottom-2 w-2 rounded-r-lg pointer-events-none hidden lg:block"
                  style={{
                    background: 'repeating-linear-gradient(to bottom, #fafaf9 0px, #fafaf9 2px, #e7e5e4 2px, #e7e5e4 4px)',
                  }}
                />

                {/* Page edges (left side) */}
                <div
                  className="absolute left-0 top-2 bottom-2 w-2 rounded-l-lg pointer-events-none hidden lg:block"
                  style={{
                    background: 'repeating-linear-gradient(to bottom, #fafaf9 0px, #fafaf9 2px, #e7e5e4 2px, #e7e5e4 4px)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* End section */}
      <div className="text-center mt-16 md:mt-24 relative z-10">
        <p className="text-xl md:text-2xl text-neutral-600 italic font-serif">
          L'histoire continue...
        </p>
        <div className="flex justify-center gap-2 mt-4 text-neutral-400 text-2xl">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>
      </div>
    </section>
  );
};

export default BookHistory;
