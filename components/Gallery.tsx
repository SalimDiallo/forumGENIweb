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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Catégorie de l'image ouverte dans la modal
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrage - Affichage d'une seule image par catégorie sur la page principale
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

    // Si aucun filtre actif, afficher seulement la première image de chaque catégorie
    if (activeCategory === 'all' && !searchQuery) {
      const firstImagePerCategory = new Map<string, GalleryItem>();
      items.forEach(item => {
        if (!firstImagePerCategory.has(item.category)) {
          firstImagePerCategory.set(item.category, item);
        }
      });
      return Array.from(firstImagePerCategory.values());
    }

    return items;
  }, [galleryItems, activeCategory, searchQuery]);

  // Items de la catégorie sélectionnée pour la navigation dans la modal
  const categoryItems = React.useMemo(() => {
    if (!selectedCategory) {
      // Si aucune catégorie sélectionnée, retourner les items filtrés
      return filteredItems;
    }
    // Filtrer par catégorie exacte (avec normalisation)
    const normalizedCategory = selectedCategory.toLowerCase().replace(/\s+/g, '-');
    const items = galleryItems.filter(item => {
      const itemCategory = item.category.toLowerCase().replace(/\s+/g, '-');
      return itemCategory === normalizedCategory;
    });
    console.log('CategoryItems calculé:', {
      selectedCategory,
      normalizedCategory,
      itemsCount: items.length,
      firstItem: items[0] ? { id: items[0].id, src: items[0].src, category: items[0].category } : null
    });
    return items.length > 0 ? items : filteredItems;
  }, [galleryItems, selectedCategory, filteredItems]);

  const openModal = (index: number) => {
    const item = filteredItems[index];
    if (!item) {
      console.error('Item not found at index:', index, 'filteredItems length:', filteredItems.length);
      return;
    }
    
    console.log('Ouverture modal:', {
      index,
      itemId: item.id,
      itemCategory: item.category,
      itemSrc: item.src,
      filteredItemsCount: filteredItems.length,
      galleryItemsCount: galleryItems.length
    });
    
    setSelectedCategory(item.category); // Mémoriser la catégorie de l'image sélectionnée
    // Trouver l'index dans les items de la catégorie (filtrer directement ici)
    const normalizedCategory = item.category.toLowerCase().replace(/\s+/g, '-');
    const itemsInCategory = galleryItems.filter(catItem => {
      const catItemCategory = catItem.category.toLowerCase().replace(/\s+/g, '-');
      return catItemCategory === normalizedCategory;
    });
    
    console.log('Items dans la catégorie:', {
      category: normalizedCategory,
      itemsCount: itemsInCategory.length,
      items: itemsInCategory.map(i => ({ id: i.id, src: i.src }))
    });
    
    const categoryIndex = itemsInCategory.findIndex(catItem => catItem.id === item.id);
    setSelectedImage(categoryIndex >= 0 ? categoryIndex : 0);
  };

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setSelectedCategory(null);
  }, []);

  const nextImage = useCallback(() => {
    if (selectedImage !== null && categoryItems.length > 0) {
      setSelectedImage((selectedImage + 1) % categoryItems.length);
    }
  }, [selectedImage, categoryItems.length]);

  const prevImage = useCallback(() => {
    if (selectedImage !== null && categoryItems.length > 0) {
      setSelectedImage(selectedImage === 0 ? categoryItems.length - 1 : selectedImage - 1);
    }
  }, [selectedImage, categoryItems.length]);

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
  }, [selectedImage, prevImage, nextImage, closeModal]);

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

        {/* Modal - Utilise categoryItems pour la navigation dans la catégorie sélectionnée */}
        {selectedImage !== null && categoryItems.length > 0 && (
          <GalleryModal
            selectedImage={selectedImage}
            items={categoryItems}
            closeModal={closeModal}
            nextImage={nextImage}
            prevImage={prevImage}
            downloadImage={downloadImage}
            shareImage={shareImage}
          />
        )}
      </div>
    </section>
  );
};

export default Gallery;
