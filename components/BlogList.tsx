'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Tag, Search, Filter, TrendingUp, Star, Image as ImageIcon } from 'lucide-react';

// Composant d'image avec placeholder en cas d'erreur de chargement
const BlogImage = ({
  src,
  alt,
  width,
  height,
  className,
  rounded = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  rounded?: boolean;
}) => {
  const [error, setError] = useState(false);
  // Pour forcer le fallback sur Next.js <Image>, on peut utiliser un wrapper div
  return error ? (
    <Image
      src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80"
      alt="Image non disponible"
      width={width}
      height={height}
      unoptimized
      draggable={false}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      unoptimized
    />
  );
};

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
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // AI/industry
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
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80", // Startup/entrepreneur
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
      image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=800&q=80", // Event/conference
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
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", // Future/career
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
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", // Digital/industry
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
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // Startup/ecosystem
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
    <section className="py-10 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="container mx-auto px-2">
        {/* Header avec search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
            Explorez nos derniers articles
          </h2>
          <p className="text-black/80 mb-6 max-w-xl mx-auto text-base">
            Restez informé des dernières tendances et innovations avec notre sélection d'articles experts
          </p>
          
          {/* Barre de recherche */}
          <div className="relative max-w-xs mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-700 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none text-sm transition-all"
            />
          </div>
        </motion.div>

        {/* Filtres de catégories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 text-sm ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-black to-emerald-900 text-white shadow'
                    : 'bg-white/70 backdrop-blur-sm text-black hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {category.name}
                <span className={`text-xs px-1.5 py-0.5  ${
                  activeCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Article en vedette compact */}
        <AnimatePresence mode="wait">
          {featuredPost && (
            <motion.div
              key={featuredPost.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative bg-gradient-to-br from-emerald-800 via-black to-emerald-800  overflow-hidden shadow-lg">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white  -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300  translate-y-1/2 -translate-x-1/2"></div>
                </div>
                
                <div className="relative grid grid-cols-1 md:grid-cols-3">
                  <div className="relative h-40 md:col-span-1 overflow-hidden">
                    <BlogImage
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      width={320}
                      height={160}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      rounded={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  
                  <div className="relative p-4 md:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-emerald-700 to-emerald-700 text-white text-xs font-semibold  shadow">
                        ⭐ Article vedette
                      </span>
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs ">
                        {featuredPost.views} vues
                      </span>
                    </div>
                    
                    <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight line-clamp-2">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-emerald-100 mb-3 text-sm leading-relaxed line-clamp-2">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-emerald-200 text-xs mb-3">
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-white/20  flex items-center justify-center">
                          <User size={12} />
                        </div>
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(featuredPost.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {featuredPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white text-xs  border border-white/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/blog/${featuredPost.id}`}
                      className="group inline-flex items-center gap-2 bg-white text-emerald-800 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300 hover:shadow hover:scale-105 w-fit text-sm"
                    >
                      Lire l'article
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grille d'articles compacte */}
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group bg-white  overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 border border-emerald-100/50 hover:border-emerald-200"
              >
                <div className="relative overflow-hidden">
                  <BlogImage
                    src={post.image}
                    alt={post.title}
                    width={240}
                    height={120}
                    className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-105"
                    rounded={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-black/90 backdrop-blur-sm text-white text-xs font-medium ">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 bg-black/50 backdrop-blur-sm text-white text-xs ">
                      {post.views}
                    </span>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-base font-bold text-emerald-900 mb-1 line-clamp-2 group-hover:text-black transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-black/80 mb-2 line-clamp-2 text-xs leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-emerald-800 mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-emerald-100  flex items-center justify-center">
                        <User size={10} />
                      </div>
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-1.5 py-0.5 bg-emerald-50 text-black text-xs rounded font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/blog/${post.id}`}
                      className="group/link inline-flex items-center gap-1 text-black font-semibold hover:text-emerald-800 transition-colors text-xs"
                    >
                      Lire
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
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
            className="text-center py-10"
          >
            <div className="w-16 h-16 bg-emerald-100  flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-emerald-800" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-1">Aucun article trouvé</h3>
            <p className="text-black/80 mb-4 text-sm">Essayez de modifier vos filtres ou votre recherche</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-black text-white rounded hover:bg-emerald-800 transition-colors text-sm"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}

        {/* Bouton "Voir plus" compact */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <button className="group px-6 py-2 bg-gradient-to-r from-black to-emerald-900 text-white rounded-lg font-semibold hover:from-emerald-800 hover:to-emerald-800 transition-all duration-300 hover:shadow hover:scale-105 flex items-center gap-2 mx-auto text-sm">
              Charger plus d'articles
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white "
              />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogList;