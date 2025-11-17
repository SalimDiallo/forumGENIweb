"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEvent, deleteEventForce } from "./event.delete.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteEventButtonProps {
  eventId: number;
  eventTitle: string;
  hasRegistrations?: boolean;
}

export function DeleteEventButton({ eventId, eventTitle, hasRegistrations }: DeleteEventButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const action = forceDelete ? deleteEventForce : deleteEvent;
      const result = await action({ id: eventId });

      if (result?.serverError) {
        // Vérifier si c'est une erreur d'inscriptions existantes
        if (result.serverError.includes("inscription")) {
          setForceDelete(true);
          toast.error(result.serverError);
          setIsDeleting(false);
          return;
        }
        toast.error(result.serverError);
      } else if (result?.data) {
        toast.success(result.data.message || "Événement supprimé avec succès");
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
        title="Supprimer l'événement"
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
              Êtes-vous sûr de vouloir supprimer l'événement{" "}
              <span className="font-semibold">"{eventTitle}"</span> ?
            </p>

            {forceDelete && hasRegistrations && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  ⚠️ Attention : Cet événement possède des inscriptions. La suppression
                  entraînera la suppression de toutes les données associées.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setForceDelete(false);
                }}
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
                    {forceDelete ? "Forcer la suppression" : "Supprimer"}
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
