"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteTag } from "../tags-actions";
import { toast } from "sonner";

interface DeleteTagButtonProps {
  tagId: number;
  tagName: string;
  postCount: number;
  onSuccess: () => void;
}

export function DeleteTagButton({
  tagId,
  tagName,
  postCount,
  onSuccess
}: DeleteTagButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTag({ id: tagId });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data) {
        toast.success("Tag supprimé avec succès");
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
        title="Supprimer le tag"
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
              Êtes-vous sûr de vouloir supprimer le tag{" "}
              <span className="font-semibold">"{tagName}"</span> ?
            </p>

            {postCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ℹ️ Ce tag est utilisé par {postCount} article{postCount > 1 ? 's' : ''}.
                  Les relations avec les articles seront supprimées automatiquement.
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
