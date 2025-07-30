'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Filter,
  TrendingUp,
  Users,
  Building2,
  Star,
  ArrowRight,
  Target,
  Zap
} from 'lucide-react';

const JobsHero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const jobTypes = [
    { id: 'all', label: 'Tous les postes', count: '150+' },
    { id: 'fulltime', label: 'Temps plein', count: '85+' },
    { id: 'internship', label: 'Stages', count: '45+' },
    { id: 'remote', label: 'Télétravail', count: '20+' }
  ];

  const stats = [
    { number: '150+', label: 'Offres d\'emploi', icon: Briefcase },
    { number: '75+', label: 'Entreprises partenaires', icon: Building2 },
    { number: '95%', label: 'Taux de placement', icon: TrendingUp },
    { number: '2.5k+', label: 'Candidats actifs', icon: Users }
  ];

  const featuredCompanies = [
    'Maroc Telecom', 'Bank AlMagrib', 'Oracle', 'Amazon', 'Apple', 'Banque Populaire'
  ];
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40'></div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Main Hero Content */}
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-flex items-center p-1 bg-white/10 backdrop-blur-xl rounded-full mb-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <span className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-full flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Offres d'emploi
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trouvez votre
              </span>
              <br />
              <span className="text-white">carrière idéale</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez les meilleures opportunités professionnelles avec nos entreprises partenaires 
              et donnez un nouvel élan à votre carrière
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Companies */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-8">
              Entreprises qui nous font confiance
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {featuredCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-gray-400 font-medium hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-60">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
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