'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import GalleryModal from './gallery/GalleryModal';
import type { GalleryItem } from '@/lib/types/gallery';

/**
 * Répartition aléatoire (déterministe) pour effet visuel du bento grid.
 * Peut être modifié pour adapter les formes selon le type, etc.
 */
function getBentoGridArea(index: number) {
  // Un motif de tuiles façon bento, répétitif tous les 10 éléments
  // Les motifs sont Tailwind grid-area classes (col-span, row-span)
  const patterns = [
    'col-span-2 row-span-2', // Large
    'col-span-1 row-span-2', // Haute
    'col-span-1 row-span-1', // Petite
    'col-span-2 row-span-1', // Largeur
    '',                      // Standard 1x1
    '',                      // Standard 1x1
    'col-span-1 row-span-2', // Haute
    '',                      // Standard 1x1
    'col-span-2 row-span-1', // Wide
    '',                      // Standard 1x1
  ];
  return patterns[index % patterns.length];
}

interface GalleryProps {
  items: GalleryItem[];
  categories: Array<{ id: string; name: string; count: number }>;
}

const Gallery = ({ items: galleryItems, categories }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Catégorie ouverte dans la modal
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Grouper les items par ÉVÉNEMENT (dossiers qui contiennent directement les médias)
  // Chaque événement (ex: "Forum Spring 2025") sera représenté par une carte
  const eventsWithFirstImage = React.useMemo(() => {
    const eventsMap = new Map<string, { 
      event: { id: string; name: string; count: number; category: string; year: string }; 
      firstImage: GalleryItem | null; 
      count: number 
    }>();

    galleryItems.forEach(item => {
      const eventId = item.event.toLowerCase().replace(/\s+/g, '-');
      const existing = eventsMap.get(eventId);
      if (existing) {
        if (!existing.firstImage) {
          existing.firstImage = item;
        } else if (item.type === 'image' && existing.firstImage.type === 'video') {
          existing.firstImage = item;
        }
        existing.count++;
      } else {
        eventsMap.set(eventId, {
          event: {
            id: eventId,
            name: item.event,
            count: 1,
            category: item.category,
            year: item.year
          },
          firstImage: item,
          count: 1
        });
      }
    });

    const result = Array.from(eventsMap.values())
      .filter(eventData => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return eventData.event.name.toLowerCase().includes(query) ||
                 eventData.event.category.toLowerCase().includes(query) ||
                 eventData.event.year.includes(query) ||
                 eventData.firstImage?.title.toLowerCase().includes(query);
        }
        return true;
      })
      .filter(eventData => {
        if (activeCategory !== 'all') {
          // Compare with category ID from categories list
          const categoryId = eventData.event.category.toLowerCase().replace(/\s+/g, '-');
          return categoryId === activeCategory;
        }
        return true;
      })
      .sort((a, b) => {
        const yearCompare = b.event.year.localeCompare(a.event.year);
        if (yearCompare !== 0) return yearCompare;
        return a.event.name.localeCompare(b.event.name);
      });

    return result;
  }, [galleryItems, activeCategory, searchQuery]);

  const eventItems = React.useMemo(() => {
    if (!selectedCategory) return [];
    const items = galleryItems.filter(item => {
      const itemEventId = item.event.toLowerCase().replace(/\s+/g, '-');
      return itemEventId === selectedCategory;
    });
    return items;
  }, [galleryItems, selectedCategory]);

  const openEventModal = (eventId: string) => {
    setSelectedCategory(eventId);
    setSelectedImage(0);
  };

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setSelectedCategory(null);
  }, []);

  const nextImage = useCallback(() => {
    if (selectedImage !== null && eventItems.length > 0) {
      setSelectedImage((selectedImage + 1) % eventItems.length);
    }
  }, [selectedImage, eventItems.length]);

  const prevImage = useCallback(() => {
    if (selectedImage !== null && eventItems.length > 0) {
      setSelectedImage(selectedImage === 0 ? eventItems.length - 1 : selectedImage - 1);
    }
  }, [selectedImage, eventItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'Escape':
          e.preventDefault();
          closeModal();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, prevImage, nextImage, closeModal]);

  const handleCardImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const originalSrc = img.src;

    // eslint-disable-next-line no-console
    console.error('Erreur chargement image carte:', {
      originalSrc,
      alt: img.alt,
      thumbnail: img.dataset.thumbnail,
      src: img.dataset.src,
    });

    // Try different fallback strategies
    const thumbnailUrl = img.dataset.thumbnail;
    const srcUrl = img.dataset.src;

    // Strategy 1: Try thumbnail if we were using src
    if (srcUrl && originalSrc.includes(srcUrl.split('=')[0]) && thumbnailUrl) {
      console.log('Tentative avec thumbnail URL...');
      img.src = thumbnailUrl;
      return;
    }

    // Strategy 2: Try src if we were using thumbnail
    if (thumbnailUrl && originalSrc.includes(thumbnailUrl.split('=')[0]) && srcUrl) {
      console.log('Tentative avec source URL...');
      img.src = srcUrl;
      return;
    }

    // Strategy 3: Fallback to placeholder
    if (!img.src.includes('/fallback-image.jpg')) {
      console.log('Utilisation du placeholder');
      img.src = '/fallback-image.jpg';
    }
  };

  // --- BENTO GRID ---
  // Largeur max : 5 colonnes sur desktop, 2 sur mobile
  // Inspiration bento grid, styles flexibles (motif via getBentoGridArea)
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* En-tête */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galerie Photo & Vidéo
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Revivez les moments marquants de nos événements
          </p>
        </div>

        {/* Filtres - Recherche d'événements */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div
          className={`
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            auto-rows-[120px]
            gap-4
            mb-8
          `}
        >
          {eventsWithFirstImage.map((eventData, index) => {
            const bentoClass = getBentoGridArea(index);
            return (
              <div
                key={eventData.event.id}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  shadow-md
                  bg-white
                  cursor-pointer
                  transition
                  hover:shadow-xl
                  ${bentoClass}
                  flex
                  items-stretch
                  min-h-0
                `}
                tabIndex={0}
                aria-label={eventData.event.name}
                onClick={() => openEventModal(eventData.event.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openEventModal(eventData.event.id)}
              >
                {eventData.firstImage && (
                  <Image
                    src={eventData.firstImage?.thumbnail || eventData.firstImage?.src || '/fallback-image.jpg'}
                    alt={eventData.firstImage?.alt || eventData.event.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleCardImageError}
                    draggable={false}
                    unoptimized
                    data-thumbnail={eventData.firstImage?.thumbnail}
                    data-src={eventData.firstImage?.src}
                  />
                )}
                {/* Overlay */}
                <div className={`
                  absolute inset-0
                  bg-gradient-to-t
                  from-black via-transparent to-transparent
                  opacity-70
                  pointer-events-none
                `} />
                {/* Texte événement */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col space-y-2 z-10 text-white">
                  <span className="font-bold text-base md:text-lg truncate">{eventData.event.name}</span>
                  <div className="flex items-center space-x-2 text-xs md:text-sm">
                    <span className="bg-emerald-600/80 rounded px-2 py-0.5 mr-1">{eventData.event.category}</span>
                    <span>{eventData.event.year}</span>
                    <span>•</span>
                    <span>{eventData.count} media{eventData.count > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message si aucun résultat */}
        {eventsWithFirstImage.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Aucun événement trouvé</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Modal - Utilise eventItems pour la navigation dans l'événement sélectionné */}
        {selectedImage !== null && eventItems.length > 0 && (
          <GalleryModal
            selectedImage={selectedImage}
            items={eventItems}
            closeModal={closeModal}
            nextImage={nextImage}
            prevImage={prevImage}
          />
        )}
      </div>
    </section>
  );
};

export default Gallery;
