"use client";
import { useAction } from "next-safe-action/hooks";
import { createContact, deleteContact, listContacts } from "../actions";
import { useEffect, useCallback, useState, useMemo } from "react";
import type { ContactMessage } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";

export default function AdminContactsPage() {
  const contacts = useAction(listContacts);
  const createC = useAction(createContact);
  const delC = useAction(deleteContact);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data on mount
  useEffect(() => {
    contacts.execute();
  }, []);

  // Reload data after successful operations
  useEffect(() => {
    if (createC.status === "hasSucceeded") {
      contacts.execute();
      toast.success("Message de contact créé avec succès");
    }
    if (createC.status === "hasErrored") {
      toast.error(createC.result?.serverError || "Erreur lors de la création");
    }
  }, [createC.status, createC.result]);

  useEffect(() => {
    if (delC.status === "hasSucceeded") {
      contacts.execute();
      toast.success("Message supprimé avec succès");
    }
    if (delC.status === "hasErrored") {
      toast.error(delC.result?.serverError || "Erreur lors de la suppression");
    }
  }, [delC.status, delC.result]);

  const handleCreate = useCallback((formData: FormData) => {
    createC.execute({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    });
  }, [createC]);

  const handleDelete = useCallback((id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      delC.execute({ id });
    }
  }, [delC]);

  const isLoading = contacts.status === "executing";
  const allMessages = contacts.result?.data?.messages || [];

  // Pagination calculations
  const totalPages = Math.ceil(allMessages.length / itemsPerPage);
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allMessages.slice(startIndex, startIndex + itemsPerPage);
  }, [allMessages, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <section className="p-6 bg-white rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Créer un message de contact</h2>
        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              id="name"
              name="name"
              placeholder="Ex: Jean Dupont"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="contact@exemple.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Sujet *
            </label>
            <input
              id="subject"
              name="subject"
              placeholder="Ex: Demande d'information"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Votre message..."
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createC.status === "executing"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createC.status === "executing" ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Messages de contact ({allMessages.length})
          </h2>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!isLoading && allMessages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Aucun message</p>
              <p className="text-sm mt-1">Les messages apparaîtront ici</p>
            </div>
          )}

          {!isLoading && paginatedMessages.length > 0 && (
            <div className="divide-y divide-gray-200">
              {paginatedMessages.map((m: ContactMessage) => {
              const statusColors: Record<typeof m.status, string> = {
                new: "bg-blue-100 text-blue-800",
                in_progress: "bg-yellow-100 text-yellow-800",
                resolved: "bg-green-100 text-green-800",
                closed: "bg-gray-100 text-gray-800",
              };

              const priorityColors: Record<typeof m.priority, string> = {
                low: "bg-gray-100 text-gray-600",
                normal: "bg-blue-100 text-blue-600",
                high: "bg-orange-100 text-orange-600",
                urgent: "bg-red-100 text-red-600",
              };

              const categoryLabels: Record<typeof m.category, string> = {
                general: "Général",
                partnership: "Partenariat",
                technical: "Technique",
                press: "Presse",
                event: "Événement",
                career: "Carrière",
              };

              return (
                <div key={m.id} className="py-4 hover:bg-gray-50 px-4 -mx-4 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{m.subject}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[m.status]}`}>
                          {m.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[m.priority]}`}>
                          {m.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {categoryLabels[m.category]}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">De:</span> {m.name}
                        </span>
                        <span className="text-blue-600">{m.email}</span>
                        {m.phone && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Tél:</span> {m.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-1">{m.message}</p>
                      <p className="text-xs text-gray-400">
                        Reçu le {new Date(m.createdAt).toLocaleDateString("fr-FR")} à {new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={delC.status === "executing"}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>

        {!isLoading && allMessages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={allMessages.length}
          />
        )}
      </section>
    </div>
  );
}
