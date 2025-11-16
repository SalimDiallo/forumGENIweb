'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GalleryFilters from './gallery/GalleryFilters';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryModal from './gallery/GalleryModal';
import type { GalleryItem } from '@/lib/types/gallery';

interface GalleryProps {
  items: GalleryItem[];
  categories: Array<{ id: string; name: string; count: number }>;
}

const Gallery = ({ items: galleryItems, categories }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

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

  const toggleLike = (itemId: string, e: React.MouseEvent) => {
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
