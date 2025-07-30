'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Tag, Search, Filter, TrendingUp, Star } from 'lucide-react';

const BlogList = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'all', name: 'Tous', count: 6, icon: Filter },
    { id: 'innovation', name: 'Innovation', count: 1, icon: TrendingUp },
    { id: 'entrepreneuriat', name: 'Entrepreneuriat', count: 2, icon: Star },
    { id: 'carrieres', name: 'Carrières', count: 1, icon: User },
    { id: 'industrie', name: 'Industrie', count: 1, icon: Tag },
    { id: 'evenements', name: 'Événements', count: 1, icon: Calendar }
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
      tags: ["IA", "Industrie", "Maroc"],
      featured: true,
      views: "2.5K"
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
      tags: ["Startup", "Conseil", "Entrepreneuriat"],
      views: "1.8K"
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
      tags: ["Forum", "Bilan", "2024"],
      views: "3.2K"
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
      tags: ["Carrière", "Futur", "Compétences"],
      views: "1.4K"
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
      tags: ["Digital", "Industrie 4.0", "Productivité"],
      views: "2.1K"
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
      tags: ["Écosystème", "Startup", "Maroc"],
      views: "2.7K"
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50/30">
      <div className="container mx-auto px-4">
        {/* Header avec search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Explorez nos derniers articles
          </h2>
          <p className="text-black/80 mb-8 max-w-2xl mx-auto">
            Restez informé des dernières tendances et innovations avec notre sélection d'articles experts
          </p>
          
          {/* Barre de recherche */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Filtres de catégories améliorés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-black to-emerald-700 text-white shadow-lg'
                    : 'bg-white/70 backdrop-blur-sm text-black hover:bg-green-50 border border-green-100 hover:border-green-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Article en vedette amélioré */}
        <AnimatePresence mode="wait">
          {featuredPost && (
            <motion.div
              key={featuredPost.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <div className="relative bg-gradient-to-br from-green-800 via-black to-emerald-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>
                
                <div className="relative grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-80 lg:h-auto overflow-hidden">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-green-800/20"></div>
                  </div>
                  
                  <div className="relative p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-full shadow-lg">
                        ⭐ Article vedette
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                        {featuredPost.views} vues
                      </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-green-100 mb-8 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-green-200 text-sm mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <User size={16} />
                        </div>
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(featuredPost.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {featuredPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/blog/${featuredPost.id}`}
                      className="group inline-flex items-center gap-3 bg-white text-green-800 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 hover:shadow-lg hover:scale-105 w-fit"
                    >
                      Lire l'article complet
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grille d'articles améliorée */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-green-100/50 hover:border-green-200"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-black/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                      {post.views}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-900 mb-3 line-clamp-2 group-hover:text-black transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-black/80 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-green-600 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <User size={12} />
                      </div>
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-green-50 text-black text-xs rounded-lg font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/blog/${post.id}`}
                      className="group/link inline-flex items-center gap-2 text-black font-semibold hover:text-green-600 transition-colors"
                    >
                      Lire
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </AnimatePresence>

        {/* Message si aucun résultat */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">Aucun article trouvé</h3>
            <p className="text-black/80 mb-6">Essayez de modifier vos filtres ou votre recherche</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}

        {/* Bouton "Voir plus" amélioré */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button className="group px-10 py-4 bg-gradient-to-r from-black to-emerald-700 text-white rounded-xl font-semibold hover:from-green-800 hover:to-emerald-800 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-3 mx-auto">
              Charger plus d'articles
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogList;