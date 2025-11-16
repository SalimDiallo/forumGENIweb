'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  User,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  Heart,
  Eye,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Link2 as LinkIcon,
  ChevronRight
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
type BlogPost = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  authorName: string;
  authorPosition: string | null;
  readTimeMinutes: number;
  viewsCount: number;
  likesCount: number;
  publishedAt: Date | null;
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

type RelatedPost = {
  id: number;
  title: string;
  featuredImage: string | null;
  readTimeMinutes: number;
  category: {
    name: string;
    color: string;
  };
};

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: RelatedPost[];
}



export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    // TODO: Implémenter l'action de like côté serveur
  };

  const shareOptions = [
    { icon: Twitter, name: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: Facebook, name: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Linkedin, name: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: LinkIcon, name: 'Copier le lien', color: 'hover:bg-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* Barre de navigation supérieure */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="top-0 z-50 pt-4"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-2 text-emerald-800 hover:text-emerald-900 font-semibold group">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Retour aux articles</span>
            </Link>

            <div className="flex items-center gap-3">
          
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-emerald-100 p-2 min-w-[200px]"
                  >
                    {shareOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 ${option.color} hover:text-white transition-all`}
                      >
                        <option.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{option.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-emerald-700">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-emerald-700">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-emerald-700 font-medium">{post.category.name}</span>
        </div>
      </div>

      {/* En-tête de l'article */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Catégorie et stats */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span
              className="px-4 py-1.5 text-white text-sm font-semibold rounded-full shadow-md"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
            {/* <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewsCount.toLocaleString()} vues
              </div>
            </div> */}
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl md:text-5xl font-bold text-emerald-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Sous-titre / excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Métadonnées auteur */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center border-2 border-emerald-300">
                <User className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <div className="font-semibold text-emerald-900">{post.authorName}</div>
                {post.authorPosition && (
                  <div className="text-sm text-gray-600">{post.authorPosition}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTimeMinutes} min de lecture
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image principale */}
      {post.featuredImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="container mx-auto px-4 mb-12"
        >
          <div className="max-w-5xl mx-auto">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-[400px] md:h-[600px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </motion.div>
      )}

      {/* Contenu principal */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 md:p-4 mb-12"
          >
            <MarkdownRenderer content={post.content} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-emerald-100">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-emerald-700" />
                  <span className="font-semibold text-emerald-900">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 rounded-lg hover:opacity-80 transition-all font-medium text-sm text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bio auteur */}
            <div className="mt-8 p-4 rounded-xl border">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border">
                  <User className="w-8 h-8 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{post.authorName}</h3>
                  {post.authorPosition && (
                    <p className="text-sm mb-3">{post.authorPosition}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.article>

          {/* Articles connexes */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">Articles connexes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/blog/${related.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={related.featuredImage || "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80"}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className="px-3 py-1 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                            style={{ backgroundColor: related.category.color }}
                          >
                            {related.category.name}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-emerald-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                          {related.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {related.readTimeMinutes} min
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
