// Server Component Wrapper for Gallery
import { getCompleteGalleryData } from "@/app/actions/gallery";
import Gallery from "@/components/Gallery";
import type { GalleryItem } from "@/lib/types/gallery";

/**
 * Transform Drive media to Gallery item format
 */
function transformToGalleryItems(media: any[]): GalleryItem[] {
  return media.map(item => ({
    id: item.id,
    type: item.type,
    src: item.url,
    thumbnail: item.thumbnailUrl,
    alt: `${item.event} - ${item.name}`,
    title: item.event,
    year: item.year,
    category: item.category, // Keep original category name
    event: item.event,
    mimeType: item.mimeType,
    size: item.size,
    createdTime: item.createdTime,
    tags: [
      item.category.toLowerCase(),
      item.event.toLowerCase(),
      item.year,
    ],
  }));
}

export default async function GalleryWrapper() {
  try {
    // OPTIMIZED: Use single call to get both media and categories
    // This reduces API calls and improves performance
    const result = await getCompleteGalleryData();

    // Handle errors
    if (!result?.data?.media) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Impossible de charger la galerie
            </h2>
            <p className="text-gray-600">
              Veuillez vérifier la configuration de l'API Google Drive.
            </p>
          </div>
        </div>
      );
    }

    const galleryItems = transformToGalleryItems(result.data.media);
    const categories = result.data.categories || [
      { id: 'all', name: 'Tout', count: galleryItems.length }
    ];

    return <Gallery items={galleryItems} categories={categories} />;
  } catch (error) {
    console.error('Error in GalleryWrapper:', error);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur lors du chargement de la galerie
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
}
