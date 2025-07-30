// components/Hero.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Users, Award, Building, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section
      className="flex flex-col relative justify-center items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 overflow-x-hidden"
      style={{
        backgroundImage: "url('/insea-building.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full h-full absolute inset-0 pointer-events-none z-0 bg-black opacity-80" /> {/* décorations supprimées */}

      {/* Éléments décoratifs flottants */}
      {/* Removed absolute decorations */}
      
      <div className="container mx-auto px-2 sm:px-4 md:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Contenu principal */}
          <div className="text-center mb-4 sm:mb-8 md:mb-12">
            {/* Badge moderne */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center mb-4 sm:mb-6"
            >
              <div className="relative">
                <div className="flex items-center gap-1 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                  <span className="text-white/90 font-medium text-xs sm:text-base">Forum INSEA 2025</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-xl -z-10"></div>
              </div>
            </motion.div>

            {/* Logo avec effet glassmorphisme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 sm:mb-10 flex justify-center"
            >
              <div className="relative">
                <div className="p-2 sm:p-6 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
                  <Image
                    src="/logo 4.png"
                    alt="Forum GENI Entreprises"
                    width={80}
                    height={80}
                    className="h-10 w-auto sm:h-20"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl blur-2xl -z-10"></div>
              </div>
            </motion.div>

            {/* Titre avec typographie moderne */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-4 sm:mb-8"
            >
              <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-1 sm:mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                  FORUM
                </span>
                <br />
                <span className="text-lg xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-emerald-300">
                  GENI × INSEA
                </span>
              </h1>
              <div className="flex items-center justify-center gap-1 sm:gap-4 mt-2 sm:mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-8 sm:w-24"></div>
                <p className="text-xs sm:text-xl text-white/70 font-light tracking-wide">2025</p>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-8 sm:w-24"></div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xs sm:text-xl text-white/80 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto mb-6 sm:mb-12 leading-relaxed font-light"
            >
              Là où l'excellence académique rencontre l'innovation professionnelle.
              <br />
              <span className="text-emerald-300">Une convergence unique d'expertise et de leadership.</span>
            </motion.p>

            {/* Boutons CTA modernes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-4 sm:mb-12"
            >
              <Link href="/events" prefetch={true}>
                <motion.button 
                  className="group relative px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 text-xs sm:text-base"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-1 sm:gap-3">
                    <Calendar className="w-3 h-3 sm:w-5 sm:h-5" />
                    Rejoindre le Forum 2025
                    <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </Link>
              
              <Link href="/events" prefetch={true}>
                <motion.button 
                  className="px-4 sm:px-8 py-2 sm:py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/15 transition-all duration-300 shadow-xl text-xs sm:text-base"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Découvrir nos événements
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Cards statistiques modernes */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6"
          >
            {[
              {
                icon: Calendar,
                title: "3-5 Mai 2025",
                subtitle: "Forum Annuel",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: Users,
                title: "500+ Experts",
                subtitle: "Réseau Premium",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Award,
                title: "Excellence",
                subtitle: "Depuis 2002",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Building,
                title: "INSEA Rabat",
                subtitle: "Campus Innovation",
                color: "from-orange-500 to-red-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="group relative"
              >
                <div className={`relative p-2 sm:p-4 md:p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-md sm:hover:shadow-2xl`}>
                  <div className={`w-7 h-7 sm:w-12 sm:h-12 mb-2 sm:mb-4 rounded-lg sm:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow`}>
                    <item.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-base md:text-lg font-bold text-white mb-0.5 sm:mb-1">{item.title}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-white/70 font-light">{item.subtitle}</p>
                  {/* Effet de glow au hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-xl sm:rounded-2xl md:rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Indicateur de scroll minimaliste */}
      <div className="flex flex-col items-center justify-end w-full mt-4 sm:mt-8 mb-2 sm:mb-4 grow">
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-4 h-7 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-0.5 h-2 bg-white rounded-full mt-1 sm:w-1 sm:h-3 sm:mt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;