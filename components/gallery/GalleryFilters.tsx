'use client';

import { Search, Grid3X3, List } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface GalleryFiltersProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export default function GalleryFilters({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}: GalleryFiltersProps) {
  return (
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
  );
}
