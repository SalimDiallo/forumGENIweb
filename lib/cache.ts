/**
 * Module de cache pour Next.js
 *
 * Ce module fournit des wrappers autour de unstable_cache de Next.js
 * pour cacher les queries fréquentes et améliorer les performances.
 *
 * Tags de cache définis:
 * - 'events': Pour toutes les données d'événements
 * - 'blog': Pour tous les articles de blog
 * - 'testimonials': Pour tous les témoignages vidéo
 * - 'media': Pour toutes les médias de la galerie
 * - 'jobs': Pour toutes les offres d'emploi
 * - 'stats': Pour les statistiques du dashboard
 */

import { unstable_cache } from 'next/cache';
import { prisma } from './db';

/**
 * Cache: Événements à venir pour la homepage
 * TTL: 1 heure (3600s)
 * Tag: 'events'
 */
export const getCachedUpcomingEvents = unstable_cache(
  async (limit: number = 2) => {
    const events = await prisma.event.findMany({
      where: {
        status: "published",
        isFeatured: true,
        startDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        description: true,
        featuredImage: true,
        eventType: true,
        location: true,
        isVirtual: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        currentParticipants: true,
        isFeatured: true,
      
      },
    });

    return { events };
  },
  ['upcoming-events'],
  {
    revalidate: 3600, // 1 hour
    tags: ['events']
  }
);

/**
 * Cache: Tous les événements publiés
 * TTL: 1 heure (3600s)
 * Tag: 'events'
 */
export const getCachedEvents = unstable_cache(
  async () => {
    const events = await prisma.event.findMany({
      where: {
        status: 'published'
      },
      orderBy: {
        startDate: 'asc'
      }
    });
    return events;
  },
  ['events-list'],
  {
    revalidate: 3600, // 1 hour
    tags: ['events']
  }
);

/**
 * Cache: Événement par slug
 * TTL: 1 heure (3600s)
 * Tag: 'events'
 */
export const getCachedEventBySlug = unstable_cache(
  async (slug: string) => {
    const event = await prisma.event.findUnique({
      where: {
        slug,
        status: 'published'
      }
    });
    return event;
  },
  ['event-by-slug'],
  {
    revalidate: 3600, // 1 hour
    tags: ['events']
  }
);

/**
 * Cache: Événements similaires
 * TTL: 1 heure (3600s)
 * Tag: 'events'
 */
export const getCachedRelatedEvents = unstable_cache(
  async (currentEventId: number, eventType: string, limit: number = 3) => {
    const events = await prisma.event.findMany({
      where: {
        status: 'published',
        id: { not: currentEventId },
        eventType: eventType as any
      },
      orderBy: {
        startDate: 'desc'
      },
      take: limit
    });
    return events;
  },
  ['related-events'],
  {
    revalidate: 3600, // 1 hour
    tags: ['events']
  }
);






/**
 * Cache: Articles de blog publiés
 * TTL: 30 minutes (1800s)
 * Tag: 'blog'
 */
export const getCachedBlogPosts = unstable_cache(
  async (limit?: number) => {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'published'
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit,
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    return posts;
  },
  ['blog-posts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blog']
  }
);

/**
 * Cache: Article de blog par ID
 * TTL: 30 minutes (1800s)
 * Tag: 'blog'
 */
export const getCachedBlogPostById = unstable_cache(
  async (id: number) => {
    const post = await prisma.blogPost.findUnique({
      where: {
        id,
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
    return post;
  },
  ['blog-post-by-id'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blog']
  }
);

/**
 * Cache: Catégories de blog
 * TTL: 1 heure (3600s)
 * Tag: 'blog'
 */
export const getCachedBlogCategories = unstable_cache(
  async () => {
    const categories = await prisma.blogCategory.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
    return categories;
  },
  ['blog-categories'],
  {
    revalidate: 3600, // 1 hour
    tags: ['blog']
  }
);

/**
 * Cache: Articles de blog connexes
 * TTL: 30 minutes (1800s)
 * Tag: 'blog'
 */
export const getCachedRelatedBlogPosts = unstable_cache(
  async (currentPostId: number, categoryId: number | null, limit: number = 3) => {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'published',
        ...(categoryId !== null && { categoryId }),
        id: { not: currentPostId }
      },
      take: limit,
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
    return posts;
  },
  ['related-blog-posts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blog']
  }
);

/**
 * Cache: Articles de blog avec pagination (pour admin)
 * TTL: 5 minutes (300s)
 * Tag: 'blog'
 */
export const getCachedBlogPostsPaginated = unstable_cache(
  async (page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.blogPost.count()
    ]);

    const totalPages = Math.ceil(total / limit);
    return { posts, total, totalPages, currentPage: page };
  },
  ['blog-posts-paginated'],
  {
    revalidate: 300, // 5 minutes - plus court pour l'admin
    tags: ['blog']
  }
);

/**
 * Cache: Catégories de blog pour admin (avec compte)
 * TTL: 5 minutes (300s)
 * Tag: 'blog'
 */
export const getCachedBlogCategoriesAdmin = unstable_cache(
  async () => {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    return categories;
  },
  ['blog-categories-admin'],
  {
    revalidate: 300, // 5 minutes
    tags: ['blog']
  }
);

/**
 * Cache: Liste des jobs pour admin
 * TTL: 5 minutes (300s)
 * Tag: 'jobs'
 */
export const getCachedJobsAdmin = unstable_cache(
  async () => {
    const jobs = await prisma.jobOffer.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    return jobs;
  },
  ['jobs-admin'],
  {
    revalidate: 300, // 5 minutes
    tags: ['jobs', 'stats']
  }
);

/**
 * Cache: Messages de contact pour admin
 * TTL: 2 minutes (120s) - données sensibles au temps
 * Tag: 'crm'
 */
export const getCachedContactMessages = unstable_cache(
  async () => {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return messages;
  },
  ['contact-messages'],
  {
    revalidate: 120, // 2 minutes
    tags: ['crm']
  }
);

/**
 * Cache: Événements paginés pour admin
 * TTL: 5 minutes (300s)
 * Tag: 'events'
 */
export const getCachedEventsPaginated = unstable_cache(
  async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip,
        take: limit,
        orderBy: { startDate: "desc" }
      }),
      prisma.event.count()
    ]);

    const totalPages = Math.ceil(total / limit);
    return { events, total, totalPages, currentPage: page };
  },
  ['events-paginated'],
  {
    revalidate: 300, // 5 minutes
    tags: ['events']
  }
);

/**
 * Cache: Jobs paginés pour admin
 * TTL: 5 minutes (300s)
 * Tag: 'jobs'
 */
export const getCachedJobsPaginated = unstable_cache(
  async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.jobOffer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.jobOffer.count()
    ]);

    const totalPages = Math.ceil(total / limit);
    return { jobs, total, totalPages, currentPage: page };
  },
  ['jobs-paginated'],
  {
    revalidate: 300, // 5 minutes
    tags: ['jobs']
  }
);



/**
 * Cache: Offres d'emploi actives
 * TTL: 30 minutes (1800s)
 * Tag: 'jobs'
 */
export const getCachedActiveJobs = unstable_cache(
  async (limit?: number) => {
    const jobs = await prisma.jobOffer.findMany({
      where: {
        status: 'published',
        applicationDeadline: {
          gte: new Date()
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        companyName: true,
        companyLogo: true,
        companyWebsite: true,
        industry: true,
        jobType: true,
        location: true,
        isRemote: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        salaryPeriod: true,
        description: true,
        requirements: true,
        benefits: true,
        applicationEmail: true,
        applicationUrl: true,
        applicationPhone: true,
        applicationDeadline: true,
        experienceRequired: true,
        educationLevel: true,
        contractDuration: true,
        startDate: true,
        skillsRequired: true,
        languagesRequired: true,
        isFeatured: true,
        viewsCount: true,
        publishedAt: true,
        createdAt: true,
      }
    });
    return jobs;
  },
  ['active-jobs'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['jobs']
  }
);

/**
 * Cache: Statistiques du dashboard
 * TTL: 5 minutes (300s)
 * Tag: 'stats'
 *
 * Note: Les stats sont cachées avec un TTL court car elles doivent être relativement à jour
 */
export const getCachedDashboardStats = unstable_cache(
  async () => {
    const [
      totalEvents,
      upcomingEvents,
      totalBlogPosts,
      blogCategories,
      totalJobs,
      contacts,
      newContacts,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({
        where: {
          status: 'published',
          startDate: {
            gte: new Date()
          }
        }
      }),
      prisma.blogPost.count({
        where: {
          status: 'published'
        }
      }),
      prisma.blogCategory.count(),
      prisma.jobOffer.count({
        where: {
          status: 'published'
        }
      }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({
        where: {
          status: 'new'
        }
      }),
    
    
    ]);

    return {
      events: {
        total: totalEvents,
        upcoming: upcomingEvents
      },
      blog: {
        posts: totalBlogPosts,
        categories: blogCategories
      },
      jobs: {
        total: totalJobs
      },
      contacts: {
        total: contacts,
        new: newContacts
      },
     
    
    };
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // 5 minutes
    tags: ['stats']
  }
);
