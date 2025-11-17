"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteJob } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteJobButtonProps {
  jobId: number;
  jobTitle: string;
}

export function DeleteJobButton({ jobId, jobTitle }: DeleteJobButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteJob({ id: jobId });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data) {
        toast.success("Annonce supprimée avec succès");
        setShowConfirm(false);
        router.refresh();
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
        title="Supprimer l'annonce"
      >
        <Trash2 className="w-4 h-4" />
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
              Êtes-vous sûr de vouloir supprimer l'annonce{" "}
              <span className="font-semibold">"{jobTitle}"</span> ?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Cette action est irréversible.
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
