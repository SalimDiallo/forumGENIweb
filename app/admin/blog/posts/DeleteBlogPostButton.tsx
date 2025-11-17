"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBlogPost } from "../posts-actions";
import { toast } from "sonner";

interface DeleteBlogPostButtonProps {
  postId: number;
  postTitle: string;
  onSuccess: () => void;
}

export function DeleteBlogPostButton({ postId, postTitle, onSuccess }: DeleteBlogPostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBlogPost({ id: postId });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data) {
        toast.success("Article supprimé avec succès");
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
        className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Supprimer l'article"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer l'article{" "}
              <span className="font-semibold">"{postTitle}"</span> ?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Cette action est irréversible. Tous les tags associés seront également supprimés.
            </p>

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
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
