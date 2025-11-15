"use client";
import { useAction } from "next-safe-action/hooks";
import { listContacts } from "./actions";
import { useEffect } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import type { ContactMessage } from "@/lib/generated/prisma";

export default function AdminCrmPage() {
  const contacts = useAction(listContacts);

  useEffect(() => {
    contacts.execute();
  }, []);

  const messages = contacts.result?.data?.messages || [];
  const total = messages.length;
  const nouveaux = messages.filter((m: ContactMessage) => m.status === "new").length;

  const isLoading = contacts.status === "executing";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">CRM</h1>
        <p className="text-gray-600">Gestion rapide des contacts</p>
      </div>

      {/* Simple Cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{isLoading ? "..." : total}</div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <span className="text-base font-semibold text-blue-700">{nouveaux}</span>
            <span className="text-xs text-gray-500">nouveaux</span>
          </div>
          <Link
            href="/admin/crm/contacts"
            className="ml-4 text-sm text-gray-700 hover:text-gray-900 underline"
          >
            Voir tous
          </Link>
        </div>
      </div>
    </div>
  );
}
