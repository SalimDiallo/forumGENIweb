import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { getCachedDashboardStats } from "@/lib/cache";
import { DashboardSections, DashboardQuickActions } from "@/components/admin/DashboardWidgets";

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

      {/* Stats Grid - Client component with role filtering */}
      <DashboardSections stats={stats} />

      {/* Quick Actions - Client component with role filtering */}
      <DashboardQuickActions />

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


