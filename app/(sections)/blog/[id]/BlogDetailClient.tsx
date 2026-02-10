'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  User,
  Clock,
  Tag,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButton from '@/components/ui/ShareButton';

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

const fallbackImage =
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80";

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour aux articles</span>
            </Link>
            <ShareButton
              title={post.title}
              description={post.excerpt || ''}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{post.category.name}</span>
        </div>
      </div>

      {/* Article Header */}
      <header className="container mx-auto px-4 pt-8 pb-8 max-w-4xl">
        {/* Category Badge */}
        <div className="mb-6">
          <span
            className="inline-block px-4 py-1.5 text-white text-sm font-medium rounded-full"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Author & Meta */}
        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{post.authorName}</div>
              {post.authorPosition && (
                <div className="text-sm text-gray-500">{post.authorPosition}</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTimeMinutes} min de lecture
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container mx-auto px-4 mb-12 max-w-5xl">
        <div className="rounded-2xl overflow-hidden">
          <Image
            src={post.featuredImage || fallbackImage}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="prose prose-lg prose-gray max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-900">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Écrit par</div>
              <h3 className="font-bold text-gray-900 text-lg">{post.authorName}</h3>
              {post.authorPosition && (
                <p className="text-gray-600">{post.authorPosition}</p>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Articles connexes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.id}`} className="group">
                  <article className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={related.featuredImage || fallbackImage}
                        alt={related.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-1 text-white text-xs font-medium rounded-full"
                          style={{ backgroundColor: related.category.color }}
                        >
                          {related.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{related.readTimeMinutes} min</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
