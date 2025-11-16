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
  ArrowRight,
} from "lucide-react";
import { listContacts } from "./crm/actions";
import { getJobsWithApplicationCount } from "./jobs/actions";
import { listCategories } from "./blog/actions";

export default function AdminDashboard() {
  const contacts = useAction(listContacts);
  const jobs = useAction(getJobsWithApplicationCount);
  const categories = useAction(listCategories);

  useEffect(() => {
    // Load all stats on mount
    contacts.execute();
    jobs.execute({});
    categories.execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading =
    contacts.status === "executing" ||
    jobs.status === "executing";

  // Calculate stats
  const stats = {
    contacts: {
      total: contacts.result?.data?.messages?.length || 0,
      new:
        contacts.result?.data?.messages?.filter(
          (m: any) => m.status === "new"
        ).length || 0,
    },
    jobs: {
      total: jobs.result?.data?.jobs?.length || 0,
      applications:
        jobs.result?.data?.jobs?.reduce(
          (acc: number, j: any) => acc + (j._count?.applications || 0),
          0
        ) || 0,
    },
    blog: {
      categories: categories.result?.data?.categories?.length || 0,
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

      {/* Stats Overview */}
      {isLoading ? (
        <div className="bg-white  border shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin  h-12 w-12 border-b-2 border-gray-900"></div>
            <span className="ml-4 text-gray-600">
              Chargement des statistiques...
            </span>
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
                <div className="text-xs font-medium text-gray-700 bg-gray-100  px-2 py-1 inline-block">
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
              <div className="text-xs font-medium text-gray-700 bg-gray-100  px-2 py-1 inline-block">
                {stats.jobs.applications} candidatures
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">-</div>
              <div className="text-sm text-gray-600 mb-2">Événements</div>
              <div className="text-xs font-medium text-gray-700 bg-gray-100  px-2 py-1 inline-block">
                Gérer les événements
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.blog.categories}</div>
              <div className="text-sm text-gray-600 mb-2">Catégories du blog</div>
              <div className="text-xs font-medium text-gray-700 bg-gray-100  px-2 py-1 inline-block">
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
                      <span className="text-xs font-medium bg-gray-100 text-gray-700  px-2 py-1 border border-gray-200">
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
