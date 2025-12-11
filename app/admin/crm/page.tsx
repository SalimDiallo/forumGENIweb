"use client";

import { useQuery } from "@tanstack/react-query";
import { listContacts } from "./actions";
import Link from "next/link";
import { MessageSquare, Users, Clock, CheckCircle, AlertCircle, ArrowRight, Inbox } from "lucide-react";
import type { ContactMessage } from "@/lib/generated/prisma";

export default function AdminCrmPage() {
  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["crm-contacts"],
    queryFn: async () => {
      const result = await listContacts();
      return result?.data?.messages || [];
    },
  });

  const messages = messagesData || [];
  const total = messages.length;
  const nouveaux = messages.filter((m: ContactMessage) => m.status === "new").length;
  const enCours = messages.filter((m: ContactMessage) => m.status === "in_progress").length;
  const resolus = messages.filter((m: ContactMessage) => m.status === "resolved").length;

  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-500 text-sm">Gestion des contacts et messages</p>
        </div>
        <Link
          href="/admin/crm/contacts"
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors"
        >
          <Inbox className="w-4 h-4" />
          Voir tous les messages
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : total}</p>
          <p className="text-sm text-gray-500">Total messages</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : nouveaux}</p>
          <p className="text-sm text-gray-500">Nouveaux</p>
          {nouveaux > 0 && (
            <span className="mt-2 inline-block text-xs font-medium bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
              À traiter
            </span>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : enCours}</p>
          <p className="text-sm text-gray-500">En cours</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : resolus}</p>
          <p className="text-sm text-gray-500">Résolus</p>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Messages récents</h3>
          <Link href="/admin/crm/contacts" className="text-sm text-blue-600 hover:text-blue-700">
            Voir tout →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun message</p>
            </div>
          ) : (
            recentMessages.map((msg: ContactMessage) => (
              <div key={msg.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">{msg.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${msg.status === "new" ? "bg-amber-100 text-amber-700" :
                          msg.status === "in_progress" ? "bg-purple-100 text-purple-700" :
                            msg.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                              "bg-gray-100 text-gray-700"
                        }`}>
                        {msg.status === "new" ? "Nouveau" :
                          msg.status === "in_progress" ? "En cours" :
                            msg.status === "resolved" ? "Résolu" : msg.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">{msg.email}</p>
                  </div>
                  <Link
                    href="/admin/crm/contacts"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
