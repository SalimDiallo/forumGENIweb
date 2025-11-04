"use client";
import { useAction } from "next-safe-action/hooks";
import { createPartnership, deletePartnership, listPartnerships } from "../actions";
import { useEffect, useCallback, useState, useMemo } from "react";
import type { PartnershipRequest } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";

export default function AdminPartnershipsPage() {
  const partnerships = useAction(listPartnerships);
  const createP = useAction(createPartnership);
  const delP = useAction(deletePartnership);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data on mount
  useEffect(() => {
    partnerships.execute();
  }, []);

  // Reload data after successful operations
  useEffect(() => {
    if (createP.status === "hasSucceeded") {
      partnerships.execute();
      toast.success("Demande de partenariat créée avec succès");
    }
    if (createP.status === "hasErrored") {
      toast.error(createP.result?.serverError || "Erreur lors de la création");
    }
  }, [createP.status, createP.result]);

  useEffect(() => {
    if (delP.status === "hasSucceeded") {
      partnerships.execute();
      toast.success("Demande supprimée avec succès");
    }
    if (delP.status === "hasErrored") {
      toast.error(delP.result?.serverError || "Erreur lors de la suppression");
    }
  }, [delP.status, delP.result]);

  const handleCreate = useCallback((formData: FormData) => {
    const companySize = formData.get("companySize") as string;
    const partnershipType = formData.get("partnershipType") as string;

    // Validate enum values
    const validCompanySizes = ["startup", "pme", "eti", "grande_entreprise"];
    const validPartnershipTypes = ["sponsor", "recruiter", "speaker", "mentor", "other"];

    if (!validCompanySizes.includes(companySize)) {
      toast.error("Taille d'entreprise invalide");
      return;
    }

    if (!validPartnershipTypes.includes(partnershipType)) {
      toast.error("Type de partenariat invalide");
      return;
    }

    createP.execute({
      companyName: String(formData.get("companyName") || ""),
      companySize: companySize as "startup" | "pme" | "eti" | "grande_entreprise",
      contactName: String(formData.get("contactName") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
      partnershipType: partnershipType as "sponsor" | "recruiter" | "speaker" | "mentor" | "other",
    });
  }, [createP]);

  const handleDelete = useCallback((id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande de partenariat ?")) {
      delP.execute({ id });
    }
  }, [delP]);

  const isLoading = partnerships.status === "executing";
  const allRequests = partnerships.result?.data?.requests || [];

  // Pagination calculations
  const totalPages = Math.ceil(allRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [allRequests, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <section className="p-6 bg-white rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Créer une demande de partenariat</h2>
        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="md:col-span-2">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise *
            </label>
            <input
              id="companyName"
              name="companyName"
              placeholder="Ex: TechCorp"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
              Taille de l'entreprise *
            </label>
            <select
              id="companySize"
              name="companySize"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="startup">Startup</option>
              <option value="pme">PME</option>
              <option value="eti">ETI</option>
              <option value="grande_entreprise">Grande entreprise</option>
            </select>
          </div>

          <div>
            <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-700 mb-1">
              Type de partenariat *
            </label>
            <select
              id="partnershipType"
              name="partnershipType"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="sponsor">Sponsor</option>
              <option value="recruiter">Recruteur</option>
              <option value="speaker">Intervenant</option>
              <option value="mentor">Mentor</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du contact *
            </label>
            <input
              id="contactName"
              name="contactName"
              placeholder="Ex: Jean Dupont"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email du contact *
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              placeholder="contact@exemple.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createP.status === "executing"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createP.status === "executing" ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Demandes de partenariat ({allRequests.length})
          </h2>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!isLoading && allRequests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Aucune demande de partenariat</p>
              <p className="text-sm mt-1">Les demandes apparaîtront ici</p>
            </div>
          )}

          {!isLoading && paginatedRequests.length > 0 && (
            <div className="divide-y divide-gray-200">
              {paginatedRequests.map((r: PartnershipRequest) => {
              const statusColors: Record<typeof r.status, string> = {
                pending: "bg-yellow-100 text-yellow-800",
                reviewing: "bg-blue-100 text-blue-800",
                approved: "bg-green-100 text-green-800",
                rejected: "bg-red-100 text-red-800",
                on_hold: "bg-gray-100 text-gray-800",
              };

              const typeLabels: Record<typeof r.partnershipType, string> = {
                sponsor: "Sponsor",
                recruiter: "Recruteur",
                speaker: "Intervenant",
                mentor: "Mentor",
                other: "Autre",
              };

              const sizeLabels: Record<typeof r.companySize, string> = {
                startup: "Startup",
                pme: "PME",
                eti: "ETI",
                grande_entreprise: "Grande entreprise",
              };

              return (
                <div key={r.id} className="py-4 hover:bg-gray-50 px-4 -mx-4 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{r.companyName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Type:</span> {typeLabels[r.partnershipType]}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Taille:</span> {sizeLabels[r.companySize]}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Contact:</span> {r.contactName}
                        </span>
                        <span className="text-blue-600">{r.contactEmail}</span>
                      </div>
                      {r.contactPhone && (
                        <p className="text-sm text-gray-500 mt-1">
                          Tél: {r.contactPhone}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Soumis le {new Date(r.submittedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={delP.status === "executing"}
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

        {!isLoading && allRequests.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={allRequests.length}
          />
        )}
      </section>
    </div>
  );
}
