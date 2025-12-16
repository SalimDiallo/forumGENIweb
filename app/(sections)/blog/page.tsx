import Blog from '@/components/Blog';
import { getCachedBlogPosts, getCachedBlogCategories } from '@/lib/cache';
import BlogListClient from './BlogListClient';
import PageHero from '@/components/PageHero';

export default async function BlogPage() {
  // Récupérer les articles publiés depuis le cache
  const posts = await getCachedBlogPosts(20); // Limiter à 20 articles

  // Récupérer les catégories
  const categories = await getCachedBlogCategories();

  return (
    <main>
      <PageHero
        title="Blog"
        subtitle="Actualités, conseils carrière et insights du marché de l'emploi"
        image="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80"
        badge="Actualités & Insights"
      />
      <BlogListClient posts={posts} categories={categories} />
    </main>
  );
}
