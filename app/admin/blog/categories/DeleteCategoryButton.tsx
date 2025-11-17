"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCategory } from "../actions";
import { toast } from "sonner";

interface DeleteCategoryButtonProps {
  categoryId: number;
  categoryName: string;
  postCount: number;
  onSuccess: () => void;
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  postCount,
  onSuccess
}: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCategory({ id: categoryId });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data) {
        toast.success("Catégorie supprimée avec succès");
        setShowConfirm(false);
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="text-red-600 hover:underline disabled:opacity-50"
        title="Supprimer la catégorie"
      >
        Supprimer
      </button>

      {/* Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer la catégorie{" "}
              <span className="font-semibold">"{categoryName}"</span> ?
            </p>

            {postCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  ⚠️ Attention : Cette catégorie est utilisée par {postCount} article{postCount > 1 ? 's' : ''}.
                  Veuillez d'abord réassigner ces articles à une autre catégorie avant de supprimer.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting || postCount > 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
