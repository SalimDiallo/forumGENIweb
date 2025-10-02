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
      className="flex flex-col justify-end min-h-screen  items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-30 overflow-x-hidden"
      style={{
        backgroundImage: "url('/insea-building.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full h-full absolute inset-0 pointer-events-none z-0 bg-black opacity-80" />
      
      <div className="container mx-auto px-2 sm:px-4 md:px-6 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Contenu principal */}
          <div className="text-center mb-3 sm:mb-6 md:mb-8">
            {/* Badge moderne */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center mb-3 sm:mb-4"
            >
              <div className="relative">
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  <span className="text-white/90 font-medium text-xs sm:text-sm">Forum INSEA 2025</span>
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 to-emerald-500/20 rounded-full blur-xl -z-10"></div>
              </div>
            </motion.div>

            {/* Logo avec effet glassmorphisme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4 sm:mb-6 flex justify-center"
            >
              <div className="relative">
                <div className="p-1.5 sm:p-3 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl">
                  <Image
                    src="/logo 4.png"
                    alt="Forum GENI Entreprises"
                    width={60}
                    height={60}
                    className="h-8 w-auto sm:h-12"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/10 to-emerald-500/10 rounded-2xl blur-2xl -z-10"></div>
              </div>
            </motion.div>

            {/* Titre avec typographie moderne */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-3 sm:mb-5"
            >
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 sm:mb-2 tracking-tight">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                  FORUM
                </span>
                <br />
                <span className="text-sm xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-emerald-300">
                  GENI × INSEA
                </span>
              </h1>
              <div className="flex items-center justify-center gap-1 sm:gap-3 mt-1 sm:mt-3">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent w-6 sm:w-16"></div>
                <p className="text-xs sm:text-base text-white/70 font-light tracking-wide">2025</p>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent w-6 sm:w-16"></div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xs sm:text-sm text-white/80 max-w-xs sm:max-w-lg md:max-w-xl mx-auto mb-4 sm:mb-8 leading-relaxed font-light"
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
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-3 sm:mb-8"
            >
              <Link href="/events" prefetch={true}>
                <motion.button 
                  className="group relative px-3 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-semibold rounded-xl overflow-hidden shadow-2xl hover:shadow-emerald-700/25 transition-all duration-300 text-xs sm:text-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-1 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    Rejoindre le Forum 2025
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </Link>
              
              <Link href="/events" prefetch={true}>
                <motion.button 
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-all duration-300 shadow-xl text-xs sm:text-sm"
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
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
          >
            {[
              {
                icon: Calendar,
                title: "3-5 Mai 2025",
                subtitle: "Forum Annuel",
                color: "from-emerald-700 to-teal-500"
              },
              {
                icon: Users,
                title: "500+ Experts",
                subtitle: "Réseau Premium",
                color: "from-emerald-500 to-cyan-500"
              },
              {
                icon: Award,
                title: "Excellence",
                subtitle: "Depuis 2002",
                color: "from-emerald-500 to-pink-500"
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
                <div className={`relative p-1.5 sm:p-3 md:p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-md sm:hover:shadow-2xl`}>
                  <div className={`w-5 h-5 sm:w-8 sm:h-8 mb-1.5 sm:mb-2 rounded-md sm:rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow`}>
                    <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-0.5 sm:mb-1">{item.title}</h3>
                  <p className="text-[10px] sm:text-xs text-white/70 font-light">{item.subtitle}</p>
                  {/* Effet de glow au hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-lg sm:rounded-xl md:rounded-2xl transition-opacity duration-500 blur-xl`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Indicateur de scroll minimaliste */}
      <div className="flex flex-col items-center justify-end w-full mt-3 sm:mt-6 mb-2 sm:mb-3 grow">
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-3 h-5 sm:w-4 sm:h-7 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-0.5 h-1.5 bg-white rounded-full mt-1 sm:w-1 sm:h-2 sm:mt-1"
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