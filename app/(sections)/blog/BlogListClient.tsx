'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Search } from 'lucide-react';

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

// Sobre image component, no effects or strong color
const BlogImage = ({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);
  const fallbackSrc =
    "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80";
  return (
    <Image
      src={error || !src ? fallbackSrc : src}
      alt={alt}
      width={800}
      height={400}
      className={className}
      onError={() => setError(true)}
      unoptimized
      style={{
        objectFit: "cover",
        backgroundColor: "#f5f5f5",
      }}
    />
  );
};

export default function BlogListClient({
  posts,
  categories,
}: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const categoriesWithAll = [
    { slug: "all", name: "Tous", count: posts.length },
    ...categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      count: cat._count.posts,
    })),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "all" || post.category.slug === activeCategory;
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" ||
      post.title.toLowerCase().includes(trimmedSearch) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(trimmedSearch)) ||
      post.tags.some(({ tag }) =>
        tag.name.toLowerCase().includes(trimmedSearch)
      ) ||
      post.category.name.toLowerCase().includes(trimmedSearch);
    return matchesCategory && matchesSearch;
  });

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSearchTerm(inputValue.trim());
  }

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Blog
          </h1>
          <p className="text-base text-gray-600 mt-2">
            Retrouvez nos actualités, articles et analyses.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search */}
          <form
            className="relative w-full md:w-72"
            onSubmit={handleSearch}
            aria-label="Recherche articles"
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Recherche..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-white w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-100 text-sm outline-none"
            />
          </form>
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-3 md:mt-0">
            {categoriesWithAll.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors border ${
                  activeCategory === category.slug
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category.name}
                <span
                  className={`ml-2 text-xs ${
                    activeCategory === category.slug ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Liste des articles */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg"
            >
              <article className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-shadow h-full flex flex-col shadow-sm hover:shadow-md">
                {/* Image */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <BlogImage
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover bg-gray-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2 py-0.5 text-xs font-normal rounded text-white"
                      style={{
                        backgroundColor: post.category.color,
                        opacity: 0.85,
                      }}
                    >
                      {post.category.name}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    <span className="ml-2">{post.readTimeMinutes} min</span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-1 leading-tight group-hover:text-gray-800">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-2 mt-auto pt-3">
                    <span className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </span>
                    <span className="text-sm text-gray-700">{post.authorName}</span>
                    {post.authorPosition && (
                      <span className="text-xs text-gray-400 ml-2">{post.authorPosition}</span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 mb-5 text-sm">
              Essayez d’ajuster votre recherche ou vos filtres.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchTerm("");
                setInputValue("");
              }}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-md font-normal hover:bg-gray-800 transition"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </section>
  );
}