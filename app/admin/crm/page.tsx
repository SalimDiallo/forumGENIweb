"use client";
import { useAction } from "next-safe-action/hooks";
import { listContacts } from "./actions";
import { useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { ContactMessage } from "@/lib/generated/prisma";

export default function AdminCrmPage() {
  const contacts = useAction(listContacts);

  useEffect(() => {
    contacts.execute();
  }, []);

  const messages = contacts.result?.data?.messages || [];

  // Statistics
  const contactStats = {
    total: messages.length,
    new: messages.filter((m: ContactMessage) => m.status === "new").length,
    inProgress: messages.filter((m: ContactMessage) => m.status === "in_progress").length,
    resolved: messages.filter((m: ContactMessage) => m.status === "resolved").length,
  };

  const isLoading = contacts.status === "executing";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
        <p className="text-gray-600">Gestion des contacts</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* Contacts Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Messages de Contact</h2>
                  <p className="text-sm text-gray-600">Demandes de contact reçues</p>
                </div>
              </div>
              <Link
                href="/admin/crm/contacts"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{contactStats.total}</div>
                    <div className="text-sm text-gray-600 mt-1">Total</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{contactStats.new}</div>
                    <div className="text-sm text-gray-600 mt-1">Nouveaux</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">En cours</span>
                    </div>
                    <span className="font-semibold text-gray-900">{contactStats.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-900" />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/crm/contacts"
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all group"
          >
            <MessageSquare className="w-7 h-7 text-gray-700 mb-2 group-hover:text-gray-900 transition-colors" />
            <div className="font-semibold text-gray-900">Gérer les Contacts</div>
            <div className="text-sm text-gray-600 mt-1">Voir et gérer tous les messages</div>
          </Link>

          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {Math.round((contactStats.resolved / Math.max(contactStats.total, 1)) * 100)}%
            </div>
            <div className="text-sm font-medium text-gray-700">Taux de résolution</div>
            <div className="text-xs text-gray-500 mt-1">Messages résolus</div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {contactStats.inProgress}
            </div>
            <div className="text-sm font-medium text-gray-700">En cours de traitement</div>
            <div className="text-xs text-gray-500 mt-1">Messages actifs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
