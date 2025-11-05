"use client"
import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Image,
  Video,
  Mail,
  BarChart3,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  children?: Array<{ href: string; label: string }>;
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
      { href: "/admin/crm/contacts", label: "Contacts" },
      { href: "/admin/crm/partnerships", label: "Partenariats" },
    ]
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
    children: [
      { href: "/admin/blog/posts", label: "Articles" },
      { href: "/admin/blog/categories", label: "Catégories" },
      { href: "/admin/blog/tags", label: "Tags" },
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
    href: "/admin/media",
    label: "Médias",
    icon: Image
  },
  {
    href: "/admin/testimonials",
    label: "Témoignages",
    icon: Video
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    icon: Mail
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3
  },
];

function AdminNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  const toggleDropdown = (href: string) => {
    setOpenDropdown(openDropdown === href ? null : href);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-gray-900" />
              <span className="text-lg font-bold text-gray-900">Admin Panel</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={item.href} className="relative">
                    {hasChildren ? (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(item.href)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            active
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
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              {item.children?.map((child) => {
                                const childActive = pathname?.startsWith(child.href);
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setOpenDropdown(null)}
                                    className={`block px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                      childActive
                                        ? "bg-gray-100 text-gray-900 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          active
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
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div key={item.href}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.href)}
                          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            active
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
                              const childActive = pathname?.startsWith(child.href);
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                  className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                                    childActive
                                      ? "bg-gray-100 text-gray-900 font-medium"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          active
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
    </>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Vérifie si on est en production
  if (process.env.NODE_ENV === "production") {
    // En production, on ne rentre pas dans le layout (rien n'est rendu)
    return null;
  }

  // En développement, on affiche le layout admin avec navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="p-6">{children}</main>
    </div>
  );
}
