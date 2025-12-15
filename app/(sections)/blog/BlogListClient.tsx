'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Clock, Search } from 'lucide-react';

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
      className={className}
      onError={() => setError(true)}
      unoptimized
    />
  );
};

export default function BlogListClient({ posts, categories }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const categoriesWithAll = [
    { slug: 'all', name: 'Tous', count: posts.length },
    ...categories.map(cat => ({
      slug: cat.slug,
      name: cat.name,
      count: cat._count.posts,
    }))
  ];

  // Filtrage
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category.slug === activeCategory;
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === '' ||
      post.title.toLowerCase().includes(trimmedSearch) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(trimmedSearch)) ||
      post.tags.some(({ tag }) => tag.name.toLowerCase().includes(trimmedSearch)) ||
      post.category.name.toLowerCase().includes(trimmedSearch);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(post => post.isFeatured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSearchTerm(inputValue.trim());
  }

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos derniers articles, analyses et conseils pour nourrir votre réflexion.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Search */}
          <form
            className="relative w-full md:w-80"
            onSubmit={handleSearch}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-gray-50"
            />
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categoriesWithAll.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category.slug
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.name}
                <span className={`ml-1.5 text-xs ${activeCategory === category.slug ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.id}`} className="block mb-12 group">
            <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <BlogImage
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1.5 text-white text-sm font-medium rounded-full"
                      style={{ backgroundColor: featuredPost.category.color }}
                    >
                      {featuredPost.category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.publishedAt && new Date(featuredPost.publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTimeMinutes} min
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{featuredPost.authorName}</div>
                      {featuredPost.authorPosition && (
                        <div className="text-sm text-gray-500">{featuredPost.authorPosition}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <article className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <BlogImage
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 text-white text-xs font-medium rounded-full"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTimeMinutes} min
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{post.authorName}</span>
                    </div>
                    <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lire <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600 mb-6">Essayez de modifier vos filtres ou votre recherche</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
                setInputValue('');
              }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
}