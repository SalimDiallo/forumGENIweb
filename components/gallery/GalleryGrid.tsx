'use client';

import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';
import type { GalleryItem } from '@/lib/types/gallery';

interface GalleryGridProps {
  items: GalleryItem[];
  viewMode: 'grid' | 'list';
  openModal: (index: number) => void;
  likedItems: Set<string>;
  toggleLike: (itemId: string, e: React.MouseEvent) => void;
}

// Composant pour les éléments de la grille
function GridItem({ item, index, openModal, likedItems, toggleLike }: {
  item: GalleryItem;
  index: number;
  openModal: (index: number) => void;
  likedItems: Set<string>;
  toggleLike: (itemId: string, e: React.MouseEvent) => void;
}) {
  return (
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
              <div className="w-12 h-12 bg-white/90  flex items-center justify-center">
                <Play className="ml-1" size={20} />
              </div>
            </div>
          )}

          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {item.year}
          </div>

          {item.type === 'video' && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {item?.duration}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

// Composant pour les éléments de la liste
function ListItem({ item, index, openModal, likedItems, toggleLike }: {
  item: GalleryItem;
  index: number;
  openModal: (index: number) => void;
  likedItems: Set<number>;
  toggleLike: (itemId: number, e: React.MouseEvent) => void;
}) {
  return (
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
                <div className="w-8 h-8 bg-white/90  flex items-center justify-center">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryGrid({
  items,
  viewMode,
  openModal,
  likedItems,
  toggleLike,
}: GalleryGridProps) {
  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => (
            <GridItem
              key={item.id}
              item={item}
              index={index}
              openModal={openModal}
              likedItems={likedItems}
              toggleLike={toggleLike}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              index={index}
              openModal={openModal}
              likedItems={likedItems}
              toggleLike={toggleLike}
            />
          ))}
        </div>
      )}

      {/* Message si aucun résultat */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun contenu trouvé</h3>
          <p className="text-gray-500 mb-4 px-4">Essayez de modifier vos filtres de recherche</p>
        </div>
      )}
    </>
  );
}
