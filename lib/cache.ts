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
        _count: {
          select: {
            registrations: true,
          },
        },
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
 * Cache: Témoignages actifs
 * TTL: 1 heure (3600s)
 * Tag: 'testimonials'
 */
export const getCachedActiveTestimonials = unstable_cache(
  async (limit: number = 6) => {
    const testimonials = await prisma.videoTestimonial.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
      ],
      take: limit,
    });

    return { testimonials };
  },
  ['active-testimonials'],
  {
    revalidate: 3600, // 1 hour
    tags: ['testimonials']
  }
);

/**
 * Cache: Témoignages en vedette
 * TTL: 1 heure (3600s)
 * Tag: 'testimonials'
 */
export const getCachedFeaturedTestimonials = unstable_cache(
  async (limit: number = 3) => {
    const testimonials = await prisma.videoTestimonial.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      take: limit,
    });

    return { testimonials };
  },
  ['featured-testimonials'],
  {
    revalidate: 3600, // 1 hour
    tags: ['testimonials']
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
 * Cache: Médias de la galerie
 * TTL: 1 heure (3600s)
 * Tag: 'media'
 */
export const getCachedGalleryMedia = unstable_cache(
  async () => {
    const media = await prisma.mediaGallery.findMany({
      where: {
        isPublic: true
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    return media;
  },
  ['gallery-media'],
  {
    revalidate: 3600, // 1 hour
    tags: ['media']
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
      totalMedia,
      testimonials,
      activeTestimonials,
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
      prisma.mediaGallery.count(),
      prisma.videoTestimonial.count(),
      prisma.videoTestimonial.count({
        where: {
          isActive: true
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
      media: {
        total: totalMedia
      },
      testimonials: {
        total: testimonials,
        active: activeTestimonials
      },
    };
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // 5 minutes
    tags: ['stats']
  }
);
