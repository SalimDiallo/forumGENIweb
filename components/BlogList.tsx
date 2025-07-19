'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';

const BlogList = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'innovation', name: 'Innovation' },
    { id: 'entrepreneuriat', name: 'Entrepreneuriat' },
    { id: 'carrieres', name: 'Carrières' },
    { id: 'industrie', name: 'Industrie' },
    { id: 'evenements', name: 'Événements' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "L'Intelligence Artificielle transforme-t-elle vraiment l'industrie marocaine ?",
      excerpt: "Une analyse approfondie de l'impact de l'IA sur les secteurs clés de l'économie marocaine et les opportunités qu'elle présente pour les entrepreneurs locaux.",
      image: "/blog/ai-morocco.jpg",
      author: "Dr. Amina Benali",
      date: "2025-01-15",
      readTime: "8 min",
      category: "innovation",
      tags: ["IA", "Industrie", "Maroc"]
    },
    {
      id: 2,
      title: "10 conseils pour réussir sa startup au Maroc en 2025",
      excerpt: "Guide pratique pour les entrepreneurs qui souhaitent lancer leur startup au Maroc, avec des conseils d'experts et des témoignages inspirants.",
      image: "/blog/startup-tips.jpg",
      author: "Youssef Alami",
      date: "2025-01-10",
      readTime: "6 min",
      category: "entrepreneuriat",
      tags: ["Startup", "Conseil", "Entrepreneuriat"]
    },
    {
      id: 3,
      title: "Forum 2024 : Retour sur un succès exceptionnel",
      excerpt: "Découvrez les moments forts de notre 16ème édition, les partenariats conclus et l'impact généré sur notre communauté d'entrepreneurs.",
      image: "/blog/forum-2024-recap.jpg",
      author: "Équipe FGE",
      date: "2024-12-20",
      readTime: "5 min",
      category: "evenements",
      tags: ["Forum", "Bilan", "2024"]
    },
    {
      id: 4,
      title: "Les métiers du futur : Comment préparer sa carrière ?",
      excerpt: "Exploration des nouvelles opportunités professionnelles émergentes et des compétences à développer pour rester compétitif sur le marché du travail.",
      image: "/blog/future-jobs.jpg",
      author: "Salma Berrada",
      date: "2024-12-15",
      readTime: "7 min",
      category: "carrieres",
      tags: ["Carrière", "Futur", "Compétences"]
    },
    {
      id: 5,
      title: "La transformation digitale dans l'industrie manufacturière",
      excerpt: "Comment les entreprises marocaines adoptent les technologies 4.0 pour améliorer leur productivité et leur compétitivité internationale.",
      image: "/blog/digital-transformation.jpg",
      author: "Mehdi Fassi",
      date: "2024-12-05",
      readTime: "9 min",
      category: "industrie",
      tags: ["Digital", "Industrie 4.0", "Productivité"]
    },
    {
      id: 6,
      title: "L'écosystème startup marocain : État des lieux 2024",
      excerpt: "Analyse complète de l'évolution de l'écosystème entrepreneurial marocain, ses forces, défis et perspectives d'avenir.",
      image: "/blog/startup-ecosystem.jpg",
      author: "Rachid Ouali",
      date: "2024-11-28",
      readTime: "10 min",
      category: "entrepreneuriat",
      tags: ["Écosystème", "Startup", "Maroc"]
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Filtres de catégories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-green-800 text-white'
                  : 'bg-green-50 text-green-800 hover:bg-green-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Articles en vedette */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-green-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                      Article vedette
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-green-200 mb-6">
                    {filteredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-green-200 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      {filteredPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(filteredPosts[0].date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {filteredPosts[0].readTime}
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${filteredPosts[0].id}`}
                    className="inline-flex items-center gap-2 bg-white text-green-800 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors w-fit"
                  >
                    Lire l'article
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-green-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-green-800 text-white text-xs rounded">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-green-700/80 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-3 text-sm text-green-600 mb-4">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1 text-green-800 font-medium hover:text-green-600 transition-colors"
                  >
                    Lire
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination ou "Voir plus" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
            Voir plus d'articles
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogList;
