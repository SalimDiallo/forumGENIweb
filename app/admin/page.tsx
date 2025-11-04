"use client";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  Handshake,
  FileText,
  Image,
  Video,
  Mail,
  BarChart3,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { listContacts, listPartnerships } from "./crm/actions";
import { getJobsWithApplicationCount } from "./jobs/actions";
import { listCategories } from "./blog/actions";
import { listMedia } from "./media/actions";
import { listTestimonials } from "./testimonials/actions";
import { listSubscriptions } from "./newsletter/actions";

export default function AdminDashboard() {
  const contacts = useAction(listContacts);
  const partnerships = useAction(listPartnerships);
  const jobs = useAction(getJobsWithApplicationCount);
  const categories = useAction(listCategories);
  const media = useAction(listMedia);
  const testimonials = useAction(listTestimonials);
  const subscriptions = useAction(listSubscriptions);

  useEffect(() => {
    // Load all stats on mount
    contacts.execute();
    partnerships.execute();
    jobs.execute();
    categories.execute();
    media.execute();
    testimonials.execute();
    subscriptions.execute();
  }, []);

  const isLoading =
    contacts.status === "executing" ||
    partnerships.status === "executing" ||
    jobs.status === "executing";

  // Calculate stats
  const stats = {
    contacts: {
      total: contacts.result?.data?.messages?.length || 0,
      new: contacts.result?.data?.messages?.filter((m: any) => m.status === "new").length || 0,
    },
    partnerships: {
      total: partnerships.result?.data?.requests?.length || 0,
      pending: partnerships.result?.data?.requests?.filter((r: any) => r.status === "pending").length || 0,
    },
    jobs: {
      total: jobs.result?.data?.jobs?.length || 0,
      applications: jobs.result?.data?.jobs?.reduce((acc: number, j: any) => acc + (j._count?.applications || 0), 0) || 0,
    },
    blog: {
      categories: categories.result?.data?.categories?.length || 0,
    },
    media: {
      total: media.result?.data?.media?.length || 0,
    },
    testimonials: {
      total: testimonials.result?.data?.testimonials?.length || 0,
      active: testimonials.result?.data?.testimonials?.filter((t: any) => t.isActive).length || 0,
    },
    newsletter: {
      total: subscriptions.result?.data?.subscriptions?.length || 0,
      active: subscriptions.result?.data?.subscriptions?.filter((s: any) => s.isActive).length || 0,
    },
  };

  const quickLinks = [
    {
      name: "CRM",
      href: "/admin/crm",
      icon: Users,
      color: "purple",
      stats: `${stats.contacts.total} contacts`,
      badge: stats.contacts.new > 0 ? `${stats.contacts.new} nouveaux` : null,
    },
    {
      name: "Emplois",
      href: "/admin/jobs",
      icon: Briefcase,
      color: "blue",
      stats: `${stats.jobs.total} offres`,
      badge: `${stats.jobs.applications} candidatures`,
    },
    {
      name: "Événements",
      href: "/admin/events",
      icon: Calendar,
      color: "green",
      stats: "Gérer les événements",
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
      color: "orange",
      stats: `${stats.blog.categories} catégories`,
    },
    {
      name: "Médias",
      href: "/admin/media",
      icon: Image,
      color: "pink",
      stats: `${stats.media.total} fichiers`,
    },
    {
      name: "Témoignages",
      href: "/admin/testimonials",
      icon: Video,
      color: "indigo",
      stats: `${stats.testimonials.total} vidéos`,
      badge: `${stats.testimonials.active} actifs`,
    },
    {
      name: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      color: "teal",
      stats: `${stats.newsletter.total} abonnés`,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "red",
      stats: "Statistiques du site",
    },
  ];

  const colorClasses: Record<string, any> = {
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
      hover: "hover:border-purple-400 hover:bg-purple-50",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
      hover: "hover:border-blue-400 hover:bg-blue-50",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200",
      hover: "hover:border-green-400 hover:bg-green-50",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-200",
      hover: "hover:border-orange-400 hover:bg-orange-50",
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-600",
      border: "border-pink-200",
      hover: "hover:border-pink-400 hover:bg-pink-50",
    },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      border: "border-indigo-200",
      hover: "hover:border-indigo-400 hover:bg-indigo-50",
    },
    teal: {
      bg: "bg-teal-100",
      text: "text-teal-600",
      border: "border-teal-200",
      hover: "hover:border-teal-400 hover:bg-teal-50",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      border: "border-red-200",
      hover: "hover:border-red-400 hover:bg-red-50",
    },
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <LayoutDashboard className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Tableau de Bord Admin</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            Bienvenue dans le panneau d'administration. Gérez tous les aspects de votre plateforme Forum Génie Entreprise.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24"></div>
      </div>

      {/* Stats Overview */}
      {isLoading ? (
        <div className="bg-white rounded-xl border shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Chargement des statistiques...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.contacts.total}</div>
              <div className="text-blue-100">Messages de contact</div>
              {stats.contacts.new > 0 && (
                <div className="mt-2 text-sm font-medium bg-white/20 rounded-full px-3 py-1 inline-block">
                  +{stats.contacts.new} nouveaux
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Briefcase className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.jobs.total}</div>
              <div className="text-purple-100">Offres d'emploi</div>
              <div className="mt-2 text-sm font-medium bg-white/20 rounded-full px-3 py-1 inline-block">
                {stats.jobs.applications} candidatures
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.newsletter.total}</div>
              <div className="text-green-100">Abonnés newsletter</div>
              <div className="mt-2 text-sm font-medium bg-white/20 rounded-full px-3 py-1 inline-block">
                {stats.newsletter.active} actifs
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Image className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.media.total}</div>
              <div className="text-orange-100">Médias</div>
            </div>
          </div>

          {/* Quick Access Links */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              Accès Rapide
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                const colors = colorClasses[link.color];
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative p-5 border-2 ${colors.border} rounded-xl ${colors.hover} transition-all duration-200`}
                  >
                    <div className={`inline-flex p-3 ${colors.bg} rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center justify-between">
                      {link.name}
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{link.stats}</p>
                    {link.badge && (
                      <span className={`text-xs font-medium ${colors.bg} ${colors.text} rounded-full px-2 py-1`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
