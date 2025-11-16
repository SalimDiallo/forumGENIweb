import Blog from '@/components/Blog';
import { getCachedBlogPosts, getCachedBlogCategories } from '@/lib/cache';
import BlogListClient from './BlogListClient';

export default async function BlogPage() {
  // Récupérer les articles publiés depuis le cache
  const posts = await getCachedBlogPosts(20); // Limiter à 20 articles

  // Récupérer les catégories
  const categories = await getCachedBlogCategories();

  return (
    <main>
      {/* <Blog /> */}
      <BlogListClient posts={posts} categories={categories} />
    </main>
  );
}
