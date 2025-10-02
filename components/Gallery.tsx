'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Download, Share2, Heart, Eye, Search, Grid3X3, List } from 'lucide-react';

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
      type: 'image',
      src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      alt: 'Forum 2024 - Conférence principale',
      category: 'forums',
      title: 'Forum 2024 - Conférence principale',
      year: '2024',
      tags: ['conférence', 'innovation', 'technologie']
    },
    {
      id: 2,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      alt: 'Atelier Innovation et Entrepreneuriat',
      category: 'workshops',
      title: 'Atelier Innovation et Entrepreneuriat',
      year: '2024',
   
      tags: ['atelier', 'entrepreneuriat', 'startup']
    },
    {
      id: 3,
      type: 'video',
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
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
      alt: 'Session Networking',
      category: 'networking',
      title: 'Session Networking',
      year: '2024',
      views: 734,
      likes: 42,
      tags: ['networking', 'échanges', 'professionnels']
    },
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      alt: 'Cérémonie de remise des prix',
      category: 'ceremonies',
      title: 'Cérémonie de remise des prix',
      year: '2023',
   
      tags: ['cérémonie', 'prix', 'récompenses']
    },
    {
      id: 6,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      alt: 'Panel Discussion - Forum 2023',
      category: 'forums',
      title: 'Panel Discussion - Forum 2023',
      year: '2023',
  
      tags: ['panel', 'discussion', 'débat']
    },
    {
      id: 7,
      type: 'video',
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
      type: 'image',
      src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
      alt: 'Atelier Technologies Émergentes',
      category: 'workshops',
      title: 'Atelier Technologies Émergentes',
      year: '2023',
     
      tags: ['technologie', 'innovation', 'futur']
    },
    {
      id: 9,
      type: 'image',
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

  // Composant pour les éléments de la grille
  const GridItem = ({ item, index }: { item: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => openModal(index)}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.type === 'video' ? item.thumbnail! : item.src}
            alt={item.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <Play className="ml-1" size={20} />
              </div>
            </div>
          )}
          
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {item.year}
          </div>

          {item.type === 'video' && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {item.duration}
            </div>
          )}

          {/* <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => toggleLike(item.id, e)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                likedItems.has(item.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart size={14} fill={likedItems.has(item.id) ? 'currentColor' : 'none'} />
            </button>
          </div> */}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          {/* <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{item.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{item.likes + (likedItems.has(item.id) ? 1 : 0)}</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </motion.div>
  );

  // Composant pour les éléments de la liste
  const ListItem = ({ item, index }: { item: any, index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => openModal(index)}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row">
          {/* Image/Thumbnail */}
          <div className="relative w-full sm:w-48 h-32 sm:h-24 flex-shrink-0 overflow-hidden">
            <img
              src={item.type === 'video' ? item.thumbnail! : item.src}
              alt={item.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="ml-0.5" size={14} />
                </div>
              </div>
            )}
            
            <div className="absolute top-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
              {item.year}
            </div>

            {item.type === 'video' && (
              <div className="absolute top-1 right-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                {item.duration}
              </div>
            )}
          </div>
          
          {/* Contenu */}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 sm:line-clamp-2">
                  {item.title}
                </h3>
                
                {/* Tags (cachés sur mobile) */}
                <div className="hidden sm:flex flex-wrap gap-1 mb-2">
                  {item.tags.slice(0, 3).map((tag:string, tagIndex:number) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Stats */}
                {/* <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span className="hidden xs:inline">{item.views.toLocaleString()}</span>
                    <span className="xs:hidden">{(item.views / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>{item.likes + (likedItems.has(item.id) ? 1 : 0)}</span>
                  </div>
                </div> */}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    likedItems.has(item.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart size={14} fill={likedItems.has(item.id) ? 'currentColor' : 'none'} />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

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

        {/* Barre de recherche et contrôles */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-6">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md mx-auto lg:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              />
            </div>

            {/* Mode d'affichage */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1 mx-auto lg:mx-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Vue grille"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-emerald-700 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Vue liste"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="hidden xs:inline">{category.name} ({category.count})</span>
                <span className="xs:hidden">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item, index) => (
              <GridItem key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <ListItem key={item.id} item={item} index={index} />
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun contenu trouvé</h3>
            <p className="text-gray-500 mb-4 px-4">Essayez de modifier vos filtres de recherche</p>
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
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-[95vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Contrôles */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 z-10">
                  <button
                    onClick={() => downloadImage(
                      filteredItems[selectedImage].src,
                      filteredItems[selectedImage].title
                    )}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Download size={16} className="sm:hidden" />
                    <Download size={18} className="hidden sm:block" />
                  </button>
                  <button
                    onClick={() => shareImage(filteredItems[selectedImage])}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Share2 size={16} className="sm:hidden" />
                    <Share2 size={18} className="hidden sm:block" />
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X size={16} className="sm:hidden" />
                    <X size={18} className="hidden sm:block" />
                  </button>
                </div>
                
                {/* Navigation */}
                {filteredItems.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                    >
                      <ChevronLeft size={20} className="sm:hidden" />
                      <ChevronLeft size={24} className="hidden sm:block" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                    >
                      <ChevronRight size={20} className="sm:hidden" />
                      <ChevronRight size={24} className="hidden sm:block" />
                    </button>
                  </>
                )}

                {/* Contenu */}
                <div className="bg-white rounded-lg overflow-hidden">
                  {filteredItems[selectedImage].type === 'image' ? (
                    <img
                      src={filteredItems[selectedImage].src}
                      alt={filteredItems[selectedImage].alt}
                      className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain"
                    />
                  ) : (
                    <video
                      src={filteredItems[selectedImage].src}
                      controls
                      autoPlay
                      className="w-full h-auto max-h-[60vh] sm:max-h-[70vh]"
                    />
                  )}
                  
                  {/* Informations */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {filteredItems[selectedImage].title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                        {filteredItems[selectedImage].year}
                      </span>
                      {/* <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span className="hidden xs:inline">{filteredItems[selectedImage].views.toLocaleString()} vues</span>
                        <span className="xs:hidden">{(filteredItems[selectedImage].views / 1000).toFixed(0)}k vues</span>
                      </div> */}
                      {/* <div className="flex items-center gap-1">
                        <Heart size={16} />
                        <span>{filteredItems[selectedImage].likes} likes</span>
                      </div> */}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {filteredItems[selectedImage].tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Compteur */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                  {selectedImage + 1} / {filteredItems.length}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;