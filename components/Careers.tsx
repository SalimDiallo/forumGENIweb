'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp,
  Users,
  Building2
} from 'lucide-react';

const JobsHero = () => {
  // Diminuer la hauteur et la taille des éléments
  // const stats = [
  //   // { number: '150+', label: 'Offres d\'emploi', icon: Briefcase },
  //   // { number: '75+', label: 'Entreprises partenaires', icon: Building2 },
  //   // { number: '95%', label: 'Taux de placement', icon: TrendingUp },
  //   // { number: '2.5k+', label: 'Candidats actifs', icon: Users }
  // ];

  const featuredCompanies = [
    'Attijariwafa bank',
    'INWI',
    'Orange',
    'Office Chérifien des Phosphates (Groupe OCP)',
    'Airports Of Morocco',
    'Maroc Telecom',
    'DXC Technology',
    'Caisse de Dépôt et de Gestion (CDG)',
    'Banque Populaire',
    'Royal Air Maroc',
    'Crédit du Maroc',
    'Orange Business'
  ];

  return (
    <section className="relative min-h-[320px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements (beaucoup plus petits) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-8 left-4 w-32 h-32 bg-emerald-700  blur-2xl animate-pulse"></div>
        <div className="absolute bottom-8 right-4 w-40 h-40 bg-emerald-500  blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-emerald-500  blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30'></div>

      <div className="relative z-10 container mx-auto px-3 py-8">
        {/* Main Hero Content */}
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-6"
          >
            <motion.div 
              className="inline-flex items-center p-0.5 bg-white/10 backdrop-blur-xl  mb-3 border border-white/20"
              whileHover={{ scale: 1.04 }}
            >
              <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-emerald-700 to-emerald-600 text-white  flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Offres d'emploi
              </span>
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-400 bg-clip-text text-transparent">
                Trouvez votre
              </span>
              <br />
              <span className="text-white">carrière idéale</span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              Découvrez les meilleures opportunités professionnelles avec nos entreprises partenaires 
              et donnez un nouvel élan à votre carrière
            </p>
          </motion.div>

          {/* Stats Grid */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-xl  p-3 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-700/20 to-emerald-500/20  mb-2 group-hover:scale-105 transition-transform duration-200">
                  <stat.icon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-bold mb-1 bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-xs font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Featured Companies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-base font-semibold text-emerald-200 mb-4 tracking-wide flex items-center justify-center gap-2">
              <span className="inline-block w-7 h-0.5 bg-emerald-400  opacity-80" />
              Nos entreprises partenaires de confiance
              <span className="inline-block w-7 h-0.5 bg-emerald-400  opacity-80" />
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-3 opacity-60">
              {featuredCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  className="px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 text-gray-400 text-xs font-medium hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  whileHover={{ scale: 1.07, y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Wave Effect (plus fin) */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-500 opacity-60">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-400"
          animate={{ 
            background: [
              'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
              'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)',
              'linear-gradient(90deg, #8b5cf6, #10b981, #3b82f6)',
              'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </section>
  );
};

export default JobsHero;