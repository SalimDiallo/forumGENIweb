import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";
import { getCachedDashboardStats } from "@/lib/cache";

// Revalidation toutes les 5 minutes pour ISR
export const revalidate = 300;

export default async function AdminDashboard() {
  // Utiliser le cache unifié pour toutes les stats
  const dashboardStats = await getCachedDashboardStats();

  const stats = {
    contacts: {
      total: dashboardStats.contacts.total,
      new: dashboardStats.contacts.new,
    },
    jobs: {
      total: dashboardStats.jobs.total,
    },
    blog: {
      categories: dashboardStats.blog.categories,
    },
    events: {
      total: dashboardStats.events.total,
      upcoming: dashboardStats.events.upcoming,
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
      badge: null,
    },
    {
      name: "Événements",
      href: "/admin/events",
      icon: Calendar,
      stats: `${stats.events.upcoming} à venir`,
      badge: `${stats.events.total} total`,
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
      stats: `${stats.blog.categories} catégories`,
      badge: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <LayoutDashboard className="w-8 h-8 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de Bord Admin
          </h1>
        </div>
        <p className="text-gray-600 text-base max-w-2xl">
          Bienvenue dans le panneau d&apos;administration. Gérez tous les aspects de votre plateforme Forum Génie Entreprise.
        </p>
      </div>

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
            <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 inline-block rounded">
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
          <div className="text-sm text-gray-600 mb-2">Offres d&apos;emploi</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.events.total}</div>
          <div className="text-sm text-gray-600 mb-2">Événements</div>
          {stats.events.upcoming > 0 && (
            <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 inline-block rounded">
              {stats.events.upcoming} à venir
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.blog.posts}</div>
          <div className="text-sm text-gray-600 mb-2">Articles de blog</div>
          <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 inline-block rounded">
            {stats.blog.categories} catégories
          </div>
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
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 border border-gray-200 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
