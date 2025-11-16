'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  BookOpen,
  PenLine,
  Eye,
  Users,
} from 'lucide-react';

const BlogHero = () => {
  // Pour l'avenir: recherche, catégories, etc.
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Un background qui évoque la lecture, l'écriture, l'inspiration
  return (
    <section
      className="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center bg-slate-900 text-white overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, rgba(30,41,59,0.98) 60%, rgba(16,185,129,0.10) 100%), url('/blog-hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-900/80 z-0"></div>

      {/* Illustration de lecture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Livre ouvert */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.13, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <BookOpen size={340} className="text-white/80 drop-shadow-2xl" />
        </motion.div>
        {/* Plume */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.10, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="hidden md:block absolute right-24 top-1/3"
        >
          <PenLine size={120} className="text-emerald-300/80 rotate-12" />
        </motion.div>
        {/* Oeil (lecture) */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 0.10, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="hidden md:block absolute left-20 bottom-24"
        >
          <Eye size={90} className="text-emerald-300/80" />
        </motion.div>
        {/* Silhouettes (communauté) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 0.08, x: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="hidden md:block absolute left-16 top-1/4"
        >
          <Users size={80} className="text-emerald-200/80" />
        </motion.div>
      </div>

      {/* Motifs de pages */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className='absolute inset-0 opacity-60'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Crect x='10' y='10' width='40' height='40' rx='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        ></div>
      </div>

      {/* Contenu principal */}
      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Badge animé */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20  text-sm font-medium mb-8 shadow-lg"
          >
            <Star className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              Blog & Lectures Inspirantes
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="block">Explorez, lisez, partagez</span>
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-400 bg-clip-text text-transparent block">
              Le Blog du Forum
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Plongez dans des articles, analyses et conseils pour nourrir votre curiosité, 
            stimuler votre réflexion et enrichir votre parcours professionnel. 
            <span className="hidden md:inline"> La lecture ouvre de nouveaux horizons&nbsp;!</span>
          </motion.p>
        </div>
      </div>

      {/* Effet de vague animée */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-500 opacity-70">
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

BlogHero.displayName = 'BlogHero';

export default BlogHero;