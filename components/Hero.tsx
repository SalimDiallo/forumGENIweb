// components/Hero.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Users, Award, Building, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28">
      {/* Background avec effet parallax et overlay moderne */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/insea-building.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-emerald-900/85"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
      </div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Contenu principal */}
          <div className="text-center mb-16">
            {/* Badge moderne */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center mb-8"
            >
              <div className="relative">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/90 font-medium">Forum INSEA 2025</span>
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
              className="mb-12 flex justify-center"
            >
              <div className="relative">
                <div className="p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
                  <Image
                    src="/logo 4.png"
                    alt="Forum GENI Entreprises"
                    width={180}
                    height={180}
                    className="h-24 w-auto drop-shadow-2xl"
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
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                  FORUM
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl font-light text-emerald-300">
                  GENI × INSEA
                </span>
              </h1>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-24"></div>
                <p className="text-xl text-white/70 font-light tracking-wide">2025</p>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-24"></div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
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
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/events" prefetch={true}>
                <motion.button 
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    Rejoindre le Forum 2025
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </Link>
              
              <Link href="/events" prefetch={true}>
                <motion.button 
                  className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/15 transition-all duration-300 shadow-xl"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                <div className="relative p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/70 text-sm font-light">{item.subtitle}</p>
                  
                  {/* Effet de glow au hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Indicateur de scroll minimaliste */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10"
        animate={{ 
          y: [0, 8, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;