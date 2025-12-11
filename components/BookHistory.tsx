'use client';

import React, { useRef, useEffect, useState } from 'react';
import { BookOpen, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const BookHistory = () => {
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<number, number>>({});

  const pages = [
    {
      year: "2002",
      title: "L'Étincelle",
      subtitle: "Le Commencement",
      content: "Tout a commencé avec une vision audacieuse : créer un pont entre l'excellence académique de l'INSEA et le monde professionnel. Des étudiants passionnés ont osé rêver grand, convaincus que l'union de la théorie et de la pratique pourrait transformer des carrières et créer un impact durable.",
      highlight: "50 participants",
      images: [
        "https://media.licdn.com/dms/image/v2/D4E0BAQGEHMHyq4BVTA/company-logo_200_200/B4EZlXBs1KIkAI-/0/1758101688171/forumgenientreprises_logo?e=2147483647&v=beta&t=MpKlm0bOboORrRodJxsxK5h-vGfI2yFy3wczxaGZlG4",
      ],
      bgColor: "from-amber-50/20 to-orange-50/20"
    },
    {
      year: "2022",
      title: "La Conférence sur la Loi de Finances",
      subtitle: "Visioconférence annuelle",
      content:
        "La Conférence sur la Loi de Finances, organisée par le Club Forum GENI Entreprises INSEA, est une visioconférence annuelle dédiée à l'analyse des orientations budgétaires et macroéconomiques du Maroc. Placée sous un thème stratégique différent chaque année, elle explore les défis économiques actuels, les aspirations du pays, ainsi que les réponses structurelles proposées par la Loi de Finances. Ouverte aux étudiants ingénieurs et professionnels, elle offre un espace d'échange sur les impacts économiques des mesures budgétaires, la culture économique et le suivi des politiques publiques. La conférence est diffusée en direct sur les canaux officiels du club pour une large accessibilité et interaction.",
      highlight: "Événement en ligne - INSEA - 25/01/2022",
      images: [
        "https://maroc-ingenierie.ma/wp-content/uploads/2022/01/INSEA-LDF2022.jpg",
      ],
      bgColor: "from-blue-50/20 to-indigo-50/20"
    },
    {
      year: "2022",
      title: "Forum Geni Entreprise 18e Edition",
      subtitle: "Forum annuel étudiant",
      content:
        "Forum GENI Entreprises est un événement annuel majeur organisé conjointement par trois des plus prestigieuses écoles d'ingénieurs au Maroc : l'INSEA, l'ENSIAS et l'INPT. Pensé par les étudiants et pour les étudiants, ce forum a pour objectif de créer un pont direct entre le monde académique et le monde professionnel. L'organisation du Forum alterne entre les écoles, enrichissant ainsi chaque édition. L'évènement réunit de nombreuses entreprises, des étudiants et lauréats pour des conférences, stands, networking et opportunités de recrutement. C'est un espace stratégique permettant aux étudiants de découvrir le marché de l'emploi, dialoguer avec des professionnels, obtenir des stages ou emplois et développer leurs soft skills et réseau.",
      highlight: "ENSIAS • 23-24/03/2022",
      images: [
        "https://ensias.um5.ac.ma/sites/ensias.um5.ac.ma/files/images/news/Forum%20GENI-%20Entreprises2022.jpg",
      ],
      bgColor: "from-emerald-50/20 to-green-50/20"
    },
    {
      year: "2023",
      title: "Forum Geni Entreprise 19e Edition",
      subtitle: "Forum annuel étudiant",
      content:
        "Forum GENI Entreprises est un événement majeur réunissant INSEA, ENSIAS, et INPT. La 19e édition a rassemblé étudiants, lauréats et entreprises afin de créer un pont entre monde académique et professionnel. Au programme : conférences, networking, recrutement, et échanges avec professionnels du secteur. Le forum vise à informer sur les offres d'emplois et stages, à développer les soft skills et élargir le réseau professionnel des participants. Il est reconnu comme l'un des plus grands forums étudiants au Maroc.",
      highlight: "INSEA • 18-19/10/2023",
      images: [
        "https://insea.ac.ma/images/affiche_forum_2023.png",
      ],
      bgColor: "from-fuchsia-50/20 to-rose-50/20"
    },
    {
      year: "2023",
      title: "Conférence sur le PLF2023",
      subtitle: "Analyse du Projet de Loi de Finances",
      content:
        "La Conférence PLF, organisée par le Club Forum GENI Entreprises à l'INSEA, est une rencontre majeure dédiée à l'analyse du Projet de Loi de Finances. Elle réunit experts, institutionnels et étudiants autour des défis actuels et futurs de l'économie nationale. À travers des conférences animées par des personnalités de haut niveau, la manifestation analyse les mesures fiscales, leurs impacts, et débat des enjeux de durabilité, de justice sociale et de développement humain. Cet événement est une opportunité unique pour les étudiants d'approfondir leur compréhension des enjeux macroéconomiques.",
      highlight: "INSEA • 07/12/2023",
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9QwKFR-edFAh6QHLZ-GnIZCS-Tg1fg1zpJll_jpZOe_yY-G0On6U-XCwCGwNJ3MA6QuM&usqp=CAU",
      ],
      bgColor: "from-yellow-50/20 to-orange-50/20"
    },
    {
      year: "2023",
      title: "Speed JOB dating",
      subtitle: "Recrutement express étudiants-entreprises",
      content:
        "Le Speed Job Dating, organisé par le Club Forum GENI Entreprises, met en relation directe les étudiants et les entreprises lors d'entretiens courts et personnalisés sur deux jours. Les étudiants peuvent présenter leur profil, convaincre les recruteurs rapidement et décrocher des stages ou des emplois. Au-delà du recrutement, l'événement offre un cadre pour développer son réseau professionnel, améliorer son aisance à l'oral et comprendre les attentes du marché. C'est un vrai tremplin de carrière pour les étudiants des grandes écoles d'ingénieurs.",
      highlight: "INSEA • 14-15/12/2023",
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwr3k7cM46alRukcGl4RfHmv7cRQagQfE6bA&s",
      ],
      bgColor: "from-lime-50/20 to-green-50/20"
    },
    {
      year: "2024",
      title: "Forum Geni Entreprise 20e Edition",
      subtitle: "Forum annuel étudiant",
      content:
        "Forum GENI Entreprises, co-organisé par l'INSEA, l'ENSIAS et l'INPT, reste le plus grand rendez-vous étudiant-entreprise du Maroc. L'édition 2024 s'est déroulée à l'INPT, rassemblant entreprises nationales et internationales, étudiants et lauréats autour de conférences, stands, networking et recrutement. L'événement aide à comprendre le marché, échanger avec les professionnels, et vise à favoriser l'insertion des jeunes ingénieurs.",
      highlight: "INPT • 16-17/10/2024",
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTAjROsS32n61SUwTYB_IU--L67DDzYeSfw&s",
      ],
      bgColor: "from-sky-50/20 to-blue-50/20"
    },
    {
      year: "2024",
      title: "Visa D'embauche",
      subtitle: "Préparer son insertion professionnelle",
      content:
        "Visa d'Embauche est un événement organisé par le Club Forum GENI Entreprises pour préparer les étudiants à leur entrée sur le marché du travail. Il propose des ateliers pour optimiser son profil professionnel, améliorer CV et expériences, et préparer les entretiens d'embauche. Visa d'Embauche est un accompagnement stratégique pour aider les étudiants à se démarquer, prendre confiance et accéder sereinement aux opportunités de stage ou d'emploi.",
      highlight: "INSEA • 20/12/2024",
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV-94k-YxTYaVm3yDXP38hAreNUVbTsVpJ9OIGAUO82v0qaSWa1hjxy8XpVKOUDTzjZkg&usqp=CAU",
      ],
      bgColor: "from-violet-50/20 to-indigo-50/20"
    },
    {
      year: "2024",
      title: "Speed JOB dating",
      subtitle: "Recrutement express étudiants-entreprises",
      content:
        "Le Speed Job Dating, organisé par le Club Forum GENI Entreprises, permet de rapprocher étudiants et entreprises en entretiens courts et dynamiques sur plusieurs jours. L'événement valorise le potentiel des étudiants des grandes écoles d'ingénieurs et facilite leur insertion professionnelle.",
      highlight: "INSEA • 19-20/12/2024",
      images: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
      ],
      bgColor: "from-emerald-50/20 to-lime-50/20"
    },
    {
      year: "2025",
      title: "Oracle CAMPUS TOUR",
      subtitle: "Découverte carrière chez Oracle",
      content:
        "Oracle Campus Tour à l'INSEA permet aux étudiants de découvrir les opportunités de stages, PFE et d'emploi offertes par Oracle, leader mondial des technologies cloud et data. C'est un événement privilégié pour ceux qui envisagent une carrière dans la tech de haut niveau.",
      highlight: "INSEA • 17/04/2025",
      images: [
        "https://www.atalayar.com/media/atalayar/images/2022/05/19/20220519103922068626.jpg",
      ],
      bgColor: "from-red-50/20 to-orange-50/20"
    },
    {
      year: "2025",
      title: "Forum Geni Entreprise 21e Edition",
      subtitle: "Forum annuel étudiant",
      content:
        "La 21e édition du Forum GENI Entreprises organisée à l'ENSIAS renouvelle ce grand rendez-vous étudiant-entreprise. Toujours porté par l'INSEA, l'ENSIAS, et l'INPT, il reste la plus grande plateforme de rencontre entre étudiants ingénieurs et professionnels au Maroc, favorisant l'employabilité, le networking et l'insertion réussie.",
      highlight: "ENSIAS • 15-16/10/2025",
      images: [
        "https://drh-ma.s3.amazonaws.com/wp-content/uploads/2025/10/09120824/Forum-GENI-Entreprises-2025.jpg",
      ],
      bgColor: "from-pink-50/20 to-purple-50/20"
    },
  ];

  // Handler for changing images in a specific page
  const handleImageChange = (pageIdx: number, direction: 'next' | 'prev') => {
    const page = pages[pageIdx];
    const currentIdx = currentImageIndexes[pageIdx] || 0;
    const newIdx = direction === 'next'
      ? (currentIdx + 1) % page.images.length
      : (currentIdx - 1 + page.images.length) % page.images.length;

    setCurrentImageIndexes(prev => ({ ...prev, [pageIdx]: newIdx }));
  };

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
            className="absolute w-2 h-2 bg-neutral-300/20 "
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md border-2 border-neutral-200  mb-6 shadow"
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

        {/* Timeline with 3D book effect */}
        <div className="w-full flex flex-col gap-32 md:gap-48 px-4 md:px-8">
          {pages.map((page, idx) => {
            const currentImageIdx = currentImageIndexes[idx] || 0;
            const hasMultipleImages = page.images.length > 1;

            return (
              <div
                key={idx}
                className="relative max-w-7xl mx-auto w-full"
              >
                {/* Background accent */}
                <div
                  className={`absolute -inset-20 bg-gradient-to-br ${page.bgColor} rounded-3xl blur-3xl opacity-50`}
                  data-parallax={0.1 * (idx + 1)}
                />

                {/* Book container with perspective */}
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

                    {/* Year with 3D effect */}
                    <div className="text-center mb-6" data-parallax="0.5">
                      <div
                        className="inline-block relative"
                      >
                        <span className="text-6xl md:text-7xl font-bold text-neutral-200 font-serif select-none absolute -z-10 blur-sm">
                          {page.year}
                        </span>
                        <span className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-neutral-800 via-neutral-600 to-neutral-900 bg-clip-text text-transparent font-serif relative z-10">
                          {page.year}
                        </span>
                      </div>
                    </div>

                    {/* Image Gallery */}
                    <div
                      className="mb-8 overflow-hidden rounded-xl relative group/gallery ring-4 ring-neutral-300/30 hover:ring-neutral-400/50 transition-all"
                      data-parallax="0.4"
                    >
                      {/* Image counter badge */}
                      {hasMultipleImages && (
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold z-20 flex items-center gap-2">
                          <span className="text-xs">📸</span>
                          <span>{currentImageIdx + 1} / {page.images.length}</span>
                        </div>
                      )}

                      {/* Main Image */}
                      <img
                        src={page.images[currentImageIdx]}
                        alt={`${page.title} - Image ${currentImageIdx + 1}`}
                        className="w-full h-72 md:h-96 lg:h-[28rem] xl:h-[32rem] object-cover transition-all duration-500 group-hover/gallery:scale-105"
                      />

                      {/* Navigation arrows for multiple images */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={() => handleImageChange(idx, 'prev')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-black p-3 md:p-4 rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110 shadow-xl z-10"
                            aria-label="Image précédente"
                          >
                            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
                          </button>
                          <button
                            onClick={() => handleImageChange(idx, 'next')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-black p-3 md:p-4 rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110 shadow-xl z-10"
                            aria-label="Image suivante"
                          >
                            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
                          </button>

                          {/* Image indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                            {page.images.map((_, imgIdx) => (
                              <button
                                key={imgIdx}
                                onClick={() => setCurrentImageIndexes(prev => ({ ...prev, [idx]: imgIdx }))}
                                className={`rounded-full transition-all ${imgIdx === currentImageIdx
                                  ? 'bg-white w-8 h-3 shadow-lg'
                                  : 'bg-white/60 hover:bg-white/90 w-3 h-3'
                                  }`}
                                aria-label={`Voir image ${imgIdx + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Gallery for multiple images */}
                    {hasMultipleImages && page.images.length > 1 && (
                      <div className="mb-6">
                        <div className="flex gap-2 justify-center flex-wrap">
                          {page.images.map((img, imgIdx) => (
                            <button
                              key={imgIdx}
                              onClick={() => setCurrentImageIndexes(prev => ({ ...prev, [idx]: imgIdx }))}
                              className={`relative overflow-hidden rounded-lg transition-all hover:scale-105 ${imgIdx === currentImageIdx
                                ? 'ring-4 ring-neutral-600 shadow-xl scale-105'
                                : 'ring-2 ring-neutral-300 opacity-60 hover:opacity-100 hover:ring-neutral-400'
                                }`}
                            >
                              <img
                                src={img}
                                alt={`Miniature ${imgIdx + 1}`}
                                className="w-16 h-16 md:w-20 md:h-20 object-cover"
                              />
                              {imgIdx === currentImageIdx && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Badge */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 border border-neutral-300  shadow relative overflow-hidden group-hover:shadow-md transition-shadow">
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
            );
          })}
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
