'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Tag, Search, Filter, TrendingUp, Star } from 'lucide-react';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  authorName: string;
  authorPosition: string | null;
  readTimeMinutes: number;
  isFeatured: boolean;
  publishedAt: Date | null;
  viewsCount: number;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
  tags: Array<{
    tag: {
      id: number;
      name: string;
      slug: string;
      color: string;
    };
  }>;
};

type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  color: string;
  _count: {
    posts: number;
  };
};

interface BlogListClientProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

// Composant d'image avec placeholder en cas d'erreur
const BlogImage = ({ src, alt, className }: { src: string | null; alt: string; className?: string }) => {
  const [error, setError] = useState(false);
  const fallbackSrc = "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80";

  return (
    <Image
      src={error || !src ? fallbackSrc : src}
      alt={alt}
      width={800}
      height={400}
      className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${className}`}
      onError={() => setError(true)}
      unoptimized
    />
  );
};

export default function BlogListClient({ posts, categories }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Préparer les catégories avec icônes
  const categoryIcons: Record<string, React.ElementType> = {
    all: Filter,
    default: Tag,
  };

  const categoriesWithAll = [
    { id: 'all', slug: 'all', name: 'Tous', count: posts.length, icon: Filter },
    ...categories.map(cat => ({
      id: cat.slug,
      slug: cat.slug,
      name: cat.name,
      count: cat._count.posts,
      icon: categoryIcons[cat.slug.toLowerCase()] || Tag,
    }))
  ];

  // Filtrage des articles
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category.slug === activeCategory;
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.tags.some(({ tag }) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(post => post.isFeatured) || filteredPosts[0];
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
          {categoriesWithAll.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 text-sm ${
                  activeCategory === category.slug
                    ? 'bg-gradient-to-r from-black to-emerald-900 text-white shadow'
                    : 'bg-white/70 backdrop-blur-sm text-black hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {category.name}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === category.slug
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
              <div className="relative bg-gradient-to-br from-emerald-800 via-black to-emerald-800 rounded-xl overflow-hidden shadow-lg">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3">
                  <div className="relative h-40 md:col-span-1 overflow-hidden">
                    <BlogImage
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  <div className="relative p-4 md:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-emerald-700 to-emerald-700 text-white text-xs font-semibold rounded-full shadow">
                        ⭐ Article vedette
                      </span>
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                        {featuredPost.viewsCount} vues
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
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <User size={12} />
                        </div>
                        {featuredPost.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {featuredPost.publishedAt && new Date(featuredPost.publishedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {featuredPost.tags.slice(0, 3).map(({ tag }, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                        >
                          #{tag.name}
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
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 border border-emerald-100/50 hover:border-emerald-200"
              >
                <div className="relative overflow-hidden">
                  <BlogImage
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span
                      className="px-2 py-0.5 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
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
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User size={10} />
                      </div>
                      {post.authorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTimeMinutes} min
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(({ tag }, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-1.5 py-0.5 bg-emerald-50 text-black text-xs rounded font-medium"
                        >
                          #{tag.name}
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
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
      </div>
    </section>
  );
}
