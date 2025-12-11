import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Video,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getCachedDashboardStats } from "@/lib/cache";

// Revalidation toutes les 5 minutes pour ISR
export const revalidate = 300;

export default async function AdminDashboard() {
  const dashboardStats = await getCachedDashboardStats();

  const stats = {
    contacts: { total: dashboardStats.contacts.total, new: dashboardStats.contacts.new },
    jobs: { total: dashboardStats.jobs.total },
    blog: { posts: dashboardStats.blog.posts, categories: dashboardStats.blog.categories },
    events: { total: dashboardStats.events.total, upcoming: dashboardStats.events.upcoming },
  };

  const sections = [
    {
      name: "CRM",
      href: "/admin/crm",
      icon: Users,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      value: stats.contacts.total,
      label: "contacts",
      badge: stats.contacts.new > 0 ? `+${stats.contacts.new} nouveaux` : null,
    },
    {
      name: "Emplois",
      href: "/admin/jobs",
      icon: Briefcase,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
      value: stats.jobs.total,
      label: "offres",
      badge: null,
    },
    {
      name: "Événements",
      href: "/admin/events",
      icon: Calendar,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      value: stats.events.total,
      label: "événements",
      badge: stats.events.upcoming > 0 ? `${stats.events.upcoming} à venir` : null,
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      value: stats.blog.posts,
      label: "articles",
      badge: `${stats.blog.categories} catégories`,
    },
    {
      name: "Galerie",
      href: "/admin/gallery",
      icon: ImageIcon,
      color: "bg-pink-500",
      lightColor: "bg-pink-50",
      textColor: "text-pink-600",
      value: null,
      label: "Médias",
      badge: null,
    },
    {
      name: "Témoignages",
      href: "/admin/testimonials",
      icon: Video,
      color: "bg-cyan-500",
      lightColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      value: null,
      label: "Vidéos",
      badge: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm">Bienvenue sur Forum Génie Entreprise</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Mis à jour automatiquement</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className={`w-10 h-10 ${section.lightColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${section.textColor}`} />
              </div>
              {section.value !== null ? (
                <p className="text-2xl font-bold text-gray-900">{section.value}</p>
              ) : (
                <p className="text-lg font-semibold text-gray-900">{section.name}</p>
              )}
              <p className="text-sm text-gray-500">{section.label}</p>
              {section.badge && (
                <span className={`mt-2 inline-block text-xs font-medium ${section.lightColor} ${section.textColor} px-2 py-0.5 rounded-full`}>
                  {section.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/blog/posts/create"
          className="group flex items-center gap-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-5 hover:from-emerald-600 hover:to-emerald-700 transition-all"
        >
          <div className="p-3 bg-white/20 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Nouvel article</p>
            <p className="text-sm text-emerald-100">Créer un article de blog</p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/events/event/create"
          className="group flex items-center gap-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-5 hover:from-purple-600 hover:to-purple-700 transition-all"
        >
          <div className="p-3 bg-white/20 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Nouvel événement</p>
            <p className="text-sm text-purple-100">Planifier un événement</p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/jobs/create"
          className="group flex items-center gap-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-5 hover:from-amber-600 hover:to-amber-700 transition-all"
        >
          <div className="p-3 bg-white/20 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Nouvelle offre</p>
            <p className="text-sm text-amber-100">Publier une offre d&apos;emploi</p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/crm/contacts"
          className="group flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <div className="p-3 bg-white/20 rounded-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Messages</p>
            <p className="text-sm text-blue-100">Voir les contacts</p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Logo Footer */}
      <div className="flex items-center justify-center py-12 opacity-10">
        <Image
          src="/logo.svg"
          alt="Forum Génie Entreprise"
          width={400}
          height={150}
          className="grayscale"
        />
      </div>
    </div>
  );
}
