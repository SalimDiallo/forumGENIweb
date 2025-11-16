import { getCachedBlogPostById } from '@/lib/cache';
import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';
import { prisma } from '@/lib/db';

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  // Récupérer l'article avec tous ses détails
  const post = await prisma.blogPost.findUnique({
    where: {
      id: postId,
      status: 'published'
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  if (!post) {
    notFound();
  }

  // Récupérer les articles connexes (même catégorie)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: 'published',
      categoryId: post.categoryId,
      id: { not: postId }
    },
    take: 3,
    orderBy: {
      publishedAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      featuredImage: true,
      readTimeMinutes: true,
      category: {
        select: {
          name: true,
          color: true
        }
      }
    }
  });

  return <BlogDetailClient post={post} relatedPosts={relatedPosts} />;
}
