"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listContacts, updateContactStatus } from "../actions";
import { useState, useMemo } from "react";
import type { ContactMessage } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { Mail, User2, Phone, Clock, Tag, ChevronLeft, Inbox, Star, Archive, Trash2, Reply } from "lucide-react";
import { DeleteContactButton } from "./DeleteContactButton";

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const { data: messagesData, isLoading, refetch } = useQuery({
    queryKey: ["crm-contacts"],
    queryFn: async () => {
      const result = await listContacts();
      return result?.data?.messages || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await updateContactStatus({ id, status } as any);
    },
    onSuccess: () => {
      toast.success("Statut mis à jour");
      refetch();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const messages: ContactMessage[] = messagesData || [];

  const filteredMessages = useMemo(() => {
    if (filter === "all") return messages;
    return messages.filter((m) => m.status === filter);
  }, [messages, filter]);

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedId) || null;
  }, [messages, selectedId]);

  const statusStats = useMemo(() => {
    return {
      all: messages.length,
      new: messages.filter((m) => m.status === "new").length,
      in_progress: messages.filter((m) => m.status === "in_progress").length,
      resolved: messages.filter((m) => m.status === "resolved").length,
    };
  }, [messages]);

  const handleStatusChange = (id: number, status: string) => {
    updateMutation.mutate({ id, status });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: "all", label: "Tous", count: statusStats.all },
            { key: "new", label: "Nouveaux", count: statusStats.new },
            { key: "in_progress", label: "En cours", count: statusStats.in_progress },
            { key: "resolved", label: "Résolus", count: statusStats.resolved },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === f.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {f.label}
              {f.count > 0 && (
                <span className={`ml-1.5 text-xs ${filter === f.key ? "text-blue-600" : "text-gray-400"}`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gmail-style layout */}
      <div className="flex-1 flex bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Message List - Left Panel */}
        <div className={`${selectedMessage ? "hidden md:flex" : "flex"} flex-col w-full md:w-96 border-r border-gray-200`}>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Inbox className="w-16 h-16 mb-3" />
              <p className="text-lg font-medium">Aucun message</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedId === m.id
                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                    : m.status === "new"
                      ? "bg-white hover:bg-gray-50 font-semibold"
                      : "bg-gray-50/50 hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${m.status === "new" ? "bg-blue-500" :
                      m.status === "in_progress" ? "bg-amber-500" :
                        m.status === "resolved" ? "bg-emerald-500" : "bg-gray-400"
                      }`}>
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`truncate ${m.status === "new" ? "font-bold text-gray-900" : "text-gray-700"}`}>
                          {m.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                          {formatDate(m.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm truncate ${m.status === "new" ? "text-gray-900" : "text-gray-600"}`}>
                    {m.subject}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {m.message.substring(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail - Right Panel */}
        <div className={`${selectedMessage ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
          {selectedMessage ? (
            <>
              {/* Detail Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">{selectedMessage.subject}</h2>
                </div>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                  disabled={updateMutation.isPending}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedMessage.status === "new" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    selectedMessage.status === "in_progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      selectedMessage.status === "resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                >
                  <option value="new">Nouveau</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="closed">Fermé</option>
                </select>
                <DeleteContactButton
                  contactId={selectedMessage.id}
                  contactName={selectedMessage.name}
                  onSuccess={() => {
                    setSelectedId(null);
                    refetch();
                  }}
                />
              </div>

              {/* Sender Info */}
              <div className="p-4 border-b border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedMessage.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{selectedMessage.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedMessage.category === "general" ? "bg-gray-100 text-gray-600" :
                      selectedMessage.category === "technical" ? "bg-purple-100 text-purple-600" :
                        selectedMessage.category === "press" ? "bg-pink-100 text-pink-600" :
                          selectedMessage.category === "event" ? "bg-blue-100 text-blue-600" :
                            "bg-amber-100 text-amber-600"
                      }`}>
                      {selectedMessage.category === "general" ? "Général" :
                        selectedMessage.category === "technical" ? "Technique" :
                          selectedMessage.category === "press" ? "Presse" :
                            selectedMessage.category === "event" ? "Événement" : "Carrière"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedMessage.email}
                    </span>
                    {selectedMessage.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedMessage.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(selectedMessage.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 flex items-center gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Répondre
                </a>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Mail className="w-20 h-20 mb-4" />
              <p className="text-lg font-medium">Sélectionnez un message</p>
              <p className="text-sm">Cliquez sur un message pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
