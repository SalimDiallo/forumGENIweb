'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
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

      <div className="relative z-10">
        {/* Main Hero Content - Conteneur limité */}
        <div className="container mx-auto px-3 py-8">
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
          </div>
        </div>

        {/* Featured Companies - Pleine largeur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full mt-4"
        >
          <h3 className="text-sm font-semibold text-emerald-200 mb-5 tracking-wide flex items-center justify-center gap-2 px-4">
            <span className="inline-block w-8 h-px bg-gradient-to-r from-transparent to-emerald-400" />
            Nos entreprises partenaires de confiance
            <span className="inline-block w-8 h-px bg-gradient-to-l from-transparent to-emerald-400" />
          </h3>

          {/* Conteneur avec fade effect sur les bords - Pleine largeur */}
          <div className="relative w-full overflow-hidden py-2">
            {/* Gradient fade left */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />

            {/* Gradient fade right */}
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />

            {/* Double ligne de défilement pour effet continu */}
            <div className="flex flex-col gap-3">
              {/* Ligne 1 - Défilement de gauche à droite */}
              <div className="flex animate-marquee-ltr">
                {[...featuredCompanies.slice(0, 6), ...featuredCompanies.slice(0, 6), ...featuredCompanies.slice(0, 6)].map((company, idx) => (
                  <div
                    key={`ltr-${idx}`}
                    className="flex-shrink-0 mx-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-gray-300 text-xs font-medium hover:text-white hover:bg-white/15 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group whitespace-nowrap"
                  >
                    <span className="relative">
                      {company}
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    </span>
                  </div>
                ))}
              </div>

              {/* Ligne 2 - Défilement de droite à gauche */}
              <div className="flex animate-marquee-rtl">
                {[...featuredCompanies.slice(6), ...featuredCompanies.slice(6), ...featuredCompanies.slice(6)].map((company, idx) => (
                  <div
                    key={`rtl-${idx}`}
                    className="flex-shrink-0 mx-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-gray-300 text-xs font-medium hover:text-white hover:bg-white/15 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group whitespace-nowrap"
                  >
                    <span className="relative">
                      {company}
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
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