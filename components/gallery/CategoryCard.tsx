'use client';

import { motion } from 'framer-motion';
import { FolderOpen, Images } from 'lucide-react';
import type { GalleryItem } from '@/lib/types/gallery';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    count: number;
  };
  firstImage: GalleryItem | null;
  index: number;
  onClick: () => void;
}

export default function CategoryCard({ category, firstImage, index, onClick }: CategoryCardProps) {
  // Prioriser thumbnail pour les images, utiliser src en fallback
  const imageSrc = firstImage 
    ? (firstImage.type === 'image' 
        ? (firstImage.thumbnail || firstImage.src)
        : (firstImage.thumbnail || firstImage.src))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image Preview */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  console.error('Erreur chargement image carte:', {
                    src: imageSrc,
                    thumbnail: firstImage?.thumbnail,
                    type: firstImage?.type,
                    itemId: firstImage?.id
                  });
                  
                  // Essayer l'autre source si disponible
                  if (firstImage?.thumbnail && e.currentTarget.src !== firstImage.thumbnail) {
                    e.currentTarget.src = firstImage.thumbnail;
                    return;
                  }
                  if (firstImage?.src && e.currentTarget.src !== firstImage.src) {
                    e.currentTarget.src = firstImage.src;
                    return;
                  }
                  
                  // Si l'image ne charge pas, utiliser un placeholder
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-br', 'from-emerald-100', 'to-emerald-200');
                  }
                }}
                onLoad={() => {
                  console.log('Image carte chargée avec succès:', {
                    src: imageSrc,
                    event: category.name
                  });
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
              <FolderOpen className="w-16 h-16 text-emerald-600 opacity-50" />
            </div>
          )}
          
          {/* Overlay avec info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-2 text-white">
              <Images className="w-5 h-5" />
              <span className="text-sm font-medium">
                {category.count} {category.count > 1 ? 'éléments' : 'élément'}
              </span>
            </div>
          </div>
        </div>

        {/* Category Info */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
            {category.name}
          </h3>
          
          {/* Badge avec nombre */}
          <div className="mt-auto pt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
              <span>Voir la galerie</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

