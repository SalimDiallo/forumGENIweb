'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Search,
  Filter,
  Star,
  Users,
  Clock,
  Bookmark,
  Share,
  Eye
} from 'lucide-react';

const BlogHero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden flex items-center">
      {/* Animated Background Elements - Inspiré du Footer */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-pink-500 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Grid Pattern Overlay - Comme dans le Footer */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-60'></div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Badge Animé */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm font-medium mb-8 shadow-lg"
            >
              <Star className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Blog & Insights Exclusifs
              </span>
            </motion.div>

            {/* Titre Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="block">Découvrez nos</span>
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Insights & Actualités
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Plongez dans l'univers de l'innovation, des tendances business et des conseils d'experts. 
              Nos articles vous guident vers l'excellence et le succès professionnel.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Animated Wave Effect - Comme dans le Footer */}
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

BlogHero.displayName = 'BlogHero';

export default BlogHero;