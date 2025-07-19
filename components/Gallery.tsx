'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tout' },
    { id: 'forums', name: 'Forums' },
    { id: 'workshops', name: 'Ateliers' },
    { id: 'networking', name: 'Networking' },
    { id: 'ceremonies', name: 'Cérémonies' }
  ];

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      src: '/gallery/forum2024-1.jpg',
      alt: 'Forum 2024 - Conférence principale',
      category: 'forums',
      title: 'Forum 2024 - Conférence principale',
      year: '2024'
    },
    {
      id: 2,
      type: 'image',
      src: '/gallery/workshop-innovation.jpg',
      alt: 'Atelier Innovation et Entrepreneuriat',
      category: 'workshops',
      title: 'Atelier Innovation et Entrepreneuriat',
      year: '2024'
    },
    {
      id: 3,
      type: 'video',
      src: '/gallery/forum-highlights.mp4',
      thumbnail: '/gallery/video-thumb-1.jpg',
      alt: 'Highlights Forum 2024',
      category: 'forums',
      title: 'Highlights Forum 2024',
      year: '2024'
    },
    {
      id: 4,
      type: 'image',
      src: '/gallery/networking-2024.jpg',
      alt: 'Session Networking',
      category: 'networking',
      title: 'Session Networking',
      year: '2024'
    },
    {
      id: 5,
      type: 'image',
      src: '/gallery/ceremony-awards.jpg',
      alt: 'Cérémonie de remise des prix',
      category: 'ceremonies',
      title: 'Cérémonie de remise des prix',
      year: '2023'
    },
    {
      id: 6,
      type: 'image',
      src: '/gallery/forum2023-panel.jpg',
      alt: 'Panel Discussion - Forum 2023',
      category: 'forums',
      title: 'Panel Discussion - Forum 2023',
      year: '2023'
    },
    {
      id: 7,
      type: 'video',
      src: '/gallery/testimonials.mp4',
      thumbnail: '/gallery/video-thumb-2.jpg',
      alt: 'Témoignages participants',
      category: 'networking',
      title: 'Témoignages participants',
      year: '2023'
    },
    {
      id: 8,
      type: 'image',
      src: '/gallery/workshop-tech.jpg',
      alt: 'Atelier Technologies Émergentes',
      category: 'workshops',
      title: 'Atelier Technologies Émergentes',
      year: '2023'
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredItems.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center p-1 bg-green-100 rounded-full mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
              Nos Moments
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Galerie Photo & Vidéo
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Revivez les moments forts de nos événements à travers notre galerie multimédia
          </p>
        </motion.div>

        {/* Filtres de catégories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-green-800 text-white'
                  : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Grille de galerie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer"
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden rounded-xl bg-green-100">
                <Image
                  src={item.type === 'video' ? item.thumbnail! : item.src}
                  alt={item.alt}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {item.type === 'video' && (
                    <Play className="text-white" size={48} />
                  )}
                </div>
                
                {/* Badge vidéo */}
                {item.type === 'video' && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Vidéo
                  </div>
                )}
                
                {/* Informations */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  <p className="text-white/80 text-xs">{item.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-[80vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10"
                >
                  <X size={24} />
                </button>
                
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10"
                >
                  <ChevronRight size={24} />
                </button>

                {filteredItems[selectedImage].type === 'image' ? (
                  <Image
                    src={filteredItems[selectedImage].src}
                    alt={filteredItems[selectedImage].alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={filteredItems[selectedImage].src}
                    controls
                    className="w-full h-auto max-h-[80vh] rounded-lg"
                  />
                )}
                
                <div className="absolute bottom-4 left-4 text-white bg-black/50 rounded-lg p-3">
                  <h3 className="font-medium">{filteredItems[selectedImage].title}</h3>
                  <p className="text-sm text-white/80">{filteredItems[selectedImage].year}</p>
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
