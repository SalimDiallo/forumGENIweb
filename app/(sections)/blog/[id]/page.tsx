import { getCachedBlogPostById, getCachedRelatedBlogPosts } from '@/lib/cache';
import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Revalidation toutes les 30 minutes pour ISR
export const revalidate = 1800;

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  // Utiliser la fonction cachée pour récupérer l'article
  const post = await getCachedBlogPostById(postId);

  if (!post) {
    notFound();
  }

  // Récupérer les articles connexes avec cache
  const relatedPosts = await getCachedRelatedBlogPosts(postId, post.categoryId);

  return <BlogDetailClient post={post} relatedPosts={relatedPosts} />;
}
