'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GalleryFilters from './gallery/GalleryFilters';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryModal from './gallery/GalleryModal';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Tout', count: 9 },
    { id: 'forums', name: 'Forums', count: 3 },
    { id: 'workshops', name: 'Ateliers', count: 2 },
    { id: 'networking', name: 'Networking', count: 2 },
    { id: 'ceremonies', name: 'Cérémonies', count: 2 }
  ];

  const galleryItems = [
    {
      id: 1,
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      alt: 'Forum 2024 - Conférence principale',
      category: 'forums',
      title: 'Forum 2024 - Conférence principale',
      year: '2024',
      tags: ['conférence', 'innovation', 'technologie']
    },
    {
      id: 2,
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      alt: 'Atelier Innovation et Entrepreneuriat',
      category: 'workshops',
      title: 'Atelier Innovation et Entrepreneuriat',
      year: '2024',
      tags: ['atelier', 'entrepreneuriat', 'startup']
    },
    {
      id: 3,
      type: 'video' as const,
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      alt: 'Highlights Forum 2024',
      category: 'forums',
      title: 'Highlights Forum 2024',
      year: '2024',
      duration: '3:24',
      tags: ['highlights', 'résumé', 'moments forts']
    },
    {
      id: 4,
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
      alt: 'Session Networking',
      category: 'networking',
      title: 'Session Networking',
      year: '2024',
      tags: ['networking', 'échanges', 'professionnels']
    },
    {
      id: 5,
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      alt: 'Cérémonie de remise des prix',
      category: 'ceremonies',
      title: 'Cérémonie de remise des prix',
      year: '2023',
      tags: ['cérémonie', 'prix', 'récompenses']
    },
    {
      id: 6,
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      alt: 'Panel Discussion - Forum 2023',
      category: 'forums',
      title: 'Panel Discussion - Forum 2023',
      year: '2023',
      tags: ['panel', 'discussion', 'débat']
    },
    {
      id: 7,
      type: 'video' as const,
      src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
      alt: 'Témoignages participants',
      category: 'networking',
      title: 'Témoignages participants',
      year: '2023',
      duration: '5:12',
      tags: ['témoignages', 'participants', 'expériences']
    },
    {
      id: 8,
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
      alt: 'Atelier Technologies Émergentes',
      category: 'workshops',
      title: 'Atelier Technologies Émergentes',
      year: '2023',
      tags: ['technologie', 'innovation', 'futur']
    },
    {
      id: 9,
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=600&fit=crop',
      alt: 'Startup Pitch Competition',
      category: 'ceremonies',
      title: 'Concours de Pitch Startups',
      year: '2024',
      tags: ['startup', 'pitch', 'compétition']
    }
  ];

  // Filtrage
  const filteredItems = React.useMemo(() => {
    let items = galleryItems;

    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  // Navigation clavier
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
  }, [selectedImage]);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredItems.length);
    }
  }, [selectedImage, filteredItems.length]);

  const prevImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredItems.length - 1 : selectedImage - 1);
    }
  }, [selectedImage, filteredItems.length]);

  const toggleLike = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const downloadImage = async (src: string, title: string) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const shareImage = async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Découvrez cette image: ${item.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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

        {/* Filtres */}
        <GalleryFilters
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Grille */}
        <GalleryGrid
          items={filteredItems}
          viewMode={viewMode}
          openModal={openModal}
          likedItems={likedItems}
          toggleLike={toggleLike}
        />

        {/* Message si aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
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

        {/* Modal */}
        <GalleryModal
          selectedImage={selectedImage}
          items={filteredItems}
          closeModal={closeModal}
          nextImage={nextImage}
          prevImage={prevImage}
          downloadImage={downloadImage}
          shareImage={shareImage}
        />
      </div>
    </section>
  );
};

export default Gallery;
