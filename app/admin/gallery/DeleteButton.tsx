"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteVideo, deletePhoto } from "./actions";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  id: number;
  title: string;
  type: "video" | "photo";
};

export function DeleteButton({ id, title, type }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (type === "video") {
        await deleteVideo({ id });
      } else {
        await deletePhoto({ id });
      }
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(`Erreur lors de la suppression de la ${type === "video" ? "vidéo" : "photo"}`);
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
            Êtes-vous sûr de vouloir supprimer {type === "video" ? "la vidéo" : "la photo"} <strong>"{title}"</strong> ?
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
      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
