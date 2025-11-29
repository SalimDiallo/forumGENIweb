"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteTestimonial } from "./actions";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  id: number;
  name: string;
};

export function DeleteButton({ id, name }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTestimonial({ id });
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du témoignage");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirmer la suppression
          </h3>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le témoignage de <strong>{name}</strong> ?
            Cette action est irréversible.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
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
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
