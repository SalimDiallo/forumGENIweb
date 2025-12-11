"use client"
import { ReactNode, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  Mail,
  BarChart3,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  UserCog,
  Key,
  Tag,
  Folder,
  PenLine,
  Home,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { getRoleDisplayName, getRoleBadgeClasses, type UserRole } from "@/lib/permissions";
import { toast } from "sonner";
import ChangePasswordModal from "./profile/ChangePasswordModal";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  children?: Array<{ href: string; label: string; icon?: any }>;
  superAdminOnly?: boolean; // Nouveau: indique si l'item est réservé aux super admins
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    href: "/admin/crm",
    label: "CRM",
    icon: Users,
    children: [
      { href: "/admin/crm", label: "Accueil", icon: Home },
      { href: "/admin/crm/contacts", label: "Contacts", icon: Mail },
    ]
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
    children: [
      { href: "/admin/blog", label: "Tableau de bord", icon: BarChart3 },
      { href: "/admin/blog/posts", label: "Articles", icon: PenLine },
      { href: "/admin/blog/categories", label: "Catégories", icon: Folder },
      { href: "/admin/blog/tags", label: "Tags", icon: Tag },
    ]
  },
  {
    href: "/admin/events",
    label: "Événements",
    icon: Calendar
  },
  {
    href: "/admin/jobs",
    label: "Emplois",
    icon: Briefcase
  },
  {
    href: "/admin/gallery",
    label: "Galerie",
    icon: ImageIcon
  },
  {
    href: "/admin/testimonials",
    label: "Témoignages",
    icon: Video
  },
  {
    href: "/admin/users",
    label: "Utilisateurs",
    icon: UserCog,
    superAdminOnly: true, // Visible uniquement pour les super admins
  },
];

function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  const toggleDropdown = (href: string) => {
    setOpenDropdown(openDropdown === href ? null : href);
  };

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  }, [router]);

  // Éviter les erreurs d'hydratation en s'assurant que le composant est monté
  useEffect(() => {
    setMounted(true);
  }, []);

  // Déconnecter automatiquement si l'utilisateur est désactivé
  useEffect(() => {
    if (session?.user && !(session.user as any).isActive) {
      toast.error("Votre compte a été désactivé. Vous allez être déconnecté.");
      handleSignOut();
    }
  }, [session, handleSignOut]);

  // Filtrer les éléments de navigation en fonction du rôle
  const userRole = (session?.user as any)?.role as string | undefined;
  const isSuperAdmin = userRole === "super_admin";
  const isRevue = userRole === "revue";
  const isProspection = userRole === "prospection";

  const visibleNavItems = navItems.filter((item) => {
    // Super admin only items
    if (item.superAdminOnly) {
      return isSuperAdmin;
    }

    // Specialized role: revue - only sees Dashboard and Blog
    if (isRevue) {
      return item.href === "/admin" || item.href === "/admin/blog";
    }

    // Specialized role: prospection - only sees Dashboard, CRM and Jobs
    if (isProspection) {
      return item.href === "/admin" || item.href === "/admin/crm" || item.href === "/admin/jobs";
    }

    // Standard roles see all non-superAdminOnly items
    return true;
  });

  // Pendant l'hydratation, ne pas afficher les états interactifs
  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-gray-900" />
              <span className="text-lg font-bold text-gray-900">Admin Panel</span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {pathname !== "/admin" && (
                <button
                  onClick={() => router.back()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Retour"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <Link href="/admin" className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-gray-900" />
                <span className="text-lg font-bold text-gray-900">Admin Panel</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={item.href} className="relative">
                    {hasChildren ? (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(item.href)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.href ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === item.href && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                              {item.children?.map((child) => {
                                const childActive = pathname === child.href ||
                                  (child.href !== "/admin/blog" && child.href !== "/admin/crm" && pathname?.startsWith(child.href));
                                const ChildIcon = child.icon;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setOpenDropdown(null)}
                                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${childActive
                                      ? "bg-emerald-50 text-emerald-700 font-medium border-l-2 border-emerald-500"
                                      : "text-gray-700 hover:bg-gray-50"
                                      }`}
                                  >
                                    {ChildIcon && <ChildIcon className="w-4 h-4" />}
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-4">
              {isPending ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium text-sm">
                        {(session.user as any).fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {(session.user as any).fullName}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">
                          {(session.user as any).role?.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              setChangePasswordModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Key className="w-4 h-4" />
                            Changer mon mot de passe
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            {/* User info in mobile menu */}
            {session?.user && (
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                    {(session.user as any).fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {(session.user as any).fullName}
                    </p>
                    <p className="text-xs text-gray-600">{session.user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setChangePasswordModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Changer mon mot de passe
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}

            <div className="px-4 py-2 space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={item.href}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.href)}
                          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.href ? 'rotate-180' : ''}`} />
                        </button>

                        {openDropdown === item.href && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.children?.map((child) => {
                              const childActive = pathname === child.href ||
                                (child.href !== "/admin/blog" && child.href !== "/admin/crm" && pathname?.startsWith(child.href));
                              const ChildIcon = child.icon;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${childActive
                                    ? "bg-emerald-50 text-emerald-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                  {ChildIcon && <ChildIcon className="w-4 h-4" />}
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </>
  );
}
import { SpecializedRouteGuard } from "@/components/admin/SpecializedRouteGuard";
import { SessionWatcher } from "@/components/admin/SessionWatcher";

export default function AdminLayout({ children }: { children: ReactNode }) {
  /**
   * Layout admin avec authentification Better Auth
   * - Protection des routes via middleware (voir /middleware.ts)
   * - RoleProvider pour l'accès au rôle dans toute l'application
   * - SpecializedRouteGuard pour rediriger les rôles spécialisés
   * - SessionWatcher pour déconnexion automatique si compte désactivé ou mot de passe changé
   * - Affichage des infos utilisateur et déconnexion
   * - Navigation responsive avec menu mobile
   */
  return (
    <RoleProvider>
      {/* Session validity watcher - auto-logout if account deactivated or password reset */}
      {/* Checks every 10 seconds for account status changes */}
      <SessionWatcher checkInterval={10000} />

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Background watermark logo - top left with animation */}
        <div className="fixed top-20 left-0 pointer-events-none z-0 opacity-[0.02] animate-pulse">
          <NextImage
            src="/logo.svg"
            alt=""
            width={500}
            height={190}
            className="select-none -rotate-12"
          />
        </div>

        {/* Background watermark logo - bottom right */}
        <div className="fixed bottom-0 right-0 pointer-events-none z-0 opacity-[0.03]">
          <NextImage
            src="/logo.svg"
            alt=""
            width={600}
            height={225}
            className="select-none"
          />
        </div>

        <AdminNav />
        <main className="p-6 relative z-10">
          <SpecializedRouteGuard>
            {children}
          </SpecializedRouteGuard>
        </main>
      </div>
    </RoleProvider>
  );
}

