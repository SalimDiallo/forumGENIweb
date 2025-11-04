"use client";
import { useAction } from "next-safe-action/hooks";
import { createSubscription, deleteSubscription, listSubscriptions } from "./actions";
import { useEffect, useCallback, useState, useMemo } from "react";
import type { NewsletterSubscription } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import { Mail, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminNewsletterPage() {
  const list = useAction(listSubscriptions);
  const create = useAction(createSubscription);
  const del = useAction(deleteSubscription);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    list.execute();
  }, []);

  useEffect(() => {
    if (create.status === "hasSucceeded") {
      list.execute();
      toast.success("Abonné ajouté avec succès");
    }
    if (create.status === "hasErrored") {
      toast.error(create.result?.serverError || "Erreur lors de l'ajout");
    }
  }, [create.status, create.result]);

  useEffect(() => {
    if (del.status === "hasSucceeded") {
      list.execute();
      toast.success("Abonné supprimé avec succès");
    }
    if (del.status === "hasErrored") {
      toast.error(del.result?.serverError || "Erreur lors de la suppression");
    }
  }, [del.status, del.result]);

  const handleCreate = useCallback((formData: FormData) => {
    const email = String(formData.get("email") || "");
    const name = String(formData.get("name") || "");

    create.execute({
      email,
      name: name || undefined,
      frequency: "weekly",
      isActive: true,
    });
  }, [create]);

  const handleDelete = useCallback((id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) {
      del.execute({ id });
    }
  }, [del]);

  const isLoading = list.status === "executing";
  const allSubscriptions = list.result?.data?.subscriptions || [];

  const totalPages = Math.ceil(allSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allSubscriptions.slice(startIndex, startIndex + itemsPerPage);
  }, [allSubscriptions, currentPage, itemsPerPage]);

  const stats = {
    total: allSubscriptions.length,
    active: allSubscriptions.filter((s: NewsletterSubscription) => s.isActive).length,
    confirmed: allSubscriptions.filter((s: NewsletterSubscription) => s.confirmedAt).length,
  };

  const frequencyLabels: Record<string, string> = {
    daily: "Quotidienne",
    weekly: "Hebdomadaire",
    monthly: "Mensuelle",
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Newsletter</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-teal-100">Total abonnés</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-teal-100">Actifs</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <div className="text-teal-100">Confirmés</div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      <section className="p-6 bg-white rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ajouter un abonné</h2>
        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom (optionnel)
            </label>
            <input
              id="name"
              name="name"
              placeholder="Jean Dupont"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={create.status === "executing"}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {create.status === "executing" ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Abonnés ({allSubscriptions.length})
          </h2>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          )}

          {!isLoading && allSubscriptions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucun abonné</p>
              <p className="text-sm mt-1">Les abonnés apparaîtront ici</p>
            </div>
          )}

          {!isLoading && paginatedSubscriptions.length > 0 && (
            <div className="divide-y divide-gray-200">
              {paginatedSubscriptions.map((s: NewsletterSubscription) => (
                <div key={s.id} className="py-4 hover:bg-gray-50 px-4 -mx-4 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{s.email}</h3>
                        {s.isActive ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Actif
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Inactif
                          </span>
                        )}
                        {s.confirmedAt && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Confirmé
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                        {s.name && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Nom:</span> {s.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Fréquence:</span> {frequencyLabels[s.frequency] || s.frequency}
                        </span>
                        {s.source && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Source:</span> {s.source}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Inscrit le {new Date(s.subscribedAt).toLocaleDateString("fr-FR")}
                        {s.confirmedAt && ` • Confirmé le ${new Date(s.confirmedAt).toLocaleDateString("fr-FR")}`}
                        {s.unsubscribedAt && ` • Désinscrit le ${new Date(s.unsubscribedAt).toLocaleDateString("fr-FR")}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={del.status === "executing"}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && allSubscriptions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={allSubscriptions.length}
          />
        )}
      </section>
    </div>
  );
}
