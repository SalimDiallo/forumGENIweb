'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { GalleryItem } from '@/lib/types/gallery';

interface GalleryModalProps {
  selectedImage: number | null;
  items: GalleryItem[];
  closeModal: () => void;
  nextImage: () => void;
  prevImage: () => void;
  // downloadImage and shareImage removed per instruction
}

export default function GalleryModal({
  selectedImage,
  items,
  closeModal,
  nextImage,
  prevImage,
}: Omit<GalleryModalProps, 'downloadImage' | 'shareImage'>) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);

  // Vérification de sécurité et mise à jour de l'item courant
  useEffect(() => {
    if (selectedImage !== null && items.length > 0 && selectedImage >= 0 && selectedImage < items.length) {
      setCurrentItem(items[selectedImage]);
      setImageLoading(true);
      setImageError(false);
    } else {
      setCurrentItem(null);
    }
  }, [selectedImage, items]);

  // Gestion de l'erreur de chargement d'image
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.error('Erreur de chargement de l\'image:', currentItem?.src);
  };

  // Debug: afficher les données en console
  useEffect(() => {
    if (currentItem) {
      console.log('Modal - Item courant:', {
        id: currentItem.id,
        src: currentItem.src,
        thumbnail: currentItem.thumbnail,
        type: currentItem.type,
        title: currentItem.title,
        category: currentItem.category,
      });
    }
  }, [currentItem]);

  if (selectedImage === null || !currentItem || items.length === 0) {
    return null;
  }

  // Pour les images, prioriser le thumbnail qui fonctionne mieux avec Google Drive
  // Pour les vidéos, utiliser src directement
  const safeImageSrc = currentItem.type === 'image'
    ? (currentItem.thumbnail || currentItem.src)
    : (currentItem.thumbnail || currentItem.src);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={closeModal}
      >
        <motion.div
          key={selectedImage}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-6xl max-h-[95vh] w-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Contrôles supérieurs */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-200"
              title="Fermer"
            >
              <X size={18} className="sm:hidden" />
              <X size={20} className="hidden sm:block" />
            </button>
          </div>

          {/* Navigation gauche/droite */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-200 z-20"
                title="Précédent"
              >
                <ChevronLeft size={20} className="sm:hidden" />
                <ChevronLeft size={28} className="hidden sm:block" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-200 z-20"
                title="Suivant"
              >
                <ChevronRight size={20} className="sm:hidden" />
                <ChevronRight size={28} className="hidden sm:block" />
              </button>
            </>
          )}

          {/* Contenu principal */}
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Zone média */}
            <div className="relative flex-1 flex items-center justify-center bg-gray-900 min-h-[50vh] max-h-[70vh] overflow-hidden">
              {imageLoading && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                    <span className="text-white text-sm">Chargement...</span>
                  </div>
                </div>
              )}

              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                    <div className="text-white">
                      <p className="font-semibold mb-1">Erreur de chargement</p>
                      <p className="text-sm text-gray-300 mb-3">L'image n'a pas pu être chargée</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageError(false);
                          setImageLoading(true);
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                      >
                        Réessayer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentItem.type === 'image' ? (
                <>
                  {imageLoading && (
                    <img
                      src={safeImageSrc}
                      alt={currentItem.alt}
                      className="opacity-0 absolute"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  )}
                  <img
                    src={safeImageSrc}
                    alt={currentItem.alt}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{ maxHeight: '70vh' }}
                  />
                </>
              ) : (
                <>
                  {/* Pour YouTube, utiliser le lecteur embed */}
                  {currentItem.src.includes('youtube.com') || currentItem.src.includes('youtu.be') ? (
                    <>
                      {(() => {
                        // Extract video ID from YouTube URL
                        const videoId = currentItem.src.includes('youtube.com')
                          ? new URL(currentItem.src).searchParams.get('v')
                          : currentItem.src.split('/').pop();

                        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

                        return (
                          <iframe
                            key={currentItem.id}
                            src={embedUrl}
                            className="w-full h-full border-0"
                            style={{ maxHeight: '70vh', minHeight: '400px' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => {
                              setImageLoading(false);
                              setImageError(false);
                              console.log('Vidéo YouTube chargée:', embedUrl);
                            }}
                            onError={handleImageError}
                          />
                        );
                      })()}
                    </>
                  ) : currentItem.src.includes('drive.google.com') ? (
                    /* Pour Google Drive, on utilise un iframe pour la prévisualisation vidéo */
                    <iframe
                      key={currentItem.id}
                      src={currentItem.src}
                      className="w-full h-full border-0"
                      style={{ maxHeight: '70vh', minHeight: '400px' }}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      onLoad={() => {
                        setImageLoading(false);
                        setImageError(false);
                        console.log('Vidéo Drive chargée:', currentItem.src);
                      }}
                      onError={handleImageError}
                    />
                  ) : (
                    <>
                      <video
                        key={currentItem.src}
                        src={currentItem.src}
                        controls
                        autoPlay
                        playsInline
                        onLoadedData={() => {
                          setImageLoading(false);
                          setImageError(false);
                          console.log('Vidéo chargée:', currentItem.src);
                        }}
                        onError={(e) => {
                          console.error('Erreur chargement vidéo:', {
                            src: currentItem.src,
                            itemId: currentItem.id,
                            error: e
                          });
                          handleImageError();
                        }}
                        onCanPlay={() => {
                          setImageLoading(false);
                          setImageError(false);
                        }}
                        className="w-full h-full object-contain"
                        style={{ maxHeight: '70vh' }}
                      >
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                      {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                          <div className="flex flex-col items-center gap-3 text-center px-4">
                            <AlertCircle className="w-12 h-12 text-red-400" />
                            <div className="text-white">
                              <p className="font-semibold mb-1">Erreur de chargement vidéo</p>
                              <p className="text-sm text-gray-300 mb-3">La vidéo n'a pas pu être chargée</p>
                              <a
                                href={currentItem.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                              >
                                Ouvrir dans un nouvel onglet
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Informations */}
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                {currentItem.title || 'Sans titre'}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm font-medium">
                  {currentItem.year}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium capitalize">
                  {currentItem.category.replace(/-/g, ' ')}
                </span>
                {currentItem.event && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium">
                    {currentItem.event}
                  </span>
                )}
                {/* Source badge */}
                {(currentItem as any).source && (
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    (currentItem as any).source === 'youtube'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {(currentItem as any).source === 'youtube' ? 'YouTube' : 'Photos'}
                  </span>
                )}
              </div>

              {/* Tags */}
              {currentItem.tags && currentItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentItem.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compteur en bas */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium z-20">
            {selectedImage + 1} / {items.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
