"use client";
import { useAction } from "next-safe-action/hooks";
import { listContacts, listPartnerships } from "./actions";
import { useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Handshake,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { ContactMessage, PartnershipRequest } from "@/lib/generated/prisma";

export default function AdminCrmPage() {
  const contacts = useAction(listContacts);
  const partnerships = useAction(listPartnerships);

  useEffect(() => {
    contacts.execute();
    partnerships.execute();
  }, []);

  const messages = contacts.result?.data?.messages || [];
  const requests = partnerships.result?.data?.requests || [];

  // Statistics
  const contactStats = {
    total: messages.length,
    new: messages.filter((m: ContactMessage) => m.status === "new").length,
    inProgress: messages.filter((m: ContactMessage) => m.status === "in_progress").length,
    resolved: messages.filter((m: ContactMessage) => m.status === "resolved").length,
  };

  const partnershipStats = {
    total: requests.length,
    pending: requests.filter((r: PartnershipRequest) => r.status === "pending").length,
    approved: requests.filter((r: PartnershipRequest) => r.status === "approved").length,
    reviewing: requests.filter((r: PartnershipRequest) => r.status === "reviewing").length,
  };

  const isLoading = contacts.status === "executing" || partnerships.status === "executing";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">CRM Dashboard</h1>
        <p className="text-purple-100">Gestion des contacts et partenariats</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contacts Card */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Messages de Contact</h2>
                  <p className="text-sm text-gray-600">Demandes de contact reçues</p>
                </div>
              </div>
              <Link
                href="/admin/crm/contacts"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">{contactStats.total}</div>
                    <div className="text-sm text-gray-600 mt-1">Total</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{contactStats.new}</div>
                    <div className="text-sm text-gray-600 mt-1">Nouveaux</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-600">En cours</span>
                    </div>
                    <span className="font-semibold text-gray-900">{contactStats.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Résolus</span>
                    </div>
                    <span className="font-semibold text-gray-900">{contactStats.resolved}</span>
                  </div>
                </div>

                {messages.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Derniers messages</h3>
                    <div className="space-y-2">
                      {messages.slice(0, 3).map((m: ContactMessage) => (
                        <div key={m.id} className="text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="font-medium text-gray-900 truncate">{m.subject}</div>
                          <div className="text-gray-500 text-xs mt-1">{m.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Partnerships Card */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Partenariats</h2>
                  <p className="text-sm text-gray-600">Demandes de partenariat</p>
                </div>
              </div>
              <Link
                href="/admin/crm/partnerships"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">{partnershipStats.total}</div>
                    <div className="text-sm text-gray-600 mt-1">Total</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{partnershipStats.pending}</div>
                    <div className="text-sm text-gray-600 mt-1">En attente</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">En révision</span>
                    </div>
                    <span className="font-semibold text-gray-900">{partnershipStats.reviewing}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Approuvés</span>
                    </div>
                    <span className="font-semibold text-gray-900">{partnershipStats.approved}</span>
                  </div>
                </div>

                {requests.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Dernières demandes</h3>
                    <div className="space-y-2">
                      {requests.slice(0, 3).map((r: PartnershipRequest) => {
                        const typeLabels: Record<typeof r.partnershipType, string> = {
                          sponsor: "Sponsor",
                          recruiter: "Recruteur",
                          speaker: "Intervenant",
                          mentor: "Mentor",
                          other: "Autre",
                        };
                        return (
                          <div key={r.id} className="text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="font-medium text-gray-900 truncate">{r.companyName}</div>
                            <div className="text-gray-500 text-xs mt-1">
                              {typeLabels[r.partnershipType]} · {r.contactEmail}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/crm/contacts"
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <MessageSquare className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-gray-900">Gérer les Contacts</div>
            <div className="text-sm text-gray-600 mt-1">Voir et gérer tous les messages</div>
          </Link>

          <Link
            href="/admin/crm/partnerships"
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
          >
            <Handshake className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-gray-900">Gérer les Partenariats</div>
            <div className="text-sm text-gray-600 mt-1">Voir et gérer les demandes</div>
          </Link>

          <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {Math.round((contactStats.resolved / Math.max(contactStats.total, 1)) * 100)}%
            </div>
            <div className="text-sm font-medium text-gray-700">Taux de résolution</div>
            <div className="text-xs text-gray-500 mt-1">Messages résolus</div>
          </div>

          <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {Math.round((partnershipStats.approved / Math.max(partnershipStats.total, 1)) * 100)}%
            </div>
            <div className="text-sm font-medium text-gray-700">Taux d'approbation</div>
            <div className="text-xs text-gray-500 mt-1">Partenariats approuvés</div>
          </div>
        </div>
      </div>
    </div>
  );
}
