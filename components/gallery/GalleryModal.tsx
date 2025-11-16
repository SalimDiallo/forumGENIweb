'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import ShareButton from '../ui/ShareButton';

interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  alt: string;
  category: string;
  title: string;
  year: string;
  tags: string[];
  duration?: string;
}

interface GalleryModalProps {
  selectedImage: number | null;
  items: GalleryItem[];
  closeModal: () => void;
  nextImage: () => void;
  prevImage: () => void;
  downloadImage: (src: string, title: string) => void;
  shareImage: (item: GalleryItem) => void;
}

export default function GalleryModal({
  selectedImage,
  items,
  closeModal,
  nextImage,
  prevImage,
  downloadImage,
  shareImage,
}: GalleryModalProps) {
  if (selectedImage === null) return null;

  return (
    <AnimatePresence>
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
                items[selectedImage].src,
                items[selectedImage].title
              )}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white  flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Download size={16} className="sm:hidden" />
              <Download size={18} className="hidden sm:block" />
            </button>
            <div className="inline-block">
              <ShareButton
                title={items[selectedImage].title}
                description={`${items[selectedImage].category} - ${items[selectedImage].year}`}
                size="sm"
                className="!bg-white/20 !text-white hover:!bg-white/30 !border-0"
              />
            </div>
            <button
              onClick={closeModal}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white  flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={16} className="sm:hidden" />
              <X size={18} className="hidden sm:block" />
            </button>
          </div>

          {/* Navigation */}
          {items.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 text-white  flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <ChevronLeft size={20} className="sm:hidden" />
                <ChevronLeft size={24} className="hidden sm:block" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 text-white  flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <ChevronRight size={20} className="sm:hidden" />
                <ChevronRight size={24} className="hidden sm:block" />
              </button>
            </>
          )}

          {/* Contenu */}
          <div className="bg-white rounded-lg overflow-hidden">
            {items[selectedImage].type === 'image' ? (
              <img
                src={items[selectedImage].src}
                alt={items[selectedImage].alt}
                className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain"
              />
            ) : (
              <video
                src={items[selectedImage].src}
                controls
                autoPlay
                className="w-full h-auto max-h-[60vh] sm:max-h-[70vh]"
              />
            )}

            {/* Informations */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {items[selectedImage].title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                  {items[selectedImage].year}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {items[selectedImage].tags.map((tag, tagIndex) => (
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
            {selectedImage + 1} / {items.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
