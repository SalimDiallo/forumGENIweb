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
  FileText,
  Image,
  Video,
  Mail,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { listContacts } from "./crm/actions";
import { getJobsWithApplicationCount } from "./jobs/actions";
import { listCategories } from "./blog/actions";
import { listMedia } from "./media/actions";
import { listTestimonials } from "./testimonials/actions";
import { listSubscriptions } from "./newsletter/actions";

export default function AdminDashboard() {
  const contacts = useAction(listContacts);
  const jobs = useAction(getJobsWithApplicationCount);
  const categories = useAction(listCategories);
  const media = useAction(listMedia);
  const testimonials = useAction(listTestimonials);
  const subscriptions = useAction(listSubscriptions);

  useEffect(() => {
    // Load all stats on mount
    contacts.execute();
    jobs.execute({});
    categories.execute();
    media.execute({});
    testimonials.execute({});
    subscriptions.execute();
  }, []);

  const isLoading =
    contacts.status === "executing" ||
    jobs.status === "executing";

  // Calculate stats
  const stats = {
    contacts: {
      total: contacts.result?.data?.messages?.length || 0,
      new: contacts.result?.data?.messages?.filter((m: any) => m.status === "new").length || 0,
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
      stats: `${stats.contacts.total} contacts`,
      badge: stats.contacts.new > 0 ? `${stats.contacts.new} nouveaux` : null,
    },
    {
      name: "Emplois",
      href: "/admin/jobs",
      icon: Briefcase,
      stats: `${stats.jobs.total} offres`,
      badge: `${stats.jobs.applications} candidatures`,
    },
    {
      name: "Événements",
      href: "/admin/events",
      icon: Calendar,
      stats: "Gérer les événements",
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
      stats: `${stats.blog.categories} catégories`,
    },
    {
      name: "Médias",
      href: "/admin/media",
      icon: Image,
      stats: `${stats.media.total} fichiers`,
    },
    {
      name: "Témoignages",
      href: "/admin/testimonials",
      icon: Video,
      stats: `${stats.testimonials.total} vidéos`,
      badge: `${stats.testimonials.active} actifs`,
    },
    {
      name: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      stats: `${stats.newsletter.total} abonnés`,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      stats: "Statistiques du site",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <LayoutDashboard className="w-8 h-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
        </div>
        <p className="text-gray-600 text-base max-w-2xl">
          Bienvenue dans le panneau d'administration. Gérez tous les aspects de votre plateforme Forum Génie Entreprise.
        </p>
      </div>

      {/* Stats Overview */}
      {isLoading ? (
        <div className="bg-white rounded-xl border shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <span className="ml-4 text-gray-600">Chargement des statistiques...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.contacts.total}</div>
              <div className="text-sm text-gray-600 mb-2">Messages de contact</div>
              {stats.contacts.new > 0 && (
                <div className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2 py-1 inline-block">
                  +{stats.contacts.new} nouveaux
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.jobs.total}</div>
              <div className="text-sm text-gray-600 mb-2">Offres d'emploi</div>
              <div className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2 py-1 inline-block">
                {stats.jobs.applications} candidatures
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.newsletter.total}</div>
              <div className="text-sm text-gray-600 mb-2">Abonnés newsletter</div>
              <div className="text-xs font-medium text-gray-700 bg-gray-100 rounded-full px-2 py-1 inline-block">
                {stats.newsletter.active} actifs
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Image className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.media.total}</div>
              <div className="text-sm text-gray-600">Médias</div>
            </div>
          </div>

          {/* Quick Access Links */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-gray-900" />
              Accès Rapide
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative p-5 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="inline-flex p-2 bg-gray-100 rounded-lg mb-3 group-hover:bg-gray-200 transition-colors">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1 flex items-center justify-between">
                      {link.name}
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{link.stats}</p>
                    {link.badge && (
                      <span className="text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-1 border border-gray-200">
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
