"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteContact } from "../actions";
import { toast } from "sonner";

interface DeleteContactButtonProps {
  contactId: number;
  contactName: string;
  onSuccess: () => void;
}

export function DeleteContactButton({
  contactId,
  contactName,
  onSuccess
}: DeleteContactButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContact({ id: contactId });

      if (result?.serverError) {
        toast.error(result.serverError);
      } else if (result?.data) {
        toast.success("Message supprimé avec succès");
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
        className="p-1 hover:bg-red-100 transition-colors text-red-600 disabled:opacity-50"
        title="Supprimer"
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
              Êtes-vous sûr de vouloir supprimer le message de{" "}
              <span className="font-semibold">"{contactName}"</span> ?
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
