// components/Hero.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, ArrowRight, Users, Award, Building, Sparkles } from 'lucide-react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const [windowSize, setWindowSize] = React.useState({ width: 1920, height: 1080 });
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    // Initialiser les dimensions de la fenêtre côté client
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

  return (
    <section className="relative flex flex-col justify-end min-h-screen items-center overflow-hidden bg-black pt-24">
      {/* Video Background */}
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

        {/* Gradient Overlays pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-emerald-900/20" />

        {/* Effet de vignette */}
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
          {/* Contenu principal */}
          <div className="text-center mb-4 sm:mb-8 md:mb-12">
            {/* Badge moderne avec glow effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center mb-4 sm:mb-6"
            >
              <div className="relative group">
                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600/10 to-emerald-500/10 backdrop-blur-2xl border border-emerald-500/30  shadow-2xl shadow-emerald-500/20">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold text-sm sm:text-base tracking-wide">Forum INSEA 2025</span>
                  <div className="w-2 h-2 bg-emerald-400  animate-pulse shadow-lg shadow-emerald-400"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 to-emerald-400/30  blur-2xl group-hover:blur-3xl transition-all duration-500 -z-10"></div>
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
                <div className="p-3 sm:p-4 bg-white/90 backdrop-blur-3xl border-2 border-white/30 rounded-3xl shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105">
                  <Image
                    src="/logo 4.png"
                    alt="Forum GENI Entreprises"
                    width={80}
                    height={80}
                    className="h-12 w-auto sm:h-16 md:h-20"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-emerald-400/20 rounded-3xl blur-3xl group-hover:blur-[40px] transition-all duration-500 -z-10"></div>
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
                <span className="block bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  FORUM
                </span>
                <span className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent mt-1 sm:mt-2">
                  GENI × INSEA
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-12 sm:w-20 md:w-24"></div>
                <span className="text-sm sm:text-lg md:text-xl text-white/90 font-semibold tracking-widest">
                  2025
                </span>

                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-12 sm:w-20 md:w-24"></div>
              </div>
            </motion.div>

            {/* Description améliorée */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-white/90 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed"
            >
              <span className="font-medium">Là où l'excellence académique rencontre l'innovation professionnelle.</span>
              <br className="hidden sm:block" />
              <span className="text-emerald-300 font-light">Une convergence unique d'expertise et de leadership</span>
            </motion.p>

            {/* Boutons CTA premium */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 md:mb-16"
            >
              <Link href="/events" prefetch={true}>
                <motion.button
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold  overflow-hidden shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all duration-500 text-sm sm:text-base"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="relative flex items-center gap-2 sm:gap-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Rejoindre le Forum 2025</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </motion.button>
              </Link>

              <Link href="/events" prefetch={true}>
                <motion.button
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-2xl border-2 border-white/30 text-white font-semibold  hover:bg-white/20 hover:border-white/50 transition-all duration-500 shadow-2xl text-sm sm:text-base"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2">
                    Découvrir nos événements
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Cards statistiques premium */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {[
              {
                icon: Calendar,
                title: "3-5 Mai 2025",
                subtitle: "Forum Annuel",
                color: "from-emerald-600 to-teal-500",
                gradient: "from-emerald-600/20 to-teal-500/20"
              },
              {
                icon: Users,
                title: "500+ Experts",
                subtitle: "Réseau Premium",
                color: "from-cyan-600 to-blue-500",
                gradient: "from-cyan-600/20 to-blue-500/20"
              },
              {
                icon: Award,
                title: "Excellence",
                subtitle: "Depuis 2002",
                color: "from-amber-600 to-orange-500",
                gradient: "from-amber-600/20 to-orange-500/20"
              },
              {
                icon: Building,
                title: "INSEA Rabat",
                subtitle: "Campus Innovation",
                color: "from-purple-600 to-pink-500",
                gradient: "from-purple-600/20 to-pink-500/20"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="group relative"
                whileHover={{ y: -8 }}
              >
                <div className="relative p-4 sm:p-5 md:p-6 bg-white/5 backdrop-blur-3xl border border-white/10  hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl">
                  {/* Icon avec gradient */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4  bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  {/* Contenu */}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 font-medium">
                    {item.subtitle}
                  </p>

                  {/* Glow effect au hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100  transition-opacity duration-500 blur-2xl -z-10`}></div>

                  {/* Border glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20  transition-opacity duration-500`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

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
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/40  flex justify-center relative group hover:border-emerald-400 transition-colors duration-300">
            <motion.div
              className="w-1 h-2 bg-white  mt-2 group-hover:bg-emerald-400 transition-colors duration-300"
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